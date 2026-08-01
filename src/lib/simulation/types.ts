export type AgentStatus =
  | "idle"
  | "queued"
  | "thinking"
  | "tool"
  | "working"
  | "success"
  | "error";

export type LogLevel = "info" | "success" | "warn" | "debug" | "error";

export interface AgentTools {
  read: boolean;
  write: boolean;
  bash: boolean;
  db: boolean;
}

export interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  role: string;
  emoji: string;
  deptId: string | null;
  status: AgentStatus;
  currentTask: string;
  thoughts: string[];
  tools: AgentTools;
  tokens: number;
  progress: number;
  spawnedAt: number;
}

export interface LogLine {
  id: string;
  time: string;
  agentId: string;
  agentEmoji: string;
  agentName: string;
  level: LogLevel;
  message: string;
}

export interface SimState {
  agents: AgentNode[];
  log: LogLine[];
  totalTokens: number;
  activeAgents: number;
  goal: string;
  running: boolean;
  speed: number;
  cycle: number;
  tick: number;
  selectedAgentId: string;
  deployed: number;
}

export const ACTIVE_STATUSES: AgentStatus[] = [
  "queued",
  "thinking",
  "tool",
  "working",
];
