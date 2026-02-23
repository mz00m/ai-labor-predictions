"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions } from "@/lib/data-loader";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import EvidenceSummaryCard from "@/components/EvidenceSummaryCard";
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

  return (
    <div className="space-y-14">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 py-12 sm:py-16">
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
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-3xl">
            How is AI reshaping the labor market?
          </h1>
          <p className="mt-5 text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl">
            Tracking {predictions.length} predictions across displacement, wages, adoption, and corporate signals
            &mdash; sourced from peer-reviewed research, government data, think tanks, and earnings calls.
            Filter by evidence quality to see how the picture changes.
          </p>
        </div>
      </div>

      {/* Research Framing + Evidence + Filter — tighter spacing */}
      <div className="space-y-10">
        {/* Research Framing Banner */}
        <section>
          <div className="border border-black/[0.08] rounded-xl px-6 py-5 sm:px-8 sm:py-6 bg-[var(--accent-light)]/40">
            <div className="flex gap-3 sm:gap-4">
              <div className="shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
                  A note on reading these predictions
                </p>
                <p className="text-[14px] sm:text-[15px] text-[var(--foreground)]/80 leading-relaxed">
                  AI &ldquo;exposure&rdquo; is not the same as job loss. Across a growing body of empirical
                  research &mdash; from comprehensive reviews to ADP payroll analysis to firm spending
                  data &mdash; a consistent picture is emerging: no mass displacement at the macro level,
                  but real and growing pressure on entry-level workers in highly AI-exposed occupations.
                  Productivity gains of 20&ndash;60% are reshaping <em>what</em> workers do more
                  than <em>whether</em> they work. The key distinction is
                  between <strong>automation</strong> (replacing tasks) and <strong>augmentation</strong> (enhancing
                  them) &mdash; and the latest data shows augmentation is still the dominant pattern.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What the Evidence Actually Shows */}
        <section>
          <EvidenceSummaryCard />
        </section>

        {/* Evidence Filter */}
        <section>
          <EvidenceFilter
            selectedTiers={selectedTiers}
            onChange={setSelectedTiers}
          />
        </section>
      </div>

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

      {/* Scenario Callout */}
      <section className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 py-12 sm:py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/[0.03] to-[#3b82f6]/[0.03] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
            What if these predictions are right?
          </p>
          <p className="text-[17px] text-[var(--foreground)] leading-relaxed font-medium">
            See how the displacement trends tracked above could cascade into broader economic risk
            &mdash; from payroll compression to consumer spending declines to mortgage market stress.
          </p>
          <a
            href="https://www.citriniresearch.com/p/2028gic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-[14px] font-semibold text-[var(--accent)] hover:underline"
          >
            Read &ldquo;The 2028 Global Intelligence Crisis&rdquo;
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </section>

      {/* Research Feed */}
      <section>
        <ResearchFeed selectedTiers={selectedTiers} />
      </section>
    </div>
  );
}
