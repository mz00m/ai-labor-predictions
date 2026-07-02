# Feedback Log

Human feedback on agent research decisions, collected per CLAUDE.md's learning
loop. When 3+ entries show a similar pattern, promote the pattern to the
**Learned Preferences** section of CLAUDE.md and note the promotion here.

Format per entry:

```
## YYYY-MM-DD — [context: session/skill/topic]
- DECISION: [what the human decided]
- REASON: [why, in the human's words if possible]
- PATTERN?: [does this rhyme with earlier entries — cite dates]
```

Append-only. Never rewrite or delete existing entries.

---

## Open questions awaiting human decision

Carried here so they don't get lost between sessions; move to a dated entry
once decided.

1. **goldman-productivity-growth-forecast-2026 has no public URL.** The
   client-only Goldman US Daily note (May 5, 2026) has no public link or
   verified secondary coverage after four search attempts. Options: (a) keep
   with empty URL and this note, (b) remove the source and its data points,
   (c) someone with GS Research access supplies the gspublishing.com link.
   *(Not yet decided — agent recommendation is (a).)*

---

<!-- Dated entries begin here -->

## 2026-07-02 — /review-queue session (28 candidates, 38 orphans, 2 questions)

- DECISION: Ingest all 5 recommended candidates (NBER Baslandze w34984,
  NBER Bloom/Prettner skill premium, Gartner rehire-by-2027, Mercer GTT 2026,
  Salesforce State of Service) PLUS the borderline IMF inequality WP.
- REASON: User approved the recommended set and explicitly added IMF #9
  ("drop all except IMF") — willing to take model-based Tier 2 work as
  overlays on wage graphs.
- DECISION: Drop 10 candidates (JPM LLM-derived, Morgan Stanley $-figure,
  BNP/SocGen attribution, IntuitionLabs aggregation, ILO duplicate, NBER
  Politics of AI, Barclays, Congressional report, McKinsey RCM, CNBC Dimon,
  Inside Higher Ed) — statuses set to skip with reasons in candidates.tsv.
- DECISION: Retry the 403'd Gartner "abandon plans" release → succeeded via
  reprint coverage; ingested as counter-overlay.
- DECISION: Orphans — keep all 38 as context (tagged contextOnly: true;
  audit no longer flags them); 12 empirical ones queued for re-wiring in
  scripts/autoresearch/rewire-candidates.md.
- DECISION: workforce-ai-exposure switched from "latest" to weighted
  aggregation (currentValue 67 → 43.3) — resolves the order-dependent
  three-way tie on 2026-01-15.
- PATTERN?: First session — three tentative patterns worth watching:
  (1) model-based Tier 1/2 papers are acceptable as overlays, never data
  points; (2) secondary aggregations of already-ingested primaries get
  dropped; (3) job-cut counts not cleanly AI-attributable get dropped.
  Promote any of these to CLAUDE.md Learned Preferences after a third
  confirming session.
- NOTE: IMF WP figures in the original candidate log (+2.05/+6.89 Gini) were
  the routine-automation comparison, not the AI scenario (wage Gini −1.73pp,
  wealth Gini +7.18pp). Corrected at ingestion — reminder that candidate-log
  stats must be re-verified against the source before use.
