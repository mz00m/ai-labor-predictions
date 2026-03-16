"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions, getLastUpdated, getHeroStats } from "@/lib/data-loader";
import { getSourceCount, getSourceCountsByTier } from "@/lib/search-sources";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import NewsTicker from "@/components/NewsTicker";
import ResearchFeed from "@/components/ResearchFeed";
import FunnelStrip from "@/components/FunnelStrip";
import FeaturedReads from "@/components/FeaturedReads";
import ConceptExplainers from "@/components/ConceptExplainers";

const predictions = getAllPredictions();
const lastUpdated = getLastUpdated();
const heroStats = getHeroStats();
const tierCounts = getSourceCountsByTier();

function formatUpdatedDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `Updated ${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export default function Home() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);

  const displacement = predictions.filter((p) => p.category === "displacement");
  const wages = predictions.filter((p) => p.category === "wages");
  const adoption = predictions.filter((p) => p.category === "adoption");

  const totalSources = getSourceCount();

  return (
    <div className="space-y-0">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-1 pb-0 sm:pt-2 sm:pb-0">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#5C61F6]/[0.04] blur-3xl" />
          <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-[#5C61F6]/[0.03] blur-3xl" />
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
            <span className="opacity-50 mx-1">&middot;</span>
            <span className="normal-case font-semibold opacity-70">{formatUpdatedDate(lastUpdated)}</span>
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[#2E3650] leading-[1.05] max-w-4xl">
            How is AI <span className="text-[#F66B5C] italic">reshaping</span>
            <br className="hidden sm:block" /> the labor market?
          </h1>
          <p className="mt-4 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            ~{totalSources} sources, one pattern. AI adoption is accelerating, productivity is climbing,
            entry-level and freelance work is compressing, and jobs are changing faster than
            they&apos;re disappearing.
          </p>
          <p className="mt-3 text-[20px] sm:text-[22px] font-bold text-[#2E3650] leading-snug max-w-2xl">
            No measurable macro displacement, <span className="text-[#F66B5C] italic">yet.</span>
          </p>

          {/* Hero data triad — numbers emerge from behind the ticker, dissolve upward */}
          <div className="mt-6 relative grid grid-cols-3 pb-6">
            <a href="/research" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-opacity duration-200 opacity-[0.15] group-hover/stat:opacity-[0.25]" style={{ color: 'var(--accent)', letterSpacing: '-0.09em', maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>21<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Productivity boost</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Median of 18 studies</p>
            </a>
            <a href="#displacement" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 text-black/[0.10] group-hover/stat:text-black/[0.20]" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>{heroStats.projectedJobLoss}<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Projected job loss</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Weighted avg of {heroStats.projectedEstimateCount} estimates</p>
            </a>
            <a href="#displacement" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 text-emerald-600/[0.12] group-hover/stat:text-emerald-600/[0.25]" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>{heroStats.measuredJobLoss}<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Measured job loss</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Yale, Goldman, Dallas Fed</p>
            </a>
          </div>
        </div>

        {/* News Ticker — overlaps the bottom of the numbers, clipping them like a real object */}
        <div className="relative z-[3] -mt-6">
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
            {" "}<span className="opacity-50">|</span>{" "}
            <a href="/learn/reading-list" className="normal-case font-semibold opacity-60 hover:opacity-100 transition-opacity">
              See all &rarr;
            </a>
          </p>
          <FeaturedReads />
        </div>
      </div>

      {/* Evidence Funnel */}
      <section className="mt-20">
        <FunnelStrip />
      </section>

      {/* Section break — Predictions Over Time */}
      <div className="relative -mx-6 sm:-mx-10 mt-20">
        <div className="h-1 bg-gradient-to-r from-[#3ECFAE] via-[#6B7BF7] to-[#F7C96B]" />
        <div className="px-6 sm:px-10 pt-10 pb-2">
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-[var(--foreground)] leading-tight mb-3">
            Predictions Over Time
          </h2>
          <p className="text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            {predictions.length} predictions across job displacement, wages, and AI adoption, each with its own trend chart, source list, and weighted estimate built from {totalSources}+ sources. Click any tile to explore. Every source is color-coded by evidence quality; use the tiers below to filter what appears.
          </p>
        </div>
      </div>

      {/* Evidence Filter + all prediction sections in one block so sticky works */}
      <div className="mt-12">
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
          tierCounts={tierCounts}
          sticky
        />

        {/* Job Displacement & Restructuring */}
        <section id="displacement" className="mt-16">
          <div className="mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch rounded-full bg-red-400/60 shrink-0" />
            <div>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
                Job Displacement &amp; Restructuring
              </h2>
              <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
                Projected share of jobs eliminated, restructured, or significantly transformed by AI. Most evidence points to task-level transition rather than wholesale replacement
              </p>
            </div>
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
        <section id="wages" className="mt-12">
          <div className="mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch rounded-full bg-blue-400/60 shrink-0" />
            <div>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
                Wage Impact
              </h2>
              <p className="text-[15px] text-[var(--muted)] mt-2 max-w-xl">
                How AI adoption is projected to affect compensation across worker segments
              </p>
            </div>
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
          <section className="mt-12">
            <div className="mb-8 flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-emerald-400/60 shrink-0" />
              <div>
                <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
                  AI Adoption
                </h2>
                <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
                  How rapidly companies are deploying AI, how much of the workforce is exposed, and corporate signaling on earnings calls. <strong className="text-[var(--foreground)]">Exposure does not mean displacement or job loss.</strong>
                </p>
              </div>
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


        {/* Concept Explainers */}
        <ConceptExplainers />

        {/* Research Feed */}
        <section id="research-feed" className="mt-10">
          <ResearchFeed selectedTiers={selectedTiers} />
        </section>
      </div>
    </div>
  );
}
