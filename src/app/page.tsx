"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions } from "@/lib/data-loader";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import ResearchFeed from "@/components/ResearchFeed";

const predictions = getAllPredictions();

export default function Home() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);

  const displacement = predictions.filter((p) => p.category === "displacement");
  const wages = predictions.filter((p) => p.category === "wages");
  const adoption = predictions.filter((p) => p.category === "adoption");
  const signals = predictions.filter((p) => p.category === "signals");

  // Aggregate stats for the hero
  const totalSources = predictions.reduce((sum, p) => sum + p.sources.length, 0);
  const lastUpdated = predictions
    .flatMap((p) => p.history.map((h) => new Date(h.date).getTime()))
    .reduce((latest, t) => Math.max(latest, t), 0);
  const lastUpdatedStr = new Date(lastUpdated).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-20">
      {/* Hero */}
      <div>
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          {predictions.length} predictions &middot; {totalSources} sources &middot; Updated {lastUpdatedStr}
        </p>
        <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-3xl">
          How is AI reshaping the labor market?
        </h1>
        <p className="mt-5 text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl">
          Tracking {predictions.length} predictions across displacement, wages, adoption, and corporate signals
          &mdash; sourced from peer-reviewed research, government data, think tanks, and earnings calls.
          Filter by evidence quality to see how the picture changes.
        </p>

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-3 mt-8">
          {predictions.slice(0, 5).map((p) => (
            <a
              key={p.id}
              href={`/predictions/${p.slug}`}
              className="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] hover:border-[var(--accent)] hover:bg-[var(--accent)]/[0.03] transition-colors"
            >
              <span className="text-[18px] font-black text-[var(--foreground)]">
                {p.currentValue > 0 && p.category === "wages" ? "+" : ""}
                {p.currentValue}
                <span className="text-[12px] font-normal text-[var(--muted)]">%</span>
              </span>
              <span className="text-[12px] text-[var(--muted)] max-w-[140px] truncate">
                {p.title.replace(/by \d{4}/, "").trim()}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Evidence Filter */}
      <section>
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
        />
      </section>

      {/* Job Displacement */}
      <section>
        <div className="mb-8">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Job Displacement
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-xl">
            Projected share of jobs eliminated or restructured by AI, by sector
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {displacement.map((p) => (
            <PredictionSummaryCard
              key={p.id}
              prediction={p}
              selectedTiers={selectedTiers}
            />
          ))}
        </div>
      </section>

      {/* Wage Impact */}
      <section>
        <div className="mb-8">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Wage Impact
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-xl">
            How AI adoption is projected to affect compensation across worker segments
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {wages.map((p) => (
            <PredictionSummaryCard
              key={p.id}
              prediction={p}
              selectedTiers={selectedTiers}
            />
          ))}
        </div>
      </section>

      {/* AI Adoption */}
      {adoption.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
              AI Adoption
            </h2>
            <p className="text-[15px] text-[var(--muted)] mt-2 max-w-xl">
              How rapidly companies are deploying AI in production workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {adoption.map((p) => (
              <PredictionSummaryCard
                key={p.id}
                prediction={p}
                selectedTiers={selectedTiers}
              />
            ))}
          </div>
        </section>
      )}

      {/* Leading Signals */}
      {signals.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
              Leading Signals
            </h2>
            <p className="text-[15px] text-[var(--muted)] mt-2 max-w-xl">
              Real-time indicators of how corporate America is thinking about AI and workforce
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {signals.map((p) => (
              <PredictionSummaryCard
                key={p.id}
                prediction={p}
                selectedTiers={selectedTiers}
              />
            ))}
          </div>
        </section>
      )}

      {/* Research Feed */}
      <section>
        <ResearchFeed selectedTiers={selectedTiers} />
      </section>
    </div>
  );
}
