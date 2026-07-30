"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Buildings, SignOut } from "@phosphor-icons/react";
import type { AuthResult, ProfileInput } from "@/hooks/useAuthSession";
import type { ProfileRow } from "@/lib/supabase/database.types";

interface ProfileSetupProps {
  email: string;
  initialProfile: ProfileRow | null;
  onSubmit: (input: ProfileInput) => Promise<AuthResult>;
  onSignOut: () => Promise<AuthResult>;
}

const AVATARS: Array<{ key: ProfileInput["avatarKey"]; label: string; src: string }> = [
  { key: "ming", label: "薄荷衫", src: "/avatars/ming.png" },
  { key: "hong", label: "珊瑚衫", src: "/avatars/hong.png" },
  { key: "jie", label: "晴空衫", src: "/avatars/jie.png" },
  { key: "qixi", label: "紫藤衫", src: "/avatars/qixi.png" },
];

const ACCENTS: Array<{ key: ProfileInput["accentColor"]; label: string; color: string }> = [
  { key: "sage", label: "鼠尾草绿", color: "#78906f" },
  { key: "terracotta", label: "暖陶土", color: "#c87859" },
  { key: "blue", label: "雾霾蓝", color: "#6f8eac" },
  { key: "violet", label: "柔雾紫", color: "#8c79a2" },
];

function avatarKey(value: string | undefined): ProfileInput["avatarKey"] {
  return AVATARS.some((item) => item.key === value) ? value as ProfileInput["avatarKey"] : "ming";
}

function accentColor(value: string | undefined): ProfileInput["accentColor"] {
  return ACCENTS.some((item) => item.key === value) ? value as ProfileInput["accentColor"] : "sage";
}

export function ProfileSetup({ email, initialProfile, onSubmit, onSignOut }: ProfileSetupProps) {
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? "");
  const [avatar, setAvatar] = useState<ProfileInput["avatarKey"]>(avatarKey(initialProfile?.avatar_key));
  const [accent, setAccent] = useState<ProfileInput["accentColor"]>(accentColor(initialProfile?.accent_color));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await onSubmit({ nickname, avatarKey: avatar, accentColor: accent });
    setSubmitting(false);
    if (result.error) setError(result.error);
  };

  return (
    <main className="auth-page profile-setup-page">
      <motion.section className="profile-setup-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <header>
          <span className="auth-brand-mark"><Buildings size={27} weight="duotone" /></span>
          <div><small>欢迎加入四人工位</small><h1>先布置你的名牌</h1><p>这些信息会出现在工位、角色标签和朋友们的动态里。</p></div>
        </header>
        <form onSubmit={submit}>
          <label className="profile-name-field">
            <span>你的昵称 <small>{nickname.length}/24</small></span>
            <input value={nickname} maxLength={24} autoFocus placeholder="朋友们怎么称呼你？" disabled={submitting} onChange={(event) => setNickname(event.target.value)} />
          </label>
          <fieldset>
            <legend>选择预设形象</legend>
            <div className="profile-avatar-options">
              {AVATARS.map((item) => (
                <button key={item.key} type="button" className={avatar === item.key ? "is-selected" : ""} aria-pressed={avatar === item.key} disabled={submitting} onClick={() => setAvatar(item.key)}>
                  <span><Image src={item.src} alt="" fill sizes="72px" /></span><small>{item.label}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>个人强调色</legend>
            <div className="profile-accent-options">
              {ACCENTS.map((item) => (
                <button key={item.key} type="button" className={accent === item.key ? "is-selected" : ""} aria-pressed={accent === item.key} disabled={submitting} onClick={() => setAccent(item.key)}>
                  <i style={{ backgroundColor: item.color }} /><span>{item.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
          {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
          <button className="auth-primary-button" type="submit" disabled={submitting || !nickname.trim()}>
            <span>{submitting ? "正在保存…" : "保存并继续"}</span>{submitting ? <i className="auth-button-spinner" /> : <ArrowRight size={18} weight="bold" />}
          </button>
        </form>
        <footer><span>{email}</span><button type="button" disabled={submitting} onClick={() => void onSignOut()}><SignOut size={16} />退出登录</button></footer>
      </motion.section>
    </main>
  );
}
