# Review Queue — Human Decision Backlog

Present every item awaiting a human decision in one consolidated queue, collect
verdicts, apply them, and record the reasoning in `feedback-log.md`. This is
the human half of the autoresearch learning loop — without it, "review" items
accumulate forever and the agent never learns your preferences.

## Input

Optional filter: $ARGUMENTS
- Blank: full queue (candidates, orphans, open questions)
- "candidates": only candidates.tsv review items
- "orphans": only orphan sources
- "questions": only feedback-log.md open questions

## Step 1: Assemble the Queue

Gather from four places:

1. **Candidates awaiting review** — rows in `scripts/autoresearch/candidates.tsv`
   with status `review`. Deduplicate by URL (keep the latest row per URL).
   Skip any whose URL has since been ingested (check `confirmed-sources.json`).
2. **Orphan sources** — run `node scripts/autoresearch/auto-audit.js` and
   collect the orphan list (sources in `confirmed-sources.json` referenced by
   no prediction file).
3. **Open questions** — the "Open questions awaiting human decision" section
   of `feedback-log.md`.
4. **Audit judgment calls** — any current SHOULD FIX audit findings that need
   a human call (ambiguous duplicates, aggregation ties, unverifiable URLs).

## Step 2: Present in Batches

Present items in batches of 5-8, most valuable first (candidates sorted by
score, orphans sorted by evidence tier then recency). For each item give the
human what they need to decide in ~10 seconds:

```
[N] [candidate|orphan|question] [title] — [publisher], [date]
    Score/Tier: [X] | Target graphs: [slugs]
    Why it's here: [one line — e.g., "scored 52, borderline quant density"]
    Recommend: [INGEST | ARCHIVE | KEEP AS CONTEXT | DROP] — [one-line reason]
```

Use the AskUserQuestion tool where the choice is genuinely binary; otherwise
accept free-form batch verdicts like "1,3 ingest; 2 drop; rest archive".

## Step 3: Apply Verdicts

- **Ingest** → hand off to the `/ingest` workflow (or `/autoresearch` scoring
  path) for full extraction; update candidates.tsv status to `ingested`.
- **Drop / not relevant** → candidates.tsv status `skip` with the human's
  reason.
- **Archive orphan** → per program.md, never delete without explicit sign-off.
  With sign-off, remove the entry and decrement `totalSources`/`verifiedCount`;
  without it, tag the entry `"archived": true` so audits stop counting it as
  active.
- **Keep as context** → tag the registry entry `"contextOnly": true` —
  auto-audit.js skips contextOnly entries in its orphan check, so the item
  stops resurfacing. Remove the tag if the source is later wired into a graph.
- **Open questions** → apply whatever the human decides; move the question
  from "Open questions" to a dated entry.

## Step 4: Log to feedback-log.md

Append one dated entry per decision batch:

```
## YYYY-MM-DD — /review-queue session
- DECISION: [item] → [verdict]
- REASON: [human's words]
- PATTERN?: [cite similar past entries if any]
```

If 3+ entries (across sessions) show the same pattern — e.g., "always drop
vendor-survey sources below Tier 2 for wage graphs" — propose promoting it to
CLAUDE.md's Learned Preferences section and, on approval, add it there.

## Step 5: Commit

One commit per session: `chore(review-queue): disposition [N] items ([X] ingest, [Y] skip, [Z] archive)`
Include candidates.tsv, feedback-log.md, and any registry changes.

## Rules

- **Never decide for the human.** Recommendations yes, silent dispositions no.
  Every status change traces to an explicit verdict.
- **Never delete data without sign-off** (program.md constraint).
- **Append-only feedback log.** Never rewrite existing entries.
- **Keep the queue honest.** If an item has been re-presented 3 times without
  a decision, say so — stale queue items are themselves feedback.
