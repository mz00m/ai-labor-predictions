"use client";

import {
  ComposedChart,
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
  yAxisMax?: number;
  yAxisMin?: number;
}

interface ChartDataPoint {
  date: number;
  dateStr: string;
  value?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  evidenceTier: EvidenceTier;
  sourceIds: string[];
  isPhantom?: boolean;
  trendValue?: number;
}

interface OverlayTooltipData {
  dateStr: string;
  direction: string;
  label: string;
  sourceIds: string[];
  evidenceTier: EvidenceTier;
}

function CustomTooltip({
  active,
  payload,
  sources,
  unit,
  overlays,
}: TooltipProps<number, string> & {
  sources: Source[];
  unit: string;
  overlays?: OverlayTooltipData[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as ChartDataPoint;
  if (!data) return null;

  // Find overlays matching this x-axis position
  const matchingOverlays = (overlays ?? []).filter(
    (o) => o.dateStr === data.dateStr
  );

  // If phantom point with no overlays, nothing to show
  if (data.isPhantom && matchingOverlays.length === 0) return null;

  const tierConfig = getTierConfig(data.evidenceTier);
  const pointSources = sources.filter((s) => data.sourceIds.includes(s.id));

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 max-w-xs shadow-sm">
      {/* Data point section (only for real points) */}
      {!data.isPhantom && data.value != null && (
        <>
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
            </div>
          )}
        </>
      )}

      {/* Overlay section */}
      {matchingOverlays.length > 0 && (
        <div className={!data.isPhantom && data.value != null ? "mt-2 border-t border-black/[0.06] pt-2" : ""}>
          {data.isPhantom && (
            <p className="text-[12px] font-medium text-[var(--foreground)] mb-1.5">
              {data.dateStr}
            </p>
          )}
          {matchingOverlays.map((o, i) => {
            const color = overlayColor(o.direction);
            const arrow =
              o.direction === "down"
                ? "\u2193"
                : o.direction === "up"
                  ? "\u2191"
                  : "\u2194";
            const oTierConfig = getTierConfig(o.evidenceTier);
            const overlaySources = sources.filter((s) =>
              o.sourceIds.includes(s.id)
            );
            return (
              <div key={`overlay-tip-${i}`} className={i > 0 ? "mt-2 border-t border-black/[0.06] pt-2" : ""}>
                <div className="flex items-start gap-1.5">
                  <span
                    className="text-[14px] font-bold leading-tight mt-px shrink-0"
                    style={{ color }}
                  >
                    {arrow}
                  </span>
                  <p className="text-[12px] leading-snug text-[var(--foreground)]">
                    {o.label}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: oTierConfig.color }}
                  />
                  <span className="text-[11px] text-[var(--muted)]">
                    {oTierConfig.label}
                  </span>
                </div>
                {overlaySources.length > 0 && (
                  <div className="mt-1">
                    {overlaySources.map((s) => (
                      <p key={s.id} className="text-[11px] text-[var(--accent)]">
                        {s.publisher}: {s.title.slice(0, 55)}
                        {s.title.length > 55 ? "..." : ""}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-[var(--muted)] mt-1.5 opacity-60">
        Click to view source ↓
      </p>
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
  yAxisMax = 50,
  yAxisMin = -5,
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
      evidenceTier: d.evidenceTier,
      sourceIds: d.sourceIds,
    }))
    .sort((a, b) => a.date - b.date);

  // Disambiguate duplicate dateStr values so the categorical x-axis has
  // unique categories.  Recharts' band scale silently drops duplicate keys,
  // which can cause ReferenceLine x-lookups to fail.
  const dateStrCount: Record<string, number> = {};
  const dateStrToUnique = new Map<number, string>(); // timestamp → unique label
  for (const pt of realPoints) {
    const n = (dateStrCount[pt.dateStr] ?? 0) + 1;
    dateStrCount[pt.dateStr] = n;
    if (n > 1) {
      const day = format(parseISO(filtered.find(
        (d) => parseISO(d.date).getTime() === pt.date
      )!.date), "d");
      pt.dateStr = `${pt.dateStr} (${day})`;
    }
    dateStrToUnique.set(pt.date, pt.dateStr);
  }

  const yMin = yAxisMin;
  const yMax = yAxisMax;

  // Process overlay bands (qualitative directional studies)
  const filteredOverlays = (overlays ?? []).filter((o) =>
    selectedTiers.includes(o.evidenceTier)
  );
  const overlayData = filteredOverlays.map((o) => {
    const ts = parseISO(o.date).getTime();
    const baseStr = format(parseISO(o.date), "MMM yyyy");
    // If a real data point already occupies this month, reuse its unique key
    // so the ReferenceLine x value matches the axis category exactly.
    const matchingReal = realPoints.find(
      (rp) => rp.dateStr === baseStr || rp.dateStr.startsWith(baseStr + " (")
    );
    return {
      date: ts,
      dateStr: dateStrToUnique.get(ts) ?? matchingReal?.dateStr ?? baseStr,
      direction: o.direction,
      label: o.label,
      sourceIds: o.sourceIds,
      evidenceTier: o.evidenceTier,
    };
  });

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
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    for (const d of chartData) {
      if (d.date >= minDate && d.date <= maxDate) {
        d.trendValue = slope * d.date + intercept;
      }
    }
  }

  if (compact) {
    return (
      <ResponsiveContainer width="100%" height={80}>
        <ComposedChart data={chartData}>
          {/* Hidden categorical axis so ReferenceLine can resolve x values */}
          <XAxis dataKey="dateStr" hide />
          {overlayData.map((o, i) => (
            <ReferenceLine
              key={`overlay-compact-${i}-${o.dateStr}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={16}
              strokeOpacity={0.15}
              ifOverflow="visible"
            />
          ))}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#5C61F6"
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
            allowDataOverflow
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
                overlays={overlayData}
              />
            }
          />
          {/* Zero baseline */}
          <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1} />
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
          {overlayData.map((o, i) => (
            <ReferenceLine
              key={`overlay-bar-${i}-${o.dateStr}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={24}
              strokeOpacity={0.22}
              ifOverflow="visible"
              onClick={() => onDotClick?.(o.sourceIds)}
              style={{ cursor: onDotClick ? "pointer" : undefined }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#5C61F6"
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
          {[...overlayData].sort((a, b) => b.date - a.date).map((o) => {
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
