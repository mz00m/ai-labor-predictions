/**
 * Build per-state aggregate risk scores by joining the precomputed
 * occupation-risk dataset with BLS OEWS state-level employment counts.
 *
 * Output: src/data/risk/state-risk.json
 *
 * Per-state risk = employment-weighted average of occupation netRisk100
 * across all matched occupations in that state.
 *
 * Run: npm run build:state-risk
 */
import { promises as fs } from "fs";
import path from "path";

type Archetype = "automation-risk" | "reorganize" | "grow" | "less-change";

interface OccRisk {
  slug: string;
  title: string;
  category: string;
  netRisk100: number;
  netRisk: number;
  pctHighRiskTime: number;
  pctMediumRiskTime: number;
  pctLowRiskTime: number;
  archetype?: Archetype;
}

interface SectorBreakdown {
  category: string;
  totalEmployment: number;
  share: number;            // % of state employment (matched only)
  weightedNetRisk100: number;
  pctHighRiskTime: number;
  pctMediumRiskTime: number;
  pctLowRiskTime: number;
  occupationCount: number;
}

interface OccRiskFile {
  occupations: OccRisk[];
}

interface SectorRiskRow {
  category: string;
  weightedNetRisk100: number;
  weightedNetRisk: number;
  pctHighRiskTime?: number;
}
interface SectorRiskFile {
  sectors: SectorRiskRow[];
}

const PRETTY_CATEGORY: Record<string, string> = {
  "office-and-administrative-support": "Office & Administrative Support",
  "business-and-financial": "Business & Financial Operations",
  "computer-and-information-technology": "Computer & IT",
  "math": "Mathematical",
  "architecture-and-engineering": "Architecture & Engineering",
  "life-physical-and-social-science": "Life, Physical & Social Science",
  "community-and-social-service": "Community & Social Service",
  "legal": "Legal",
  "education-training-and-library": "Education & Library",
  "arts-and-design": "Arts & Design",
  "media-and-communication": "Media & Communication",
  "entertainment-and-sports": "Entertainment & Sports",
  "healthcare": "Healthcare",
  "protective-service": "Protective Service",
  "food-preparation-and-serving": "Food Preparation & Serving",
  "building-and-grounds-cleaning": "Building & Grounds Cleaning",
  "personal-care-and-service": "Personal Care & Service",
  "sales": "Sales",
  "farming-fishing-and-forestry": "Farming, Fishing & Forestry",
  "construction-and-extraction": "Construction & Extraction",
  "installation-maintenance-and-repair": "Installation, Maintenance & Repair",
  "production": "Production",
  "transportation-and-material-moving": "Transportation & Material Moving",
  "management": "Management",
  "military": "Military",
};

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  "automation-risk": "automation-pressure",
  "reorganize": "reorganization",
  "grow": "growth",
  "less-change": "stability",
};

const ARCHETYPE_STORY: Record<Archetype, string> = {
  "automation-risk": "automation pressure on routine cognitive work as AI handles more of what these jobs do day-to-day",
  "reorganize": "reorganization more than displacement — workers stay essential, but the task mix and staffing levels shift around AI",
  "grow": "expanding access and output as cheaper AI-assisted services unlock new demand",
  "less-change": "limited near-term disruption, with work tied to AI-resistant tasks",
};

function generateNarrative(args: {
  regionLabel: string;     // e.g. "Texas" or "Travis County, TX"
  scope: "state" | "metro" | "county";
  netRisk100: number;
  archetypeMix: Record<Archetype, number>;
  topSectors: { category: string; share: number }[];
}): string {
  const { regionLabel, scope, netRisk100, archetypeMix, topSectors } = args;

  const dominant = (Object.entries(archetypeMix) as [Archetype, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "less-change";

  const top1 = topSectors[0];
  const top2 = topSectors[1];

  const top1Name = top1 ? PRETTY_CATEGORY[top1.category] ?? top1.category : null;
  const top2Name = top2 ? PRETTY_CATEGORY[top2.category] ?? top2.category : null;

  const scopeNoun = scope === "state" ? "state" : scope === "metro" ? "metro" : "county";

  const lead =
    netRisk100 >= 54
      ? `**${regionLabel}** sits at the higher end of AI labor pressure among US ${scopeNoun}s (score ${netRisk100}/100).`
      : netRisk100 >= 52
      ? `**${regionLabel}** tracks roughly average AI labor pressure for a US ${scopeNoun} (${netRisk100}/100).`
      : `**${regionLabel}** sits below the average US ${scopeNoun} on AI labor pressure (${netRisk100}/100).`;

  const composition =
    top1 && top2
      ? ` Its workforce is concentrated in ${top1Name} (${top1.share.toFixed(0)}% of jobs) and ${top2Name} (${top2.share.toFixed(0)}%).`
      : top1
      ? ` Its largest cluster is ${top1Name} at ${top1.share.toFixed(0)}% of jobs.`
      : "";

  const story = ` The dominant story is ${ARCHETYPE_LABEL[dominant]}: ${ARCHETYPE_STORY[dominant]}.`;

  return lead + composition + story;
}

/**
 * SOC 2-digit major-group prefix -> jobsdata sector slug. Used to fall back
 * unscored OEWS rows to their major-group's national-average risk so state
 * coverage is no longer capped at the 325 SOCs in our framework.
 */
const SOC_MAJOR_TO_CATEGORY: Record<string, string> = {
  "11": "management",
  "13": "business-and-financial",
  "15": "computer-and-information-technology",
  "17": "architecture-and-engineering",
  "19": "life-physical-and-social-science",
  "21": "community-and-social-service",
  "23": "legal",
  "25": "education-training-and-library",
  "27": "arts-and-design", // SOC 27 lumps arts/media/entertainment
  "29": "healthcare", // practitioners
  "31": "healthcare", // support — our data lumps them
  "33": "protective-service",
  "35": "food-preparation-and-serving",
  "37": "building-and-grounds-cleaning",
  "39": "personal-care-and-service",
  "41": "sales",
  "43": "office-and-administrative-support",
  "45": "farming-fishing-and-forestry",
  "47": "construction-and-extraction",
  "49": "installation-maintenance-and-repair",
  "51": "production",
  "53": "transportation-and-material-moving",
  "55": "military",
};

interface StateOcc {
  slug: string | null;
  soc: string;
  employment: number | null;
}

interface StateRow {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number | null;
  occupations: StateOcc[];
}

interface StateFile {
  generatedAt: string;
  year: number;
  source: string;
  states: StateRow[];
}

interface StateRiskOut {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  matchedEmployment: number; // sum across our 325 scored SOCs
  fullEmployment: number;    // matched + fallback (SOC major-group)
  coverage: number;          // matched / total, 0-1
  fullCoverage: number;      // (matched + fallback) / total, 0-1
  weightedNetRisk100: number; // matched-only (historical metric)
  weightedNetRisk: number;
  weightedNetRisk100Full: number; // with SOC major-group fallback
  weightedPctHighRiskTime: number;
  topRiskOccupations: { slug: string; title: string; employment: number; netRisk100: number }[];
  occupationCount: number;
  /** Per-BLS-major-group breakdown for the sector heatmap. */
  sectors: SectorBreakdown[];
  /** Employment share of each OpenAI Jobs Transition archetype (sum to 1.0). */
  archetypeMix: Record<Archetype, number>;
  /** Pre-rendered narrative sentence for the region. */
  narrative: string;
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const occPath = path.join(root, "src/data/risk/occupation-risk.json");
  const stPath = path.join(root, "src/data/regional/state-occupation-employment.json");
  const sectorPath = path.join(root, "src/data/risk/sector-risk.json");
  const outPath = path.join(root, "src/data/risk/state-risk.json");

  const occ: OccRiskFile = JSON.parse(await fs.readFile(occPath, "utf8"));
  const st: StateFile = JSON.parse(await fs.readFile(stPath, "utf8"));
  const sectorFile: SectorRiskFile = JSON.parse(await fs.readFile(sectorPath, "utf8"));

  const occBySlug = new Map<string, OccRisk>();
  for (const o of occ.occupations) occBySlug.set(o.slug, o);

  // Per-category mean risk for SOC major-group fallback.
  const sectorByCategory = new Map<string, SectorRiskRow>();
  for (const s of sectorFile.sectors) sectorByCategory.set(s.category, s);

  function fallbackRiskForSoc(soc: string): { risk100: number; pctHigh: number } | null {
    const major = soc.slice(0, 2);
    const category = SOC_MAJOR_TO_CATEGORY[major];
    if (!category) return null;
    const s = sectorByCategory.get(category);
    if (!s) return null;
    return {
      risk100: s.weightedNetRisk100,
      pctHigh: s.pctHighRiskTime ?? 0,
    };
  }

  const states: StateRiskOut[] = [];

  for (const s of st.states) {
    let sumWeight = 0;
    let sumRisk100 = 0;
    let sumRisk = 0;
    let sumPctHigh = 0;
    let sumFullWeight = 0;
    let sumFullRisk100 = 0;
    const rowsWithRisk: { slug: string; title: string; employment: number; netRisk100: number }[] = [];
    /** Per-category accumulator for the sector breakdown. */
    const sectorAcc = new Map<string, { jobs: number; risk100: number; hi: number; md: number; lo: number; n: number }>();

    const archetypeJobs: Record<Archetype, number> = {
      "automation-risk": 0,
      "reorganize": 0,
      "grow": 0,
      "less-change": 0,
    };

    for (const sOcc of s.occupations) {
      if (sOcc.employment == null) continue;
      const w = sOcc.employment;

      const o = sOcc.slug ? occBySlug.get(sOcc.slug) : null;
      if (o) {
        sumWeight += w;
        sumRisk100 += o.netRisk100 * w;
        sumRisk += o.netRisk * w;
        sumPctHigh += o.pctHighRiskTime * w;
        sumFullWeight += w;
        sumFullRisk100 += o.netRisk100 * w;
        rowsWithRisk.push({ slug: sOcc.slug!, title: o.title, employment: w, netRisk100: o.netRisk100 });

        // Accumulate per-category — both for sector breakdown
        const acc = sectorAcc.get(o.category) ?? { jobs: 0, risk100: 0, hi: 0, md: 0, lo: 0, n: 0 };
        acc.jobs += w;
        acc.risk100 += o.netRisk100 * w;
        acc.hi += o.pctHighRiskTime * w;
        acc.md += o.pctMediumRiskTime * w;
        acc.lo += o.pctLowRiskTime * w;
        acc.n += 1;
        sectorAcc.set(o.category, acc);

        if (o.archetype) {
          archetypeJobs[o.archetype] += w;
        }
      } else {
        // Unscored SOC — apply SOC major-group fallback if possible
        const fb = fallbackRiskForSoc(sOcc.soc);
        if (fb) {
          sumFullWeight += w;
          sumFullRisk100 += fb.risk100 * w;
        }
      }
    }

    if (sumWeight === 0) continue;

    rowsWithRisk.sort((a, b) => b.netRisk100 - a.netRisk100);

    const totalEmp = s.totalEmployment ?? sumFullWeight;

    // Materialize per-category sector breakdown, sorted by weighted risk
    const sectors: SectorBreakdown[] = Array.from(sectorAcc.entries())
      .map(([category, acc]) => ({
        category,
        totalEmployment: acc.jobs,
        share: sumWeight > 0 ? Number(((acc.jobs / sumWeight) * 100).toFixed(2)) : 0,
        weightedNetRisk100: Math.round(acc.risk100 / acc.jobs),
        pctHighRiskTime: Number((acc.hi / acc.jobs).toFixed(1)),
        pctMediumRiskTime: Number((acc.md / acc.jobs).toFixed(1)),
        pctLowRiskTime: Number((acc.lo / acc.jobs).toFixed(1)),
        occupationCount: acc.n,
      }))
      .sort((a, b) => b.weightedNetRisk100 - a.weightedNetRisk100);

    // Normalize archetype mix to shares
    const arcTotal = (Object.values(archetypeJobs) as number[]).reduce((s, x) => s + x, 0);
    const archetypeMix: Record<Archetype, number> = {
      "automation-risk": arcTotal > 0 ? archetypeJobs["automation-risk"] / arcTotal : 0,
      "reorganize": arcTotal > 0 ? archetypeJobs["reorganize"] / arcTotal : 0,
      "grow": arcTotal > 0 ? archetypeJobs["grow"] / arcTotal : 0,
      "less-change": arcTotal > 0 ? archetypeJobs["less-change"] / arcTotal : 0,
    };

    const topSectorsByShare = [...sectors].sort((a, b) => b.share - a.share).slice(0, 3);
    const narrative = generateNarrative({
      regionLabel: s.title,
      scope: "state",
      netRisk100: Math.round(sumFullRisk100 / sumFullWeight),
      archetypeMix,
      topSectors: topSectorsByShare,
    });

    states.push({
      fips: s.fips,
      abbr: s.abbr,
      title: s.title,
      totalEmployment: totalEmp,
      matchedEmployment: sumWeight,
      fullEmployment: sumFullWeight,
      coverage: totalEmp > 0 ? sumWeight / totalEmp : 0,
      fullCoverage: totalEmp > 0 ? sumFullWeight / totalEmp : 0,
      weightedNetRisk100: Math.round(sumRisk100 / sumWeight),
      weightedNetRisk: Number((sumRisk / sumWeight).toFixed(2)),
      weightedNetRisk100Full: Math.round(sumFullRisk100 / sumFullWeight),
      weightedPctHighRiskTime: Number((sumPctHigh / sumWeight).toFixed(1)),
      topRiskOccupations: rowsWithRisk.slice(0, 5),
      occupationCount: rowsWithRisk.length,
      sectors,
      archetypeMix,
      narrative,
    });
  }

  states.sort((a, b) => b.weightedNetRisk100Full - a.weightedNetRisk100Full);

  const out = {
    generatedAt: new Date().toISOString(),
    source: st.source,
    methodology:
      "Per-state risk has two flavors. weightedNetRisk100 is the employment-weighted average across the ~325 SOC codes that have direct entries in our occupation-risk framework (covers ~50% of state employment). weightedNetRisk100Full additionally applies SOC major-group fallback risk to unscored SOCs, lifting coverage to ~95% — this is the honest headline number. The two are usually within 1-2 points of each other, but Full removes the upward bias from selectively scoring office-heavy occupations.",
    stateCount: states.length,
    states,
  };

  await fs.writeFile(outPath, JSON.stringify(out, null, 2));
  console.error(`Wrote ${outPath}`);

  // Print top 5 / bottom 5 for sanity check
  console.log("\nTop 5 (full-coverage rank):");
  for (const s of states.slice(0, 5)) {
    console.log(
      `  ${s.abbr} ${s.title.padEnd(22)} full=${s.weightedNetRisk100Full} matched=${s.weightedNetRisk100} matchCov=${(s.coverage * 100).toFixed(0)}% fullCov=${(s.fullCoverage * 100).toFixed(0)}%`,
    );
  }
  console.log("\nBottom 5 (full-coverage rank):");
  for (const s of states.slice(-5)) {
    console.log(
      `  ${s.abbr} ${s.title.padEnd(22)} full=${s.weightedNetRisk100Full} matched=${s.weightedNetRisk100} matchCov=${(s.coverage * 100).toFixed(0)}% fullCov=${(s.fullCoverage * 100).toFixed(0)}%`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
