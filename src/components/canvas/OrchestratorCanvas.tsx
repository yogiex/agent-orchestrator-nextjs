"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { ACTIVE_STATUSES, type AgentNode } from "@/lib/simulation/types";
import { getChildren } from "@/lib/simulation/agents";
import { leaderForCycle, teamColorFor } from "@/lib/simulation/teams";
import OrgNode from "./OrgNode";
import OrgEdge, { type OrgEdgeState } from "./OrgEdge";
import GroupRegion from "./GroupRegion";

const NODE_WIDTH = 120;
const NODE_HEIGHT = 52;
const VIEW_WIDTH = 1240;
const VIEW_HEIGHT = 560;
const LAYER_Y = [40, 170, 300];
const PAD_X = 24;
const GROUP_GAP = 36;
const SPACING = 145;
const MAX_PER_ROW = 3;
const MEMBER_ROW_GAP = 62;

export interface OrgEdgeSpec {
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface OrgGroup {
  headId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OrgLayout {
  positions: Record<string, { x: number; y: number }>;
  edges: OrgEdgeSpec[];
  groups: OrgGroup[];
}

export function computeOrgLayout(agents: AgentNode[]): OrgLayout {
  const positions: Record<string, { x: number; y: number }> = {};
  const edges: OrgEdgeSpec[] = [];
  const groups: OrgGroup[] = [];

  const roots = getChildren(agents, null);
  const branches = roots.flatMap((root) =>
    getChildren(agents, root.id).map((head) => ({
      head,
      members: getChildren(agents, head.id),
    })),
  );

  const chunkIntoRows = <T,>(items: T[], max = MAX_PER_ROW): T[][] => {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += max) rows.push(items.slice(i, i + max));
    return rows.length ? rows : [[]];
  };

  const groupWidths = branches.map((b) => {
    const rows = chunkIntoRows(b.members);
    return Math.max(
      NODE_WIDTH,
      ...rows.map((r) => (r.length - 1) * SPACING + NODE_WIDTH),
    );
  });

  const available = VIEW_WIDTH - PAD_X * 2;
  const totalW =
    groupWidths.reduce((acc, w) => acc + w, 0) + Math.max(0, branches.length - 1) * GROUP_GAP;

  let cursor = PAD_X + (available - totalW) / 2;
  const headCenters: number[] = [];

  branches.forEach((b, i) => {
    const groupCenter = cursor + groupWidths[i] / 2;
    positions[b.head.id] = { x: groupCenter - NODE_WIDTH / 2, y: LAYER_Y[1] };
    headCenters.push(groupCenter);

    const rows = chunkIntoRows(b.members);
    rows.forEach((row, r) => {
      row.forEach((m, j) => {
        const mc = groupCenter + (j - (row.length - 1) / 2) * SPACING;
        positions[m.id] = { x: mc - NODE_WIDTH / 2, y: LAYER_Y[2] + r * MEMBER_ROW_GAP };
      });
    });

    const memberBottom =
      rows.length > 0
        ? LAYER_Y[2] + (rows.length - 1) * MEMBER_ROW_GAP + NODE_HEIGHT
        : LAYER_Y[2];
    const groupPad = 12;
    groups.push({
      headId: b.head.id,
      x: groupCenter - groupWidths[i] / 2 - groupPad,
      y: LAYER_Y[1] - 40,
      width: groupWidths[i] + groupPad * 2,
      height: memberBottom - (LAYER_Y[1] - 40) + 12,
    });

    cursor += groupWidths[i] + GROUP_GAP;
  });

  const treeCenter =
    headCenters.length > 0
      ? headCenters.reduce((acc, c) => acc + c, 0) / headCenters.length
      : VIEW_WIDTH / 2;

  roots.forEach((root, i) => {
    const rx = treeCenter + (i - (roots.length - 1) / 2) * (NODE_WIDTH + 140);
    positions[root.id] = { x: rx - NODE_WIDTH / 2, y: LAYER_Y[0] };
  });

  const nodeCenter = (p: { x: number; y: number }) => ({
    x: p.x + NODE_WIDTH / 2,
    y: p.y + NODE_HEIGHT,
  });

  for (const root of roots) {
    const rp = positions[root.id];
    if (!rp) continue;
    for (const head of getChildren(agents, root.id)) {
      const hp = positions[head.id];
      if (!hp) continue;
      const r = nodeCenter(rp);
      const h = nodeCenter(hp);
      edges.push({
        fromId: root.id,
        toId: head.id,
        fromX: r.x,
        fromY: r.y,
        toX: h.x,
        toY: hp.y,
      });
      for (const member of getChildren(agents, head.id)) {
        const mp = positions[member.id];
        if (!mp) continue;
        const m = nodeCenter(mp);
        edges.push({
          fromId: head.id,
          toId: member.id,
          fromX: h.x,
          fromY: h.y,
          toX: m.x,
          toY: mp.y,
        });
      }
    }
  }

  return { positions, edges, groups };
}

interface OrchestratorCanvasProps {
  agents: AgentNode[];
  selectedAgentId: string;
  onSelect: (id: string) => void;
  goal: string;
  running: boolean;
  cycle?: number;
}

export default function OrchestratorCanvas({
  agents,
  selectedAgentId,
  onSelect,
  goal,
  running,
  cycle = 0,
}: OrchestratorCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [wave, setWave] = useState(0);
  const prevRunning = useRef(running);

  useEffect(() => {
    if (running && !prevRunning.current) setWave((w) => w + 1);
    prevRunning.current = running;
  }, [running]);

  const agentsById = useMemo(() => {
    const m: Record<string, AgentNode> = {};
    for (const a of agents) m[a.id] = a;
    return m;
  }, [agents]);

  const { positions, edges, groups } = useMemo(() => computeOrgLayout(agents), [agents]);
  const leadHeadId = useMemo(() => leaderForCycle(cycle), [cycle]);

  const membersByHead = useMemo(() => {
    const map: Record<string, AgentNode[]> = {};
    for (const g of groups) {
      map[g.headId] = getChildren(agents, g.headId);
    }
    return map;
  }, [agents, groups]);

  const edgeStates = useMemo(() => {
    const sel = selectedAgentId ? agentsById[selectedAgentId] : undefined;
    let focusTarget: string | null = null;
    if (sel) {
      if (sel.deptId === "ceo") focusTarget = sel.id;
      else if (sel.deptId && agentsById[sel.deptId]) focusTarget = sel.deptId;
    }
    const focused = focusTarget !== null && sel !== undefined && ACTIVE_STATUSES.includes(sel.status);
    const map: Record<string, OrgEdgeState> = {};
    for (const e of edges) {
      const child = agentsById[e.toId];
      let state: OrgEdgeState;
      if (focused && e.toId === focusTarget) state = "active";
      else if (child.status === "success") state = "done";
      else if (child.status === "error") state = "error";
      else if (ACTIVE_STATUSES.includes(child.status)) state = "active";
      else state = "idle";
      map[`${e.fromId}->${e.toId}`] = state;
    }
    return map;
  }, [edges, agentsById, selectedAgentId]);

  const zoomButtons = [
    {
      icon: ZoomIn,
      label: "Zoom in",
      action: () => setZoom((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100)),
    },
    {
      icon: ZoomOut,
      label: "Zoom out",
      action: () => setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100)),
    },
    {
      icon: Maximize,
      label: "Fit",
      action: () => setZoom(1),
    },
  ];

  return (
    <div
      className="canvas-grid relative flex-1 overflow-hidden rounded-xl border border-white/10"
      style={{ backgroundColor: "rgba(12, 15, 22, 0.72)", backdropFilter: "blur(10px)" }}
    >
      {agents.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          No agents deployed.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id="waveGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <motion.g
            style={{ transformBox: "view-box", transformOrigin: `${VIEW_WIDTH / 2}px ${VIEW_HEIGHT / 2}px` }}
            animate={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            {groups.map((g) => {
              const head = agentsById[g.headId];
              if (!head || head.spawnedAt < 0) return null;
              return (
                <GroupRegion
                  key={g.headId}
                  group={g}
                  head={head}
                  members={membersByHead[g.headId] ?? []}
                  lead={g.headId === leadHeadId}
                />
              );
            })}

            {edges
              .filter(
                (e) =>
                  agentsById[e.fromId]?.spawnedAt >= 0 &&
                  agentsById[e.toId]?.spawnedAt >= 0,
              )
              .map((e) => (
                <OrgEdge
                  key={`${e.fromId}-${e.toId}`}
                  fromX={e.fromX}
                  fromY={e.fromY}
                  toX={e.toX}
                  toY={e.toY}
                  state={edgeStates[`${e.fromId}->${e.toId}`]}
                />
              ))}

            {agents.map((agent, i) => {
              const p = positions[agent.id];
              if (!p || agent.spawnedAt < 0) return null;
              return (
                <motion.g
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <OrgNode
                    agent={agent}
                    x={p.x}
                    y={p.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    selected={selectedAgentId === agent.id}
                    teamColor={teamColorFor(agent)}
                    onClick={onSelect}
                  />
                </motion.g>
              );
            })}

            {wave > 0 && (
              <motion.rect
                key={wave}
                x={0}
                y={0}
                width={VIEW_WIDTH}
                height={VIEW_HEIGHT}
                fill="url(#waveGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.14, 0] }}
                transition={{ duration: 1.1, times: [0, 0.45, 1], ease: "easeOut" }}
                style={{ pointerEvents: "none" }}
              />
            )}
          </motion.g>
        </svg>
      )}

      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
            Orchestrator Canvas
          </span>
          {running && (
            <span className="animate-breathe flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          )}
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-300">
            Cycle #{cycle}
          </span>
        </div>
        <span className="text-xs text-zinc-400">Hierarchical Startup Tree</span>
        <span className="max-w-[340px] truncate text-[10px] text-zinc-500">{goal}</span>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        {zoomButtons.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={action}
            className="glass flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-sky-400/40 hover:text-sky-300"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
