import type { AccentKey, OfficeUser } from "@/lib/types";

export const DESK_KEYS = ["desk_1", "desk_2", "desk_3", "desk_4"] as const;

export type DeskKey = (typeof DESK_KEYS)[number];

const SLOT_SCENE_KEYS = ["ming", "hong", "jie", "qixi"] as const;
const SLOT_ACCENTS: AccentKey[] = ["sage", "terracotta", "blue", "violet"];
const LEGACY_SCENE_TO_DESK = new Map(SLOT_SCENE_KEYS.map((sceneKey, index) => [sceneKey, DESK_KEYS[index]]));

export interface DeskSlot {
  deskKey: DeskKey;
  index: number;
  member: OfficeUser | null;
  workstationUser: OfficeUser;
}

export interface DeskSlotResult {
  slots: DeskSlot[];
  invalidMembers: OfficeUser[];
}

export function isDeskKey(value: unknown): value is DeskKey {
  return typeof value === "string" && DESK_KEYS.includes(value as DeskKey);
}

function createEmptyDeskUser(deskKey: DeskKey, index: number): OfficeUser {
  return {
    id: `empty:${deskKey}`,
    sceneKey: SLOT_SCENE_KEYS[index],
    deskKey,
    name: "等待朋友加入",
    initials: "+",
    avatarUrl: "/avatars/ming.png",
    company: "空闲工位",
    status: "offWork",
    note: "这个位置还空着",
    mood: "calm",
    statusSince: new Date(0).toISOString(),
    accent: SLOT_ACCENTS[index],
    decoration: "等待布置",
    isPlaceholder: true,
  };
}

const EMPTY_DESK_USERS = DESK_KEYS.map(createEmptyDeskUser);

function resolveDeskKey(user: OfficeUser): DeskKey | null {
  if (isDeskKey(user.deskKey)) return user.deskKey;
  const legacyKey = user.sceneKey ?? user.id;
  return LEGACY_SCENE_TO_DESK.get(legacyKey as (typeof SLOT_SCENE_KEYS)[number]) ?? null;
}

export function buildDeskSlots(users: OfficeUser[]): DeskSlotResult {
  const membersByDesk = new Map<DeskKey, OfficeUser>();
  const invalidMembers: OfficeUser[] = [];

  for (const user of users) {
    if (user.isPlaceholder) continue;
    const deskKey = resolveDeskKey(user);
    if (!deskKey || membersByDesk.has(deskKey)) {
      invalidMembers.push(user);
      continue;
    }
    membersByDesk.set(deskKey, user);
  }

  return {
    slots: DESK_KEYS.map((deskKey, index) => {
      const member = membersByDesk.get(deskKey) ?? null;
      return {
        deskKey,
        index,
        member,
        workstationUser: member ?? EMPTY_DESK_USERS[index],
      };
    }),
    invalidMembers,
  };
}

export function createSceneDebugUsers(users: OfficeUser[], memberCount: number): OfficeUser[] {
  const { slots } = buildDeskSlots(users);
  return slots.slice(0, memberCount).map((slot) => slot.member ?? {
    ...slot.workstationUser,
    id: `scene-debug:${slot.deskKey}`,
    name: `测试成员 ${slot.index + 1}`,
    initials: `${slot.index + 1}`,
    status: "working",
    note: "场景成员数量测试",
    statusSince: new Date().toISOString(),
    isPlaceholder: false,
  });
}
