"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentStatusSync, type RemoteOfficeSnapshot } from "@/hooks/useCurrentStatusSync";
import { initialOfficeState } from "@/lib/mock-data";
import { ACTIVE_STATUSES, nowTime } from "@/lib/status";
import { currentStatusToActivity, isStatusKey } from "@/lib/supabase/status-mapper";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { CurrentStatusRow } from "@/lib/supabase/database.types";
import type { ActivityItem, MoodKey, OfficeState, StatusKey } from "@/lib/types";

const STORAGE_KEY = "four-workstations:office:v2";

function getAutomaticNightMode() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

function findGroupEvent(state: OfficeState) {
  const statuses = state.users.filter((user) => !user.isPlaceholder).map((user) => user.status);
  if (statuses.length === 0) return null;
  if (statuses.every((status) => status === "offWork")) return "今天也顺利活下来了";
  if (statuses.filter((status) => status === "slacking").length >= 3) return "当前摸鱼浓度过高";
  if (statuses.filter((status) => status === "eating").length >= 2) return "异地饭搭子集合成功";
  if (statuses.filter((status) => status === "overtime").length === 1 && statuses.filter((status) => status === "offWork").length === 3) {
    return "办公室最后一盏灯还亮着";
  }
  if (statuses.length === 4 && statuses.every((status) => ACTIVE_STATUSES.has(status))) return "今日工位已满员";
  return null;
}

export function useOfficeState({ onMembershipRemoved }: { onMembershipRemoved?: () => void } = {}) {
  const [state, setState] = useState<OfficeState>(() => isSupabaseConfigured()
    ? { version: 2, users: [], activities: [], isNight: false }
    : initialOfficeState);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const remoteSnapshotReceived = useRef(false);

  const applyRemoteSnapshot = useCallback((snapshot: RemoteOfficeSnapshot) => {
    remoteSnapshotReceived.current = true;
    setState((current) => ({
      version: 2,
      users: snapshot.users,
      activities: snapshot.activities.slice(0, 12),
      isNight: snapshot.users.some((user) => user.status === "overtime") || current.isNight,
    }));
    setHydrated(true);
  }, []);

  const applyRemoteStatus = useCallback((row: CurrentStatusRow) => {
    if (!isStatusKey(row.status)) return;
    const activity = currentStatusToActivity(row);
    setState((current) => {
      const userExists = current.users.some((user) => user.id === row.user_id);
      if (!userExists) return current;
      const activityExists = activity ? current.activities.some((item) => item.id === activity.id) : true;
      const next: OfficeState = {
        ...current,
        isNight: row.status === "overtime" ? true : current.isNight,
        users: current.users.map((user) => user.id === row.user_id ? {
          ...user,
          status: row.status as StatusKey,
          note: row.message,
          mood: row.mood as MoodKey,
          statusSince: row.started_at,
        } : user),
        activities: activity && !activityExists
          ? [activity, ...current.activities].slice(0, 12)
          : current.activities,
      };
      const event = findGroupEvent(next);
      if (event) window.setTimeout(() => setToast(event), 0);
      return next;
    });
  }, []);

  const handleSyncError = useCallback((message: string) => {
    setToast(`同步失败：${message}`);
  }, []);

  const sync = useCurrentStatusSync({
    onSnapshot: applyRemoteSnapshot,
    onStatus: applyRemoteStatus,
    onError: handleSyncError,
    onMembershipRemoved,
  });
  const { configured, officeId, currentUserId, mode, submitStatus } = sync;

  useEffect(() => {
    if (configured) return;
    let nextState: OfficeState = { ...initialOfficeState, isNight: getAutomaticNightMode() };
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OfficeState;
        if (parsed.version === 2) nextState = parsed;
      }
    } catch {
      nextState = { ...initialOfficeState, isNight: getAutomaticNightMode() };
    }
    const timer = window.setTimeout(() => {
      if (!remoteSnapshotReceived.current) setState(nextState);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [configured]);

  useEffect(() => {
    if (!hydrated || mode !== "local") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, mode, state]);

  const updateStatus = useCallback(async (userId: string, status: StatusKey, note: string, mood: MoodKey) => {
    if (configured) {
      if (mode !== "realtime" || userId !== currentUserId) {
        const message = mode === "signedOut" ? "请先登录后再更新状态" : mode === "noOffice" ? "请先创建或加入办公室" : "实时连接尚未就绪";
        setToast(message);
        return;
      }
      await submitStatus(status, note, mood);
      return;
    }

    const now = new Date().toISOString();
    setState((current) => {
      const nextActivity: ActivityItem = {
        id: `activity-${Date.now()}`,
        userId,
        status,
        note,
        time: nowTime(),
        reactions: [],
      };
      const next: OfficeState = {
        ...current,
        isNight: status === "overtime" ? true : current.isNight,
        users: current.users.map((user) => user.id === userId ? { ...user, status, note, mood, statusSince: now } : user),
        activities: [nextActivity, ...current.activities].slice(0, 12),
      };
      const event = findGroupEvent(next);
      if (event) window.setTimeout(() => setToast(event), 0);
      return next;
    });
  }, [configured, currentUserId, mode, submitStatus]);

  const reactToActivity = useCallback((activityId: string, reactionKey: ActivityItem["reactions"][number]["key"]) => {
    setState((current) => ({
      ...current,
      activities: current.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const exists = activity.reactions.some((reaction) => reaction.key === reactionKey);
        return {
          ...activity,
          reactions: exists
            ? activity.reactions.map((reaction) => reaction.key === reactionKey ? { ...reaction, count: reaction.count + 1 } : reaction)
            : [...activity.reactions, { key: reactionKey, count: 1 }],
        };
      }),
    }));
  }, []);

  const interactWithUser = useCallback((userId: string, interaction: string) => {
    setState((current) => {
      const userActivity = current.activities.find((item) => item.userId === userId);
      if (!userActivity) return current;
      return {
        ...current,
        activities: current.activities.map((item) => item.id === userActivity.id ? { ...item, recentInteraction: interaction } : item),
      };
    });
    setToast(interaction);
  }, []);

  const toggleNight = useCallback(() => setState((current) => ({ ...current, isNight: !current.isNight })), []);

  return {
    state,
    hydrated,
    toast,
    setToast,
    updateStatus,
    reactToActivity,
    interactWithUser,
    toggleNight,
    dataMode: mode,
    officeId,
    currentUserId,
  };
}
