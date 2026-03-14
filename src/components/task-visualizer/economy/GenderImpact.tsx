"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  TOTAL_EMPLOYMENT,
  getAutomationPercentAtYear,
  type IncomeTier,
} from "@/data/economy-occupations";

const GENDER_COLORS = {
  women: "#5C61F6",
  men: "#C7D2FE",
};

interface TierGenderData {
  tier: IncomeTier;
  totalWorkers: number;
  womenWorkers: number;
  menWorkers: number;
  womenPercent: number;
  womenAvgAutomation2030: number;
  menAvgAutomation2030: number;
  /** Occupation groups in this tier, sorted by women % */
  groups: {
    shortTitle: string;
    employment: number;
    womenPercent: number;
    womenCount: number;
    menCount: number;
    automationPct2030: number;
    incomeTier: IncomeTier;
  }[];
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[260px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{d.shortTitle}</p>
      <div className="mt-1.5 space-y-0.5 text-[12px]">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Women</span>
          <span className="font-medium" style={{ color: GENDER_COLORS.women }}>
            {d.womenPercent}% ({(d.womenCount / 1000).toFixed(1)}M)
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Men</span>
          <span className="font-medium" style={{ color: GENDER_COLORS.men }}>
            {100 - d.womenPercent}% ({(d.menCount / 1000).toFixed(1)}M)
          </span>
        </div>
        <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-black/[0.06]">
          <span className="text-[var(--muted)]">Task automation by 2030</span>
          <span className="font-medium">{d.automationPct2030}%</span>
        </div>
      </div>
    </div>
  );
}

export default function GenderImpact() {
  const tierData: TierGenderData[] = useMemo(() => {
    return (["low", "middle", "high"] as const).map((tier) => {
      const tierGroups = OCCUPATION_GROUPS.filter((g) => g.incomeTier === tier);
      const groups = tierGroups.map((g) => {
        const womenCount = Math.round(g.employment * g.womenPercent / 100);
        return {
          shortTitle: g.shortTitle,
          employment: g.employment,
          womenPercent: g.womenPercent,
          womenCount,
          menCount: g.employment - womenCount,
          automationPct2030: getAutomationPercentAtYear(g, 2030),
          incomeTier: g.incomeTier,
        };
      }).sort((a, b) => b.womenPercent - a.womenPercent);

      const totalWorkers = groups.reduce((s, g) => s + g.employment, 0);
      const womenWorkers = groups.reduce((s, g) => s + g.womenCount, 0);
      const menWorkers = totalWorkers - womenWorkers;

      // Weighted average automation for women vs men in this tier
      let womenAutoWeighted = 0;
      let menAutoWeighted = 0;
      for (const g of groups) {
        womenAutoWeighted += g.womenCount * g.automationPct2030;
        menAutoWeighted += g.menCount * g.automationPct2030;
      }

      return {
        tier,
        totalWorkers,
        womenWorkers,
        menWorkers,
        womenPercent: Math.round((womenWorkers / totalWorkers) * 100),
        womenAvgAutomation2030: womenWorkers > 0 ? Math.round(womenAutoWeighted / womenWorkers) : 0,
        menAvgAutomation2030: menWorkers > 0 ? Math.round(menAutoWeighted / menWorkers) : 0,
        groups,
      };
    });
  }, []);

  // Economy-wide gender stats
  const economyStats = useMemo(() => {
    let totalWomen = 0;
    let totalMen = 0;
    let womenAutoWeighted = 0;
    let menAutoWeighted = 0;

    for (const g of OCCUPATION_GROUPS) {
      const womenCount = Math.round(g.employment * g.womenPercent / 100);
      const menCount = g.employment - womenCount;
      const auto = getAutomationPercentAtYear(g, 2030);
      totalWomen += womenCount;
      totalMen += menCount;
      womenAutoWeighted += womenCount * auto;
      menAutoWeighted += menCount * auto;
    }

    return {
      totalWomen,
      totalMen,
      womenPct: Math.round((totalWomen / TOTAL_EMPLOYMENT) * 100),
      womenAvgAuto: Math.round(womenAutoWeighted / totalWomen),
      menAvgAuto: Math.round(menAutoWeighted / totalMen),
      gap: Math.round(womenAutoWeighted / totalWomen) - Math.round(menAutoWeighted / totalMen),
    };
  }, []);

  // Most exposed female-dominated occupations
  const mostExposedWomen = useMemo(() => {
    return OCCUPATION_GROUPS
      .filter((g) => g.womenPercent >= 55)
      .map((g) => ({
        shortTitle: g.shortTitle,
        womenPercent: g.womenPercent,
        womenCount: Math.round(g.employment * g.womenPercent / 100),
        automationPct2030: getAutomationPercentAtYear(g, 2030),
        incomeTier: g.incomeTier,
      }))
      .sort((a, b) => b.automationPct2030 - a.automationPct2030)
      .slice(0, 8);
  }, []);

  // Bar chart data: all groups by women% with automation color
  const barChartData = useMemo(() => {
    return OCCUPATION_GROUPS
      .map((g) => ({
        shortTitle: g.shortTitle,
        womenPercent: g.womenPercent,
        menPercent: 100 - g.womenPercent,
        womenCount: Math.round(g.employment * g.womenPercent / 100),
        menCount: g.employment - Math.round(g.employment * g.womenPercent / 100),
        employment: g.employment,
        automationPct2030: getAutomationPercentAtYear(g, 2030),
        incomeTier: g.incomeTier,
      }))
      .sort((a, b) => b.womenPercent - a.womenPercent);
  }, []);

  return (
    <div>
      {/* Big stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold tracking-tight" style={{ color: GENDER_COLORS.women }}>
            {economyStats.womenPct}%
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            of workforce is women ({(economyStats.totalWomen / 1000).toFixed(1)}M)
          </p>
        </div>
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold tracking-tight" style={{ color: GENDER_COLORS.women }}>
            {economyStats.womenAvgAuto}%
          </p>
          <p className="text-[11px] text-[var(--muted)]">Avg task automation for women by 2030</p>
        </div>
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold tracking-tight" style={{ color: GENDER_COLORS.men }}>
            {economyStats.menAvgAuto}%
          </p>
          <p className="text-[11px] text-[var(--muted)]">Avg task automation for men by 2030</p>
        </div>
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold tracking-tight text-[var(--foreground)]">
            {economyStats.gap > 0 ? "+" : ""}{economyStats.gap}pp
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Gender automation gap (women {economyStats.gap > 0 ? "more" : "less"} exposed)
          </p>
        </div>
      </div>

      {/* Gender composition by occupation */}
      <div className="mb-8">
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          Gender composition by occupation group
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-4">
          Sorted by percentage of women. Women are concentrated in clerical, administrative, healthcare support,
          and education roles — many of which have high information-processing and communication task loads
          that face near-term automation.
        </p>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: GENDER_COLORS.women }} />
            <span className="text-[13px] font-medium text-[var(--foreground)]">Women</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: GENDER_COLORS.men }} />
            <span className="text-[13px] font-medium text-[var(--foreground)]">Men</span>
          </div>
        </div>

        <div className="h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
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
              <Bar dataKey="womenPercent" name="Women" stackId="a" barSize={18}>
                {barChartData.map((entry) => (
                  <Cell key={entry.shortTitle} fill={GENDER_COLORS.women} fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar dataKey="menPercent" name="Men" stackId="a" barSize={18}>
                {barChartData.map((entry) => (
                  <Cell key={entry.shortTitle} fill={GENDER_COLORS.men} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most exposed female-dominated occupations */}
      <div className="mb-8">
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          Most exposed female-dominated occupations
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-3">
          Occupations where women are the majority (55%+), ranked by automation exposure at 2030.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left py-2 pr-3 text-[var(--foreground)] font-semibold">Occupation</th>
                <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Women %</th>
                <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Women workers</th>
                <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Task automation 2030</th>
                <th className="text-right py-2 pl-3 text-[var(--foreground)] font-semibold">Income tier</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              {mostExposedWomen.map((g) => (
                <tr key={g.shortTitle} className="border-b border-black/[0.03] hover:bg-black/[0.01]">
                  <td className="py-2 pr-3 text-[var(--foreground)] font-medium">{g.shortTitle}</td>
                  <td className="text-right py-2 px-3 tabular-nums" style={{ color: GENDER_COLORS.women }}>
                    {g.womenPercent}%
                  </td>
                  <td className="text-right py-2 px-3 tabular-nums">
                    {(g.womenCount / 1000).toFixed(1)}M
                  </td>
                  <td className="text-right py-2 px-3 tabular-nums">
                    <span style={{ color: g.automationPct2030 >= 60 ? "#EF4444" : g.automationPct2030 >= 35 ? "#6366F1" : "#10B981" }}>
                      {g.automationPct2030}%
                    </span>
                  </td>
                  <td className="text-right py-2 pl-3">
                    <span style={{ color: INCOME_TIER_META[g.incomeTier].color }}>
                      {INCOME_TIER_META[g.incomeTier].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier breakdown */}
      <div>
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          Gender and automation by income tier
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-4">
          How the automation gap plays out differently across income levels.
        </p>

        <div className="space-y-4">
          {tierData.map((td) => {
            const meta = INCOME_TIER_META[td.tier];
            const gapInTier = td.womenAvgAutomation2030 - td.menAvgAutomation2030;
            return (
              <div key={td.tier} className="rounded-xl border border-black/[0.06] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-[13px] font-semibold" style={{ color: meta.color }}>
                      {meta.label}
                    </h5>
                    <p className="text-[11px] text-[var(--muted)]">
                      {meta.range} — {td.womenPercent}% women ({(td.womenWorkers / 1000).toFixed(1)}M)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[var(--foreground)]">
                      {gapInTier > 0 ? "+" : ""}{gapInTier}pp gap
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">women vs men automation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.women }} />
                      <span className="text-[11px] font-medium text-[var(--foreground)]">Women</span>
                    </div>
                    <p className="text-[18px] font-bold tracking-tight" style={{ color: GENDER_COLORS.women }}>
                      {td.womenAvgAutomation2030}%
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">avg task automation 2030</p>
                  </div>
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.men }} />
                      <span className="text-[11px] font-medium text-[var(--foreground)]">Men</span>
                    </div>
                    <p className="text-[18px] font-bold tracking-tight" style={{ color: GENDER_COLORS.men }}>
                      {td.menAvgAutomation2030}%
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">avg task automation 2030</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-6">
        Gender composition from BLS Current Population Survey 2024 annual averages (Table 11).
        Automation projections use the same compute-cost crossover model as other sections.
        The automation gap reflects occupational segregation — women are concentrated in clerical,
        administrative, healthcare support, and education roles with high information-processing
        task loads, while men dominate physical/manual trades which are harder to automate.
      </p>
    </div>
  );
}
