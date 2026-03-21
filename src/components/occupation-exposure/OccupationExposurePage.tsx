"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  scoreAllOccupations,
  DIMENSION_META,
  type DimensionKey,
  type ScoredOccupation,
} from "@/lib/composite-risk";
import {
  scoreKarpathyOccupations,
  type ScoredKarpathyOccupation,
} from "@/lib/karpathy-scoring";
import karpathyData from "@/data/karpathy-jobs.json";
import KarpathyTreemap from "./KarpathyTreemap";
import DimensionPanel from "./DimensionPanel";
import ComparisonTable from "./ComparisonTable";
import MethodologySection from "./MethodologySection";
import NetRiskScale from "./NetRiskScale";


function SectionLabel({ number }: { number: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2 opacity-60">
      {number}
    </p>
  );
}

const DIMENSION_EXPLAINERS: {
  key: DimensionKey;
  label: string;
  role: string;
  roleColor: string;
  oneLiner: string;
  anchor: string;
  pageLink?: string;
}[] = [
  {
    key: "technicalExposure",
    label: "Technical Exposure",
    role: "Pressure",
    roleColor: "#DC2626",
    oneLiner:
      "How many of this job's tasks can AI actually perform today?",
    anchor: "methodology-exposure",
  },
  {
    key: "adoptionSpeed",
    label: "Adoption Speed",
    role: "Pressure",
    roleColor: "#DC2626",
    oneLiner:
      "How fast will this sector's firms actually deploy AI? (Regulated industries lag years behind tech.)",
    anchor: "methodology-adoption",
  },
  {
    key: "adaptability",
    label: "Worker Adaptability",
    role: "Buffer",
    roleColor: "#16A34A",
    oneLiner:
      "Can displaced workers retrain and transition? (Wealth, transferable skills, age, geography.)",
    anchor: "methodology-adaptability",
  },
  {
    key: "demandElasticity",
    label: "Demand Elasticity",
    role: "Buffer",
    roleColor: "#16A34A",
    oneLiner:
      "When AI makes output cheaper, does demand expand enough to offset job losses? (ATMs led to *more* bank tellers for 30 years.)",
    anchor: "methodology-elasticity",
    pageLink: "/demand-elasticity",
  },
  {
    key: "complementarity",
    label: "AI Complementarity",
    role: "Buffer",
    roleColor: "#16A34A",
    oneLiner:
      "Does AI replace workers or make them more productive? (CFO surveys show management is enhanced, admin is replaced.)",
    anchor: "methodology-complementarity",
  },
];

export default function OccupationExposurePage() {
  const scored = useMemo(() => scoreAllOccupations(), []);
  const scoredKarpathy = useMemo(
    () => scoreKarpathyOccupations(karpathyData as any),
    []
  );
  const [activeDimension, setActiveDimension] =
    useState<DimensionKey>("netRisk");
  const [selectedOcc, setSelectedOcc] =
    useState<ScoredKarpathyOccupation | null>(null);


  return (
    <>
      {/* ───── Narrow-column text ───── */}
      <article className="max-w-[740px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            Analysis
          </p>
          <h1
            className="text-[36px] sm:text-[44px] font-extrabold text-[var(--foreground)] leading-[1.1] tracking-tight mb-4"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Beyond Exposure: What Actually Predicts Displacement
          </h1>
          <p
            className="text-[17px] sm:text-[19px] text-[var(--muted)] leading-relaxed mb-4"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Karpathy&rsquo;s AI jobs treemap scores 342 occupations on a single
            axis: &ldquo;digital AI exposure.&rdquo; That captures which tasks AI{" "}
            <em>can</em> do &mdash; but not which jobs will actually be displaced.
            We rebuild his exact visualization with the same 342 BLS occupations,
            then add four additional research-backed dimensions.
          </p>

          <a
            href="#treemap"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent-text)] hover:underline mb-5"
          >
            Jump to interactive chart &darr;
          </a>

          {/* 5 dimensions — compact list */}
          <div className="border border-black/[0.06] rounded-lg divide-y divide-black/[0.06] mb-2">
            {DIMENSION_EXPLAINERS.map((dim) => (
              <button
                key={dim.key}
                onClick={() => setActiveDimension(dim.key)}
                className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors ${
                  activeDimension === dim.key
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-black/[0.01]"
                }`}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider w-[52px] flex-shrink-0 text-center"
                  style={{ color: dim.roleColor }}
                >
                  {dim.role}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-semibold text-[var(--foreground)]">
                    {dim.label}
                  </span>
                  <span className="text-[10.5px] text-[var(--muted)] ml-1.5 leading-tight">
                    {dim.oneLiner}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`#${dim.anchor}`}
                    className="text-[10px] text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Research &darr;
                  </a>
                  {dim.pageLink && (
                    <Link
                      href={dim.pageLink}
                      className="text-[10px] text-[var(--accent-text)] hover:underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explainer &rarr;
                    </Link>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-snug">
            Net Risk = weighted combination of 2 pressure factors minus 3 buffer
            factors, bounded 0-10. <a href="#methodology" className="text-[var(--accent-text)] hover:underline">Full methodology below.</a>
          </p>
        </header>
      </article>

      {/* ───── Full-width treemap section ───── */}
      <section id="treemap" className="mb-12 bg-[#0a0a0f] -mx-6 sm:-mx-10 px-3 sm:px-4 py-6 rounded-xl scroll-mt-4">
        <div className="max-w-[1800px] mx-auto">
          {/* Dimension toggle */}
          <div className="mb-4">
            <DimensionPanel
              activeDimension={activeDimension}
              onSelect={setActiveDimension}
            />
          </div>

          {/* Canvas treemap */}
          <KarpathyTreemap
            data={scoredKarpathy}
            activeDimension={activeDimension}
            onSelect={setSelectedOcc}
          />
        </div>

        {/* Selected occupation detail (inline below treemap) */}
        {selectedOcc && (
          <div className="max-w-[1800px] mx-auto mt-4">
            <div className="bg-[#12121a] border border-white/[0.1] rounded-lg p-4 sm:p-5 relative">
              <button
                onClick={() => setSelectedOcc(null)}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left: occupation info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-bold text-white mb-1">
                    {selectedOcc.raw.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-[11px] text-white/50 mb-3">
                    {selectedOcc.raw.jobs && (
                      <span>{(selectedOcc.raw.jobs / 1000).toFixed(0)}K workers</span>
                    )}
                    {selectedOcc.raw.pay && (
                      <span>| ${(selectedOcc.raw.pay / 1000).toFixed(0)}K/yr</span>
                    )}
                    {selectedOcc.raw.outlook !== null && (
                      <span>| {selectedOcc.raw.outlook > 0 ? "+" : ""}{selectedOcc.raw.outlook}% BLS outlook ({selectedOcc.raw.outlook_desc})</span>
                    )}
                    <span>| {selectedOcc.raw.education}</span>
                  </div>
                  <p className="text-[12px] text-white/60 leading-relaxed">
                    {selectedOcc.raw.exposure_rationale}
                  </p>
                </div>

                {/* Right: dimension scores */}
                <div className="w-full sm:w-72 flex-shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    5-Dimension Scores
                  </p>
                  {(
                    [
                      "technicalExposure",
                      "adoptionSpeed",
                      "adaptability",
                      "demandElasticity",
                      "complementarity",
                    ] as DimensionKey[]
                  ).map((key) => {
                    const val = selectedOcc.scores[key];
                    const meta = DIMENSION_META[key];
                    const barColor = meta.isPressure
                      ? val > 6 ? "#DC2626" : val > 3 ? "#F59E0B" : "#16A34A"
                      : val > 6 ? "#16A34A" : val > 3 ? "#F59E0B" : "#DC2626";
                    return (
                      <div key={key} className="mb-1.5">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-white/70">
                            {meta.shortLabel}
                          </span>
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: barColor, fontFamily: "'DM Mono', monospace" }}
                          >
                            {val.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(val / 10) * 100}%`, background: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* Net risk */}
                  <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white/80">
                      Net Displacement Risk
                    </span>
                    <span
                      className="text-[16px] font-black"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: selectedOcc.scores.netRisk > 6 ? "#DC2626" : selectedOcc.scores.netRisk > 4 ? "#F59E0B" : "#16A34A",
                      }}
                    >
                      {selectedOcc.scores.netRisk.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* BLS link */}
              {selectedOcc.raw.url && (
                <a
                  href={selectedOcc.raw.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[11px] text-white/40 hover:text-white/70 transition-colors"
                >
                  View on BLS Occupational Outlook Handbook &rarr;
                </a>
              )}
            </div>
          </div>
        )}
        {/* ───── Net Risk Scale explainer ───── */}
        <div className="max-w-[1800px] mx-auto mt-6">
          <NetRiskScale />
        </div>
      </section>

      {/* ───── Back to narrow column for analysis sections ───── */}
      <article className="max-w-[740px] mx-auto">
        {/* Comparison Table */}
        <section className="mb-12">
          <div className="border-t border-black/[0.06] pt-8">
            <SectionLabel number="02" />
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
              Where Exposure and Net Risk Diverge
            </h2>
            <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
              These are the occupation groups where the multi-dimensional net risk
              score disagrees most with simple AI exposure. High-exposure groups
              with strong buffer factors (adaptability, elastic demand,
              complementarity) drop in net risk. Low-exposure groups in rigid
              institutions climb.
            </p>
            <ComparisonTable data={scored} />
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="mb-12 scroll-mt-8">
          <div className="border-t border-black/[0.06] pt-8">
            <SectionLabel number="03" />
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
              Methodology
            </h2>
            <MethodologySection />
          </div>
        </section>

        {/* Related */}
        <section className="mb-4">
          <div className="border-t border-black/[0.06] pt-8">
            <h3 className="text-[14px] font-bold text-[var(--foreground)] mb-3">
              Related explorations
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/task-visualizer"
                className="text-[13px] font-medium text-[var(--accent-text)] hover:underline"
              >
                Task-level visualizer
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/task-visualizer/economy"
                className="text-[13px] font-medium text-[var(--accent-text)] hover:underline"
              >
                Economy-wide view
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/demand-elasticity"
                className="text-[13px] font-medium text-[var(--accent-text)] hover:underline"
              >
                Demand elasticity explainer
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/predictions"
                className="text-[13px] font-medium text-[var(--accent-text)] hover:underline"
              >
                All predictions
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
