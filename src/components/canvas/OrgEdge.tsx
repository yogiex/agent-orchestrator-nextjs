"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export type OrgEdgeState = "idle" | "active" | "done" | "error";

interface OrgEdgeProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  state: OrgEdgeState;
  packetColor?: string;
}

const STATIC_STYLES: Record<
  OrgEdgeState,
  { stroke: string; strokeWidth: number; strokeDasharray?: string; opacity: number }
> = {
  idle: { stroke: "#263041", strokeWidth: 1, opacity: 1 },
  active: { stroke: "#22d3ee", strokeWidth: 2, strokeDasharray: "6 6", opacity: 1 },
  done: { stroke: "#34d399", strokeWidth: 1.5, opacity: 0.7 },
  error: { stroke: "#f87171", strokeWidth: 1.5, strokeDasharray: "4 4", opacity: 1 },
};

export default function OrgEdge({
  fromX,
  fromY,
  toX,
  toY,
  state,
  packetColor,
}: OrgEdgeProps) {
  const gradId = `edge-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const midY = (fromY + toY) / 2;
  const d = `M ${fromX},${fromY} C ${fromX},${midY} ${toX},${midY} ${toX},${toY}`;
  const style = STATIC_STYLES[state];

  return (
    <g>
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
        >
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        initial={false}
        strokeDasharray={style.strokeDasharray}
        opacity={style.opacity}
        className={state === "active" ? "animate-dash-flow" : undefined}
        animate={{
          stroke: state === "active" ? `url(#${gradId})` : style.stroke,
          strokeWidth: style.strokeWidth,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      {state === "active" && (
        <circle r={4} fill={packetColor ?? "#22d3ee"}>
          <animateMotion dur="1.2s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}
