"use client";

import { useState } from "react";

/**
 * Interactive J-Curve SVG visualization.
 *
 * Shows the classic J-shaped productivity measurement error over time,
 * with three annotated phases and hover/click interactivity.
 */

const PHASES = [
  {
    id: "invest",
    label: "Investment Phase",
    color: "#ef4444",
    range: [0.08, 0.38],
    description:
      "Firms pour resources into intangible capital — reorganization, training, new workflows. These investments are expensed, not capitalized, so measured output falls even as true capability grows.",
  },
  {
    id: "trough",
    label: "Trough",
    color: "#f59e0b",
    range: [0.38, 0.55],
    description:
      "Maximum gap between what the economy can actually do and what statistics show. Pundits declare the technology overhyped. Solow's paradox peaks.",
  },
  {
    id: "harvest",
    label: "Harvest Phase",
    color: "#22c55e",
    range: [0.55, 0.92],
    description:
      "Intangible investments mature. Reorganized workflows produce measurable output gains. Measured productivity surges — and actually overstates true TFP because the intangible capital driving it isn't counted as an input.",
  },
];

export default function JCurveChart() {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  // SVG dimensions
  const W = 720;
  const H = 340;
  const padL = 60;
  const padR = 80;
  const padT = 40;
  const padB = 60;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // J-curve path points (normalized 0-1 on both axes)
  // x = time, y = measured TFP error (0.5 = zero line, above = overstate, below = understate)
  const curvePoints = [
    [0, 0.5],
    [0.05, 0.49],
    [0.1, 0.46],
    [0.15, 0.4],
    [0.2, 0.33],
    [0.25, 0.27],
    [0.3, 0.23],
    [0.35, 0.21],
    [0.4, 0.2],
    [0.45, 0.21],
    [0.5, 0.25],
    [0.55, 0.32],
    [0.6, 0.42],
    [0.65, 0.53],
    [0.7, 0.62],
    [0.75, 0.69],
    [0.8, 0.74],
    [0.85, 0.78],
    [0.9, 0.8],
    [0.95, 0.81],
    [1, 0.82],
  ];

  // True TFP line (smooth upward)
  const trueTfpPoints = [
    [0, 0.5],
    [0.1, 0.52],
    [0.2, 0.55],
    [0.3, 0.58],
    [0.4, 0.61],
    [0.5, 0.64],
    [0.6, 0.67],
    [0.7, 0.7],
    [0.8, 0.73],
    [0.9, 0.76],
    [1, 0.79],
  ];

  function toSvg(pt: number[]): [number, number] {
    return [padL + pt[0] * chartW, padT + (1 - pt[1]) * chartH];
  }

  function pointsToPath(pts: number[][]): string {
    return pts
      .map((pt, i) => {
        const [x, y] = toSvg(pt);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }

  // Smooth curve using cubic bezier
  function pointsToSmoothPath(pts: number[][]): string {
    const svgPts = pts.map(toSvg);
    if (svgPts.length < 2) return "";
    let d = `M${svgPts[0][0]},${svgPts[0][1]}`;
    for (let i = 1; i < svgPts.length; i++) {
      const prev = svgPts[i - 1];
      const curr = svgPts[i];
      const cpx = (prev[0] + curr[0]) / 2;
      d += ` C${cpx},${prev[1]} ${cpx},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
  }

  const measuredPath = pointsToSmoothPath(curvePoints);
  const truePath = pointsToSmoothPath(trueTfpPoints);

  // Zero line y
  const zeroY = padT + 0.5 * chartH;

  // Phase regions
  const activeInfo = PHASES.find((p) => p.id === activePhase);

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: 720 }}
      >
        {/* Phase background regions */}
        {PHASES.map((phase) => {
          const x1 = padL + phase.range[0] * chartW;
          const x2 = padL + phase.range[1] * chartW;
          const isActive = activePhase === phase.id;
          return (
            <g key={phase.id}>
              <rect
                x={x1}
                y={padT}
                width={x2 - x1}
                height={chartH}
                fill={phase.color}
                fillOpacity={isActive ? 0.1 : 0.04}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActivePhase(phase.id)}
                onMouseLeave={() => setActivePhase(null)}
                onClick={() =>
                  setActivePhase(activePhase === phase.id ? null : phase.id)
                }
              />
              {/* Phase label */}
              <text
                x={(x1 + x2) / 2}
                y={padT + 14}
                textAnchor="middle"
                fill={phase.color}
                fontSize="10"
                fontWeight="700"
                letterSpacing="0.05em"
                style={{ textTransform: "uppercase" as const }}
              >
                {phase.label}
              </text>
            </g>
          );
        })}

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => {
          const y = padT + (1 - t) * chartH;
          return (
            <line
              key={t}
              x1={padL}
              y1={y}
              x2={padL + chartW}
              y2={y}
              stroke="rgba(0,0,0,0.06)"
              strokeDasharray={t === 0.5 ? "none" : "3,3"}
              strokeWidth={t === 0.5 ? 1.5 : 0.5}
            />
          );
        })}

        {/* Zero line label */}
        <text
          x={padL - 8}
          y={zeroY + 4}
          textAnchor="end"
          fill="var(--muted)"
          fontSize="10"
          fontWeight="600"
        >
          0
        </text>
        <text
          x={padL - 8}
          y={padT + 0.25 * chartH + 4}
          textAnchor="end"
          fill="var(--muted)"
          fontSize="8"
          opacity="0.6"
        >
          Above
        </text>
        <text
          x={padL - 8}
          y={padT + 0.75 * chartH + 4}
          textAnchor="end"
          fill="var(--muted)"
          fontSize="8"
          opacity="0.6"
        >
          Below
        </text>

        {/* Y-axis label */}
        <text
          x={14}
          y={H / 2}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
          fontWeight="500"
          transform={`rotate(-90, 14, ${H / 2})`}
        >
          Productivity
        </text>

        {/* X-axis label */}
        <text
          x={padL + chartW / 2}
          y={H - 8}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
          fontWeight="500"
        >
          Time since technology introduction
        </text>

        {/* X-axis markers */}
        <text
          x={padL}
          y={padT + chartH + 18}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="9"
        >
          Year 0
        </text>
        <text
          x={padL + chartW}
          y={padT + chartH + 18}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="9"
        >
          Decades later
        </text>

        {/* Understated / Overstated annotations */}
        <text
          x={padL + chartW + 10}
          y={padT + 0.28 * chartH}
          fill="#22c55e"
          fontSize="9"
          fontWeight="600"
          opacity="0.7"
        >
          Measured
        </text>
        <text
          x={padL + chartW + 10}
          y={padT + 0.28 * chartH + 11}
          fill="#22c55e"
          fontSize="9"
          fontWeight="600"
          opacity="0.7"
        >
          overstates
        </text>
        <text
          x={padL + chartW + 10}
          y={padT + 0.7 * chartH}
          fill="#ef4444"
          fontSize="9"
          fontWeight="600"
          opacity="0.7"
        >
          Measured
        </text>
        <text
          x={padL + chartW + 10}
          y={padT + 0.7 * chartH + 11}
          fill="#ef4444"
          fontSize="9"
          fontWeight="600"
          opacity="0.7"
        >
          understates
        </text>

        {/* True TFP line (dashed) */}
        <path
          d={truePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="6,4"
          opacity="0.5"
        />

        {/* Measured TFP J-curve (main) */}
        <path
          d={measuredPath}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gap fill between curves */}
        {(() => {
          const measuredSvg = curvePoints.map(toSvg);
          const trueSvg = trueTfpPoints.map(toSvg);
          // Only show gap in investment+trough region (first ~55% of chart)
          const gapPts = measuredSvg.filter((_, i) => curvePoints[i][0] <= 0.55);
          const trueFiltered = trueSvg.filter(
            (_, i) => trueTfpPoints[i][0] <= 0.55
          );
          if (gapPts.length < 2 || trueFiltered.length < 2) return null;
          const d =
            pointsToSmoothPath(
              curvePoints.filter((p) => p[0] <= 0.55)
            ) +
            ` L${trueFiltered[trueFiltered.length - 1][0]},${trueFiltered[trueFiltered.length - 1][1]}` +
            trueFiltered
              .slice()
              .reverse()
              .map(
                (pt, i) =>
                  `${i === 0 ? " L" : " L"}${pt[0]},${pt[1]}`
              )
              .join("") +
            " Z";
          return (
            <path d={d} fill="#ef4444" fillOpacity="0.06" />
          );
        })()}

        {/* Annotation: "Solow Paradox" at trough */}
        {(() => {
          const troughPt = toSvg([0.4, 0.2]);
          return (
            <g>
              <line
                x1={troughPt[0]}
                y1={troughPt[1]}
                x2={troughPt[0]}
                y2={troughPt[1] + 30}
                stroke="var(--muted)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              <text
                x={troughPt[0]}
                y={troughPt[1] + 42}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="9"
                fontStyle="italic"
              >
                &ldquo;Solow Paradox&rdquo;
              </text>
            </g>
          );
        })()}

        {/* Legend */}
        <g transform={`translate(${padL + 10}, ${padT + chartH + 35})`}>
          <line x1="0" y1="0" x2="20" y2="0" stroke="var(--foreground)" strokeWidth="2.5" />
          <text x="26" y="3.5" fill="var(--muted)" fontSize="10">
            Measured TFP
          </text>
          <line
            x1="120"
            y1="0"
            x2="140"
            y2="0"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.5"
          />
          <text x="146" y="3.5" fill="var(--muted)" fontSize="10">
            True TFP
          </text>
        </g>
      </svg>

      {/* Phase detail card (appears on hover/click) */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: activeInfo ? 120 : 0,
          opacity: activeInfo ? 1 : 0,
        }}
      >
        {activeInfo && (
          <div
            className="rounded-lg px-4 py-3 text-[13px] leading-relaxed"
            style={{
              backgroundColor: activeInfo.color + "10",
              borderLeft: `3px solid ${activeInfo.color}`,
              color: "var(--foreground)",
            }}
          >
            <span className="font-bold" style={{ color: activeInfo.color }}>
              {activeInfo.label}:
            </span>{" "}
            {activeInfo.description}
          </div>
        )}
      </div>

      <p className="text-[11px] text-[var(--muted)] text-center italic">
        Click or hover on a phase region to learn more
      </p>
    </div>
  );
}
