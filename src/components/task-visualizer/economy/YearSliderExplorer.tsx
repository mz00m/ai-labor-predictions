"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  TOTAL_EMPLOYMENT,
  SOC_TO_JOB_IDS,
  getAutomationPercentAtYear,
  DECLINE_RATE_SCENARIOS,
  getCfoSignal,
  DEMAND_ELASTICITY,
  DEMAND_ELASTICITY_META,
  type OccupationGroup,
  type ScenarioKey,
} from "@/data/economy-occupations";

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const tierMeta = INCOME_TIER_META[d.incomeTier as keyof typeof INCOME_TIER_META];
  const jobIds = SOC_TO_JOB_IDS[d.id] || [];
  const cfoSignal = getCfoSignal(d.id);
  const elasticity = DEMAND_ELASTICITY[d.id];
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[280px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{d.title}</p>
      <div className="mt-1.5 space-y-0.5 text-[12px]">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Cost crossover</span>
          <span className="font-medium">{d.automationPct}% of tasks</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Workers</span>
          <span className="font-medium">{(d.employment * 1000).toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Median wage</span>
          <span className="font-medium">${d.medianWageHr}/hr</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Income tier</span>
          <span style={{ color: tierMeta.color }} className="font-medium">{tierMeta.label}</span>
        </div>
        {(cfoSignal || elasticity) && (
          <div className="mt-1 pt-1 border-t border-black/[0.06] space-y-0.5">
            {cfoSignal && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">CFO signal</span>
                <span className="font-medium" style={{ color: cfoSignal.color }}>
                  {cfoSignal.shortLabel} ({cfoSignal.nei.toFixed(2)}x)
                </span>
              </div>
            )}
            {elasticity && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Demand elasticity</span>
                <span className="font-medium" style={{ color: DEMAND_ELASTICITY_META[elasticity.elasticity].color }}>
                  {DEMAND_ELASTICITY_META[elasticity.elasticity].label}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {jobIds.length > 0 && (
        <p className="text-[10px] text-[var(--accent)] mt-2 pt-1.5 border-t border-black/[0.06]">
          Click to explore individual jobs in this group
        </p>
      )}
    </div>
  );
}

export default function YearSliderExplorer() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2030);
  const [scenario, setScenario] = useState<ScenarioKey>("baseline");

  const scenarioMultiplier = DECLINE_RATE_SCENARIOS[scenario].multiplier;

  const chartData = useMemo(() => {
    return OCCUPATION_GROUPS.map((g) => ({
      ...g,
      automationPct: getAutomationPercentAtYear(g, selectedYear, false, scenarioMultiplier),
    })).sort((a, b) => b.automationPct - a.automationPct);
  }, [selectedYear, scenarioMultiplier]);

  // Also compute slow/fast range for the summary
  const summaryStats = useMemo(() => {
    let totalWeighted = 0;
    let significantWorkers = 0;
    const tierWorkers: Record<string, number> = { low: 0, middle: 0, high: 0 };
    const tierAffected: Record<string, number> = { low: 0, middle: 0, high: 0 };

    for (const d of chartData) {
      totalWeighted += d.employment * d.automationPct;
      if (d.automationPct >= 50) {
        significantWorkers += d.employment;
      }
      tierWorkers[d.incomeTier] += d.employment;
      tierAffected[d.incomeTier] += d.employment * (d.automationPct / 100);
    }

    const avgPct = Math.round(totalWeighted / TOTAL_EMPLOYMENT);

    // Compute range across scenarios for the current year
    const scenarioRange = scenario === "baseline" ? (() => {
      let slowTotal = 0, fastTotal = 0;
      for (const g of OCCUPATION_GROUPS) {
        slowTotal += g.employment * getAutomationPercentAtYear(g, selectedYear, false, DECLINE_RATE_SCENARIOS.slow.multiplier);
        fastTotal += g.employment * getAutomationPercentAtYear(g, selectedYear, false, DECLINE_RATE_SCENARIOS.fast.multiplier);
      }
      return {
        slowPct: Math.round(slowTotal / TOTAL_EMPLOYMENT),
        fastPct: Math.round(fastTotal / TOTAL_EMPLOYMENT),
      };
    })() : null;

    return {
      avgPct,
      scenarioRange,
      significantWorkersM: (significantWorkers / 1000).toFixed(1),
      tiers: (["low", "middle", "high"] as const).map((t) => ({
        tier: t,
        pct: tierWorkers[t] > 0 ? Math.round((tierAffected[t] / tierWorkers[t]) * 100) : 0,
        affected: Math.round(tierAffected[t]),
      })),
    };
  }, [chartData, selectedYear, scenario]);

  return (
    <div>
      {/* Scenario toggle */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-medium text-[var(--foreground)]">Cost decline scenario:</span>
          <div className="inline-flex rounded-lg border border-black/[0.08] overflow-hidden">
            {(Object.keys(DECLINE_RATE_SCENARIOS) as ScenarioKey[]).map((key) => {
              const s = DECLINE_RATE_SCENARIOS[key];
              const isActive = scenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-[var(--muted)]">
          {DECLINE_RATE_SCENARIOS[scenario].description}
        </p>
      </div>

      {/* Year slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-medium text-[var(--foreground)]">
            Explore year: <span className="text-[var(--accent)] font-bold text-[18px] ml-1">{selectedYear}</span>
          </label>
          <span className="text-[11px] text-[var(--muted)]">
            {selectedYear - 2026} years from now
          </span>
        </div>
        <input
          type="range"
          min={2026}
          max={2040}
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((selectedYear - 2026) / 14) * 100}%, rgba(0,0,0,0.06) ${((selectedYear - 2026) / 14) * 100}%, rgba(0,0,0,0.06) 100%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
          <span>2026 (today)</span>
          <span>2030</span>
          <span>2035</span>
          <span>2040</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold text-[var(--foreground)] tracking-tight tabular-nums">
            {summaryStats.avgPct}%
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Avg cost crossover across economy
            {summaryStats.scenarioRange && (
              <span className="ml-1 text-[10px] opacity-70">
                (range: {summaryStats.scenarioRange.slowPct}-{summaryStats.scenarioRange.fastPct}%)
              </span>
            )}
          </p>
        </div>
        {summaryStats.tiers.map(({ tier, pct }, i) => {
          const meta = INCOME_TIER_META[tier];
          return (
            <div key={tier} className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4" style={{ animationDelay: `${(i + 1) * 0.08}s` }}>
              <p className="text-[28px] font-bold tracking-tight tabular-nums" style={{ color: meta.color }}>
                {pct}%
              </p>
              <p className="text-[11px] text-[var(--muted)]">{meta.label} cost crossover</p>
            </div>
          );
        })}
      </div>

      {/* Per-occupation bar chart */}
      <div className="h-[540px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            onClick={(state) => {
              if (!state?.activePayload?.[0]) return;
              const group = state.activePayload[0].payload as OccupationGroup;
              const jobIds = SOC_TO_JOB_IDS[group.id] || [];
              if (jobIds.length > 0) {
                router.push(`/task-visualizer?job=${jobIds[0]}`);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortTitle"
              width={150}
              tick={{ fontSize: 11, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <ReferenceLine
              x={50}
              stroke="#EF4444"
              strokeDasharray="6 3"
              strokeWidth={1}
              label={{ value: "50% threshold", position: "insideTopRight", fill: "#EF4444", fontSize: 10 }}
            />
            <Bar dataKey="automationPct" radius={[0, 4, 4, 0]} barSize={18} style={{ cursor: "pointer" }}>
              {chartData.map((entry) => {
                const pct = entry.automationPct;
                const color = pct >= 60 ? "#EF4444" : pct >= 35 ? "#6366F1" : "#10B981";
                const hasJobs = (SOC_TO_JOB_IDS[entry.id] || []).length > 0;
                return (
                  <Cell key={entry.id} fill={color} fillOpacity={hasJobs ? 0.75 : 0.45} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-black/[0.06]">
        {[
          { label: "Low pressure (<35%)", color: "#10B981" },
          { label: "Moderate (35-60%)", color: "#6366F1" },
          { label: "High pressure (>60%)", color: "#EF4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-[var(--muted)]">{item.label}</span>
          </div>
        ))}
        <span className="text-[10px] text-[var(--muted)] ml-2 opacity-60">|</span>
        {(["high", "moderate", "low"] as const).map((e) => (
          <div key={e} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DEMAND_ELASTICITY_META[e].color }} />
            <span className="text-[10px] text-[var(--muted)]">{DEMAND_ELASTICITY_META[e].label} demand elasticity</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Bar shows the percentage of each occupation&apos;s task-hours where compute cost has crossed
        below human labor cost. The 50% line marks the threshold where more than half of an
        occupation&apos;s tasks face cost crossover. This measures economic incentive, not actual displacement —
        real adoption depends on organizational readiness, regulation, and demand elasticity. For high-elasticity
        sectors, cost reduction may expand markets and increase employment. Use the scenario toggle to see how
        sensitive these projections are to the assumed rate of AI cost decline.
      </p>
    </div>
  );
}
