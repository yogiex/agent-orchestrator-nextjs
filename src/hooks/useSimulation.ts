"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { createInitialState, reducer } from "@/lib/simulation/engine";
import type { SimAction } from "@/lib/simulation/engine";
import type { SimState } from "@/lib/simulation/types";

export interface SimulationControls {
  pause: () => void;
  resume: () => void;
  setSpeed: (speed: number) => void;
  deployAll: () => void;
  selectAgent: (agentId: string) => void;
}

export interface UseSimulationResult {
  state: SimState;
  controls: SimulationControls;
  tickRef: React.RefObject<number>;
}

export function useSimulation(): UseSimulationResult {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!state.running) return;
    const interval = window.setInterval(
      () => {
        tickRef.current += 1;
        dispatch({ type: "TICK" } as SimAction);
      },
      1000 / state.speed,
    );
    return () => window.clearInterval(interval);
  }, [state.running, state.speed]);

  const controls = useMemo<SimulationControls>(
    () => ({
      pause: () => dispatch({ type: "PAUSE" }),
      resume: () => dispatch({ type: "RESUME" }),
      setSpeed: (speed) => dispatch({ type: "SET_SPEED", speed }),
      deployAll: () => dispatch({ type: "DEPLOY" }),
      selectAgent: (agentId) => dispatch({ type: "SELECT", agentId }),
    }),
    [],
  );

  return { state, controls, tickRef };
}
