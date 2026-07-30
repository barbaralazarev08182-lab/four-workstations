"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { getDurationLabel, getStatusLabel, STATUS_DEFINITIONS } from "@/lib/status";
import type { OfficeUser } from "@/lib/types";
import { StatusBubble } from "@/components/office/StatusBubble";

interface CharacterProps {
  user: OfficeUser;
  position: { left: number; top: number; hidden?: boolean };
  onClick: () => void;
}

type CharacterPose = "sitting" | "standing" | "eating" | "resting";

function getCharacterPose(user: OfficeUser): CharacterPose {
  if (user.status === "eating") return "eating";
  if (user.status === "resting" || user.status === "napping") return "resting";
  if (STATUS_DEFINITIONS[user.status].zone === "desk") return "sitting";
  return "standing";
}

export function Character({ user, position, onClick }: CharacterProps) {
  const hidden = Boolean(position.hidden);
  const pose = getCharacterPose(user);
  const [bubbleRemaining] = useState(() => Math.max(0, 8000 - (Date.now() - new Date(user.statusSince).getTime())));

  return (
    <motion.div
      className={`character-wrap character-wrap--${user.accent} character-pose--${pose}`}
      animate={{ left: `${position.left}%`, top: `${position.top}%`, x: "-50%", y: "-50%", opacity: hidden ? 0 : 1, scale: hidden ? 0.82 : 1 }}
      transition={{ type: "spring", stiffness: 105, damping: 20, mass: 0.9 }}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
    >
      {bubbleRemaining > 0 && !hidden ? <StatusBubble key={user.statusSince} note={user.note} hideAfterMs={bubbleRemaining} /> : null}
      <motion.button
        type="button"
        className="character"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        aria-label={`${user.name}，${getStatusLabel(user.status)}，${user.note}`}
      >
        <span className="character-figure" aria-hidden="true">
          <Image
            src={`/assets/office-v2/characters/${user.id}-${pose}.png`}
            alt=""
            fill
            sizes="160px"
            priority
          />
        </span>
        <span className="character-label">
          <strong>{user.name}</strong>
          <span><i />{getStatusLabel(user.status)} · {getDurationLabel(user.statusSince)}</span>
        </span>
      </motion.button>
    </motion.div>
  );
}
