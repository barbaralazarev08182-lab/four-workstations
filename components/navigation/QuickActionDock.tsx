"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Coffee, DotsThree, DoorOpen, FishSimple, ForkKnife, Laptop, MoonStars, Presentation, Student, ToiletPaper } from "@phosphor-icons/react";
import { MORE_STATUSES, QUICK_STATUSES, STATUS_DEFINITIONS } from "@/lib/status";
import type { StatusKey } from "@/lib/types";

interface QuickActionDockProps {
  currentStatus: StatusKey;
  moreOpen: boolean;
  onMoreToggle: () => void;
  onStatus: (status: StatusKey) => void;
}

const statusIcons: Partial<Record<StatusKey, React.ReactNode>> = {
  clockedIn: <Briefcase weight="duotone" />,
  working: <Laptop weight="duotone" />,
  eating: <ForkKnife weight="duotone" />,
  slacking: <FishSimple weight="duotone" />,
  offWork: <DoorOpen weight="duotone" />,
  meeting: <Presentation weight="duotone" />,
  napping: <MoonStars weight="duotone" />,
  restroom: <ToiletPaper weight="duotone" />,
  coffee: <Coffee weight="duotone" />,
  outside: <DoorOpen weight="duotone" />,
  studying: <Student weight="duotone" />,
  busy: <Briefcase weight="duotone" />,
  overtime: <MoonStars weight="duotone" />,
};

export function QuickActionDock({ currentStatus, moreOpen, onMoreToggle, onStatus }: QuickActionDockProps) {
  return (
    <div className="quick-dock-wrap">
      <AnimatePresence>
        {moreOpen ? (
          <motion.div className="more-actions" initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}>
            {MORE_STATUSES.map((status) => (
              <button key={status} type="button" onClick={() => onStatus(status)}>
                {statusIcons[status]}<span>{STATUS_DEFINITIONS[status].shortLabel}</span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <nav className="quick-dock" aria-label="快捷状态操作">
        {QUICK_STATUSES.map((status) => (
          <button key={status} type="button" className={currentStatus === status ? "is-active" : ""} onClick={() => onStatus(status)}>
            {statusIcons[status]}<span>{STATUS_DEFINITIONS[status].shortLabel}</span>
          </button>
        ))}
        <button type="button" className={moreOpen ? "is-active" : ""} onClick={onMoreToggle} aria-expanded={moreOpen}>
          <DotsThree weight="bold" /><span>更多</span>
        </button>
      </nav>
    </div>
  );
}

