"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, HandTap, PaperPlaneTilt, X } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { useDialogFocus } from "@/components/hud/useDialogFocus";
import { MOBILE_BREAKPOINT, type InteractionAnchor } from "@/components/office-3d/scene-config";
import { getDurationLabel, getStatusLabel } from "@/lib/status";
import type { InteractionEvent, InteractionKind, InteractionReactionKey, OfficeUser } from "@/lib/types";

export type { InteractionAnchor };

interface ContextInteractionMenuProps {
  open: boolean;
  user: OfficeUser | null;
  currentUserId: string;
  events: InteractionEvent[];
  anchor: InteractionAnchor | null;
  onClose: () => void;
  onSend: (input: { receiverId: string; kind: InteractionKind; reaction?: InteractionReactionKey; content?: string }) => Promise<boolean>;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

const REACTIONS: Array<{ key: InteractionReactionKey; emoji: string; label: string }> = [
  { key: "like", emoji: "👍", label: "赞" },
  { key: "laugh", emoji: "😂", label: "笑" },
  { key: "hug", emoji: "🫂", label: "抱抱" },
  { key: "fish", emoji: "🐟", label: "摸鱼" },
  { key: "cheer", emoji: "🎉", label: "加油" },
];

const POPOVER_WIDTH = 288;
const POPOVER_HEIGHT = 340;
const EDGE_MARGIN = 12;

function useIsMobileSheet() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(Math.min(window.innerWidth, window.innerHeight) < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function clampPopover(anchor: InteractionAnchor | null) {
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const baseX = anchor?.x ?? vw / 2;
  const baseY = anchor?.y ?? vh / 2;
  const left = Math.min(Math.max(baseX + 14, EDGE_MARGIN), Math.max(EDGE_MARGIN, vw - POPOVER_WIDTH - EDGE_MARGIN));
  const top = Math.min(Math.max(baseY - 40, EDGE_MARGIN), Math.max(EDGE_MARGIN, vh - POPOVER_HEIGHT - EDGE_MARGIN));
  return { left, top };
}

export function ContextInteractionMenu({ open, user, currentUserId, events, anchor, onClose, onSend, fallbackFocusRef }: ContextInteractionMenuProps) {
  const isMobile = useIsMobileSheet();
  const dialogRef = useDialogFocus(open, onClose, { fallbackFocusRef });
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const pos = useMemo(() => clampPopover(anchor), [anchor]);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const recentMessages = useMemo(() => user ? events.filter((event) => (
    event.kind === "short_message"
    && ((event.senderId === currentUserId && event.receiverId === user.id) || (event.senderId === user.id && event.receiverId === currentUserId))
  )).slice(0, 3) : [], [currentUserId, events, user]);

  if (!user || user.isCurrentUser) return null;

  const send = async (kind: InteractionKind, reaction?: InteractionReactionKey, content?: string) => {
    if (sending) return false;
    setSending(reaction ?? kind);
    setSendError(null);
    const ok = await onSend({ receiverId: user.id, kind, reaction, content });
    setSending(null);
    if (!ok) setSendError("发送没有成功，请稍后再试");
    else if (kind !== "short_message") onClose();
    return ok;
  };

  const body = (
    <div className="cim-body">
      <div className="interaction-primary-actions">
        <button type="button" disabled={Boolean(sending)} onClick={() => void send("poke")} data-testid="interaction-poke">
          <HandTap size={21} weight="duotone" /><span>戳一戳<small>让对方挥挥手</small></span>
        </button>
        <button type="button" disabled={Boolean(sending)} onClick={() => void send("send_coffee")} data-testid="interaction-coffee">
          <Coffee size={21} weight="duotone" /><span>送咖啡<small>放到对方桌上</small></span>
        </button>
      </div>

      <fieldset className="interaction-reactions">
        <legend>表情回应</legend>
        <div>
          {REACTIONS.map((reaction) => (
            <button key={reaction.key} type="button" aria-label={`发送${reaction.label}`} disabled={Boolean(sending)} onClick={() => void send("reaction", reaction.key)}>
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
        <label htmlFor="cim-message">留一句话 <small>{message.length}/60</small></label>
        <div>
          <input id="cim-message" value={message} maxLength={60} placeholder="比如：忙完记得喝水" onChange={(event) => setMessage(event.target.value)} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "nearest" })} />
          <button type="submit" aria-label="发送短留言" disabled={!message.trim() || Boolean(sending)} data-testid="interaction-message-send"><PaperPlaneTilt size={18} weight="fill" /></button>
        </div>
      </form>

      {sendError ? <p className="cim-error" role="alert">{sendError}</p> : null}

      {recentMessages.length ? (
        <div className="recent-short-messages">
          <span>最近短留言</span>
          {recentMessages.map((event) => (
            <p key={event.id}><strong>{event.senderId === currentUserId ? "我" : user.name}</strong>{event.content}<time>{new Date(event.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</time></p>
          ))}
        </div>
      ) : null}
    </div>
  );

  const header = (
    <header className="cim-header">
      <Avatar user={user} className={`panel-avatar avatar-${user.accent}`} />
      <div>
        <strong>{user.name} · {getStatusLabel(user.status)}</strong>
        <small>已持续 {getDurationLabel(user.statusSince)}</small>
      </div>
      <button type="button" onClick={onClose} aria-label="关闭互动菜单"><X size={18} /></button>
    </header>
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="panel-scrim cim-scrim" type="button" aria-label="关闭互动菜单" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          {isMobile ? (
            <motion.aside
              ref={dialogRef}
              className="cim-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={`和${user.name}互动`}
              aria-busy={Boolean(sending)}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="sheet-grip" />
              {header}
              {body}
            </motion.aside>
          ) : (
            <motion.aside
              ref={(node) => { const div = node as HTMLDivElement | null; dialogRef.current = div; popoverRef.current = div; }}
              className="cim-popover"
              role="dialog"
              aria-modal="true"
              aria-label={`和${user.name}互动`}
              aria-busy={Boolean(sending)}
              style={{ left: pos.left, top: pos.top, width: POPOVER_WIDTH }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.14 }}
            >
              {header}
              {body}
            </motion.aside>
          )}
        </>
      ) : null}
    </AnimatePresence>
  );
}
