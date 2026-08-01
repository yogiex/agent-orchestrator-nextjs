import type { AgentStatus, LogLevel } from "./types";

export interface ScenarioLog {
  agent: string;
  level: LogLevel;
  message: string;
}

export interface ScenarioStep {
  at: number;
  agents?: Record<string, { status?: AgentStatus; currentTask?: string; thoughts?: string[]; progress?: number; tokens?: number }>;
  logs?: ScenarioLog[];
  goal?: string;
}

export const GOALS = [
  "Launch Q3 Mobile App & Marketing Campaign",
  "Scale Checkout & Ship v2.0",
  "Q4 Growth Sprint & Funnel Fix",
  "Rebuild Onboarding & SEO Push",
];

export const DEFAULT_GOAL = GOALS[0];

export function goalForCycle(cycle: number): string {
  return GOALS[Math.abs(cycle) % GOALS.length];
}

const feThoughts = [
  "> Importing React components...",
  "> composing app shell with sidebar & canvas",
  "> styling with Tailwind + dark glassmorphism",
  "> wiring simulation events to framer-motion",
];

const pfThoughts = [
  "> Pulling audience segments from data lake",
  "> computing CAC & LTV by cohort",
  "> allocating $500 to Meta Ads for iOS acquisition",
];

const daThoughts = [
  "> waiting for campaign metrics window...",
  "> building funnel query on recent events",
  "> correlating installs with ad spend",
];

export function buildScenarioSteps(): ScenarioStep[] {
  const steps: ScenarioStep[] = [];

  // t0 — CEO receives goal
  steps.push({
    at: 0,
    goal: DEFAULT_GOAL,
    logs: [
      { agent: "ceo", level: "info", message: `Goal received: "${DEFAULT_GOAL}"` },
    ],
    agents: {
      ceo: {
        status: "thinking",
        currentTask: "Parsing goal & building execution plan",
        thoughts: ["> Parsing high-level goal...", "> splitting into product, growth and business tracks..."],
      },
    },
  });

  // t1 — CEO delegates
  steps.push({
    at: 1,
    logs: [
      { agent: "ceo", level: "info", message: "Delegating tracks to Head of Product, Growth and Biz & Data..." },
    ],
    agents: {
      ceo: { status: "success", currentTask: "Goal orchestrated across 3 tracks", thoughts: [], progress: 100 },
    },
  });

  // t2 — HODs wake up
  steps.push({
    at: 2,
    logs: [
      { agent: "head-prod", level: "warn", message: "Reviewing product spec & syncing PM/UX specs..." },
      { agent: "head-growth", level: "info", message: "Spinning up acquisition engine..." },
      { agent: "head-biz", level: "debug", message: "Awaiting upstream campaign data..." },
    ],
    agents: {
      "head-prod": { status: "thinking", currentTask: "Reviewing product spec", thoughts: ["> reviewing spec", "> delegating UI/UX to designer, specs to PM..."] },
      "head-growth": { status: "working", currentTask: "Running acquisition playbook" },
      "head-biz": { status: "working", currentTask: "Preparing data pipeline" },
    },
  });

  // t3 — Head Prod delegates to engineering
  steps.push({
    at: 3,
    logs: [
      { agent: "head-prod", level: "warn", message: "Delegating UI/UX to Designer, and specs to PM..." },
    ],
    agents: {
      "head-prod": { status: "working", progress: 40, currentTask: "Delegating tracks" },
    },
  });

  // t4 — FE wakes up (focus of the inspector)
  steps.push({
    at: 4,
    logs: [
      { agent: "fe", level: "info", message: "Waking up... importing React components and styling with Tailwind..." },
    ],
    agents: {
      fe: { status: "tool", currentTask: "Importing components & styling shell", thoughts: feThoughts, progress: 5 },
    },
  });

  // t5 — FE working
  steps.push({
    at: 5,
    agents: {
      fe: { status: "working", currentTask: "Building workspace shell", progress: 25 },
    },
    logs: [
      { agent: "fe", level: "debug", message: "tool call: read_file(src/app/globals.css)" },
    ],
  });

  // t6 — Perf marketer allocates budget
  steps.push({
    at: 6,
    logs: [
      { agent: "pf", level: "info", message: "Allocating $500 budget to Meta Ads for iOS user acquisition..." },
    ],
    agents: {
      pf: { status: "tool", currentTask: "Allocating ad budget", thoughts: pfThoughts, progress: 10 },
    },
  });

  // t7 — parallel progress
  steps.push({
    at: 7,
    agents: {
      fe: { status: "working", currentTask: "Wiring canvas animations", progress: 55 },
      pf: { status: "working", currentTask: "Configuring campaign sets", progress: 40 },
    },
    logs: [
      { agent: "fe", level: "debug", message: "tool call: bash(npm run dev)" },
      { agent: "pf", level: "debug", message: "tool call: write(campaign_config.json)" },
    ],
  });

  // t8 — UX & PM join
  steps.push({
    at: 8,
    agents: {
      ux: { status: "working", currentTask: "Polishing design tokens", progress: 30 },
      pm: { status: "thinking", currentTask: "Prioritizing sprint backlog" },
    },
    logs: [
      { agent: "ux", level: "info", message: "Shipping design system v0.3..." },
      { agent: "pm", level: "warn", message: "Rescheduling sprint to unblock FE..." },
    ],
  });

  // t9 — DA picks up data
  steps.push({
    at: 9,
    agents: {
      da: { status: "thinking", currentTask: "Building funnel query", thoughts: daThoughts, progress: 10 },
      bd: { status: "queued", currentTask: "Queued for partner outreach" },
    },
    logs: [
      { agent: "da", level: "debug", message: "query: SELECT cohort, cac, ltv FROM marts.campaign..." },
    ],
  });

  // t10 — FE near done
  steps.push({
    at: 10,
    agents: {
      fe: { status: "working", currentTask: "Animating data packets on edges", progress: 85 },
    },
    logs: [
      { agent: "fe", level: "debug", message: "tool call: write(OrchestratorCanvas.tsx)" },
    ],
  });

  // t11 — Head Growth completes, BE joins
  steps.push({
    at: 11,
    agents: {
      "head-growth": { status: "success", currentTask: "Acquisition plan live", progress: 100 },
      be: { status: "working", currentTask: "Scaffolding API gateway", progress: 20 },
    },
    logs: [
      { agent: "head-growth", level: "success", message: "Campaign sets deployed ✓" },
      { agent: "be", level: "info", message: "Standing up auth service..." },
    ],
  });

  // t12 — FE success, MB joins
  steps.push({
    at: 12,
    agents: {
      fe: { status: "success", currentTask: "Workspace shell shipped", progress: 100 },
      mb: { status: "working", currentTask: "Wiring deep links", progress: 15 },
      sec: { status: "tool", currentTask: "Auditing auth & API surface", progress: 20 },
      qa: { status: "working", currentTask: "Writing E2E test suite", progress: 15 },
    },
    logs: [
      { agent: "fe", level: "success", message: "Workspace shell ready for review ✓" },
      { agent: "mb", level: "info", message: "Adding iOS universal links..." },
      { agent: "sec", level: "debug", message: "tool call: bash(scanning dependency tree)" },
      { agent: "qa", level: "info", message: "Bootstrapping Playwright E2E specs..." },
    ],
  });

  // t13 — DA finishes, SEO/CC/DM/GH activate
  steps.push({
    at: 13,
    agents: {
      da: { status: "working", currentTask: "Correlating installs vs spend", progress: 60 },
      seo: { status: "working", currentTask: "Auditing landing page", progress: 25 },
      cc: { status: "working", currentTask: "Drafting launch copy", progress: 20 },
    },
    logs: [
      { agent: "da", level: "debug", message: "query: correlation(installs, ad_spend) -> 0.72" },
      { agent: "cc", level: "info", message: "Drafting launch blog + app store copy..." },
    ],
  });

  // t14 — Head Prod completes; DM/GH on it
  steps.push({
    at: 14,
    agents: {
      "head-prod": { status: "success", currentTask: "Sprint plan locked", progress: 100 },
      gh: { status: "working", currentTask: "Running viral loops", progress: 30 },
      dm: { status: "working", currentTask: "Scheduling email drip", progress: 20 },
    },
    logs: [
      { agent: "head-prod", level: "success", message: "Sprint plan locked, eng unblocked ✓" },
      { agent: "gh", level: "info", message: "Launching referral loop A/B..." },
    ],
  });

  // t15 — wrap-up wave
  steps.push({
    at: 15,
    agents: {
      pf: { status: "success", currentTask: "Ad budget allocated", progress: 100 },
      ux: { status: "success", currentTask: "Design tokens done", progress: 100 },
      be: { status: "working", currentTask: "API gateway ready", progress: 70 },
      sec: { status: "success", currentTask: "Security audit cleared", progress: 100 },
      qa: { status: "working", currentTask: "Running full regression", progress: 60 },
    },
    logs: [
      { agent: "pf", level: "success", message: "$500 deployed to Meta Ads ✓" },
      { agent: "ux", level: "success", message: "Tokens pushed to registry ✓" },
      { agent: "sec", level: "success", message: "No critical findings — audit passed ✓" },
      { agent: "qa", level: "info", message: "Regression suite at 82% pass rate..." },
    ],
  });

  // t16 — final: CEO validates, loop ends
  steps.push({
    at: 16,
    agents: {
      ceo: { status: "success", currentTask: "Validating Q3 execution", thoughts: [], progress: 100 },
      da: { status: "success", currentTask: "Funnel report ready", progress: 100 },
      mb: { status: "working", currentTask: "Deep links wired", progress: 60 },
    },
    logs: [
      { agent: "ceo", level: "success", message: "Cycle validated — re-orchestrating..." },
    ],
  });

  return steps;
}
