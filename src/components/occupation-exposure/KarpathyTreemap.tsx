"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  DIMENSION_META,
  type DimensionKey,
  type ScoredKarpathyOccupation,
} from "@/lib/karpathy-scoring";

interface Props {
  data: ScoredKarpathyOccupation[];
  activeDimension: DimensionKey;
  onSelect: (occ: ScoredKarpathyOccupation) => void;
}

interface TreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
  occ: ScoredKarpathyOccupation;
}

/* ── Color helpers (adapted from Karpathy's approach) ── */

function boostContrast(t: number, power: number = 1.8): number {
  return Math.pow(t, power);
}

function greenRedCSS(t: number): string {
  // t: 0 = green (safe), 1 = red (risk)
  const boosted = boostContrast(t);
  // Green: hsl(140, 60%, 35%) → Red: hsl(0, 65%, 45%)
  const h = 140 - boosted * 140;
  const s = 60 + boosted * 5;
  const l = 35 + boosted * 10;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function greenRedReverse(t: number): string {
  // For absorption dims: 0 = red (bad), 1 = green (good)
  return greenRedCSS(1 - t);
}

function getColor(score: number, dim: DimensionKey): string {
  const t = Math.max(0, Math.min(1, score / 10));
  if (dim === "adaptability" || dim === "demandElasticity" || dim === "complementarity") {
    return greenRedReverse(t); // high = green (good for workers)
  }
  return greenRedCSS(t); // high = red (bad for workers)
}

function textColor(score: number, dim: DimensionKey): string {
  const t = Math.max(0, Math.min(1, score / 10));
  // High exposure/risk = light text; high absorption = dark text on green
  if (dim === "adaptability" || dim === "demandElasticity" || dim === "complementarity") {
    return t < 0.4 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)";
  }
  return t > 0.5 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)";
}

/* ── Squarified treemap algorithm ── */

function squarify(
  items: ScoredKarpathyOccupation[],
  x: number,
  y: number,
  w: number,
  h: number
): TreeRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ x, y, w, h, occ: items[0] }];
  }

  const sorted = [...items].sort(
    (a, b) => (b.raw.jobs || 0) - (a.raw.jobs || 0)
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
    const remainingValue = remaining.reduce((s, d) => s + (d.raw.jobs || 0), 0);
    const remainingArea = cw * ch;

    let row: ScoredKarpathyOccupation[] = [];
    let bestWorst = Infinity;

    for (let i = 1; i <= remaining.length; i++) {
      const candidate = remaining.slice(0, i);
      const rowValue = candidate.reduce((s, d) => s + (d.raw.jobs || 0), 0);
      const rowArea = (rowValue / remainingValue) * remainingArea;
      const rowSide = rowArea / side;

      let worstRatio = 0;
      for (const item of candidate) {
        const itemArea =
          ((item.raw.jobs || 0) / remainingValue) * remainingArea;
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

    const rowValue = row.reduce((s, d) => s + (d.raw.jobs || 0), 0);
    const rowFraction = rowValue / remainingValue;

    if (isWide) {
      const rowWidth = cw * rowFraction;
      let ry = cy;
      for (const item of row) {
        const itemFraction = (item.raw.jobs || 0) / rowValue;
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
        const itemFraction = (item.raw.jobs || 0) / rowValue;
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

/* ── Canvas treemap component ── */

export default function KarpathyTreemap({
  data,
  activeDimension,
  onSelect,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 700 });
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    occ: ScoredKarpathyOccupation;
  } | null>(null);

  const rects = useMemo(
    () => squarify(data, 0, 0, size.w, size.h),
    [data, size.w, size.h]
  );

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = Math.floor(entry.contentRect.width);
        const h = Math.max(500, Math.min(800, Math.floor(w * 0.55)));
        setSize({ w, h });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Dark background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, size.w, size.h);

    const gap = 1.5;

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const score = rect.occ.scores[activeDimension];
      const isHovered = i === hoveredIdx;

      // Fill
      ctx.fillStyle = getColor(score, activeDimension);
      ctx.globalAlpha = isHovered ? 1 : hoveredIdx >= 0 ? 0.5 : 0.85;
      ctx.fillRect(rect.x + gap, rect.y + gap, rect.w - gap * 2, rect.h - gap * 2);
      ctx.globalAlpha = 1;

      // Hover border
      if (isHovered) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          rect.x + gap,
          rect.y + gap,
          rect.w - gap * 2,
          rect.h - gap * 2
        );
      }

      // Labels
      const tc = textColor(score, activeDimension);
      if (rect.w > 55 && rect.h > 22) {
        const fontSize = Math.min(13, Math.max(8, rect.w / 12));
        ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = tc;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Truncate title to fit
        let title = rect.occ.raw.title;
        const maxChars = Math.floor(rect.w / (fontSize * 0.55));
        if (title.length > maxChars) {
          title = title.substring(0, maxChars - 1) + "\u2026";
        }

        const cy = rect.y + rect.h / 2;
        const cx = rect.x + rect.w / 2;

        if (rect.h > 40) {
          ctx.fillText(title, cx, cy - 7);
          // Score
          ctx.font = `500 ${Math.max(8, fontSize - 2)}px 'DM Mono', monospace`;
          ctx.globalAlpha = 0.7;
          ctx.fillText(score.toFixed(1), cx, cy + 9);
          ctx.globalAlpha = 1;
        } else {
          ctx.fillText(title, cx, cy);
        }
      }
    }
  }, [rects, activeDimension, hoveredIdx, size]);

  // Hit test
  const hitTest = useCallback(
    (mx: number, my: number): number => {
      for (let i = rects.length - 1; i >= 0; i--) {
        const r = rects[i];
        if (mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h) {
          return i;
        }
      }
      return -1;
    },
    [rects]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = size.w / rect.width;
      const scaleY = size.h / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const idx = hitTest(mx, my);
      setHoveredIdx(idx);

      if (idx >= 0) {
        const r = rects[idx];
        setTooltipInfo({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          occ: r.occ,
        });
      } else {
        setTooltipInfo(null);
      }
    },
    [hitTest, rects, size]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = size.w / rect.width;
      const scaleY = size.h / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      const idx = hitTest(mx, my);
      if (idx >= 0) {
        onSelect(rects[idx].occ);
      }
    },
    [hitTest, rects, onSelect, size]
  );

  const dimMeta = DIMENSION_META[activeDimension];

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg cursor-pointer"
        style={{ height: `${size.h}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredIdx(-1);
          setTooltipInfo(null);
        }}
        onClick={handleClick}
      />

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          className="absolute pointer-events-none z-20 bg-[#1a1a24] border border-white/[0.15] rounded-lg shadow-xl px-4 py-3 text-left"
          style={{
            left: `${tooltipInfo.x}px`,
            top: `${tooltipInfo.y}px`,
            transform: "translate(-50%, -100%) translateY(-12px)",
            maxWidth: "320px",
          }}
        >
          <p className="text-[14px] font-semibold text-white mb-0.5">
            {tooltipInfo.occ.raw.title}
          </p>
          <p className="text-[11px] text-white/60 mb-2">
            {tooltipInfo.occ.raw.jobs
              ? (tooltipInfo.occ.raw.jobs / 1000).toFixed(0) + "K"
              : "N/A"}{" "}
            workers
            {tooltipInfo.occ.raw.pay
              ? ` | $${(tooltipInfo.occ.raw.pay / 1000).toFixed(0)}K/yr`
              : ""}
            {tooltipInfo.occ.raw.outlook !== null
              ? ` | ${tooltipInfo.occ.raw.outlook > 0 ? "+" : ""}${tooltipInfo.occ.raw.outlook}% outlook`
              : ""}
          </p>

          {/* All 5 dimension scores */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            {(
              [
                "technicalExposure",
                "adoptionSpeed",
                "adaptability",
                "demandElasticity",
                "complementarity",
              ] as DimensionKey[]
            ).map((key) => {
              const val = tooltipInfo.occ.scores[key];
              const meta = DIMENSION_META[key];
              const isActive = key === activeDimension;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-1.5 ${isActive ? "text-white font-medium" : "text-white/50"}`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: getColor(val, key) }}
                  />
                  <span>
                    {meta.shortLabel}: {val.toFixed(1)}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-1.5 text-white font-medium col-span-2 mt-0.5 pt-1 border-t border-white/10">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: getColor(
                    tooltipInfo.occ.scores.netRisk,
                    "netRisk"
                  ),
                }}
              />
              <span>
                Net Risk: {tooltipInfo.occ.scores.netRisk.toFixed(1)}/10
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend bar */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: getColor(0, activeDimension) }}
          />
          {dimMeta.isPressure ? "Low risk" : "Low"}
        </span>
        <span className="font-medium text-white/70">
          {dimMeta.label} — {data.length} occupations, {(data.reduce((s, d) => s + (d.raw.jobs || 0), 0) / 1000000).toFixed(0)}M workers
        </span>
        <span className="flex items-center gap-1.5">
          {dimMeta.isPressure ? "High risk" : "High"}
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: getColor(10, activeDimension) }}
          />
        </span>
      </div>
    </div>
  );
}
