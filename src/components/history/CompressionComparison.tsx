"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MAX_YEARS = 90;

interface Transition {
  id: string;
  name: string;
  period: string;
  totalYears: number;
  totalYearsHigh?: number;
  painfulYears: number;
  painfulYearsHigh?: number;
  painfulLabel: string;
  color: string;
  source: string;
  isProjection?: boolean;
}

const TRANSITIONS: Transition[] = [
  {
    id: "steam",
    name: "Steam Power",
    period: "1760–1850",
    totalYears: 90,
    painfulYears: 60,
    painfulLabel: "Engel's Pause: 60 yrs of wage stagnation",
    color: "#b45309",
    source: "Allen (2009)",
  },
  {
    id: "combustion",
    name: "Internal Combustion",
    period: "1880–1940",
    totalYears: 60,
    painfulYears: 20,
    painfulLabel: "20 yrs of interwar structural unemployment",
    color: "#047857",
    source: "Gordon (2016)",
  },
  {
    id: "electricity",
    name: "Electrification",
    period: "1880–1930",
    totalYears: 50,
    painfulYears: 40,
    painfulLabel: "David's Productivity Paradox: 40 yrs to show gains",
    color: "#1d4ed8",
    source: "David (1990)",
  },
  {
    id: "computers",
    name: "Digital Computers",
    period: "1960–2000",
    totalYears: 40,
    painfulYears: 40,
    painfulLabel: "40 yrs of wage polarization for non-degree workers",
    color: "#6d28d9",
    source: "Autor et al. (2003)",
  },
  {
    id: "ai",
    name: "AI / LLMs",
    period: "2022–projected",
    totalYears: 7,
    totalYearsHigh: 15,
    painfulYears: 4,
    painfulYearsHigh: 10,
    painfulLabel: "Projected: 4–10 yrs of displacement + reorganization",
    color: "#5C61F6",
    source: "McKinsey, St. Louis Fed, Microsoft",
    isProjection: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Layout constants                                                   */
/* ------------------------------------------------------------------ */

const W = 1050;
const BL = 360; // baseline y
const OX = 80; // origin x
const EX = 1010; // end x
const TW = EX - OX; // timeline pixel width
const MAX_H = 310; // max arc height (Steam)
const VB_TOP = 130; // viewBox y offset — crops empty space above arcs
const VB_H = 290; // viewBox height
const GREY = "#b4b9c4"; // background arc color

function xOf(yr: number) {
  return OX + (yr / MAX_YEARS) * TW;
}
function hOf(yr: number) {
  return (yr / MAX_YEARS) * MAX_H;
}

/* ------------------------------------------------------------------ */
/*  Technology icons — crisp inline SVGs at arc peaks                  */
/* ------------------------------------------------------------------ */
function TechIcon({ id, x, y, color, active, vis, delay }: {
  id: string; x: number; y: number; color: string;
  active: boolean; vis: boolean; delay: number;
}) {
  const size = active ? 28 : 20;
  const half = size / 2;
  const iconColor = active ? color : GREY;
  const opacity = active ? 0.9 : 0.3;

  const paths: Record<string, JSX.Element> = {
    steam: (
      // Gear/cog icon
      <g transform={`translate(${x - half}, ${y - half - 6}) scale(${size / 24})`}>
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="none" stroke={iconColor} strokeWidth="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    combustion: (
      // Flame icon
      <g transform={`translate(${x - half}, ${y - half - 6}) scale(${size / 24})`}>
        <path d="M12 2c.5 3.5-1.5 5-1.5 5C12.5 9 14 8.5 14 11c0 2-1.5 3-3 3s-3-1-3-3c0-3 2-5 4-9z" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22c4.418 0 8-3 8-7 0-5-4-8-4-8s0 3-2 5c0 0 2-1.5 2-4 0-2-2-4-4-7-2 3-4 5-4 7 0 2.5 2 4 2 4-2-2-2-5-2-5s-4 3-4 8c0 4 3.582 7 8 7z" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    electricity: (
      // Lightning bolt icon
      <g transform={`translate(${x - half}, ${y - half - 6}) scale(${size / 24})`}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    computers: (
      // CPU/chip icon
      <g transform={`translate(${x - half}, ${y - half - 6}) scale(${size / 24})`}>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke={iconColor} strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1" fill="none" stroke={iconColor} strokeWidth="1.5"/>
        <line x1="9" y1="1" x2="9" y2="4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="1" x2="15" y2="4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9" y1="20" x2="9" y2="23" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="20" x2="15" y2="23" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="9" x2="23" y2="9" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="15" x2="23" y2="15" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="1" y1="9" x2="4" y2="9" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="1" y1="15" x2="4" y2="15" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    ),
    ai: (
      // Brain/neural icon
      <g transform={`translate(${x - half}, ${y - half - 6}) scale(${size / 24})`}>
        <path d="M12 2a7 7 0 00-4.6 12.3A3 3 0 006 17v1a2 2 0 002 2h8a2 2 0 002-2v-1a3 3 0 00-1.4-2.7A7 7 0 0012 2z" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 22v-1m6 1v-1M12 2v-0" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="10" r="0.5" fill={iconColor}/>
        <circle cx="15" cy="10" r="0.5" fill={iconColor}/>
      </g>
    ),
  };

  return (
    <g
      style={{
        opacity: vis ? opacity : 0,
        transition: `opacity 0.5s ease ${delay}s, transform 0.4s ease ${delay}s`,
        transform: vis ? "scale(1)" : "scale(0.5)",
        transformOrigin: `${x}px ${y - 6}px`,
      }}
      aria-hidden="true"
    >
      {paths[id] ?? null}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Key Metrics — count-up numbers on scroll-in                        */
/* ------------------------------------------------------------------ */

function KeyMetrics() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const diffLow = useCountUp(5, 700, inView ? 0 : 99999);
  const diffHigh = useCountUp(12, 700, inView ? 200 : 99999);
  const painLow = useCountUp(4, 700, inView ? 100 : 99999);
  const painHigh = useCountUp(10, 700, inView ? 300 : 99999);
  const coverage = useCountUp(70, 800, inView ? 200 : 99999);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="metric-card border border-black/[0.06] rounded-lg p-4 text-center">
        <div
          className="text-[28px] font-extrabold text-[var(--accent)] tabular-nums"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {inView ? diffLow : 0}&ndash;{inView ? diffHigh : 0}&times;
        </div>
        <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
          Faster Diffusion
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
          Range depends on comparison
          <br />
          <a href="#diffusion-comparison" className="text-[var(--accent)] underline underline-offset-2">
            See methodology &darr;
          </a>
        </div>
        <div className="text-[10px] text-[var(--muted)] mt-1 italic">
          Multiple sources; see table below
        </div>
      </div>

      <div className="metric-card border border-black/[0.06] rounded-lg p-4 text-center">
        <div
          className="text-[28px] font-extrabold tabular-nums"
          style={{ color: "#F66B5C", fontVariantNumeric: "tabular-nums" }}
        >
          {inView ? painLow : 0}&ndash;{inView ? painHigh : 0}
        </div>
        <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
          Years, Projected Painful Phase
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
          Displacement + reorganization
          <br />
          vs. 20&ndash;60 yrs historically
        </div>
        <div className="text-[10px] text-[var(--muted)] mt-1 italic">
          Extrapolated from adoption speed
        </div>
      </div>

      <div className="metric-card border border-black/[0.06] rounded-lg p-4 text-center">
        <div
          className="text-[28px] font-extrabold text-[var(--foreground)] tabular-nums"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          ~{inView ? coverage : 0}%
        </div>
        <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
          Workers With AI Task Coverage
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
          Observed in first-party API traffic
          <br />
          No systematic unemployment yet
        </div>
        <div className="text-[10px] text-[var(--muted)] mt-1 italic">
          Anthropic / Massenkoff &amp; McCrory (2026)
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CompressionComparison() {
  const wrap = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState<string | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ---- pre-compute geometry ---- */
  const arcs = TRANSITIONS.map((t) => {
    const yrs = t.totalYearsHigh ?? t.totalYears;
    const endX = xOf(yrs);
    const midX = (OX + endX) / 2;
    const peakY = BL - hOf(yrs);
    const arcD = `M ${OX},${BL} Q ${midX},${peakY} ${endX},${BL}`;
    // Actual visual peak of quadratic bezier at t=0.5: (BL + peakY) / 2
    const visualPeakY = (BL + peakY) / 2;

    let lowEndX = endX;
    let lowMidX = midX;
    let lowPeakY = peakY;
    let lowArcD = arcD;
    let lowVisualPeakY = visualPeakY;
    if (t.totalYearsHigh) {
      lowEndX = xOf(t.totalYears);
      lowMidX = (OX + lowEndX) / 2;
      lowPeakY = BL - hOf(t.totalYears);
      lowArcD = `M ${OX},${BL} Q ${lowMidX},${lowPeakY} ${lowEndX},${BL}`;
      lowVisualPeakY = (BL + lowPeakY) / 2;
    }

    return {
      endX,
      midX,
      peakY,
      visualPeakY,
      arcD,
      lowEndX,
      lowMidX,
      lowPeakY,
      lowVisualPeakY,
      lowArcD,
    };
  });

  const historical = TRANSITIONS.filter((t) => !t.isProjection);
  const ai = TRANSITIONS.find((t) => t.isProjection)!;
  const aiIdx = TRANSITIONS.indexOf(ai);
  const aiArc = arcs[aiIdx];

  return (
    <div className="mt-5 space-y-4" ref={wrap}>
      {/* ---- Header ---- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <a
            href="#diffusion-comparison"
            className="text-[11px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2.5 py-1 rounded-full hover:bg-[var(--accent)]/90 transition-colors cursor-pointer no-underline"
          >
            5–12× faster ↓
          </a>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
            Historical Compression
          </span>
        </div>
        <p className="text-[13px] text-[var(--foreground)] leading-relaxed font-semibold mb-1">
          Each successive technology has diffused faster than the last.
        </p>
        <p className="text-[12px] text-[var(--muted)] leading-[1.7] max-w-[600px]">
          Steam took 90 years to fully reshape the labor market.
          Electrification did it in 50. Computers in 40. Each arc below spans a
          technology&rsquo;s full transition from emergence to new
          equilibrium, and each is shorter than the one before.
          AI is on pace to be the fastest diffusion of a general-purpose
          technology in recorded history: 100M users in 2 months, majority
          adult adoption in under 3 years. Hover any arc to compare.
        </p>
      </div>

      {/* ============================================================ */}
      {/*  DESKTOP — Arc timeline                                      */}
      {/* ============================================================ */}
      <div className="hidden md:block">
        <svg
          viewBox={`0 ${VB_TOP} ${W} ${VB_H}`}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* AI fill gradient — top-to-bottom wash */}
            <linearGradient
              id="ai-wash"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={String(aiArc.lowPeakY)}
              x2="0"
              y2={String(BL)}
            >
              <stop offset="0%" stopColor={ai.color} stopOpacity="0.14" />
              <stop offset="100%" stopColor={ai.color} stopOpacity="0.02" />
            </linearGradient>

            {/* AI high-range fill */}
            <linearGradient
              id="ai-wash-hi"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={String(aiArc.peakY)}
              x2="0"
              y2={String(BL)}
            >
              <stop offset="0%" stopColor={ai.color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={ai.color} stopOpacity="0.01" />
            </linearGradient>

            {/* Hover fill gradient for historical arcs */}
            {historical.map((t, i) => {
              const a = arcs[TRANSITIONS.indexOf(t)];
              return (
                <linearGradient
                  key={`hfill-${t.id}`}
                  id={`hfill-${t.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1={String(a.peakY)}
                  x2="0"
                  y2={String(BL)}
                >
                  <stop offset="0%" stopColor={t.color} stopOpacity="0.10" />
                  <stop
                    offset="100%"
                    stopColor={t.color}
                    stopOpacity="0.01"
                  />
                </linearGradient>
              );
            })}
          </defs>

          {/* ---- Timeline axis ---- */}
          <line
            x1={OX}
            y1={BL}
            x2={EX}
            y2={BL}
            stroke="var(--muted)"
            strokeWidth="1"
            opacity="0.12"
          />
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((yr) => {
            const x = xOf(yr);
            return (
              <g key={yr}>
                <line
                  x1={x}
                  y1={BL}
                  x2={x}
                  y2={BL + 6}
                  stroke="var(--muted)"
                  strokeWidth="0.5"
                  opacity="0.18"
                />
                <text
                  x={x}
                  y={BL + 20}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--muted)"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {yr}
                </text>
              </g>
            );
          })}
          <text
            x={(OX + EX) / 2}
            y={BL + 38}
            textAnchor="middle"
            fontSize="9"
            fill="var(--muted)"
            fontStyle="italic"
          >
            Years from emergence to new equilibrium
          </text>

          {/* ---- Origin dot ---- */}
          <circle
            cx={OX}
            cy={BL}
            r="3.5"
            fill="var(--foreground)"
            opacity="0.18"
          />

          {/* ============================================ */}
          {/*  Historical arcs — soft grey background      */}
          {/* ============================================ */}
          {historical.map((t) => {
            const idx = TRANSITIONS.indexOf(t);
            const a = arcs[idx];
            const active = hov === t.id;
            const anyHov = hov !== null;
            const dimmed = anyHov && !active && hov !== "ai";
            // AI fires first like a projectile, then historical arcs cascade shortest→longest
            // Reverse order: Computers(idx3)→Electricity(idx2)→Combustion(idx1)→Steam(idx0)
            const historicalRank = historical.length - 1 - historical.indexOf(t);
            const delay = 0.4 + historicalRank * 0.35;
            const duration = 0.5 + (t.totalYears / MAX_YEARS) * 0.5;

            // label position: sit just above the actual visual peak of the arc
            const labelMidX = a.midX;
            const anchor =
              labelMidX < 120 ? "start" : labelMidX > W - 120 ? "end" : "middle";
            const labelX =
              labelMidX < 120
                ? labelMidX + 8
                : labelMidX > W - 120
                  ? labelMidX - 8
                  : labelMidX;

            return (
              <g
                key={t.id}
                onMouseEnter={() => setHov(t.id)}
                onMouseLeave={() => setHov(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Wide invisible hit area */}
                <path
                  d={a.arcD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="18"
                />

                {/* Hover fill */}
                {active && (
                  <path
                    d={`${a.arcD} Z`}
                    fill={`url(#hfill-${t.id})`}
                    style={{
                      opacity: 1,
                    }}
                  />
                )}

                {/* Arc stroke */}
                <path
                  d={a.arcD}
                  fill="none"
                  stroke={active ? t.color : GREY}
                  strokeWidth={active ? 2.5 : 1.6}
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={vis ? "0" : "1"}
                  style={{
                    opacity: dimmed ? 0.12 : active ? 0.85 : 0.32,
                    transition: `stroke-dashoffset ${duration}s cubic-bezier(0.12, 0.9, 0.25, 1) ${delay}s, opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease`,
                  }}
                />

                {/* Endpoint dot */}
                <circle
                  cx={a.endX}
                  cy={BL}
                  r={active ? 4.5 : 2.5}
                  fill={active ? t.color : GREY}
                  style={{
                    opacity: dimmed
                      ? 0.1
                      : vis
                        ? active
                          ? 0.9
                          : 0.3
                        : 0,
                    transition: `opacity 0.3s ease ${delay + duration - 0.1}s, fill 0.3s ease`,
                  }}
                />

                {/* ---- Always-visible soft peak label ---- */}
                <text
                  x={labelX}
                  y={a.visualPeakY - (active ? 18 : 10)}
                  textAnchor={anchor}
                  fontSize={active ? "12" : "10"}
                  fontWeight={active ? "600" : "500"}
                  fill={active ? t.color : GREY}
                  style={{
                    opacity: dimmed
                      ? 0.06
                      : active
                        ? 0.9
                        : vis
                          ? 0.35
                          : 0,
                    transition: `opacity 0.4s ease ${active ? "0s" : `${delay + duration * 0.6}s`}, fill 0.3s ease, font-size 0.3s ease`,
                  }}
                >
                  {t.name}
                </text>

                {/* ---- Technology icon at peak ---- */}
                <TechIcon
                  id={t.id}
                  x={a.midX}
                  y={a.visualPeakY - (active ? 28 : 18)}
                  color={t.color}
                  active={active}
                  vis={vis}
                  delay={delay + duration * 0.7}
                />

                {/* ---- Hover detail labels ---- */}
                {active && (
                  <>
                    {/* Duration + period */}
                    <text
                      x={labelX}
                      y={a.visualPeakY - 5}
                      textAnchor={anchor}
                      fontSize="10"
                      fill={t.color}
                      opacity="0.65"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {t.totalYears} yrs &middot; {t.period}
                    </text>
                    {/* Painful phase */}
                    <text
                      x={labelX}
                      y={a.visualPeakY + 10}
                      textAnchor={anchor}
                      fontSize="9.5"
                      fontStyle="italic"
                      fill={t.color}
                      opacity="0.55"
                    >
                      {t.painfulLabel}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* ============================================ */}
          {/*  AI arc — always colored, the hero           */}
          {/* ============================================ */}
          <g
            onMouseEnter={() => setHov("ai")}
            onMouseLeave={() => setHov(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Hit area */}
            <path
              d={aiArc.lowArcD}
              fill="none"
              stroke="transparent"
              strokeWidth="24"
            />

            {/* Ghost arc — high range (15yr) */}
            <path
              d={`${aiArc.arcD} Z`}
              fill="url(#ai-wash-hi)"
              style={{
                opacity: vis ? 1 : 0,
                transition: "opacity 0.3s ease 0.2s",
              }}
            />
            <path
              d={aiArc.arcD}
              fill="none"
              stroke={ai.color}
              strokeWidth="1.2"
              strokeDasharray="5 4"
              strokeLinecap="round"
              pathLength="1"
              style={{
                strokeDashoffset: vis ? "0" : "1",
                opacity: hov === "ai" ? 0.4 : 0.2,
                transition:
                  "stroke-dashoffset 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0.12s, opacity 0.3s ease",
              }}
            />

            {/* Fill under main arc */}
            <path
              d={`${aiArc.lowArcD} Z`}
              fill="url(#ai-wash)"
              style={{
                opacity: vis ? 1 : 0,
                transition: "opacity 0.35s ease 0.15s",
              }}
            />

            {/* Main arc stroke — fires FIRST like a projectile */}
            <path
              d={aiArc.lowArcD}
              fill="none"
              stroke={ai.color}
              strokeWidth={hov === "ai" ? 3.5 : 2.8}
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={vis ? "0" : "1"}
              style={{
                opacity: hov === "ai" ? 1 : 0.85,
                transition:
                  "stroke-dashoffset 0.35s cubic-bezier(0.08, 0.82, 0.17, 1) 0.08s, opacity 0.3s ease, stroke-width 0.3s ease",
              }}
            />

            {/* Endpoint dots */}
            <circle
              cx={aiArc.lowEndX}
              cy={BL}
              r={hov === "ai" ? 5.5 : 4}
              fill={ai.color}
              style={{
                opacity: vis ? 0.9 : 0,
                transition: "opacity 0.2s ease 0.35s",
              }}
            />
            {ai.totalYearsHigh && (
              <circle
                cx={aiArc.endX}
                cy={BL}
                r="2.5"
                fill={ai.color}
                style={{
                  opacity: vis ? 0.3 : 0,
                  transition: "opacity 0.2s ease 0.4s",
                }}
              />
            )}

            {/* AI icon at arc peak */}
            <TechIcon
              id="ai"
              x={(OX + aiArc.lowEndX) / 2}
              y={aiArc.lowVisualPeakY - 22}
              color={ai.color}
              active={hov === "ai"}
              vis={vis}
              delay={0.25}
            />

            {/* AI label — always visible */}
            <text
              x={aiArc.lowEndX + 14}
              y={BL - 28}
              textAnchor="start"
              fontSize="13"
              fontWeight="700"
              fill={ai.color}
              style={{
                opacity: vis ? 1 : 0,
                transition: "opacity 0.3s ease 0.3s",
              }}
            >
              AI / LLMs
            </text>
            <text
              x={aiArc.lowEndX + 14}
              y={BL - 14}
              textAnchor="start"
              fontSize="11"
              fill={ai.color}
              style={{
                opacity: vis ? 0.7 : 0,
                fontVariantNumeric: "tabular-nums",
                transition: "opacity 0.3s ease 0.35s",
              }}
            >
              {ai.totalYears}&ndash;{ai.totalYearsHigh} yrs
            </text>

            {/* Hover detail */}
            {hov === "ai" && (
              <text
                x={aiArc.lowEndX + 14}
                y={BL}
                textAnchor="start"
                fontSize="9.5"
                fontStyle="italic"
                fill={ai.color}
                opacity="0.6"
              >
                {ai.painfulLabel}
              </text>
            )}
          </g>

          {/* ---- "Today" label at origin ---- */}
          <text
            x={OX}
            y={BL + 20}
            textAnchor="middle"
            fontSize="9"
            fill="var(--muted)"
            style={{
              opacity: vis ? 0.4 : 0,
              transition: "opacity 0.5s ease 0.2s",
            }}
          >
            0
          </text>
        </svg>

        {/* Sources */}
        <p className="text-[10px] text-[var(--muted)] italic mt-0">
          Sources: {TRANSITIONS.map((t) => t.source).join("; ")}
        </p>
      </div>

      {/* ============================================================ */}
      {/*  MOBILE — simplified arc view                                */}
      {/* ============================================================ */}
      <div className="md:hidden">
        <svg
          viewBox="0 0 380 320"
          className="w-full"
          style={{ overflow: "visible" }}
        >
          {(() => {
            const mBL = 260;
            const mOX = 20;
            const mEX = 370;
            const mTW = mEX - mOX;
            const mMaxH = 220;

            const mxOf = (yr: number) => mOX + (yr / MAX_YEARS) * mTW;
            const mhOf = (yr: number) => (yr / MAX_YEARS) * mMaxH;

            return (
              <>
                {/* Mobile defs */}
                <defs>
                  <linearGradient
                    id="m-ai-wash"
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={String(mBL - mhOf(ai.totalYears))}
                    x2="0"
                    y2={String(mBL)}
                  >
                    <stop
                      offset="0%"
                      stopColor={ai.color}
                      stopOpacity="0.14"
                    />
                    <stop
                      offset="100%"
                      stopColor={ai.color}
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                </defs>

                {/* Axis */}
                <line
                  x1={mOX}
                  y1={mBL}
                  x2={mEX}
                  y2={mBL}
                  stroke="var(--muted)"
                  strokeWidth="0.5"
                  opacity="0.15"
                />
                {[0, 20, 40, 60, 80].map((yr) => (
                  <text
                    key={yr}
                    x={mxOf(yr)}
                    y={mBL + 16}
                    textAnchor="middle"
                    fontSize="8"
                    fill="var(--muted)"
                  >
                    {yr}
                  </text>
                ))}
                <text
                  x={(mOX + mEX) / 2}
                  y={mBL + 30}
                  textAnchor="middle"
                  fontSize="8"
                  fill="var(--muted)"
                  fontStyle="italic"
                >
                  Years from emergence to equilibrium
                </text>

                {/* Historical arcs — grey, animated on scroll, shortest first */}
                {historical.map((t) => {
                  const yrs = t.totalYears;
                  const endX = mxOf(yrs);
                  const midX = (mOX + endX) / 2;
                  const peakY = mBL - mhOf(yrs);
                  const d = `M ${mOX},${mBL} Q ${midX},${peakY} ${endX},${mBL}`;
                  const mRank = historical.length - 1 - historical.indexOf(t);
                  const mDelay = 0.4 + mRank * 0.35;
                  const mDuration = 0.5 + (yrs / MAX_YEARS) * 0.5;
                  return (
                    <g key={t.id}>
                      <path
                        d={d}
                        fill="none"
                        stroke={GREY}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset={vis ? "0" : "1"}
                        style={{
                          opacity: 0.28,
                          transition: `stroke-dashoffset ${mDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${mDelay}s`,
                        }}
                      />
                      <text
                        x={endX}
                        y={mBL - 6}
                        textAnchor="middle"
                        fontSize="7.5"
                        fill={GREY}
                        style={{
                          opacity: vis ? 0.5 : 0,
                          transition: `opacity 0.3s ease ${mDelay + mDuration - 0.1}s`,
                        }}
                      >
                        {t.totalYears}
                      </text>
                      <text
                        x={midX}
                        y={peakY - 6}
                        textAnchor="middle"
                        fontSize="8"
                        fill={GREY}
                        style={{
                          opacity: vis ? 0.45 : 0,
                          transition: `opacity 0.4s ease ${mDelay + mDuration * 0.6}s`,
                        }}
                      >
                        {t.name}
                      </text>
                    </g>
                  );
                })}

                {/* AI arc — colored hero */}
                {(() => {
                  const yrs = ai.totalYears;
                  const yrsHi = ai.totalYearsHigh!;
                  const lowEnd = mxOf(yrs);
                  const hiEnd = mxOf(yrsHi);
                  const lowMid = (mOX + lowEnd) / 2;
                  const hiMid = (mOX + hiEnd) / 2;
                  const lowPk = mBL - mhOf(yrs);
                  const hiPk = mBL - mhOf(yrsHi);
                  const lowD = `M ${mOX},${mBL} Q ${lowMid},${lowPk} ${lowEnd},${mBL}`;
                  const hiD = `M ${mOX},${mBL} Q ${hiMid},${hiPk} ${hiEnd},${mBL}`;

                  return (
                    <g>
                      {/* Ghost high range */}
                      <path
                        d={hiD}
                        fill="none"
                        stroke={ai.color}
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        pathLength="1"
                        strokeDashoffset={vis ? "0" : "1"}
                        style={{
                          opacity: 0.2,
                          transition: "stroke-dashoffset 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0.12s",
                        }}
                      />
                      {/* Fill */}
                      <path
                        d={`${lowD} Z`}
                        fill="url(#m-ai-wash)"
                        style={{
                          opacity: vis ? 1 : 0,
                          transition: "opacity 0.35s ease 0.15s",
                        }}
                      />
                      {/* Main stroke — fires FIRST */}
                      <path
                        d={lowD}
                        fill="none"
                        stroke={ai.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset={vis ? "0" : "1"}
                        style={{
                          opacity: 0.85,
                          transition: "stroke-dashoffset 0.35s cubic-bezier(0.08, 0.82, 0.17, 1) 0.08s",
                        }}
                      />
                      {/* Dot */}
                      <circle
                        cx={lowEnd}
                        cy={mBL}
                        r="3.5"
                        fill={ai.color}
                        style={{
                          opacity: vis ? 0.9 : 0,
                          transition: "opacity 0.2s ease 0.35s",
                        }}
                      />
                      {/* Label */}
                      <text
                        x={lowEnd + 10}
                        y={mBL - 18}
                        textAnchor="start"
                        fontSize="10"
                        fontWeight="700"
                        fill={ai.color}
                        style={{
                          opacity: vis ? 1 : 0,
                          transition: "opacity 0.3s ease 0.3s",
                        }}
                      >
                        AI / LLMs
                      </text>
                      <text
                        x={lowEnd + 10}
                        y={mBL - 6}
                        textAnchor="start"
                        fontSize="9"
                        fill={ai.color}
                        style={{
                          opacity: vis ? 0.65 : 0,
                          transition: "opacity 0.3s ease 0.35s",
                        }}
                      >
                        {ai.totalYears}–{ai.totalYearsHigh} yrs
                      </text>
                    </g>
                  );
                })()}

                {/* Origin dot */}
                <circle
                  cx={mOX}
                  cy={mBL}
                  r="2.5"
                  fill="var(--foreground)"
                  opacity="0.15"
                />
              </>
            );
          })()}
        </svg>
      </div>

      {/* ============================================================ */}
      {/*  Key metrics — animated count-up                             */}
      {/* ============================================================ */}
      <KeyMetrics />

      {/* ============================================================ */}
      {/*  Caveat                                                      */}
      {/* ============================================================ */}
      <div className="border-l-2 border-black/[0.08] pl-4 py-1">
        <p className="text-[12px] text-[var(--foreground)]/70 leading-relaxed italic">
          These projections extrapolate from adoption speed. If the diffusion
          phase that historically took 10&ndash;25 years is happening in
          1&ndash;3, the displacement and reorganization phases may compress as
          well. That said, prior GPTs show that adoption speed does not
          reliably predict impact speed. The internet reached 50% of households
          by 2000 but didn&rsquo;t show clear labor market effects for another
          decade. Organizational restructuring, education systems, and policy
          still operate at human speed.{" "}
          <a
            href="/predictions/genai-work-adoption"
            className="text-[var(--accent)] underline underline-offset-2 font-medium not-italic"
          >
            See live adoption data &rarr;
          </a>{" "}
          <a
            href="/predictions/ai-adoption-rate"
            className="text-[var(--accent)] underline underline-offset-2 font-medium not-italic"
          >
            See enterprise adoption data &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
