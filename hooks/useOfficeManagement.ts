"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { OfficeMemberRow } from "@/lib/supabase/database.types";

export interface MyOfficeInfo {
  officeId: string;
  officeName: string;
  inviteCode: string;
  ownerId: string;
  currentUserRole: "owner" | "member";
  currentUserDeskKey: string;
  memberCount: number;
}

export type OfficeManagementAction = "leave" | "delete" | "transfer";

function managementErrorMessage(error: { message?: string; code?: string }) {
  const message = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  if (message.includes("ownership_transfer_required")) return "请先将房主转让给其他成员";
  if (message.includes("owner_must_delete_office")) return "房主需要使用“解散房间”操作";
  if (message.includes("owner_permission_required") || message.includes("owner_membership_required")) return "只有当前房主可以执行此操作";
  if (message.includes("new_owner_not_in_office")) return "新房主必须是当前房间成员";
  if (message.includes("invalid_new_owner")) return "请选择另一位成员作为新房主";
  if (message.includes("not_an_office_member")) return "你当前不属于任何共享工位";
  if (message.includes("authentication_required") || message.includes("jwt")) return "登录状态已失效，请重新登录";
  if (message.includes("permission") || message.includes("42501")) return "当前账号没有执行此操作的权限";
  if (message.includes("fetch") || message.includes("network")) return "网络暂时不可用，请稍后重试";
  return "操作没有完成，请稍后重试";
}

function mapOfficeInfo(row: {
  office_id: string;
  office_name: string;
  invite_code: string;
  owner_id: string;
  current_user_role: string;
  current_user_desk_key: string;
  member_count: number;
}): MyOfficeInfo {
  return {
    officeId: row.office_id,
    officeName: row.office_name,
    inviteCode: row.invite_code,
    ownerId: row.owner_id,
    currentUserRole: row.current_user_role === "owner" ? "owner" : "member",
    currentUserDeskKey: row.current_user_desk_key,
    memberCount: Number(row.member_count) || 0,
  };
}

export function useOfficeManagement({ officeId, currentUserId, enabled, onMembershipEnded }: {
  officeId: string | null;
  currentUserId: string | null;
  enabled: boolean;
  onMembershipEnded?: () => void | Promise<void>;
}) {
  const [info, setInfo] = useState<MyOfficeInfo | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [busyAction, setBusyAction] = useState<OfficeManagementAction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const endedCallbackRef = useRef(onMembershipEnded);
  const busyRef = useRef(false);

  useEffect(() => { endedCallbackRef.current = onMembershipEnded; }, [onMembershipEnded]);

  const refresh = useCallback(async () => {
    if (!enabled) return null;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;
    setLoading(true);
    setErrorMessage(null);
    const { data, error } = await supabase.rpc("get_my_office_info", {});
    if (error) {
      const message = managementErrorMessage(error);
      setErrorMessage(message);
      setLoading(false);
      return null;
    }
    const row = data?.[0];
    const next = row ? mapOfficeInfo(row) : null;
    setInfo(next);
    setLoading(false);
    return next;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !officeId || !currentUserId) {
      const resetTimer = window.setTimeout(() => {
        setInfo(null);
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let disposed = false;
    const initialTimer = window.setTimeout(() => { if (!disposed) void refresh(); }, 0);
    const channel = supabase
      .channel(`office-membership-management:${officeId}:${crypto.randomUUID()}`)
      .on<OfficeMemberRow>(
        "postgres_changes",
        { event: "*", schema: "public", table: "office_members", filter: `office_id=eq.${officeId}` },
        (payload: RealtimePostgresChangesPayload<OfficeMemberRow>) => {
          const deleted = payload.old as Partial<OfficeMemberRow>;
          if (payload.eventType === "DELETE" && deleted.user_id === currentUserId) {
            setInfo(null);
            void endedCallbackRef.current?.();
            return;
          }
          void refresh();
        },
      )
      .subscribe();
    channelRef.current = channel;

    return () => {
      disposed = true;
      window.clearTimeout(initialTimer);
      if (channelRef.current === channel) channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, enabled, officeId, refresh]);

  const runAction = useCallback(async (action: OfficeManagementAction, newOwnerId?: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !enabled || busyRef.current) return { ok: false, error: "当前操作尚未就绪" };
    busyRef.current = true;
    setBusyAction(action);
    setErrorMessage(null);
    const result = action === "leave"
      ? await supabase.rpc("leave_office", {})
      : action === "delete"
        ? await supabase.rpc("delete_my_office", {})
        : await supabase.rpc("transfer_office_ownership", { p_new_owner_id: newOwnerId ?? "" });
    if (result.error) {
      const message = managementErrorMessage(result.error);
      setErrorMessage(message);
      busyRef.current = false;
      setBusyAction(null);
      return { ok: false, error: message };
    }
    if (action === "leave" || action === "delete") {
      setInfo(null);
      await endedCallbackRef.current?.();
    } else {
      await refresh();
    }
    busyRef.current = false;
    setBusyAction(null);
    return { ok: true, error: null };
  }, [enabled, refresh]);

  return {
    info,
    loading,
    busyAction,
    errorMessage,
    refresh,
    leaveOffice: () => runAction("leave"),
    deleteOffice: () => runAction("delete"),
    transferOwnership: (newOwnerId: string) => runAction("transfer", newOwnerId),
  };
}
