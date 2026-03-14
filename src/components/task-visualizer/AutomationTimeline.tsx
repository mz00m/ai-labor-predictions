"use client";

import { useMemo } from "react";
import { JobTask, calculateCrossoverYear, DEPLOYMENT_OVERHEAD } from "@/data/job-tasks";

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
}

export default function AutomationTimeline({
  tasks,
  adjustedShares,
  humanWagePerHr,
}: AutomationTimelineProps) {
  const timelineData = useMemo(() => {
    return tasks
      .map((task) => {
        const share = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: share },
          humanWagePerHr
        );
        return { task, share, crossover };
      })
      .sort((a, b) => {
        const ya = a.crossover ?? 2050;
        const yb = b.crossover ?? 2050;
        return ya - yb;
      });
  }, [tasks, adjustedShares, humanWagePerHr]);

  const minYear = 2026;
  const maxYear = 2040;
  const range = maxYear - minYear;

  return (
    <div>
      {/* Year axis */}
      <div className="relative mb-2 h-6">
        {[2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040].map((yr) => (
          <span
            key={yr}
            className="absolute text-[10px] text-[var(--muted)] -translate-x-1/2"
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

        {timelineData.map(({ task, share, crossover }) => {
          const color = getRiskColor(crossover);
          const year = crossover ?? maxYear;
          const leftPct = Math.min(((year - minYear) / range) * 100, 100);
          const isNow = crossover !== null && crossover <= 2026;
          const isBeyond = crossover === null;

          return (
            <div key={task.id} className="flex items-center gap-3 group relative">
              <div className="w-[140px] shrink-0 text-right">
                <span className="text-[11px] font-medium text-[var(--foreground)] truncate block">
                  {task.name}
                </span>
                <span className="text-[10px] text-[var(--muted)]">
                  {Math.round(share * 100)}% of time
                </span>
              </div>
              <div className="flex-1 relative h-6">
                {/* Bar from now to crossover */}
                <div
                  className="absolute top-1 h-4 rounded-full"
                  style={{
                    left: 0,
                    width: `${leftPct}%`,
                    backgroundColor: color,
                    opacity: isNow ? 0.4 : 0.7,
                  }}
                />
                {/* Crossover marker */}
                {!isBeyond && (
                  <div
                    className="absolute top-0 w-0.5 h-6 rounded-full"
                    style={{
                      left: `${leftPct}%`,
                      backgroundColor: color,
                    }}
                  />
                )}
                {/* Label */}
                <span
                  className="absolute top-0.5 text-[10px] font-medium"
                  style={{
                    left: `${Math.min(leftPct + 1, 85)}%`,
                    color: isBeyond ? "#6b7280" : color,
                  }}
                >
                  {isNow ? "Now" : isBeyond ? "10yr+" : `${year}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-4">
        Bar length shows time until total production cost (API + {DEPLOYMENT_OVERHEAD}x deployment
        overhead) drops below human labor cost for each task. Shorter bars = sooner economic
        incentive to automate. Does not predict actual adoption — just when the economics tip.
      </p>
    </div>
  );
}
