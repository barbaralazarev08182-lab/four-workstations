"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, CaretLeft, CaretRight, ChatCircleDots } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { getDurationLabel, getStatusLabel, REACTION_LABELS } from "@/lib/status";
import type { ActivityItem, InteractionEvent, OfficeUser } from "@/lib/types";

interface ActivityFeedProps {
  activities: ActivityItem[];
  users: OfficeUser[];
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
  onReact: (activityId: string, key: ActivityItem["reactions"][number]["key"]) => void;
  onUserClick: (user: OfficeUser) => void;
  interactions: InteractionEvent[];
}

export function ActivityFeed({ activities, users, collapsed, mobileOpen, onToggle, onMobileToggle, onReact, onUserClick, interactions }: ActivityFeedProps) {
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const latestActivities = getLatestActivities(activities);
  const memberCount = users.filter((user) => !user.isPlaceholder).length;

  return (
    <>
      <aside className={`activity-feed ${collapsed ? "is-collapsed" : ""}`} aria-label="实时动态">
        <header>
          <div><ChatCircleDots size={20} weight="duotone" /><strong>实时动态</strong></div>
          <span><i />{memberCount} 人在线</span>
          <button type="button" onClick={onToggle} aria-label={collapsed ? "展开动态栏" : "折叠动态栏"}>{collapsed ? <CaretLeft /> : <CaretRight />}</button>
        </header>
        {!collapsed ? (
          <div className="activity-list">
            {latestActivities.map((activity) => {
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
            })}
            <InteractionFeedItems interactions={interactions} users={users} />
          </div>
        ) : null}
      </aside>

      <button className="mobile-feed-handle" type="button" onClick={onMobileToggle} aria-expanded={mobileOpen}>
        <span><ChatCircleDots size={19} />实时动态</span><CaretDown className={mobileOpen ? "is-open" : ""} />
      </button>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.aside className="mobile-feed-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 240, damping: 28 }}>
            <div className="sheet-grip" />
            <ActivityFeedList activities={latestActivities} users={users} onReact={onReact} onUserClick={onUserClick} interactions={interactions} />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ActivityFeedList({ activities, users, onReact, onUserClick, interactions }: Pick<ActivityFeedProps, "activities" | "users" | "onReact" | "onUserClick" | "interactions">) {
  return (
    <div className="mobile-activity-list">
      {activities.map((activity) => {
        const user = users.find((item) => item.id === activity.userId);
        if (!user) return null;
        return (
          <article key={activity.id}>
            <button className={`feed-avatar avatar-${user.accent}`} type="button" onClick={() => onUserClick(user)}><Avatar user={user} /></button>
            <div><strong>{user.name} · {getStatusLabel(activity.status)}</strong><p>{activity.note}</p><button type="button" onClick={() => onReact(activity.id, "like")}>👍 回应</button></div>
            <time>{activity.time}</time>
          </article>
        );
      })}
      <InteractionFeedItems interactions={interactions} users={users} />
    </div>
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

function getLatestActivities(activities: ActivityItem[]) {
  const seen = new Set<string>();
  return activities.filter((activity) => {
    if (seen.has(activity.userId)) return false;
    seen.add(activity.userId);
    return true;
  }).slice(0, 3);
}
