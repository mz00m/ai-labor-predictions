"use client";

import type { RegionalAggregate } from "@/lib/composite-model";

/**
 * Compact dot-plot showing all sectors' jobs delta as dots on a horizontal axis.
 * Surfaces the full distribution (not just the top-6 winners and losers) so the
 * reader sees how much variation sits outside the headline ranking.
 */
export default function SectorDistributionStrip({
  aggregate,
  height = 60,
  caption,
}: {
  aggregate: RegionalAggregate;
  height?: number;
  caption?: string;
}) {
  const sectors = aggregate.bySector;
  if (sectors.length === 0) return null;

  const maxAbs = Math.max(
    ...sectors.map((s) => Math.abs(s.regionalJobsImpacted)),
    1
  );
  // Scale: 0 sits at center; ±maxAbs at edges
  const positionPct = (jobs: number) => 50 + (jobs / maxAbs) * 48;
  // Dot radius proportional to sector employment (log-scaled)
  const minR = 3;
  const maxR = 9;
  const sortedByEmp = [...sectors].sort(
    (a, b) => b.regionalEmploymentK - a.regionalEmploymentK
  );
  const empMax = sortedByEmp[0].regionalEmploymentK;
  const empMin = sortedByEmp[sortedByEmp.length - 1].regionalEmploymentK || 0.01;
  const radius = (emp: number) => {
    const ratio = Math.log(Math.max(emp, empMin)) - Math.log(empMin);
    const max = Math.log(empMax) - Math.log(empMin) || 1;
    return minR + (ratio / max) * (maxR - minR);
  };

  const positiveCount = sectors.filter((s) => s.regionalJobsImpacted > 100).length;
  const negativeCount = sectors.filter((s) => s.regionalJobsImpacted < -100).length;
  const neutralCount = sectors.length - positiveCount - negativeCount;

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-semibold">
          Full sector distribution ({sectors.length} sectors)
        </p>
        <p className="text-[11px] text-[var(--muted)] tabular-nums">
          {positiveCount} growing · {neutralCount} flat · {negativeCount} declining
        </p>
      </div>
      <div
        className="relative bg-[var(--background)] rounded-lg border border-divider"
        style={{ height }}
      >
        {/* Center reference line */}
        <div
          className="absolute top-2 bottom-2 w-px bg-[var(--muted)] opacity-40"
          style={{ left: "50%" }}
          aria-label="Zero (no-policy baseline)"
        />
        {/* Sector dots */}
        {sectors.map((s, i) => {
          const left = positionPct(s.regionalJobsImpacted);
          const r = radius(s.regionalEmploymentK);
          const isPositive = s.regionalJobsImpacted >= 0;
          const color = isPositive ? "#3a8a4f" : "#d4493a";
          // Stagger vertically to reduce overlap
          const vOffset = (i % 3) * 12 - 12;
          return (
            <div
              key={s.naics}
              className="absolute rounded-full cursor-default"
              style={{
                left: `${left}%`,
                top: `50%`,
                width: r * 2,
                height: r * 2,
                marginLeft: -r,
                marginTop: -r + vOffset,
                background: color,
                opacity: 0.7,
              }}
              title={`${s.name}: ${formatJobs(s.regionalJobsImpacted, true)} jobs · baseline ${s.regionalEmploymentK.toFixed(0)}K`}
            />
          );
        })}
        {/* Axis labels */}
        <div className="absolute bottom-1 left-2 text-[9px] text-[var(--muted)]">
          ← declining
        </div>
        <div
          className="absolute bottom-1 text-[9px] text-[var(--muted)]"
          style={{ left: "calc(50% + 4px)" }}
        >
          0
        </div>
        <div className="absolute bottom-1 right-2 text-[9px] text-[var(--muted)]">
          growing →
        </div>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-1.5 italic leading-[1.5]">
        {caption ??
          "Each dot is one sector; size = regional employment. Position = jobs Δ relative to the largest-magnitude sector in this scenario."}
      </p>
    </div>
  );
}

function formatJobs(n: number, signed = false): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  let core: string;
  if (abs >= 1_000_000) core = `${(abs / 1_000_000).toFixed(2)}M`;
  else if (abs >= 1_000) core = `${(abs / 1_000).toFixed(1)}K`;
  else core = `${Math.round(abs)}`;
  return signed ? `${sign}${core}` : core;
}
