"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { LogLevel, LogLine } from "@/lib/simulation/types";

export interface TelemetryLogsProps {
  log: LogLine[];
  running: boolean;
}

const LEVEL_CLASS: Record<LogLevel, string> = {
  info: "text-accent",
  debug: "text-muted",
  success: "text-status-success",
  warn: "text-status-queued",
  error: "text-status-error",
};

export default function TelemetryLogs({ log, running }: TelemetryLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el && running) el.scrollTop = el.scrollHeight;
  }, [log.length, running]);

  const handleDownload = () => {
    const content = log
      .map(
        (l) =>
          `[${l.time}] ${l.agentEmoji} [${l.agentName}] ${l.message}`,
      )
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus-telemetry.log";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
          <span>Telemetry & Logs</span>
          <span className="font-normal normal-case tracking-normal text-muted opacity-70">
            (Live Startup Chatter)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {running && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-status-success">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-success animate-breathe" />
              Live
            </span>
          )}
          <button
            onClick={handleDownload}
            aria-label="Download telemetry log"
            className="text-muted transition-colors hover:text-foreground"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      <div
        id="telemetry-log"
        ref={containerRef}
        className="min-h-0 max-h-[200px] flex-1 overflow-y-auto bg-black/40 p-3 font-mono text-xs leading-relaxed"
      >
        {log.map((l) => (
          <motion.div
            key={l.id}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`whitespace-pre-wrap ${LEVEL_CLASS[l.level]}`}
          >
            <span className="text-muted opacity-60">[{l.time}]</span>{" "}
            {l.agentEmoji}{" "}
            <span className="font-semibold text-foreground">
              [{l.agentName}]
            </span>{" "}
            {l.message}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
