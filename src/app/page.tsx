"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions } from "@/lib/data-loader";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import EvidenceSummaryCard from "@/components/EvidenceSummaryCard";
import NewsTicker from "@/components/NewsTicker";
import ResearchFeed from "@/components/ResearchFeed";
import Methodology from "@/components/Methodology";

const predictions = getAllPredictions();

export default function Home() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);

  const displacement = predictions.filter((p) => p.category === "displacement");
  const exposure = predictions.filter((p) => p.category === "exposure");
  const wages = predictions.filter((p) => p.category === "wages");
  const adoption = predictions.filter((p) => p.category === "adoption");
  const signals = predictions.filter((p) => p.category === "signals");

  // Aggregate stats for the hero
  const totalSources = predictions.reduce((sum, p) => sum + p.sources.length, 0);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-4 pb-0 sm:pt-6 sm:pb-0">
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
            Tracking {predictions.length} predictions across displacement, wages, adoption, and corporate signals
            &mdash; sourced from peer-reviewed research, government data, think tanks, and earnings calls.
            Filter by evidence quality to see how the picture changes.
          </p>
        </div>

        {/* News Ticker — directly below hero content */}
        <div className="relative mt-6">
          <NewsTicker />
        </div>
      </div>

      {/* Research Framing Banner + Filter */}
      <div className="space-y-10">
        {/* Research Framing Banner — compact */}
        <section>
          <div className="border border-black/[0.08] rounded-lg px-5 py-4 sm:px-6 sm:py-4">
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              <span className="font-semibold text-[var(--foreground)]">Bottom line up front:</span>{" "}
              AI exposure &ne; job loss. The evidence so far: sizable productivity gains, no macro displacement, but real and growing
              pressure on entry-level workers. Augmentation still outpaces automation.
            </p>
          </div>
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

      {/* AI Exposure & Risk */}
      {exposure.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
              AI Exposure &amp; Risk
            </h2>
            <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
              Share of jobs or tasks <em>exposed</em> to AI automation potential &mdash; exposure measures capability overlap,
              not actual job losses. A high exposure score means AI <em>could</em> perform those tasks, not that it <em>has</em>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {exposure.map((p) => (
              <PredictionSummaryCard
                key={p.id}
                prediction={p}
                selectedTiers={selectedTiers}
              />
            ))}
          </div>
        </section>
      )}

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

      {/* What the Evidence Actually Shows */}
      <section>
        <EvidenceSummaryCard />
      </section>

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
      <section id="research-feed">
        <ResearchFeed selectedTiers={selectedTiers} />
      </section>

      {/* Methodology & Sources */}
      <section>
        <Methodology />
      </section>
    </div>
  );
}
