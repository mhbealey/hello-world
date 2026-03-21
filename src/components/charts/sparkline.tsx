"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  colorblind?: boolean;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  positive,
  colorblind = false,
}: SparklineProps) {
  if (!data.length) return null;

  const isPositive = positive ?? (data.length > 1 ? data[data.length - 1] >= data[0] : true);
  const color = isPositive
    ? colorblind ? "#0066CC" : "#22C55E"
    : colorblind ? "#FF6B00" : "#EF4444";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
