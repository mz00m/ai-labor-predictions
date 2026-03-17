"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  TASK_CATEGORY_META,
  SOC_TO_JOB_IDS,
  EXPOSURE_UNCERTAINTY,
  SOC_EXPOSURE_SCORES,
  getAutomationPercentAtYear,
  type IncomeTier,
  type TaskCategory,
} from "@/data/economy-occupations";

function getUncertaintyLabel(variance: number): { label: string; color: string } {
  if (variance >= 0.5) return { label: "High", color: "#EF4444" };
  if (variance >= 0.3) return { label: "Med", color: "#F59E0B" };
  return { label: "Low", color: "#10B981" };
}

interface TierDetail {
  tier: IncomeTier;
  groups: {
    id: string;
    title: string;
    shortTitle: string;
    employment: number;
    medianWageAnnual: number;
    pct2028: number;
    pct2032: number;
    pct2036: number;
    topVulnerable: string;
    topDurable: string;
    uncertaintyVariance: number;
    exposureScore: number;
  }[];
  totalEmployment: number;
  avgAutomation2030: number;
  avgTaskMix: Record<TaskCategory, number>;
}

export default function IncomeStrataImpact() {
  const router = useRouter();
  const tierDetails: TierDetail[] = useMemo(() => {
    return (["low", "middle", "high"] as const).map((tier) => {
      const groups = OCCUPATION_GROUPS.filter((g) => g.incomeTier === tier).map((g) => {
        // Find most vulnerable and most durable task categories
        const cats = Object.entries(g.taskComposition) as [TaskCategory, number][];
        const sorted = cats.filter(([, s]) => s >= 0.05).sort((a, b) => b[1] - a[1]);

        // Vulnerable: high share + high decline rate
        const vulnerable = sorted
          .filter(([cat]) => !["physical-manual", "interpersonal"].includes(cat))
          .map(([cat]) => TASK_CATEGORY_META[cat].label)[0] || "N/A";

        // Durable: physical or interpersonal with high share
        const durable = sorted
          .filter(([cat]) => ["physical-manual", "interpersonal", "coordination-management"].includes(cat))
          .map(([cat]) => TASK_CATEGORY_META[cat].label)[0] || "N/A";

        return {
          id: g.id,
          title: g.title,
          shortTitle: g.shortTitle,
          employment: g.employment,
          medianWageAnnual: g.medianWageAnnual,
          pct2028: getAutomationPercentAtYear(g, 2028),
          pct2032: getAutomationPercentAtYear(g, 2032),
          pct2036: getAutomationPercentAtYear(g, 2036),
          topVulnerable: vulnerable,
          topDurable: durable,
          uncertaintyVariance: EXPOSURE_UNCERTAINTY[g.id]?.variance ?? 0,
          exposureScore: SOC_EXPOSURE_SCORES[g.id]?.mean ?? 0,
        };
      });

      const totalEmployment = groups.reduce((s, g) => s + g.employment, 0);

      // Weighted average automation at 2030
      const avgAuto = groups.reduce((s, g) => {
        const pct = getAutomationPercentAtYear(
          OCCUPATION_GROUPS.find((o) => o.shortTitle === g.shortTitle)!,
          2030
        );
        return s + pct * g.employment;
      }, 0) / totalEmployment;

      // Aggregate task mix
      const avgTaskMix: Record<TaskCategory, number> = {
        "information-processing": 0, "communication": 0, "analysis-decision": 0,
        "creative-generative": 0, "coordination-management": 0, "physical-manual": 0,
        "interpersonal": 0, "technical-specialized": 0,
      };
      for (const g of OCCUPATION_GROUPS.filter((o) => o.incomeTier === tier)) {
        for (const [cat, share] of Object.entries(g.taskComposition) as [TaskCategory, number][]) {
          avgTaskMix[cat] += share * g.employment;
        }
      }
      for (const cat of Object.keys(avgTaskMix) as TaskCategory[]) {
        avgTaskMix[cat] = Math.round((avgTaskMix[cat] / totalEmployment) * 100) / 100;
      }

      return {
        tier,
        groups: groups.sort((a, b) => b.employment - a.employment),
        totalEmployment,
        avgAutomation2030: Math.round(avgAuto),
        avgTaskMix,
      };
    });
  }, []);

  return (
    <div className="space-y-8">
      {tierDetails.map((detail) => {
        const meta = INCOME_TIER_META[detail.tier];
        return (
          <div key={detail.tier} className="stagger-enter rounded-xl border border-black/[0.06] overflow-hidden" style={{ animationDelay: `${["low","middle","high"].indexOf(detail.tier) * 0.12}s` }}>
            {/* Tier header */}
            <div
              className="tier-header-enter px-5 py-4 border-b border-black/[0.06]"
              style={{ backgroundColor: `${meta.color}08` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[15px] font-bold" style={{ color: meta.color }}>
                    {meta.label}
                  </h4>
                  <p className="text-[12px] text-[var(--muted)]">
                    {meta.range} — {(detail.totalEmployment / 1000).toFixed(1)}M workers —{" "}
                    {detail.groups.length} occupation groups
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[28px] font-bold tracking-tight" style={{ color: meta.color }}>
                    {detail.avgAutomation2030}%
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">avg task automation by 2030</p>
                </div>
              </div>

              {/* Task composition bar */}
              <div className="mt-3">
                <div className="flex h-3 rounded-full overflow-hidden">
                  {(Object.entries(detail.avgTaskMix) as [TaskCategory, number][])
                    .filter(([, v]) => v >= 0.02)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, share], segIdx) => (
                      <div
                        key={cat}
                        className="composition-segment h-full"
                        style={{
                          animationDelay: `${segIdx * 0.06}s`,
                          width: `${share * 100}%`,
                          backgroundColor: TASK_CATEGORY_META[cat].color,
                          opacity: 0.7,
                        }}
                        title={`${TASK_CATEGORY_META[cat].label}: ${Math.round(share * 100)}%`}
                      />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {(Object.entries(detail.avgTaskMix) as [TaskCategory, number][])
                    .filter(([, v]) => v >= 0.05)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, share]) => (
                      <span key={cat} className="text-[10px] text-[var(--muted)]">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-0.5"
                          style={{ backgroundColor: TASK_CATEGORY_META[cat].color }}
                        />
                        {TASK_CATEGORY_META[cat].label} {Math.round(share * 100)}%
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Occupation table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 px-4 text-[var(--foreground)] font-semibold">Occupation</th>
                    <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Workers</th>
                    <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Wage</th>
                    <th className="text-center py-2 px-3 text-[var(--foreground)] font-semibold" title="AI exposure score from Yale Budget Lab repo (0-10 scale, 342 BLS occupations)">Exposure</th>
                    <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">2028</th>
                    <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">2032</th>
                    <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">2036</th>
                    <th className="text-left py-2 px-3 text-[var(--foreground)] font-semibold">Most exposed</th>
                    <th className="text-left py-2 px-3 text-[var(--foreground)] font-semibold">Most durable</th>
                    <th className="text-center py-2 px-4 text-[var(--foreground)] font-semibold" title="How much 6 AI exposure metrics agree on this group's exposure level (Yale Budget Lab, 2026)">Certainty</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--muted)]">
                  {detail.groups.map((g) => {
                    const jobIds = SOC_TO_JOB_IDS[g.id] || [];
                    const clickable = jobIds.length > 0;
                    return (
                    <tr
                      key={g.shortTitle}
                      className={`border-b border-black/[0.03] ${clickable ? "nav-row cursor-pointer" : "hover:bg-black/[0.02]"}`}
                      onClick={clickable ? () => router.push(`/task-visualizer?job=${jobIds[0]}`) : undefined}
                    >
                      <td className="py-2 px-4 font-medium">
                        {clickable ? (
                          <span className="text-[var(--foreground)] hover:text-[var(--accent)]">{g.shortTitle}</span>
                        ) : (
                          <span className="text-[var(--foreground)]">{g.shortTitle}</span>
                        )}
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">{(g.employment / 1000).toFixed(1)}M</td>
                      <td className="text-right py-2 px-3 tabular-nums">${(g.medianWageAnnual / 1000).toFixed(0)}K</td>
                      <td className="text-center py-2 px-3 tabular-nums">
                        {g.exposureScore > 0 && (
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              color: g.exposureScore >= 7 ? "#EF4444" : g.exposureScore >= 5 ? "#F59E0B" : "#10B981",
                              backgroundColor: g.exposureScore >= 7 ? "#EF444415" : g.exposureScore >= 5 ? "#F59E0B15" : "#10B98115",
                            }}
                          >
                            {g.exposureScore.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">
                        <span style={{ color: g.pct2028 >= 60 ? "#EF4444" : g.pct2028 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2028}%
                        </span>
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">
                        <span style={{ color: g.pct2032 >= 60 ? "#EF4444" : g.pct2032 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2032}%
                        </span>
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">
                        <span style={{ color: g.pct2036 >= 60 ? "#EF4444" : g.pct2036 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2036}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px]">{g.topVulnerable}</td>
                      <td className="py-2 px-3 text-[11px]">{g.topDurable}</td>
                      <td className="text-center py-2 px-4 text-[11px]">
                        {g.uncertaintyVariance > 0 && (() => {
                          const u = getUncertaintyLabel(g.uncertaintyVariance);
                          return (
                            <span
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ color: u.color, backgroundColor: `${u.color}15` }}
                              title={`Metric variance: ${g.uncertaintyVariance.toFixed(3)}`}
                            >
                              {u.label}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
