import { AGENTS } from "./agents";
import { buildScenarioSteps, DEFAULT_GOAL, goalForCycle } from "./scenarios";
import type { AgentNode, AgentStatus, LogLine, SimState } from "./types";
import { ACTIVE_STATUSES } from "./types";

export const LOG_LIMIT = 120;
export const SCENARIO_LOOP_AT = 17;

export const SPAWN_WAVES: Record<number, string[]> = {
  0: ["ceo"],
  1: ["head-prod", "head-growth", "head-biz"],
  4: ["fe"],
  6: ["pf"],
  8: ["ux", "pm"],
  9: ["da", "bd"],
  11: ["be"],
  12: ["mb", "sec", "qa"],
  13: ["seo", "cc"],
  14: ["gh", "dm"],
};

export interface TickAction {
  type: "TICK";
}
export interface DeployAction {
  type: "DEPLOY";
}
export interface PauseAction {
  type: "PAUSE";
}
export interface ResumeAction {
  type: "RESUME";
}
export interface SpeedAction {
  type: "SET_SPEED";
  speed: number;
}
export interface SelectAction {
  type: "SELECT";
  agentId: string;
}

export type SimAction =
  | TickAction
  | DeployAction
  | PauseAction
  | ResumeAction
  | SpeedAction
  | SelectAction;

export const SPEEDS = [0.5, 1, 2, 4] as const;

const BACKGROUND_TASKS: Record<string, string[]> = {
  ceo: [
    "Reviewing cross-team reports",
    "Auditing pipeline throughput",
    "Scanning for bottlenecks",
    "Balancing team capacity",
  ],
  "head-prod": [
    "Aligning roadmap with CEO",
    "Reviewing PRD backlog",
    "Synchronizing sprint scope",
    "Forecasting delivery risk",
  ],
  pm: [
    "Grooming product backlog",
    "Refining user stories",
    "Tracking release milestones",
    "Syncing stakeholder expectations",
  ],
  ux: [
    "Auditing design system consistency",
    "Prototyping next screen flow",
    "Reviewing accessibility tokens",
    "Updating UI inventory",
  ],
  fe: [
    "Refactoring component library",
    "Auditing bundle size",
    "Polishing motion easing",
    "Fixing cross-browser quirks",
  ],
  be: [
    "Hardening API rate limits",
    "Reviewing auth middleware",
    "Optimizing DB queries",
    "Instrumenting service logs",
  ],
  mb: [
    "Syncing push notification config",
    "Testing deep-link fallbacks",
    "Reviewing app store metadata",
    "Profiling cold-start time",
  ],
  sec: [
    "Auditing API auth & tokens",
    "Scanning dependencies for CVEs",
    "Reviewing secrets handling",
    "Pentesting public endpoints",
  ],
  qa: [
    "Running regression suite",
    "Writing E2E test cases",
    "Validating edge-case flows",
    "Triaging flaky tests",
  ],
  "head-growth": [
    "Reviewing acquisition funnel",
    "Reallocating channel budgets",
    "Forecasting CAC trend",
    "Piloting referral experiment",
  ],
  gh: [
    "A/B testing landing variants",
    "Mining viral loop ideas",
    "Analyzing activation cohort",
    "Drafting referral incentives",
  ],
  pf: [
    "Optimizing ROAS by channel",
    "Scheduling new creative sets",
    "Reviewing bid strategy",
    "Segmenting lookalike audiences",
  ],
  seo: [
    "Crawling for broken links",
    "Updating meta schema",
    "Monitoring SERP positions",
    "Building internal link graph",
  ],
  cc: [
    "Drafting case-study outline",
    "Repurposing blog into socials",
    "Refreshing email copy",
    "Storyboarding video short",
  ],
  dm: [
    "Monitoring campaign LTV",
    "Segmenting email drip",
    "Reviewing funnel drop-off",
    "Scheduling social posts",
  ],
  "head-biz": [
    "Aligning OKRs with finance",
    "Reviewing partner pipeline",
    "Forecasting revenue mix",
    "Preparing board metrics",
  ],
  bd: [
    "Qualifying inbound leads",
    "Drafting partnership deck",
    "Scheduling demo follow-ups",
    "Mapping enterprise accounts",
  ],
  da: [
    "Refreshing KPI dashboards",
    "Building churn cohort query",
    "Validating funnel metrics",
    "Forecasting Q3 run-rate",
  ],
};

function backgroundTaskFor(id: string, tick: number): string {
  const tasks = BACKGROUND_TASKS[id] ?? ["Working background tasks"];
  return tasks[Math.abs(tick) % tasks.length];
}

let logSeq = 0;

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function clock(offset = 0): string {
  const d = new Date(Date.now() + offset);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function makeLog(
  agent: AgentNode,
  level: LogLine["level"],
  message: string,
): LogLine {
  logSeq += 1;
  return {
    id: `log-${logSeq}`,
    time: clock(),
    agentId: agent.id,
    agentEmoji: agent.emoji,
    agentName: agent.shortName,
    level,
    message,
  };
}

export function createInitialState(): SimState {
  const agents = AGENTS.map((a) => ({
    ...a,
    status: "queued" as AgentStatus,
    currentTask: backgroundTaskFor(a.id, 0),
    thoughts: [...a.thoughts],
    spawnedAt: -1,
  }));
  const goal = DEFAULT_GOAL;
  return {
    agents,
    log: [],
    totalTokens: 12_400,
    activeAgents: agents.length,
    goal,
    running: true,
    speed: 1,
    cycle: 0,
    tick: -1,
    selectedAgentId: "fe",
    deployed: 0,
  };
}

function computeActive(agents: AgentNode[]): number {
  return agents.filter((a) => a.status !== "idle").length;
}

function applyStep(state: SimState, at: number): SimState {
  const steps = buildScenarioSteps();
  let step = steps.find((s) => s.at === at);
  if (!step) return state;

  if (at === 0) {
    const goal = goalForCycle(state.cycle);
    step = {
      ...step,
      goal,
      logs: (step.logs ?? []).map((l) =>
        l.message.includes("Goal received:")
          ? { ...l, message: `Goal received: "${goal}"` }
          : l,
      ),
    };
  }

  const agents = state.agents.map((a) => {
    const patch = step.agents?.[a.id];
    if (!patch) return a;
    return {
      ...a,
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.currentTask !== undefined ? { currentTask: patch.currentTask } : {}),
      ...(patch.thoughts !== undefined ? { thoughts: [...patch.thoughts] } : {}),
      ...(patch.progress !== undefined ? { progress: patch.progress } : {}),
      ...(patch.tokens !== undefined ? { tokens: a.tokens + patch.tokens } : {}),
    };
  });

  const logs = [...state.log];
  for (const l of step.logs ?? []) {
    const agent = agents.find((a) => a.id === l.agent) ?? agents[0];
    logs.push(makeLog(agent, l.level, l.message));
  }
  while (logs.length > LOG_LIMIT) logs.shift();

  return {
    ...state,
    agents,
    log: logs,
    goal: step.goal ?? state.goal,
    activeAgents: computeActive(agents),
  };
}

function advanceToken(state: SimState, tick: number): SimState {
  const activeBoost = state.activeAgents;
  const delta = Math.round((60 + activeBoost * 22) * (tick % 4 === 0 ? 1.4 : 1));
  const agents = state.agents.map((a) =>
    ACTIVE_STATUSES.includes(a.status) ? { ...a, tokens: a.tokens + Math.round(delta / 6) } : a,
  );
  return {
    ...state,
    agents,
    totalTokens: state.totalTokens + delta,
  };
}

function resetCycle(state: SimState, tick: number): SimState {
  const agents = state.agents.map((a) => ({
    ...a,
    status: "queued" as AgentStatus,
    currentTask: backgroundTaskFor(a.id, tick),
    thoughts: [],
    progress: 0,
    spawnedAt: -1,
  }));
  return { ...state, agents };
}

function markSpawned(state: SimState, tick: number): SimState {
  const wave = SPAWN_WAVES[tick];
  if (!wave) return state;
  const agents = state.agents.map((a) =>
    a.spawnedAt < 0 && wave.includes(a.id) ? { ...a, spawnedAt: tick } : a,
  );
  return { ...state, agents };
}

function fillIdle(state: SimState, tick: number): SimState {
  const agents = state.agents.map((a) =>
    a.status === "idle"
      ? {
          ...a,
          status: "working" as AgentStatus,
          currentTask: backgroundTaskFor(a.id, tick),
        }
      : a,
  );
  return { ...state, agents };
}

function reducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case "PAUSE":
      return { ...state, running: false };
    case "RESUME":
      return { ...state, running: true };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SELECT":
      return { ...state, selectedAgentId: action.agentId };
    case "DEPLOY": {
      const reset = resetCycle(
        {
          ...state,
          cycle: state.cycle + 1,
          deployed: state.deployed + 1,
          running: true,
        },
        0,
      );
      const ceo = reset.agents.find((a) => a.id === "ceo") ?? reset.agents[0];
      return {
        ...reset,
        log: [...reset.log, makeLog(ceo, "info", "Deploying all agents...")],
        tick: -1,
      };
    }
    case "TICK": {
      const nextTick = state.tick + 1;
      let next: SimState;

      if (nextTick >= SCENARIO_LOOP_AT) {
        const cycle = state.cycle + 1;
        const reset = resetCycle({ ...state, tick: 0, cycle }, 0);
        const ceo = reset.agents.find((a) => a.id === "ceo") ?? reset.agents[0];
        next = {
          ...reset,
          log: [
            ...reset.log,
            makeLog(
              ceo,
              "success",
              `Cycle #${state.cycle} complete — re-orchestrating new goal...`,
            ),
          ],
        };
        next = applyStep(next, 0);
      } else {
        next = applyStep(state, nextTick);
        next = { ...next, tick: nextTick };
      }

      next = markSpawned(next, nextTick >= SCENARIO_LOOP_AT ? 0 : nextTick);
      next = fillIdle(next, nextTick);
      return advanceToken(next, nextTick);
    }
    default:
      return state;
  }
}

export { reducer };
