"use client";

import { motion } from "framer-motion";
import { Buildings, CalendarBlank, Info, MoonStars, Sun } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import type { OfficeUser } from "@/lib/types";

interface HudTopbarProps {
  officeName: string;
  onlineLabel: string;
  isNight: boolean;
  diaryOpen: boolean;
  settingsOpen: boolean;
  currentUser: OfficeUser;
  onToggleNight: () => void;
  onToggleDiary: () => void;
  onOpenSettings: () => void;
  onProfileClick: () => void;
}

export function HudTopbar({
  officeName,
  onlineLabel,
  isNight,
  diaryOpen,
  settingsOpen,
  currentUser,
  onToggleNight,
  onToggleDiary,
  onOpenSettings,
  onProfileClick,
}: HudTopbarProps) {
  return (
    <header className="hud-topbar">
      <div className="hud-brand">
        <motion.span whileHover={{ rotate: -5, scale: 1.06 }}><Buildings size={22} weight="duotone" /></motion.span>
        <strong className="hud-brand-name">{officeName}</strong>
      </div>
      <div className="hud-status">
        <span className="office-presence"><i />{onlineLabel}</span>
        <button type="button" className="hud-icon-button" onClick={onToggleNight} aria-label={isNight ? "切换为日间模式" : "切换为夜间模式"}>
          {isNight ? <MoonStars size={17} weight="fill" /> : <Sun size={18} weight="fill" />}
        </button>
      </div>
      <div className="hud-actions">
        <button
          type="button"
          className="hud-pill-button"
          data-testid="open-diary"
          aria-expanded={diaryOpen}
          aria-controls="office-diary"
          onClick={onToggleDiary}
        >
          <CalendarBlank size={16} weight="duotone" /><span>办公室日记</span>
        </button>
        <button
          type="button"
          className="hud-icon-button"
          data-testid="open-room-info"
          aria-label="房间信息与设置"
          aria-expanded={settingsOpen}
          onClick={onOpenSettings}
        >
          <Info size={18} weight="duotone" />
        </button>
        <button className="hud-profile-button" type="button" data-testid="profile-checkin" aria-label="我的工位" onClick={onProfileClick}>
          <Avatar user={currentUser} className={`profile-avatar avatar-${currentUser.accent}`} />
        </button>
      </div>
    </header>
  );
}
