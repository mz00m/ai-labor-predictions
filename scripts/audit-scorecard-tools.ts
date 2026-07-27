import { getAllOccupationSlugs, getScorecard } from "../src/lib/assessment/scorecard";
import { OCCUPATION_TOOLS } from "../src/data/tools/occupational";

const allSlugs = new Set(getAllOccupationSlugs());

// A slug typo in `occupationSlugs` fails silently — the tool is simply never
// offered to anyone. Catch it here rather than on the live page.
const badSlugs = OCCUPATION_TOOLS.flatMap((t) =>
  (t.occupationSlugs ?? [])
    .filter((s) => !allSlugs.has(s))
    .map((s) => `${t.id} -> ${s}`)
);
if (badSlugs.length) {
  console.log("UNKNOWN OCCUPATION SLUGS");
  badSlugs.forEach((b) => console.log(`  ${b}`));
} else {
  console.log("occupationSlugs: all resolve");
}

const byCategory = new Map<string, { slug: string; tools: string[] }[]>();
let empty = 0;

for (const slug of allSlugs) {
  const sc = getScorecard(slug);
  if (!sc) continue;
  if (sc.tools.length === 0) empty++;
  const list = byCategory.get(sc.category) ?? [];
  list.push({ slug, tools: sc.tools.map((t) => t.name) });
  byCategory.set(sc.category, list);
}

console.log(
  `\ncoverage: ${allSlugs.size - empty}/${allSlugs.size} occupations have at least one tool\n`
);

for (const [category, occs] of Array.from(byCategory.entries()).sort()) {
  const covered = occs.filter((o) => o.tools.length > 0).length;
  console.log(`${category}  ${covered}/${occs.length} covered`);
  if (covered === 0) continue;
  for (const o of occs.filter((x) => x.tools.length > 0)) {
    console.log(`  ${o.slug}: ${o.tools.join(", ")}`);
  }
}
