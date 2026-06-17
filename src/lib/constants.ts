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
 * Number of prediction graphs on the site. Must stay in sync with the
 * files in src/data/predictions/ (excluding _archived).
 */
export const PREDICTION_COUNT = 18;
