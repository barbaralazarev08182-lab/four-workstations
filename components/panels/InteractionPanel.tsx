"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, HandTap, PaperPlaneTilt, X } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { getDurationLabel, getStatusLabel } from "@/lib/status";
import type { InteractionEvent, InteractionKind, InteractionReactionKey, OfficeUser } from "@/lib/types";

interface InteractionPanelProps {
  open: boolean;
  user: OfficeUser | null;
  currentUserId: string;
  events: InteractionEvent[];
  onClose: () => void;
  onSend: (input: { receiverId: string; kind: InteractionKind; reaction?: InteractionReactionKey; content?: string }) => Promise<boolean>;
}

const REACTIONS: Array<{ key: InteractionReactionKey; emoji: string; label: string }> = [
  { key: "like", emoji: "👍", label: "赞" },
  { key: "laugh", emoji: "😂", label: "笑" },
  { key: "hug", emoji: "🫂", label: "抱抱" },
  { key: "fish", emoji: "🐟", label: "摸鱼" },
  { key: "cheer", emoji: "🎉", label: "加油" },
];

export function InteractionPanel({ open, user, currentUserId, events, onClose, onSend }: InteractionPanelProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const recentMessages = useMemo(() => user ? events.filter((event) => (
    event.kind === "short_message"
    && ((event.senderId === currentUserId && event.receiverId === user.id) || (event.senderId === user.id && event.receiverId === currentUserId))
  )).slice(0, 3) : [], [currentUserId, events, user]);

  if (!user || user.isCurrentUser) return null;

  const send = async (kind: InteractionKind, reaction?: InteractionReactionKey, content?: string) => {
    if (sending) return false;
    setSending(reaction ?? kind);
    const ok = await onSend({ receiverId: user.id, kind, reaction, content });
    setSending(null);
    return ok;
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="panel-scrim" type="button" aria-label="关闭互动面板" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="checkin-panel interaction-panel"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            aria-label={`和${user.name}互动`}
          >
            <header className="panel-header">
              <Avatar user={user} className={`panel-avatar avatar-${user.accent}`} />
              <div><span>朋友的工位</span><h2>{user.name} · {getStatusLabel(user.status)}</h2></div>
              <button type="button" onClick={onClose} aria-label="关闭"><X size={20} /></button>
            </header>

            <div className="friend-detail interaction-detail">
              <div className="friend-current">
                <span>当前状态 · 已持续 {getDurationLabel(user.statusSince)}</span>
                <strong>{getStatusLabel(user.status)}</strong>
                <p>“{user.note}”</p>
              </div>

              <div className="interaction-primary-actions">
                <button type="button" disabled={Boolean(sending)} onClick={() => void send("poke")} data-testid="interaction-poke">
                  <HandTap size={21} weight="duotone" /><span>戳一戳<small>让对方挥挥手</small></span>
                </button>
                <button type="button" disabled={Boolean(sending)} onClick={() => void send("send_coffee")} data-testid="interaction-coffee">
                  <Coffee size={21} weight="duotone" /><span>送咖啡<small>放到对方桌上 5 分钟</small></span>
                </button>
              </div>

              <fieldset className="interaction-reactions">
                <legend>表情回应</legend>
                <div>
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction.key}
                      type="button"
                      aria-label={`发送${reaction.label}`}
                      disabled={Boolean(sending)}
                      onClick={() => void send("reaction", reaction.key)}
                    >
                      <span>{reaction.emoji}</span><small>{reaction.label}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <form
                className="interaction-message-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const content = message.trim();
                  if (!content) return;
                  void send("short_message", undefined, content).then((ok) => { if (ok) setMessage(""); });
                }}
              >
                <label htmlFor="short-interaction-message">留一句话 <small>{message.length}/60</small></label>
                <div>
                  <input id="short-interaction-message" value={message} maxLength={60} placeholder="比如：忙完记得喝水" onChange={(event) => setMessage(event.target.value)} />
                  <button type="submit" aria-label="发送短留言" disabled={!message.trim() || Boolean(sending)} data-testid="interaction-message-send"><PaperPlaneTilt size={18} weight="fill" /></button>
                </div>
              </form>

              {recentMessages.length ? (
                <div className="recent-short-messages">
                  <span>最近短留言</span>
                  {recentMessages.map((event) => (
                    <p key={event.id}><strong>{event.senderId === currentUserId ? "我" : user.name}</strong>{event.content}<time>{new Date(event.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</time></p>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
