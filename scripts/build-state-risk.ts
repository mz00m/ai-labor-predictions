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

interface OccRisk {
  slug: string;
  title: string;
  category: string;
  netRisk100: number;
  netRisk: number;
  pctHighRiskTime: number;
  pctMediumRiskTime: number;
  pctLowRiskTime: number;
}

interface OccRiskFile {
  occupations: OccRisk[];
}

interface StateOcc {
  slug: string;
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
  matchedEmployment: number; // sum across matched occupations (sanity check)
  coverage: number; // matched / total, 0-1
  weightedNetRisk100: number;
  weightedNetRisk: number;
  weightedPctHighRiskTime: number;
  topRiskOccupations: { slug: string; title: string; employment: number; netRisk100: number }[];
  occupationCount: number;
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const occPath = path.join(root, "src/data/risk/occupation-risk.json");
  const stPath = path.join(root, "src/data/regional/state-occupation-employment.json");
  const outPath = path.join(root, "src/data/risk/state-risk.json");

  const occ: OccRiskFile = JSON.parse(await fs.readFile(occPath, "utf8"));
  const st: StateFile = JSON.parse(await fs.readFile(stPath, "utf8"));

  const occBySlug = new Map<string, OccRisk>();
  for (const o of occ.occupations) occBySlug.set(o.slug, o);

  const states: StateRiskOut[] = [];

  for (const s of st.states) {
    let sumWeight = 0;
    let sumRisk100 = 0;
    let sumRisk = 0;
    let sumPctHigh = 0;
    const rowsWithRisk: { slug: string; title: string; employment: number; netRisk100: number }[] = [];

    for (const sOcc of s.occupations) {
      if (sOcc.employment == null) continue;
      const o = occBySlug.get(sOcc.slug);
      if (!o) continue;
      const w = sOcc.employment;
      sumWeight += w;
      sumRisk100 += o.netRisk100 * w;
      sumRisk += o.netRisk * w;
      sumPctHigh += o.pctHighRiskTime * w;
      rowsWithRisk.push({ slug: sOcc.slug, title: o.title, employment: w, netRisk100: o.netRisk100 });
    }

    if (sumWeight === 0) continue;

    rowsWithRisk.sort((a, b) => b.netRisk100 - a.netRisk100);

    const totalEmp = s.totalEmployment ?? sumWeight;

    states.push({
      fips: s.fips,
      abbr: s.abbr,
      title: s.title,
      totalEmployment: totalEmp,
      matchedEmployment: sumWeight,
      coverage: totalEmp > 0 ? sumWeight / totalEmp : 0,
      weightedNetRisk100: Math.round(sumRisk100 / sumWeight),
      weightedNetRisk: Number((sumRisk / sumWeight).toFixed(2)),
      weightedPctHighRiskTime: Number((sumPctHigh / sumWeight).toFixed(1)),
      topRiskOccupations: rowsWithRisk.slice(0, 5),
      occupationCount: rowsWithRisk.length,
    });
  }

  states.sort((a, b) => b.weightedNetRisk100 - a.weightedNetRisk100);

  const out = {
    generatedAt: new Date().toISOString(),
    source: st.source,
    methodology:
      "Per-state risk = employment-weighted average of occupation netRisk100 across the ~325 SOC codes shared between BLS OEWS state data and our occupation-risk dataset. Suppressed cells (employment = null) are excluded. Coverage field reports the share of state employment covered by matched occupations.",
    stateCount: states.length,
    states,
  };

  await fs.writeFile(outPath, JSON.stringify(out, null, 2));
  console.error(`Wrote ${outPath}`);

  // Print top 5 / bottom 5 for sanity check
  console.log("\nTop 5 highest weighted net risk:");
  for (const s of states.slice(0, 5)) {
    console.log(
      `  ${s.abbr} ${s.title.padEnd(22)} risk=${s.weightedNetRisk100} %high=${s.weightedPctHighRiskTime.toFixed(1)} coverage=${(s.coverage * 100).toFixed(0)}%`,
    );
  }
  console.log("\nBottom 5 lowest weighted net risk:");
  for (const s of states.slice(-5)) {
    console.log(
      `  ${s.abbr} ${s.title.padEnd(22)} risk=${s.weightedNetRisk100} %high=${s.weightedPctHighRiskTime.toFixed(1)} coverage=${(s.coverage * 100).toFixed(0)}%`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
