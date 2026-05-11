import type { Metadata } from "next";

import occupationRiskData from "@/data/risk/occupation-risk.json";
import sectorRiskData from "@/data/risk/sector-risk.json";
import stateRiskData from "@/data/risk/state-risk.json";
import chatgptUseData from "@/data/risk/state-chatgpt-use.json";
import countyRiskData from "@/data/risk/county-risk.json";
import statePathsData from "@/data/regional/us-states-svg-paths.json";
import msaPathsData from "@/data/regional/us-msas-svg-paths.json";
import msaSummaryData from "@/data/regional/msa-summary.json";
import crosswalkData from "@/data/regional/cbsa-county-crosswalk.json";

import OccupationRiskTable from "@/components/map/OccupationRiskTable";
import RegionalExplorer from "@/components/map/RegionalExplorer";
import MapMethodology from "@/components/map/MapMethodology";
import {
  OccupationRisk,
  OccupationRiskFile,
  SectorAggregate,
  SectorRisk,
  SectorRiskFile,
  prettyCategory,
} from "@/components/map/types";

/** Per-share-URL metadata. When a share URL carries ?view=metro&id=12420,
 *  the OG image route renders a per-region card so Twitter/LinkedIn/etc.
 *  show the specific selection rather than the generic site card. */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { view?: string; id?: string };
}): Promise<Metadata> {
  const view =
    searchParams.view === "country" ||
    searchParams.view === "metro" ||
    searchParams.view === "county"
      ? searchParams.view
      : null;
  const id = typeof searchParams.id === "string" ? searchParams.id : null;

  // Resolve the selection to a label + key stat for title/description
  let label = "Risk Map";
  let stat: string | null = null;

  if (view && id) {
    if (view === "country") {
      const s = (stateRiskData as any).states.find((x: any) => x.fips === id);
      if (s) {
        label = s.title;
        const pct =
          s.archetypeMix?.["automation-risk"] != null
            ? Math.round(s.archetypeMix["automation-risk"] * 100)
            : null;
        stat = pct != null ? `${pct}% of jobs in automation-risk occupations` : null;
      }
    } else if (view === "metro") {
      const m = (msaSummaryData as any).areas.find((x: any) => x.cbsa === id);
      if (m) {
        label = m.title;
        const pct =
          m.archetypeMix?.["automation-risk"] != null
            ? Math.round(m.archetypeMix["automation-risk"] * 100)
            : null;
        stat = pct != null ? `${pct}% of jobs in automation-risk occupations` : null;
      }
    } else if (view === "county") {
      const c = (countyRiskData as any).counties.find((x: any) => x.fips === id);
      if (c) {
        label = c.name;
        const pct =
          c.archetypeMix?.["automation-risk"] != null
            ? Math.round(c.archetypeMix["automation-risk"] * 100)
            : null;
        stat = pct != null ? `${pct}% of jobs in automation-risk occupations` : null;
      }
    }
  }

  const title =
    label === "Risk Map"
      ? "Risk Map | jobsdata.ai"
      : `${label}: AI Labor Risk | jobsdata.ai`;
  const description =
    stat ?? "AI displacement risk mapped from task to occupation to sector across the US economy.";

  const ogParams = new URLSearchParams();
  if (view) ogParams.set("view", view);
  if (id) ogParams.set("id", id);
  const ogImage = ogParams.toString() ? `/map/og?${ogParams.toString()}` : "/map/og";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://jobsdata.ai/map",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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

  const sectors = aggregateSectors(occupationFile, sectorFile).sort(
    (a, b) => b.weightedNetRisk - a.weightedNetRisk
  );

  const totalJobs = sectors.reduce((sum, s) => sum + (s.totalJobs || 0), 0);

  // Lightweight occupation list for search autocomplete (avoid shipping the
  // full risk JSON to the client).
  const occupationsLite = occupations.map((o) => ({ slug: o.slug, title: o.title }));

  // Top-5 representative occupations per BLS major-group slug, by national
  // employment. Used by the county sidebar's expandable drill-through:
  // since ACS doesn't publish detailed-SOC by county, expanding a major
  // group shows the dominant national occupations in that group, each
  // linkable to its /occupation-exposure/[slug] page.
  const topOccupationsByCategory: Record<
    string,
    { slug: string; title: string; netRisk100: number; jobs: number }[]
  > = {};
  for (const occ of occupations) {
    if (!occ.jobs) continue;
    if (!topOccupationsByCategory[occ.category]) topOccupationsByCategory[occ.category] = [];
    topOccupationsByCategory[occ.category].push({
      slug: occ.slug,
      title: occ.title,
      netRisk100: occ.netRisk100,
      jobs: occ.jobs,
    });
  }
  for (const cat of Object.keys(topOccupationsByCategory)) {
    topOccupationsByCategory[cat] = topOccupationsByCategory[cat]
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 5);
  }

  return (
    <main className="pt-6 sm:pt-8 pb-16">
      {/* Full-width hero strip + explorer */}
      <section className="px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Compact eyebrow + headline above the map */}
          <div className="mb-5 sm:mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
              Risk map &middot; tasks &rarr; jobs &rarr; sectors &rarr; regions
            </p>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-bold text-heading leading-[1.05] tracking-tight">
                Where AI risk lands<br className="hidden sm:block" /> on the US economy
              </h1>
              <p className="text-sm text-[var(--muted)] max-w-[460px] leading-relaxed">
                {occupations.length.toLocaleString("en-US")} occupations scored on a 5-variable framework,
                rolled up to {sectors.length} sectors and projected onto every US county, metro,
                and state.
              </p>
            </div>
          </div>

          <RegionalExplorer
            stateRisk={stateRiskData as any}
            statePaths={statePathsData as any}
            msaPaths={msaPathsData as any}
            msaSummary={msaSummaryData as any}
            countyRisk={countyRiskData as any}
            crosswalk={crosswalkData as any}
            chatgptUse={chatgptUseData as any}
            occupations={occupationsLite}
            topOccupationsByCategory={topOccupationsByCategory}
            nationalSectors={sectors}
            nationalTotalJobs={totalJobs}
          />
        </div>
      </section>

      {/* Downstream constrained sections */}
      <div className="px-6 sm:px-10">
        <div className="max-w-[1100px] mx-auto">
          <section className="mt-16 sm:mt-20 mb-16">
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-baseline justify-between gap-4 border-t border-strong pt-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-60 mb-1">
                      Appendix
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-heading leading-tight">
                      Browse all {occupations.length.toLocaleString("en-US")} occupations
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-1 max-w-[640px]">
                      The full sortable, filterable table behind the regional roll-ups.
                    </p>
                  </div>
                  <span className="text-2xs text-[var(--muted)] group-open:hidden shrink-0 pt-2">
                    Show table &darr;
                  </span>
                  <span className="text-2xs text-[var(--muted)] hidden group-open:inline shrink-0 pt-2">
                    Hide table &uarr;
                  </span>
                </div>
              </summary>
              <div className="mt-6">
                <OccupationRiskTable occupations={occupations} />
              </div>
            </details>
          </section>

          <MapMethodology />
        </div>
      </div>
    </main>
  );
}
