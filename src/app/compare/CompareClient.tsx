"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllPredictions } from "@/lib/data-loader";
import { computeAggregate } from "@/lib/prediction-stats";
import { EvidenceTier, Prediction } from "@/lib/types";
import PredictionChart from "@/components/PredictionChart";

const CATEGORY_LABELS: Record<string, string> = {
  displacement: "Job Displacement",
  wages: "Wage Impact",
  adoption: "AI Adoption",
  signals: "Corporate Signals",
  exposure: "Workforce Exposure",
};

const CATEGORY_COLORS: Record<string, string> = {
  displacement: "#F66B5C",
  wages: "#3b82f6",
  adoption: "#22c55e",
  signals: "#5C61F6",
  exposure: "#8b5cf6",
};

export default function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const allPredictions = useMemo(() => getAllPredictions(), []);
  const allTiers: EvidenceTier[] = [1, 2, 3, 4];

  // Read selected slugs from URL
  const initialSlugs = searchParams.get("s")?.split(",").filter(Boolean) ?? [];
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlugs.length > 0
      ? initialSlugs.filter((s: string) => allPredictions.some((p: Prediction) => p.slug === s))
      : []
  );
  const [copied, setCopied] = useState(false);

  // Update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSlugs.length > 0) {
      params.set("s", selectedSlugs.join(","));
    }
    const newUrl = selectedSlugs.length > 0
      ? `/compare?${params.toString()}`
      : "/compare";
    router.replace(newUrl, { scroll: false });
  }, [selectedSlugs, router]);

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev: string[]) =>
      prev.includes(slug)
        ? prev.filter((s: string) => s !== slug)
        : prev.length < 4
          ? [...prev, slug]
          : prev
    );
  }

  const selectedPredictions = selectedSlugs
    .map((s: string) => allPredictions.find((p: Prediction) => p.slug === s))
    .filter((p: Prediction | undefined): p is Prediction => !!p);

  // Group predictions by category for the selector
  const grouped = useMemo(() => {
    const map: Record<string, Prediction[]> = {};
    for (const p of allPredictions) {
      const cat = p.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    }
    return map;
  }, [allPredictions]);

  async function copyShareLink() {
    const url = `https://jobsdata.ai/compare?s=${selectedSlugs.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-2 text-base text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--foreground)] font-medium">
          Dashboard
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-[var(--foreground)] font-medium">Compare</span>
      </div>

      <div className="max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] mb-4">
          Compare Predictions
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed">
          Select up to 4 predictions to compare side-by-side. The URL updates as
          you select, so you can share any comparison directly.
        </p>
      </div>

      {/* Prediction selector */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, predictions]) => (
          <div key={category}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
              {CATEGORY_LABELS[category] || category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {predictions.map((p) => {
                const isSelected = selectedSlugs.includes(p.slug);
                const isDisabled = !isSelected && selectedSlugs.length >= 4;
                return (
                  <button
                    key={p.slug}
                    onClick={() => toggleSlug(p.slug)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 text-base font-medium rounded-full border transition-all ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)]/[0.1] text-[var(--accent)]"
                        : isDisabled
                          ? "border-card dark:border-white/[0.06] text-[var(--muted)] opacity-40 cursor-not-allowed"
                          : "border-strong dark:border-white/[0.08] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {isSelected && (
                      <span className="mr-1 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[p.category] }} />
                    )}
                    {p.title.replace(/ by \d{4}$/, "").replace(/ Across US Companies$/, "")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Share link */}
      {selectedSlugs.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-base font-medium rounded-md bg-[var(--accent)]/[0.08] text-[var(--accent)] hover:bg-[var(--accent)]/[0.15] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Link copied" : "Copy share link"}
          </button>
          <span className="text-sm text-[var(--muted)]">
            {selectedSlugs.length}/4 selected
          </span>
        </div>
      )}

      {/* Comparison cards */}
      {selectedPredictions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-strong dark:border-white/[0.08] rounded-lg">
          <p className="text-[var(--muted)] text-lg">
            Select predictions above to start comparing.
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          selectedPredictions.length === 1
            ? "grid-cols-1 max-w-2xl"
            : "grid-cols-1 md:grid-cols-2"
        }`}>
          {selectedPredictions.map((prediction) => {
            const agg = computeAggregate(prediction, allTiers);
            const unitSymbol = prediction.unit.includes("%") ? "%" : "";
            const trendColorClass = agg.trendIsBad
              ? "text-highlight"
              : agg.trend !== "flat"
                ? "text-[var(--signal-positive-strong)]"
                : "text-[var(--muted)]";

            return (
              <div
                key={prediction.slug}
                className="border border-card dark:border-white/[0.08] rounded-lg overflow-hidden"
              >
                {/* Category accent bar */}
                <div
                  className="h-1"
                  style={{ backgroundColor: CATEGORY_COLORS[prediction.category] || "#5C61F6" }}
                />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                        {CATEGORY_LABELS[prediction.category] || prediction.category}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight mt-1">
                        <Link
                          href={`/predictions/${prediction.slug}`}
                          className="hover:text-[var(--accent)] transition-colors"
                        >
                          {prediction.title}
                        </Link>
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleSlug(prediction.slug)}
                      className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 -mr-1 -mt-1"
                      title="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Big number */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="stat-number text-title font-black text-[var(--foreground)] leading-none">
                      {agg.mean > 0 && prediction.category === "wages" ? "+" : ""}
                      {Number.isInteger(agg.mean) ? agg.mean : agg.mean.toFixed(1)}
                      <span className="text-2xl font-normal text-[var(--muted)] ml-0.5">
                        {unitSymbol}
                      </span>
                    </span>
                    {agg.min !== agg.max && (
                      <span className="text-base text-[var(--muted)]" style={{ opacity: 0.7 }}>
                        {agg.min}–{agg.max}{unitSymbol}
                      </span>
                    )}
                    {agg.trend !== "flat" && (
                      <span className={`text-2xl ${trendColorClass}`} style={{ opacity: 0.5 }}>
                        {agg.trend === "up" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>

                  {/* Chart */}
                  <PredictionChart
                    history={prediction.history}
                    sources={prediction.sources}
                    selectedTiers={allTiers}
                    unit={unitSymbol}
                    overlays={prediction.overlays}
                    category={prediction.category}
                    showTrendLine={true}
                    height={220}
                  />

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider dark:border-white/[0.04]">
                    <span className="text-sm text-[var(--muted)]">
                      {prediction.sources.length} sources
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {prediction.timeHorizon}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
