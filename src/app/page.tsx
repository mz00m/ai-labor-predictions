"use client";

import { useState } from "react";
import { EvidenceTier } from "@/lib/types";
import { getAllPredictions, getLastUpdated } from "@/lib/data-loader";
import { getSourceCount } from "@/lib/search-sources";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionSummaryCard from "@/components/PredictionSummaryCard";
import NewsTicker from "@/components/NewsTicker";
import ResearchFeed from "@/components/ResearchFeed";
import FunnelStrip from "@/components/FunnelStrip";
import ProductivityPredictions from "@/components/ProductivityPredictions";
import ResearchEvidence from "@/components/ResearchEvidence";
import FeaturedReads from "@/components/FeaturedReads";
import AgeUsageTile from "@/components/AgeUsageTile";

const predictions = getAllPredictions();
const lastUpdated = getLastUpdated();

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
    <div className="space-y-16">
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
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-4xl">
            How is AI <span className="text-[#F66B5C] italic">reshaping</span>
            <br className="hidden sm:block" /> the labor market?
          </h1>
          <p className="mt-4 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            ~{totalSources} sources, one pattern. AI adoption is accelerating, productivity is climbing,
            entry-level and freelance work is compressing, and jobs are changing faster than
            they&apos;re disappearing.
          </p>
          <p className="mt-3 text-[20px] sm:text-[22px] font-bold text-[var(--foreground)] leading-snug max-w-2xl">
            No measurable macro displacement &mdash; <span className="text-[#F66B5C] italic">yet.</span>
          </p>

          {/* Hero data triad */}
          <div className="mt-6 grid grid-cols-3 border-t border-black/[0.06]">
            <a href="#research-evidence" className="group/stat relative overflow-hidden py-6 px-4 no-underline text-center">
              <span className="absolute inset-0 flex items-center justify-center stat-number text-[100px] sm:text-[130px] font-black leading-none pointer-events-none select-none transition-opacity duration-200 opacity-[0.06] group-hover/stat:opacity-[0.18]" style={{ color: 'var(--accent)', letterSpacing: '-0.09em' }}>21<span className="text-[40px] sm:text-[50px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Productivity boost</p>
              <p className="relative text-[11px] text-[var(--muted)] opacity-50 leading-snug">Median of 18 studies</p>
            </a>
            <a href="#displacement" className="group/stat relative overflow-hidden py-6 px-4 border-l border-black/[0.06] no-underline text-center">
              <span className="absolute inset-0 flex items-center justify-center stat-number text-[100px] sm:text-[130px] font-black leading-none text-black/[0.04] group-hover/stat:text-black/[0.10] transition-colors duration-200 pointer-events-none select-none">3<span className="text-[40px] sm:text-[50px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Projected job loss</p>
              <p className="relative text-[11px] text-[var(--muted)] opacity-50 leading-snug">Weighted avg of 14 estimates</p>
            </a>
            <a href="#displacement" className="group/stat relative overflow-hidden py-6 px-4 border-l border-black/[0.06] no-underline text-center">
              <span className="absolute inset-0 flex items-center justify-center stat-number text-[100px] sm:text-[130px] font-black leading-none text-emerald-600/[0.06] group-hover/stat:text-emerald-600/[0.18] transition-colors duration-200 pointer-events-none select-none">0<span className="text-[40px] sm:text-[50px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Measured job loss</p>
              <p className="relative text-[11px] text-[var(--muted)] opacity-50 leading-snug">Yale, Goldman, Dallas Fed</p>
            </a>
          </div>
          <p className="mt-4 text-[14px] text-[var(--muted)] italic opacity-80 text-right">
            The gap between the near future and the present reality defines this moment.
          </p>
        </div>

        {/* News Ticker — directly below hero content */}
        <div className="relative mt-8">
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

      {/* Section break — Predictions Over Time */}
      <div className="relative -mx-6 sm:-mx-10">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
        <div className="px-6 sm:px-10 pt-10 pb-2">
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-[var(--foreground)] leading-tight mb-3">
            Predictions Over Time
          </h2>
          <p className="text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            {predictions.length} predictions across job displacement, wages, and AI adoption — each with its own trend chart, source list, and weighted estimate built from {totalSources}+ sources. Click any tile to explore. Every source is color-coded by evidence quality; use the tiers below to filter what appears.
          </p>
        </div>
      </div>

      {/* Evidence Filter — full version in-flow */}
      <section>
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
        />
      </section>

      {/* Compact sticky tier bar */}
      <div className="sticky top-12 z-40 bg-white/95 backdrop-blur-sm -mx-6 sm:-mx-10 px-6 sm:px-10 py-0 border-b border-black/[0.06] flex items-center justify-between gap-4">
        <div className="flex items-center gap-0">
          {([1, 2, 3, 4] as EvidenceTier[]).map((tier) => {
            const checked = selectedTiers.includes(tier);
            const colors: Record<number, string> = { 1: "#16a34a", 2: "#2563eb", 3: "#ea580c", 4: "#dc2626" };
            const labels: Record<number, string> = { 1: "Research", 2: "Institutional", 3: "Journalism", 4: "Social" };
            return (
              <button
                key={tier}
                onClick={() => {
                  if (checked && selectedTiers.length === 1) return;
                  setSelectedTiers(
                    checked
                      ? selectedTiers.filter((t) => t !== tier)
                      : [...selectedTiers, tier].sort((a, b) => a - b)
                  );
                }}
                className={`relative px-3 sm:px-4 py-2.5 text-[11px] sm:text-[12px] font-medium cursor-pointer transition-colors duration-150 ${
                  checked
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] opacity-40 hover:opacity-70"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors[tier] }}
                  />
                  <span className="hidden sm:inline">{labels[tier]}</span>
                </span>
                {checked && (
                  <span
                    className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-[2px] rounded-full"
                    style={{ backgroundColor: colors[tier] }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTiers([1] as EvidenceTier[])}
            className={`text-[11px] font-medium cursor-pointer transition-colors duration-150 ${
              selectedTiers.length === 1 && selectedTiers[0] === 1
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Research only
          </button>
          <span className="text-black/[0.1]">|</span>
          <button
            onClick={() => setSelectedTiers([1, 2, 3, 4] as EvidenceTier[])}
            className={`text-[11px] font-medium cursor-pointer transition-colors duration-150 ${
              selectedTiers.length === 4
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Job Displacement & Restructuring */}
      <section id="displacement">
        <div className="mb-8 flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-red-400/60 shrink-0" />
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
              Job Displacement &amp; Restructuring
            </h2>
            <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
              Projected share of jobs eliminated, restructured, or significantly transformed by AI &mdash; most evidence points to task-level transition rather than wholesale replacement
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
      <section id="wages">
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
        <section>
          <div className="mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch rounded-full bg-emerald-400/60 shrink-0" />
            <div>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
                AI Adoption
              </h2>
              <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
                How rapidly companies are deploying AI, how much of the workforce is exposed, and corporate signaling on earnings calls
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

      {/* ChatGPT Usage by Age */}
      <AgeUsageTile />

      {/* Productivity Predictions */}
      <ProductivityPredictions />

      {/* Link → signals productivity paths */}
      <a
        href="/signals#productivity-paths"
        className="group flex items-center gap-2 text-[15px] font-semibold text-[var(--accent)] hover:text-[#5C61F6] transition-colors -mt-4"
      >
        What happens when workers get more productive?
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        >
          <path d="M4 9h10m0 0l-4-4m4 4l-4 4" />
        </svg>
      </a>

      {/* Research Evidence */}
      <ResearchEvidence />

      {/* Research Feed */}
      <section id="research-feed">
        <ResearchFeed selectedTiers={selectedTiers} />
      </section>
    </div>
  );
}
