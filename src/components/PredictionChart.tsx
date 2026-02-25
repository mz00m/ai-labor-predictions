"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { EvidenceTier, HistoricalDataPoint, DirectionalOverlay, Source } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";

interface PredictionChartProps {
  history: HistoricalDataPoint[];
  sources: Source[];
  selectedTiers: EvidenceTier[];
  unit: string;
  compact?: boolean;
  overlays?: DirectionalOverlay[];
  onDotClick?: (sourceIds: string[]) => void;
}

interface ChartDataPoint {
  date: number;
  dateStr: string;
  value?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  confidenceRange?: [number, number];
  evidenceTier: EvidenceTier;
  sourceIds: string[];
  isPhantom?: boolean;
  trendValue?: number;
}

function CustomTooltip({
  active,
  payload,
  sources,
  unit,
}: TooltipProps<number, string> & { sources: Source[]; unit: string }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as ChartDataPoint;
  if (!data || data.isPhantom) return null;

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

function overlayColor(direction: string) {
  return direction === "down"
    ? "#dc2626"
    : direction === "up"
      ? "#16a34a"
      : "#6b7280";
}

export default function PredictionChart({
  history,
  sources,
  selectedTiers,
  unit,
  compact = false,
  overlays,
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

  const realPoints: ChartDataPoint[] = filtered
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

  const allValues = realPoints.flatMap((d) => [
    d.value!,
    d.confidenceLow ?? d.value!,
    d.confidenceHigh ?? d.value!,
  ]);
  const yMin = Math.floor(Math.min(...allValues) - 2);
  const yMax = Math.ceil(Math.max(...allValues) + 2);

  // Process overlay bands (qualitative directional studies)
  const filteredOverlays = (overlays ?? []).filter((o) =>
    selectedTiers.includes(o.evidenceTier)
  );
  const overlayData = filteredOverlays.map((o) => ({
    date: parseISO(o.date).getTime(),
    dateStr: format(parseISO(o.date), "MMM yyyy"),
    direction: o.direction,
    label: o.label,
    sourceIds: o.sourceIds,
    evidenceTier: o.evidenceTier,
  }));

  // Create phantom data points for overlay dates that don't already exist
  // in the chart data, so the categorical x-axis recognizes them.
  // Deduplicate by dateStr to avoid duplicate x-axis categories.
  const usedDateStrs = new Set(realPoints.map((d) => d.dateStr));
  const phantomPoints: ChartDataPoint[] = [];
  for (const o of overlayData) {
    if (!usedDateStrs.has(o.dateStr)) {
      usedDateStrs.add(o.dateStr);
      phantomPoints.push({
        date: o.date,
        dateStr: o.dateStr,
        value: undefined,
        evidenceTier: o.evidenceTier,
        sourceIds: o.sourceIds,
        isPhantom: true,
      });
    }
  }

  const chartData = [...realPoints, ...phantomPoints].sort(
    (a, b) => a.date - b.date
  );

  // Linear regression trend line (least-squares on real points)
  const pointsWithValues = realPoints.filter((d) => d.value != null);
  if (pointsWithValues.length >= 2) {
    const n = pointsWithValues.length;
    const dates = pointsWithValues.map((d) => d.date);
    const values = pointsWithValues.map((d) => d.value!);
    const xMean = dates.reduce((s, v) => s + v, 0) / n;
    const yMean = values.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (dates[i] - xMean) * (values[i] - yMean);
      den += (dates[i] - xMean) ** 2;
    }
    const slope = den !== 0 ? num / den : 0;
    const intercept = yMean - slope * xMean;
    for (const d of chartData) {
      d.trendValue = slope * d.date + intercept;
    }
  }

  if (compact) {
    return (
      <ResponsiveContainer width="100%" height={80}>
        <ComposedChart data={chartData}>
          {overlayData.map((o) => (
            <ReferenceLine
              key={`overlay-compact-${o.dateStr}-${o.label.slice(0, 20)}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={16}
              strokeOpacity={0.15}
            />
          ))}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onClick={(state) => {
            if (onDotClick && state?.activePayload?.[0]?.payload) {
              const point = state.activePayload[0].payload as ChartDataPoint;
              if (!point.isPhantom) {
                onDotClick(point.sourceIds);
              }
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
          {/* Linear trend line */}
          {chartData.some((d) => d.trendValue != null) && (
            <Line
              type="linear"
              dataKey="trendValue"
              stroke="#9ca3af"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              activeDot={false}
              connectNulls
            />
          )}
          {/* Overlay vertical bars — rendered before the Line so they sit behind */}
          {overlayData.map((o) => (
            <ReferenceLine
              key={`overlay-bar-${o.dateStr}-${o.label.slice(0, 20)}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={24}
              strokeOpacity={0.22}
              onClick={() => onDotClick?.(o.sourceIds)}
              style={{ cursor: onDotClick ? "pointer" : undefined }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={2.5}
            connectNulls
            dot={(props: Record<string, unknown>) => {
              const { cx, cy, payload } = props as {
                cx: number;
                cy: number;
                payload: ChartDataPoint;
              };
              if (payload.isPhantom || payload.value == null) return <g key={`phantom-${payload.date}`} />;
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
              if (payload.isPhantom || payload.value == null) return <g key={`phantom-active-${payload.date}`} />;
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
      {overlayData.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5 px-1">
          <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">
            Additional context
          </p>
          {overlayData.map((o) => {
            const color = overlayColor(o.direction);
            const arrow =
              o.direction === "down"
                ? "\u2193"
                : o.direction === "up"
                  ? "\u2191"
                  : "\u2194";
            return (
              <button
                key={`overlay-${o.dateStr}-${o.label.slice(0, 20)}`}
                className="flex items-start gap-2 text-left rounded-md px-2 py-1.5 hover:bg-black/[0.03] transition-colors"
                onClick={() => onDotClick?.(o.sourceIds)}
              >
                <span
                  className="text-[13px] font-bold leading-tight mt-px shrink-0"
                  style={{ color }}
                >
                  {arrow}
                </span>
                <span className="text-[12px] leading-snug text-[var(--foreground)]">
                  <span className="text-[var(--muted)]">{o.dateStr}</span>
                  {" \u2014 "}
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
