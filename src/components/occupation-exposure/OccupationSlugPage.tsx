"use client";

import Link from "next/link";
import { DIMENSION_META, type DimensionKey, type DimensionalityMeta } from "@/lib/composite-risk";
import { WEIGHTS } from "@/lib/scoring-shared";

// --- Types for server-passed data ---

interface EnrichedOccupation {
  slug: string;
  title: string;
  onetCode: string;
  category: string;
  pay: number | null;
  jobs: number | null;
  education: string;
  exposure: number;
  exposure_rationale: string;
  blsUrl: string;
  taskComposition: Record<string, number>;
  tasks: { name: string; category: string; importance: number }[];
}

export interface OccupationPageData {
  scores: Record<DimensionKey, number>;
  dimensionality: DimensionalityMeta;
  socGroupId: string;
  enriched: EnrichedOccupation;
}

// --- Sub-components ---

const BAR_DIMENSIONS: DimensionKey[] = [
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

function riskColor(value: number): string {
  return value > 6 ? "#DC2626" : value > 4 ? "#F59E0B" : "#16A34A";
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
    return value > 6 ? "#DC2626" : value > 3 ? "#F59E0B" : "#16A34A";
  }
  return value > 6 ? "#16A34A" : value > 3 ? "#F59E0B" : "#DC2626";
}

function ScoreBar({
  dimension,
  value,
}: {
  dimension: DimensionKey;
  value: number;
}) {
  const meta = DIMENSION_META[dimension];
  const pct = (value / 10) * 100;
  const color = scoreColor(value, meta.isPressure);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-[13px] font-semibold text-white/90">
            {meta.label}
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">
            {meta.isPressure ? "pressure" : "absorption"}
          </span>
        </div>
        <span
          className="text-[14px] font-bold"
          style={{ fontFamily: "'DM Mono', monospace", color }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-[11px] text-white/40 mt-1 leading-snug">
        {meta.description}
      </p>
    </div>
  );
}

function DimensionalityDetail({ dim }: { dim: DimensionalityMeta }) {
  const dimColor =
    dim.effectiveDimensions <= 2
      ? "#DC2626"
      : dim.effectiveDimensions >= 5
        ? "#16A34A"
        : "#F59E0B";
  const dimLabel =
    dim.effectiveDimensions <= 2
      ? "Low-dimensional"
      : dim.effectiveDimensions >= 5
        ? "High-dimensional"
        : "Mid-range";
  const adjSign = dim.dimensionalityAdj > 0 ? "+" : "";
  const sourceLabel = dim.source === "cfo" ? "CFO survey" : "Task heuristic";

  return (
    <div className="ml-0 mb-4 pl-3 border-l-2 border-white/[0.08]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: dimColor + "20", color: dimColor }}
        >
          {dim.effectiveDimensions} task dimension{dim.effectiveDimensions !== 1 ? "s" : ""}
        </span>
        <span className="text-[10px] text-white/40">{dimLabel}</span>
      </div>
      <p className="text-[10px] text-white/40 leading-snug">
        {sourceLabel} base: {dim.complementarityBase.toFixed(1)}
        {dim.dimensionalityAdj !== 0 && (
          <span style={{ color: dimColor }}>
            {" "}{adjSign}{dim.dimensionalityAdj.toFixed(1)} from dimensionality
          </span>
        )}
        {dim.dimensionalityAdj === 0 && (
          <span> (no dimensionality adjustment in mid-range)</span>
        )}
      </p>
    </div>
  );
}

// --- Task composition category metadata ---

const TASK_CATEGORY_META: Record<string, { label: string; color: string }> = {
  "information-processing": { label: "Information Processing", color: "#3B82F6" },
  "communication": { label: "Communication", color: "#8B5CF6" },
  "analysis-decision": { label: "Analysis & Decision", color: "#F59E0B" },
  "creative-generative": { label: "Creative / Generative", color: "#EC4899" },
  "coordination-management": { label: "Coordination & Mgmt", color: "#06B6D4" },
  "physical-manual": { label: "Physical / Manual", color: "#10B981" },
  "interpersonal": { label: "Interpersonal", color: "#F97316" },
  "technical-specialized": { label: "Technical / Specialized", color: "#6366F1" },
};

// --- Main page component ---

interface Props {
  data: OccupationPageData | null;
}

export default function OccupationSlugPage({ data }: Props) {
  if (!data) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Occupation not found</h1>
        <Link
          href="/occupation-exposure"
          className="text-[var(--accent-text)] hover:underline"
        >
          Back to all occupations
        </Link>
      </div>
    );
  }

  const { scores, dimensionality, enriched } = data;
  const rc = riskColor(scores.netRisk);
  const rl = riskLabel(scores.netRisk);

  // Sort task composition descending
  const sortedTasks = Object.entries(enriched.taskComposition)
    .sort(([, a], [, b]) => b - a);
  const maxTaskShare = sortedTasks[0]?.[1] ?? 1;

  // Top O*NET work activities
  const topActivities = [...enriched.tasks]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-1.5 text-[11px] text-white/40">
          <li>
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/occupation-exposure" className="hover:text-white/60 transition-colors">
              Beyond Exposure
            </Link>
          </li>
          <li>/</li>
          <li className="text-white/60">{enriched.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
          {enriched.onetCode}
        </p>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-white leading-tight mb-3">
          {enriched.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {enriched.jobs && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.06] text-[12px] text-white/60">
              {enriched.jobs.toLocaleString()} workers
            </span>
          )}
          {enriched.pay && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.06] text-[12px] text-white/60">
              ${enriched.pay.toLocaleString()}/yr median
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.06] text-[12px] text-white/60">
            {enriched.education}
          </span>
        </div>

        {/* Net risk callout */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: rc + "12" }}
        >
          <span
            className="text-[36px] sm:text-[44px] font-black leading-none"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: rc,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scores.netRisk.toFixed(1)}
          </span>
          <div>
            <p className="text-[15px] font-semibold" style={{ color: rc }}>
              {rl}
            </p>
            <p className="text-[12px] text-white/40">
              Composite of 5 dimensions (higher = more displacement pressure)
            </p>
          </div>
        </div>
      </header>

      {/* AI Exposure Rationale */}
      <section className="mb-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-3">
          AI Exposure Analysis
        </h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              GPT-scored exposure
            </span>
            <span
              className="text-[16px] font-bold"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: scoreColor(enriched.exposure, true),
              }}
            >
              {enriched.exposure}/10
            </span>
          </div>
          <p className="text-[13px] text-white/60 leading-relaxed">
            {enriched.exposure_rationale}
          </p>
        </div>
      </section>

      {/* 5-Variable Scores */}
      <section className="mb-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-4">
          Dimension Breakdown
        </h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
          {BAR_DIMENSIONS.map((dim) => (
            <div key={dim}>
              <ScoreBar dimension={dim} value={scores[dim]} />
              {dim === "complementarity" && (
                <DimensionalityDetail dim={dimensionality} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Task Composition */}
      <section className="mb-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-1">
          Task Composition
        </h2>
        <p className="text-[12px] text-white/30 mb-4">
          How this occupation&apos;s work time is distributed across 8 task categories, based on O*NET work activity data.
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
          {sortedTasks.map(([key, share]) => {
            const meta = TASK_CATEGORY_META[key];
            if (!meta) return null;
            const pct = share * 100;
            const barWidth = (share / maxTaskShare) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-white/70">
                    {meta.label}
                  </span>
                  <span
                    className="text-[12px] font-bold"
                    style={{ fontFamily: "'DM Mono', monospace", color: meta.color }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barWidth}%`, background: meta.color + "B0" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Work Activities */}
      {topActivities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-1">
            Top Work Activities
          </h2>
          <p className="text-[12px] text-white/30 mb-4">
            Most important work activities from O*NET, ranked by importance score (1-5).
          </p>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white/40 px-4 py-2.5">
                    Activity
                  </th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider text-white/40 px-4 py-2.5 w-24">
                    Category
                  </th>
                  <th className="text-right text-[11px] font-bold uppercase tracking-wider text-white/40 px-4 py-2.5 w-20">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {topActivities.map((task, i) => {
                  const catMeta = TASK_CATEGORY_META[task.category];
                  return (
                    <tr
                      key={task.name}
                      className={i < topActivities.length - 1 ? "border-b border-white/[0.04]" : ""}
                    >
                      <td className="text-[12px] text-white/60 px-4 py-2.5">
                        {task.name}
                      </td>
                      <td className="px-4 py-2.5">
                        {catMeta && (
                          <span
                            className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              background: catMeta.color + "18",
                              color: catMeta.color,
                            }}
                          >
                            {catMeta.label}
                          </span>
                        )}
                      </td>
                      <td
                        className="text-right text-[13px] font-bold px-4 py-2.5"
                        style={{ fontFamily: "'DM Mono', monospace", color: "white" }}
                      >
                        {task.importance.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Methodology note */}
      <section className="mb-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-3">
          Methodology
        </h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-[12px] text-white/50 leading-relaxed space-y-3">
          <p>
            This page combines Karpathy&apos;s GPT-scored technical exposure (per-occupation)
            with four additional dimensions inherited from the parent SOC major group:
            institutional adoption speed, worker adaptability, demand elasticity, and AI complementarity.
          </p>
          <p>
            Task composition is derived from O*NET work activity data,
            mapped to 8 internal categories. The complementarity score is adjusted by job dimensionality
            (Gans &amp; Goldfarb 2024): occupations with more distinct task clusters tend toward
            augmentation rather than replacement.
          </p>
          <p>
            Net displacement risk is computed as a weighted composite: exposure ({(WEIGHTS.technicalExposure * 100).toFixed(0)}%),
            adoption speed ({(WEIGHTS.adoptionSpeed * 100).toFixed(0)}%),
            adaptability ({(WEIGHTS.adaptability * 100).toFixed(0)}%),
            demand elasticity ({(WEIGHTS.demandElasticity * 100).toFixed(0)}%),
            complementarity ({(WEIGHTS.complementarity * 100).toFixed(0)}%).
            Pressure dimensions are normalized independently from absorption dimensions,
            so defensive factors can fully counterbalance exposure.
          </p>
        </div>
      </section>

      {/* Footer nav */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
        <Link
          href="/occupation-exposure"
          className="text-[13px] font-medium text-[var(--accent-text)] hover:underline"
        >
          View all 342 occupations
        </Link>
        {enriched.blsUrl && (
          <a
            href={enriched.blsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-white/40 hover:text-white/60 transition-colors"
          >
            BLS profile
          </a>
        )}
      </div>
    </div>
  );
}
