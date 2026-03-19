"use client";

import { DIMENSION_META, type DimensionKey, type ScoredOccupation } from "@/lib/composite-risk";
import { DEMAND_ELASTICITY, DEMAND_ELASTICITY_META } from "@/data/economy-occupations";
import { SOC_INDUSTRY_SPEED, getSpeedLabel } from "@/data/industry-adoption-speed";
import Link from "next/link";
import { SOC_TO_JOB_IDS } from "@/data/economy-occupations";

interface Props {
  occupation: ScoredOccupation;
  onClose: () => void;
}

const BAR_DIMENSIONS: DimensionKey[] = [
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

function ScoreBar({
  dimension,
  value,
  rationale,
}: {
  dimension: DimensionKey;
  value: number;
  rationale: string;
}) {
  const meta = DIMENSION_META[dimension];
  const pct = (value / 10) * 100;
  const barColor = meta.isPressure
    ? value > 6
      ? "#DC2626"
      : value > 3
        ? "#F59E0B"
        : "#16A34A"
    : value > 6
      ? "#16A34A"
      : value > 3
        ? "#F59E0B"
        : "#DC2626";

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-medium text-[var(--foreground)]">
          {meta.label}
          <span className="ml-1.5 text-[10px] text-[var(--muted)]">
            ({meta.isPressure ? "pressure" : "absorption"})
          </span>
        </span>
        <span
          className="text-[13px] font-bold"
          style={{ fontFamily: "'DM Mono', monospace", color: barColor }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-snug">
        {rationale}
      </p>
    </div>
  );
}

export default function OccupationDetail({ occupation, onClose }: Props) {
  const { group, scores, rationales } = occupation;
  const elasticity = DEMAND_ELASTICITY[group.id];
  const speedMultiplier = SOC_INDUSTRY_SPEED[group.id];
  const jobIds = SOC_TO_JOB_IDS[group.id] ?? [];

  const riskColor =
    scores.netRisk > 6
      ? "#DC2626"
      : scores.netRisk > 4
        ? "#F59E0B"
        : "#16A34A";
  const riskLabel =
    scores.netRisk > 6
      ? "High displacement risk"
      : scores.netRisk > 4
        ? "Moderate displacement risk"
        : "Lower displacement risk";

  return (
    <div className="border border-black/[0.08] rounded-xl bg-white p-5 sm:p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Close detail"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>

      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
          {group.socCode}
        </p>
        <h3 className="text-[20px] sm:text-[24px] font-bold text-[var(--foreground)] leading-tight mb-2">
          {group.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            {group.employment.toLocaleString()}K workers
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            ${group.medianWageAnnual.toLocaleString()}/yr median
          </span>
          {elasticity && (
            <span
              className="pill"
              style={{
                background:
                  DEMAND_ELASTICITY_META[elasticity.elasticity].color + "18",
                color: DEMAND_ELASTICITY_META[elasticity.elasticity].color,
              }}
            >
              {elasticity.elasticity} elasticity
            </span>
          )}
          {speedMultiplier && (
            <span className="pill bg-black/[0.04] text-[var(--muted)]">
              {getSpeedLabel(speedMultiplier)} adoption
            </span>
          )}
        </div>

        {/* Net risk callout */}
        <div
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{ background: riskColor + "0D" }}
        >
          <span
            className="text-[28px] font-black"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: riskColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scores.netRisk.toFixed(1)}
          </span>
          <div>
            <p
              className="text-[13px] font-semibold"
              style={{ color: riskColor }}
            >
              {riskLabel}
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Composite of 5 dimensions (higher = more displacement pressure)
            </p>
          </div>
        </div>
      </div>

      {/* Dimension scores */}
      <div className="mb-4">
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
          Dimension Breakdown
        </h4>
        {BAR_DIMENSIONS.map((dim) => (
          <ScoreBar
            key={dim}
            dimension={dim}
            value={scores[dim]}
            rationale={rationales[dim]}
          />
        ))}
      </div>

      {/* Task visualizer link */}
      {jobIds.length > 0 && (
        <div className="border-t border-black/[0.06] pt-3 mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
            Explore individual jobs in this group
          </p>
          <div className="flex flex-wrap gap-2">
            {jobIds.slice(0, 4).map((jobId) => (
              <Link
                key={jobId}
                href={`/task-visualizer?job=${jobId}`}
                className="text-[12px] font-medium text-[var(--accent-text)] hover:underline"
              >
                {jobId.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
