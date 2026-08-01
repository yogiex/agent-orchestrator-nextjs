import type { AgentStatus } from "@/lib/simulation/types";

export const EASE = {
  standard: [0.4, 0, 0.2, 1] as const,
  inOut: [0.83, 0, 0.17, 1] as const,
};

export const DUR = {
  micro: 0.15,
  standard: 0.3,
  status: 0.4,
} as const;

export const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: "#64748b",
  queued: "#fbbf24",
  thinking: "#facc15",
  tool: "#22d3ee",
  working: "#8b5cf6",
  success: "#34d399",
  error: "#f87171",
};
