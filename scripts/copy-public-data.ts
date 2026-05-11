/**
 * copy-public-data.ts
 *
 * Copies large, lazy-loaded JSON data from src/data/regional/ to public/data/
 * so the browser can fetch them on demand. The RegionalExplorer on /map only
 * pulls these when the user enters a view that needs them (county-level
 * polygons or detailed occupation distributions).
 *
 * Wired into npm run build via prebuild.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src", "data", "regional");
const PUBLIC_DIR = path.join(ROOT, "public", "data");

const FILES = [
  "us-counties-svg-paths.json",
  "msa-occupation-employment.json",
  "county-occupation-employment.json",
];

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  for (const file of FILES) {
    const src = path.join(SRC_DIR, file);
    const dst = path.join(PUBLIC_DIR, file);

    try {
      const stat = await fs.stat(src);
      // Skip if dst exists and is the same size + same mtime or newer.
      let copy = true;
      try {
        const dstStat = await fs.stat(dst);
        if (dstStat.size === stat.size && dstStat.mtimeMs >= stat.mtimeMs) {
          copy = false;
        }
      } catch {
        // not present, copy
      }
      if (copy) {
        await fs.copyFile(src, dst);
        console.log(
          `[copy-public-data] copied ${file} (${(stat.size / 1024).toFixed(0)} KB)`,
        );
      } else {
        console.log(`[copy-public-data] up-to-date: ${file}`);
      }
    } catch (err) {
      console.error(`[copy-public-data] missing source: ${src}`);
      throw err;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
