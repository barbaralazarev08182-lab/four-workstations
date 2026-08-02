"use client";

import { useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, SignOut, X } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { useDialogFocus } from "@/components/hud/useDialogFocus";
import { getStatusLabel, MOOD_LABELS, STATUS_DEFINITIONS } from "@/lib/status";
import type { MoodKey, OfficeUser, StatusKey } from "@/lib/types";

interface CheckInPanelProps {
  open: boolean;
  user: OfficeUser | null;
  suggestedStatuses: StatusKey[];
  onClose: () => void;
  onSubmit: (status: StatusKey, note: string, mood: MoodKey) => void;
  onSignOut?: () => Promise<{ error: string | null }>;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

const ALL_MOODS = Object.keys(MOOD_LABELS) as MoodKey[];

export function CheckInPanel({ open, user, suggestedStatuses, onClose, onSubmit, onSignOut, fallbackFocusRef }: CheckInPanelProps) {
  const [status, setStatus] = useState<StatusKey>(suggestedStatuses[0] ?? user?.status ?? "working");
  const [note, setNote] = useState(user?.isCurrentUser ? user.note : "");
  const [mood, setMood] = useState<MoodKey>(user?.mood ?? "calm");
  const dialogRef = useDialogFocus(open, onClose, { fallbackFocusRef });
  if (!user || !user.isCurrentUser) return null;

  const statuses = suggestedStatuses.length ? suggestedStatuses : (Object.keys(STATUS_DEFINITIONS) as StatusKey[]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="panel-scrim" type="button" aria-label="关闭面板" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            ref={(node) => { dialogRef.current = node as HTMLDivElement | null; }}
            className="checkin-panel"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="状态打卡面板"
          >
            <header className="panel-header">
              <Avatar user={user} className={`panel-avatar avatar-${user.accent}`} />
              <div>
                <span>更新我的状态</span>
                <h2>{user.name} · {getStatusLabel(user.status)}</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="关闭"><X size={20} /></button>
            </header>

            {(
              <form
                className="checkin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSubmit(status, note.trim() || STATUS_DEFINITIONS[status].description, mood);
                  onClose();
                }}
              >
                <fieldset>
                  <legend>现在要去做什么？</legend>
                  <div className="status-choice-grid">
                    {statuses.map((item) => (
                      <button key={item} type="button" data-status-key={item} className={status === item ? "is-selected" : ""} onClick={() => setStatus(item)}>
                        <span>{STATUS_DEFINITIONS[item].shortLabel}</span>
                        <small>{STATUS_DEFINITIONS[item].description}</small>
                        {status === item ? <Check size={15} weight="bold" /> : null}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="note-field">
                  <span>留一句话 <small>{note.length}/40</small></span>
                  <textarea value={note} maxLength={40} rows={3} placeholder="比如：改完这版就收工" onChange={(event) => setNote(event.target.value)} />
                </label>
                <fieldset>
                  <legend>现在的心情</legend>
                  <div className="mood-row">
                    {ALL_MOODS.map((item) => (
                      <button key={item} type="button" className={mood === item ? "is-selected" : ""} onClick={() => setMood(item)} aria-label={`心情 ${item}`}>
                        {MOOD_LABELS[item]}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button className="primary-submit" data-testid="checkin-submit" type="submit"><Check size={19} weight="bold" />完成打卡</button>
                {onSignOut ? (
                  <button className="panel-signout-button" type="button" onClick={() => { onClose(); void onSignOut(); }}>
                    <SignOut size={17} />退出登录
                  </button>
                ) : null}
              </form>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
