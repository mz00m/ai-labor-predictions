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

interface OccRect {
  x: number;
  y: number;
  w: number;
  h: number;
  occ: ScoredKarpathyOccupation;
  category: string;
}

interface CatRect {
  x: number;
  y: number;
  w: number;
  h: number;
  cat: string;
  label: string;
}

/* ── Pretty category names ── */
const CATEGORY_LABELS: Record<string, string> = {
  "management": "Management",
  "business-and-financial": "Business & Financial",
  "computer-and-information-technology": "Computer & IT",
  "math": "Math & Statistics",
  "architecture-and-engineering": "Architecture & Engineering",
  "life-physical-and-social-science": "Life, Physical & Social Science",
  "community-and-social-service": "Community & Social Service",
  "legal": "Legal",
  "education-training-and-library": "Education & Library",
  "arts-and-design": "Arts & Design",
  "media-and-communication": "Media & Communication",
  "entertainment-and-sports": "Entertainment & Sports",
  "healthcare": "Healthcare",
  "protective-service": "Protective Service",
  "food-preparation-and-serving": "Food Preparation & Serving",
  "building-and-grounds-cleaning": "Building & Grounds",
  "personal-care-and-service": "Personal Care & Service",
  "sales": "Sales",
  "office-and-administrative-support": "Office & Admin Support",
  "farming-fishing-and-forestry": "Farming & Forestry",
  "construction-and-extraction": "Construction & Extraction",
  "installation-maintenance-and-repair": "Installation & Repair",
  "production": "Production",
  "transportation-and-material-moving": "Transportation & Moving",
  "military": "Military",
};

/* ── Color helpers — matched to Karpathy's green-red scale ── */

function boostContrast(t: number): number {
  return Math.pow(t, 0.55);
}

function greenRedRGB(t: number, skipBoost: boolean = false): [number, number, number] {
  const b = skipBoost ? t : boostContrast(t);
  let r: number, g: number, bl: number;
  if (b < 0.5) {
    const s = b / 0.5;
    r = 30 + s * 200;
    g = 180 - s * 20;
    bl = 40 - s * 20;
  } else {
    const s = (b - 0.5) / 0.5;
    r = 230 + s * 25;
    g = 160 - s * 130;
    bl = 20 - s * 5;
  }
  return [Math.round(r), Math.round(g), Math.round(bl)];
}

function colorCSS(score: number, dim: DimensionKey, alpha: number = 1): string {
  const t = Math.max(0, Math.min(1, score / 10));
  const flipped =
    dim === "adaptability" ||
    dim === "demandElasticity" ||
    dim === "complementarity";
  if (dim === "netRisk") {
    // 3-stop gradient aligned to actual score distribution (median ~4.3):
    //   0–3.5  green (low risk)
    //   3.5–5.5  green→orange (moderate risk)
    //   5.5–10  orange→red (elevated/high risk)
    let r: number, g: number, b: number;
    if (score <= 3.5) {
      r = 30; g = 180; b = 40;
    } else if (score <= 5.5) {
      const s = (score - 3.5) / 2.0;
      r = Math.round(30 + s * 215);
      g = Math.round(180 - s * 22);
      b = Math.round(40 - s * 20);
    } else {
      const s = Math.min(1, (score - 5.5) / 4.5);
      r = Math.round(245 + s * 10);
      g = Math.round(158 - s * 128);
      b = Math.round(20 - s * 15);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const [r, g, b] = greenRedRGB(flipped ? 1 - t : t);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Generic squarified treemap ── */

interface SquarifyItem {
  value: number;
  [key: string]: unknown;
}

interface SquarifyRect<T extends SquarifyItem> {
  rx: number;
  ry: number;
  rw: number;
  rh: number;
  item: T;
}

function squarify<T extends SquarifyItem>(
  items: T[],
  x: number,
  y: number,
  w: number,
  h: number
): SquarifyRect<T>[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ rx: x, ry: y, rw: w, rh: h, item: items[0] }];
  }

  const sorted = [...items].sort((a, b) => b.value - a.value);
  const results: SquarifyRect<T>[] = [];
  let remaining = [...sorted];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length > 0) {
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    const remainingValue = remaining.reduce((s, d) => s + d.value, 0);
    const remainingArea = cw * ch;

    let bestRow: T[] = [];
    let bestWorst = Infinity;

    for (let i = 1; i <= remaining.length; i++) {
      const candidate = remaining.slice(0, i);
      const rowValue = candidate.reduce((s, d) => s + d.value, 0);
      const rowArea = (rowValue / remainingValue) * remainingArea;
      const rowSide = rowArea / side;

      let worstRatio = 0;
      for (const item of candidate) {
        const itemArea = (item.value / remainingValue) * remainingArea;
        const itemSide = itemArea / rowSide;
        const ratio = Math.max(rowSide / itemSide, itemSide / rowSide);
        worstRatio = Math.max(worstRatio, ratio);
      }

      if (worstRatio <= bestWorst) {
        bestWorst = worstRatio;
        bestRow = candidate;
      } else {
        break;
      }
    }

    const rowValue = bestRow.reduce((s, d) => s + d.value, 0);
    const rowFraction = rowValue / remainingValue;

    if (isWide) {
      const rowWidth = cw * rowFraction;
      let ry = cy;
      for (const item of bestRow) {
        const frac = item.value / rowValue;
        const ih = ch * frac;
        results.push({ rx: cx, ry, rw: rowWidth, rh: ih, item });
        ry += ih;
      }
      cx += rowWidth;
      cw -= rowWidth;
    } else {
      const rowHeight = ch * rowFraction;
      let rx = cx;
      for (const item of bestRow) {
        const frac = item.value / rowValue;
        const iw = cw * frac;
        results.push({ rx, ry: cy, rw: iw, rh: rowHeight, item });
        rx += iw;
      }
      cy += rowHeight;
      ch -= rowHeight;
    }

    remaining = remaining.slice(bestRow.length);
  }

  return results;
}

/* ── Two-level nested layout (category → occupation) ── */

interface CategoryGroup extends SquarifyItem {
  cat: string;
  items: ScoredKarpathyOccupation[];
}

const CATEGORY_GAP = 4;   // gap between category groups (dark bg shows through)
const HEADER_H = 18;       // space reserved for category label at top
const TILE_GAP = 1.5;      // gap between occupation tiles within a category
const MARGIN = 6;

function buildNestedLayout(
  data: ScoredKarpathyOccupation[],
  w: number,
  h: number
): { occRects: OccRect[]; catRects: CatRect[] } {
  // Group by category
  const byCategory: Record<string, ScoredKarpathyOccupation[]> = {};
  for (const d of data) {
    const cat = d.raw.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(d);
  }

  const categories: CategoryGroup[] = Object.keys(byCategory)
    .map((cat) => ({
      cat,
      items: byCategory[cat].sort(
        (a, b) => (b.raw.jobs || 0) - (a.raw.jobs || 0)
      ),
      value: byCategory[cat].reduce((s, d) => s + (d.raw.jobs || 1), 0),
    }))
    .sort((a, b) => b.value - a.value);

  // Level 1: category rectangles
  const catSquares = squarify(
    categories,
    MARGIN,
    MARGIN,
    w - MARGIN * 2,
    h - MARGIN * 2
  );

  const occRects: OccRect[] = [];
  const catRects: CatRect[] = [];

  for (const cr of catSquares) {
    const catX = cr.rx + CATEGORY_GAP;
    const catY = cr.ry + CATEGORY_GAP;
    const catW = cr.rw - CATEGORY_GAP * 2;
    const catH = cr.rh - CATEGORY_GAP * 2;

    if (catW < 4 || catH < 4) continue;

    catRects.push({
      x: catX,
      y: catY,
      w: catW,
      h: catH,
      cat: cr.item.cat,
      label: CATEGORY_LABELS[cr.item.cat] || cr.item.cat,
    });

    // Reserve space for category header label
    const headerSpace = catH > 50 ? HEADER_H : 0;
    const innerX = catX + TILE_GAP;
    const innerY = catY + headerSpace + TILE_GAP;
    const innerW = catW - TILE_GAP * 2;
    const innerH = catH - headerSpace - TILE_GAP * 2;

    if (innerW < 2 || innerH < 2) continue;

    // Level 2: occupations within category
    const innerItems = cr.item.items.map((occ) => ({
      ...occ,
      value: occ.raw.jobs || 1,
    }));
    const innerRects = squarify(innerItems, innerX, innerY, innerW, innerH);

    for (const ir of innerRects) {
      occRects.push({
        x: ir.rx + TILE_GAP / 2,
        y: ir.ry + TILE_GAP / 2,
        w: ir.rw - TILE_GAP,
        h: ir.rh - TILE_GAP,
        occ: ir.item as unknown as ScoredKarpathyOccupation,
        category: cr.item.cat,
      });
    }
  }

  return { occRects, catRects };
}

/* ── Canvas treemap component ── */

export default function KarpathyTreemap({
  data,
  activeDimension,
  onSelect,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 900 });
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    occ: ScoredKarpathyOccupation;
    category: string;
  } | null>(null);

  const { occRects, catRects } = useMemo(
    () => buildNestedLayout(data, size.w, size.h),
    [data, size.w, size.h]
  );

  // Resize observer — 4:3 aspect ratio
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = Math.floor(entry.contentRect.width);
        const h = Math.round(w * 3 / 4);
        setSize({ w, h });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dark background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, size.w, size.h);

    // Draw category backgrounds with subtle border
    for (const cr of catRects) {
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(cr.x, cr.y, cr.w, cr.h);

      // Category label in the header area
      if (cr.h > 50 && cr.w > 60) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(cr.x + 4, cr.y + 2, cr.w - 8, HEADER_H - 2);
        ctx.clip();

        const labelFontSize = Math.min(11, Math.max(8, cr.w / 20));
        ctx.font = `700 ${labelFontSize}px -apple-system, system-ui, sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(cr.label.toUpperCase(), cr.x + 5, cr.y + HEADER_H / 2 + 1);
        ctx.restore();
      }
    }

    // Draw occupation tiles
    for (let i = 0; i < occRects.length; i++) {
      const rect = occRects[i];
      const score = rect.occ.scores[activeDimension];
      const isHovered = i === hoveredIdx;

      // Tile fill
      ctx.fillStyle = colorCSS(score, activeDimension);
      ctx.globalAlpha = isHovered ? 0.9 : hoveredIdx >= 0 ? 0.3 : 0.55;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.globalAlpha = 1;

      // Hover border
      if (isHovered) {
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      }

      // Labels — clipped to tile bounds, with word-wrapping
      if (rect.w > 40 && rect.h > 16) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x + 2, rect.y + 1, rect.w - 4, rect.h - 2);
        ctx.clip();

        // Scale font to tile size — smaller base than before
        const fontSize = Math.min(
          11,
          Math.max(7, Math.min(rect.w / 12, rect.h / 4))
        );
        const alpha = isHovered ? 1 : 0.85;
        const cx = rect.x + rect.w / 2;
        const maxTextW = rect.w - 8;
        const lineH = fontSize * 1.2;

        ctx.font = `500 ${fontSize}px -apple-system, system-ui, sans-serif`;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Word-wrap the title into lines that fit
        const words = rect.occ.raw.title.split(" ");
        const lines: string[] = [];
        let currentLine = words[0];
        for (let w = 1; w < words.length; w++) {
          const test = currentLine + " " + words[w];
          if (ctx.measureText(test).width <= maxTextW) {
            currentLine = test;
          } else {
            lines.push(currentLine);
            currentLine = words[w];
          }
        }
        lines.push(currentLine);

        // Decide how many lines we can show
        const hasRoomForSub = rect.h > 34 && rect.w > 50;
        const subLineH = hasRoomForSub ? fontSize * 1.1 : 0;
        const availH = rect.h - 4 - subLineH;
        const maxLines = Math.max(1, Math.floor(availH / lineH));
        const shownLines = lines.slice(0, maxLines);

        // If we truncated, add ellipsis to last line
        if (shownLines.length < lines.length) {
          const last = shownLines[shownLines.length - 1];
          shownLines[shownLines.length - 1] = last.length > 3 ? last.slice(0, -2) + "\u2026" : last;
        }

        // Center the text block vertically
        const totalTextH = shownLines.length * lineH + subLineH;
        const startY = rect.y + (rect.h - totalTextH) / 2 + lineH / 2;

        for (let l = 0; l < shownLines.length; l++) {
          ctx.fillText(shownLines[l], cx, startY + l * lineH);
        }

        // Sub-label: score + jobs count
        if (hasRoomForSub) {
          const subFontSize = Math.max(7, fontSize - 2);
          ctx.font = `400 ${subFontSize}px -apple-system, system-ui, sans-serif`;
          ctx.fillStyle = `rgba(255,255,255,${isHovered ? 0.7 : 0.45})`;
          const jobs = rect.occ.raw.jobs
            ? rect.occ.raw.jobs >= 1000000
              ? `${(rect.occ.raw.jobs / 1000000).toFixed(1)}M`
              : `${(rect.occ.raw.jobs / 1000).toFixed(0)}K`
            : "";
          ctx.fillText(
            `${score.toFixed(1)}/10 · ${jobs}`,
            cx,
            startY + shownLines.length * lineH + subLineH / 2 - 1
          );
        }

        ctx.restore();
      }
    }
  }, [occRects, catRects, activeDimension, hoveredIdx, size]);

  // Hit test
  const hitTest = useCallback(
    (mx: number, my: number): number => {
      for (let i = occRects.length - 1; i >= 0; i--) {
        const r = occRects[i];
        if (mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h) {
          return i;
        }
      }
      return -1;
    },
    [occRects]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const bRect = canvas.getBoundingClientRect();
      const scaleX = size.w / bRect.width;
      const scaleY = size.h / bRect.height;
      const mx = (e.clientX - bRect.left) * scaleX;
      const my = (e.clientY - bRect.top) * scaleY;

      const idx = hitTest(mx, my);
      setHoveredIdx(idx);

      if (idx >= 0) {
        const r = occRects[idx];
        setTooltipInfo({
          x: e.clientX - bRect.left,
          y: e.clientY - bRect.top,
          occ: r.occ,
          category: r.category,
        });
      } else {
        setTooltipInfo(null);
      }
    },
    [hitTest, occRects, size]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const bRect = canvas.getBoundingClientRect();
      const scaleX = size.w / bRect.width;
      const scaleY = size.h / bRect.height;
      const mx = (e.clientX - bRect.left) * scaleX;
      const my = (e.clientY - bRect.top) * scaleY;
      const idx = hitTest(mx, my);
      if (idx >= 0) {
        onSelect(occRects[idx].occ);
      }
    },
    [hitTest, occRects, onSelect, size]
  );

  const dimMeta = DIMENSION_META[activeDimension];

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full cursor-pointer"
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
          className="absolute pointer-events-none z-20 bg-[#12121a] border border-white/[0.12] rounded-lg px-4 py-3 text-left"
          style={{
            left: `${Math.min(tooltipInfo.x + 16, size.w - 280)}px`,
            top: `${Math.max(tooltipInfo.y - 16, 0)}px`,
            transform: "translateY(-100%)",
            maxWidth: "340px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          <p className="text-[14px] font-bold text-white mb-0.5">
            {tooltipInfo.occ.raw.title}
          </p>
          <p className="text-[11px] text-white/40 mb-2">
            {CATEGORY_LABELS[tooltipInfo.category] || tooltipInfo.category}
          </p>

          {/* Active dimension highlight */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium text-white">
                {dimMeta.shortLabel}
              </span>
              <span
                className="text-[13px] font-bold text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {tooltipInfo.occ.scores[activeDimension].toFixed(1)}/10
              </span>
            </div>
            <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(tooltipInfo.occ.scores[activeDimension] / 10) * 100}%`,
                  background: colorCSS(
                    tooltipInfo.occ.scores[activeDimension],
                    activeDimension
                  ),
                }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-white/60 mb-2">
            <div>
              <span className="text-white/30">Median pay</span>
              <p className="text-white/80 font-medium">
                {tooltipInfo.occ.raw.pay
                  ? `$${tooltipInfo.occ.raw.pay.toLocaleString()}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-white/30">Jobs (2024)</span>
              <p className="text-white/80 font-medium">
                {tooltipInfo.occ.raw.jobs
                  ? tooltipInfo.occ.raw.jobs.toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-white/30">Outlook</span>
              <p className="text-white/80 font-medium">
                {tooltipInfo.occ.raw.outlook !== null
                  ? `${tooltipInfo.occ.raw.outlook! > 0 ? "+" : ""}${tooltipInfo.occ.raw.outlook}% (${tooltipInfo.occ.raw.outlook_desc})`
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-white/30">Education</span>
              <p className="text-white/80 font-medium">
                {tooltipInfo.occ.raw.education}
              </p>
            </div>
          </div>

          {/* All 5 dimension mini-bars */}
          <div className="border-t border-white/[0.08] pt-2 mt-1 space-y-1">
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
                <div key={key} className="flex items-center gap-2">
                  <span
                    className={`w-16 text-[10px] flex-shrink-0 ${isActive ? "text-white font-medium" : "text-white/40"}`}
                  >
                    {meta.shortLabel}
                  </span>
                  <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(val / 10) * 100}%`,
                        background: colorCSS(val, key),
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] w-6 text-right ${isActive ? "text-white" : "text-white/40"}`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {val.toFixed(1)}
                  </span>
                </div>
              );
            })}
            {/* Dimensionality context */}
            {tooltipInfo.occ.dimensionality.dimensionalityAdj !== 0 && (() => {
              const dim = tooltipInfo.occ.dimensionality;
              const dc = dim.effectiveDimensions <= 2 ? "#DC2626" : dim.effectiveDimensions >= 5 ? "#16A34A" : "#F59E0B";
              return (
                <div className="flex items-center gap-1.5 pl-[72px]">
                  <span className="text-[9px] font-bold px-1 rounded" style={{ background: dc + "20", color: dc }}>
                    {dim.effectiveDimensions} dims
                  </span>
                  <span className="text-[9px] text-white/30">
                    {dim.dimensionalityAdj > 0 ? "+" : ""}{dim.dimensionalityAdj.toFixed(1)} complementarity
                  </span>
                </div>
              );
            })()}
            <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
              <span className="w-16 text-[10px] flex-shrink-0 text-white font-medium">
                Net Risk
              </span>
              <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(tooltipInfo.occ.scores.netRisk / 10) * 100}%`,
                    background: colorCSS(
                      tooltipInfo.occ.scores.netRisk,
                      "netRisk"
                    ),
                  }}
                />
              </div>
              <span
                className="text-[10px] w-6 text-right text-white font-bold"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {tooltipInfo.occ.scores.netRisk.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: colorCSS(0, activeDimension) }}
          />
          {dimMeta.isPressure ? "Low risk" : "Low"}
        </span>
        <span className="font-medium text-white/70">
          {dimMeta.label} — {data.length} occupations,{" "}
          {(
            data.reduce((s, d) => s + (d.raw.jobs || 0), 0) / 1000000
          ).toFixed(0)}
          M workers
        </span>
        <span className="flex items-center gap-1.5">
          {dimMeta.isPressure ? "High risk" : "High"}
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: colorCSS(10, activeDimension) }}
          />
        </span>
      </div>
    </div>
  );
}
