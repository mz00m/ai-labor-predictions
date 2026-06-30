/**
 * Shared constants used across the application.
 *
 * SOURCE_COUNT should be updated whenever new sources are ingested.
 * It must stay in sync with the totalSources field in
 * src/data/confirmed-sources.json. (Kept as a literal rather than a
 * JSON import because client components also import this module and
 * the registry file is ~400KB.)
 */
export const SOURCE_COUNT = 574;

/** Human-readable source count string for use in descriptions (e.g. "574+") */
export const SOURCE_COUNT_DISPLAY = `${SOURCE_COUNT}+`;

/**
 * Number of prediction graphs on the site. The data layer loads 18 files
 * (9 displacement + 4 wages + 3 adoption + 1 exposure + 1 signal), but the
 * earnings-call-mentions graph is treated as a signal rather than a
 * forward-looking prediction, so the user-facing count is 17.
 *
 * Must stay in sync with the prediction files in src/data/predictions/
 * minus the items in PREDICTION_COUNT_EXCLUDED_SLUGS below.
 */
export const PREDICTION_COUNT = 17;

/** Slugs that exist in src/data/predictions/ but don't count toward PREDICTION_COUNT. */
export const PREDICTION_COUNT_EXCLUDED_SLUGS: ReadonlyArray<string> = [
  "earnings-call-ai-mentions",
];
