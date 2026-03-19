"use client";

import { useMemo, useState, useCallback } from "react";
import {
  DIMENSION_META,
  type DimensionKey,
  type ScoredOccupation,
} from "@/lib/composite-risk";

interface Props {
  data: ScoredOccupation[];
  activeDimension: DimensionKey;
  onSelect: (occ: ScoredOccupation) => void;
  selected: ScoredOccupation | null;
}

interface TreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
  occ: ScoredOccupation;
}

/**
 * Squarified treemap layout algorithm.
 * Attempts to make rectangles as close to square as possible.
 */
function squarify(
  items: ScoredOccupation[],
  x: number,
  y: number,
  w: number,
  h: number
): TreeRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ x, y, w, h, occ: items[0] }];
  }

  const totalArea = w * h;
  const totalValue = items.reduce((s, d) => s + d.group.employment, 0);

  // Sort by employment descending for better squarification
  const sorted = [...items].sort(
    (a, b) => b.group.employment - a.group.employment
  );

  const results: TreeRect[] = [];
  let remaining = [...sorted];
  let cx = x,
    cy = y,
    cw = w,
    ch = h;

  while (remaining.length > 0) {
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    const remainingValue = remaining.reduce(
      (s, d) => s + d.group.employment,
      0
    );
    const remainingArea = cw * ch;

    // Find best row
    let row: ScoredOccupation[] = [];
    let bestWorst = Infinity;

    for (let i = 1; i <= remaining.length; i++) {
      const candidate = remaining.slice(0, i);
      const rowValue = candidate.reduce(
        (s, d) => s + d.group.employment,
        0
      );
      const rowArea = (rowValue / remainingValue) * remainingArea;
      const rowSide = rowArea / side;

      let worstRatio = 0;
      for (const item of candidate) {
        const itemArea = (item.group.employment / remainingValue) * remainingArea;
        const itemSide = itemArea / rowSide;
        const ratio = Math.max(rowSide / itemSide, itemSide / rowSide);
        worstRatio = Math.max(worstRatio, ratio);
      }

      if (worstRatio <= bestWorst) {
        bestWorst = worstRatio;
        row = candidate;
      } else {
        break;
      }
    }

    // Lay out the row
    const rowValue = row.reduce((s, d) => s + d.group.employment, 0);
    const rowFraction = rowValue / remainingValue;

    if (isWide) {
      const rowWidth = cw * rowFraction;
      let ry = cy;
      for (const item of row) {
        const itemFraction = item.group.employment / rowValue;
        const itemHeight = ch * itemFraction;
        results.push({ x: cx, y: ry, w: rowWidth, h: itemHeight, occ: item });
        ry += itemHeight;
      }
      cx += rowWidth;
      cw -= rowWidth;
    } else {
      const rowHeight = ch * rowFraction;
      let rx = cx;
      for (const item of row) {
        const itemFraction = item.group.employment / rowValue;
        const itemWidth = cw * itemFraction;
        results.push({
          x: rx,
          y: cy,
          w: itemWidth,
          h: rowHeight,
          occ: item,
        });
        rx += itemWidth;
      }
      cy += rowHeight;
      ch -= rowHeight;
    }

    remaining = remaining.slice(row.length);
  }

  return results;
}

function interpolateColor(
  value: number,
  max: number,
  colorScale: [string, string],
  isPressure: boolean
): string {
  const t = Math.max(0, Math.min(1, value / max));
  // For pressure dimensions, high value = red. For absorption, high value = green.
  // The color scales are already set appropriately in DIMENSION_META.
  const [startHex, endHex] = colorScale;

  const parseHex = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };

  const start = parseHex(startHex);
  const end = parseHex(endHex);
  const r = Math.round(start[0] + (end[0] - start[0]) * t);
  const g = Math.round(start[1] + (end[1] - start[1]) * t);
  const b = Math.round(start[2] + (end[2] - start[2]) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function EnhancedTreemap({
  data,
  activeDimension,
  onSelect,
  selected,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    occ: ScoredOccupation;
  } | null>(null);

  const WIDTH = 700;
  const HEIGHT = 420;

  const rects = useMemo(
    () => squarify(data, 0, 0, WIDTH, HEIGHT),
    [data]
  );

  const dimMeta = DIMENSION_META[activeDimension];

  const handleMouseEnter = useCallback(
    (rect: TreeRect, e: React.MouseEvent) => {
      setHoveredId(rect.occ.group.id);
      setTooltipInfo({ x: rect.x + rect.w / 2, y: rect.y, occ: rect.occ });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setTooltipInfo(null);
  }, []);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto rounded-lg border border-black/[0.06] bg-white"
        style={{ maxHeight: "480px" }}
      >
        {rects.map((rect) => {
          const score = rect.occ.scores[activeDimension];
          const color = interpolateColor(score, 10, dimMeta.colorScale, dimMeta.isPressure);
          const isHovered = hoveredId === rect.occ.group.id;
          const isSelected = selected?.group.id === rect.occ.group.id;
          const showLabel = rect.w > 50 && rect.h > 30;
          const showScore = rect.w > 70 && rect.h > 45;

          return (
            <g
              key={rect.occ.group.id}
              onClick={() => onSelect(rect.occ)}
              onMouseEnter={(e) => handleMouseEnter(rect, e)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer"
            >
              <rect
                x={rect.x + 1}
                y={rect.y + 1}
                width={Math.max(0, rect.w - 2)}
                height={Math.max(0, rect.h - 2)}
                rx={3}
                fill={color}
                stroke={
                  isSelected
                    ? "var(--accent)"
                    : isHovered
                      ? "#1a1a1a"
                      : "white"
                }
                strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 1}
                opacity={
                  hoveredId && !isHovered && !isSelected ? 0.6 : 1
                }
                style={{ transition: "opacity 0.15s, stroke 0.15s" }}
              />
              {showLabel && (
                <>
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 - (showScore ? 6 : 0)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: Math.min(12, Math.max(8, rect.w / 10)),
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: 600,
                      fill: score > 6 && dimMeta.isPressure ? "white" : "#1a1a1a",
                      fillOpacity: 0.9,
                    }}
                  >
                    {rect.occ.group.shortTitle}
                  </text>
                  {showScore && (
                    <text
                      x={rect.x + rect.w / 2}
                      y={rect.y + rect.h / 2 + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none select-none"
                      style={{
                        fontSize: Math.min(11, Math.max(8, rect.w / 12)),
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 500,
                        fill:
                          score > 6 && dimMeta.isPressure
                            ? "rgba(255,255,255,0.8)"
                            : "rgba(0,0,0,0.5)",
                      }}
                    >
                      {score.toFixed(1)}
                    </text>
                  )}
                </>
              )}
              {/* Employment label for large rects */}
              {rect.w > 90 && rect.h > 60 && (
                <text
                  x={rect.x + rect.w / 2}
                  y={rect.y + rect.h / 2 + 24}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  style={{
                    fontSize: 8,
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 400,
                    fill:
                      score > 6 && dimMeta.isPressure
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.35)",
                  }}
                >
                  {(rect.occ.group.employment / 1000).toFixed(1)}M workers
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          className="absolute pointer-events-none z-10 bg-white border border-black/[0.1] rounded-lg shadow-lg px-3 py-2 text-left"
          style={{
            left: `${(tooltipInfo.x / WIDTH) * 100}%`,
            top: `${(tooltipInfo.y / HEIGHT) * 100}%`,
            transform: "translate(-50%, -100%) translateY(-8px)",
            maxWidth: "260px",
          }}
        >
          <p className="text-[13px] font-semibold text-[var(--foreground)] mb-0.5">
            {tooltipInfo.occ.group.title}
          </p>
          <p className="text-[11px] text-[var(--muted)] mb-1">
            {tooltipInfo.occ.group.employment.toLocaleString()}K workers |{" "}
            ${tooltipInfo.occ.group.medianWageAnnual.toLocaleString()}/yr
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: interpolateColor(
                  tooltipInfo.occ.scores[activeDimension],
                  10,
                  dimMeta.colorScale,
                  dimMeta.isPressure
                ),
              }}
            />
            <span className="text-[12px] font-medium text-[var(--foreground)]">
              {dimMeta.shortLabel}:{" "}
              {tooltipInfo.occ.scores[activeDimension].toFixed(1)}/10
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-1">
            Net risk: {tooltipInfo.occ.scores.netRisk.toFixed(1)}/10
          </p>
        </div>
      )}
    </div>
  );
}
