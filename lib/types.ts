export type StatusKey =
  | "clockedIn"
  | "working"
  | "studying"
  | "busy"
  | "meeting"
  | "eating"
  | "coffee"
  | "resting"
  | "napping"
  | "restroom"
  | "slacking"
  | "outside"
  | "offWork"
  | "overtime";

export type MoodKey = "energized" | "calm" | "tired" | "happy" | "blank";

export type AccentKey = "sage" | "terracotta" | "blue" | "violet";

export interface OfficeUser {
  id: string;
  sceneKey?: string;
  deskKey?: string;
  name: string;
  initials: string;
  avatarUrl: string;
  company: string;
  status: StatusKey;
  note: string;
  mood: MoodKey;
  statusSince: string;
  accent: AccentKey;
  decoration: string;
  isCurrentUser?: boolean;
  isPlaceholder?: boolean;
}

export interface ActivityReaction {
  key: "like" | "coffee" | "laugh" | "hug" | "fish";
  count: number;
}

export type InteractionKind = "poke" | "send_coffee" | "reaction" | "short_message";
export type InteractionReactionKey = "like" | "laugh" | "hug" | "fish" | "cheer";

export interface InteractionEvent {
  id: string;
  officeId: string;
  senderId: string;
  receiverId: string;
  kind: InteractionKind;
  reaction?: InteractionReactionKey;
  content?: string;
  createdAt: string;
  readAt: string | null;
}

export interface CharacterInteractionEffect {
  id: string;
  targetUserId: string;
  kind: Exclude<InteractionKind, "short_message">;
  emoji?: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  status: StatusKey;
  note: string;
  time: string;
  reactions: ActivityReaction[];
  recentInteraction?: string;
}

export interface OfficeState {
  version: 2;
  users: OfficeUser[];
  activities: ActivityItem[];
  isNight: boolean;
}

export interface StatusDefinition {
  key: StatusKey;
  label: string;
  shortLabel: string;
  description: string;
  zone: "desk" | "meeting" | "dining" | "coffee" | "sofa" | "hidden";
}

export type ObjectKind = "entrance" | "computer" | "coffee" | "dining" | "meeting" | "sofa" | "restroom";
