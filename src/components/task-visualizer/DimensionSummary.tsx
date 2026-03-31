"use client";

import { DIMENSION_META, type DimensionKey } from "@/lib/composite-risk";

export interface DimensionScoreData {
  scores: Record<DimensionKey, number>;
  dimensionality: {
    effectiveDimensions: number;
    complementarityBase: number;
    dimensionalityAdj: number;
    source: "cfo" | "heuristic";
  };
}

interface Props {
  data: DimensionScoreData;
}

const BAR_DIMENSIONS: DimensionKey[] = [
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

function riskColor(value: number): string {
  return value > 6 ? "#DC2626" : value > 4 ? "#D97706" : "#059669";
}

function riskLabel(value: number): string {
  return value > 6
    ? "High displacement risk"
    : value > 4
      ? "Moderate displacement risk"
      : "Lower displacement risk";
}

function scoreColor(value: number, isPressure: boolean): string {
  if (isPressure) {
    return value > 6 ? "#DC2626" : value > 3 ? "#D97706" : "#059669";
  }
  return value > 6 ? "#059669" : value > 3 ? "#D97706" : "#DC2626";
}

export default function DimensionSummary({ data }: Props) {
  const { scores, dimensionality } = data;
  const rc = riskColor(scores.netRisk);

  return (
    <div className="rounded-xl border border-black/[0.06] bg-black/[0.02] p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
        5-Dimension Displacement Risk
      </h3>

      {/* Net risk callout */}
      <div
        className="flex items-center gap-3 p-3 rounded-lg mb-5"
        style={{ background: rc + "0C" }}
      >
        <span
          className="text-[32px] font-black leading-none"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: rc,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {scores.netRisk.toFixed(1)}
        </span>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: rc }}>
            {riskLabel(scores.netRisk)}
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Composite of 5 research-backed dimensions
          </p>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {BAR_DIMENSIONS.map((dim) => {
          const meta = DIMENSION_META[dim];
          const value = scores[dim];
          const pct = (value / 10) * 100;
          const color = scoreColor(value, meta.isPressure);

          return (
            <div key={dim}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium text-[var(--foreground)]">
                    {meta.shortLabel}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--muted)] opacity-70">
                    {meta.isPressure ? "pressure" : "buffer"}
                  </span>
                </div>
                <span
                  className="text-[12px] font-bold"
                  style={{ fontFamily: "'DM Mono', monospace", color }}
                >
                  {value.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              {dim === "complementarity" && dimensionality.dimensionalityAdj !== 0 && (
                <p className="text-[10px] text-[var(--muted)] mt-0.5 opacity-70">
                  {dimensionality.effectiveDimensions} task dimensions
                  {" "}({dimensionality.dimensionalityAdj > 0 ? "+" : ""}
                  {dimensionality.dimensionalityAdj.toFixed(1)} from dimensionality)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Methodology note */}
      <p className="text-[10px] text-[var(--muted)] mt-4 leading-relaxed opacity-70">
        Technical exposure (30%) and adoption speed (20%) drive displacement pressure.
        Adaptability (15%), demand elasticity (15%), and AI complementarity (20%) absorb it.
      </p>
    </div>
  );
}
