"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { OfficeMemberRow } from "@/lib/supabase/database.types";

export type OfficeMembershipStage = "checking" | "none" | "joined" | "error";

export interface OfficeMembership {
  officeId: string;
  deskKey: string;
  role: string;
}

export function officeAccessErrorMessage(error: { message?: string; code?: string }) {
  const message = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  if (message.includes("authentication_required") || message.includes("jwt") || message.includes("session")) return "登录状态已失效，请重新登录";
  if (message.includes("already_in_office") || message.includes("office_members_user_id_unique")) return "你已经加入了一个办公室";
  if (message.includes("invalid_office_name")) return "办公室名称需要是 2 至 30 个字符";
  if (message.includes("invalid_invite_code")) return "邀请码无效，请检查后重试";
  if (message.includes("office_is_full")) return "这个办公室已经满员了";
  if (message.includes("desk_is_taken") || message.includes("office_members_office_id_desk_key_key")) return "这个工位刚刚被其他人占用了，请选择另一个";
  if (message.includes("invalid_desk_key")) return "请选择一个可用工位";
  if (message.includes("permission") || message.includes("42501")) return "当前账号没有执行此操作的权限";
  if (message.includes("fetch") || message.includes("network")) return "数据库暂时不可用，请稍后重试";
  return "数据库暂时不可用，请稍后重试";
}

export function useOfficeMembership(userId: string) {
  const [stage, setStage] = useState<OfficeMembershipStage>("checking");
  const [membership, setMembership] = useState<OfficeMembership | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const generationRef = useRef(0);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const generation = ++generationRef.current;
    setStage("checking");
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("office_members")
      .select("office_id,user_id,desk_key,role,joined_at")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (generation !== generationRef.current) return;
    if (error) {
      setErrorMessage(officeAccessErrorMessage(error));
      setStage("error");
      return;
    }
    if (!data) {
      setMembership(null);
      setStage("none");
      return;
    }

    const row = data as OfficeMemberRow;
    setMembership({ officeId: row.office_id, deskKey: row.desk_key, role: row.role });
    setStage("joined");
  }, [userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => {
      window.clearTimeout(timer);
      generationRef.current += 1;
    };
  }, [refresh]);

  const acceptMembership = useCallback((next: OfficeMembership) => {
    generationRef.current += 1;
    setMembership(next);
    setErrorMessage(null);
    setStage("joined");
  }, []);

  return { stage, membership, errorMessage, refresh, acceptMembership };
}
