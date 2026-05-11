import type { Metadata } from "next";

import occupationRiskData from "@/data/risk/occupation-risk.json";
import sectorRiskData from "@/data/risk/sector-risk.json";
import stateRiskData from "@/data/risk/state-risk.json";
import statePathsData from "@/data/regional/us-states-svg-paths.json";

import MapHero from "@/components/map/MapHero";
import SectorHeatmap from "@/components/map/SectorHeatmap";
import OccupationRiskTable from "@/components/map/OccupationRiskTable";
import StateChoropleth from "@/components/map/StateChoropleth";
import MapMethodology from "@/components/map/MapMethodology";
import {
  OccupationRisk,
  OccupationRiskFile,
  SectorAggregate,
  SectorRisk,
  SectorRiskFile,
  prettyCategory,
} from "@/components/map/types";

export const metadata: Metadata = {
  title: "Risk Map | jobsdata.ai",
  description:
    "AI displacement risk mapped from task to occupation to sector across the US economy. 342 BLS occupations scored on a 5-variable framework, then employment-weighted into sector roll-ups.",
  openGraph: {
    title: "Risk Map | jobsdata.ai",
    description:
      "Where AI risk concentrates in the US economy. 342 occupations and 25 sectors, scored bottom-up from task to job to sector.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Risk Map | jobsdata.ai",
    description:
      "Where AI risk concentrates in the US economy — task to occupation to sector, across 342 BLS occupations.",
  },
};

// Build-time aggregation: derive per-sector time-share buckets by
// employment-weighting the occupation-level pctHighRiskTime etc. The sector
// data file does not yet ship those fields; this keeps the page resilient
// either way.
function aggregateSectors(
  occFile: OccupationRiskFile,
  sectorFile: SectorRiskFile
): SectorAggregate[] {
  const byCategory = new Map<
    string,
    { jobs: number; high: number; med: number; low: number }
  >();

  for (const occ of occFile.occupations) {
    const w = occ.jobs || 0;
    if (w === 0) continue;
    const prev = byCategory.get(occ.category) ?? {
      jobs: 0,
      high: 0,
      med: 0,
      low: 0,
    };
    prev.jobs += w;
    prev.high += w * (occ.pctHighRiskTime ?? 0);
    prev.med += w * (occ.pctMediumRiskTime ?? 0);
    prev.low += w * (occ.pctLowRiskTime ?? 0);
    byCategory.set(occ.category, prev);
  }

  return sectorFile.sectors.map((s: SectorRisk): SectorAggregate => {
    const agg = byCategory.get(s.category);
    let high = 0;
    let med = 0;
    let low = 0;
    if (agg && agg.jobs > 0) {
      high = agg.high / agg.jobs;
      med = agg.med / agg.jobs;
      low = agg.low / agg.jobs;
    } else if (typeof s.pctHighRiskTime === "number") {
      high = s.pctHighRiskTime;
      // Fallback split if only high is known
      med = Math.max(0, (100 - high) * 0.55);
      low = Math.max(0, 100 - high - med);
    }
    // Renormalize defensively
    const sum = high + med + low;
    if (sum > 0 && Math.abs(sum - 100) > 0.5) {
      const k = 100 / sum;
      high *= k;
      med *= k;
      low *= k;
    }

    return {
      ...s,
      label: s.label ?? prettyCategory(s.category),
      pctHighRiskTime: high,
      pctMediumRiskTime: med,
      pctLowRiskTime: low,
    };
  });
}

export default function MapPage() {
  const occupationFile = occupationRiskData as unknown as OccupationRiskFile;
  const sectorFile = sectorRiskData as unknown as SectorRiskFile;

  const occupations: OccupationRisk[] = occupationFile.occupations;

  // Distinct task categories observed in the data (for the hero stat).
  const taskCategoryCount = new Set(
    occupations.flatMap((o) => o.tasks.map((t) => t.category))
  ).size;

  const sectors = aggregateSectors(occupationFile, sectorFile).sort(
    (a, b) => b.weightedNetRisk - a.weightedNetRisk
  );

  const totalJobs = sectors.reduce((sum, s) => sum + (s.totalJobs || 0), 0);

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <div className="max-w-[1100px] mx-auto">
        <MapHero
          occupationCount={occupations.length}
          taskCategoryCount={taskCategoryCount}
          sectorCount={sectors.length}
          generatedAt={occupationFile.generatedAt ?? sectorFile.generatedAt}
        />

        <SectorHeatmap sectors={sectors} totalJobs={totalJobs} />

        <OccupationRiskTable occupations={occupations} />

        <section className="mt-16 sm:mt-20">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
              Section 03 &middot; Regional view
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-heading leading-tight">
              Where the risk lands on the map
            </h2>
            <p className="text-base text-[var(--muted)] leading-relaxed mt-2 max-w-[680px]">
              Per-state risk is the employment-weighted average of occupation
              risk across BLS OEWS May 2024 employment. MSA and county overlays
              are next.
            </p>
          </div>
          <StateChoropleth
            stateRisk={stateRiskData as any}
            statePaths={statePathsData as any}
          />
        </section>

        <MapMethodology />
      </div>
    </main>
  );
}
