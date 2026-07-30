import { STATUS_DEFINITIONS } from "@/lib/status";
import type { AccentKey, ActivityItem, MoodKey, OfficeUser, StatusKey } from "@/lib/types";
import type { CurrentStatusRow, OfficeMemberRow, ProfileRow } from "@/lib/supabase/database.types";

const DESK_SCENE_KEYS: Record<string, string> = {
  desk_1: "ming",
  desk_2: "hong",
  desk_3: "jie",
  desk_4: "qixi",
};

const ACCENTS = new Set<AccentKey>(["sage", "terracotta", "blue", "violet"]);
const MOODS = new Set<MoodKey>(["energized", "calm", "tired", "happy", "blank"]);
const AVATAR_KEYS = new Set(["ming", "hong", "jie", "qixi"]);

function safeText(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized || fallback;
}

function safeIsoDate(value: string | null | undefined, fallback: string) {
  return value && Number.isFinite(Date.parse(value)) ? value : fallback;
}

export function isStatusKey(value: string): value is StatusKey {
  return value in STATUS_DEFINITIONS;
}

function getAccent(value: string): AccentKey {
  return ACCENTS.has(value as AccentKey) ? value as AccentKey : "sage";
}

function getMood(value: string): MoodKey {
  return MOODS.has(value as MoodKey) ? value as MoodKey : "calm";
}

export function currentStatusToUser(
  member: OfficeMemberRow,
  profile: ProfileRow,
  statusRow: CurrentStatusRow | undefined,
  currentUserId: string,
): OfficeUser {
  const status = statusRow && isStatusKey(statusRow.status) ? statusRow.status : "offWork";
  const mood = statusRow ? getMood(statusRow.mood) : "calm";
  const nickname = safeText(profile.nickname, "新朋友");
  const avatarKey = AVATAR_KEYS.has(profile.avatar_key) ? profile.avatar_key : "ming";
  const fallbackStartedAt = safeIsoDate(member.joined_at, new Date().toISOString());
  const statusSince = safeIsoDate(statusRow?.started_at, fallbackStartedAt);

  return {
    id: member.user_id,
    sceneKey: DESK_SCENE_KEYS[member.desk_key] ?? "ming",
    deskKey: member.desk_key,
    name: nickname,
    initials: nickname.slice(0, 1),
    avatarUrl: `/avatars/${avatarKey}.png`,
    company: "实习搭子",
    status,
    note: safeText(statusRow?.message, STATUS_DEFINITIONS[status].description),
    mood,
    statusSince,
    accent: getAccent(profile.accent_color),
    decoration: "专属桌面摆件",
    isCurrentUser: member.user_id === currentUserId,
  };
}

export function currentStatusToActivity(row: CurrentStatusRow): ActivityItem | null {
  if (!isStatusKey(row.status)) return null;
  const startedAt = safeIsoDate(row.started_at, new Date().toISOString());
  return {
    id: `status:${row.office_id}:${row.user_id}:${row.updated_at}`,
    userId: row.user_id,
    status: row.status,
    note: safeText(row.message, STATUS_DEFINITIONS[row.status].description),
    time: new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(startedAt)),
    reactions: [],
  };
}
