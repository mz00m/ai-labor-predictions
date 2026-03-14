"use client";

import { useState, useMemo } from "react";
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
  getAutomationPercentAtYear,
  type OccupationGroup,
} from "@/data/economy-occupations";

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const tierMeta = INCOME_TIER_META[d.incomeTier as keyof typeof INCOME_TIER_META];
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[280px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{d.title}</p>
      <div className="mt-1.5 space-y-0.5 text-[12px]">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Task automation</span>
          <span className="font-medium">{d.automationPct}%</span>
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
      </div>
    </div>
  );
}

export default function YearSliderExplorer() {
  const [selectedYear, setSelectedYear] = useState(2030);

  const chartData = useMemo(() => {
    return OCCUPATION_GROUPS.map((g) => ({
      ...g,
      automationPct: getAutomationPercentAtYear(g, selectedYear),
    })).sort((a, b) => b.automationPct - a.automationPct);
  }, [selectedYear]);

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

    return {
      avgPct,
      significantWorkersM: (significantWorkers / 1000).toFixed(1),
      tiers: (["low", "middle", "high"] as const).map((t) => ({
        tier: t,
        pct: tierWorkers[t] > 0 ? Math.round((tierAffected[t] / tierWorkers[t]) * 100) : 0,
        affected: Math.round(tierAffected[t]),
      })),
    };
  }, [chartData]);

  return (
    <div>
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
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold text-[var(--foreground)] tracking-tight">
            {summaryStats.avgPct}%
          </p>
          <p className="text-[11px] text-[var(--muted)]">Avg task automation across economy</p>
        </div>
        {summaryStats.tiers.map(({ tier, pct }) => {
          const meta = INCOME_TIER_META[tier];
          return (
            <div key={tier} className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
              <p className="text-[28px] font-bold tracking-tight" style={{ color: meta.color }}>
                {pct}%
              </p>
              <p className="text-[11px] text-[var(--muted)]">{meta.label} task automation</p>
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
            <Bar dataKey="automationPct" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry) => {
                const pct = entry.automationPct;
                const color = pct >= 75 ? "#EF4444" : pct >= 50 ? "#F59E0B" : pct >= 25 ? "#5C61F6" : "#10B981";
                return (
                  <Cell key={entry.id} fill={color} fillOpacity={0.75} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-black/[0.06]">
        {[
          { label: "Low exposure (<25%)", color: "#10B981" },
          { label: "Moderate (25-50%)", color: "#5C61F6" },
          { label: "High (50-75%)", color: "#F59E0B" },
          { label: "Very high (>75%)", color: "#EF4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-[var(--muted)]">{item.label}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Bar shows the percentage of each occupation&apos;s task-hours where compute cost has crossed
        below human labor cost. The 50% line marks the threshold where more than half of an
        occupation&apos;s tasks face economic automation pressure.
      </p>
    </div>
  );
}
