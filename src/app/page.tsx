"use client";

import TopBar from "@/components/layout/TopBar";
import AgentRegistry from "@/components/registry/AgentRegistry";
import OrchestratorCanvas from "@/components/canvas/OrchestratorCanvas";
import InspectorPanel from "@/components/inspector/InspectorPanel";
import TelemetryLogs from "@/components/logs/TelemetryLogs";
import { useSimulation } from "@/hooks/useSimulation";

export default function DashboardPage() {
  const { state, controls } = useSimulation();
  const selected = state.agents.find((a) => a.id === state.selectedAgentId);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar state={state} controls={controls} />

      <main className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)_300px]">
        <AgentRegistry
          agents={state.agents}
          selectedAgentId={state.selectedAgentId}
          onSelect={controls.selectAgent}
        />

        <section className="flex min-w-0 flex-col p-3">
          <OrchestratorCanvas
            agents={state.agents}
            selectedAgentId={state.selectedAgentId}
            onSelect={controls.selectAgent}
            goal={state.goal}
            running={state.running}
            cycle={state.cycle}
          />
        </section>

        <InspectorPanel agent={selected} />
      </main>

      <div className="h-[220px] shrink-0 border-t border-border-subtle">
        <TelemetryLogs log={state.log} running={state.running} />
      </div>
    </div>
  );
}
