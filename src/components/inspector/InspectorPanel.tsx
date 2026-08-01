"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { AgentNode, AgentStatus, AgentTools } from "@/lib/simulation/types";
import { ACTIVE_STATUSES } from "@/lib/simulation/types";
import { STATUS_COLORS } from "@/lib/anim/tokens";
import StatusDot from "@/components/ui/StatusDot";
import ProgressBar from "@/components/ui/ProgressBar";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import TypingDots from "@/components/ui/TypingDots";

export interface InspectorPanelProps {
  agent: AgentNode | undefined;
  onClose?: () => void;
}

const TOOL_ITEMS: Array<{ key: keyof AgentTools; label: string }> = [
  { key: "read", label: "Read Files" },
  { key: "write", label: "Write Files" },
  { key: "bash", label: "Shell / Bash" },
  { key: "db", label: "Database" },
];

function StatusBadge({ status }: { status: AgentStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      <StatusDot status={status} size={6} />
      {status}
    </span>
  );
}

function ThoughtStream({ agent }: { agent: AgentNode }) {
  const active = ACTIVE_STATUSES.includes(agent.status);
  const latest = agent.thoughts[agent.thoughts.length - 1] ?? "";
  const completed = agent.thoughts.slice(0, -1);
  const [trackedThought, setTrackedThought] = useState(latest);
  const [charIndex, setCharIndex] = useState(0);

  if (latest !== trackedThought) {
    setTrackedThought(latest);
    setCharIndex(0);
  }

  useEffect(() => {
    if (!latest) return;
    const id = window.setInterval(() => {
      setCharIndex((c) => (c >= latest.length ? c : c + 1));
    }, 24);
    return () => window.clearInterval(id);
  }, [latest]);

  const typingDone = charIndex >= latest.length;

  return (
    <div className="border-b border-border-subtle px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Thought Stream
        </span>
        {!typingDone && <TypingDots size={3} color="#8b93a5" />}
      </div>

      <div className="h-44 space-y-1.5 overflow-y-auto rounded border border-border-subtle bg-panel-2 p-2 font-mono text-xs leading-relaxed">
        {agent.status === "idle" ? (
          <p className="text-status-idle italic">Standing by</p>
        ) : (
          <>
            {completed.map((t, i) => (
              <p key={i} className="text-muted opacity-70">
                {t}
              </p>
            ))}
            {latest && (
              <p className="text-foreground">
                {latest.slice(0, charIndex)}
                {(!typingDone || active) && (
                  <span className="animate-cursor-blink">▍</span>
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AgentDetail({ agent }: { agent: AgentNode }) {
  const statusColor = STATUS_COLORS[agent.status];

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
        <span className="text-2xl">{agent.emoji}</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {agent.name}
          </div>
          <div className="font-mono text-[10px] text-muted">
            #{agent.id.toUpperCase()} · {agent.role}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={agent.status} />
          <span className="truncate font-mono text-[10px] text-muted">
            {agent.currentTask}
          </span>
        </div>
        <ProgressBar value={agent.progress} color={statusColor} height={5} />
      </div>

      <ThoughtStream agent={agent} />

      <div className="border-b border-border-subtle px-4 py-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">
          Tool Access
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TOOL_ITEMS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded border border-border-subtle bg-panel-2 px-2 py-1.5 text-xs"
            >
              <span className="text-muted">{label}</span>
              {agent.tools[key] ? (
                <Check size={14} className="text-status-success" />
              ) : (
                <X size={14} className="text-muted opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">
          Metrics
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Tokens</span>
            <AnimatedNumber value={agent.tokens} className="font-mono text-accent" />
          </div>
          <ProgressBar value={agent.progress} color={statusColor} height={4} />
        </div>
      </div>
    </>
  );
}

export default function InspectorPanel({ agent, onClose }: InspectorPanelProps) {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col overflow-y-auto border-l border-border-subtle bg-panel/60">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Inspector
        </span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close inspector"
            className="text-muted transition-colors hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {agent ? (
        <AgentDetail agent={agent} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-3xl opacity-40" aria-hidden>
            🤖
          </span>
          <p className="text-xs text-muted">Select an agent to inspect</p>
        </div>
      )}
    </aside>
  );
}
