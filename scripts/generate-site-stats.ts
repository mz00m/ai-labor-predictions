import fs from "node:fs";
import path from "node:path";

interface RegistrySource {
  _action?: string;
  usedIn?: string[];
}

interface Registry {
  sources: Record<string, RegistrySource>;
}

const root = path.resolve(__dirname, "..");
const registry = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/confirmed-sources.json"), "utf8"),
) as Registry;
const allSources = Object.values(registry.sources);
const activeSources = allSources.filter((source) => source._action !== "REMOVE");
const stats = {
  sourceCount: activeSources.length,
  sourceLibraryCount: allSources.length,
  linkedSourceCount: activeSources.filter((source) => (source.usedIn?.length ?? 0) > 0).length,
};

const output = path.join(root, "src/data/site-stats.json");
fs.writeFileSync(output, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Site stats generated: ${stats.sourceCount} active / ${stats.sourceLibraryCount} total sources`);
