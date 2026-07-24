"use client";

type SignalRingProps = {
  size?: number;
  segments?: number;
  progress?: number; // 0–1, fraction of segments filled
  variant?: "teal" | "amber";
  sweep?: boolean;
  className?: string;
};

// Construction per DESIGN.md §6: SVG circle, stroke-dasharray segmented into
// equal arcs with 2° gaps. accent.secondary (teal) = in-progress,
// accent.primary (amber) = complete/celebratory, border.subtle = unfilled track.
export default function SignalRing({
  size = 280,
  segments = 32,
  progress = 0.62,
  variant = "teal",
  sweep = true,
  className = "",
}: SignalRingProps) {
  const strokeWidth = Math.max(2, Math.round(size * 0.045));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapDeg = 2;
  const gapLength = (gapDeg / 360) * circumference;
  const dashLength = circumference / segments - gapLength;
  const filledCount = Math.round(segments * Math.min(1, Math.max(0, progress)));
  const accentColor = variant === "amber" ? "#F2A93B" : "#2BA893";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {Array.from({ length: segments }).map((_, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={i < filledCount ? accentColor : "#28313D"}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-((i * circumference) / segments)}
          />
        ))}
      </g>
      {sweep && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.1} ${circumference * 0.9}`}
          opacity={0.4}
          className="signal-ring-sweep animate-sweep"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
    </svg>
  );
}
