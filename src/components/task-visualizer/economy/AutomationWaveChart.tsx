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
} from "@/data/economy-occupations";

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3">
      <p className="text-[12px] font-semibold text-[var(--foreground)] mb-1.5">{label}</p>
      {[...payload].reverse().map((p) => (
        <div key={p.dataKey} className="flex justify-between text-[11px] gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{p.value}% of tasks</span>
        </div>
      ))}
    </div>
  );
}

export default function AutomationWaveChart() {
  const data = useMemo(() => generateEconomyTimeline(2026, 2040), []);

  // Get last data point values for inline labels
  const lastPoint = data[data.length - 1];

  return (
    <div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 100, left: 5, bottom: 5 }}>
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
                if (index !== data.length - 1) return <g />;
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
                if (index !== data.length - 1) return <g />;
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
                if (index !== data.length - 1) return <g />;
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
      <div className="flex gap-4 mt-3 pt-3 border-t border-black/[0.06]">
        {(["low", "middle", "high"] as const).map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: INCOME_TIER_META[tier].color }}
            />
            <span className="text-[11px] text-[var(--muted)]">
              {INCOME_TIER_META[tier].label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        This chart shows the percentage of tasks within each income tier where it&apos;s now cheaper to use AI
        than to pay a human. A rising line means more tasks are crossing that cost threshold each year. This
        measures economic incentive, not actual job loss — real-world adoption is slowed by organizational
        inertia, regulation, and the fact that automating some tasks can make the remaining human tasks more valuable.
      </p>
    </div>
  );
}
