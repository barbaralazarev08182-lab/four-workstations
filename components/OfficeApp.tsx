"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Buildings, CalendarBlank, DotsThree, Info, MoonStars, SignOut, Sun, UserCircle } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { OfficeScene } from "@/components/office/OfficeScene";
import { ActivityFeed } from "@/components/panels/ActivityFeed";
import { CheckInPanel } from "@/components/panels/CheckInPanel";
import { InteractionPanel } from "@/components/panels/InteractionPanel";
import { RoomInfoPanel } from "@/components/panels/RoomInfoPanel";
import { QuickActionDock } from "@/components/navigation/QuickActionDock";
import { GroupEventToast } from "@/components/feedback/GroupEventToast";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { useOfficeState } from "@/hooks/useOfficeState";
import { useInteractionsSync } from "@/hooks/useInteractionsSync";
import { useOfficeManagement } from "@/hooks/useOfficeManagement";
import { ACTIVE_STATUSES, OBJECT_STATUSES, STATUS_DEFINITIONS } from "@/lib/status";
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

export function OfficeApp({ onSignOut, onMembershipChanged }: OfficeAppProps = {}) {
  const { state, hydrated, toast, setToast, updateStatus, reactToActivity, toggleNight, dataMode, officeId, currentUserId } = useOfficeState({ onMembershipRemoved: onMembershipChanged });
  const [selectedUser, setSelectedUser] = useState<OfficeUser | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [suggestedStatuses, setSuggestedStatuses] = useState<StatusKey[]>([]);
  const [feedCollapsed, setFeedCollapsed] = useState(false);
  const [mobileFeedOpen, setMobileFeedOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [interactionEffects, setInteractionEffects] = useState<Record<string, CharacterInteractionEffect>>({});
  const [roomInfoOpen, setRoomInfoOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const effectTimers = useRef(new Map<string, number>());

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
  }, [currentUser]);

  const handleCharacterClick = useCallback((user: OfficeUser) => {
    if (user.isPlaceholder) return;
    setSelectedUser(user);
    setSuggestedStatuses([]);
    setPanelOpen(true);
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
    setMobileProfileOpen(false);
    if (dataMode === "local") {
      setToast("本地演示模式没有真实房间码");
      return;
    }
    setRoomInfoOpen(true);
    void roomManagement.refresh();
  }, [dataMode, roomManagement, setToast]);

  if (!hydrated || !state.users.some((user) => user.isCurrentUser)) {
    return <AuthStatusScreen title="正在连接共享工位" description="正在恢复办公室成员与人物位置…" />;
  }

  return (
    <main className={`office-app ${state.isNight ? "theme-night" : "theme-day"}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <motion.span whileHover={{ rotate: -5, scale: 1.06 }}><Buildings size={28} weight="duotone" /></motion.span>
          <div><h1>四人工位</h1><small>四个人，一间云办公室</small></div>
        </div>
        <div className="topbar-meta">
          <span><CalendarBlank size={18} />7月29日 周三</span>
          <span className="office-presence"><i />{officeStatus}</span>
          <button type="button" onClick={toggleNight} className="theme-toggle" aria-label={state.isNight ? "切换为日间模式" : "切换为夜间模式"}>
            {state.isNight ? <MoonStars size={18} weight="fill" /> : <Sun size={19} weight="fill" />}
            {state.isNight ? "夜间模式" : "日光模式"}
          </button>
        </div>
        <button className="room-info-button" type="button" data-testid="open-room-info" onClick={openRoomInfo}><Info size={18} weight="duotone" /><span>房间信息</span></button>
        <button className="profile-button" type="button" data-testid="profile-checkin" onClick={() => handleCharacterClick(currentUser)}>
          <Avatar user={currentUser} className={`profile-avatar avatar-${currentUser.accent}`} />
          <span><strong>我的工位</strong><small>{STATUS_DEFINITIONS[currentUser.status].label}</small></span>
        </button>
        <button className="mobile-profile-menu-button" type="button" aria-label="打开个人菜单" aria-expanded={mobileProfileOpen} onClick={() => setMobileProfileOpen((value) => !value)}><DotsThree size={21} weight="bold" /></button>
      </header>

      {mobileProfileOpen ? (
        <div className="mobile-profile-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => { setMobileProfileOpen(false); handleCharacterClick(currentUser); }}><UserCircle size={17} />更新我的状态</button>
          <button type="button" role="menuitem" onClick={openRoomInfo}><Info size={17} />房间信息</button>
          {onSignOut ? <button type="button" role="menuitem" onClick={() => { setMobileProfileOpen(false); void onSignOut(); }}><SignOut size={17} />退出登录</button> : null}
        </div>
      ) : null}

      <div className={`app-content ${feedCollapsed ? "feed-is-collapsed" : ""}`}>
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
        <ActivityFeed
          activities={state.activities}
          users={state.users}
          collapsed={feedCollapsed}
          mobileOpen={mobileFeedOpen}
          onToggle={() => setFeedCollapsed((value) => !value)}
          onMobileToggle={() => setMobileFeedOpen((value) => !value)}
          onReact={reactToActivity}
          onUserClick={handleCharacterClick}
          interactions={interactions.events}
        />
      </div>

      <QuickActionDock currentStatus={currentUser.status} moreOpen={moreOpen} onMoreToggle={() => setMoreOpen((value) => !value)} onStatus={handleQuickStatus} />

      {selectedUser?.isCurrentUser ? (
        <CheckInPanel
          key={`${selectedUser.id}-${suggestedStatuses.join("-")}-${panelOpen ? "open" : "closed"}`}
          open={panelOpen}
          user={selectedUser}
          suggestedStatuses={suggestedStatuses}
          onClose={() => setPanelOpen(false)}
          onSubmit={(status, note, mood) => updateStatus(currentUser.id, status, note, mood)}
          onSignOut={onSignOut}
        />
      ) : (
        <InteractionPanel
          key={`${selectedUser?.id ?? "none"}-${panelOpen ? "open" : "closed"}`}
          open={panelOpen}
          user={selectedUser}
          currentUserId={currentUserId ?? currentUser.id}
          events={interactions.events}
          onClose={() => setPanelOpen(false)}
          onSend={sendInteraction}
        />
      )}

      <RoomInfoPanel
        open={roomInfoOpen}
        info={roomManagement.info}
        users={state.users}
        loading={roomManagement.loading}
        busyAction={roomManagement.busyAction}
        errorMessage={roomManagement.errorMessage}
        onClose={() => setRoomInfoOpen(false)}
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
