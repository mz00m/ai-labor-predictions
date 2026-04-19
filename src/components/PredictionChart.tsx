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

  // Find overlays matching this x-axis position
  const matchingOverlays = (overlays ?? []).filter(
    (o) => o.dateStr === data.dateStr
  );

  // If phantom point with no overlays, nothing to show
  if (data.isPhantom && matchingOverlays.length === 0) return null;

  const tierConfig = getTierConfig(data.evidenceTier);
  const pointSources = sources.filter((s) => data.sourceIds.includes(s.id));

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-3.5 max-w-xs shadow-sm">
      {/* Data point section (only for real points) */}
      {!data.isPhantom && data.value != null && (
        <>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {data.displayDate}
          </p>
          {data.dataType === "projected" && (
            <span className="inline-block text-2xs font-medium text-white bg-accent/70 rounded px-1.5 py-0.5 mb-1">
              Projected / Forecast
            </span>
          )}
          <p className="text-heading-sm font-bold text-[var(--foreground)] stat-number">
            {data.value}
            {unit}
          </p>
          {data.confidenceLow != null && data.confidenceHigh != null && (
            <p className="text-xs text-[var(--muted)]">
              Range: {data.confidenceLow}
              {unit} to {data.confidenceHigh}
              {unit}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: tierConfig.color }}
            />
            <span className="text-xs text-[var(--muted)]">{tierConfig.label}</span>
          </div>
          {(data as ChartDataPoint & { metricType?: MetricType }).metricType && (
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-sm"
                style={{ backgroundColor: getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).color }}
              />
              <span className="text-xs text-[var(--muted)]">
                {getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).label}
              </span>
            </div>
          )}
          {pointSources.length > 0 && (
            <div className="mt-2 border-t border-card pt-1.5">
              {pointSources.map((s) => (
                <p key={s.id} className="text-xs text-[var(--accent-text)]">
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
        <div className={!data.isPhantom && data.value != null ? "mt-2 border-t border-card pt-2" : ""}>
          {data.isPhantom && (
            <p className="text-sm font-medium text-[var(--foreground)] mb-1.5">
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
              <div key={`overlay-tip-${i}`} className={i > 0 ? "mt-2 border-t border-card pt-2" : ""}>
                <div className="flex items-start gap-1.5">
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
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: oTierConfig.color }}
                  />
                  <span className="text-xs text-[var(--muted)]">
                    {oTierConfig.label}
                  </span>
                </div>
                {overlaySources.length > 0 && (
                  <div className="mt-1">
                    {overlaySources.map((s) => (
                      <p key={s.id} className="text-xs text-[var(--accent-text)]">
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

      <p className="text-2xs text-[var(--muted)] mt-1.5 opacity-60">
        Click to view source ↓
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
  // Collapse overlays on dense charts: show only 10 most recent by default
  const OVERLAY_COLLAPSE_THRESHOLD = 20;
  const OVERLAY_VISIBLE_COUNT = 10;
  const totalOverlayCount = (overlays ?? []).length;
  const [overlaysExpanded, setOverlaysExpanded] = useState(totalOverlayCount <= OVERLAY_COLLAPSE_THRESHOLD);

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

  // Disambiguate duplicate dateStr values so the categorical x-axis has
  // unique categories.  Recharts' band scale silently drops duplicate keys,
  // which can cause ReferenceLine x-lookups to fail.
  const usedLabels = new Set<string>();
  const dateStrToUnique = new Map<number, string>(); // timestamp → unique label
  for (const pt of realPoints) {
    if (usedLabels.has(pt.dateStr)) {
      const day = format(parseISO(filtered.find(
        (d) => parseISO(d.date).getTime() === pt.date
      )!.date), "d");
      let candidate = `${pt.dateStr} (${day})`;
      // If still not unique (same-date different-source), add letter suffix
      let suffix = 2;
      while (usedLabels.has(candidate)) {
        candidate = `${pt.dateStr} (${day}.${suffix})`;
        suffix++;
      }
      pt.dateStr = candidate;
    }
    usedLabels.add(pt.dateStr);
    dateStrToUnique.set(pt.date, pt.dateStr);
  }

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
  }).sort((a, b) => (directionOrder[a.direction] ?? 1) - (directionOrder[b.direction] ?? 1));

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
        displayDate: format(new Date(o.date), "MMM yyyy"),
        value: undefined,
        dataType: "observed",
        evidenceTier: o.evidenceTier,
        sourceIds: o.sourceIds,
        isPhantom: true,
      });
    }
  }

  // Skip target date phantom point — extending the axis to a far-future
  // target (e.g. 2030) creates a massive empty gap that distorts the chart.

  // Insert phantom quarter-boundary points to create an evenly-spaced
  // timeline axis. Only span the range of real data points (not the
  // target date, which would stretch the chart with years of empty space).
  const allPoints = [...realPoints, ...phantomPoints];
  const realDates = realPoints.filter((p) => p.value != null).map((p) => p.date);
  const dataMinTs = realDates.length > 0 ? Math.min(...realDates) : Math.min(...allPoints.map((p) => p.date));
  const dataMaxTs = realDates.length > 0 ? Math.max(...realDates) : Math.max(...allPoints.map((p) => p.date));
  const existingDateStrs = new Set(allPoints.map((p) => p.dateStr));

  const quarterBoundaries: ChartDataPoint[] = [];
  const quarterTickLabels: string[] = [];
  const startDate = new Date(dataMinTs);
  // Round down to quarter start
  const startQ = Math.floor(startDate.getMonth() / 3) * 3;
  const cursor = new Date(startDate.getFullYear(), startQ, 1);
  // Generate quarters only through one quarter past the last real data point
  const endTs = dataMaxTs + 90 * 24 * 60 * 60 * 1000;
  while (cursor.getTime() <= endTs) {
    const ts = cursor.getTime();
    const label = format(cursor, "MMM yyyy");
    quarterTickLabels.push(label);
    if (!existingDateStrs.has(label)) {
      existingDateStrs.add(label);
      quarterBoundaries.push({
        date: ts,
        dateStr: label,
        displayDate: label,
        value: undefined,
        dataType: "observed",
        evidenceTier: 1 as EvidenceTier,
        sourceIds: [],
        isPhantom: true,
      });
    } else {
      // Use the existing dateStr (might be disambiguated) for tick lookup
      const existing = allPoints.find(
        (p) => p.dateStr === label || p.dateStr.startsWith(label + " (")
      );
      if (existing) {
        quarterTickLabels[quarterTickLabels.length - 1] = existing.dateStr;
      }
    }
    cursor.setMonth(cursor.getMonth() + 3);
  }

  const chartData = [...allPoints, ...quarterBoundaries].sort(
    (a, b) => a.date - b.date
  );

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
          {/* Hidden categorical axis so ReferenceLine can resolve x values */}
          <XAxis dataKey="dateStr" hide />
          {(() => {
            const byDate = new Map<string, typeof overlayData>();
            for (const o of overlayData) {
              const group = byDate.get(o.dateStr) ?? [];
              group.push(o);
              byDate.set(o.dateStr, group);
            }
            return Array.from(byDate.entries()).map(([dateStr, group]) => (
              <ReferenceLine
                key={`overlay-compact-${dateStr}`}
                x={dateStr}
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
            dataKey="dateStr"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            padding={{ left: 30, right: 30 }}
            ticks={quarterTickLabels}
            tickFormatter={(dateStr: string) => {
              const base = dateStr.replace(/ \(.*\)$/, "");
              const parts = base.split(" ");
              if (parts.length < 2) return dateStr;
              const month = parts[0];
              const year = parts[1];
              const shortYear = year.slice(-2);
              const quarterMap: Record<string, string> = {
                Jan: "Q1", Feb: "Q1", Mar: "Q1",
                Apr: "Q2", May: "Q2", Jun: "Q2",
                Jul: "Q3", Aug: "Q3", Sep: "Q3",
                Oct: "Q4", Nov: "Q4", Dec: "Q4",
              };
              return `${quarterMap[month] ?? month} '${shortYear}`;
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
            // Group overlays by dateStr so overlapping bars don't blend to brown
            const byDate = new Map<string, typeof overlayData>();
            for (const o of overlayData) {
              const group = byDate.get(o.dateStr) ?? [];
              group.push(o);
              byDate.set(o.dateStr, group);
            }
            return Array.from(byDate.entries()).map(([dateStr, group]) => (
              <ReferenceLine
                key={`overlay-bar-${dateStr}`}
                x={dateStr}
                stroke={groupedOverlayColor(group.map((g) => g.direction))}
                strokeWidth={10}
                strokeOpacity={0.18}
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
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-3.5 max-w-xs shadow-sm">
            <p className="text-sm font-medium text-[var(--foreground)] mb-1.5">
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
                  <div className="flex items-start gap-1.5">
                    <span className="text-md font-bold leading-tight mt-px shrink-0" style={{ color }}>
                      {arrow}
                    </span>
                    <p className="text-sm leading-snug text-[var(--foreground)]">{o.label}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: oTierConfig.color }} />
                    <span className="text-xs text-[var(--muted)]">{oTierConfig.label}</span>
                  </div>
                  {overlaySources.length > 0 && (
                    <div className="mt-1">
                      {overlaySources.map((s) => (
                        <p key={s.id} className="text-xs text-[var(--accent-text)]">
                          {s.publisher}: {s.title.slice(0, 55)}
                          {s.title.length > 55 ? "..." : ""}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
            <p className="text-2xs text-[var(--muted)] mt-1.5 opacity-60">Click to view source ↓</p>
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
