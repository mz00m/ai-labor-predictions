"use client";

import { useMemo } from "react";
import { JobTask, calculateCrossoverYear, calculateAdoptionYear, DEPLOYMENT_OVERHEAD } from "@/data/job-tasks";

/** Risk color based on crossover year */
function getRiskColor(crossoverYear: number | null): string {
  if (!crossoverYear || crossoverYear <= 2028) return "#EF4444";
  if (crossoverYear <= 2031) return "#6366F1";
  return "#10B981";
}

interface AutomationTimelineProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
  industrySpeedMultiplier?: number;
}

export default function AutomationTimeline({
  tasks,
  adjustedShares,
  humanWagePerHr,
  industrySpeedMultiplier = 1.0,
}: AutomationTimelineProps) {
  const timelineData = useMemo(() => {
    return tasks
      .map((task) => {
        const share = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: share },
          humanWagePerHr
        );
        const adoption = calculateAdoptionYear(
          { ...task, timeShare: share },
          humanWagePerHr,
          2026,
          industrySpeedMultiplier
        );
        return { task, share, crossover, adoption };
      })
      .sort((a, b) => {
        const ya = a.crossover ?? 2050;
        const yb = b.crossover ?? 2050;
        return ya - yb;
      });
  }, [tasks, adjustedShares, humanWagePerHr, industrySpeedMultiplier]);

  const minYear = 2026;
  const maxYear = 2040;
  const range = maxYear - minYear;

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 text-2xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-[#6366F1] rounded-full" />
          <span>Cost parity (AI cheaper than labor)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full" style={{ background: "repeating-linear-gradient(90deg, #6366F1 0, #6366F1 2px, transparent 2px, transparent 5px)" }} />
          <span>Probable adoption (+ institutional drag)</span>
        </div>
      </div>

      {/* Year axis */}
      <div className="relative mb-2 h-6">
        {[2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040].map((yr) => (
          <span
            key={yr}
            className="absolute text-2xs text-[var(--muted)] -translate-x-1/2"
            style={{ left: `${((yr - minYear) / range) * 100}%` }}
          >
            {yr}
          </span>
        ))}
      </div>

      {/* Timeline bars */}
      <div className="space-y-2 relative">
        {/* Vertical gridlines */}
        <div className="absolute inset-0 pointer-events-none">
          {[2028, 2030, 2032, 2034, 2036, 2038].map((yr) => (
            <div
              key={yr}
              className="absolute top-0 bottom-0 border-l border-dashed border-black/[0.06]"
              style={{ left: `${((yr - minYear) / range) * 100}%` }}
            />
          ))}
        </div>

        {timelineData.map(({ task, share, crossover, adoption }, idx) => {
          const color = getRiskColor(crossover);
          const crossoverYear = crossover ?? maxYear;
          const adoptionYear = adoption ?? maxYear;
          const crossoverPct = Math.min(((crossoverYear - minYear) / range) * 100, 100);
          const adoptionPct = Math.min(((adoptionYear - minYear) / range) * 100, 100);
          const isNow = crossover !== null && crossover <= 2026;
          const isBeyond = crossover === null;

          return (
            <div key={task.id} className="timeline-bar flex items-center gap-3 group relative" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="w-[140px] shrink-0 text-right">
                <span className="text-xs font-medium text-[var(--foreground)] truncate block">
                  {task.name}
                </span>
                <span className="text-2xs text-[var(--muted)]">
                  {Math.round(share * 100)}% of time
                </span>
              </div>
              <div className="flex-1 relative h-6">
                {/* Solid bar: now → cost parity */}
                <div
                  className="absolute top-1 h-4 rounded-l-full"
                  style={{
                    left: 0,
                    width: `${crossoverPct}%`,
                    backgroundColor: color,
                    opacity: isNow ? 0.4 : 0.7,
                    borderTopRightRadius: isBeyond ? "9999px" : 0,
                    borderBottomRightRadius: isBeyond ? "9999px" : 0,
                  }}
                />
                {/* Striped bar: cost parity → probable adoption (institutional drag zone) */}
                {!isBeyond && adoptionPct > crossoverPct && (
                  <div
                    className="march-stripe absolute top-1 h-4"
                    style={{
                      left: `${crossoverPct}%`,
                      width: `${Math.min(adoptionPct - crossoverPct, 100 - crossoverPct)}%`,
                      background: `repeating-linear-gradient(90deg, ${color}40 0, ${color}40 3px, transparent 3px, transparent 6px)`,
                      backgroundSize: '12px 100%',
                      borderTopRightRadius: "9999px",
                      borderBottomRightRadius: "9999px",
                    }}
                  />
                )}
                {/* Cost parity marker (solid) */}
                {!isBeyond && (
                  <div
                    className="absolute top-0 w-0.5 h-6 rounded-full"
                    style={{
                      left: `${crossoverPct}%`,
                      backgroundColor: color,
                    }}
                  />
                )}
                {/* Adoption marker (dashed) */}
                {!isBeyond && adoption !== null && adoptionPct < 100 && (
                  <div
                    className="absolute top-0 w-0.5 h-6"
                    style={{
                      left: `${adoptionPct}%`,
                      background: `repeating-linear-gradient(180deg, ${color} 0, ${color} 2px, transparent 2px, transparent 5px)`,
                    }}
                  />
                )}
                {/* Labels */}
                <span
                  className="absolute top-0.5 text-2xs font-medium"
                  style={{
                    left: `${Math.min((isBeyond ? crossoverPct : adoptionPct) + 1, 80)}%`,
                    color: isBeyond ? "#6b7280" : color,
                  }}
                >
                  {isNow ? "Now" : isBeyond ? "10yr+" : (
                    adoption !== null && adoption !== crossover
                      ? `${crossoverYear} / ${Math.round(adoptionYear)}`
                      : `${crossoverYear}`
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--muted)] mt-4">
        Solid bar = time until AI production cost (API + {DEPLOYMENT_OVERHEAD}x deployment
        overhead) drops below human labor cost. Striped extension = estimated institutional
        adoption drag (process change, training, compliance). The gap between cost parity
        and probable adoption is 1.5-4.5 years depending on task type. Neither predicts
        actual adoption. They frame the economic and organizational constraints.
      </p>
    </div>
  );
}
