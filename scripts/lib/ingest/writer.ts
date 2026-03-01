import fs from "fs";
import path from "path";
import type { ProposedChange } from "./types";

/**
 * Generate a deterministic source ID from publisher, title, and year.
 *
 * Follows the existing convention: {publisher-slug}-{topic-keywords}-{year}
 * Examples: "gartner-cs-agents-replaced-2025", "nber-ai-legal-impact-2025"
 */
export function generateSourceId(
  publisher: string,
  title: string,
  year: string
): string {
  const stopWords = new Set([
    "the", "a", "an", "of", "in", "on", "at", "to", "for", "and", "by",
    "is", "it", "its", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "can", "shall", "with", "from", "that", "this", "these",
    "those", "not", "but", "or", "if", "how", "what", "which", "who", "whom",
    "when", "where", "why", "all", "each", "every", "both", "few", "more",
    "most", "other", "some", "such", "no", "nor", "only", "own", "same",
    "than", "too", "very",
  ]);

  const pubSlug = publisher
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 2)
    .join("-");

  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .filter((w) => w.length > 1 && !stopWords.has(w));

  // Take up to 4 meaningful words from the title
  const titleSlug = titleWords.slice(0, 4).join("-");

  const id = `${pubSlug}-${titleSlug}-${year}`;

  // Ensure the ID is reasonable length
  return id.length > 60 ? id.slice(0, 60).replace(/-$/, "") : id;
}

/**
 * Apply proposed changes to prediction JSON files.
 *
 * - Adds source entries (skips if source ID already exists in the file)
 * - Adds history entries (deduped by date + value)
 * - Adds overlay entries (deduped by date + label)
 * - Sorts history and overlays by date after insertion
 */
export function applyChanges(
  changes: ProposedChange[]
): { written: string[]; skipped: string[] } {
  const written: string[] = [];
  const skipped: string[] = [];

  // Group changes by file path
  const byFile = new Map<string, ProposedChange[]>();
  for (const change of changes) {
    if (!change.filePath) continue;
    const existing = byFile.get(change.filePath) || [];
    existing.push(change);
    byFile.set(change.filePath, existing);
  }

  for (const [filePath, fileChanges] of byFile) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const prediction = JSON.parse(raw);
    let fileModified = false;

    for (const change of fileChanges) {
      // Check if source already exists in this file (by ID or URL)
      const sourceExists = prediction.sources.some(
        (s: { id: string; url?: string }) =>
          s.id === change.sourceId ||
          (change.sourceEntry.url &&
            s.url &&
            s.url === change.sourceEntry.url)
      );

      if (sourceExists) {
        skipped.push(
          `${change.sourceId} already in ${path.basename(filePath)}`
        );
      } else {
        prediction.sources.push(change.sourceEntry);
        fileModified = true;
      }

      // Add history entry (dedup by date + value)
      if (change.historyEntry) {
        const historyDupe = prediction.history.some(
          (h: { date: string; value: number }) =>
            h.date === change.historyEntry!.date &&
            Math.abs(h.value - change.historyEntry!.value) < 0.01
        );

        if (historyDupe) {
          skipped.push(
            `history(${change.historyEntry.date}, ${change.historyEntry.value}) already in ${path.basename(filePath)}`
          );
        } else {
          prediction.history.push(change.historyEntry);
          prediction.history.sort(
            (a: { date: string }, b: { date: string }) =>
              a.date.localeCompare(b.date)
          );
          fileModified = true;
          written.push(
            `history(${change.historyEntry.date}, ${change.historyEntry.value}) -> ${path.basename(filePath)}`
          );
        }
      }

      // Add overlay entry (dedup by date + label)
      if (change.overlayEntry) {
        if (!prediction.overlays) prediction.overlays = [];

        const overlayDupe = prediction.overlays.some(
          (o: { date: string; label: string }) =>
            o.date === change.overlayEntry!.date &&
            o.label === change.overlayEntry!.label
        );

        if (overlayDupe) {
          skipped.push(
            `overlay("${change.overlayEntry.label.slice(0, 40)}...") already in ${path.basename(filePath)}`
          );
        } else {
          prediction.overlays.push(change.overlayEntry);
          prediction.overlays.sort(
            (a: { date: string }, b: { date: string }) =>
              a.date.localeCompare(b.date)
          );
          fileModified = true;
          written.push(
            `overlay("${change.overlayEntry.label.slice(0, 50)}") -> ${path.basename(filePath)}`
          );
        }
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(prediction, null, 2) + "\n");
    }
  }

  return { written, skipped };
}
