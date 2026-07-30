"use client";

import { motion } from "framer-motion";
import { getStatusLabel } from "@/lib/status";
import type { OfficeUser } from "@/lib/types";

interface WorkstationProps {
  user: OfficeUser;
  position: { left: number; top: number; width: number; height: number };
  isNight: boolean;
  onClick: () => void;
}

export function Workstation({ user, position, isNight, onClick }: WorkstationProps) {
  const isAway = ["meeting", "eating", "coffee", "resting", "napping", "restroom", "outside", "offWork"].includes(user.status);
  const lampOn = user.status === "overtime" || (user.status !== "offWork" && (!isNight || !isAway));

  return (
    <motion.button
      type="button"
      className={`workstation workstation--${user.accent} ${isAway ? "is-empty" : ""} ${lampOn ? "is-lit" : "is-dark"}`}
      style={{ left: `${position.left}%`, top: `${position.top}%`, width: `${position.width}%`, height: `${position.height}%` }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      aria-label={`${user.name}的固定工位，当前${getStatusLabel(user.status)}`}
    >
      <motion.span className="desk-lamp-glow" animate={{ opacity: lampOn ? 1 : 0 }} transition={{ duration: 0.35 }} aria-hidden="true" />
      <span className="desk-hover-label"><strong>{user.name}的工位</strong><small>{user.decoration}</small></span>
    </motion.button>
  );
}
