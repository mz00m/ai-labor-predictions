"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { AAITimeSeries } from "@/lib/pypi-types";

interface RatioTrendProps {
  aaiHistory: AAITimeSeries[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as AAITimeSeries;
  if (!data) return null;

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3 shadow-sm">
      <p className="text-[12px] font-medium text-[var(--foreground)] mb-1.5">
        {label}
      </p>
      <p className="text-[20px] font-bold text-[var(--foreground)] stat-number">
        {data.aai.toFixed(2)}x
      </p>
      <div className="mt-1.5 space-y-0.5 text-[11px] text-[var(--muted)]">
        <p>
          Tier 2+3 avg growth:{" "}
          <span className="font-mono font-medium text-[var(--foreground)]">
            {(data.tier2AvgGrowth * 100).toFixed(1)}%
          </span>
        </p>
        <p>
          Tier 1 avg growth:{" "}
          <span className="font-mono font-medium text-[var(--foreground)]">
            {(data.tier1AvgGrowth * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
}

export default function RatioTrend({ aaiHistory }: RatioTrendProps) {
  // Calculate Y axis bounds
  const values = aaiHistory.map((h) => h.aai);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 2);
  const yMin = Math.floor(minVal * 2) / 2;
  const yMax = Math.ceil(maxVal * 2) / 2;

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-4">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={aaiHistory}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="aaiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5C61F6" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#5C61F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v.toFixed(1)}x`}
            width={50}
          />
          <ReferenceLine
            y={1}
            stroke="#d1d5db"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            label={{
              value: "1.0x Baseline",
              position: "insideBottomRight",
              fontSize: 10,
              fill: "#9ca3af",
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="aai"
            fill="url(#aaiGradient)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="aai"
            stroke="#5C61F6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#5C61F6", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#5C61F6", stroke: "#fff", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-[var(--muted)] mt-3 text-center">
        AAI &gt; 1.0 = automation tooling growing faster than general AI adoption
        &nbsp;&middot;&nbsp; AAI &lt; 1.0 = AI broadening but automation not
        accelerating
      </p>
    </div>
  );
}
