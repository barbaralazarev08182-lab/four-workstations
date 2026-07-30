"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { CurrentStatusRow, OfficeMemberRow, ProfileRow } from "@/lib/supabase/database.types";
import { currentStatusToActivity, currentStatusToUser } from "@/lib/supabase/status-mapper";
import type { ActivityItem, MoodKey, OfficeUser, StatusKey } from "@/lib/types";
import { isDeskKey } from "@/lib/office/desk-slots";

export type OfficeDataMode = "local" | "connecting" | "realtime" | "reconnecting" | "signedOut" | "noOffice" | "error";

export interface RemoteOfficeSnapshot {
  officeId: string;
  currentUserId: string;
  users: OfficeUser[];
  activities: ActivityItem[];
}

interface UseCurrentStatusSyncOptions {
  onSnapshot: (snapshot: RemoteOfficeSnapshot) => void;
  onStatus: (status: CurrentStatusRow) => void;
  onError: (message: string) => void;
  onMembershipRemoved?: () => void;
}

const DESK_ORDER = new Map<string, number>([
  ["desk_1", 0],
  ["desk_2", 1],
  ["desk_3", 2],
  ["desk_4", 3],
]);

function fallbackProfile(userId: string): ProfileRow {
  return {
    id: userId,
    nickname: "新朋友",
    avatar_key: "ming",
    accent_color: "sage",
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

function isNewerStatus(row: CurrentStatusRow, latestByUser: Map<string, number>) {
  const timestamp = Date.parse(row.updated_at);
  if (!Number.isFinite(timestamp)) return false;
  const latest = latestByUser.get(row.user_id) ?? 0;
  if (timestamp <= latest) return false;
  latestByUser.set(row.user_id, timestamp);
  return true;
}

export function useCurrentStatusSync({ onSnapshot, onStatus, onError, onMembershipRemoved }: UseCurrentStatusSyncOptions) {
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<OfficeDataMode>(configured ? "connecting" : "local");
  const [officeId, setOfficeId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const callbacksRef = useRef({ onSnapshot, onStatus, onError });
  const activeChannelRef = useRef<RealtimeChannel | null>(null);
  const identityRef = useRef<{ officeId: string; currentUserId: string } | null>(null);
  const latestByUserRef = useRef(new Map<string, number>());
  const generationRef = useRef(0);
  const membershipRemovedRef = useRef(onMembershipRemoved);

  useEffect(() => {
    callbacksRef.current = { onSnapshot, onStatus, onError };
    membershipRemovedRef.current = onMembershipRemoved;
  }, [onError, onMembershipRemoved, onSnapshot, onStatus]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let disposed = false;
    let snapshotTimer: number | null = null;
    const cleanupChannel = async () => {
      const channel = activeChannelRef.current;
      activeChannelRef.current = null;
      if (channel) await supabase.removeChannel(channel);
    };

    const loadSnapshot = async (targetOfficeId: string, targetUserId: string, generation: number) => {
      const { data: memberRows, error: membersError } = await supabase
        .from("office_members")
        .select("office_id,user_id,desk_key,role,joined_at")
        .eq("office_id", targetOfficeId);
      if (membersError) throw membersError;
      if (disposed || generation !== generationRef.current) return;

      const members = ((memberRows ?? []) as OfficeMemberRow[]).filter((member) => {
        const valid = isDeskKey(member.desk_key);
        if (!valid && process.env.NODE_ENV !== "production") {
          console.warn("[OfficeSync] Ignoring member with invalid desk_key", { userId: member.user_id, deskKey: member.desk_key });
        }
        return valid;
      });
      const userIds = members.map((member) => member.user_id);
      const [profilesResult, statusesResult] = await Promise.all([
        userIds.length
          ? supabase.from("profiles").select("id,nickname,avatar_key,accent_color,created_at,updated_at").in("id", userIds)
          : Promise.resolve({ data: [] as ProfileRow[], error: null }),
        supabase.from("current_status").select("office_id,user_id,status,message,mood,started_at,updated_at").eq("office_id", targetOfficeId),
      ]);
      if (profilesResult.error) throw profilesResult.error;
      if (statusesResult.error) throw statusesResult.error;
      if (disposed || generation !== generationRef.current) return;

      const profiles = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile as ProfileRow]));
      const statuses = (statusesResult.data ?? []) as CurrentStatusRow[];
      const statusesByUser = new Map(statuses.map((status) => [status.user_id, status]));
      latestByUserRef.current.clear();
      statuses.forEach((status) => {
        const timestamp = Date.parse(status.updated_at);
        if (Number.isFinite(timestamp)) latestByUserRef.current.set(status.user_id, timestamp);
      });

      const occupiedUsers = members
        .toSorted((left, right) => (DESK_ORDER.get(left.desk_key) ?? 99) - (DESK_ORDER.get(right.desk_key) ?? 99))
        .map((member) => currentStatusToUser(
          member,
          profiles.get(member.user_id) ?? fallbackProfile(member.user_id),
          statusesByUser.get(member.user_id),
          targetUserId,
        ));
      const users = occupiedUsers;
      const activities = statuses
        .toSorted((left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at))
        .map(currentStatusToActivity)
        .filter((activity): activity is ActivityItem => activity !== null);

      callbacksRef.current.onSnapshot({ officeId: targetOfficeId, currentUserId: targetUserId, users, activities });
    };

    const start = async () => {
      const generation = ++generationRef.current;
      setMode("connecting");
      await cleanupChannel();

      const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionResult.session) {
        identityRef.current = null;
        setOfficeId(null);
        setCurrentUserId(null);
        setMode("signedOut");
        return;
      }

      const { data: userResult, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const user = userResult.user;
      if (!user) {
        identityRef.current = null;
        setOfficeId(null);
        setCurrentUserId(null);
        setMode("signedOut");
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("office_members")
        .select("office_id,user_id,desk_key,role,joined_at")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (membershipError) throw membershipError;
      if (!membership) {
        identityRef.current = null;
        setOfficeId(null);
        setCurrentUserId(user.id);
        setMode("noOffice");
        return;
      }
      if (disposed || generation !== generationRef.current) return;

      const targetOfficeId = membership.office_id;
      identityRef.current = { officeId: targetOfficeId, currentUserId: user.id };
      setOfficeId(targetOfficeId);
      setCurrentUserId(user.id);

      const channel = supabase
        .channel(`current-status:${targetOfficeId}:${crypto.randomUUID()}`)
        .on<CurrentStatusRow>(
          "postgres_changes",
          { event: "*", schema: "public", table: "current_status", filter: `office_id=eq.${targetOfficeId}` },
          (payload: RealtimePostgresChangesPayload<CurrentStatusRow>) => {
            const row = payload.new as CurrentStatusRow;
            if (!row?.user_id || row.office_id !== targetOfficeId) return;
            if (!isNewerStatus(row, latestByUserRef.current)) return;
            if (payload.eventType === "INSERT") {
              if (snapshotTimer) window.clearTimeout(snapshotTimer);
              snapshotTimer = window.setTimeout(() => {
                void loadSnapshot(targetOfficeId, user.id, generation).catch((error: unknown) => {
                  callbacksRef.current.onError(error instanceof Error ? error.message : "新成员状态加载失败");
                });
              }, 40);
              return;
            }
            callbacksRef.current.onStatus(row);
          },
        )
        .on<OfficeMemberRow>(
          "postgres_changes",
          { event: "*", schema: "public", table: "office_members", filter: `office_id=eq.${targetOfficeId}` },
          (payload: RealtimePostgresChangesPayload<OfficeMemberRow>) => {
            const removed = payload.old as Partial<OfficeMemberRow>;
            if (payload.eventType === "DELETE" && removed.user_id === user.id) {
              identityRef.current = null;
              setOfficeId(null);
              setMode("noOffice");
              membershipRemovedRef.current?.();
              return;
            }
            if (snapshotTimer) window.clearTimeout(snapshotTimer);
            snapshotTimer = window.setTimeout(() => {
              void loadSnapshot(targetOfficeId, user.id, generation).catch((error: unknown) => {
                callbacksRef.current.onError(error instanceof Error ? error.message : "成员列表加载失败");
              });
            }, 40);
          },
        )
        .subscribe((status) => {
          if (disposed || generation !== generationRef.current) return;
          if (status === "SUBSCRIBED") {
            setMode("realtime");
            void loadSnapshot(targetOfficeId, user.id, generation).catch((error: unknown) => {
              callbacksRef.current.onError(error instanceof Error ? error.message : "状态快照加载失败");
            });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setMode("reconnecting");
          }
        });
      activeChannelRef.current = channel;
    };

    const restart = () => {
      void start().catch((error: unknown) => {
        if (disposed) return;
        setMode("error");
        callbacksRef.current.onError(error instanceof Error ? error.message : "Supabase 同步失败");
      });
    };

    const handleOnline = () => {
      setMode("reconnecting");
      supabase.realtime.connect();
      const identity = identityRef.current;
      if (identity) {
        void loadSnapshot(identity.officeId, identity.currentUserId, generationRef.current).catch((error: unknown) => {
          callbacksRef.current.onError(error instanceof Error ? error.message : "重连后状态恢复失败");
        });
      }
    };

    window.addEventListener("online", handleOnline);
    const { data: authSubscription } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(restart, 0);
    });
    restart();

    return () => {
      disposed = true;
      generationRef.current += 1;
      window.removeEventListener("online", handleOnline);
      if (snapshotTimer) window.clearTimeout(snapshotTimer);
      authSubscription.subscription.unsubscribe();
      void cleanupChannel();
    };
  }, []);

  const submitStatus = useCallback(async (status: StatusKey, message: string, mood: MoodKey) => {
    const supabase = getSupabaseBrowserClient();
    const identity = identityRef.current;
    if (!supabase || !identity) return false;

    const { data, error } = await supabase.rpc("set_current_status", {
      p_office_id: identity.officeId,
      p_status: status,
      p_message: message.slice(0, 60),
      p_mood: mood,
    });
    if (error) {
      callbacksRef.current.onError(error.message);
      return false;
    }

    const row = data?.[0];
    if (row && isNewerStatus(row, latestByUserRef.current)) callbacksRef.current.onStatus(row);
    return true;
  }, []);

  return { configured, mode, officeId, currentUserId, submitStatus };
}
