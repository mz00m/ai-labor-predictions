"use client";

import { useEffect, useRef, useState } from "react";

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
    painfulLabel: "Engel's Pause — 60 yrs of wage stagnation",
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
    painfulLabel: "David's Productivity Paradox — 40 yrs to show gains",
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

const W = 820;
const BL = 340; // baseline y
const OX = 60; // origin x
const EX = 785; // end x
const TW = EX - OX; // timeline pixel width
const MAX_H = 280; // max arc height (Steam)
const VB_TOP = 150; // viewBox y offset — crops empty space above arcs
const VB_H = 245; // viewBox height (150 → 395)
const GREY = "#b4b9c4"; // background arc color

function xOf(yr: number) {
  return OX + (yr / MAX_YEARS) * TW;
}
function hOf(yr: number) {
  return (yr / MAX_YEARS) * MAX_H;
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2.5 py-1 rounded-full">
            10× faster
          </span>
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
          equilibrium &mdash; and each is shorter than the one before.
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
            const delay = idx * 0.18;

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
                    transition: `stroke-dashoffset 0.9s ease ${delay}s, opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease`,
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
                    transition: `opacity 0.4s ease ${delay + 0.7}s, fill 0.3s ease`,
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
                    transition: `opacity 0.4s ease ${active ? "0s" : `${delay + 0.6}s`}, fill 0.3s ease, font-size 0.3s ease`,
                  }}
                >
                  {t.name}
                </text>

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
                transition: "opacity 0.5s ease 0.9s",
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
                  "stroke-dashoffset 0.7s ease 0.85s, opacity 0.3s ease",
              }}
            />

            {/* Fill under main arc */}
            <path
              d={`${aiArc.lowArcD} Z`}
              fill="url(#ai-wash)"
              style={{
                opacity: vis ? 1 : 0,
                transition: "opacity 0.6s ease 1s",
              }}
            />

            {/* Main arc stroke — vibrant */}
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
                  "stroke-dashoffset 0.6s ease 0.8s, opacity 0.3s ease, stroke-width 0.3s ease",
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
                transition: "opacity 0.4s ease 1.1s",
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
                  transition: "opacity 0.4s ease 1.1s",
                }}
              />
            )}

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
                transition: "opacity 0.5s ease 1.1s",
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
                transition: "opacity 0.5s ease 1.15s",
              }}
            >
              {ai.totalYears}&ndash;{ai.totalYearsHigh} yrs
            </text>

            {/* Hover detail */}
            {hov === "ai" && (
              <text
                x={aiArc.lowEndX + 14}
                y={BL - 0}
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

                {/* Historical arcs — grey */}
                {historical.map((t) => {
                  const yrs = t.totalYears;
                  const endX = mxOf(yrs);
                  const midX = (mOX + endX) / 2;
                  const peakY = mBL - mhOf(yrs);
                  const d = `M ${mOX},${mBL} Q ${midX},${peakY} ${endX},${mBL}`;
                  return (
                    <g key={t.id}>
                      <path
                        d={d}
                        fill="none"
                        stroke={GREY}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.28"
                      />
                      <text
                        x={endX}
                        y={mBL - 6}
                        textAnchor="middle"
                        fontSize="7.5"
                        fill={GREY}
                        opacity="0.5"
                      >
                        {t.totalYears}
                      </text>
                      <text
                        x={midX}
                        y={peakY - 6}
                        textAnchor="middle"
                        fontSize="8"
                        fill={GREY}
                        opacity="0.45"
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
                        opacity="0.2"
                      />
                      {/* Fill */}
                      <path d={`${lowD} Z`} fill="url(#m-ai-wash)" />
                      {/* Main stroke */}
                      <path
                        d={lowD}
                        fill="none"
                        stroke={ai.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      {/* Dot */}
                      <circle
                        cx={lowEnd}
                        cy={mBL}
                        r="3.5"
                        fill={ai.color}
                        opacity="0.9"
                      />
                      {/* Label */}
                      <text
                        x={lowEnd + 10}
                        y={mBL - 18}
                        textAnchor="start"
                        fontSize="10"
                        fontWeight="700"
                        fill={ai.color}
                      >
                        AI / LLMs
                      </text>
                      <text
                        x={lowEnd + 10}
                        y={mBL - 6}
                        textAnchor="start"
                        fontSize="9"
                        fill={ai.color}
                        opacity="0.65"
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
      {/*  Key metrics                                                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold text-[var(--accent)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            10×
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
            Faster Diffusion
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
            ChatGPT: 100M users in 2 months
            <br />
            Internet: 7 yrs &middot; PC: 10+ yrs
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1 italic">
            McKinsey; Microsoft AI Diffusion Report
          </div>
        </div>

        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold"
            style={{ color: "#F66B5C", fontVariantNumeric: "tabular-nums" }}
          >
            4–10
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
            Years &mdash; Projected Painful Phase
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
            Displacement + reorganization
            <br />
            vs. 20–60 yrs historically
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1 italic">
            Extrapolated from adoption speed
          </div>
        </div>

        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ~70%
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

      {/* ============================================================ */}
      {/*  Caveat                                                      */}
      {/* ============================================================ */}
      <div className="border-l-2 border-black/[0.08] pl-4 py-1">
        <p className="text-[12px] text-[var(--foreground)]/70 leading-relaxed italic">
          These projections extrapolate from adoption speed. If the diffusion
          phase that historically took 10&ndash;25 years is happening in
          1&ndash;3, the displacement and reorganization phases may compress as
          well &mdash; though prior GPTs show that adoption speed does not
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
