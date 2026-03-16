/**
 * SVG watermark illustrations for homepage section bars.
 * Animate on parent hover via CSS (parent has .group class).
 */

interface WatermarkProps {
  color: string;
}

/** Area chart — line draws itself on hover, dots pop in */
export function PredictionsWatermark({ color }: WatermarkProps) {
  const points = "10,55 40,38 70,45 100,25 130,32 160,18 190,24 220,10";
  return (
    <svg width="240" height="70" viewBox="0 0 240 70" fill="none" className="overflow-visible">
      <polygon points={`10,65 ${points} 220,65`} fill={color} opacity="0.08" />
      <path
        d="M10,58 40,44 70,50 100,30 130,38 160,22 190,30 220,14 220,6 190,18 160,14 130,26 100,20 70,40 40,32 10,52Z"
        fill={color} opacity="0.15"
      />
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="400"
        strokeDashoffset="400"
        className="group-hover:animate-[draw_0.8s_ease-out_forwards]"
      />
      {[[10,55],[40,38],[70,45],[100,25],[130,32],[160,18],[190,24],[220,10]].map(([cx,cy],i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r="0"
          fill={color}
          className="group-hover:animate-[pop_0.3s_ease-out_forwards]"
          style={{ animationDelay: `${0.1 + i * 0.08}s` }}
        />
      ))}
    </svg>
  );
}

/** Task grid — blocks fill in sequentially on hover */
export function TaskVisualizerWatermark({ color }: WatermarkProps) {
  const filled = [0, 2, 5, 6];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const isFilled = filled.includes(i);
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
            fill={isFilled ? color : "none"}
            opacity={isFilled ? 0.15 : 0.8}
            className={isFilled ? "group-hover:animate-[fill-in_0.4s_ease-out_forwards]" : ""}
            style={isFilled ? { animationDelay: `${i * 0.1}s` } : {}}
          />
        );
      })}
    </svg>
  );
}

/** Funnel — segments fill from left to right on hover */
export function EconomyFunnelWatermark({ color }: WatermarkProps) {
  // Build trapezoid segments
  const yTop = [2, 15, 25, 30, 33];
  const yBot = [68, 55, 45, 40, 37];
  const xs = [5, 50, 100, 150, 195];

  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      {xs.slice(0, -1).map((x, i) => {
        const nx = xs[i + 1];
        return (
          <path
            key={i}
            d={`M${x},${yTop[i]} L${nx},${yTop[i+1]} L${nx},${yBot[i+1]} L${x},${yBot[i]} Z`}
            stroke={color}
            strokeWidth="1"
            fill={color}
            opacity="0"
            className="group-hover:animate-[fade-seg_0.3s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        );
      })}
      <path
        d={`M5,2 L195,33 L195,37 L5,68 Z`}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

/** Timeline — nodes pulse sequentially on hover */
export function HistoryTimelineWatermark({ color }: WatermarkProps) {
  const nodes = [15, 55, 95, 135, 175];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none" className="overflow-visible">
      <line x1="15" y1="35" x2="185" y2="35" stroke={color} strokeWidth="1.5" />
      {nodes.map((cx, i) => (
        <g key={i}>
          <circle
            cx={cx} cy={35} r="6"
            stroke={color} strokeWidth="1.2" fill="none"
          />
          <circle
            cx={cx} cy={35} r="2" fill={color}
          />
          {/* Pulse ring on hover */}
          <circle
            cx={cx} cy={35} r="6"
            stroke={color} strokeWidth="1"
            fill="none" opacity="0"
            className="group-hover:animate-[pulse-ring_0.6s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
          <line x1={cx} y1={44} x2={cx} y2={52} stroke={color} strokeWidth="1" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

/** Branching paths — paths draw themselves on hover */
export function FirmResponseWatermark({ color }: WatermarkProps) {
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none">
      <line x1="10" y1="35" x2="80" y2="35" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="35" r="4" stroke={color} strokeWidth="1.2" fill="none" />
      {[
        { d: "M84,35 C110,35 120,12 190,10", delay: 0 },
        { d: "M84,35 C120,35 140,35 190,35", delay: 0.12 },
        { d: "M84,35 C110,35 120,58 190,60", delay: 0.24 },
      ].map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset="200"
          className="group-hover:animate-[draw_0.6s_ease-out_forwards]"
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
      {[10, 35, 60].map((cy, i) => (
        <circle
          key={i}
          cx="190" cy={cy} r="0" fill={color}
          className="group-hover:animate-[pop_0.3s_ease-out_forwards]"
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        />
      ))}
    </svg>
  );
}

/** Productivity plateau — line draws, then question mark fades in */
export function ProductivityWatermark({ color }: WatermarkProps) {
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
      <polyline
        points="10,60 40,42 65,30 90,29 115,28 140,27 165,15 200,8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeDasharray="300"
        strokeDashoffset="300"
        className="group-hover:animate-[draw_0.8s_ease-out_forwards]"
      />
      <rect
        x="62" y="20" width="82" height="18" rx="3"
        stroke={color} strokeWidth="0.8" strokeDasharray="3 3"
        fill={color} opacity="0"
        className="group-hover:animate-[fade-seg_0.4s_ease-out_0.3s_forwards]"
      />
      <text
        x="103" y="18" textAnchor="middle"
        fill={color} fontSize="11" fontWeight="700"
        opacity="0"
        className="group-hover:animate-[fade-seg_0.3s_ease-out_0.5s_forwards]"
      >
        ?
      </text>
    </svg>
  );
}
