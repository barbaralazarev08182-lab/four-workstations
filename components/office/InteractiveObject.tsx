"use client";

import { motion } from "framer-motion";
import type { ObjectKind } from "@/lib/types";

interface InteractiveObjectProps {
  kind: ObjectKind;
  label: string;
  hint: string;
  position: { left: number; top: number; width: number; height: number };
  statusIndicator?: string;
  onClick: () => void;
}

export function InteractiveObject({ kind, label, hint, position, statusIndicator, onClick }: InteractiveObjectProps) {
  return (
    <motion.button
      type="button"
      className={`interactive-object object-${kind}`}
      style={{ left: `${position.left}%`, top: `${position.top}%`, width: `${position.width}%`, height: `${position.height}%` }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      aria-label={`${label}：${hint}`}
    >
      <span className="object-tooltip"><strong>{label}</strong><small>{hint}</small></span>
      {statusIndicator ? <span className="object-status">{statusIndicator}</span> : null}
    </motion.button>
  );
}
