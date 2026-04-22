"use client";

import { useState, useRef, useCallback } from "react";
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
import { format, parseISO } from "date-fns";
import { EvidenceTier, MetricType, HistoricalDataPoint, DirectionalOverlay, Source } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";
import { getMetricTypeConfig, METRIC_TYPE_CONFIGS } from "@/lib/metric-types";

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
  category?: string;
  showTrendLine?: boolean;
  /** Override chart height in pixels (default: 360 for normal, 80 for compact) */
  height?: number;
  /** Target date for projections - adds a labeled reference line at this year */
  targetDate?: string;
  /** Label for the chart section (shown above chart) */
  chartLabel?: string;
}

interface ChartDataPoint {
  date: number;
  dateStr: string;
  displayDate: string;
  value?: number;
  observedValue?: number;
  projectedValue?: number;
  dataType: "observed" | "projected";
  confidenceLow?: number;
  confidenceHigh?: number;
  confidenceBandBase?: number;
  confidenceBandWidth?: number;
  evidenceTier: EvidenceTier;
  metricType?: MetricType;
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

  // Pick the first non-null payload - when two Lines exist, Recharts may
  // return multiple entries.  We only need the underlying ChartDataPoint.
  const data = (payload.find((p) => p.payload)?.payload ?? payload[0]?.payload) as ChartDataPoint;
  if (!data) return null;

  // Find overlays matching this data point (same month/year)
  const matchingOverlays = (overlays ?? []).filter(
    (o) => o.dateStr === data.displayDate
  );

  // If phantom point with no overlays, nothing to show
  if (data.isPhantom && matchingOverlays.length === 0) return null;

  const tierConfig = getTierConfig(data.evidenceTier);
  const pointSources = sources.filter((s) => data.sourceIds.includes(s.id));

  return (
    <div
      className="bg-white rounded-xl p-4 max-w-[280px]"
      style={{ border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)" }}
    >
      {/* Data point section (only for real points) */}
      {!data.isPhantom && data.value != null && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            {data.displayDate}
          </p>
          {data.dataType === "projected" && (
            <span className="inline-block text-xs font-medium text-white bg-accent/70 rounded px-1.5 py-0.5 mb-1.5">
              Projected
            </span>
          )}
          <p className="text-heading-sm font-black text-[var(--foreground)] stat-number leading-none mb-2">
            {data.value}{unit}
          </p>
          {data.confidenceLow != null && data.confidenceHigh != null && (
            <p className="text-xs text-[var(--muted)] mb-1.5">
              Range: {data.confidenceLow}{unit}–{data.confidenceHigh}{unit}
            </p>
          )}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tierConfig.color }}
            />
            <span className="text-xs text-[var(--muted)]">{tierConfig.label}</span>
          </div>
          {(data as ChartDataPoint & { metricType?: MetricType }).metricType && (
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="inline-block w-2 h-2 rounded-sm shrink-0"
                style={{ backgroundColor: getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).color }}
              />
              <span className="text-xs text-[var(--muted)]">
                {getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).label}
              </span>
            </div>
          )}
          {pointSources.length > 0 && (
            <div className="border-t border-black/[0.07] pt-2 space-y-1.5">
              {pointSources.map((s) => (
                <div key={s.id}>
                  <p className="text-xs font-semibold text-[var(--foreground)]">{s.publisher}</p>
                  <p className="text-xs text-[var(--muted)] leading-snug mt-0.5">
                    {s.title.slice(0, 72)}{s.title.length > 72 ? "…" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Overlay section */}
      {matchingOverlays.length > 0 && (
        <div className={!data.isPhantom && data.value != null ? "mt-2.5 border-t border-black/[0.07] pt-2.5" : ""}>
          {data.isPhantom && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {data.displayDate}
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
              <div key={`overlay-tip-${i}`} className={i > 0 ? "mt-2 border-t border-black/[0.07] pt-2" : ""}>
                <div className="flex items-start gap-1.5 mb-1.5">
                  <span
                    className="text-md font-bold leading-tight mt-px shrink-0"
                    style={{ color }}
                  >
                    {arrow}
                  </span>
                  <p className="text-sm leading-snug text-[var(--foreground)]">
                    {o.label}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: oTierConfig.color }}
                  />
                  <span className="text-xs text-[var(--muted)]">
                    {oTierConfig.label}
                  </span>
                </div>
                {overlaySources.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {overlaySources.map((s) => (
                      <div key={s.id}>
                        <p className="text-xs font-semibold text-[var(--foreground)]">{s.publisher}</p>
                        <p className="text-xs text-[var(--muted)] leading-snug mt-0.5">
                          {s.title.slice(0, 72)}{s.title.length > 72 ? "…" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[var(--muted)] mt-2 opacity-50">
        Click to jump to source ↓
      </p>
    </div>
  );
}

/** Pick a single color for a group of overlays sharing the same date. */
function groupedOverlayColor(directions: string[]): string {
  const ups = directions.filter((d) => d === "up").length;
  const downs = directions.filter((d) => d === "down").length;
  // Pure positive / negative - use green / red
  if (ups > 0 && downs === 0) return "#22c55e";
  if (downs > 0 && ups === 0) return "#ef4444";
  // Mixed - dominant direction wins, neutral if tied
  if (ups > downs) return "#22c55e";
  if (downs > ups) return "#ef4444";
  return "#94a3b8"; // tied or all neutral
}

function overlayColor(direction: string) {
  return direction === "down"
    ? "#ef4444"   // red-500. Negative / risk signal
    : direction === "up"
      ? "#22c55e" // green-500. Positive / growth signal
      : "#94a3b8"; // slate-400. Neutral / mixed signal
}

interface DotShapeProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  metricType?: MetricType;
  stroke?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  keyPrefix?: string;
  date?: number;
}

/** Render a dot shape based on metricType. Falls back to circle with tier color. */
function renderDotShape(props: DotShapeProps): React.ReactElement {
  const {
    cx, cy, r, fill: fillColor, metricType,
    stroke: strokeColor = "white", strokeWidth = 2,
    style, onClick, keyPrefix = "dot", date = 0,
  } = props;
  const shape = metricType
    ? getMetricTypeConfig(metricType).shape
    : "circle";
  const key = `${keyPrefix}-${date}`;
  const commonProps = { style, onClick };

  switch (shape) {
    case "diamond":
      return (
        <g key={key} {...commonProps}>
          <polygon
            points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    case "square":
      return (
        <g key={key} {...commonProps}>
          <rect
            x={cx - r * 0.8}
            y={cy - r * 0.8}
            width={r * 1.6}
            height={r * 1.6}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    case "triangle":
      return (
        <g key={key} {...commonProps}>
          <polygon
            points={`${cx},${cy - r} ${cx + r},${cy + r * 0.7} ${cx - r},${cy + r * 0.7}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    case "star": {
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const outerAngle = (Math.PI / 2) + (2 * Math.PI * i) / 5;
        const innerAngle = outerAngle + Math.PI / 5;
        pts.push(`${cx + r * Math.cos(outerAngle)},${cy - r * Math.sin(outerAngle)}`);
        pts.push(`${cx + r * 0.45 * Math.cos(innerAngle)},${cy - r * 0.45 * Math.sin(innerAngle)}`);
      }
      return (
        <g key={key} {...commonProps}>
          <polygon
            points={pts.join(" ")}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    }
    case "circle":
    default:
      return (
        <circle
          key={key}
          cx={cx}
          cy={cy}
          r={r}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          {...commonProps}
        />
      );
  }
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
  category,
  showTrendLine = true,
  height,
  targetDate,
  chartLabel,
}: PredictionChartProps) {
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  // Parse targetDate into a timestamp for the reference line
  const targetDateTs = targetDate ? parseISO(targetDate).getTime() : null;
  const targetDateStr = targetDate ? format(parseISO(targetDate), "MMM yyyy") : null;
  const [hoverOverlay, setHoverOverlay] = useState<{
    overlay: OverlayTooltipData;
    x: number;
    y: number;
  } | null>(null);
  // Collapse overlays on dense charts: show only 25 most recent by default
  const OVERLAY_COLLAPSE_THRESHOLD = 25;
  const OVERLAY_VISIBLE_COUNT = 25;
  const totalOverlayCount = (overlays ?? []).length;
  const [overlaysExpanded, setOverlaysExpanded] = useState(true);

  const handleOverlayMouseEnter = useCallback(
    (overlay: OverlayTooltipData, e: React.MouseEvent) => {
      const rect = chartWrapperRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverOverlay({
          overlay,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

  const handleOverlayMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!hoverOverlay) return;
      const rect = chartWrapperRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverOverlay((prev) =>
          prev
            ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }
            : null
        );
      }
    },
    [hoverOverlay]
  );

  const handleOverlayMouseLeave = useCallback(() => {
    setHoverOverlay(null);
  }, []);

  const filtered = history.filter((d) =>
    selectedTiers.includes(d.evidenceTier)
  );

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-md text-[var(--muted)]">
        No data points match the selected evidence tiers.
      </div>
    );
  }

  const hasProjectedData = filtered.some((d) => d.dataType === "projected");

  const realPoints: ChartDataPoint[] = filtered
    .map((d) => {
      const dt = d.dataType ?? "observed";
      const val = d.value;
      const dateLabel = format(parseISO(d.date), "MMM yyyy");
      return {
        date: parseISO(d.date).getTime(),
        dateStr: dateLabel,
        displayDate: dateLabel,
        value: val,
        observedValue: dt === "observed" ? val : undefined,
        projectedValue: dt === "projected" ? val : undefined,
        dataType: dt,
        confidenceLow: d.confidenceLow,
        confidenceHigh: d.confidenceHigh,
        confidenceBandBase:
          d.confidenceLow != null && d.confidenceHigh != null
            ? d.confidenceLow
            : undefined,
        confidenceBandWidth:
          d.confidenceLow != null && d.confidenceHigh != null
            ? d.confidenceHigh - d.confidenceLow
            : undefined,
        evidenceTier: d.evidenceTier,
        metricType: d.metricType,
        sourceIds: d.sourceIds,
      };
    })
    .sort((a, b) => a.date - b.date);

  // Bridge point: connect the observed line to the projected line by giving the
  // last observed point (chronologically before the first projected point) a
  // projectedValue as well, so both Line segments share that connecting point.
  if (hasProjectedData) {
    const firstProjectedIdx = realPoints.findIndex((p) => p.dataType === "projected");
    if (firstProjectedIdx > 0) {
      // Find the last observed point before the first projected point
      for (let i = firstProjectedIdx - 1; i >= 0; i--) {
        if (realPoints[i].dataType === "observed" && realPoints[i].value != null) {
          realPoints[i].projectedValue = realPoints[i].value;
          break;
        }
      }
    }
  }

  // No need to disambiguate dateStr — we use numeric timestamps for the
  // x-axis, so duplicate labels don't cause issues.

  // Compute Y-axis domain: expand beyond hardcoded bounds if data would be clipped
  const dataValues = filtered.flatMap((h) => {
    const vals: number[] = [h.value];
    if (h.confidenceLow != null) vals.push(h.confidenceLow);
    if (h.confidenceHigh != null) vals.push(h.confidenceHigh);
    return vals;
  });
  const dataMin = dataValues.length > 0 ? Math.min(...dataValues) : yAxisMin;
  const dataMax = dataValues.length > 0 ? Math.max(...dataValues) : yAxisMax;
  const padding = Math.max((dataMax - dataMin) * 0.1, 2);
  const yMin = Math.min(yAxisMin, Math.floor(dataMin - padding));
  const yMax = Math.max(yAxisMax, Math.ceil(dataMax + padding));

  // Process overlay bands (qualitative directional studies)
  const allFilteredOverlays = (overlays ?? []).filter((o) =>
    selectedTiers.includes(o.evidenceTier)
  );
  // When collapsed, show only the N most recent overlays
  const filteredOverlays = overlaysExpanded
    ? allFilteredOverlays
    : allFilteredOverlays
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, OVERLAY_VISIBLE_COUNT)
        .sort((a, b) => a.date.localeCompare(b.date));
  const directionOrder: Record<string, number> = { down: 0, neutral: 1, up: 2 };
  const overlayData = filteredOverlays.map((o) => {
    const ts = parseISO(o.date).getTime();
    return {
      date: ts,
      dateStr: format(parseISO(o.date), "MMM yyyy"),
      direction: o.direction,
      label: o.label,
      sourceIds: o.sourceIds,
      evidenceTier: o.evidenceTier,
    };
  }).sort((a, b) => (directionOrder[a.direction] ?? 1) - (directionOrder[b.direction] ?? 1));

  // With a numeric time axis, no phantom points are needed — data points
  // are positioned by their actual timestamp.
  const chartData = [...realPoints].sort((a, b) => a.date - b.date);

  // Compute evenly-spaced quarterly tick timestamps for the X axis.
  const dataTimestamps = realPoints.filter((p) => p.value != null).map((p) => p.date);
  const dataMinTs = dataTimestamps.length > 0 ? Math.min(...dataTimestamps) : Date.now();
  const dataMaxTs = dataTimestamps.length > 0 ? Math.max(...dataTimestamps) : Date.now();
  const quarterTickTimestamps: number[] = [];
  {
    const startDate = new Date(dataMinTs);
    const startQ = Math.floor(startDate.getMonth() / 3) * 3;
    const cursor = new Date(startDate.getFullYear(), startQ, 1);
    while (cursor.getTime() <= dataMaxTs + 45 * 24 * 60 * 60 * 1000) {
      quarterTickTimestamps.push(cursor.getTime());
      cursor.setMonth(cursor.getMonth() + 3);
    }
  }

  // Linear regression trend line (least-squares on observed points only)
  const pointsWithValues = realPoints.filter((d) => d.value != null && d.dataType === "observed");
  if (showTrendLine && pointsWithValues.length >= 2) {
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
          {/* Hidden numeric time axis so ReferenceLine can resolve x values */}
          <XAxis dataKey="date" type="number" scale="time" domain={[dataMinTs, dataMaxTs]} hide />
          {(() => {
            const byDate = new Map<number, typeof overlayData>();
            for (const o of overlayData) {
              const group = byDate.get(o.date) ?? [];
              group.push(o);
              byDate.set(o.date, group);
            }
            return Array.from(byDate.entries()).map(([date, group]) => (
              <ReferenceLine
                key={`overlay-compact-${date}`}
                x={date}
                stroke={groupedOverlayColor(group.map((g) => g.direction))}
                strokeWidth={6}
                strokeOpacity={0.15}
                ifOverflow="visible"
              />
            ));
          })()}
          <Line
            type="monotone"
            dataKey="observedValue"
            stroke="#5C61F6"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          {hasProjectedData && (
            <Line
              type="monotone"
              dataKey="projectedValue"
              stroke="#5C61F6"
              strokeWidth={2}
              strokeDasharray="6 3"
              strokeOpacity={0.6}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // Determine which metric types are present in chart data
  const presentMetricTypes = Array.from(
    new Set(
      realPoints
        .filter((d) => d.metricType != null)
        .map((d) => d.metricType!)
    )
  );
  const hasConfidenceBands = chartData.some(
    (d) => d.confidenceBandBase != null && d.confidenceBandWidth != null
  );

  return (
    <div ref={chartWrapperRef} style={{ position: "relative" }}>
      <div>
      <ResponsiveContainer width="100%" height={height ?? 360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
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
          <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={[dataMinTs, dataMaxTs]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            padding={{ left: 30, right: 30 }}
            ticks={quarterTickTimestamps}
            tickFormatter={(ts: number) => {
              const d = new Date(ts);
              const q = Math.floor(d.getMonth() / 3) + 1;
              const shortYear = String(d.getFullYear()).slice(-2);
              return `Q${q} '${shortYear}`;
            }}
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
            cursor={false}
            allowEscapeViewBox={{ x: true, y: false }}
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
          {/* Target date: shown as annotation text in top-right when set,
              rather than a reference line that stretches the axis */}

          {/* Confidence band (stacked area trick: transparent base + visible width) */}
          {chartData.some((d) => d.confidenceBandBase != null && d.confidenceBandWidth != null) && (
            <>
              <Area
                type="monotone"
                dataKey="confidenceBandBase"
                stackId="confidence"
                fill="transparent"
                stroke="none"
                isAnimationActive={false}
                dot={false}
                activeDot={false}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="confidenceBandWidth"
                stackId="confidence"
                fill="#5C61F6"
                fillOpacity={0.22}
                stroke="none"
                isAnimationActive={false}
                dot={false}
                activeDot={false}
                connectNulls={false}
              />
            </>
          )}
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
              isAnimationActive={false}
            />
          )}
          {/* Overlay vertical bars - one per date, color from grouped direction */}
          {(() => {
            const byDate = new Map<number, typeof overlayData>();
            for (const o of overlayData) {
              const group = byDate.get(o.date) ?? [];
              group.push(o);
              byDate.set(o.date, group);
            }
            return Array.from(byDate.entries()).map(([date, group]) => (
              <ReferenceLine
                key={`overlay-bar-${date}`}
                x={date}
                stroke={groupedOverlayColor(group.map((g) => g.direction))}
                strokeWidth={10}
                strokeOpacity={0.24}
                ifOverflow="visible"
                onClick={() => onDotClick?.(group.flatMap((g) => g.sourceIds))}
                onMouseEnter={(e: React.MouseEvent) => handleOverlayMouseEnter(group[0], e)}
                onMouseMove={handleOverlayMouseMove}
                onMouseLeave={handleOverlayMouseLeave}
                style={{ cursor: onDotClick ? "pointer" : undefined }}
              />
            ));
          })()}
          {/* Observed data line (solid) */}
          <Line
            type="monotone"
            dataKey="observedValue"
            stroke="#5C61F6"
            strokeWidth={2.5}
            connectNulls
            isAnimationActive={false}
            dot={(props: Record<string, unknown>) => {
              const { cx, cy, payload } = props as {
                cx: number;
                cy: number;
                payload: ChartDataPoint;
              };
              if (payload.isPhantom || payload.observedValue == null) return <g key={`phantom-${payload.date}`} />;
              const fillColor = payload.metricType
                ? getMetricTypeConfig(payload.metricType).color
                : getTierConfig(payload.evidenceTier).color;
              return renderDotShape({
                cx, cy, r: 5, fill: fillColor, metricType: payload.metricType,
                style: { cursor: onDotClick ? "pointer" : undefined },
                onClick: () => onDotClick?.(payload.sourceIds),
                keyPrefix: "dot-obs", date: payload.date,
              });
            }}
            activeDot={(props: unknown) => {
              const { cx, cy, payload } = props as {
                cx: number;
                cy: number;
                payload: ChartDataPoint;
              };
              if (payload.isPhantom || payload.observedValue == null) return <g key={`phantom-active-${payload.date}`} />;
              const fillColor = payload.metricType
                ? getMetricTypeConfig(payload.metricType).color
                : getTierConfig(payload.evidenceTier).color;
              return renderDotShape({
                cx, cy, r: 7, fill: fillColor, metricType: payload.metricType,
                style: { cursor: onDotClick ? "pointer" : undefined },
                onClick: () => onDotClick?.(payload.sourceIds),
                keyPrefix: "active-obs", date: payload.date,
              });
            }}
          />
          {/* Projected data line (dashed) */}
          {hasProjectedData && (
            <Line
              type="monotone"
              dataKey="projectedValue"
              stroke="#5C61F6"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              strokeOpacity={0.7}
              connectNulls
              isAnimationActive={false}
              dot={(props: Record<string, unknown>) => {
                const { cx, cy, payload } = props as {
                  cx: number;
                  cy: number;
                  payload: ChartDataPoint;
                };
                // Skip dot on bridge points (they already have an observed dot)
                if (payload.isPhantom || payload.projectedValue == null || payload.dataType === "observed") return <g key={`phantom-proj-${payload.date}`} />;
                const fillColor = payload.metricType
                  ? getMetricTypeConfig(payload.metricType).color
                  : getTierConfig(payload.evidenceTier).color;
                const dotEl = renderDotShape({
                  cx, cy, r: 4, fill: fillColor, metricType: payload.metricType,
                  style: { cursor: onDotClick ? "pointer" : undefined },
                  onClick: () => onDotClick?.(payload.sourceIds),
                  keyPrefix: "dot-proj", date: payload.date,
                });
                // Value label above each projected dot
                const labelValue = payload.projectedValue != null
                  ? `${payload.projectedValue > 0 ? "" : ""}${payload.projectedValue}%`
                  : "";
                return (
                  <g key={`proj-group-${payload.date}`}>
                    {dotEl}
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill="#5C61F6"
                      fontSize={10}
                      fontWeight={600}
                      opacity={0.85}
                    >
                      {labelValue}
                    </text>
                  </g>
                );
              }}
              activeDot={(props: unknown) => {
                const { cx, cy, payload } = props as {
                  cx: number;
                  cy: number;
                  payload: ChartDataPoint;
                };
                if (payload.isPhantom || payload.projectedValue == null || payload.dataType === "observed") return <g key={`phantom-active-proj-${payload.date}`} />;
                const fillColor = payload.metricType
                  ? getMetricTypeConfig(payload.metricType).color
                  : getTierConfig(payload.evidenceTier).color;
                return renderDotShape({
                  cx, cy, r: 6, fill: fillColor, metricType: payload.metricType,
                  style: { cursor: onDotClick ? "pointer" : undefined },
                  onClick: () => onDotClick?.(payload.sourceIds),
                  keyPrefix: "active-proj", date: payload.date,
                });
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      </div>
      {/* Custom overlay tooltip - works at chart edges where Recharts tooltip doesn't activate */}
      {hoverOverlay && (
        <div
          style={{
            position: "absolute",
            left: Math.min(hoverOverlay.x + 12, (chartWrapperRef.current?.offsetWidth ?? 600) - 280),
            top: Math.max(hoverOverlay.y - 20, 0),
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-[280px]"
            style={{ border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              {hoverOverlay.overlay.dateStr}
            </p>
            {(() => {
              const o = hoverOverlay.overlay;
              const color = overlayColor(o.direction);
              const arrow = o.direction === "down" ? "\u2193" : o.direction === "up" ? "\u2191" : "\u2194";
              const oTierConfig = getTierConfig(o.evidenceTier);
              const overlaySources = sources.filter((s) => o.sourceIds.includes(s.id));
              return (
                <>
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <span className="text-md font-bold leading-tight mt-px shrink-0" style={{ color }}>
                      {arrow}
                    </span>
                    <p className="text-sm leading-snug text-[var(--foreground)]">{o.label}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: oTierConfig.color }} />
                    <span className="text-xs text-[var(--muted)]">{oTierConfig.label}</span>
                  </div>
                  {overlaySources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {overlaySources.map((s) => (
                        <div key={s.id}>
                          <p className="text-xs font-semibold text-[var(--foreground)]">{s.publisher}</p>
                          <p className="text-xs text-[var(--muted)] leading-snug mt-0.5">
                            {s.title.slice(0, 72)}{s.title.length > 72 ? "…" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
            <p className="text-xs text-[var(--muted)] mt-2 opacity-50">Click to jump to source ↓</p>
          </div>
        </div>
      )}
      {/* Chart legend - below chart */}
      <div className="flex items-center gap-4 mt-4 px-1 flex-wrap">
        {hasProjectedData && (
          <>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#5C61F6" strokeWidth="2.5" /></svg>
              <span className="text-xs text-[var(--muted)]">Observed data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#5C61F6" strokeWidth="2.5" strokeDasharray="6 3" strokeOpacity="0.7" /></svg>
              <span className="text-xs text-[var(--muted)]">Projected / Forecast (labeled with projected %)</span>
            </div>
          </>
        )}
        {hasConfidenceBands && (
          <div className="flex items-center gap-1.5">
            <svg width="16" height="10">
              <rect x="0" y="0" width="16" height="10" fill="#5C61F6" fillOpacity="0.22" rx="2" />
            </svg>
            <span className="text-xs text-[var(--muted)]">Confidence range</span>
          </div>
        )}
        {overlayData.length > 0 && (
          <>
            <div className="flex items-center gap-1.5">
              <svg width="6" height="10">
                <rect x="0" y="0" width="6" height="10" fill="#ef4444" fillOpacity="0.32" rx="1" />
              </svg>
              <span className="text-xs text-[var(--muted)]">Negative signal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="6" height="10">
                <rect x="0" y="0" width="6" height="10" fill="#22c55e" fillOpacity="0.32" rx="1" />
              </svg>
              <span className="text-xs text-[var(--muted)]">Positive signal</span>
            </div>
          </>
        )}
      </div>
      {/* Metric type legend (only when metricType tags are present) */}
      {presentMetricTypes.length > 0 && (
        <div className="flex items-center gap-3 mt-2 px-1 flex-wrap">
          <span className="text-2xs font-medium text-[var(--muted)] uppercase tracking-wider">
            Data type
          </span>
          {presentMetricTypes.map((mt) => {
            const cfg = getMetricTypeConfig(mt);
            return (
              <div key={mt} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="-6 -6 12 12">
                  {cfg.shape === "circle" && (
                    <circle r="4" fill={cfg.color} />
                  )}
                  {cfg.shape === "diamond" && (
                    <polygon points="0,-5 5,0 0,5 -5,0" fill={cfg.color} />
                  )}
                  {cfg.shape === "square" && (
                    <rect x="-4" y="-4" width="8" height="8" fill={cfg.color} />
                  )}
                  {cfg.shape === "triangle" && (
                    <polygon points="0,-5 5,4 -5,4" fill={cfg.color} />
                  )}
                  {cfg.shape === "star" && (
                    <polygon
                      points={Array.from({ length: 5 }, (_, i) => {
                        const outerAngle = (Math.PI / 2) + (2 * Math.PI * i) / 5;
                        const innerAngle = outerAngle + Math.PI / 5;
                        return `${5 * Math.cos(outerAngle)},${-5 * Math.sin(outerAngle)} ${2.25 * Math.cos(innerAngle)},${-2.25 * Math.sin(innerAngle)}`;
                      }).join(" ")}
                      fill={cfg.color}
                    />
                  )}
                </svg>
                <span className="text-xs text-[var(--muted)]">{cfg.shortLabel}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* Overlay expand/collapse toggle for dense charts */}
      {!compact && totalOverlayCount > OVERLAY_COLLAPSE_THRESHOLD && (
        <button
          onClick={() => setOverlaysExpanded(!overlaysExpanded)}
          className="mt-2 px-1 text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {overlaysExpanded
            ? `Collapse overlay signals (${totalOverlayCount} total)`
            : `Show all ${totalOverlayCount} overlay signals (${OVERLAY_VISIBLE_COUNT} most recent shown)`}
        </button>
      )}
    </div>
  );
}
