/**
 * localStorage helpers for user-uploaded policies. Custom policies
 * persist per-browser so users can compare their policy to catalog
 * policies across sessions without backend infrastructure.
 */

import type { ModelPolicy } from "@/lib/composite-model";

const STORAGE_KEY = "jobsdata:custom-policies:v1";

export interface CustomPolicy extends ModelPolicy {
  /** UNIX ms when added — for sorting most-recent first */
  addedAt: number;
  /** Distinguishes user-added from catalog entries in the UI */
  isCustom: true;
  /** Optional snapshot of the source text (truncated) for transparency */
  sourceSnippet?: string;
  /** Confidence the extractor reported */
  extractionConfidence?: number;
  /** Notes the extractor returned about inferred vs. extracted fields */
  extractionNotes?: string;
}

export function loadCustomPolicies(): CustomPolicy[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p === "object" && p.id && p.name);
  } catch {
    return [];
  }
}

export function saveCustomPolicy(policy: CustomPolicy): void {
  if (typeof window === "undefined") return;
  const existing = loadCustomPolicies();
  const filtered = existing.filter((p) => p.id !== policy.id);
  const next = [policy, ...filtered].slice(0, 20); // cap at 20 to avoid storage bloat
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeCustomPolicy(id: string): void {
  if (typeof window === "undefined") return;
  const existing = loadCustomPolicies();
  const next = existing.filter((p) => p.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function makeCustomPolicyId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `custom-${slug || "policy"}-${Date.now().toString(36)}`;
}
