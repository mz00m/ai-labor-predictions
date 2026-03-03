"use client";

import { useState } from "react";
import {
  getSignalMetrics,
  getPyPITaxonomy,
  getMonthlyDownloads,
} from "@/lib/pypi-data-loader";
import SignalHero from "@/components/signals/SignalHero";
import AutomationTimeSeries from "@/components/signals/AutomationTimeSeries";
import RatioTrend from "@/components/signals/RatioTrend";
import DomainHeatMap from "@/components/signals/DomainHeatMap";
import PackageTable from "@/components/signals/PackageTable";
import MethodologyNote from "@/components/signals/MethodologyNote";

const metrics = getSignalMetrics();
const taxonomy = getPyPITaxonomy();
const downloads = getMonthlyDownloads();

export default function SignalsPage() {
  const [viewMode, setViewMode] = useState<
    "absolute" | "growth" | "normalized"
  >("absolute");
  const [sortField, setSortField] = useState("rollingAvg3mGrowth");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  return (
    <div className="space-y-10">
      {/* Hero: AAI number + trend */}
      <SignalHero metrics={metrics} />

      {/* Section: Tier 2 Package Downloads Over Time */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Automation Package Trends
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Monthly PyPI downloads for AI agent, automation, and domain-specific
            packages. Toggle between absolute counts, growth rates, and
            normalized view.
          </p>
        </div>
        <AutomationTimeSeries
          downloads={downloads}
          taxonomy={taxonomy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </section>

      {/* Section: AAI Ratio Over Time */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Automation Acceleration Index
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Ratio of automation package growth to AI infrastructure growth
            &mdash; above 1.0 signals that automation tooling is outpacing
            general AI adoption.
          </p>
        </div>
        <RatioTrend aaiHistory={metrics.aaiHistory} />
      </section>

      {/* Section: Domain Heat Map */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Growth by Domain
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            3-month rolling average growth rate by functional area. Hotter
            colors indicate faster-growing domains where automation investment
            is concentrating.
          </p>
        </div>
        <DomainHeatMap domains={metrics.domains} />
      </section>

      {/* Section: Package Table */}
      <section>
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            All Tracked Packages
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
            Click column headers to sort. Breakout badges flag packages with
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

      {/* Methodology */}
      <MethodologyNote />
    </div>
  );
}
