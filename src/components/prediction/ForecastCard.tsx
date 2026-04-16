"use client";

import Link from "next/link";
import {
  CATEGORY_COLORS,
  CONVICTION_COLORS,
  type ForecastPrediction,
} from "@/data/forecast";

function ConvictionLabel({ level }: { level: string }) {
  const color = CONVICTION_COLORS[level] ?? "#6b7280";
  const label = level.replace("-", " ");
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color, backgroundColor: `${color}15` }}
    >
      {label}
    </span>
  );
}

function ConfidenceBar({
  low,
  high,
  value,
  sliderMin,
  sliderMax,
}: {
  low: number;
  high: number;
  value: number;
  sliderMin: number;
  sliderMax: number;
}) {
  const range = sliderMax - sliderMin;
  if (range === 0) return null;
  const leftPct = ((low - sliderMin) / range) * 100;
  const widthPct = ((high - low) / range) * 100;
  const valuePct = ((value - sliderMin) / range) * 100;

  return (
    <div className="relative h-2 bg-black/[0.04] rounded-full mt-2 mb-3">
      <div
        className="absolute top-0 h-2 rounded-full bg-[#5C61F6]/20"
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
      <div
        className="absolute top-[-2px] w-2 h-3 rounded-sm bg-[#5C61F6]"
        style={{ left: `${valuePct}%`, transform: "translateX(-50%)" }}
      />
    </div>
  );
}

export default function ForecastCard({ p }: { p: ForecastPrediction }) {
  const catColor = CATEGORY_COLORS[p.category] ?? "#5C61F6";
  const sign = p.prediction > 0 && p.category !== "displacement" ? "+" : "";

  return (
    <div className="rounded-xl border border-black/[0.06] p-5 hover:shadow-sm transition-shadow flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded"
          style={{ backgroundColor: catColor }}
        >
          {p.category}
        </span>
        <ConvictionLabel level={p.conviction} />
      </div>

      <h3 className="text-[14px] font-bold text-[#2E3650] leading-snug mb-2">
        {p.title}
      </h3>

      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-black text-[#2E3650]">
          {sign}{p.prediction}{p.unit}
        </span>
        <span className="text-[12px] text-[var(--muted)]">
          ({p.confidenceLow} to {p.confidenceHigh})
        </span>
      </div>

      <ConfidenceBar
        low={p.confidenceLow}
        high={p.confidenceHigh}
        value={p.prediction}
        sliderMin={p.sliderMin}
        sliderMax={p.sliderMax}
      />

      {p.currentObserved !== null && (
        <p className="text-[11px] text-[var(--muted)] mb-2">
          Currently observed:{" "}
          <span className="font-bold text-[#2E3650]">
            {p.currentObserved}{p.unit}
          </span>
        </p>
      )}

      <p className="text-[12px] text-[var(--muted)] leading-relaxed mb-3 flex-1">
        {p.rationale}
      </p>

      <div className="space-y-1 border-t border-black/[0.04] pt-3">
        {p.keyCitations.map((c, i) => (
          <p key={i} className="text-[10px] text-[var(--muted)] opacity-70 leading-snug">
            {c}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/[0.04]">
        <span className="text-[10px] text-[var(--muted)]">
          {p.sourceCount} sources
        </span>
        {p.relatedSlug && (
          <Link
            href={`/predictions/${p.relatedSlug}`}
            className="text-[10px] font-medium text-[var(--accent)] hover:opacity-70 transition-opacity"
          >
            View full data &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
