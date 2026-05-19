"use client";

import { useState } from "react";
import type { RegionalAggregate } from "@/lib/composite-model";

/**
 * Dot-plot showing every sector's jobs delta as dots on a horizontal axis.
 * Hover for a popover with the sector name + numbers; click pins the popover.
 * Surfaces the full distribution (not just top-6 winners and losers).
 */
export default function SectorDistributionStrip({
  aggregate,
  height = 140,
  caption,
}: {
  aggregate: RegionalAggregate;
  height?: number;
  caption?: string;
}) {
  const sectors = aggregate.bySector;
  const [hoveredNaics, setHoveredNaics] = useState<string | null>(null);
  const [pinnedNaics, setPinnedNaics] = useState<string | null>(null);

  if (sectors.length === 0) return null;

  const maxAbs = Math.max(
    ...sectors.map((s) => Math.abs(s.regionalJobsImpacted)),
    1
  );
  const positionPct = (jobs: number) => 50 + (jobs / maxAbs) * 46;
  const minR = 7;
  const maxR = 16;
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

  // Stable stagger: sort by absolute distance from 0, then assign stagger rows
  // so dots clustered near zero don't overlap as much.
  const indexed = sectors
    .map((s, i) => ({ s, i }))
    .sort((a, b) => Math.abs(b.s.regionalJobsImpacted) - Math.abs(a.s.regionalJobsImpacted));
  const staggerById = new Map<string, number>();
  indexed.forEach(({ s }, rank) => {
    // 5 stagger rows: -2, -1, 0, +1, +2
    staggerById.set(s.naics, (rank % 5) - 2);
  });

  const positiveCount = sectors.filter((s) => s.regionalJobsImpacted > 100).length;
  const negativeCount = sectors.filter((s) => s.regionalJobsImpacted < -100).length;
  const neutralCount = sectors.length - positiveCount - negativeCount;

  const visibleNaics = pinnedNaics ?? hoveredNaics;
  const visibleSector = visibleNaics
    ? sectors.find((s) => s.naics === visibleNaics)
    : null;
  const visiblePosPct = visibleSector ? positionPct(visibleSector.regionalJobsImpacted) : 50;

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
        onMouseLeave={() => setHoveredNaics(null)}
      >
        {/* Center reference line */}
        <div
          className="absolute top-3 bottom-7 w-px bg-[var(--muted)] opacity-40"
          style={{ left: "50%" }}
          aria-label="Zero (no-policy baseline)"
        />
        {/* Sector dots */}
        {sectors.map((s) => {
          const left = positionPct(s.regionalJobsImpacted);
          const r = radius(s.regionalEmploymentK);
          const isPositive = s.regionalJobsImpacted >= 0;
          const color = isPositive ? "#3a8a4f" : "#d4493a";
          const stagger = staggerById.get(s.naics) ?? 0;
          const vOffset = stagger * (r * 0.9 + 6);
          const isActive = s.naics === visibleNaics;
          return (
            <button
              type="button"
              key={s.naics}
              onMouseEnter={() => setHoveredNaics(s.naics)}
              onClick={() =>
                setPinnedNaics(pinnedNaics === s.naics ? null : s.naics)
              }
              className="absolute rounded-full cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:scale-125"
              style={{
                left: `${left}%`,
                top: "calc(50% - 6px)",
                width: r * 2,
                height: r * 2,
                marginLeft: -r,
                marginTop: -r + vOffset,
                background: color,
                opacity: isActive ? 1.0 : 0.75,
                boxShadow: isActive
                  ? `0 0 0 3px ${color}33`
                  : "none",
                zIndex: isActive ? 5 : 1,
              }}
              aria-label={`${s.name}: ${formatJobs(s.regionalJobsImpacted, true)} jobs`}
            />
          );
        })}

        {/* Hover/pinned tooltip */}
        {visibleSector && (
          <div
            className="absolute pointer-events-none rounded-lg shadow-xl border px-3 py-2 min-w-[200px] max-w-[280px]"
            style={{
              left: `${Math.min(Math.max(visiblePosPct, 14), 86)}%`,
              transform: "translateX(-50%)",
              top: "6px",
              background: "var(--background)",
              borderColor: "rgba(0,0,0,0.12)",
              zIndex: 10,
            }}
            role="tooltip"
          >
            <p className="text-xs font-semibold text-[var(--foreground)] leading-tight">
              {visibleSector.name}
            </p>
            <p className="text-[10px] text-[var(--muted)] tabular-nums mt-0.5">
              NAICS {visibleSector.naics} · {visibleSector.regionalEmploymentK.toFixed(0)}K regional jobs
            </p>
            <div className="mt-1.5 pt-1.5 border-t border-divider flex items-baseline justify-between gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Jobs Δ
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{
                  color:
                    visibleSector.regionalJobsImpacted >= 0
                      ? "#3a8a4f"
                      : "#d4493a",
                }}
              >
                {formatJobs(visibleSector.regionalJobsImpacted, true)} (
                {visibleSector.employmentDeltaPct >= 0 ? "+" : ""}
                {visibleSector.employmentDeltaPct.toFixed(2)}%)
              </span>
            </div>
            {pinnedNaics === visibleSector.naics && (
              <p className="text-[9px] text-[var(--muted)] italic mt-1">
                Pinned — click again to unpin
              </p>
            )}
          </div>
        )}

        {/* Axis labels */}
        <div className="absolute bottom-1 left-2 text-[10px] text-[var(--muted)]">
          ← declining
        </div>
        <div
          className="absolute bottom-1 text-[10px] text-[var(--muted)] font-medium"
          style={{ left: "calc(50% + 4px)" }}
        >
          0 (baseline)
        </div>
        <div className="absolute bottom-1 right-2 text-[10px] text-[var(--muted)]">
          growing →
        </div>
      </div>
      <p className="text-[11px] text-[var(--muted)] mt-1.5 italic leading-[1.5]">
        {caption ??
          "Each dot is one sector; size = regional employment. Hover any dot for the sector + numbers; click to pin."}
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
