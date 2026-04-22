/**
 * Centralized Claude model identifiers. One source of truth for every
 * Anthropic API call in the app.
 *
 * Why this file exists: on 2026-04-22 a typo'd model string
 * ("claude-mythos-0417" — an unreleased internal codename) shipped to
 * production, 404'ing every KB query and anywhere else it landed. With
 * model names inlined at every call site, the fix required grepping
 * and patching each one separately. Now a model swap is a single edit
 * in this file.
 *
 * If/when Anthropic publishes date-suffixed pinned IDs for these
 * aliases, swap the string values here (e.g.
 * `"claude-sonnet-4-6-20260401"`). Every consumer picks it up on the
 * next build.
 */

/** Sonnet 4.6 — the default workhorse model for reasoning-heavy calls. */
export const CLAUDE_SONNET = "claude-sonnet-4-6";

/** Haiku 4.5 — pinned. Used for fast synthesis, extraction, and chat. */
export const CLAUDE_HAIKU = "claude-haiku-4-5-20251001";

/** Opus 4.7 — reserved for highest-stakes reasoning; not currently used in app code. */
export const CLAUDE_OPUS = "claude-opus-4-7";
