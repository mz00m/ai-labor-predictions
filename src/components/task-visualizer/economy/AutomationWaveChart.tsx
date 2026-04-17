"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  generateEconomyTimeline,
  INCOME_TIER_META,
  DECLINE_RATE_SCENARIOS,
} from "@/data/economy-occupations";

// Only show baseline income tier lines in tooltip, not scenario band areas
const BASELINE_KEYS = new Set(["lowAutomated", "middleAutomated", "highAutomated"]);

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const filtered = payload.filter((p) => BASELINE_KEYS.has(p.dataKey as string));
  if (!filtered.length) return null;

  // Pull scenario range from the full payload for context
  const dataPoint = payload[0]?.payload;
  const hasRange = dataPoint?.lowSlow !== undefined;

  return (
    <div className="bg-white rounded-lg border border-strong shadow-lg p-3">
      <p className="text-sm font-semibold text-[var(--foreground)] mb-1.5">{label}</p>
      <p className="text-2xs text-[var(--muted)] mb-1">Baseline cost crossover by income tier:</p>
      {[...filtered].reverse().map((p) => (
        <div key={p.dataKey} className="flex justify-between text-xs gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{p.value}% of tasks</span>
        </div>
      ))}
      {hasRange && (
        <p className="text-2xs text-[var(--muted)] mt-1.5 pt-1.5 border-t border-card">
          Shaded bands show slow/fast scenario range
        </p>
      )}
    </div>
  );
}

export default function AutomationWaveChart() {
  const data = useMemo(() => generateEconomyTimeline(2026, 2040), []);

  // Generate slow/fast scenario data for fan chart bands
  const scenarioData = useMemo(() => {
    const slow = generateEconomyTimeline(2026, 2040, false, DECLINE_RATE_SCENARIOS.slow.multiplier);
    const fast = generateEconomyTimeline(2026, 2040, false, DECLINE_RATE_SCENARIOS.fast.multiplier);
    return data.map((d, i) => ({
      ...d,
      // Compute overall economy-wide average for band display
      baselineAvg: Math.round((d.lowAutomated + d.middleAutomated + d.highAutomated) / 3),
      slowHigh: Math.max(slow[i].lowAutomated, slow[i].middleAutomated, slow[i].highAutomated),
      fastHigh: Math.max(fast[i].lowAutomated, fast[i].middleAutomated, fast[i].highAutomated),
      // Per-tier slow/fast bounds for the higher-income line (most visible)
      highSlow: slow[i].highAutomated,
      highFast: fast[i].highAutomated,
      middleSlow: slow[i].middleAutomated,
      middleFast: fast[i].middleAutomated,
      lowSlow: slow[i].lowAutomated,
      lowFast: fast[i].lowAutomated,
    }));
  }, [data]);

  // Get last data point values for inline labels
  const lastPoint = data[data.length - 1];

  return (
    <div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scenarioData} margin={{ top: 10, right: 100, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME_TIER_META.low.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={INCOME_TIER_META.low.color} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradMiddle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME_TIER_META.middle.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={INCOME_TIER_META.middle.color} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME_TIER_META.high.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={INCOME_TIER_META.high.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* Scenario uncertainty bands (slow-to-fast range) per tier */}
            <Area type="monotone" dataKey="highFast" stroke="none" fill={INCOME_TIER_META.high.color} fillOpacity={0.06} dot={false} activeDot={false} legendType="none" />
            <Area type="monotone" dataKey="highSlow" stroke="none" fill="#fff" fillOpacity={1} dot={false} activeDot={false} legendType="none" />
            <Area type="monotone" dataKey="middleFast" stroke="none" fill={INCOME_TIER_META.middle.color} fillOpacity={0.06} dot={false} activeDot={false} legendType="none" />
            <Area type="monotone" dataKey="middleSlow" stroke="none" fill="#fff" fillOpacity={1} dot={false} activeDot={false} legendType="none" />
            <Area type="monotone" dataKey="lowFast" stroke="none" fill={INCOME_TIER_META.low.color} fillOpacity={0.06} dot={false} activeDot={false} legendType="none" />
            <Area type="monotone" dataKey="lowSlow" stroke="none" fill="#fff" fillOpacity={1} dot={false} activeDot={false} legendType="none" />

            {/* Baseline lines */}
            <Area
              type="monotone"
              dataKey="lowAutomated"
              name="Lower income"
              stroke={INCOME_TIER_META.low.color}
              fill="url(#gradLow)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              label={({ x, y, index }: { x: number; y: number; index: number }) => {
                if (index !== scenarioData.length - 1) return <g />;
                return (
                  <text x={x + 8} y={y + 4} fontSize={11} fontWeight={600} fill={INCOME_TIER_META.low.color}>
                    Lower
                  </text>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="middleAutomated"
              name="Middle income"
              stroke={INCOME_TIER_META.middle.color}
              fill="url(#gradMiddle)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              label={({ x, y, index }: { x: number; y: number; index: number }) => {
                if (index !== scenarioData.length - 1) return <g />;
                return (
                  <text x={x + 8} y={y + 4} fontSize={11} fontWeight={600} fill={INCOME_TIER_META.middle.color}>
                    Middle
                  </text>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="highAutomated"
              name="Higher income"
              stroke={INCOME_TIER_META.high.color}
              fill="url(#gradHigh)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              label={({ x, y, index }: { x: number; y: number; index: number }) => {
                if (index !== scenarioData.length - 1) return <g />;
                return (
                  <text x={x + 8} y={y + 4} fontSize={11} fontWeight={600} fill={INCOME_TIER_META.high.color}>
                    Higher
                  </text>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-card">
        {(["low", "middle", "high"] as const).map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: INCOME_TIER_META[tier].color }}
            />
            <span className="text-xs text-[var(--muted)]">
              {INCOME_TIER_META[tier].label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-3">
        Solid lines show baseline cost crossover. The percentage of tasks within each income tier where
        AI compute is now cheaper than the human wage rate. Shaded bands show the slow-to-fast scenario
        range (0.5x to 1.5x cost decline rates). The widening bands reflect compounding uncertainty:
        by 2036, projections are highly sensitive to assumed cost trajectories. This measures economic
        incentive, not actual job loss. Real-world adoption is slowed by organizational inertia, regulation,
        demand elasticity, and complementarity effects.
      </p>
    </div>
  );
}
