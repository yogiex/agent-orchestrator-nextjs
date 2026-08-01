export const CEO_COLOR = "#38bdf8";

export interface DepartmentInfo {
  id: string;
  headId: string;
  label: string;
  emoji: string;
  tagline: string;
  color: string;
}

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  "head-prod": {
    id: "prod",
    headId: "head-prod",
    label: "PRODUCT",
    emoji: "📦",
    tagline: "Build & Ship",
    color: "#818cf8",
  },
  "head-growth": {
    id: "growth",
    headId: "head-growth",
    label: "GROWTH",
    emoji: "📈",
    tagline: "Reach & Convert",
    color: "#34d399",
  },
  "head-biz": {
    id: "biz",
    headId: "head-biz",
    label: "BIZ & DATA",
    emoji: "💼",
    tagline: "Measure & Monetize",
    color: "#fbbf24",
  },
};

export const CYCLE_LEADS = ["head-prod", "head-prod", "head-growth", "head-biz"];

export function leaderForCycle(cycle: number): string {
  return CYCLE_LEADS[Math.abs(cycle) % CYCLE_LEADS.length];
}

export function teamColorFor(agent: { id: string; deptId: string | null }): string {
  const own = DEPARTMENTS[agent.id];
  if (own) return own.color;
  if (agent.deptId) {
    const dept = DEPARTMENTS[agent.deptId];
    if (dept) return dept.color;
  }
  return CEO_COLOR;
}
