"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Buildings, EnvelopeSimple, LockKey, UsersThree } from "@phosphor-icons/react";
import type { AuthResult } from "@/hooks/useAuthSession";

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<AuthResult>;
  onSignUp: (email: string, password: string) => Promise<AuthResult>;
}

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success" | "info"; text: string } | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "请填写邮箱和密码" });
      return;
    }
    if (mode === "register" && password.length < 8) {
      setMessage({ type: "error", text: "密码至少需要 8 位" });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    const result = mode === "login" ? await onSignIn(email, password) : await onSignUp(email, password);
    setSubmitting(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    if (result.requiresEmailConfirmation) {
      setMessage({ type: "success", text: "注册成功，请到邮箱完成验证后再登录" });
      setMode("login");
      setPassword("");
    }
  };

  const switchMode = (nextMode: "login" | "register") => {
    if (submitting) return;
    setMode(nextMode);
    setMessage(null);
    setPassword("");
  };

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <section className="auth-layout">
        <motion.div className="auth-story" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="auth-brand">
            <span className="auth-brand-mark"><Buildings size={29} weight="duotone" /></span>
            <span><strong>四人工位</strong><small>FOUR DESKS</small></span>
          </div>
          <div className="auth-story-copy">
            <span className="auth-eyebrow"><UsersThree size={16} weight="duotone" />给四个朋友的共享云工位</span>
            <h1>四个人，<br />一间云办公室</h1>
            <p>不在同一家公司，也可以一起上班、吃饭、摸鱼，再互相提醒早点下班。</p>
          </div>
          <div className="auth-desk-preview" aria-label="四张等待入座的工位">
            {["01", "02", "03", "04"].map((number, index) => (
              <div key={number} className={`auth-mini-desk desk-tone-${index + 1}`}>
                <span><i /><i /></span><small>工位 {number}</small>
              </div>
            ))}
          </div>
          <small className="auth-story-footnote">今天也在云端并肩坐下。</small>
        </motion.div>

        <motion.section className="auth-card" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <div className="auth-tabs" role="tablist" aria-label="登录方式">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => switchMode("login")}>登录</button>
            <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => switchMode("register")}>注册</button>
          </div>
          <header>
            <span>{mode === "login" ? "欢迎回来" : "加入云办公室"}</span>
            <h2>{mode === "login" ? "回到你的工位" : "先创建一个账号"}</h2>
            <p>{mode === "login" ? "看看朋友们今天都在忙什么。" : "注册后再设置昵称、形象和个人颜色。"}</p>
          </header>
          <form className="auth-form" onSubmit={submit} noValidate>
            <label>
              <span>邮箱</span>
              <div><EnvelopeSimple size={19} /><input type="email" autoComplete="email" value={email} placeholder="name@example.com" disabled={submitting} onChange={(event) => setEmail(event.target.value)} /></div>
            </label>
            <label>
              <span>密码</span>
              <div><LockKey size={18} /><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} placeholder={mode === "register" ? "至少 8 位" : "输入你的密码"} disabled={submitting} onChange={(event) => setPassword(event.target.value)} /></div>
            </label>
            {message ? <p className={`auth-message is-${message.type}`} role="status">{message.text}</p> : null}
            <button className="auth-primary-button" type="submit" disabled={submitting}>
              <span>{submitting ? "请稍候…" : mode === "login" ? "进入办公室" : "注册账号"}</span>
              {submitting ? <i className="auth-button-spinner" aria-hidden="true" /> : <ArrowRight size={18} weight="bold" />}
            </button>
            <button className="auth-forgot-button" type="button" disabled={submitting} onClick={() => setMessage({ type: "info", text: "忘记密码功能即将开放" })}>忘记密码？</button>
          </form>
          {process.env.NODE_ENV === "development" ? (
            <aside className="auth-test-note">
              <strong>四账号测试</strong>
              <span>可分别使用 Chrome 普通/无痕窗口与 Edge 普通/InPrivate 窗口登录；密码不会写入项目。</span>
            </aside>
          ) : null}
        </motion.section>
      </section>
    </main>
  );
}
