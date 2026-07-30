"use client";

import { Buildings } from "@phosphor-icons/react";

interface AuthStatusScreenProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AuthStatusScreen({ title, description, actionLabel, onAction }: AuthStatusScreenProps) {
  return (
    <main className="auth-page auth-status-page">
      <section className="auth-status-card" aria-live="polite">
        <span className="auth-brand-mark"><Buildings size={29} weight="duotone" /></span>
        <div className="auth-loading-dots" aria-hidden="true"><i /><i /><i /></div>
        <h1>{title}</h1>
        <p>{description}</p>
        {actionLabel && onAction ? <button type="button" className="auth-primary-button" onClick={onAction}>{actionLabel}</button> : null}
      </section>
    </main>
  );
}
