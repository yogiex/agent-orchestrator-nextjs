"use client";

export interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  indeterminate?: boolean;
}

export default function ProgressBar({
  value,
  color = "#38bdf8",
  height = 6,
  indeterminate = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative w-full overflow-hidden rounded-full bg-panel-2"
      style={{ height }}
    >
      {indeterminate ? (
        <div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "shimmer 1.4s ease-in-out infinite",
          }}
        />
      ) : (
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      )}
    </div>
  );
}
