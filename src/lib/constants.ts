/**
 * Shared constants used across the application.
 *
 * SOURCE_COUNT should be updated whenever new sources are ingested.
 * It must stay in sync with the totalSources field in
 * src/data/confirmed-sources.json.
 */
export const SOURCE_COUNT = 462;

/** Human-readable source count string for use in descriptions (e.g. "462+") */
export const SOURCE_COUNT_DISPLAY = `${SOURCE_COUNT}+`;
