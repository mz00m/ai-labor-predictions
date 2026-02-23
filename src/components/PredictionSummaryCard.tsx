"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Prediction, EvidenceTier } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";

interface PredictionSummaryCardProps {
  prediction: Prediction;
  selectedTiers: EvidenceTier[];
}

function getBestEstimate(prediction: Prediction, selectedTiers: EvidenceTier[]) {
  const filtered = prediction.history
    .filter((d) => selectedTiers.includes(d.evidenceTier))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const bestTier = filtered.find((d) => d.evidenceTier === 1);
  return bestTier || filtered[0] || null;
}

function computeTrend(prediction: Prediction, selectedTiers: EvidenceTier[]) {
  const sorted = prediction.history
    .filter((d) => selectedTiers.includes(d.evidenceTier))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (sorted.length < 2) return null;
  const latest = sorted[sorted.length - 1];
  const latestDate = new Date(latest.date).getTime();
  const oneYearAgo = latestDate - 365 * 24 * 60 * 60 * 1000;
  let closest = sorted[0];
  let closestDiff = Math.abs(new Date(sorted[0].date).getTime() - oneYearAgo);
  for (const point of sorted) {
    const diff = Math.abs(new Date(point.date).getTime() - oneYearAgo);
    if (diff < closestDiff) {
      closest = point;
      closestDiff = diff;
    }
  }
  if (closest === latest) return null;
  const change = latest.value - closest.value;
  const monthsApart = Math.round(
    (latestDate - new Date(closest.date).getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  return { change, monthsApart, from: closest.value, to: latest.value };
}

function getContextLine(prediction: Prediction): string {
  const v = prediction.currentValue;
  if (prediction.slug === "overall-us-displacement")
    return `An estimated ${v}% of US jobs face net displacement from AI by 2030 — roles eliminated or fundamentally restructured.`;
  if (prediction.slug === "total-us-jobs-lost")
    return `Roughly ${Math.round(167 * v / 100)} million US workers are projected to lose their jobs to AI and automation.`;
  if (prediction.slug === "customer-service-automation")
    return `${v}% of CS interactions projected to be fully handled by AI without human involvement.`;
  if (prediction.slug === "tech-sector-displacement")
    return `${v}% of tech sector jobs could be displaced by AI coding assistants and automated ops.`;
  if (prediction.slug === "white-collar-professional-displacement")
    return `${v}% of legal, accounting, and financial analyst roles face restructuring or elimination from LLMs and AI tools.`;
  if (prediction.slug === "creative-industry-displacement")
    return `${v}% of creative roles in design, writing, and marketing could be displaced by generative AI tools.`;
  if (prediction.slug === "healthcare-admin-displacement")
    return `${v}% of healthcare admin roles (coding, billing, prior auth) projected to be automated — one of the fastest-moving sectors.`;
  if (prediction.slug === "education-sector-displacement")
    return `${v}% of education support roles face displacement as AI handles tutoring, grading, and content creation.`;
  if (prediction.slug === "high-skill-wage-premium")
    return `Workers with AI/ML skills earn ~${v}% more than median — the gap is widening.`;
  if (prediction.slug === "median-wage-impact")
    return `Real median wages projected to ${v < 0 ? "decline" : "increase"} ${Math.abs(v)}% as AI reshapes mid-skill work.`;
  if (prediction.slug === "freelancer-rate-impact")
    return `Freelancer rates in AI-exposed categories (writing, design, translation) have ${v < 0 ? "fallen" : "risen"} ${Math.abs(v)}% — a leading indicator of broader wage shifts.`;
  if (prediction.slug === "entry-level-wage-impact")
    return `Entry-level wages in knowledge work are projected to ${v < 0 ? "decline" : "increase"} ${Math.abs(v)}% as AI handles tasks traditionally done by juniors.`;
  if (prediction.slug === "geographic-wage-divergence")
    return `AI hub cities (SF, Seattle, NYC) pay ${v}% more than non-hub metros for tech workers — and the gap is accelerating.`;
  if (prediction.slug === "ai-adoption-rate")
    return `${v}% of US companies with 50+ employees have deployed AI in production, up from under 4% in 2023.`;
  if (prediction.slug === "earnings-call-ai-mentions")
    return `${v}% of S&P 500 companies now mention AI + workforce on earnings calls, up from 8% pre-ChatGPT.`;
  return `Current estimate: ${v > 0 ? "+" : ""}${v} ${prediction.unit}.`;
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "displacement": return "Displacement";
    case "wages": return "Wages";
    case "adoption": return "Adoption";
    case "signals": return "Signal";
    default: return category;
  }
}

function SparklineWatermark({
  id,
  history,
  selectedTiers,
}: {
  id: string;
  history: Prediction["history"];
  selectedTiers: EvidenceTier[];
}) {
  const pathData = useMemo(() => {
    const points = history
      .filter((d) => selectedTiers.includes(d.evidenceTier))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (points.length < 2) return null;

    const values = points.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const W = 200;
    const H = 80;
    const padTop = 8;
    const padBot = 4;
    const usableH = H - padTop - padBot;

    const coords = points.map((p, i) => ({
      x: (i / (points.length - 1)) * W,
      y: padTop + usableH - ((p.value - minVal) / range) * usableH,
    }));

    // Smooth curve using cubic bezier
    let linePath = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      linePath += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }

    // Close for area fill
    const areaPath = `${linePath} L ${coords[coords.length - 1].x},${H} L ${coords[0].x},${H} Z`;

    return { linePath, areaPath };
  }, [history, selectedTiers]);

  if (!pathData) return null;

  return (
    <svg
      viewBox="0 0 200 80"
      preserveAspectRatio="none"
      className="absolute bottom-0 right-0 w-[55%] h-[70%] pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkFade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path
        d={pathData.areaPath}
        fill={`url(#sparkFade-${id})`}
        className="text-[var(--foreground)]"
      />
      <path
        d={pathData.linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black/[0.06]"
      />
    </svg>
  );
}

export default function PredictionSummaryCard({
  prediction,
  selectedTiers,
}: PredictionSummaryCardProps) {
  const best = getBestEstimate(prediction, selectedTiers);
  const trend = computeTrend(prediction, selectedTiers);
  const contextLine = getContextLine(prediction);

  const trendIsBad =
    trend &&
    ((prediction.category === "displacement" && trend.change > 0) ||
      (prediction.category === "wages" && trend.change < 0));
  const trendIsGood =
    trend &&
    ((prediction.category === "displacement" && trend.change < 0) ||
      (prediction.category === "wages" && trend.change > 0));

  const trendColorClass = trendIsBad
    ? "text-red-600"
    : trendIsGood
      ? "text-emerald-600"
      : "text-[var(--muted)]";

  const bestSource = best
    ? prediction.sources.find((s) => best.sourceIds.includes(s.id))
    : null;
  const tierConfig = best ? getTierConfig(best.evidenceTier) : null;

  return (
    <Link href={`/predictions/${prediction.slug}`} className="group block">
      <div className="relative pb-8 border-b border-black/[0.06] overflow-hidden">
        {/* Sparkline watermark */}
        <SparklineWatermark
          id={prediction.id}
          history={prediction.history}
          selectedTiers={selectedTiers}
        />

        {/* Content (above watermark) */}
        <div className="relative z-10">
          {/* Title */}
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4 leading-snug group-hover:text-[var(--accent)]">
            {prediction.title}
          </h3>

          {/* Big number + trend */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="stat-number text-[40px] font-black text-[var(--foreground)] leading-none">
              {prediction.currentValue > 0 && prediction.category === "wages" ? "+" : ""}
              {prediction.currentValue}
              <span className="text-[18px] font-normal text-[var(--muted)] ml-0.5">
                {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
              </span>
            </span>
            {trend && (
              <span className={`text-[13px] font-semibold ${trendColorClass}`}>
                {trend.change > 0 ? "+" : ""}
                {trend.change}
                {prediction.unit.includes("%") ? "pp" : ""}{" "}
                / {trend.monthsApart}mo
              </span>
            )}
          </div>

          {/* Confidence range */}
          {best && best.confidenceLow != null && best.confidenceHigh != null && (
            <p className="text-[13px] text-[var(--muted)] mb-3">
              Range: {best.confidenceLow}
              {prediction.unit.includes("%") ? "%" : ""} to {best.confidenceHigh}
              {prediction.unit.includes("%") ? "%" : ""}
            </p>
          )}

          {/* Context */}
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5">
            {contextLine}
          </p>

          {/* Source attribution + link */}
          <div className="flex items-center justify-between">
            {bestSource && tierConfig ? (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: tierConfig.color }}
                />
                <span className="text-[12px] text-[var(--muted)] truncate max-w-[200px]">
                  {bestSource.publisher}
                </span>
              </div>
            ) : (
              <span />
            )}
            <span className="text-[12px] text-[var(--accent)] font-semibold group-hover:underline">
              View all {prediction.sources.length} sources
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
