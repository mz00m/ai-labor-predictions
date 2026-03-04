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
}

interface ChartDataPoint {
  date: number;
  dateStr: string;
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

  // Pick the first non-null payload — when two Lines exist, Recharts may
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
    <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 max-w-xs shadow-sm">
      {/* Data point section (only for real points) */}
      {!data.isPhantom && data.value != null && (
        <>
          <p className="text-[12px] font-medium text-[var(--foreground)]">
            {data.dateStr}
          </p>
          {data.dataType === "projected" && (
            <span className="inline-block text-[10px] font-medium text-white bg-[#5C61F6]/70 rounded px-1.5 py-0.5 mb-1">
              Projected / Forecast
            </span>
          )}
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
          {(data as ChartDataPoint & { metricType?: MetricType }).metricType && (
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-sm"
                style={{ backgroundColor: getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).color }}
              />
              <span className="text-[11px] text-[var(--muted)]">
                {getMetricTypeConfig((data as ChartDataPoint & { metricType: MetricType }).metricType).label}
              </span>
            </div>
          )}
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

/** Render a dot shape based on metricType. Falls back to circle with tier color. */
function renderDotShape(
  cx: number,
  cy: number,
  r: number,
  fillColor: string,
  metricType?: MetricType,
  strokeColor = "white",
  strokeWidth = 2,
  style?: React.CSSProperties,
  onClick?: () => void,
  keyPrefix = "dot",
  date = 0,
): React.ReactElement {
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
}: PredictionChartProps) {
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [hoverOverlay, setHoverOverlay] = useState<{
    overlay: OverlayTooltipData;
    x: number;
    y: number;
  } | null>(null);

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
      <div className="flex items-center justify-center h-48 text-[14px] text-[var(--muted)]">
        No data points match the selected evidence tiers.
      </div>
    );
  }

  const hasProjectedData = filtered.some((d) => d.dataType === "projected");

  const realPoints: ChartDataPoint[] = filtered
    .map((d) => {
      const dt = d.dataType ?? "observed";
      const val = d.value;
      return {
        date: parseISO(d.date).getTime(),
        dateStr: format(parseISO(d.date), "MMM yyyy"),
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

  const yMin = yAxisMin;
  const yMax = yAxisMax;

  // Process overlay bands (qualitative directional studies)
  const filteredOverlays = (overlays ?? []).filter((o) =>
    selectedTiers.includes(o.evidenceTier)
  );
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
        value: undefined,
        dataType: "observed",
        evidenceTier: o.evidenceTier,
        sourceIds: o.sourceIds,
        isPhantom: true,
      });
    }
  }

  const chartData = [...realPoints, ...phantomPoints].sort(
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
          {overlayData.map((o, i) => (
            <ReferenceLine
              key={`overlay-compact-${i}-${o.dateStr}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={8}
              strokeOpacity={0.15}
              ifOverflow="visible"
            />
          ))}
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
      {/* Chart legend row */}
      <div className="flex items-center gap-4 mb-2 px-1 flex-wrap">
        {hasProjectedData && (
          <>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#5C61F6" strokeWidth="2.5" /></svg>
              <span className="text-[11px] text-[var(--muted)]">Observed data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#5C61F6" strokeWidth="2.5" strokeDasharray="6 3" strokeOpacity="0.7" /></svg>
              <span className="text-[11px] text-[var(--muted)]">Projected / Forecast</span>
            </div>
          </>
        )}
        {hasConfidenceBands && (
          <div className="flex items-center gap-1.5">
            <svg width="16" height="10">
              <rect x="0" y="0" width="16" height="10" fill="#5C61F6" fillOpacity="0.15" rx="2" />
            </svg>
            <span className="text-[11px] text-[var(--muted)]">Confidence range</span>
          </div>
        )}
        {category === "displacement" && yMin < 0 && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-[11px]" style={{ color: "#dc2626" }}>{"\u2191"}</span>
              <span className="text-[11px] text-[var(--muted)]">More displacement</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px]" style={{ color: "#16a34a" }}>{"\u2193"}</span>
              <span className="text-[11px] text-[var(--muted)]">Growth / Recovery</span>
            </div>
          </>
        )}
      </div>
      {/* Metric type legend (only when metricType tags are present) */}
      {presentMetricTypes.length > 0 && (
        <div className="flex items-center gap-3 mb-2 px-1 flex-wrap">
          <span className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">
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
                <span className="text-[11px] text-[var(--muted)]">{cfg.shortLabel}</span>
              </div>
            );
          })}
        </div>
      )}
      <ResponsiveContainer width="100%" height={360}>
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
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="dateStr"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            padding={{ left: 30, right: 30 }}
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
                fillOpacity={0.1}
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
          {/* Overlay vertical bars — rendered before the Line so they sit behind */}
          {overlayData.map((o, i) => (
            <ReferenceLine
              key={`overlay-bar-${i}-${o.dateStr}`}
              x={o.dateStr}
              stroke={overlayColor(o.direction)}
              strokeWidth={12}
              strokeOpacity={0.22}
              ifOverflow="visible"
              onClick={() => onDotClick?.(o.sourceIds)}
              onMouseEnter={(e: React.MouseEvent) => handleOverlayMouseEnter(o, e)}
              onMouseMove={handleOverlayMouseMove}
              onMouseLeave={handleOverlayMouseLeave}
              style={{ cursor: onDotClick ? "pointer" : undefined }}
            />
          ))}
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
              return renderDotShape(
                cx, cy, 5, fillColor, payload.metricType,
                "white", 2,
                { cursor: onDotClick ? "pointer" : undefined },
                () => onDotClick?.(payload.sourceIds),
                "dot-obs", payload.date,
              );
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
              return renderDotShape(
                cx, cy, 7, fillColor, payload.metricType,
                "white", 2,
                { cursor: onDotClick ? "pointer" : undefined },
                () => onDotClick?.(payload.sourceIds),
                "active-obs", payload.date,
              );
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
                return renderDotShape(
                  cx, cy, 4, fillColor, payload.metricType,
                  "white", 2,
                  { cursor: onDotClick ? "pointer" : undefined },
                  () => onDotClick?.(payload.sourceIds),
                  "dot-proj", payload.date,
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
                return renderDotShape(
                  cx, cy, 6, fillColor, payload.metricType,
                  "white", 2,
                  { cursor: onDotClick ? "pointer" : undefined },
                  () => onDotClick?.(payload.sourceIds),
                  "active-proj", payload.date,
                );
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {/* Custom overlay tooltip — works at chart edges where Recharts tooltip doesn't activate */}
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
          <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 max-w-xs shadow-sm">
            <p className="text-[12px] font-medium text-[var(--foreground)] mb-1.5">
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
                    <span className="text-[14px] font-bold leading-tight mt-px shrink-0" style={{ color }}>
                      {arrow}
                    </span>
                    <p className="text-[12px] leading-snug text-[var(--foreground)]">{o.label}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: oTierConfig.color }} />
                    <span className="text-[11px] text-[var(--muted)]">{oTierConfig.label}</span>
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
                </>
              );
            })()}
            <p className="text-[10px] text-[var(--muted)] mt-1.5 opacity-60">Click to view source ↓</p>
          </div>
        </div>
      )}
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
