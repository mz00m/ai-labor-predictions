import fs from "fs";
import path from "path";
import { WeeklyDigest } from "./types/digest";

interface LatestPointer {
  currentWeek: string;
  generatedAt: string;
}

/**
 * Get the latest weekly digest from the data/digests directory.
 * Returns null if no digest exists yet.
 */
export function getLatestDigest(): WeeklyDigest | null {
  const digestsDir = path.join(process.cwd(), "src/data/digests");
  const latestPath = path.join(digestsDir, "latest.json");

  if (!fs.existsSync(latestPath)) return null;

  try {
    const latest: LatestPointer = JSON.parse(
      fs.readFileSync(latestPath, "utf-8")
    );
    const digestPath = path.join(digestsDir, `${latest.currentWeek}.json`);

    if (!fs.existsSync(digestPath)) return null;

    return JSON.parse(fs.readFileSync(digestPath, "utf-8"));
  } catch (err) {
    console.error("Failed to load digest:", err);
    return null;
  }
}

/**
 * List all available digest week IDs.
 */
export function listDigests(): string[] {
  const digestsDir = path.join(process.cwd(), "src/data/digests");

  if (!fs.existsSync(digestsDir)) return [];

  return fs
    .readdirSync(digestsDir)
    .filter((f) => f.match(/^\d{4}-W\d{2}\.json$/))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}
