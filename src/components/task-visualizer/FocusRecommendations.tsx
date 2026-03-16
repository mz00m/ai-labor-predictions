"use client";

import { useMemo } from "react";
import { JobTask, calculateAdoptionYear } from "@/data/job-tasks";

interface FocusRecommendationsProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
  industrySpeedMultiplier?: number;
  adaptiveCapacity?: number;
  highVulnerability?: boolean;
}

function getACInterpretation(ac: number): string {
  if (ac >= 0.65) {
    return "Workers in this occupation have strong adaptive capacity — above-median savings, transferable skills, and urban job access. If AI transforms this role, most workers are well-positioned to transition.";
  }
  if (ac >= 0.45) {
    return "Workers in this occupation have moderate adaptive capacity. Some workers will transition smoothly, but others may face barriers related to savings, skills, or location.";
  }
  return "Workers in this occupation face low adaptive capacity — below-median savings, fewer transferable skills, or geographic constraints. If AI displaces this role, many workers may struggle to find comparable employment.";
}

export default function FocusRecommendations({
  tasks,
  adjustedShares,
  humanWagePerHr,
  industrySpeedMultiplier = 1.0,
  adaptiveCapacity,
  highVulnerability,
}: FocusRecommendationsProps) {
  type AnalyzedTask = { task: JobTask; share: number; adoption: number | null; yearsLeft: number };
  const { atRisk, augment, invest } = useMemo<{ atRisk: AnalyzedTask[]; augment: AnalyzedTask[]; invest: AnalyzedTask[] }>(() => {
    const analyzed: AnalyzedTask[] = tasks.map((task) => {
      const share = adjustedShares[task.id] ?? task.timeShare;
      const adoption = calculateAdoptionYear(
        { ...task, timeShare: share },
        humanWagePerHr,
        2026,
        industrySpeedMultiplier
      );
      const yearsLeft = adoption ? adoption - 2026 : 20;
      return { task, share, adoption, yearsLeft };
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
  }, [tasks, adjustedShares, humanWagePerHr, industrySpeedMultiplier]);

  const automatedSharePercent = Math.round(
    atRisk.reduce((s: number, a: AnalyzedTask) => s + a.share, 0) * 100
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
            of your time is on tasks facing near-term economic pressure from AI
          </span>
        </div>
      </div>

      {/* At risk */}
      {atRisk.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-[#EF4444] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            AI is already cost-competitive
          </h4>
          <p className="text-[12px] text-[var(--muted)] mb-2">
            AI can already perform these tasks at or below human labor cost. Adoption still lags economics by years, but the cost incentive is there. Shift time away from these.
          </p>
          <div className="space-y-1.5">
            {atRisk.map(({ task, share }: AnalyzedTask) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
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
          <h4 className="text-[13px] font-semibold text-[#6366F1] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            Learn to work with AI
          </h4>
          <p className="text-[12px] text-[var(--muted)] mb-2">
            AI is getting capable at these tasks. Become the person who directs AI tools here. Your value multiplies.
          </p>
          <div className="space-y-1.5">
            {augment.map(({ task, share }: AnalyzedTask) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
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
            These tasks remain expensive and difficult for AI to replicate. Building unique expertise here is your best bet.
          </p>
          <div className="space-y-1.5">
            {invest.map(({ task, share }: AnalyzedTask) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-black/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
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

      {/* Adaptive Capacity context */}
      {adaptiveCapacity !== undefined && (
        <div className="mt-6 pt-4 border-t border-black/[0.06]">
          <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-2">
            Adaptability context
          </h4>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="text-[24px] font-bold tabular-nums"
              style={{
                color: adaptiveCapacity >= 0.65 ? "#10B981" : adaptiveCapacity >= 0.45 ? "#F59E0B" : "#EF4444",
              }}
            >
              {(adaptiveCapacity * 100).toFixed(0)}
            </div>
            <div className="text-[12px] text-[var(--muted)]">
              <div>Adaptive Capacity Score (0-100)</div>
              <div>Manning &amp; Aguirre, NBER 2026</div>
            </div>
          </div>
          {highVulnerability && (
            <div className="bg-[#EF4444]/[0.06] border border-[#EF4444]/20 rounded-lg px-3 py-2 mb-2">
              <p className="text-[11px] text-[#EF4444] font-medium">
                High vulnerability: this occupation combines high AI exposure with low adaptive capacity
              </p>
            </div>
          )}
          <p className="text-[12px] text-[var(--muted)] leading-relaxed">
            {getACInterpretation(adaptiveCapacity)}
          </p>
        </div>
      )}
    </div>
  );
}
