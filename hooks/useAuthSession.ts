"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/database.types";

export type AuthStage = "local" | "loading" | "signedOut" | "profileSetup" | "ready" | "error";

export interface AuthResult {
  error: string | null;
  requiresEmailConfirmation?: boolean;
}

export interface ProfileInput {
  nickname: string;
  avatarKey: "ming" | "hong" | "jie" | "qixi";
  accentColor: "sage" | "terracotta" | "blue" | "violet";
}

function authErrorMessage(error: { message?: string; code?: string }) {
  const message = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  if (message.includes("invalid login credentials") || message.includes("invalid_credentials")) return "邮箱或密码不正确";
  if (message.includes("email not confirmed") || message.includes("email_not_confirmed")) return "请先前往邮箱完成验证";
  if (message.includes("user already registered") || message.includes("user_already_exists")) return "这个邮箱已经注册，可以直接登录";
  if (message.includes("password") && (message.includes("weak") || message.includes("least"))) return "密码至少需要 8 位";
  if (message.includes("rate") || message.includes("too many")) return "操作太频繁，请稍后再试";
  if (message.includes("signup") && message.includes("disabled")) return "当前项目暂未开放注册";
  if (message.includes("network") || message.includes("fetch")) return "网络连接失败，请检查后重试";
  return "操作没有完成，请稍后再试";
}

export function useAuthSession() {
  const configured = isSupabaseConfigured();
  const [stage, setStage] = useState<AuthStage>(configured ? "loading" : "local");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const generationRef = useRef(0);

  const loadSession = useCallback(async (session: Session | null) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStage("local");
      return;
    }

    const generation = ++generationRef.current;
    if (!session) {
      setUser(null);
      setProfile(null);
      setErrorMessage(null);
      setStage("signedOut");
      return;
    }

    setStage("loading");
    setErrorMessage(null);
    const { data: userResult, error: userError } = await supabase.auth.getUser();
    if (generation !== generationRef.current) return;
    if (userError || !userResult.user) {
      if (userError?.name === "AuthSessionMissingError") {
        setUser(null);
        setProfile(null);
        setStage("signedOut");
        return;
      }
      setErrorMessage(authErrorMessage(userError ?? { message: "missing user" }));
      setStage("error");
      return;
    }

    const authenticatedUser = userResult.user;
    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("id,nickname,avatar_key,accent_color,created_at,updated_at")
      .eq("id", authenticatedUser.id)
      .maybeSingle();
    if (generation !== generationRef.current) return;
    if (profileError) {
      setErrorMessage(authErrorMessage(profileError));
      setStage("error");
      return;
    }

    setUser(authenticatedUser);
    setProfile(profileRow);
    const explicitlyPending = authenticatedUser.user_metadata.profile_completed === false;
    setStage(!profileRow || explicitlyPending ? "profileSetup" : "ready");
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let disposed = false;
    const refresh = (session: Session | null) => {
      window.setTimeout(() => {
        if (!disposed) void loadSession(session);
      }, 0);
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (disposed) return;
      if (error) {
        setErrorMessage(authErrorMessage(error));
        setStage("error");
        return;
      }
      void loadSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => refresh(session));
    return () => {
      disposed = true;
      generationRef.current += 1;
      data.subscription.unsubscribe();
    };
  }, [loadSession]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase 尚未配置" };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error ? authErrorMessage(error) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase 尚未配置" };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { profile_completed: false } },
    });
    if (error) return { error: authErrorMessage(error) };
    return { error: null, requiresEmailConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setStage("signedOut");
    }
    return { error: error ? authErrorMessage(error) : null };
  }, []);

  const completeProfile = useCallback(async (input: ProfileInput): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return { error: "登录状态已失效，请重新登录" };

    const nickname = input.nickname.trim();
    if (!nickname || nickname.length > 24) return { error: "昵称需要是 1 至 24 个字符" };
    const values = { nickname, avatar_key: input.avatarKey, accent_color: input.accentColor };
    const profileResult = profile
      ? await supabase.from("profiles").update(values).eq("id", user.id).select().single()
      : await supabase.from("profiles").insert({ id: user.id, ...values }).select().single();
    if (profileResult.error) return { error: authErrorMessage(profileResult.error) };

    const { data: updatedUser, error: metadataError } = await supabase.auth.updateUser({
      data: { ...user.user_metadata, profile_completed: true },
    });
    if (metadataError) return { error: authErrorMessage(metadataError) };
    setUser(updatedUser.user);
    setProfile(profileResult.data);
    setStage("ready");
    return { error: null };
  }, [profile, user]);

  const retry = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setStage("loading");
    setErrorMessage(null);
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setErrorMessage(authErrorMessage(error));
      setStage("error");
      return;
    }
    await loadSession(data.session);
  }, [loadSession]);

  return { configured, stage, user, profile, errorMessage, signIn, signUp, signOut, completeProfile, retry };
}
