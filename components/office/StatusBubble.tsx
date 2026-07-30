"use client";

import { motion } from "framer-motion";

export function StatusBubble({ note, hideAfterMs }: { note: string; hideAfterMs: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.97 }}
      animate={{ opacity: [0, 1, 1, 0], y: [5, 0, 0, -3], scale: [0.97, 1, 1, 1] }}
      transition={{ duration: hideAfterMs / 1000, times: [0, 0.08, 0.78, 1], ease: "easeOut" }}
      className="status-bubble"
      role="status"
    >
      {note}
    </motion.div>
  );
}
