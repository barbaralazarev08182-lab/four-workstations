"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, ChatCircleDots, X } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { useDialogFocus } from "@/components/hud/useDialogFocus";
import { getDurationLabel, getStatusLabel, REACTION_LABELS } from "@/lib/status";
import type { ActivityItem, InteractionEvent, OfficeUser } from "@/lib/types";

interface ActivityFeedProps {
  activities: ActivityItem[];
  users: OfficeUser[];
  open: boolean;
  onClose: () => void;
  onReact: (activityId: string, key: ActivityItem["reactions"][number]["key"]) => void;
  onUserClick: (user: OfficeUser) => void;
  interactions: InteractionEvent[];
  loading?: boolean;
  error?: string | null;
  limit?: number;
}

export function ActivityFeed({ activities, users, open, onClose, onReact, onUserClick, interactions, loading = false, error = null, limit = 3 }: ActivityFeedProps) {
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const latestActivities = getLatestActivities(activities, limit);
  const dialogRef = useDialogFocus(open, onClose);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="diary-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={(node) => { dialogRef.current = node as HTMLDivElement | null; }}
            className="diary-panel"
            role="dialog"
            aria-modal="true"
            aria-label="办公室日记"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <header className="diary-header">
              <div><ChatCircleDots size={19} weight="duotone" /><strong>办公室日记</strong></div>
              <button type="button" onClick={onClose} aria-label="关闭办公室日记"><X size={16} /></button>
            </header>
            <div className="diary-list" aria-busy={loading}>
              {loading ? (
                <p className="diary-empty" role="status">正在读取办公室日记…</p>
              ) : error ? (
                <p className="diary-empty diary-error" role="alert">{error}</p>
              ) : latestActivities.length === 0 ? (
                <p className="diary-empty">还没有动态，先去打个卡吧。</p>
              ) : (
                latestActivities.map((activity) => {
                  const user = users.find((item) => item.id === activity.userId);
                  if (!user) return null;
                  const expanded = expandedActivityId === activity.id;
                  return (
                    <article key={activity.id} className={`activity-item ${expanded ? "is-expanded" : ""}`}>
                      <button className={`feed-avatar avatar-${user.accent}`} type="button" onClick={() => onUserClick(user)}><Avatar user={user} /></button>
                      <div className="activity-copy">
                        <div><strong>{user.name}</strong><time>{activity.time}</time></div>
                        <span className={`status-text text-${user.accent}`}>{getStatusLabel(activity.status)} · {getDurationLabel(user.statusSince)}</span>
                        <p>{activity.note}</p>
                        <button
                          type="button"
                          className="activity-expand"
                          onClick={() => setExpandedActivityId(expanded ? null : activity.id)}
                          aria-expanded={expanded}
                        >
                          {expanded ? "收起互动" : `查看互动 · ${activity.reactions.reduce((sum, reaction) => sum + reaction.count, 0)}`}
                          <CaretDown size={12} className={expanded ? "is-open" : ""} />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded ? (
                            <motion.div className="activity-details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                              <div className="reaction-row">
                                {activity.reactions.slice(0, 3).map((reaction) => (
                                  <button key={reaction.key} type="button" onClick={() => onReact(activity.id, reaction.key)} aria-label={`回应 ${REACTION_LABELS[reaction.key]}`}>
                                    {REACTION_LABELS[reaction.key]} <span>{reaction.count}</span>
                                  </button>
                                ))}
                                <button type="button" className="add-reaction" onClick={() => onReact(activity.id, "like")} aria-label="添加回应">+</button>
                              </div>
                              {activity.recentInteraction ? <small className="recent-interaction">{activity.recentInteraction}</small> : null}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </article>
                  );
                })
              )}
              <InteractionFeedItems interactions={interactions} users={users} />
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

const INTERACTION_COPY: Record<InteractionEvent["kind"], string> = {
  poke: "戳了一下",
  send_coffee: "送来一杯咖啡",
  reaction: "发来回应",
  short_message: "留了一句话",
};

const REACTION_EMOJI = { like: "👍", laugh: "😂", hug: "🫂", fish: "🐟", cheer: "🎉" } as const;

function InteractionFeedItems({ interactions, users }: { interactions: InteractionEvent[]; users: OfficeUser[] }) {
  const latest = interactions.slice(0, 3);
  if (!latest.length) return null;
  return (
    <div className="interaction-feed-items" aria-label="最近互动">
      <span>最近互动</span>
      {latest.map((interaction) => {
        const sender = users.find((user) => user.id === interaction.senderId);
        const receiver = users.find((user) => user.id === interaction.receiverId);
        if (!sender || !receiver) return null;
        return (
          <article key={interaction.id} data-interaction-id={interaction.id}>
            <Avatar user={sender} />
            <p>
              <strong>{sender.name}</strong>
              {interaction.kind === "short_message"
                ? ` 对${receiver.name}说：“${interaction.content}”`
                : ` 给${receiver.name}${INTERACTION_COPY[interaction.kind]}`}
              {interaction.reaction ? <b>{REACTION_EMOJI[interaction.reaction]}</b> : null}
            </p>
            <time>{new Date(interaction.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</time>
          </article>
        );
      })}
    </div>
  );
}

function getLatestActivities(activities: ActivityItem[], limit: number) {
  if (limit >= activities.length) return activities;
  const seen = new Set<string>();
  return activities.filter((activity) => {
    if (seen.has(activity.userId)) return false;
    seen.add(activity.userId);
    return true;
  }).slice(0, limit);
}
