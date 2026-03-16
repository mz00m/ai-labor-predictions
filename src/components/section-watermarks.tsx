/**
 * SVG watermark illustrations for homepage section bars.
 * Each is stroke-only at the bar's accent color, rendered at low opacity
 * by the parent SectionBar component.
 */

interface WatermarkProps {
  color: string;
}

/** Area chart with ~8 data points and a confidence band */
export function PredictionsWatermark({ color }: WatermarkProps) {
  const points = "40,140 80,100 120,120 160,70 200,90 240,50 280,65 320,30";
  const areaPoints = `40,160 ${points} 320,160`;
  return (
    <svg width="360" height="180" viewBox="0 0 360 180" fill="none">
      {/* Confidence band */}
      <path
        d="M40,160 40,150 80,115 120,135 160,85 200,105 240,65 280,80 320,45 320,15 280,50 240,35 200,75 160,55 120,105 80,85 40,130 40,160Z"
        fill={color}
        opacity="0.15"
      />
      {/* Area fill */}
      <polygon points={areaPoints} fill={color} opacity="0.08" />
      {/* Main line */}
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Data dots */}
      {[
        [40, 140],
        [80, 100],
        [120, 120],
        [160, 70],
        [200, 90],
        [240, 50],
        [280, 65],
        [320, 30],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} />
      ))}
    </svg>
  );
}

/** 4x3 grid of rectangular blocks, some filled */
export function TaskVisualizerWatermark({ color }: WatermarkProps) {
  const filled = [0, 2, 4, 5, 9]; // which blocks are "exposed"
  return (
    <svg width="320" height="180" viewBox="0 0 320 180" fill="none">
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 20 + col * 76;
        const y = 15 + row * 55;
        const isFilled = filled.includes(i);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="64"
            height="42"
            rx="4"
            stroke={color}
            strokeWidth="1.5"
            fill={isFilled ? color : "none"}
            opacity={isFilled ? 0.2 : 1}
          />
        );
      })}
    </svg>
  );
}

/** Funnel narrowing left-to-right, 5 segments */
export function EconomyFunnelWatermark({ color }: WatermarkProps) {
  const segments = [
    { y1: 10, y2: 170, label: 40 },
    { y1: 30, y2: 150, label: 20 },
    { y1: 50, y2: 130, label: 13 },
    { y1: 65, y2: 115, label: 7 },
    { y1: 82, y2: 98, label: 0 },
  ];
  return (
    <svg width="340" height="180" viewBox="0 0 340 180" fill="none">
      {segments.map((seg, i) => {
        const x = 20 + i * 68;
        const nextSeg = segments[i + 1];
        if (!nextSeg) return null;
        const nx = 20 + (i + 1) * 68;
        return (
          <path
            key={i}
            d={`M${x},${seg.y1} L${nx},${nextSeg.y1} L${nx},${nextSeg.y2} L${x},${seg.y2} Z`}
            stroke={color}
            strokeWidth="1.5"
            fill={color}
            opacity={0.06 + i * 0.03}
          />
        );
      })}
      {/* Outer funnel outline */}
      <path
        d={`M20,10 L${20 + 4 * 68},82 L${20 + 4 * 68},98 L20,170`}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal timeline with 5 circle nodes */
export function HistoryTimelineWatermark({ color }: WatermarkProps) {
  const nodes = [40, 110, 180, 250, 320];
  return (
    <svg width="360" height="180" viewBox="0 0 360 180" fill="none">
      {/* Main line */}
      <line
        x1="40"
        y1="90"
        x2="320"
        y2="90"
        stroke={color}
        strokeWidth="2"
      />
      {/* Nodes */}
      {nodes.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={90} r="8" stroke={color} strokeWidth="2" fill="none" />
          <circle cx={cx} cy={90} r="3" fill={color} />
          {/* Small vertical ticks */}
          <line
            x1={cx}
            y1={105}
            x2={cx}
            y2={120}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}

/** One line splitting into 3 diverging paths */
export function FirmResponseWatermark({ color }: WatermarkProps) {
  return (
    <svg width="340" height="180" viewBox="0 0 340 180" fill="none">
      {/* Input line */}
      <line
        x1="20"
        y1="90"
        x2="140"
        y2="90"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Branch point */}
      <circle cx="140" cy="90" r="6" stroke={color} strokeWidth="2" fill="none" />
      {/* Three paths */}
      <path
        d="M146,90 C180,90 200,40 320,35"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M146,90 C200,90 240,90 320,90"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M146,90 C180,90 200,140 320,145"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Path endpoints */}
      <circle cx="320" cy="35" r="4" fill={color} />
      <circle cx="320" cy="90" r="4" fill={color} />
      <circle cx="320" cy="145" r="4" fill={color} />
    </svg>
  );
}

/** Upward line with a plateau in the middle, then resuming upward */
export function ProductivityWatermark({ color }: WatermarkProps) {
  return (
    <svg width="360" height="180" viewBox="0 0 360 180" fill="none">
      {/* The line: up, plateau, up again */}
      <polyline
        points="30,160 90,110 130,80 170,78 210,76 250,74 280,40 330,20"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Plateau highlight zone */}
      <rect
        x="125"
        y="60"
        width="135"
        height="35"
        rx="4"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
        fill={color}
        opacity="0.08"
      />
      {/* Gap annotation: small "?" or marker at the plateau */}
      <text
        x="192"
        y="55"
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="700"
        opacity="0.4"
      >
        ?
      </text>
    </svg>
  );
}
