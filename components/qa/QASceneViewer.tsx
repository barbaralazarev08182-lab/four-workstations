"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { QuickActionDock } from "@/components/navigation/QuickActionDock";
import { ActivityFeed } from "@/components/panels/ActivityFeed";
import { CheckInPanel } from "@/components/panels/CheckInPanel";
import { RoomInfoPanelView } from "@/components/panels/RoomInfoPanel";
import { HudTopbar } from "@/components/hud/HudTopbar";
import { ContextInteractionMenu, type InteractionAnchor } from "@/components/hud/ContextInteractionMenu";
import { useHudSafeArea } from "@/components/hud/useHudSafeArea";
import type { MyOfficeInfo } from "@/hooks/useOfficeManagement";
import type { ActivityItem, InteractionKind, InteractionReactionKey, ObjectKind, OfficeUser, StatusKey } from "@/lib/types";
import type { CameraZoneKey } from "@/components/office-3d/scene-config";

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

const CAMERA_ZONES: { key: CameraZoneKey; label: string }[] = [
  { key: "auto", label: "Auto responsive" },
  { key: "desktop", label: "Desktop fit" },
  { key: "workstations", label: "Mobile 工位" },
  { key: "living", label: "Mobile 生活" },
  { key: "amenities", label: "Mobile 设施" },
  { key: "overview", label: "Mobile 全览" },
];

const noop = () => {};

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: "a1", userId: "ming", status: "working", note: "改完这版就收工", time: "09:10", reactions: [{ key: "like", count: 3 }] },
  { id: "a2", userId: "hong", status: "eating", note: "楼下新开的面馆很可以", time: "12:03", reactions: [{ key: "laugh", count: 2 }] },
  { id: "a3", userId: "jie", status: "slacking", note: "让我缓五分钟", time: "15:20", reactions: [{ key: "fish", count: 4 }] },
];

const MOCK_OFFICE_ADMIN: MyOfficeInfo = {
  officeId: "qa-office",
  officeName: "四人工位",
  inviteCode: "DESK-4242",
  ownerId: "ming",
  currentUserRole: "owner",
  currentUserDeskKey: "desk_1",
  memberCount: 4,
};

const MOCK_OFFICE_MEMBER: MyOfficeInfo = {
  ...MOCK_OFFICE_ADMIN,
  ownerId: "hong",
  currentUserRole: "member",
  currentUserDeskKey: "desk_1",
};

const okResult = async () => ({ ok: true, error: null });

export function QASceneViewer() {
  useHudSafeArea();
  const [preset, setPreset] = useState<PresetKey>("allWorking");
  const [isNight, setIsNight] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [cameraZone, setCameraZone] = useState<CameraZoneKey>("auto");
  const [statusSince, setStatusSince] = useState(() => new Date().toISOString());
  const [hudTest, setHudTest] = useState(false);
  const [dockMoreOpen, setDockMoreOpen] = useState(false);
  const [hudStatus, setHudStatus] = useState<StatusKey>("working");
  const [interactionAnchor, setInteractionAnchor] = useState<InteractionAnchor | null>(null);
  const [lastMockAction, setLastMockAction] = useState<string | null>(null);
  const [qaOverlay, setQaOverlay] = useState<"none" | "diary" | "status" | "settings-admin" | "settings-member" | "interaction">("none");
  const [longText, setLongText] = useState(false);
  const [activityMode, setActivityMode] = useState<"normal" | "empty" | "many">("normal");
  const [feedState, setFeedState] = useState<"normal" | "loading" | "error">("normal");

  const diaryOpen = qaOverlay === "diary";
  const statusOpen = qaOverlay === "status";
  const interactionOpen = qaOverlay === "interaction";
  const settingsRole: "none" | "admin" | "member" = qaOverlay === "settings-admin" ? "admin" : qaOverlay === "settings-member" ? "member" : "none";
  const openQaOverlay = useCallback((next: typeof qaOverlay) => {
    setQaOverlay(next);
    setDockMoreOpen(false);
  }, []);

  const mockSend = useCallback(async (input: { receiverId: string; kind: InteractionKind; reaction?: InteractionReactionKey; content?: string }) => {
    const label = input.kind === "reaction" ? `reaction:${input.reaction}` : input.kind === "short_message" ? `message:${input.content}` : input.kind;
    setLastMockAction(`${input.receiverId} ← ${label}`);
    return true;
  }, []);

  const applyPreset = useCallback((key: PresetKey) => {
    setPreset(key);
    setStatusSince(new Date().toISOString());
  }, []);

  const users = useMemo(() => {
    const statuses = PRESETS[preset].statuses;
    return BASE_USERS.map((user) => ({
      ...user,
      name: longText && user.id === "ming" ? "小明·超长名字测试用例ABCDEF" : user.name,
      status: statuses[user.id] ?? "working",
      statusSince,
    }));
  }, [preset, statusSince, longText]);

  const qaOfficeName = longText ? "四人工位·超长办公室名称测试用例XYZ" : "四人工位";

  const qaActivities = useMemo<ActivityItem[]>(() => {
    if (activityMode === "empty") return [];
    if (activityMode === "many") {
      return Array.from({ length: 24 }, (_, i) => MOCK_ACTIVITIES[i % MOCK_ACTIVITIES.length]).map((activity, i) => ({ ...activity, id: `many-${i}` }));
    }
    return MOCK_ACTIVITIES;
  }, [activityMode]);

  return (
    <div className="office-app-hud" data-active-overlay={qaOverlay} style={{ filter: grayscale ? "grayscale(1)" : "none" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <OfficeWebGLScene
          users={users}
          isNight={isNight}
          dataMode="local"
          cameraZone={cameraZone}
          interactionEffects={{}}
          coffeeGifts={[]}
          onClaimCoffee={noop}
          onCharacterClick={noop}
          onObjectClick={noop as (kind: ObjectKind, ownerId?: string) => void}
        />
      </div>
      {hudTest ? (
        <div className={`office-app-hud-overlay ${isNight ? "theme-night" : "theme-day"}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <HudTopbar
              officeName={qaOfficeName}
              onlineLabel="4 人在线"
              isNight={isNight}
              diaryOpen={diaryOpen}
              settingsOpen={settingsRole !== "none"}
              currentUser={users[0]}
              onToggleNight={() => setIsNight((v) => !v)}
              onToggleDiary={() => openQaOverlay(diaryOpen ? "none" : "diary")}
              onOpenSettings={() => openQaOverlay("settings-admin")}
              onProfileClick={() => openQaOverlay("status")}
            />
          </div>
          <div style={{ pointerEvents: "auto" }}>
            <ActivityFeed activities={qaActivities} users={users} open={diaryOpen} onClose={() => openQaOverlay("none")} onReact={noop} onUserClick={noop} interactions={[]} loading={feedState === "loading"} error={feedState === "error" ? "读取办公室日记失败，请稍后重试" : null} limit={activityMode === "many" ? 24 : 3} />
            <QuickActionDock currentStatus={hudStatus} moreOpen={dockMoreOpen} onMoreToggle={() => setDockMoreOpen((v) => !v)} onStatus={(s) => { setHudStatus(s); setDockMoreOpen(false); openQaOverlay("status"); }} />
            <CheckInPanel
              open={statusOpen}
              user={users[0]}
              suggestedStatuses={[]}
              onClose={() => openQaOverlay("none")}
              onSubmit={(s) => { setHudStatus(s); openQaOverlay("none"); }}
            />
            <ContextInteractionMenu
              key={interactionOpen ? "open" : "closed"}
              open={interactionOpen}
              user={users[1]}
              currentUserId={users[0].id}
              events={[]}
              anchor={interactionAnchor}
              onClose={() => openQaOverlay("none")}
              onSend={mockSend}
            />
            <RoomInfoPanelView
              open={settingsRole !== "none"}
              info={settingsRole === "member" ? MOCK_OFFICE_MEMBER : MOCK_OFFICE_ADMIN}
              users={users}
              loading={false}
              busyAction={null}
              errorMessage={null}
              onClose={() => openQaOverlay("none")}
              onRefresh={async () => MOCK_OFFICE_ADMIN}
              onLeave={okResult}
              onDelete={okResult}
              onTransfer={async () => ({ ok: true, error: null })}
              onNotice={noop as (message: string) => void}
            />
          </div>
        </div>
      ) : null}
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
          <button type="button" onClick={() => setHudTest((v) => !v)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: hudTest ? "#c77755" : "#333", color: "#eee", fontSize: 12 }}>
            {hudTest ? "HUD ✓" : "HUD"}
          </button>
          <button type="button" onClick={() => { setHudTest(true); setInteractionAnchor({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); openQaOverlay("interaction"); }} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: interactionOpen ? "#83719c" : "#333", color: "#eee", fontSize: 12 }}>
            互动菜单
          </button>
          <button type="button" onClick={() => { setHudTest(true); openQaOverlay("settings-admin"); }} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: settingsRole === "admin" ? "#6f8f62" : "#333", color: "#eee", fontSize: 12 }}>
            设置·房主
          </button>
          <button type="button" onClick={() => { setHudTest(true); openQaOverlay("settings-member"); }} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: settingsRole === "member" ? "#6686a8" : "#333", color: "#eee", fontSize: 12 }}>
            设置·成员
          </button>
        </div>
        {lastMockAction ? <span style={{ fontSize: 10, color: "#9ee08f" }}>mock: {lastMockAction}</span> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4, borderTop: "1px solid #444", paddingTop: 6 }}>
          <span style={{ fontSize: 11, color: "#999", width: "100%" }}>QA 数据状态</span>
          <button type="button" onClick={() => setLongText((v) => !v)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: longText ? "#d7a858" : "#333", color: "#eee", fontSize: 11 }}>
            {longText ? "长文本 ✓" : "长文本"}
          </button>
          {(["normal", "empty", "many"] as const).map((mode) => (
            <button key={mode} type="button" onClick={() => setActivityMode(mode)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: activityMode === mode ? "#7396b8" : "#333", color: "#eee", fontSize: 11 }}>
              {mode === "normal" ? "常规动态" : mode === "empty" ? "空动态" : "大量动态"}
            </button>
          ))}
          {(["normal", "loading", "error"] as const).map((fs) => (
            <button key={fs} type="button" onClick={() => setFeedState(fs)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer", background: feedState === fs ? "#c77755" : "#333", color: "#eee", fontSize: 11 }}>
              {fs === "normal" ? "正常" : fs === "loading" ? "loading" : "error"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4, borderTop: "1px solid #444", paddingTop: 6 }}>
          <span style={{ fontSize: 11, color: "#999", width: "100%" }}>镜头预设</span>
          {CAMERA_ZONES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setCameraZone(key)}
              style={{
                padding: "3px 8px", borderRadius: 6, border: "1px solid #555", cursor: "pointer",
                background: cameraZone === key ? "#77906e" : "#333", color: "#eee", fontSize: 11,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#999" }}>当前：{PRESETS[preset].label}{isNight ? " · 夜间" : ""}{grayscale ? " · 灰度" : ""} · {CAMERA_ZONES.find((z) => z.key === cameraZone)?.label}</span>
      </div>
    </div>
  );
}
