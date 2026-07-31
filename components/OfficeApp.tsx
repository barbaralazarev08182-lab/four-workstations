"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OfficeScene } from "@/components/office/OfficeScene";
import { ActivityFeed } from "@/components/panels/ActivityFeed";
import { CheckInPanel } from "@/components/panels/CheckInPanel";
import { RoomInfoPanel } from "@/components/panels/RoomInfoPanel";
import { QuickActionDock } from "@/components/navigation/QuickActionDock";
import { GroupEventToast } from "@/components/feedback/GroupEventToast";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { HudTopbar } from "@/components/hud/HudTopbar";
import { ContextInteractionMenu, type InteractionAnchor } from "@/components/hud/ContextInteractionMenu";
import { useHudSafeArea } from "@/components/hud/useHudSafeArea";
import { useOfficeState } from "@/hooks/useOfficeState";
import { useInteractionsSync } from "@/hooks/useInteractionsSync";
import { useOfficeManagement } from "@/hooks/useOfficeManagement";
import { ACTIVE_STATUSES, OBJECT_STATUSES } from "@/lib/status";
import type { CharacterInteractionEffect, InteractionEvent, InteractionKind, InteractionReactionKey, ObjectKind, OfficeUser, StatusKey } from "@/lib/types";

const CONNECTING_USER: OfficeUser = {
  id: "connecting-user",
  name: "正在连接",
  initials: "…",
  avatarUrl: "/avatars/ming.png",
  company: "共享工位",
  status: "offWork",
  note: "正在连接共享工位",
  mood: "calm",
  statusSince: new Date(0).toISOString(),
  accent: "sage",
  decoration: "等待同步",
  isCurrentUser: true,
};

interface OfficeAppProps {
  onSignOut?: () => Promise<{ error: string | null }>;
  onMembershipChanged?: () => void | Promise<void>;
}

type ActiveOverlay = "none" | "diary" | "status" | "settings" | "interaction";

export function OfficeApp({ onSignOut, onMembershipChanged }: OfficeAppProps = {}) {
  const { state, hydrated, toast, setToast, updateStatus, reactToActivity, toggleNight, dataMode, officeId, currentUserId } = useOfficeState({ onMembershipRemoved: onMembershipChanged });
  useHudSafeArea();
  const [selectedUser, setSelectedUser] = useState<OfficeUser | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [suggestedStatuses, setSuggestedStatuses] = useState<StatusKey[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>("none");
  const [interactionAnchor, setInteractionAnchor] = useState<InteractionAnchor | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [interactionEffects, setInteractionEffects] = useState<Record<string, CharacterInteractionEffect>>({});
  const [roomInfoOpen, setRoomInfoOpen] = useState(false);
  const effectTimers = useRef(new Map<string, number>());
  const sceneRootRef = useRef<HTMLDivElement>(null);

  const openOverlay = useCallback((overlay: ActiveOverlay) => {
    setActiveOverlay(overlay);
    setMoreOpen(false);
    setPanelOpen(false);
    setRoomInfoOpen(false);
  }, []);
  const closeOverlay = useCallback(() => {
    setActiveOverlay("none");
    setPanelOpen(false);
    setRoomInfoOpen(false);
    setMoreOpen(false);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const viewport = window.visualViewport;
    const onViewportResize = () => {
      if (!viewport) return;
      document.documentElement.style.setProperty("--hud-viewport-height", `${viewport.height}px`);
    };
    onViewportResize();
    viewport?.addEventListener("resize", onViewportResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      viewport?.removeEventListener("resize", onViewportResize);
    };
  }, []);

  const currentUser = state.users.find((user) => user.isCurrentUser) ?? state.users[0] ?? CONNECTING_USER;
  const onlineCount = state.users.filter((user) => ACTIVE_STATUSES.has(user.status)).length;
  const officeStatus = useMemo(() => {
    if (state.users.every((user) => user.status === "offWork")) return "今日已收工";
    if (state.users.filter((user) => user.status === "slacking").length >= 3) return "摸鱼浓度偏高";
    return `${onlineCount} 人在线`;
  }, [onlineCount, state.users]);

  const openOwnCheckIn = useCallback((statuses: StatusKey[] = []) => {
    setSelectedUser(currentUser);
    setSuggestedStatuses(statuses);
    setPanelOpen(true);
    setMoreOpen(false);
    setActiveOverlay("status");
  }, [currentUser]);

  const handleCharacterClick = useCallback((user: OfficeUser, anchor?: InteractionAnchor) => {
    if (user.isPlaceholder) return;
    setSelectedUser(user);
    setSuggestedStatuses([]);
    if (user.isCurrentUser) {
      setPanelOpen(true);
      setActiveOverlay("status");
      return;
    }
    setInteractionAnchor(anchor ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setPanelOpen(true);
    setActiveOverlay("interaction");
  }, []);

  const handleObjectClick = useCallback((kind: ObjectKind, ownerId?: string) => {
    if (ownerId && ownerId !== currentUser.id) {
      const owner = state.users.find((user) => user.id === ownerId);
      if (owner) handleCharacterClick(owner);
      return;
    }
    openOwnCheckIn(OBJECT_STATUSES[kind]);
  }, [currentUser.id, handleCharacterClick, openOwnCheckIn, state.users]);

  const handleQuickStatus = useCallback((status: StatusKey) => openOwnCheckIn([status]), [openOwnCheckIn]);

  const handleInteractionEffect = useCallback((effect: CharacterInteractionEffect) => {
    setInteractionEffects((current) => ({ ...current, [effect.targetUserId]: effect }));
    const previousTimer = effectTimers.current.get(effect.targetUserId);
    if (previousTimer) window.clearTimeout(previousTimer);
    const timer = window.setTimeout(() => {
      setInteractionEffects((current) => {
        if (current[effect.targetUserId]?.id !== effect.id) return current;
        const next = { ...current };
        delete next[effect.targetUserId];
        return next;
      });
      effectTimers.current.delete(effect.targetUserId);
    }, 2800);
    effectTimers.current.set(effect.targetUserId, timer);
  }, []);

  useEffect(() => () => {
    effectTimers.current.forEach((timer) => window.clearTimeout(timer));
    effectTimers.current.clear();
  }, []);

  const handleIncomingInteraction = useCallback((event: InteractionEvent) => {
    const sender = state.users.find((user) => user.id === event.senderId);
    const receiver = state.users.find((user) => user.id === event.receiverId);
    if (!sender || !receiver) return;
    if (event.receiverId === (currentUserId ?? currentUser.id)) {
      const message = event.kind === "poke"
        ? `${sender.name}戳了你一下`
        : event.kind === "send_coffee"
          ? `${sender.name}给你送来一杯咖啡`
          : event.kind === "reaction"
            ? `${sender.name}给你发来回应`
            : `${sender.name}：${event.content}`;
      setToast(message);
    }
  }, [currentUser.id, currentUserId, setToast, state.users]);

  const interactions = useInteractionsSync({
    officeId,
    currentUserId: currentUserId ?? (dataMode === "local" ? currentUser.id : null),
    localMode: dataMode === "local",
    onEffect: handleInteractionEffect,
    onIncoming: handleIncomingInteraction,
    onError: (message) => setToast(`互动同步失败：${message}`),
  });
  const roomManagement = useOfficeManagement({
    officeId,
    currentUserId,
    enabled: dataMode !== "local" && Boolean(officeId && currentUserId),
    onMembershipEnded: onMembershipChanged,
  });

  const sendInteraction = useCallback(async (input: { receiverId: string; kind: InteractionKind; reaction?: InteractionReactionKey; content?: string }) => {
    const result = await interactions.sendInteraction(input);
    if (!result.ok) {
      setToast(`发送失败：${result.error}`);
      return false;
    }
    const receiver = state.users.find((user) => user.id === input.receiverId);
    setToast(receiver ? `已发送给${receiver.name}` : "互动已发送");
    return true;
  }, [interactions, setToast, state.users]);

  const openRoomInfo = useCallback(() => {
    if (dataMode === "local") {
      setToast("本地演示模式没有真实房间码");
      return;
    }
    setRoomInfoOpen(true);
    setActiveOverlay("settings");
    void roomManagement.refresh();
  }, [dataMode, roomManagement, setToast]);

  if (!hydrated || !state.users.some((user) => user.isCurrentUser)) {
    return <AuthStatusScreen title="正在连接共享工位" description="正在恢复办公室成员与人物位置…" />;
  }

  return (
    <main className={`office-app office-app-hud ${state.isNight ? "theme-night" : "theme-day"}`} data-active-overlay={activeOverlay}>
      <div className="office-stage" ref={sceneRootRef} tabIndex={-1} role="region" aria-label="办公室3D场景">
        <OfficeScene
          users={state.users}
          isNight={state.isNight}
          hydrated={hydrated}
          dataMode={dataMode}
          interactionEffects={interactionEffects}
          coffeeGifts={interactions.coffeeGifts}
          onClaimCoffee={interactions.claimCoffee}
          onCharacterClick={handleCharacterClick}
          onObjectClick={handleObjectClick}
        />
      </div>

      <HudTopbar
        officeName="四人工位"
        onlineLabel={officeStatus}
        isNight={state.isNight}
        diaryOpen={activeOverlay === "diary"}
        settingsOpen={roomInfoOpen}
        currentUser={currentUser}
        onToggleNight={toggleNight}
        onToggleDiary={() => (activeOverlay === "diary" ? closeOverlay() : openOverlay("diary"))}
        onOpenSettings={openRoomInfo}
        onProfileClick={() => handleCharacterClick(currentUser)}
      />

      <ActivityFeed
        activities={state.activities}
        users={state.users}
        open={activeOverlay === "diary"}
        onClose={closeOverlay}
        onReact={reactToActivity}
        onUserClick={handleCharacterClick}
        interactions={interactions.events}
      />

      <QuickActionDock currentStatus={currentUser.status} moreOpen={moreOpen} onMoreToggle={() => setMoreOpen((value) => !value)} onStatus={handleQuickStatus} />

      {selectedUser?.isCurrentUser ? (
        <CheckInPanel
          key={`${selectedUser.id}-${suggestedStatuses.join("-")}-${panelOpen ? "open" : "closed"}`}
          open={panelOpen && activeOverlay === "status"}
          user={selectedUser}
          suggestedStatuses={suggestedStatuses}
          onClose={() => { setPanelOpen(false); closeOverlay(); }}
          onSubmit={(status, note, mood) => updateStatus(currentUser.id, status, note, mood)}
          onSignOut={onSignOut}
          fallbackFocusRef={sceneRootRef}
        />
      ) : (
        <ContextInteractionMenu
          key={`${selectedUser?.id ?? "none"}-${panelOpen ? "open" : "closed"}`}
          open={panelOpen && activeOverlay === "interaction"}
          user={selectedUser}
          currentUserId={currentUserId ?? currentUser.id}
          events={interactions.events}
          anchor={interactionAnchor}
          onClose={() => { setPanelOpen(false); closeOverlay(); }}
          onSend={sendInteraction}
          fallbackFocusRef={sceneRootRef}
        />
      )}

      <RoomInfoPanel
        open={roomInfoOpen && activeOverlay === "settings"}
        info={roomManagement.info}
        users={state.users}
        loading={roomManagement.loading}
        busyAction={roomManagement.busyAction}
        errorMessage={roomManagement.errorMessage}
        onClose={() => { setRoomInfoOpen(false); closeOverlay(); }}
        onRefresh={roomManagement.refresh}
        onLeave={roomManagement.leaveOffice}
        onDelete={roomManagement.deleteOffice}
        onTransfer={roomManagement.transferOwnership}
        onNotice={setToast}
      />

      <GroupEventToast message={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}
