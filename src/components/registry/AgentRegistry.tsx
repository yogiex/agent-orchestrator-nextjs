"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, FolderTree } from "lucide-react";
import type { AgentNode } from "@/lib/simulation/types";
import { getChildren } from "@/lib/simulation/agents";
import { EASE } from "@/lib/anim/tokens";
import StatusDot from "@/components/ui/StatusDot";

export interface AgentRegistryProps {
  agents: AgentNode[];
  selectedAgentId: string;
  onSelect: (id: string) => void;
}

interface RowProps {
  agent: AgentNode;
  selected: boolean;
  onSelect: (id: string) => void;
}

function LeafRow({ agent, selected, onSelect }: RowProps) {
  const spawned = agent.spawnedAt >= 0;
  return (
    <button
      onClick={() => onSelect(agent.id)}
      className={`flex w-full items-center gap-2 rounded-r border-l-2 py-1.5 pl-7 pr-2 text-xs transition-colors ${
        selected
          ? "border-accent bg-accent/10 text-foreground"
          : "border-transparent text-muted hover:bg-panel-2 hover:text-foreground"
      } ${spawned ? "" : "opacity-35"}`}
    >
      <span className="text-sm">{agent.emoji}</span>
      <span className="flex-1 truncate">{agent.shortName}</span>
      <StatusDot status={spawned ? agent.status : "idle"} size={7} />
    </button>
  );
}

interface DepartmentProps extends RowProps {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function Department({
  agent,
  selected,
  onSelect,
  open,
  onToggle,
  children,
}: DepartmentProps) {
  return (
    <div className="group">
      <div
        className={`flex items-center rounded-r border-l-2 transition-colors ${
          selected
            ? "border-accent bg-accent/10"
            : "border-transparent hover:bg-panel-2"
        }`}
      >
        <button
          onClick={onToggle}
          aria-label={open ? `Collapse ${agent.shortName}` : `Expand ${agent.shortName}`}
          className="flex h-7 w-6 items-center justify-center text-muted transition-colors group-hover:text-foreground"
        >
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        <button
          onClick={() => onSelect(agent.id)}
          className="flex flex-1 items-center gap-2 py-1.5 pr-2 text-left text-xs text-muted transition-colors group-hover:text-foreground"
        >
          <span className="text-sm">{agent.emoji}</span>
          <span className="font-medium text-foreground">{agent.shortName}</span>
          <span className="ml-auto">
            <StatusDot status={agent.status} size={7} />
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.standard }}
            className="overflow-hidden"
          >
            <div className="pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AgentRegistry({
  agents,
  selectedAgentId,
  onSelect,
}: AgentRegistryProps) {
  const [departmentsOpen, setDepartmentsOpen] = useState<Record<string, boolean>>({
    "head-prod": true,
    "head-growth": true,
    "head-biz": true,
  });

  const ceo = getChildren(agents, null)[0] ?? agents[0];
  const departments = getChildren(agents, "ceo");

  const toggleDept = (id: string) =>
    setDepartmentsOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-border-subtle bg-panel/60">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
        <FolderTree size={14} className="text-accent" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Agent Registry
        </span>
      </div>

      <div className="flex-1 py-2">
        <button
          onClick={() => onSelect(ceo.id)}
          className={`flex w-full items-center gap-2 rounded-r border-l-2 px-3 py-1.5 text-xs transition-colors ${
            selectedAgentId === ceo.id
              ? "border-accent bg-accent/10 text-foreground"
              : "border-transparent text-muted hover:bg-panel-2 hover:text-foreground"
          }`}
        >
          <ChevronDown size={13} className="shrink-0 text-muted" />
          <span className="text-sm">{ceo.emoji}</span>
          <span className="font-semibold text-foreground">{ceo.shortName}</span>
          <span className="ml-auto">
            <StatusDot status={ceo.status} size={7} />
          </span>
        </button>

        <div className="mt-2 flex items-center gap-1 px-3 text-[10px] font-bold uppercase tracking-widest text-status-queued">
          <span aria-hidden>▼</span>
          <span>Startup</span>
        </div>

        <div className="mt-1">
          {departments.map((dept) => (
            <Department
              key={dept.id}
              agent={dept}
              selected={selectedAgentId === dept.id}
              onSelect={onSelect}
              open={departmentsOpen[dept.id] ?? true}
              onToggle={() => toggleDept(dept.id)}
            >
              {getChildren(agents, dept.id).map((leaf) => (
                <LeafRow
                  key={leaf.id}
                  agent={leaf}
                  selected={selectedAgentId === leaf.id}
                  onSelect={onSelect}
                />
              ))}
            </Department>
          ))}
        </div>
      </div>
    </aside>
  );
}
