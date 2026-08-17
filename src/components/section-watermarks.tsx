/**
 * SVG watermark illustrations for homepage section bars.
 * Animate on parent hover via CSS (parent has .group class).
 * Bold, expressive animations that reward curiosity.
 */

interface WatermarkProps {
  color: string;
}

/** Area chart - line draws itself on hover, dots pop in, area fills */
export function PredictionsWatermark({ color }: WatermarkProps) {
  const points = "10,55 40,38 70,45 100,25 130,32 160,18 190,24 220,10";
  return (
    <svg width="240" height="70" viewBox="0 0 240 70" fill="none" className="overflow-visible">
      {/* Confidence band - fades in */}
      <path
        d="M10,65 10,58 40,44 70,50 100,30 130,38 160,22 190,30 220,14 220,6 190,18 160,14 130,26 100,20 70,40 40,32 10,52 10,65Z"
        fill={color} opacity="0"
        className="group-hover:animate-[wm-fill_0.6s_ease-out_0.3s_forwards]"
      />
      {/* Area under line - fades in */}
      <polygon
        points={`10,65 ${points} 220,65`}
        fill={color} opacity="0"
        className="group-hover:animate-[wm-fill-soft_0.5s_ease-out_0.2s_forwards]"
      />
      {/* Main line - draws */}
      <polyline
        points={points}
        stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"
        strokeDasharray="400" strokeDashoffset="400"
        className="group-hover:animate-[wm-draw_0.7s_ease-out_forwards]"
      />
      {/* Data dots - pop in sequentially */}
      {[[10,55],[40,38],[70,45],[100,25],[130,32],[160,18],[190,24],[220,10]].map(([cx,cy],i) => (
        <circle
          key={i} cx={cx} cy={cy} r="0" fill={color}
          className="group-hover:animate-[wm-pop_0.35s_ease-out_forwards]"
          style={{ animationDelay: `${0.08 + i * 0.07}s` }}
        />
      ))}
    </svg>
  );
}

/** Task grid - blocks scale up and fill in with a stagger */
export function TaskVisualizerWatermark({ color }: WatermarkProps) {
  const filled = [0, 2, 5, 6];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none" className="overflow-visible">
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const isFilled = filled.includes(i);
        return (
          <rect
            key={i}
            x={8 + col * 48} y={5 + row * 33}
            width="40" height="26" rx="3"
            stroke={color} strokeWidth="1.2"
            fill={isFilled ? color : "none"}
            opacity={isFilled ? 0.12 : 0.6}
            className={isFilled
              ? "group-hover:animate-[wm-block-fill_0.4s_ease-out_forwards]"
              : "group-hover:animate-[wm-block-outline_0.3s_ease-out_forwards]"
            }
            style={{ animationDelay: `${i * 0.06}s` }}
          />
        );
      })}
    </svg>
  );
}

/** Funnel - segments slam in from left to right, shrinking dramatically */
export function EconomyFunnelWatermark({ color }: WatermarkProps) {
  const yTop = [2, 15, 25, 30, 33];
  const yBot = [68, 55, 45, 40, 37];
  const xs = [5, 50, 100, 150, 195];

  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none" className="overflow-visible">
      {/* Outline draws first */}
      <path
        d="M5,2 L195,33 L195,37 L5,68 Z"
        stroke={color} strokeWidth="1.5" fill="none"
        strokeDasharray="600" strokeDashoffset="600"
        className="group-hover:animate-[wm-draw_0.5s_ease-out_forwards]"
      />
      {/* Segments fill in with stagger */}
      {xs.slice(0, -1).map((x, i) => {
        const nx = xs[i + 1];
        return (
          <path
            key={i}
            d={`M${x},${yTop[i]} L${nx},${yTop[i+1]} L${nx},${yBot[i+1]} L${x},${yBot[i]} Z`}
            stroke="none" fill={color} opacity="0"
            className="group-hover:animate-[wm-seg-fill_0.3s_ease-out_forwards]"
            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
          />
        );
      })}
      {/* Percentage labels fade in */}
      {["40%", "20%", "7%", "~0%"].map((label, i) => (
        <text
          key={i}
          x={xs[i] + (xs[i+1] - xs[i]) / 2}
          y={38}
          textAnchor="middle" fill={color}
          fontSize="9" fontWeight="700" opacity="0"
          className="group-hover:animate-[wm-text-in_0.25s_ease-out_forwards]"
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

/** Timeline - line draws, nodes expand with ripples */
export function HistoryTimelineWatermark({ color }: WatermarkProps) {
  const nodes = [15, 55, 95, 135, 175];
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none" className="overflow-visible">
      {/* Line draws itself */}
      <line
        x1="15" y1="35" x2="185" y2="35"
        stroke={color} strokeWidth="1.5"
        strokeDasharray="180" strokeDashoffset="180"
        className="group-hover:animate-[wm-draw_0.5s_ease-out_forwards]"
      />
      {nodes.map((cx, i) => (
        <g key={i}>
          {/* Ripple ring */}
          <circle
            cx={cx} cy={35} r="6"
            stroke={color} strokeWidth="1.5" fill="none" opacity="0"
            className="group-hover:animate-[wm-ripple_0.8s_ease-out_forwards]"
            style={{ animationDelay: `${0.2 + i * 0.12}s` }}
          />
          {/* Outer circle pops */}
          <circle
            cx={cx} cy={35} r="0"
            stroke={color} strokeWidth="1.2" fill="none"
            className="group-hover:animate-[wm-ring-pop_0.4s_ease-out_forwards]"
            style={{ animationDelay: `${0.15 + i * 0.12}s` }}
          />
          {/* Inner dot pops */}
          <circle
            cx={cx} cy={35} r="0" fill={color}
            className="group-hover:animate-[wm-dot-pop_0.3s_ease-out_forwards]"
            style={{ animationDelay: `${0.2 + i * 0.12}s` }}
          />
          {/* Tick below */}
          <line
            x1={cx} y1={44} x2={cx} y2={54}
            stroke={color} strokeWidth="1" opacity="0"
            className="group-hover:animate-[wm-text-in_0.3s_ease-out_forwards]"
            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Rising bar chart - AI tool downloads surging upward */
export function SignalsWatermark({ color }: WatermarkProps) {
  const bars = [
    { x: 15, h: 12 },
    { x: 40, h: 16 },
    { x: 65, h: 14 },
    { x: 90, h: 22 },
    { x: 115, h: 30 },
    { x: 140, h: 38 },
    { x: 165, h: 52 },
    { x: 190, h: 60 },
  ];
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none" className="overflow-visible">
      {/* Baseline */}
      <line x1="10" y1="66" x2="210" y2="66" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Bars grow upward */}
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x} y={66} width="16" height="0" rx="2"
          fill={color}
          className="group-hover:animate-[wm-bar-grow_0.4s_ease-out_forwards]"
          style={{
            animationDelay: `${i * 0.06}s`,
            // @ts-expect-error CSS custom property for bar height
            "--bar-h": bar.h,
          }}
        />
      ))}
      {/* Trend line draws on top */}
      <polyline
        points={bars.map(b => `${b.x + 8},${66 - b.h}`).join(" ")}
        stroke={color} strokeWidth="1.5" fill="none"
        strokeDasharray="300" strokeDashoffset="300"
        strokeLinejoin="round"
        className="group-hover:animate-[wm-draw_0.6s_ease-out_0.4s_forwards]"
      />
      {/* Arrow at the end pointing up */}
      <path
        d="M198,6 L202,2 L206,6" stroke={color} strokeWidth="1.5"
        fill="none" opacity="0" strokeLinecap="round"
        className="group-hover:animate-[wm-text-in_0.3s_ease-out_0.7s_forwards]"
      />
    </svg>
  );
}

/** Scorecard - a 10-segment score meter that fills to 7 on hover */
export function ScorecardWatermark({ color }: WatermarkProps) {
  const SEGMENTS = 10;
  const FILLED = 7;
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none" className="overflow-visible">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <rect
          key={i}
          x={10 + i * 20}
          y={26}
          width="14"
          height="18"
          rx="2"
          fill={color}
          opacity={0.12}
        />
      ))}
      {Array.from({ length: FILLED }, (_, i) => (
        <rect
          key={`fill-${i}`}
          x={10 + i * 20}
          y={26}
          width="14"
          height="18"
          rx="2"
          fill={color}
          opacity="0"
          className="group-hover:animate-[wm-pop_0.3s_ease-out_forwards]"
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
      <line
        x1={10 + FILLED * 20 - 3}
        y1="18"
        x2={10 + FILLED * 20 - 3}
        y2="52"
        stroke={color}
        strokeWidth="1.5"
        opacity="0"
        className="group-hover:animate-[wm-text-in_0.3s_ease-out_0.4s_forwards]"
      />
    </svg>
  );
}

/** Demand elasticity - upward lines branching out, representing job creation outpacing displacement */
export function DemandElasticityWatermark({ color }: WatermarkProps) {
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none" className="overflow-visible">
      {/* Base line draws */}
      <polyline
        points="10,55 60,45 110,35"
        stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"
        strokeDasharray="200" strokeDashoffset="200"
        className="group-hover:animate-[wm-draw_0.5s_ease-out_forwards]"
      />
      {/* Branch 1 - jobs created (steeper upward) */}
      <polyline
        points="110,35 145,20 180,10 210,5"
        stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"
        strokeDasharray="200" strokeDashoffset="200"
        className="group-hover:animate-[wm-draw_0.5s_ease-out_0.4s_forwards]"
      />
      {/* Branch 2 - jobs displaced (shallow) */}
      <polyline
        points="110,35 145,40 180,42 210,43"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"
        strokeDasharray="200" strokeDashoffset="200"
        strokeOpacity="0.5"
        className="group-hover:animate-[wm-draw_0.5s_ease-out_0.4s_forwards]"
      />
      {/* Area between branches - net gain */}
      <path
        d="M110,35 145,20 180,10 210,5 210,43 180,42 145,40 110,35Z"
        fill={color} opacity="0"
        className="group-hover:animate-[wm-fill-soft_0.5s_ease-out_0.6s_forwards]"
      />
      {/* "+" symbol fades in */}
      <text
        x="175" y="30" textAnchor="middle"
        fill={color} fontSize="14" fontWeight="800" opacity="0"
        className="group-hover:animate-[wm-text-in_0.3s_ease-out_0.8s_forwards]"
      >
        +
      </text>
      {/* Fork dot */}
      <circle
        cx={110} cy={35} r="0" fill={color}
        className="group-hover:animate-[wm-pop_0.35s_ease-out_0.35s_forwards]"
      />
    </svg>
  );
}

/** Productivity plateau - line draws boldly, gap zone pulses */
export function ProductivityWatermark({ color }: WatermarkProps) {
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none" className="overflow-visible">
      {/* Main line draws */}
      <polyline
        points="10,60 40,42 65,30 90,29 115,28 140,27 165,15 200,8"
        stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"
        strokeDasharray="300" strokeDashoffset="300"
        className="group-hover:animate-[wm-draw_0.7s_ease-out_forwards]"
      />
      {/* Plateau zone pulses */}
      <rect
        x="60" y="18" width="86" height="22" rx="4"
        stroke={color} strokeWidth="1" strokeDasharray="3 3"
        fill={color} opacity="0"
        className="group-hover:animate-[wm-plateau-pulse_1.2s_ease-in-out_0.4s_forwards]"
      />
      {/* "?" fades in and bobs */}
      <text
        x="103" y="16" textAnchor="middle"
        fill={color} fontSize="12" fontWeight="800" opacity="0"
        className="group-hover:animate-[wm-q-bob_1s_ease-in-out_0.6s_forwards]"
      >
        ?
      </text>
      {/* Arrows on the rising segments */}
      <path
        d="M36,46 L40,42 L44,46" stroke={color} strokeWidth="1.5"
        fill="none" opacity="0" strokeLinecap="round"
        className="group-hover:animate-[wm-text-in_0.3s_ease-out_0.3s_forwards]"
      />
      <path
        d="M161,19 L165,15 L169,19" stroke={color} strokeWidth="1.5"
        fill="none" opacity="0" strokeLinecap="round"
        className="group-hover:animate-[wm-text-in_0.3s_ease-out_0.7s_forwards]"
      />
    </svg>
  );
}
