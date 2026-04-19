"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions } from "@/lib/data-loader";
import { getSourceCount, getSourceCountsByTier } from "@/lib/search-sources";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import ResearchFeed from "@/components/ResearchFeed";
import ScrollReveal from "@/components/ScrollReveal";

const predictions = getAllPredictions();
const tierCounts = getSourceCountsByTier();

export default function PredictionsPage() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);

  const displacement = predictions.filter((p) => p.category === "displacement");
  const wages = predictions.filter((p) => p.category === "wages");
  const adoption = predictions.filter((p) => p.category === "adoption");

  const totalSources = getSourceCount();

  return (
    <div className="space-y-0">
      {/* Section header */}
      <div className="relative -mx-6 sm:-mx-10">
        <div className="h-1 bg-gradient-to-r from-[#3ECFAE] via-[#6B7BF7] to-[#F7C96B]" />
        <div className="px-6 sm:px-10 pt-10 pb-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4 font-serif">
            Predictions Over Time
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
            {predictions.length} predictions across job displacement, wages, and AI adoption, each
            with its own trend chart, source list, and weighted estimate built from {totalSources}+
            sources. Every source is color-coded by evidence quality; use the tiers below to filter
            what appears.
          </p>
        </div>
      </div>

      {/* Evidence Filter + all prediction sections */}
      <div className="mt-12">
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
          tierCounts={tierCounts}
          sticky
        />

        {/* Job Displacement & Restructuring */}
        <section id="displacement" className="mt-16">
          <ScrollReveal>
            <div className="mb-8 flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-red-400/60 shrink-0" />
              <div>
                <h2 className="text-4xl sm:text-title-sm font-extrabold tracking-tight text-[var(--foreground)]">
                  Job Displacement &amp; Restructuring
                </h2>
                <p className="text-lg text-[var(--muted)] mt-2 max-w-2xl">
                  Projected share of jobs eliminated, restructured, or significantly transformed by
                  AI. Sector-specific estimates are higher than the ~3% economy-wide average because
                  they measure the most-exposed segments, not the full workforce. Most evidence points
                  to task-level transition rather than wholesale replacement
                </p>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {displacement.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <PredictionSummaryCard
                  prediction={p}
                  selectedTiers={selectedTiers}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Wage Impact */}
        <section id="wages" className="mt-16">
          <ScrollReveal>
            <div className="mb-8 flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-blue-400/60 shrink-0" />
              <div>
                <h2 className="text-4xl sm:text-title-sm font-extrabold tracking-tight text-[var(--foreground)]">
                  Wage Impact
                </h2>
                <p className="text-lg text-[var(--muted)] mt-2 max-w-xl">
                  How AI adoption is projected to affect compensation across worker segments
                </p>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {wages.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <PredictionSummaryCard
                  prediction={p}
                  selectedTiers={selectedTiers}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* AI Adoption */}
        {adoption.length > 0 && (
          <section className="mt-16">
            <ScrollReveal>
              <div className="mb-8 flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full bg-emerald-400/60 shrink-0" />
                <div>
                  <h2 className="text-4xl sm:text-title-sm font-extrabold tracking-tight text-[var(--foreground)]">
                    AI Adoption
                  </h2>
                  <p className="text-lg text-[var(--muted)] mt-2 max-w-2xl">
                    How rapidly companies are deploying AI, how much of the workforce is exposed, and
                    corporate signaling on earnings calls.{" "}
                    <strong className="text-[var(--foreground)]">
                      Exposure does not mean displacement or job loss.
                    </strong>
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {adoption.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 60}>
                  <PredictionSummaryCard
                    prediction={p}
                    selectedTiers={selectedTiers}
                  />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Research Feed */}
        <section id="research-feed" className="mt-16">
          <ResearchFeed selectedTiers={selectedTiers} />
        </section>
      </div>
    </div>
  );
}
