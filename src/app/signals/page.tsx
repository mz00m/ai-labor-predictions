"use client";

import { useState } from "react";
import {
  getSignalMetrics,
  getSignalTaxonomy,
  getMonthlyDownloads,
  getBLSEmployment,
  getHuggingFaceData,
} from "@/lib/signal-data-loader";
import { getLastUpdated } from "@/lib/data-loader";
import SignalHero from "@/components/signals/SignalHero";
import IndustryGrid from "@/components/signals/IndustryGrid";
import PackageTable from "@/components/signals/PackageTable";
import MethodologyNote from "@/components/signals/MethodologyNote";
import AutomationExplainer from "@/components/signals/AutomationExplainer";
import ProductivityPaths from "@/components/signals/ProductivityPaths";

const metrics = getSignalMetrics();
const taxonomy = getSignalTaxonomy();
const downloads = getMonthlyDownloads();
const bls = getBLSEmployment();
const huggingface = getHuggingFaceData();
const lastUpdated = getLastUpdated();

export default function SignalsPage() {
  const [sortField, setSortField] = useState("rollingAvg3mGrowth");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  return (
    <div className="space-y-10">
      {/* Hero: AAI number + trend + industries to watch */}
      <SignalHero metrics={metrics} lastUpdated={lastUpdated} />

      {/* Jump link → productivity-paths */}
      <a
        href="#firm-response"
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

      {/* How AI Automation Works — interactive explainer */}
      <AutomationExplainer metrics={metrics} />

      {/* Anthropic: Theoretical vs Observed AI Coverage */}
      <section className="border border-black/[0.06] rounded-xl p-6 sm:p-8 bg-white/50">
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-full">
            Tier 1 &middot; Anthropic Research
          </span>
        </div>
        <h3 className="text-[20px] sm:text-[24px] font-bold text-[var(--foreground)] leading-tight mb-2">
          Theoretical Capability vs. Observed Exposure
        </h3>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-6 max-w-2xl">
          The gap between what AI <em>could</em> automate and what it <em>actually</em> handles
          today is enormous. Blue shows the share of tasks LLMs could theoretically perform;
          red shows measured usage from Claude API traffic. The discrepancy suggests we are
          still early in the diffusion phase &mdash; even in high-exposure categories like
          Office &amp; Admin and Computer &amp; Math.
        </p>
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/anthropic-ai-coverage-radar.png"
            alt="Radar chart showing theoretical AI capability (blue) vs observed AI coverage (red) across 22 occupational categories. Computer & math shows the widest gap with ~94% theoretical vs ~33% observed."
            className="w-full max-w-[600px] rounded-lg"
          />
        </div>
        <p className="text-[12px] text-[var(--muted)] mt-4 text-center">
          Source:{" "}
          <a
            href="https://www.anthropic.com/research/labor-market-impacts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
          >
            Massenkoff &amp; McCrory (2026)
          </a>
          , &ldquo;Labor market impacts of AI: A new measure and early evidence&rdquo;
        </p>
      </section>

      {/* Section: Industry Cards */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            AI Automation by Industry
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Click any industry to see the full breakdown: tool adoption trends,
            employment data, and which specific tools are driving growth.
          </p>
          <p className="text-[13px] text-[var(--muted)] mt-2">
            Each industry follows one of three paths:{" "}
            <a
              href="#firm-response"
              className="text-[var(--accent)] hover:underline"
            >
              <span className="font-semibold" style={{ color: "#F66B5C" }}>Reduce</span>
              {", "}
              <span className="font-semibold" style={{ color: "#16a34a" }}>Amplify</span>
              {", or "}
              <span className="font-semibold" style={{ color: "#5C61F6" }}>Expand</span>
            </a>
            .
          </p>
        </div>
        <IndustryGrid
          metrics={metrics}
          taxonomy={taxonomy}
          downloads={downloads}
          bls={bls}
          huggingface={huggingface}
        />
      </section>

      {/* Section: Full Package Table */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            All Tracked Tools
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Click column headers to sort. Surging badges flag tools with
            sustained rapid growth.
          </p>
        </div>
        <PackageTable
          packages={metrics.packages}
          taxonomy={taxonomy}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={(field) => {
            if (field === sortField) {
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
            } else {
              setSortField(field);
              setSortDirection("desc");
            }
          }}
        />
      </section>

      {/* What happens when workers get more productive — 3-path framework */}
      <ProductivityPaths />

      {/* Methodology */}
      <MethodologyNote />
    </div>
  );
}
