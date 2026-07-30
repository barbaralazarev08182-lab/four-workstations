import type { ObjectKind, StatusDefinition, StatusKey } from "@/lib/types";

export const STATUS_DEFINITIONS: Record<StatusKey, StatusDefinition> = {
  clockedIn: { key: "clockedIn", label: "已上班", shortLabel: "上班", description: "到工位啦", zone: "desk" },
  working: { key: "working", label: "工作中", shortLabel: "工作", description: "专注处理手头的事", zone: "desk" },
  studying: { key: "studying", label: "学习中", shortLabel: "学习", description: "打开书本充充电", zone: "desk" },
  busy: { key: "busy", label: "忙碌中", shortLabel: "忙碌", description: "先让我专注一会儿", zone: "desk" },
  meeting: { key: "meeting", label: "开会中", shortLabel: "开会", description: "去会议桌同步进度", zone: "meeting" },
  eating: { key: "eating", label: "吃饭中", shortLabel: "吃饭", description: "人是铁，饭是钢", zone: "dining" },
  coffee: { key: "coffee", label: "喝咖啡", shortLabel: "咖啡", description: "短暂补充一点能量", zone: "coffee" },
  resting: { key: "resting", label: "休息中", shortLabel: "休息", description: "去沙发放空一下", zone: "sofa" },
  napping: { key: "napping", label: "午休中", shortLabel: "午休", description: "小睡一会儿再回来", zone: "sofa" },
  restroom: { key: "restroom", label: "暂时离开", shortLabel: "厕所", description: "马上回来", zone: "hidden" },
  slacking: { key: "slacking", label: "摸鱼中", shortLabel: "摸鱼", description: "劳逸结合也是结合", zone: "desk" },
  outside: { key: "outside", label: "外出中", shortLabel: "外出", description: "离开办公室一会儿", zone: "hidden" },
  offWork: { key: "offWork", label: "已下班", shortLabel: "下班", description: "今天辛苦啦", zone: "hidden" },
  overtime: { key: "overtime", label: "加班中", shortLabel: "加班", description: "办公室最后的灯光", zone: "desk" },
};

export const OBJECT_STATUSES: Record<ObjectKind, StatusKey[]> = {
  entrance: ["clockedIn", "outside", "offWork"],
  computer: ["working", "studying", "busy"],
  coffee: ["coffee", "resting"],
  dining: ["eating"],
  meeting: ["meeting"],
  sofa: ["napping", "resting", "slacking"],
  restroom: ["restroom"],
};

export const QUICK_STATUSES: StatusKey[] = ["clockedIn", "working", "eating", "slacking", "offWork"];
export const MORE_STATUSES: StatusKey[] = ["meeting", "napping", "restroom", "coffee", "outside", "studying", "busy", "overtime"];

export const REACTION_LABELS = {
  like: "👍",
  coffee: "☕",
  laugh: "😂",
  hug: "🫂",
  fish: "🐟",
} as const;

export const MOOD_LABELS = {
  energized: "⚡",
  calm: "😌",
  tired: "🥱",
  happy: "😊",
  blank: "😶",
} as const;

export const ACTIVE_STATUSES = new Set<StatusKey>([
  "clockedIn", "working", "studying", "busy", "meeting", "eating", "coffee", "resting", "napping", "restroom", "slacking", "overtime",
]);

export function getStatusLabel(status: StatusKey) {
  return STATUS_DEFINITIONS[status].label;
}

export function getDurationLabel(isoDate: string) {
  const startedAt = Date.parse(isoDate);
  if (!Number.isFinite(startedAt)) return "刚刚";
  const minutes = Math.max(0, Math.floor((Date.now() - startedAt) / 60000));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分` : `${hours} 小时`;
}

export function nowTime() {
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}
