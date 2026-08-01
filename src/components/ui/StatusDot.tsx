"use client";

import { motion } from "framer-motion";
import { STATUS_COLORS } from "@/lib/anim/tokens";
import { ACTIVE_STATUSES, type AgentStatus } from "@/lib/simulation/types";

export interface StatusDotProps {
  status: AgentStatus;
  size?: number;
  className?: string;
}

export default function StatusDot({ status, size = 8, className }: StatusDotProps) {
  const color = STATUS_COLORS[status];
  const active = ACTIVE_STATUSES.includes(status);

  return (
    <motion.span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${active ? "animate-breathe" : ""} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${Math.max(size, 6)}px ${color}66`,
      }}
      animate={status === "success" ? { scale: [1, 1.35, 1] } : undefined}
      transition={
        status === "success"
          ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    />
  );
}
