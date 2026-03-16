/**
 * SVG watermark illustrations for homepage section bars.
 * Compact, stroke-based. Rendered at ~10% opacity by parent.
 */

interface WatermarkProps {
  color: string;
}

/** Compact area chart with confidence band */
export function PredictionsWatermark({ color }: WatermarkProps) {
  const points = "10,55 40,38 70,45 100,25 130,32 160,18 190,24 220,10";
  return (
    <svg width="240" height="70" viewBox="0 0 240 70" fill="none">
      <path
        d="M10,65 10,58 40,44 70,50 100,30 130,38 160,22 190,30 220,14 220,6 190,18 160,14 130,26 100,20 70,40 40,32 10,52 10,65Z"
        fill={color} opacity="0.2"
      />
      <polygon points={`10,65 ${points} 220,65`} fill={color} opacity="0.1" />
      <polyline points={points} stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      {[[10,55],[70,45],[130,32],[190,24],[220,10]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={color} />
      ))}
    </svg>
  );
}

/** Compact 4x2 task grid, some filled */
export function TaskVisualizerWatermark({ color }: WatermarkProps) {
  const filled = [0, 2, 5, 6];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <rect
            key={i}
            x={8 + col * 48}
            y={5 + row * 33}
            width="40"
            height="26"
            rx="3"
            stroke={color}
            strokeWidth="1.2"
            fill={filled.includes(i) ? color : "none"}
            opacity={filled.includes(i) ? 0.25 : 1}
          />
        );
      })}
    </svg>
  );
}

/** Compact funnel narrowing left-to-right */
export function EconomyFunnelWatermark({ color }: WatermarkProps) {
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      <path d="M5,2 L195,28 L195,42 L5,68 Z" stroke={color} strokeWidth="1.5" fill="none" />
      {[40, 80, 120, 160].map((x, i) => (
        <line key={i} x1={x} y1={2 + (x/200)*26} x2={x} y2={68 - (x/200)*26} stroke={color} strokeWidth="1" opacity={0.3 + i * 0.1} />
      ))}
      <path d="M5,2 L195,28 L195,42 L5,68 Z" fill={color} opacity="0.06" />
    </svg>
  );
}

/** Compact timeline with 5 nodes */
export function HistoryTimelineWatermark({ color }: WatermarkProps) {
  const nodes = [15, 55, 95, 135, 175];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      <line x1="15" y1="35" x2="185" y2="35" stroke={color} strokeWidth="1.5" />
      {nodes.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={35} r="6" stroke={color} strokeWidth="1.2" fill="none" />
          <circle cx={cx} cy={35} r="2" fill={color} />
          <line x1={cx} y1={44} x2={cx} y2={52} stroke={color} strokeWidth="1" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

/** Compact branching paths */
export function FirmResponseWatermark({ color }: WatermarkProps) {
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      <line x1="10" y1="35" x2="80" y2="35" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="35" r="4" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M84,35 C110,35 120,12 190,10" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M84,35 C120,35 140,35 190,35" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M84,35 C110,35 120,58 190,60" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="190" cy="10" r="3" fill={color} />
      <circle cx="190" cy="35" r="3" fill={color} />
      <circle cx="190" cy="60" r="3" fill={color} />
    </svg>
  );
}

/** Compact productivity plateau */
export function ProductivityWatermark({ color }: WatermarkProps) {
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
      <polyline
        points="10,60 40,42 65,30 90,29 115,28 140,27 165,15 200,8"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
      <rect x="62" y="20" width="82" height="18" rx="3" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" fill={color} opacity="0.08" />
      <text x="103" y="18" textAnchor="middle" fill={color} fontSize="10" fontWeight="700" opacity="0.35">?</text>
    </svg>
  );
}
