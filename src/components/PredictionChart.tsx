"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { EvidenceTier, HistoricalDataPoint, Source } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";

interface PredictionChartProps {
  history: HistoricalDataPoint[];
  sources: Source[];
  selectedTiers: EvidenceTier[];
  unit: string;
  compact?: boolean;
  onDotClick?: (sourceIds: string[]) => void;
}

interface ChartDataPoint {
  date: number;
  dateStr: string;
  value: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  confidenceRange?: [number, number];
  evidenceTier: EvidenceTier;
  sourceIds: string[];
}

function CustomTooltip({
  active,
  payload,
  sources,
  unit,
}: TooltipProps<number, string> & { sources: Source[]; unit: string }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as ChartDataPoint;
  if (!data) return null;

  const tierConfig = getTierConfig(data.evidenceTier);
  const pointSources = sources.filter((s) => data.sourceIds.includes(s.id));

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 max-w-xs shadow-sm">
      <p className="text-[12px] font-medium text-[var(--foreground)]">
        {data.dateStr}
      </p>
      <p className="text-[20px] font-bold text-[var(--foreground)] stat-number">
        {data.value}
        {unit}
      </p>
      {data.confidenceLow != null && data.confidenceHigh != null && (
        <p className="text-[11px] text-[var(--muted)]">
          Range: {data.confidenceLow}
          {unit} — {data.confidenceHigh}
          {unit}
        </p>
      )}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: tierConfig.color }}
        />
        <span className="text-[11px] text-[var(--muted)]">{tierConfig.label}</span>
      </div>
      {pointSources.length > 0 && (
        <div className="mt-2 border-t border-black/[0.06] pt-1.5">
          {pointSources.map((s) => (
            <p key={s.id} className="text-[11px] text-[var(--accent)]">
              {s.publisher}: {s.title.slice(0, 55)}
              {s.title.length > 55 ? "..." : ""}
            </p>
          ))}
          <p className="text-[10px] text-[var(--muted)] mt-1.5 opacity-60">
            Click to view source ↓
          </p>
        </div>
      )}
    </div>
  );
}

export default function PredictionChart({
  history,
  sources,
  selectedTiers,
  unit,
  compact = false,
  onDotClick,
}: PredictionChartProps) {
  const filtered = history.filter((d) =>
    selectedTiers.includes(d.evidenceTier)
  );

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[14px] text-[var(--muted)]">
        No data points match the selected evidence tiers.
      </div>
    );
  }

  const chartData: ChartDataPoint[] = filtered
    .map((d) => ({
      date: parseISO(d.date).getTime(),
      dateStr: format(parseISO(d.date), "MMM yyyy"),
      value: d.value,
      confidenceLow: d.confidenceLow,
      confidenceHigh: d.confidenceHigh,
      confidenceRange:
        d.confidenceLow != null && d.confidenceHigh != null
          ? ([d.confidenceLow, d.confidenceHigh] as [number, number])
          : undefined,
      evidenceTier: d.evidenceTier,
      sourceIds: d.sourceIds,
    }))
    .sort((a, b) => a.date - b.date);

  const allValues = chartData.flatMap((d) => [
    d.value,
    d.confidenceLow ?? d.value,
    d.confidenceHigh ?? d.value,
  ]);
  const yMin = Math.floor(Math.min(...allValues) - 2);
  const yMax = Math.ceil(Math.max(...allValues) + 2);

  if (compact) {
    return (
      <ResponsiveContainer width="100%" height={80}>
        <ComposedChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        onClick={(state) => {
          if (onDotClick && state?.activePayload?.[0]?.payload) {
            const point = state.activePayload[0].payload as ChartDataPoint;
            onDotClick(point.sourceIds);
          }
        }}
        style={{ cursor: onDotClick ? "pointer" : undefined }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="dateStr"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}${unit}`}
        />
        <Tooltip
          content={
            <CustomTooltip
              sources={sources}
              unit={unit}
            />
          }
        />
        {chartData.some((d) => d.confidenceRange) && (
          <Area
            type="monotone"
            dataKey="confidenceRange"
            fill="#7c3aed"
            fillOpacity={0.08}
            stroke="none"
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#7c3aed"
          strokeWidth={2.5}
          dot={(props: Record<string, unknown>) => {
            const { cx, cy, payload } = props as {
              cx: number;
              cy: number;
              payload: ChartDataPoint;
            };
            const config = getTierConfig(payload.evidenceTier);
            return (
              <circle
                key={`dot-${payload.date}`}
                cx={cx}
                cy={cy}
                r={5}
                fill={config.color}
                stroke="white"
                strokeWidth={2}
                style={{ cursor: onDotClick ? "pointer" : undefined }}
                onClick={() => onDotClick?.(payload.sourceIds)}
              />
            );
          }}
          activeDot={(props: unknown) => {
            const { cx, cy, payload } = props as {
              cx: number;
              cy: number;
              payload: ChartDataPoint;
            };
            const config = getTierConfig(payload.evidenceTier);
            return (
              <circle
                key={`active-${payload.date}`}
                cx={cx}
                cy={cy}
                r={7}
                fill={config.color}
                stroke="white"
                strokeWidth={2}
                style={{ cursor: onDotClick ? "pointer" : undefined }}
                onClick={() => onDotClick?.(payload.sourceIds)}
              />
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
