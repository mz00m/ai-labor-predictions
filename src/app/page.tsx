"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions } from "@/lib/data-loader";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import NewsTicker from "@/components/NewsTicker";
import ResearchFeed from "@/components/ResearchFeed";
import FunnelStrip from "@/components/FunnelStrip";
import ProductivityPredictions from "@/components/ProductivityPredictions";
import ResearchEvidence from "@/components/ResearchEvidence";
import FeaturedReads from "@/components/FeaturedReads";

const predictions = getAllPredictions();

export default function Home() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);

  const displacement = predictions.filter((p) => p.category === "displacement");
  const wages = predictions.filter((p) => p.category === "wages");
  const adoption = predictions.filter((p) => p.category === "adoption");

  // Aggregate stats for the hero
  const totalSources = predictions.reduce((sum, p) => sum + p.sources.length, 0);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-1 pb-0 sm:pt-2 sm:pb-0">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#7c3aed]/[0.04] blur-3xl" />
          <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-[#7c3aed]/[0.03] blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-[#3b82f6]/[0.02] blur-3xl" />
          {/* Subtle grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            {predictions.length} predictions &middot; {totalSources} sources
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-4xl">
            How is AI <span className="text-[#2a5280] italic">reshaping</span>
            <br className="hidden sm:block" /> the labor market?
          </h1>
          <p className="mt-4 text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl">
            300+ sources, one pattern: AI adoption is accelerating, productivity is climbing,
            entry-level and freelance work is compressing, and jobs are changing faster than
            they&apos;re disappearing. No measurable macro displacement &mdash; yet.
          </p>
        </div>

        {/* News Ticker — directly below hero content */}
        <div className="relative mt-6">
          <NewsTicker />
        </div>

        {/* Essential Reading — compact strip under ticker */}
        <div className="relative mt-4 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
            Important Reads This Week{" "}
            <span className="opacity-50">|</span>{" "}
            <span className="normal-case font-semibold">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </p>
          <FeaturedReads />
        </div>
      </div>

      {/* Evidence Funnel */}
      <section>
        <FunnelStrip />
      </section>

      {/* Evidence Filter */}
      <section>
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
        />
      </section>

      {/* Job Displacement & Restructuring */}
      <section>
        <div className="mb-8">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Job Displacement &amp; Restructuring
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Projected share of jobs eliminated, restructured, or significantly transformed by AI &mdash; most evidence points to task-level transition rather than wholesale replacement
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
            <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
              How rapidly companies are deploying AI, how much of the workforce is exposed, and corporate signaling on earnings calls
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

      {/* Productivity Predictions */}
      <ProductivityPredictions />

      {/* Research Evidence */}
      <ResearchEvidence />

      {/* Research Feed */}
      <section id="research-feed">
        <ResearchFeed selectedTiers={selectedTiers} />
      </section>
    </div>
  );
}
