/**
 * Source Content Store — richer per-source content for chatbot grounding.
 *
 * Each source gets a JSON file in src/data/source-content/{source-id}.json
 * with abstract, key findings, methodology, and qualifiers extracted
 * from the original source material.
 */

import fs from "fs";
import path from "path";

export interface SourceContentEntry {
  id: string;
  /** Full abstract or executive summary (500-2000 chars) */
  abstract: string;
  /** 3-5 key quantitative or qualitative findings */
  keyFindings: string[];
  /** Study design, sample size, data period, limitations */
  methodology: string;
  /** Caveats, uncertainty language, scope limitations */
  qualifiers: string;
  /** When this content was fetched and extracted */
  fetchedAt: string;
}

const CONTENT_DIR = path.join(
  process.cwd(),
  "src/data/source-content"
);

/** Read a single source content entry, or null if not found */
export function getSourceContent(
  sourceId: string
): SourceContentEntry | null {
  const filePath = path.join(CONTENT_DIR, `${sourceId}.json`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SourceContentEntry;
  } catch {
    return null;
  }
}

/** Read multiple source content entries by ID */
export function getSourceContents(
  sourceIds: string[]
): Map<string, SourceContentEntry> {
  const results = new Map<string, SourceContentEntry>();
  for (const id of sourceIds) {
    const content = getSourceContent(id);
    if (content) {
      results.set(id, content);
    }
  }
  return results;
}

/** Write a source content entry to disk */
export function writeSourceContent(entry: SourceContentEntry): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  const filePath = path.join(CONTENT_DIR, `${entry.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2) + "\n");
}

/** List all source IDs that have content stored */
export function listStoredSourceIds(): string[] {
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
