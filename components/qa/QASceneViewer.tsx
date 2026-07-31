"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ObjectKind, OfficeUser, StatusKey } from "@/lib/types";

const OfficeWebGLScene = dynamic(
  () => import("@/components/office-3d/OfficeWebGLScene").then((module) => module.OfficeWebGLScene),
  { ssr: false, loading: () => <div style={{ display: "grid", placeItems: "center", height: "100vh", color: "#888" }}>加载 3D 场景…</div> },
);

const BASE_USERS: OfficeUser[] = [
  { id: "ming", name: "小明", initials: "明", avatarUrl: "/avatars/ming.png", company: "设计实习", status: "working", note: "改完这版就收工", mood: "energized", statusSince: new Date().toISOString(), accent: "sage", decoration: "桌边的小绿植", isCurrentUser: true },
  { id: "hong", name: "小红", initials: "红", avatarUrl: "/avatars/hong.png", company: "运营实习", status: "working", note: "在写周报", mood: "happy", statusSince: new Date().toISOString(), accent: "terracotta", decoration: "橘色保温杯" },
  { id: "jie", name: "阿杰", initials: "杰", avatarUrl: "/avatars/jie.png", company: "开发实习", status: "working", note: "调 bug 中", mood: "calm", statusSince: new Date().toISOString(), accent: "blue", decoration: "透明小鱼缸" },
  { id: "qixi", name: "七喜", initials: "七", avatarUrl: "/avatars/qixi.png", company: "产品实习", status: "working", note: "画原型", mood: "tired", statusSince: new Date().toISOString(), accent: "violet", decoration: "紫色桌历" },
];

type PresetKey = "allWorking" | "meeting" | "eating" | "slacking" | "toilet" | "offWork" | "mixed";

const PRESETS: Record<PresetKey, { label: string; statuses: Record<string, StatusKey> }> = {
  allWorking: { label: "全员工作", statuses: { ming: "working", hong: "working", jie: "working", qixi: "working" } },
  meeting: { label: "一人开会", statuses: { ming: "working", hong: "meeting", jie: "working", qixi: "working" } },
  eating: { label: "一人吃饭", statuses: { ming: "working", hong: "eating", jie: "working", qixi: "working" } },
  slacking: { label: "一人摸鱼", statuses: { ming: "working", hong: "working", jie: "slacking", qixi: "working" } },
  toilet: { label: "一人厕所", statuses: { ming: "working", hong: "working", jie: "restroom", qixi: "working" } },
  offWork: { label: "一人下班", statuses: { ming: "working", hong: "working", jie: "working", qixi: "offWork" } },
  mixed: { label: "四人不同", statuses: { ming: "working", hong: "eating", jie: "slacking", qixi: "meeting" } },
};

const noop = () => {};

export function QASceneViewer() {
  const [preset, setPreset] = useState<PresetKey>("allWorking");
  const [isNight, setIsNight] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [statusSince, setStatusSince] = useState(() => new Date().toISOString());

  const applyPreset = useCallback((key: PresetKey) => {
    setPreset(key);
    setStatusSince(new Date().toISOString());
  }, []);

  const users = useMemo(() => {
    const statuses = PRESETS[preset].statuses;
    return BASE_USERS.map((user) => ({
      ...user,
      status: statuses[user.id] ?? "working",
      statusSince,
    }));
  }, [preset, statusSince]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", filter: grayscale ? "grayscale(1)" : "none" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <OfficeWebGLScene
          users={users}
          isNight={isNight}
          dataMode="local"
          interactionEffects={{}}
          coffeeGifts={[]}
          onClaimCoffee={noop}
          onCharacterClick={noop}
          onObjectClick={noop as (kind: ObjectKind, ownerId?: string) => void}
        />
      </div>
      <div style={{
        position: "fixed", top: 8, left: 8, zIndex: 100,
        display: "flex", flexDirection: "column", gap: 6,
        background: "rgba(0,0,0,0.72)", color: "#eee", padding: "10px 12px",
        borderRadius: 10, fontSize: 13, fontFamily: "system-ui, sans-serif", maxWidth: 200,
      }}>
        <strong style={{ fontSize: 14 }}>QA 场景控制</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              style={{
                padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer",
                background: preset === key ? "#7396b8" : "#333", color: "#eee", fontSize: 12,
              }}
            >
              {PRESETS[key].label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          <button type="button" onClick={() => applyPreset("allWorking")} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: "#333", color: "#eee", fontSize: 12 }}>
            重置
          </button>
          <button type="button" onClick={() => setIsNight((v) => !v)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: isNight ? "#2a3a5c" : "#333", color: "#eee", fontSize: 12 }}>
            {isNight ? "夜间 ✓" : "日间"}
          </button>
          <button type="button" onClick={() => setGrayscale((v) => !v)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: grayscale ? "#666" : "#333", color: "#eee", fontSize: 12 }}>
            {grayscale ? "灰度 ✓" : "灰度"}
          </button>
        </div>
        <span style={{ fontSize: 11, color: "#999" }}>当前：{PRESETS[preset].label}{isNight ? " · 夜间" : ""}{grayscale ? " · 灰度" : ""}</span>
      </div>
    </div>
  );
}
