"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  scoreAllOccupations,
  DIMENSION_META,
  type DimensionKey,
  type ScoredOccupation,
} from "@/lib/composite-risk";
import EnhancedTreemap from "./EnhancedTreemap";
import DimensionPanel from "./DimensionPanel";
import OccupationDetail from "./OccupationDetail";
import ComparisonTable from "./ComparisonTable";
import MethodologySection from "./MethodologySection";

function SectionLabel({ number }: { number: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2 opacity-60">
      {number}
    </p>
  );
}

export default function OccupationExposurePage() {
  const scored = useMemo(() => scoreAllOccupations(), []);
  const [activeDimension, setActiveDimension] =
    useState<DimensionKey>("netRisk");
  const [selectedOccupation, setSelectedOccupation] =
    useState<ScoredOccupation | null>(null);

  return (
    <article className="max-w-[740px] mx-auto">
      {/* ───── Header ───── */}
      <header className="mb-10">
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
          className="text-[18px] sm:text-[20px] text-[var(--muted)] leading-relaxed mb-5"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          AI exposure scores tell you which jobs AI <em>can</em> do. They
          don&rsquo;t tell you which jobs will actually be displaced &mdash;
          because that depends on five things, not one.
        </p>

        {/* Thesis card */}
        <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-4">
          <p
            className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-relaxed font-medium"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            A single &ldquo;AI exposure&rdquo; score conflates what AI{" "}
            <em>can</em> do with what will actually happen. Real displacement
            depends on how fast institutions adopt, whether workers can adapt,
            whether demand expands, and whether AI enhances or replaces. This
            tool scores 22 occupation groups across all five dimensions.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            22 occupation groups
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            154M workers
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            5 dimensions
          </span>
        </div>
      </header>

      {/* ───── Section 1: The Problem ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="01" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Why Exposure Alone Gets It Wrong
          </h2>
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              When Andrej Karpathy published his AI jobs treemap, it used a
              single dimension: &ldquo;digital AI exposure,&rdquo; scored 0-10
              by an LLM reading BLS job descriptions. That score captures
              something real &mdash; which jobs involve tasks that AI systems can
              plausibly perform. But it explicitly doesn&rsquo;t account for what
              happens next.
            </p>
            <p>
              An occupation can be highly exposed to AI and still grow in
              employment (software development, so far). Another can be
              moderately exposed and face severe displacement (office
              administration). The difference comes down to four additional
              factors that single-dimension scores omit.
            </p>
          </div>

          {/* Factor cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(
              [
                "adoptionSpeed",
                "adaptability",
                "demandElasticity",
                "complementarity",
              ] as DimensionKey[]
            ).map((key) => {
              const dim = DIMENSION_META[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveDimension(key)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    activeDimension === key
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.01]"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
                    {dim.isPressure ? "Pressure" : "Absorption"}
                  </p>
                  <p className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
                    {dim.label}
                  </p>
                  <p className="text-[12px] text-[var(--muted)] leading-snug mb-1.5">
                    {dim.description}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] opacity-60 leading-snug">
                    {dim.source}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Section 2: Interactive Treemap ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="02" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The Full Picture
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            Each rectangle is sized by total employment. Color encodes the
            selected dimension. Toggle between dimensions to see how the picture
            changes. Click any occupation for a full breakdown.
          </p>

          {/* Dimension selector */}
          <DimensionPanel
            activeDimension={activeDimension}
            onSelect={setActiveDimension}
          />

          {/* Treemap */}
          <div className="mt-4">
            <EnhancedTreemap
              data={scored}
              activeDimension={activeDimension}
              onSelect={setSelectedOccupation}
              selected={selectedOccupation}
            />
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{
                  background: DIMENSION_META[activeDimension].colorScale[0],
                }}
              />
              {DIMENSION_META[activeDimension].isPressure ? "Low" : "Low"}
            </span>
            <span className="font-medium">
              {DIMENSION_META[activeDimension].label}
            </span>
            <span className="flex items-center gap-1.5">
              {DIMENSION_META[activeDimension].isPressure ? "High" : "High"}
              <span
                className="w-3 h-3 rounded-sm"
                style={{
                  background: DIMENSION_META[activeDimension].colorScale[1],
                }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* ───── Selected Occupation Detail ───── */}
      {selectedOccupation && (
        <section className="mb-12">
          <OccupationDetail
            occupation={selectedOccupation}
            onClose={() => setSelectedOccupation(null)}
          />
        </section>
      )}

      {/* ───── Section 3: Comparison Table ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="03" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Where Exposure and Net Risk Diverge
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            These are the occupation groups where the multi-dimensional net risk
            score disagrees most with simple AI exposure. High-exposure groups
            with strong absorption factors (adaptability, elastic demand,
            complementarity) drop in net risk. Low-exposure groups in rigid
            institutions climb.
          </p>
          <ComparisonTable data={scored} />
        </div>
      </section>

      {/* ───── Section 4: Methodology ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="04" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Methodology
          </h2>
          <MethodologySection />
        </div>
      </section>

      {/* ───── Related ───── */}
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
  );
}
