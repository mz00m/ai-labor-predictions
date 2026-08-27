import fs from "node:fs";
import path from "node:path";

interface RegistrySource {
  _action?: string;
  usedIn?: string[];
}

interface Registry {
  sources: Record<string, RegistrySource>;
}

interface PredictionFile {
  slug: string;
  sources?: { id: string }[];
  history?: { sourceIds?: string[] }[];
  overlays?: { sourceIds?: string[] }[];
}

const root = path.resolve(__dirname, "..");
const registry = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/confirmed-sources.json"), "utf8"),
) as Registry;

/**
 * Which sources a live prediction graph actually cites. `_archived` is excluded,
 * so a source whose only home was a retired graph correctly stops counting as
 * linked. This is derived from the prediction files rather than from each
 * source's `usedIn` field because that field is a hand-maintained cache and had
 * drifted: it claimed 70 references to slugs that no longer exist.
 */
const predictionsDir = path.join(root, "src/data/predictions");
const liveSlugs = new Set<string>();
const citedSourceIds = new Set<string>();

for (const category of fs.readdirSync(predictionsDir)) {
  const categoryDir = path.join(predictionsDir, category);
  if (!fs.statSync(categoryDir).isDirectory() || category.startsWith("_")) continue;

  for (const file of fs.readdirSync(categoryDir)) {
    if (!file.endsWith(".json")) continue;
    const prediction = JSON.parse(
      fs.readFileSync(path.join(categoryDir, file), "utf8"),
    ) as PredictionFile;

    liveSlugs.add(prediction.slug);
    for (const source of prediction.sources ?? []) citedSourceIds.add(source.id);
    for (const entry of [...(prediction.history ?? []), ...(prediction.overlays ?? [])]) {
      for (const id of entry.sourceIds ?? []) citedSourceIds.add(id);
    }
  }
}

const allSources = Object.entries(registry.sources);
const activeSources = allSources.filter(([, source]) => source._action !== "REMOVE");

// The Action Plan quotes tool prices to users. The oldest verification date in
// the tool KB is the honest floor for "as of", so surface that rather than the
// newest, which would overstate how current the weakest record is.
const toolKbDir = path.join(root, "src/data/tool-kb");
const verifiedDates = fs
  .readdirSync(toolKbDir)
  .filter((f) => f.endsWith(".md") && f !== "README.md")
  .flatMap((f) =>
    [...fs.readFileSync(path.join(toolKbDir, f), "utf8").matchAll(/^- \*\*Verified\*\*: (\S+)$/gm)]
      .map((m) => m[1]),
  )
  .sort();

const stats = {
  /** Active, verified sources — the searchable corpus. Powers "N sources" copy. */
  sourceCount: activeSources.length,
  /** Every registered source including retired ones. The full library. */
  sourceLibraryCount: allSources.length,
  /** Active sources actually cited by a live prediction graph. */
  linkedSourceCount: activeSources.filter(([id]) => citedSourceIds.has(id)).length,
  /** Oldest verification date across tool KB records. Powers the pricing "as of" note. */
  toolPricingVerifiedAsOf: verifiedDates[0],
};

// `usedIn` is a denormalized cache of the same relationship. If it disagrees
// with the prediction files, one of the two is lying to the reader — fail loudly
// rather than shipping a count nobody can reconcile.
const drift: string[] = [];
for (const [id, source] of activeSources) {
  for (const slug of source.usedIn ?? []) {
    if (!liveSlugs.has(slug)) drift.push(`${id} -> ${slug} (no such live prediction)`);
  }
  const shouldBeLinked = citedSourceIds.has(id);
  const claimsLinked = (source.usedIn?.length ?? 0) > 0;
  if (shouldBeLinked !== claimsLinked) {
    drift.push(`${id} -> usedIn says ${claimsLinked ? "linked" : "unlinked"}, files say the opposite`);
  }
}

if (drift.length > 0) {
  console.error(`\nusedIn has drifted from the prediction files (${drift.length} problems):`);
  for (const line of drift.slice(0, 20)) console.error(`  ${line}`);
  if (drift.length > 20) console.error(`  ...and ${drift.length - 20} more`);
  console.error("\nReconcile confirmed-sources.json usedIn with src/data/predictions/ before building.\n");
  process.exit(1);
}

const output = path.join(root, "src/data/site-stats.json");
fs.writeFileSync(output, `${JSON.stringify(stats, null, 2)}\n`);
console.log(
  `Site stats: ${stats.sourceCount} active / ${stats.sourceLibraryCount} in library / ${stats.linkedSourceCount} cited by a live graph`,
);
