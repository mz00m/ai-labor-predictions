"use client";

import { useMemo, useState } from "react";
import { riskColor100, formatJobs } from "./types";

interface StateRiskRow {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  matchedEmployment: number;
  coverage: number;
  weightedNetRisk100: number;
  weightedNetRisk: number;
  weightedPctHighRiskTime: number;
  topRiskOccupations: { slug: string; title: string; employment: number; netRisk100: number }[];
  occupationCount: number;
}

interface StatePathRow {
  id: string;
  name: string;
  d: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

interface Props {
  stateRisk: { states: StateRiskRow[]; generatedAt: string };
  statePaths: { states: StatePathRow[]; width: number; height: number };
}

type Metric = "netRisk" | "pctHigh";

export default function StateChoropleth({ stateRisk, statePaths }: Props) {
  const [metric, setMetric] = useState<Metric>("pctHigh");
  const [hoverFips, setHoverFips] = useState<string | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);

  const byFips = useMemo(() => {
    const m = new Map<string, StateRiskRow>();
    for (const s of stateRisk.states) m.set(s.fips, s);
    return m;
  }, [stateRisk]);

  // Normalize across the actual observed range so contrast pops even though
  // every state is in 51-54 net-risk. We rescale to a 0-100 display value
  // for color, while keeping the raw number in the tooltip.
  const range = useMemo(() => {
    const vals = stateRisk.states.map((s) =>
      metric === "netRisk" ? s.weightedNetRisk100 : s.weightedPctHighRiskTime,
    );
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [stateRisk, metric]);

  function colorFor(fips: string): string {
    const s = byFips.get(fips);
    if (!s) return "#F3F4F6";
    const v = metric === "netRisk" ? s.weightedNetRisk100 : s.weightedPctHighRiskTime;
    const span = Math.max(0.001, range.max - range.min);
    // Stretch the visible range so 0=min and 100=max
    const display = ((v - range.min) / span) * 100;
    return riskColor100(display);
  }

  const active = selectedFips ?? hoverFips;
  const activeState = active ? byFips.get(active) ?? null : null;

  return (
    <div className="border border-card rounded-lg overflow-hidden">
      {/* Header strip */}
      <div className="flex items-baseline justify-between gap-4 px-5 py-4 border-b border-card">
        <div>
          <h3 className="text-lg font-semibold text-heading">State-level risk</h3>
          <p className="text-2xs text-[var(--muted)] mt-0.5">
            Employment-weighted across {stateRisk.states[0]?.occupationCount ?? 0}+ matched
            occupations per state · BLS OEWS May 2024
          </p>
        </div>
        <div className="flex items-center gap-1 text-2xs">
          <button
            onClick={() => setMetric("pctHigh")}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              metric === "pctHigh"
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-card text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            % high-risk time
          </button>
          <button
            onClick={() => setMetric("netRisk")}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              metric === "netRisk"
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-card text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Net risk
          </button>
        </div>
      </div>

      {/* Map + side panel */}
      <div className="grid md:grid-cols-[1fr_280px] gap-0">
        <div className="relative bg-[#FAFAFA]">
          <svg
            viewBox={`0 0 ${statePaths.width} ${statePaths.height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Choropleth of US states colored by AI risk"
          >
            {statePaths.states.map((p) => {
              const isActive = active === p.id;
              const isSelected = selectedFips === p.id;
              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={colorFor(p.id)}
                  stroke={isSelected ? "#111" : "#fff"}
                  strokeWidth={isSelected ? 1.5 : isActive ? 1 : 0.5}
                  className="cursor-pointer transition-[stroke,stroke-width] duration-150"
                  onMouseEnter={() => setHoverFips(p.id)}
                  onMouseLeave={() => setHoverFips(null)}
                  onClick={() =>
                    setSelectedFips((cur) => (cur === p.id ? null : p.id))
                  }
                  aria-label={p.name}
                />
              );
            })}
            {/* State abbreviations for the larger states */}
            {statePaths.states.map((p) => {
              const w = p.bbox[2] - p.bbox[0];
              const h = p.bbox[3] - p.bbox[1];
              if (w < 40 || h < 25) return null;
              const s = byFips.get(p.id);
              if (!s) return null;
              return (
                <text
                  key={`label-${p.id}`}
                  x={p.centroid[0]}
                  y={p.centroid[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 10,
                    fontFamily: "'DM Mono', monospace",
                    fill: "#111",
                    fillOpacity: 0.75,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {s.abbr}
                </text>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur border border-card rounded-md px-3 py-2 text-2xs leading-tight">
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {metric === "pctHigh" ? "% high-risk task time" : "Net risk (0–100)"}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[var(--muted)]">{range.min.toFixed(metric === "pctHigh" ? 1 : 0)}</span>
              <div
                className="h-2 w-32 rounded-sm"
                style={{
                  background:
                    "linear-gradient(to right, #16A34A, #FBBF24, #F59E0B, #DC2626)",
                }}
              />
              <span className="text-[var(--muted)]">{range.max.toFixed(metric === "pctHigh" ? 1 : 0)}</span>
            </div>
          </div>
        </div>

        {/* Side panel — state details */}
        <div className="border-l border-card p-5 bg-white min-h-[260px]">
          {activeState ? (
            <div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-lg font-bold text-heading">{activeState.title}</h4>
                <span className="text-2xs text-[var(--muted)] font-mono">{activeState.abbr}</span>
              </div>
              <p className="text-2xs text-[var(--muted)] mt-0.5">
                {formatJobs(activeState.totalEmployment)} jobs &middot;{" "}
                {(activeState.coverage * 100).toFixed(0)}% scored
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Net risk
                  </div>
                  <div
                    className="mt-0.5 font-mono text-xl font-bold"
                    style={{ color: riskColor100(activeState.weightedNetRisk100) }}
                  >
                    {activeState.weightedNetRisk100}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    High-risk time
                  </div>
                  <div
                    className="mt-0.5 font-mono text-xl font-bold"
                    style={{ color: riskColor100(activeState.weightedPctHighRiskTime * 1.5) }}
                  >
                    {activeState.weightedPctHighRiskTime.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Top-risk roles in state
                </div>
                <ul className="space-y-1.5">
                  {activeState.topRiskOccupations.slice(0, 5).map((o) => (
                    <li key={o.slug}>
                      <a
                        href={`/occupation-exposure/${o.slug}`}
                        className="flex items-center justify-between gap-2 text-2xs hover:text-[var(--accent)] transition-colors"
                      >
                        <span className="truncate">{o.title}</span>
                        <span className="font-mono text-[var(--muted)] shrink-0">
                          {formatJobs(o.employment)} · {o.netRisk100}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedFips && (
                <button
                  onClick={() => setSelectedFips(null)}
                  className="mt-4 text-2xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                >
                  Clear selection
                </button>
              )}
            </div>
          ) : (
            <div className="text-2xs text-[var(--muted)] leading-relaxed">
              <p className="font-semibold text-[var(--foreground)] mb-2">
                Hover or click a state.
              </p>
              <p>
                Color encodes the {metric === "pctHigh" ? "share of employment-weighted task time in high-risk tasks" : "employment-weighted net risk score"}.
                The risk range across states is narrow (high employment averages converge), so colors are stretched across the observed min–max for contrast.
              </p>
              <p className="mt-2">
                State scores roll up the 5-variable framework: per-occupation risk × OEWS state employment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Caveat strip */}
      <div className="border-t border-card px-5 py-2.5 text-2xs text-[var(--muted)] bg-[#FAFAFA]">
        Coverage is partial — OEWS publishes ~800 SOC codes; we score ~325 of them. The
        weighted-risk average treats the unscored remainder as missing-at-random. State
        coverage varies 50–55%.
      </div>
    </div>
  );
}
