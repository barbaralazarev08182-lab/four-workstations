"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Buildings, Check, Copy, DoorOpen, Plus, SignOut, UsersThree } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { officeAccessErrorMessage, type OfficeMembership } from "@/hooks/useOfficeMembership";
import type { AuthResult } from "@/hooks/useAuthSession";

type OnboardingMode = "create" | "join";
type BusyAction = "creating" | "previewing" | "joining" | null;

interface OfficeResult {
  office_id: string;
  office_name: string;
  invite_code: string;
  desk_key: string;
}

interface OfficePreview {
  office_id: string;
  office_name: string;
  current_member_count: number;
  available_desks: string[];
}

interface OfficeOnboardingProps {
  nickname: string;
  onJoined: (membership: OfficeMembership) => void;
  onSignOut: () => Promise<AuthResult>;
}

const DESKS = [
  { key: "desk_1", number: "01", position: "左上" },
  { key: "desk_2", number: "02", position: "右上" },
  { key: "desk_3", number: "03", position: "左下" },
  { key: "desk_4", number: "04", position: "右下" },
];

function sanitizeInviteCode(value: string) {
  return value.toUpperCase().replace(/\s/g, "").replace(/[^A-HJ-NP-Z2-9]/g, "").slice(0, 6);
}

export function OfficeOnboarding({ nickname, onJoined, onSignOut }: OfficeOnboardingProps) {
  const [mode, setMode] = useState<OnboardingMode>("create");
  const [officeName, setOfficeName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [preview, setPreview] = useState<OfficePreview | null>(null);
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const [result, setResult] = useState<OfficeResult | null>(null);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");

  const switchMode = (nextMode: OnboardingMode) => {
    if (busy) return;
    setMode(nextMode);
    setError(null);
    setPreview(null);
    setSelectedDesk(null);
  };

  const createOffice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const name = officeName.trim();
    if (name.length < 2 || name.length > 30) {
      setError("办公室名称需要是 2 至 30 个字符");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setBusy("creating");
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("create_office", { p_name: name });
    setBusy(null);
    if (rpcError) {
      setError(officeAccessErrorMessage(rpcError));
      return;
    }
    const created = data?.[0] as OfficeResult | undefined;
    if (!created) {
      setError("办公室创建后没有返回数据，请重新检查");
      return;
    }
    setResult(created);
  };

  const refreshPreview = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || inviteCode.length !== 6) return;
    const { data } = await supabase.rpc("preview_office_by_invite_code", { p_invite_code: inviteCode });
    const latest = data?.[0] as OfficePreview | undefined;
    if (latest) setPreview(latest);
  };

  const previewOffice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (inviteCode.length !== 6) {
      setError("请输入完整的 6 位邀请码");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setBusy("previewing");
    setError(null);
    setPreview(null);
    setSelectedDesk(null);
    const { data, error: rpcError } = await supabase.rpc("preview_office_by_invite_code", { p_invite_code: inviteCode });
    setBusy(null);
    if (rpcError) {
      setError(officeAccessErrorMessage(rpcError));
      return;
    }
    const officePreview = data?.[0] as OfficePreview | undefined;
    if (!officePreview) {
      setError("邀请码无效，请检查后重试");
      return;
    }
    setPreview(officePreview);
  };

  const joinOffice = async () => {
    if (busy || !preview || !selectedDesk) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setBusy("joining");
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("join_office", {
      p_invite_code: inviteCode,
      p_desk_key: selectedDesk,
    });
    setBusy(null);
    if (rpcError) {
      setError(officeAccessErrorMessage(rpcError));
      if (rpcError.message.includes("desk_is_taken")) {
        setSelectedDesk(null);
        void refreshPreview();
      }
      return;
    }
    const joined = data?.[0] as OfficeResult | undefined;
    if (!joined) {
      setError("加入办公室后没有返回数据，请重新检查");
      return;
    }
    setResult(joined);
  };

  const copyInviteCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.invite_code);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };

  if (result) {
    return (
      <main className="auth-page office-onboarding-page">
        <motion.section className="office-created-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <span className="office-created-icon"><Check size={28} weight="bold" /></span>
          <small>{mode === "create" ? "创建成功" : "加入成功"}</small>
          <h1>{mode === "create" ? "你的共享工位已创建" : "欢迎来到共享工位"}</h1>
          <p>{result.office_name}</p>
          <div className="invite-code-card">
            <span>办公室邀请码</span>
            <div>
              <input value={result.invite_code} readOnly aria-label="办公室邀请码" onFocus={(event) => event.currentTarget.select()} />
              <button type="button" onClick={copyInviteCode}><Copy size={17} />{copyState === "copied" ? "已复制" : "复制"}</button>
            </div>
            {copyState === "manual" ? <small>复制失败，可以直接选中上方邀请码手动复制。</small> : null}
          </div>
          <div className="created-desk-row"><span>当前工位</span><strong>{result.desk_key}</strong></div>
          <button className="auth-primary-button" type="button" onClick={() => onJoined({ officeId: result.office_id, deskKey: result.desk_key, role: mode === "create" ? "owner" : "member" })}>
            <span>进入办公室</span><ArrowRight size={18} weight="bold" />
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="auth-page office-onboarding-page">
      <section className="office-onboarding-shell">
        <header className="office-onboarding-header">
          <div className="auth-brand">
            <span className="auth-brand-mark"><Buildings size={27} weight="duotone" /></span>
            <span><strong>四人工位</strong><small>FOUR DESKS</small></span>
          </div>
          <div><span>你好，{nickname}</span><button type="button" onClick={() => void onSignOut()}><SignOut size={15} />退出登录</button></div>
        </header>

        <div className="office-onboarding-copy">
          <span>下一步 · 找到你的朋友</span>
          <h1>今天坐哪间办公室？</h1>
          <p>创建一间新的共享工位，或者拿着朋友发来的邀请码入座。</p>
        </div>

        <div className="office-mode-tabs" role="tablist" aria-label="办公室操作">
          <button type="button" role="tab" aria-selected={mode === "create"} className={mode === "create" ? "is-active" : ""} onClick={() => switchMode("create")}><Plus size={18} />创建办公室</button>
          <button type="button" role="tab" aria-selected={mode === "join"} className={mode === "join" ? "is-active" : ""} onClick={() => switchMode("join")}><DoorOpen size={18} />加入办公室</button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "create" ? (
            <motion.form key="create" className="office-entry-card" onSubmit={createOffice} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
              <div className="office-entry-heading"><span><Plus size={20} /></span><div><h2>开一间新办公室</h2><p>你会成为 owner，并自动坐在左上角的 desk_1。</p></div></div>
              <label><span>办公室名称 <small>{officeName.length}/30</small></span><input value={officeName} maxLength={30} disabled={Boolean(busy)} placeholder="比如：周三不加班俱乐部" onChange={(event) => setOfficeName(event.target.value)} /></label>
              {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
              <button className="auth-primary-button" type="submit" disabled={Boolean(busy) || officeName.trim().length < 2}>
                <span>{busy === "creating" ? "正在创建…" : "创建共享工位"}</span>{busy === "creating" ? <i className="auth-button-spinner" /> : <ArrowRight size={18} weight="bold" />}
              </button>
            </motion.form>
          ) : (
            <motion.div key="join" className="office-entry-card" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              <div className="office-entry-heading"><span><UsersThree size={20} /></span><div><h2>去朋友的办公室</h2><p>输入 6 位邀请码，先看看还有哪些工位空着。</p></div></div>
              <form className="invite-lookup-form" onSubmit={previewOffice}>
                <label><span>邀请码</span><input value={inviteCode} inputMode="text" autoCapitalize="characters" autoComplete="off" maxLength={6} disabled={Boolean(busy)} placeholder="AB23CD" onChange={(event) => { setInviteCode(sanitizeInviteCode(event.target.value)); setPreview(null); setSelectedDesk(null); setError(null); }} /></label>
                <button type="submit" disabled={Boolean(busy) || inviteCode.length !== 6}>{busy === "previewing" ? "查询中…" : "查询"}</button>
              </form>
              {preview ? (
                <section className="office-preview-card">
                  <header><div><span>找到办公室</span><h3>{preview.office_name}</h3></div><strong>{preview.current_member_count}/4 人</strong></header>
                  <div className="desk-picker" role="group" aria-label="选择空闲工位">
                    {DESKS.map((desk) => {
                      const available = preview.available_desks.includes(desk.key);
                      return (
                        <button key={desk.key} type="button" disabled={!available || Boolean(busy)} className={selectedDesk === desk.key ? "is-selected" : ""} aria-pressed={selectedDesk === desk.key} onClick={() => setSelectedDesk(desk.key)}>
                          <span>{available ? `工位 ${desk.number}` : "已占用"}</span><small>{desk.position} · {desk.key}</small>{selectedDesk === desk.key ? <Check size={15} weight="bold" /> : null}
                        </button>
                      );
                    })}
                  </div>
                  <button className="auth-primary-button" type="button" disabled={!selectedDesk || Boolean(busy)} onClick={joinOffice}>
                    <span>{busy === "joining" ? "正在加入…" : "加入这间办公室"}</span>{busy === "joining" ? <i className="auth-button-spinner" /> : <ArrowRight size={18} weight="bold" />}
                  </button>
                </section>
              ) : null}
              {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
              {preview ? <button className="invite-back-button" type="button" onClick={() => { setPreview(null); setSelectedDesk(null); }}><ArrowLeft size={14} />重新输入邀请码</button> : null}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
