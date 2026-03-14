"use client";

import { useMemo } from "react";
import { JobTask, TASK_CATEGORY_META, calculateCrossoverYear } from "@/data/job-tasks";

interface FocusRecommendationsProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
}

export default function FocusRecommendations({
  tasks,
  adjustedShares,
  humanWagePerHr,
}: FocusRecommendationsProps) {
  const { atRisk, augment, invest } = useMemo(() => {
    const analyzed = tasks.map((task) => {
      const share = adjustedShares[task.id] ?? task.timeShare;
      const crossover = calculateCrossoverYear(
        { ...task, timeShare: share },
        humanWagePerHr
      );
      const yearsLeft = crossover ? crossover - 2026 : 20;
      return { task, share, crossover, yearsLeft };
    });

    // At risk: crossover within 3 years and >5% of time
    const atRisk = analyzed
      .filter((a) => a.yearsLeft <= 3 && a.share >= 0.05)
      .sort((a, b) => a.yearsLeft - b.yearsLeft);

    // Augment with AI: medium-term crossover (3-7 years), good AI capability
    const augment = analyzed
      .filter(
        (a) =>
          a.yearsLeft > 3 &&
          a.yearsLeft <= 7 &&
          a.task.aiCapability >= 0.4 &&
          a.share >= 0.05
      )
      .sort((a, b) => b.task.aiCapability - a.task.aiCapability);

    // Invest in: long-term safe, interpersonal/creative, meaningful share
    const invest = analyzed
      .filter((a) => a.yearsLeft > 5 && a.share >= 0.05)
      .sort((a, b) => b.yearsLeft - a.yearsLeft);

    return { atRisk, augment, invest };
  }, [tasks, adjustedShares, humanWagePerHr]);

  const automatedSharePercent = Math.round(
    atRisk.reduce((s, a) => s + a.share, 0) * 100
  );

  return (
    <div className="space-y-5">
      {/* Summary stat */}
      <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-[#EF4444] tracking-tight">
            {automatedSharePercent}%
          </span>
          <span className="text-[13px] text-[var(--muted)]">
            of your time is on tasks facing near-term automation pressure
          </span>
        </div>
      </div>

      {/* At risk */}
      {atRisk.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-[#EF4444] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Likely automated soon
          </h4>
          <p className="text-[12px] text-[var(--muted)] mb-2">
            These tasks are already cheaper (or nearly) to automate than to pay a human. Shift time away from these.
          </p>
          <div className="space-y-1.5">
            {atRisk.map(({ task, share }) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TASK_CATEGORY_META[task.category].color }}
                  />
                  <span className="text-[12px] font-medium">{task.name}</span>
                </div>
                <span className="text-[11px] text-[var(--muted)]">
                  {Math.round(share * 100)}% of your time
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Augment */}
      {augment.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-[#F59E0B] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Learn to work with AI
          </h4>
          <p className="text-[12px] text-[var(--muted)] mb-2">
            AI is getting capable at these tasks. Become the person who directs AI tools here — your value multiplies.
          </p>
          <div className="space-y-1.5">
            {augment.map(({ task, share }) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TASK_CATEGORY_META[task.category].color }}
                  />
                  <span className="text-[12px] font-medium">{task.name}</span>
                </div>
                <span className="text-[11px] text-[var(--muted)]">
                  AI: {Math.round(task.aiCapability * 100)}% capable
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invest */}
      {invest.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-[#10B981] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Double down here
          </h4>
          <p className="text-[12px] text-[var(--muted)] mb-2">
            These tasks remain expensive and difficult to automate. Building unique expertise here is your best bet.
          </p>
          <div className="space-y-1.5">
            {invest.map(({ task, share }) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TASK_CATEGORY_META[task.category].color }}
                  />
                  <span className="text-[12px] font-medium">{task.name}</span>
                </div>
                <span className="text-[11px] text-[var(--muted)]">
                  Compute: ${task.currentComputeCostPerHr}/hr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
