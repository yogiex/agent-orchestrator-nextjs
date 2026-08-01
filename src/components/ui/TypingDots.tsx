"use client";

export interface TypingDotsProps {
  className?: string;
  color?: string;
  size?: number;
}

const DELAYS = [0, 0.15, 0.3] as const;

export default function TypingDots({
  className,
  color = "currentColor",
  size = 4,
}: TypingDotsProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ""}`} aria-hidden>
      {DELAYS.map((delay, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animation: `typing-dot 1s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
