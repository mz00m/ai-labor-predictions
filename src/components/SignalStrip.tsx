"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { EvidenceTier } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SignalOverlay {
  date: string;
  direction: "up" | "down" | "neutral";
  label: string;
  sourceIds: string[];
  evidenceTier: EvidenceTier;
}

export interface SignalSource {
  id: string;
  title: string;
  publisher: string;
}

interface MonthGroup {
  monthKey: string;
  timestamp: number;
  dateLabel: string;
  ups: SignalOverlay[];
  downs: SignalOverlay[];
  neutrals: SignalOverlay[];
  all: SignalOverlay[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BLOCK = 18;
const GAP = 4;
const STEP = BLOCK + GAP;
const MAX_BLOCKS = 5;
const BASELINE_Y = 118; // 5 blocks * 22px + 8px headroom
const SVG_HEIGHT = BASELINE_Y + 18; // 18px for year labels below baseline

const C_UP = "#16a34a";
const C_DOWN = "#dc2626";
const C_NEUTRAL = "#94a3b8";

// ---------------------------------------------------------------------------
// SignalStrip
// ---------------------------------------------------------------------------

export default function SignalStrip({
  overlays,
  sources = [],
  minTs,
  maxTs,
  splitTs,
  paddingLeft = 0,
  paddingRight = 0,
  onGroupClick,
}: {
  overlays: SignalOverlay[];
  sources?: SignalSource[];
  minTs: number;
  maxTs: number;
  /** Timestamp at which observed data ends and projected begins */
  splitTs?: number;
  paddingLeft?: number;
  paddingRight?: number;
  onGroupClick?: (sourceIds: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [tooltip, setTooltip] = useState<{ group: MonthGroup; svgX: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Group overlays by calendar month
  const groups = useMemo<MonthGroup[]>(() => {
    const map = new Map<string, MonthGroup>();
    for (const o of overlays) {
      const d = parseISO(o.date);
      const key = format(d, "yyyy-MM");
      if (!map.has(key)) {
        map.set(key, {
          monthKey: key,
          timestamp: d.getTime(),
          dateLabel: format(d, "MMM ''yy"),
          ups: [], downs: [], neutrals: [], all: [],
        });
      }
      const g = map.get(key)!;
      g.all.push(o);
      if (o.direction === "up") g.ups.push(o);
      else if (o.direction === "down") g.downs.push(o);
      else g.neutrals.push(o);
    }
    return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [overlays]);

  const chartW = width - paddingLeft - paddingRight;
  const toX = (ts: number) =>
    paddingLeft + ((ts - minTs) / (maxTs - minTs)) * chartW;

  // Merge groups whose pixel positions are within STEP px of each other to
  // avoid the "wide block" artifact caused by adjacent months overlapping.
  const displayGroups = useMemo<MonthGroup[]>(() => {
    const result: MonthGroup[] = [];
    for (const g of groups) {
      const x = paddingLeft + ((g.timestamp - minTs) / (maxTs - minTs)) * (width - paddingLeft - paddingRight);
      if (x < paddingLeft - BLOCK || x > width - paddingRight + BLOCK) continue;
      const last = result[result.length - 1];
      const lastX = last ? paddingLeft + ((last.timestamp - minTs) / (maxTs - minTs)) * (width - paddingLeft - paddingRight) : -Infinity;
      if (last && x - lastX < STEP) {
        last.ups = [...last.ups, ...g.ups];
        last.downs = [...last.downs, ...g.downs];
        last.neutrals = [...last.neutrals, ...g.neutrals];
        last.all = [...last.all, ...g.all];
      } else {
        result.push({ ...g, ups: [...g.ups], downs: [...g.downs], neutrals: [...g.neutrals], all: [...g.all] });
      }
    }
    return result;
  }, [groups, width, paddingLeft, paddingRight, minTs, maxTs]);

  // Year tick marks
  const yearTicks = useMemo(() => {
    const ticks: { ts: number; label: string }[] = [];
    const startY = new Date(minTs).getFullYear();
    const endY = new Date(maxTs).getFullYear() + 1;
    for (let y = startY; y <= endY; y++) {
      const ts = new Date(y, 0, 1).getTime();
      ticks.push({ ts, label: String(y) });
    }
    return ticks;
  }, [minTs, maxTs]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg
        width={width}
        height={SVG_HEIGHT}
        style={{ overflow: "visible", display: "block" }}
      >
        {/* Baseline */}
        <line
          x1={paddingLeft}
          y1={BASELINE_Y}
          x2={width - paddingRight}
          y2={BASELINE_Y}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {/* Year tick marks */}
        {yearTicks.map((t) => {
          const x = toX(t.ts);
          if (x < paddingLeft - 1 || x > width - paddingRight + 1) return null;
          return (
            <g key={t.label}>
              <line x1={x} y1={BASELINE_Y} x2={x} y2={BASELINE_Y + 5} stroke="#d1d5db" strokeWidth={1} />
              <text
                x={x}
                y={BASELINE_Y + 14}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={9}
                fontFamily="system-ui, sans-serif"
              >
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Observed / Projected divider */}
        {splitTs != null && (() => {
          const sx = toX(splitTs);
          if (sx <= paddingLeft + 10 || sx >= width - paddingRight - 10) return null;
          return (
            <g key="split">
              <line
                x1={sx} y1={4} x2={sx} y2={BASELINE_Y}
                stroke="#d1d5db"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={sx - 6} y={8}
                textAnchor="end"
                fill="#9ca3af"
                fontSize={8}
                fontFamily="system-ui, sans-serif"
                letterSpacing="0.04em"
              >
                Observed
              </text>
              <text
                x={sx + 6} y={8}
                textAnchor="start"
                fill="#9ca3af"
                fontSize={8}
                fontFamily="system-ui, sans-serif"
                letterSpacing="0.04em"
              >
                Projected
              </text>
            </g>
          );
        })()}

        {/* Signal columns */}
        {displayGroups.map((g) => {
          const x = toX(g.timestamp);
          if (x < paddingLeft - BLOCK || x > width - paddingRight + BLOCK) return null;

          // Net cancellation logic
          const net = g.ups.length - g.downs.length;
          let color: string;
          let blockCount: number;

          if (net > 0) {
            color = C_UP;
            blockCount = Math.min(net, MAX_BLOCKS);
          } else if (net < 0) {
            color = C_DOWN;
            blockCount = Math.min(-net, MAX_BLOCKS);
          } else {
            // Balanced (equal ups/downs) or pure neutrals
            color = C_NEUTRAL;
            blockCount = Math.min(Math.max(g.neutrals.length, 1), MAX_BLOCKS);
          }

          const overflow = net !== 0 && Math.abs(net) > MAX_BLOCKS;
          const colSourceIds = g.all.flatMap((o) => o.sourceIds);

          return (
            <g
              key={g.monthKey}
              style={{ cursor: "pointer" }}
              onClick={() => onGroupClick?.(colSourceIds)}
              onMouseEnter={() => setTooltip({ group: g, svgX: x })}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Invisible wider hit target */}
              <rect
                x={x - 8}
                y={BASELINE_Y - MAX_BLOCKS * STEP - 4}
                width={16}
                height={MAX_BLOCKS * STEP + 8}
                fill="transparent"
              />
              {/* Pixel blocks */}
              {Array.from({ length: blockCount }).map((_, i) => (
                <rect
                  key={i}
                  x={x - BLOCK / 2}
                  y={BASELINE_Y - (i + 1) * STEP}
                  width={BLOCK}
                  height={BLOCK}
                  fill={color}
                  rx={1.5}
                  opacity={0.80}
                />
              ))}
              {/* +N overflow indicator */}
              {overflow && (
                <text
                  x={x}
                  y={BASELINE_Y - MAX_BLOCKS * STEP - 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize={8}
                  fontWeight={700}
                  fontFamily="system-ui, sans-serif"
                  opacity={0.8}
                >
                  +{Math.abs(net) - MAX_BLOCKS}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <SignalTooltip
          group={tooltip.group}
          svgX={tooltip.svgX}
          containerWidth={width}
          sources={sources}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

function SignalTooltip({
  group,
  svgX,
  containerWidth,
  sources,
}: {
  group: MonthGroup;
  svgX: number;
  containerWidth: number;
  sources: SignalSource[];
}) {
  const net = group.ups.length - group.downs.length;
  const netLabel = net > 0 ? `+${net} net positive` : net < 0 ? `${net} net negative` : "balanced";
  const netColor = net > 0 ? C_UP : net < 0 ? C_DOWN : C_NEUTRAL;

  const TOOLTIP_W = 272;
  const flipLeft = svgX + TOOLTIP_W + 16 > containerWidth;
  const left = flipLeft ? svgX - TOOLTIP_W - 6 : svgX + 10;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: -8,
        width: TOOLTIP_W,
        pointerEvents: "none",
        zIndex: 50,
        background: "white",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 12,
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
        padding: "12px 14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {group.dateLabel}
        </p>
        <span style={{ fontSize: 11, fontWeight: 700, color: netColor }}>
          {netLabel}
        </span>
      </div>

      {/* Signal breakdown */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 10, color: "#6b7280" }}>
        {group.ups.length > 0 && (
          <span style={{ color: C_UP, fontWeight: 600 }}>↑ {group.ups.length} positive</span>
        )}
        {group.downs.length > 0 && (
          <span style={{ color: C_DOWN, fontWeight: 600 }}>↓ {group.downs.length} negative</span>
        )}
        {group.neutrals.length > 0 && (
          <span style={{ color: C_NEUTRAL, fontWeight: 600 }}>↔ {group.neutrals.length} neutral</span>
        )}
      </div>

      {/* Individual signals */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 8 }}>
        {group.all.map((o, i) => {
          const dirColor = o.direction === "up" ? C_UP : o.direction === "down" ? C_DOWN : C_NEUTRAL;
          const arrow = o.direction === "up" ? "↑" : o.direction === "down" ? "↓" : "↔";
          const src = sources.find((s) => o.sourceIds.includes(s.id));
          return (
            <div key={i}>
              <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                <span style={{ color: dirColor, fontWeight: 700, fontSize: 12, lineHeight: 1.3, flexShrink: 0 }}>
                  {arrow}
                </span>
                <p style={{ fontSize: 11, color: "#1f2937", lineHeight: 1.4 }}>
                  {o.label}
                </p>
              </div>
              {src && (
                <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2, paddingLeft: 17 }}>
                  {src.publisher}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 8 }}>
        Click to jump to sources ↓
      </p>
    </div>
  );
}
