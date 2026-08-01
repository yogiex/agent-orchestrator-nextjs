"use client";

import { motion } from "framer-motion";
import { ACTIVE_STATUSES, type AgentNode, type AgentStatus } from "@/lib/simulation/types";

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: "#64748b",
  queued: "#fbbf24",
  thinking: "#facc15",
  tool: "#22d3ee",
  working: "#8b5cf6",
  success: "#34d399",
  error: "#f87171",
};

interface OrgNodeProps {
  agent: AgentNode;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  teamColor?: string;
  onClick: (id: string) => void;
}

export default function OrgNode({
  agent,
  x,
  y,
  width,
  height,
  selected,
  teamColor = "#38bdf8",
  onClick,
}: OrgNodeProps) {
  const active = ACTIVE_STATUSES.includes(agent.status);
  const color = STATUS_COLORS[agent.status];
  const cx = x + width / 2;
  const cy = y + height / 2;

  const stroke = selected
    ? "#38bdf8"
    : active
      ? color
      : agent.status === "success"
        ? "#34d399"
        : agent.status === "error"
          ? "#f87171"
          : "#1f2937";
  const strokeOpacity = selected ? 1 : active ? 0.6 : 1;
  const strokeWidth = selected ? 2 : active ? 1.5 : 1;

  const maxChars = Math.max(6, Math.floor((width - 24) / 5));
  const task =
    agent.currentTask.length > maxChars
      ? `${agent.currentTask.slice(0, maxChars - 1)}…`
      : agent.currentTask;

  return (
    <motion.g
      onClick={() => onClick(agent.id)}
      style={{ cursor: "pointer", transformBox: "fill-box", transformOrigin: "center" }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {active && (
        <motion.circle
          cx={cx}
          cy={cy}
          fill={color}
          initial={false}
          animate={{ opacity: [0.12, 0.28, 0.12], r: [40, 48, 40] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(12px)" }}
        />
      )}
      {agent.status === "success" && (
        <motion.circle
          cx={cx}
          cy={cy}
          fill="none"
          stroke="#34d399"
          strokeWidth={2}
          initial={{ r: 60, opacity: 0.8 }}
          animate={{ r: 84, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        fill="#0c0f16"
        initial={false}
        animate={{ stroke, strokeOpacity, strokeWidth }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={3}
        rx={1.5}
        fill={teamColor}
        opacity={selected ? 1 : 0.85}
      />
      <circle cx={x + 17} cy={cy} r={12} fill={teamColor} opacity={0.12} />
      <circle
        cx={x + width - 9}
        cy={y + 9}
        r={3}
        fill={color}
        className={active ? "animate-breathe" : undefined}
      />
      {active && (
        <circle
          cx={x + width - 9}
          cy={y + 9}
          r={6}
          fill={color}
          opacity={0.35}
          style={{ filter: "blur(3px)" }}
          className="animate-breathe"
        />
      )}
      <text
        x={x + 17}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={15}
      >
        {agent.emoji}
      </text>
      <text
        x={x + 33}
        y={cy - 3}
        fontSize={13}
        fontWeight={600}
        fill="#e7e9ee"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {agent.shortName}
      </text>
      <text
        x={x + 33}
        y={cy + 11}
        fontSize={9.5}
        fill="#8b93a5"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {task}
      </text>
      {agent.progress > 0 && active && (
        <>
          <rect
            x={x + 8}
            y={y + height - 8}
            width={width - 16}
            height={3}
            rx={1.5}
            fill="rgba(148,163,184,0.18)"
          />
          <rect
            x={x + 8}
            y={y + height - 8}
            width={Math.max(0, Math.min(1, agent.progress / 100)) * (width - 16)}
            height={3}
            rx={1.5}
            fill={color}
          />
        </>
      )}
    </motion.g>
  );
}
