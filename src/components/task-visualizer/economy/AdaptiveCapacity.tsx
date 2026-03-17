"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
  TooltipProps,
  Cell,
  Label,
} from "recharts";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  SOC_TO_JOB_IDS,
  CFO_SURVEY_NEI,
  type IncomeTier,
  type OccupationGroup,
} from "@/data/economy-occupations";

interface ACComponentRow {
  id: string;
  shortTitle: string;
  adaptiveCapacity: number;
  netLiquidWealth: number;
  skillTransferability: number;
  geographicDensity: number;
  ageFraction55Plus: number;
}

interface ScatterPoint {
  id: string;
  shortTitle: string;
  aiExposure: number;
  adaptiveCapacity: number;
  employment: number;
  incomeTier: IncomeTier;
  womenPercent: number;
  hasJobs: boolean;
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as ScatterPoint;
  const neiData = CFO_SURVEY_NEI[d.id];
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[260px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{d.shortTitle}</p>
      <div className="mt-1.5 space-y-0.5 text-[12px]">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">AI Exposure</span>
          <span className="font-medium">{(d.aiExposure * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Adaptive Capacity</span>
          <span className="font-medium">{(d.adaptiveCapacity * 100).toFixed(0)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Workers</span>
          <span className="font-medium">{(d.employment / 1000).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Women</span>
          <span className="font-medium">{d.womenPercent}%</span>
        </div>
        <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-black/[0.06]">
          <span className="text-[var(--muted)]">Income tier</span>
          <span className="font-medium" style={{ color: INCOME_TIER_META[d.incomeTier].color }}>
            {INCOME_TIER_META[d.incomeTier].label}
          </span>
        </div>
        {neiData && (
          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">CFO replace/enhance</span>
            <span className="font-medium" style={{ color: neiData.nei > 1 ? "#EF4444" : neiData.nei > 0.7 ? "#F59E0B" : "#10B981" }}>
              {neiData.nei.toFixed(2)}x
            </span>
          </div>
        )}
      </div>
      {d.hasJobs && (
        <p className="text-[10px] text-[var(--accent)] mt-2 pt-1.5 border-t border-black/[0.06]">
          Click to explore individual jobs in this group
        </p>
      )}
    </div>
  );
}

export default function AdaptiveCapacity() {
  const router = useRouter();

  const scatterData = useMemo<ScatterPoint[]>(() => {
    return OCCUPATION_GROUPS.map((g) => ({
      id: g.id,
      shortTitle: g.shortTitle,
      aiExposure: g.aiExposure,
      adaptiveCapacity: g.adaptiveCapacity,
      employment: g.employment,
      incomeTier: g.incomeTier,
      womenPercent: g.womenPercent,
      hasJobs: (SOC_TO_JOB_IDS[g.id] || []).length > 0,
    }));
  }, []);

  // Compute medians for quadrant lines
  const medianExposure = useMemo(() => {
    const sorted = [...OCCUPATION_GROUPS].sort((a, b) => a.aiExposure - b.aiExposure);
    return sorted[Math.floor(sorted.length / 2)].aiExposure;
  }, []);

  const medianAC = useMemo(() => {
    const sorted = [...OCCUPATION_GROUPS].sort((a, b) => a.adaptiveCapacity - b.adaptiveCapacity);
    return sorted[Math.floor(sorted.length / 2)].adaptiveCapacity;
  }, []);

  // Vulnerability table: high exposure + low AC
  const vulnerableGroups = useMemo(() => {
    return OCCUPATION_GROUPS
      .filter((g) => g.aiExposure >= medianExposure && g.adaptiveCapacity < medianAC)
      .sort((a, b) => b.aiExposure - a.aiExposure);
  }, [medianExposure, medianAC]);

  // AC components bar data
  const componentsData = useMemo<ACComponentRow[]>(() => {
    return [...OCCUPATION_GROUPS]
      .sort((a, b) => b.adaptiveCapacity - a.adaptiveCapacity)
      .map((g) => ({
        id: g.id,
        shortTitle: g.shortTitle,
        adaptiveCapacity: g.adaptiveCapacity,
        ...g.adaptiveCapacityComponents,
      }));
  }, []);

  return (
    <div>
      {/* Headline stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4" style={{ animationDelay: "0s" }}>
          <p className="text-[28px] font-bold tracking-tight text-[var(--foreground)]">
            r = 0.50
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            AI exposure and adaptive capacity are positively correlated
          </p>
        </div>
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4" style={{ animationDelay: "0.08s" }}>
          <p className="text-[28px] font-bold tracking-tight text-[#10B981]">
            71%
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            of highly-exposed workers have above-median adaptability
          </p>
        </div>
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4" style={{ animationDelay: "0.16s" }}>
          <p className="text-[28px] font-bold tracking-tight text-[#EF4444]">
            6.1M
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            workers with high exposure + low adaptability
          </p>
        </div>
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4" style={{ animationDelay: "0.24s" }}>
          <p className="text-[28px] font-bold tracking-tight text-[#EC4899]">
            81%
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            of high-vulnerability workers are women
          </p>
        </div>
      </div>

      {/* Scatter plot */}
      <div className="mb-8">
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          AI exposure vs. adaptive capacity by occupation group
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-4">
          Dot size reflects employment. Color shows income tier. The bottom-right quadrant
          (high exposure, low adaptability) contains the most vulnerable workers — concentrated
          in clerical and administrative roles.
        </p>

        {/* Legend */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {(["low", "middle", "high"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: INCOME_TIER_META[tier].color }} />
              <span className="text-[11px] text-[var(--muted)]">{INCOME_TIER_META[tier].label}</span>
            </div>
          ))}
        </div>

        <div className="h-[440px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              onClick={(state: { activePayload?: { payload: ScatterPoint }[] } | null) => {
                if (!state?.activePayload?.[0]) return;
                const point = state.activePayload[0].payload;
                const jobIds = SOC_TO_JOB_IDS[point.id] || [];
                if (jobIds.length > 0) {
                  router.push(`/task-visualizer?job=${jobIds[0]}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                type="number"
                dataKey="aiExposure"
                domain={[0, 0.6]}
                name="AI Exposure"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value="AI Exposure (Eloundou et al.)"
                  position="bottom"
                  offset={0}
                  style={{ fontSize: 11, fill: "#6b7280" }}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey="adaptiveCapacity"
                domain={[0.25, 0.8]}
                name="Adaptive Capacity"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v: number) => v.toFixed(2)}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value="Adaptive Capacity"
                  position="insideLeft"
                  angle={-90}
                  offset={0}
                  style={{ fontSize: 11, fill: "#6b7280", textAnchor: "middle" }}
                />
              </YAxis>
              <ZAxis
                type="number"
                dataKey="employment"
                range={[40, 500]}
                name="Employment"
              />
              <ReferenceLine
                x={medianExposure}
                stroke="rgba(0,0,0,0.15)"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={medianAC}
                stroke="rgba(0,0,0,0.15)"
                strokeDasharray="4 4"
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Scatter
                data={scatterData}
                style={{ cursor: "pointer" }}
              >
                {scatterData.map((entry: ScatterPoint) => (
                  <Cell
                    key={entry.id}
                    fill={INCOME_TIER_META[entry.incomeTier].color}
                    fillOpacity={0.8}
                    stroke={INCOME_TIER_META[entry.incomeTier].color}
                    strokeOpacity={0.3}
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant labels */}
        <div className="grid grid-cols-2 gap-4 mt-2 text-[11px]">
          <div className="quadrant-label text-right text-[var(--muted)]">
            Low exposure, high adaptability
          </div>
          <div className="quadrant-label text-left text-[#10B981] font-medium">
            High exposure, high adaptability
          </div>
          <div className="quadrant-label text-right text-[#F59E0B]">
            Low exposure, low adaptability
          </div>
          <div className="quadrant-label text-left text-[#EF4444] font-medium">
            High exposure, LOW adaptability
          </div>
        </div>
      </div>

      {/* Vulnerability table */}
      {vulnerableGroups.length > 0 && (
        <div className="mb-8">
          <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
            Most vulnerable: high exposure, low adaptability
          </h4>
          <p className="text-[11px] text-[var(--muted)] mb-3">
            Occupation groups in the bottom-right quadrant. These workers face the strongest
            automation pressure with the fewest resources to transition.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left py-2 pr-3 text-[var(--foreground)] font-semibold">Occupation</th>
                  <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Workers</th>
                  <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">AI Exposure</th>
                  <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Adaptive Capacity</th>
                  <th className="text-right py-2 px-3 text-[var(--foreground)] font-semibold">Women %</th>
                  <th className="text-right py-2 pl-3 text-[var(--foreground)] font-semibold">Income</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {vulnerableGroups.map((g: OccupationGroup) => {
                  const jobIds = SOC_TO_JOB_IDS[g.id] || [];
                  const clickable = jobIds.length > 0;
                  return (
                    <tr
                      key={g.id}
                      className={`border-b border-black/[0.03] ${clickable ? "nav-row cursor-pointer" : "hover:bg-black/[0.02]"}`}
                      onClick={clickable ? () => router.push(`/task-visualizer?job=${jobIds[0]}`) : undefined}
                    >
                      <td className="py-2 pr-3 font-medium text-[var(--foreground)]">{g.shortTitle}</td>
                      <td className="text-right py-2 px-3 tabular-nums">{(g.employment / 1000).toFixed(1)}M</td>
                      <td className="text-right py-2 px-3 tabular-nums">
                        <span style={{ color: "#EF4444" }}>{(g.aiExposure * 100).toFixed(0)}%</span>
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">
                        <span style={{ color: "#EF4444" }}>{(g.adaptiveCapacity * 100).toFixed(0)}</span>
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">{g.womenPercent}%</td>
                      <td className="text-right py-2 pl-3">
                        <span style={{ color: INCOME_TIER_META[g.incomeTier].color }}>
                          {INCOME_TIER_META[g.incomeTier].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AC Components breakdown */}
      <div className="mb-8">
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          What drives adaptive capacity?
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-3">
          Four components determine whether displaced workers can transition: net liquid wealth
          (financial runway), skill transferability (how many other jobs use similar skills),
          geographic density (access to alternative employers), and age (fraction under 55).
        </p>

        {/* Legend */}
        <div className="flex gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#6366F1" }} />
            <span className="text-[11px] text-[var(--muted)]">Net Liquid Wealth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }} />
            <span className="text-[11px] text-[var(--muted)]">Skill Transferability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }} />
            <span className="text-[11px] text-[var(--muted)]">Geographic Density</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EC4899" }} />
            <span className="text-[11px] text-[var(--muted)]">Age (% under 55)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {componentsData.map((g: ACComponentRow) => {
            const total = g.netLiquidWealth + g.skillTransferability + g.geographicDensity + g.ageFraction55Plus;
            return (
              <div key={g.id} className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--muted)] w-[140px] shrink-0 truncate text-right">
                  {g.shortTitle}
                </span>
                <div className="flex-1 h-5 flex rounded overflow-hidden bg-black/[0.02]">
                  <div
                    style={{ width: `${(g.netLiquidWealth / total) * 100}%`, backgroundColor: "#6366F1" }}
                    className="h-full"
                  />
                  <div
                    style={{ width: `${(g.skillTransferability / total) * 100}%`, backgroundColor: "#10B981" }}
                    className="h-full"
                  />
                  <div
                    style={{ width: `${(g.geographicDensity / total) * 100}%`, backgroundColor: "#F59E0B" }}
                    className="h-full"
                  />
                  <div
                    style={{ width: `${(g.ageFraction55Plus / total) * 100}%`, backgroundColor: "#EC4899" }}
                    className="h-full"
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--foreground)] w-[32px] text-right tabular-nums">
                  {(g.adaptiveCapacity * 100).toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source attribution */}
      <p className="text-[11px] text-[var(--muted)] mt-6">
        Based on Manning &amp; Aguirre, &quot;How Adaptable Are American Workers to AI-Induced Job
        Displacement?&quot; NBER Working Paper w34705, January 2026. Adaptive capacity index covers
        356 occupations (95.9% of US workforce). The index measures occupation-level characteristics,
        not individual workers — within-occupation heterogeneity is masked. AI exposure from Eloundou
        et al. (2024) E1+0.5E2 estimates. The paper&apos;s 7 major occupation categories map to our 22
        SOC groups; groups sharing a paper category share the same composite AC score.
      </p>
    </div>
  );
}
