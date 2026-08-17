/**
 * Occupation-native AI tools — type definitions.
 *
 * Distinct from the horizontal `ToolEntry` catalog, which describes office
 * automation software for a *business* of a given industry and headcount.
 * That taxonomy cannot answer "what does a radiologist use," and forcing the
 * scorecard through it produced Grammarly as the top tool for both lawyers
 * and HR specialists.
 *
 * These entries are keyed to occupations instead, and every one names a
 * product a person in that job would plausibly recognize.
 */

import type { AiNative } from "./types";

export interface OccupationTool {
  /** Unique slug: lowercase, hyphenated */
  id: string;
  name: string;
  url: string;
  /** One concrete sentence. What it does, not what it promises. */
  description: string;
  /** Specific tasks it takes over — the reason someone would adopt it. */
  automates: string[];
  aiNative: AiNative;
  /**
   * Human-readable price, verbatim from the vendor where published.
   * "Pricing not public" is an honest and common answer in clinical,
   * legal, and industrial software — never substitute a guess.
   */
  pricingDetails: string;
  /**
   * Occupation category slugs from `enriched-occupations.json`.
   * Note these are the scorecard's own slugs (`healthcare`, `legal`, `math`),
   * not SOC major-group names.
   */
  occupationCategories: string[];
  /**
   * Specific occupation slugs this is especially built for. Ranked above
   * category matches, so court reporters get transcription tools rather
   * than whatever else the legal category holds.
   */
  occupationSlugs?: string[];
  /**
   * True when the employer buys and deploys it rather than the worker
   * adopting it. Matters for trades, transport, and production, where most
   * AI arrives as equipment or fleet telematics — and where implying an
   * individual could go sign up would be misleading.
   */
  employerDeployed?: boolean;
  limitations: string[];
  /** YYYY-MM-DD. Product facts and pricing rot fast in this category. */
  lastVerified: string;
}
