"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Prediction, EvidenceTier } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";
import {
  getResearchAnnotation,
  ESTIMATE_TYPE_LABELS,
} from "@/lib/research-annotations";
import { computeAggregate } from "@/lib/prediction-stats";

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


function getContextLine(prediction: Prediction, aggregateValue: number): string {
  const v = aggregateValue;
  if (prediction.slug === "overall-us-displacement")
    return `An estimated ${v}% of US jobs face net displacement from AI by 2030 — roles eliminated or fundamentally restructured.`;
  if (prediction.slug === "total-us-jobs-lost")
    return `Models project ~${Math.round(168.5 * v / 100)}M US workers displaced by AI — but observed employment data so far shows near-zero net loss.`;
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
  if (prediction.slug === "genai-work-adoption")
    return `${v}% of U.S. working-age adults now use generative AI at work — overall adoption (55.9%) outpaces the PC and internet at comparable points post-launch.`;
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // Area fill path
  const fullPath = coords.reduce((acc, c, i) => {
    if (i === 0) return `M ${c.x},${c.y}`;
    const prev = coords[i - 1];
    const cpx1 = prev.x + (c.x - prev.x) * 0.4;
    const cpx2 = prev.x + (c.x - prev.x) * 0.6;
    return acc + ` C ${cpx1},${prev.y} ${cpx2},${c.y} ${c.x},${c.y}`;
  }, "");
  const areaPath = `${fullPath} L ${coords[coords.length - 1].x},${H} L ${coords[0].x},${H} Z`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 80"
      preserveAspectRatio="none"
      className={`sparkline-draw absolute inset-0 w-full h-full pointer-events-none ${visible ? "visible" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkFade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#sparkFade-${id})`}
        className="spark-area"
      />
    </svg>
  );
}

export default function PredictionSummaryCard({
  prediction,
  selectedTiers,
}: PredictionSummaryCardProps) {
  const [showNote, setShowNote] = useState(false);
  const best = getBestEstimate(prediction, selectedTiers);
  const agg = computeAggregate(prediction, selectedTiers);
  const contextLine = getContextLine(prediction, agg.mean);
  const annotation = getResearchAnnotation(prediction.slug);
  const filteredHistory = prediction.history.filter((d) =>
    selectedTiers.includes(d.evidenceTier)
  );

  const trendColorClass = agg.trendIsBad
    ? "text-red-600"
    : agg.trend !== "flat" && !agg.trendIsBad
      ? "text-emerald-600"
      : "text-[var(--muted)]";

  const bestSource = best
    ? prediction.sources.find((s) => best.sourceIds.includes(s.id))
    : null;
  const tierConfig = best ? getTierConfig(best.evidenceTier) : null;

  // Soften tier border color to 30% opacity
  const rawColor = tierConfig
    ? tierConfig.color
    : best
      ? getTierConfig(best.evidenceTier).color
      : null;
  const tierBorderColor = rawColor
    ? rawColor + "4D" // ~30% opacity hex suffix
    : "rgba(0,0,0,0.06)";

  return (
    <Link href={`/predictions/${prediction.slug}`} className="group block">
      <div
        className="card-hover relative pb-8 border-b border-black/[0.06] overflow-hidden rounded-lg pl-3 border-l-[2px]"
        style={{ borderLeftColor: tierBorderColor }}
      >
        {/* Sparkline watermark */}
        <SparklineWatermark
          id={prediction.id}
          history={prediction.history}
          selectedTiers={selectedTiers}
        />

        {/* Content (above watermark) */}
        <div className="relative z-10">
          {/* Estimate type badge + Title */}
          {annotation && (
            <div className="mb-1">
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    annotation.estimateType === "observed"
                      ? "rgba(22, 163, 74, 0.10)"
                      : annotation.estimateType === "mixed"
                        ? "rgba(37, 99, 235, 0.10)"
                        : "rgba(107, 114, 128, 0.10)",
                  color:
                    annotation.estimateType === "observed"
                      ? "#16a34a"
                      : annotation.estimateType === "mixed"
                        ? "#2563eb"
                        : "#6b7280",
                }}
                title={
                  annotation.estimateType === "observed"
                    ? "Based on RCTs, field experiments, or platform data showing actual changes"
                    : annotation.estimateType === "mixed"
                      ? "Combines exposure-based projections with some observed empirical data"
                      : "Projection based on task overlap and AI capability mapping"
                }
              >
                {ESTIMATE_TYPE_LABELS[annotation.estimateType]}
              </span>
            </div>
          )}
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-6 leading-snug group-hover:text-[var(--accent)]">
            {prediction.title}
          </h3>

          {/* Big number + source range + trend */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="stat-number text-[44px] font-black text-[var(--foreground)] leading-none">
              {agg.mean > 0 && prediction.category === "wages" ? "+" : ""}
              {Number.isInteger(agg.mean) ? agg.mean : agg.mean.toFixed(1)}
              <span className="text-[18px] font-normal text-[var(--muted)] opacity-50 ml-0.5">
                {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
              </span>
            </span>
            {agg.min !== agg.max && (
              <span className="text-[14px] font-semibold text-[var(--muted)]">
                {agg.min}&ndash;{agg.max}{prediction.unit.includes("%") ? "%" : ""}
              </span>
            )}
            {agg.trend !== "flat" && (
              <span className={`text-[22px] ${trendColorClass}`} style={{ opacity: 0.6 }}>
                {agg.trend === "up" ? "▲" : "▼"}
              </span>
            )}
          </div>

          {/* Context */}
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-2">
            {contextLine}
          </p>
          <p className="text-[11px] text-[var(--muted)] opacity-60 mb-4">
            {filteredHistory.length} source{filteredHistory.length !== 1 ? "s" : ""}{agg.min !== agg.max ? ` ranging ${agg.min}–${agg.max}${prediction.unit.includes("%") ? "%" : ""}` : ""}{agg.max - agg.min > 10 ? " — significant disagreement" : ""}.{" "}
            <span
              className="underline cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = "/about#how-we-calculate"; }}
            >
              Methodology
            </span>
          </p>

          {/* Research annotation — note expandable, badge always visible */}
          {annotation && (
            <div className="mb-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNote(!showNote);
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--accent)]"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Research note
                <svg
                  className={`w-3 h-3 transition-transform duration-150 ${showNote ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showNote && (
                <p className="mt-2 text-[12px] text-[var(--muted)] leading-relaxed border-l-2 border-[var(--accent)]/30 pl-3">
                  {annotation.note}
                </p>
              )}
            </div>
          )}

          {/* Source attribution + link */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {bestSource && tierConfig && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tierConfig.color }}
                  />
                  <span className="text-[12px] text-[var(--muted)] truncate max-w-[140px]">
                    {bestSource.publisher}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[12px] text-[var(--accent)] font-semibold group-hover:underline shrink-0">
              {prediction.sources.length} sources
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
