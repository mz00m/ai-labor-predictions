import siteStats from "@/data/site-stats.json";

/** Generated from confirmed-sources.json by scripts/generate-site-stats.ts. */
export const SOURCE_COUNT = siteStats.sourceCount;
export const SOURCE_LIBRARY_COUNT = siteStats.sourceLibraryCount;
export const LINKED_SOURCE_COUNT = siteStats.linkedSourceCount;

/** Human-readable source count string for use in descriptions (e.g. "574+") */
export const SOURCE_COUNT_DISPLAY = `${SOURCE_COUNT}+`;

/**
 * Number of prediction graphs on the site. The data layer loads 19 files
 * (10 displacement + 4 wages + 3 adoption + 1 exposure + 1 signal), but the
 * earnings-call-mentions graph is treated as a signal rather than a
 * forward-looking prediction, so the user-facing count is 18.
 *
 * Must stay in sync with the prediction files in src/data/predictions/
 * minus the items in PREDICTION_COUNT_EXCLUDED_SLUGS below.
 */
export const PREDICTION_COUNT = 18;

/** Slugs that exist in src/data/predictions/ but don't count toward PREDICTION_COUNT. */
export const PREDICTION_COUNT_EXCLUDED_SLUGS: ReadonlyArray<string> = [
  "earnings-call-ai-mentions",
];
