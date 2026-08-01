"use client";

import { Pause, Play, Zap } from "lucide-react";
import { SPEEDS } from "@/lib/simulation/engine";
import type { SimState } from "@/lib/simulation/types";
import type { SimulationControls } from "@/hooks/useSimulation";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export interface TopBarProps {
  state: SimState;
  controls: SimulationControls;
}

export default function TopBar({ state, controls }: TopBarProps) {
  const isRunning = state.running;

  return (
    <header className="glass flex h-14 shrink-0 items-center gap-4 border-b border-border-subtle px-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-block h-2 w-2 rounded-full bg-accent animate-breathe" style={{ boxShadow: "0 0 10px rgba(56, 189, 248, 0.8)" }} />
        <span className="text-sm font-bold tracking-wide text-foreground">
          NEXUS AI WORKSPACE
        </span>
        <span className="rounded border border-border-subtle px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
          Env: Prod
        </span>
      </div>

      <div className="flex items-center gap-5">
        <span className="flex items-center gap-2 text-xs">
          <span
            className={`inline-block h-2 w-2 rounded-full bg-status-success ${isRunning ? "animate-breathe" : ""}`}
            style={{ boxShadow: "0 0 8px rgba(52, 211, 153, 0.7)" }}
          />
          <span className="font-semibold text-status-success">
            {state.activeAgents} Agents Active
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span aria-hidden>🔥</span>
          <AnimatedNumber value={state.totalTokens} className="font-semibold text-accent" />
          <span>Tokens</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {isRunning && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-status-success">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-success animate-breathe" />
            Live
          </span>
        )}

        <button
          onClick={() => (isRunning ? controls.pause() : controls.resume())}
          aria-label={isRunning ? "Pause simulation" : "Resume simulation"}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle text-muted transition-colors hover:bg-panel-2 hover:text-foreground active:scale-95"
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="flex items-center gap-0.5 rounded-md border border-border-subtle p-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => controls.setSpeed(s)}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                state.speed === s
                  ? "bg-accent text-black"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={controls.deployAll}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-black transition hover:brightness-110 active:scale-95"
        >
          <Zap size={14} />
          Deploy All
        </button>
      </div>
    </header>
  );
}
