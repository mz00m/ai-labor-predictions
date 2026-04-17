"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  TASK_CATEGORY_META,
  SOC_TO_JOB_IDS,
  getAutomationPercentAtYear,
  DEMAND_ELASTICITY,
  DEMAND_ELASTICITY_META,
  type IncomeTier,
  type TaskCategory,
} from "@/data/economy-occupations";

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
    demandElasticity: string | null;
  }[];
  totalEmployment: number;
  avgAutomation2030: number;
  avgTaskMix: Record<TaskCategory, number>;
}

function YearHeader({ year }: { year: number }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="py-2 px-3 text-right relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="cursor-help border-b border-dashed border-current">
        {year}
      </span>
      {show && (
        <div className="absolute z-20 right-0 top-full mt-1 w-52 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs leading-snug shadow-xl pointer-events-none text-left">
          <span className="font-semibold">{year} projection</span>
          <br />
          % of occupation tasks where AI compute cost is cheaper than human labor
        </div>
      )}
    </div>
  );
}

export default function IncomeStrataImpact() {
  const router = useRouter();
  const tierDetails: TierDetail[] = useMemo(() => {
    return (["high", "middle", "low"] as const).map((tier) => {
      const groups = OCCUPATION_GROUPS.filter((g) => g.incomeTier === tier).map((g) => {
        return {
          id: g.id,
          title: g.title,
          shortTitle: g.shortTitle,
          employment: g.employment,
          medianWageAnnual: g.medianWageAnnual,
          pct2028: getAutomationPercentAtYear(g, 2028),
          pct2032: getAutomationPercentAtYear(g, 2032),
          pct2036: getAutomationPercentAtYear(g, 2036),
          demandElasticity: DEMAND_ELASTICITY[g.id]?.elasticity ?? null,
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
          <div key={detail.tier} className="stagger-enter rounded-xl border border-card overflow-hidden" style={{ animationDelay: `${["high","middle","low"].indexOf(detail.tier) * 0.12}s` }}>
            {/* Tier header */}
            <div
              className="tier-header-enter p-4 sm:p-5 border-b border-card"
              style={{ backgroundColor: `${meta.color}08` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold" style={{ color: meta.color }}>
                    {meta.label}
                  </h4>
                  <p className="text-sm text-[var(--muted)]">
                    {meta.range}. {(detail.totalEmployment / 1000).toFixed(1)}M workers,{" "}
                    {detail.groups.length} occupation groups
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold tracking-tight" style={{ color: meta.color }}>
                    {detail.avgAutomation2030}%
                  </p>
                  <p className="text-2xs text-[var(--muted)]">avg task automation by 2030</p>
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
                      <span key={cat} className="text-2xs text-[var(--muted)]">
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

            {/* Occupation table - uses CSS grid instead of <table> to avoid
                column misalignment caused by nav-row ::before pseudo-element on <tr> */}
            <div className="text-sm">
              {/* Header */}
              <div
                className="grid border-b border-card font-semibold text-[var(--foreground)]"
                style={{ gridTemplateColumns: "2.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr" }}
              >
                <div className="py-2 pl-4 pr-3 text-left">Occupation</div>
                <div className="py-2 px-3 text-right">Workers</div>
                <div className="py-2 px-3 text-right">Wage</div>
                <YearHeader year={2028} />
                <YearHeader year={2032} />
                <YearHeader year={2036} />
                <div className="py-2 px-3 text-center" title="Demand elasticity: will cheaper AI output expand this market or just cut costs?">Demand</div>
              </div>
              {/* Rows */}
              <div className="text-[var(--muted)]">
                {detail.groups.map((g) => {
                  const jobIds = SOC_TO_JOB_IDS[g.id] || [];
                  const clickable = jobIds.length > 0;
                  return (
                    <div
                      key={g.shortTitle}
                      className={`grid items-center border-b border-black/[0.03] ${clickable ? "cursor-pointer hover:bg-black/[0.02] relative" : "hover:bg-black/[0.02]"}`}
                      style={{ gridTemplateColumns: "2.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr" }}
                      onClick={clickable ? () => router.push(`/task-visualizer?job=${jobIds[0]}`) : undefined}
                    >
                      <div className="py-2 pl-4 pr-3 font-medium">
                        {clickable ? (
                          <span className="text-[var(--foreground)] hover:text-[var(--accent)]">{g.shortTitle}</span>
                        ) : (
                          <span className="text-[var(--foreground)]">{g.shortTitle}</span>
                        )}
                      </div>
                      <div className="py-2 px-3 text-right tabular-nums">{(g.employment / 1000).toFixed(1)}M</div>
                      <div className="py-2 px-3 text-right tabular-nums">${(g.medianWageAnnual / 1000).toFixed(0)}K</div>
                      <div className="py-2 px-3 text-right tabular-nums" style={g.pct2028 < 35 ? { backgroundColor: "rgba(16, 185, 129, 0.10)" } : undefined}>
                        <span style={{ color: g.pct2028 >= 60 ? "#EF4444" : g.pct2028 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2028}%
                        </span>
                      </div>
                      <div className="py-2 px-3 text-right tabular-nums" style={g.pct2032 < 35 ? { backgroundColor: "rgba(16, 185, 129, 0.10)" } : undefined}>
                        <span style={{ color: g.pct2032 >= 60 ? "#EF4444" : g.pct2032 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2032}%
                        </span>
                      </div>
                      <div className="py-2 px-3 text-right tabular-nums" style={g.pct2036 < 35 ? { backgroundColor: "rgba(16, 185, 129, 0.10)" } : undefined}>
                        <span style={{ color: g.pct2036 >= 60 ? "#EF4444" : g.pct2036 >= 35 ? "#6366F1" : "#10B981" }}>
                          {g.pct2036}%
                        </span>
                      </div>
                      <div className="py-2 px-3 text-center text-xs">
                        {g.demandElasticity && (
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-2xs font-medium"
                            style={{
                              color: DEMAND_ELASTICITY_META[g.demandElasticity as keyof typeof DEMAND_ELASTICITY_META].color,
                              backgroundColor: `${DEMAND_ELASTICITY_META[g.demandElasticity as keyof typeof DEMAND_ELASTICITY_META].color}15`,
                            }}
                            title={DEMAND_ELASTICITY[g.id]?.rationale}
                          >
                            {DEMAND_ELASTICITY_META[g.demandElasticity as keyof typeof DEMAND_ELASTICITY_META].label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column definitions */}
            <div className="px-5 py-2.5 border-t border-card text-2xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--foreground)]">2028/32/36</strong> = % of tasks where AI is cheaper than human labor.{" "}
              <strong className="text-[var(--foreground)]">Demand</strong> = will cheaper output expand this market? <span className="text-[var(--signal-positive-muted)]">High</span> = more demand, <span className="text-signal-negative">Low</span> = fixed demand.
            </div>
          </div>
        );
      })}
    </div>
  );
}
