import type { OfficeState } from "@/lib/types";

const todayAt = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const initialOfficeState: OfficeState = {
  version: 2,
  isNight: false,
  users: [
    { id: "ming", name: "小明", initials: "明", avatarUrl: "/avatars/ming.png", company: "设计实习", status: "working", note: "改完这版就收工", mood: "energized", statusSince: todayAt(9, 10), accent: "sage", decoration: "桌边的小绿植", isCurrentUser: true },
    { id: "hong", name: "小红", initials: "红", avatarUrl: "/avatars/hong.png", company: "运营实习", status: "eating", note: "楼下新开的面馆很可以", mood: "happy", statusSince: todayAt(12, 3), accent: "terracotta", decoration: "橘色保温杯" },
    { id: "jie", name: "阿杰", initials: "杰", avatarUrl: "/avatars/jie.png", company: "开发实习", status: "slacking", note: "让我缓五分钟", mood: "calm", statusSince: todayAt(15, 20), accent: "blue", decoration: "透明小鱼缸" },
    { id: "qixi", name: "七喜", initials: "七", avatarUrl: "/avatars/qixi.png", company: "产品实习", status: "meeting", note: "最后一个会，马上回来", mood: "tired", statusSince: todayAt(15, 42), accent: "violet", decoration: "紫色桌历" },
  ],
  activities: [
    { id: "a4", userId: "qixi", status: "meeting", note: "最后一个会，马上回来", time: "15:42", reactions: [{ key: "like", count: 2 }, { key: "hug", count: 2 }, { key: "coffee", count: 1 }], recentInteraction: "小红送来一杯咖啡" },
    { id: "a3", userId: "jie", status: "slacking", note: "让我缓五分钟", time: "15:20", reactions: [{ key: "like", count: 1 }, { key: "fish", count: 4 }, { key: "laugh", count: 2 }], recentInteraction: "小明戳了一下工位" },
    { id: "a2", userId: "hong", status: "eating", note: "楼下新开的面馆很可以", time: "12:03", reactions: [{ key: "like", count: 2 }, { key: "laugh", count: 2 }, { key: "coffee", count: 1 }] },
    { id: "a1", userId: "ming", status: "working", note: "改完这版就收工", time: "09:10", reactions: [{ key: "like", count: 3 }, { key: "coffee", count: 2 }, { key: "fish", count: 1 }] },
  ],
};
