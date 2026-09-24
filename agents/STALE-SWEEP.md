# Weekly Stale-Series Sweep

Runbook for the scheduled cloud agent that works the recurring-series queue.
The routine prompt points here, so edits to this file change what the agent
does next Monday — no need to touch the routine.

**Not your job:** the research digest. `.github/workflows/weekly-digest.yml`
already generates it and opens a draft PR. Do not run `digest:fetch` or
`digest:synthesize`, and do not create a digest file.

## 1. Find what is overdue

Read `src/data/recurring-sources.json`. For each entry in `series`, age
`lastIngested.date` against its cadence:

| cadence | overdue after |
|---|---|
| biweekly | 14d |
| monthly | 31d |
| quarterly | 92d |
| semiannual | 183d |
| annual | 366d |
| biennial | 800d |

These are the thresholds `scripts/autoresearch/auto-audit.js` uses (`CADENCE_DAYS`),
and they are deliberately the nominal cadence interval rather than a padded one:
a series is due the moment the next release should have arrived. An earlier
version of this runbook used the digest adapter's grace-padded values (quarterly
120d and so on), which let a sweep report the queue clear while the site's own
audit still listed six series due. If you change these, change `CADENCE_DAYS` to
match — the audit is the authority, and the two must not disagree.

## 2. Check each overdue series for a new release

Visit its `url` and compare against `lastIngested.date`.

**Read the series `notes` field before anything else.** Several carry exact
procedures that override instinct. BTOS, for instance, says to read
`https://www.census.gov/hfp/btos/downloads/National.xlsx` directly, because the
press releases are boilerplate and never mention AI — a note written after that
mistake cost 79 days of staleness.

A series can be overdue simply because the publisher has not released. That is a
finding, not a failure. Report it and move on.

## 3. Ingest what is genuinely new

Every rule here exists because it was gotten wrong before.

- **Date each value to its reference-period end, never the publication date.**
  For BTOS these differ by six or seven weeks; the "Collection and Reference
  Dates" sheet carries both.
- **Diffs must be pure insertions.** The prediction JSON files mix
  backslash-escaped and raw UTF-8 non-ASCII *within the same file*, so
  re-serializing one with `json.dump` or `JSON.stringify` rewrites lines you
  never touched. Insert new array elements as text at the correct sorted
  position and leave every other byte alone. Verify with `git diff`: deletions
  should only ever be `currentValue`, counters, and timestamps.
- **Data point vs overlay is a question about units, not confidence.** A value
  is a data point when its unit and population match the graph's for that
  graph's population. Otherwise it is an overlay. Do not default to overlay out
  of caution — overlay is the exception that needs a reason, and the reason
  should be a real construct mismatch you can name.
- **Skip secondary reporting** where the primary is already ingested. A news
  outlet quoting a Challenger or Census figure we already hold adds nothing.
- **Check for duplicates** by source id and URL in `confirmed-sources.json`
  before writing anything.
- **Keep arrays sorted by date ascending.**
- **Recompute `currentValue`** with `computeAggregate` from
  `src/lib/prediction-stats.ts` rather than by hand, and say in the report when
  a single point moves it materially.
- **Write a `src/data/source-content/<id>.json` entry for every new source.**
  The ingestion path skips this silently and it leaves the chatbot blind. If
  `ANTHROPIC_API_KEY` is unavailable, hand-write the entry in the same shape as
  its neighbors rather than skipping it.
- **Update `lastIngested` in `recurring-sources.json`** for every series you
  ingest. It feeds both the public `/data-sources` page and this sweep. Never
  move a pointer backward — if the new release is older than what is recorded,
  leave it and say why.

## 4. Validate before pushing

Run all three. Every one must pass:

```bash
npm run build:stats && npm run compile-wiki && npm run compile-kb \
  && npm run compile-tool-kb && npm run build:search
node scripts/autoresearch/auto-audit.js   # must exit 0
npx vitest run
npm run build
```

The audit is the gate that matters — it catches unsorted arrays, labels over
120 chars, inverted confidence bounds, sources missing from `sources[]`, and
content files missing for referenced ids.

## 5. Ship

If everything passes, commit to `main` and push. Conventional commit format,
and say in the body what moved and why, including any `currentValue` shift and
the reasoning behind each data-point-vs-overlay call.

**If anything fails, do not push.** Commit to a branch, open a draft PR, and
say plainly in the report what failed.

Merged is not shipped: after pushing, confirm the GitHub Actions run passed and
that the change is serving on https://jobsdata.ai.

## 6. Report

Lead with what you ingested and what moved. Then: series still overdue and why
(no release vs. not reachable), anything you deliberately skipped, and any
judgment call worth a second opinion. If a series has been overdue for several
consecutive sweeps, say so — that is a signal the feed or the expectation is
wrong, not just that a publisher is late.
