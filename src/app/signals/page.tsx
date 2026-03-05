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
        href="#productivity-paths"
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
              href="#productivity-paths"
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
