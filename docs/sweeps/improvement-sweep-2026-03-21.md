═══════════════════════════════════════════════════════
 JOBSDATA.AI IMPROVEMENT SWEEP — 2026-03-21
═══════════════════════════════════════════════════════

SUMMARY: 45 findings across 5 categories
  7 fix now · 12 fix this week · 13 ingest candidates · 8 next sprint · 5 backlog

Site last updated: 2026-03-20 (1 day ago — fresh)
Hero stats: verified accurate (projected ~1%, measured ~0%)
Source count: 462 (all verified)

───────────────────────────────────────────────────────
 FIX NOW (data integrity, active bugs, resilience)
───────────────────────────────────────────────────────

1. Missing aggregationMethod on 14 prediction files — 14 of 19 prediction
   JSONs have no explicit aggregationMethod field. Code defaults to "weighted"
   but this should be explicit. Missing from: creative-industry, customer-service,
   education-sector, healthcare-admin, overall, robots-physical-automation,
   tech-sector, total-jobs-lost, white-collar-professional, workforce-exposure,
   entry-level-impact, freelancer-rate-impact, high-skill-premium, median-wage-impact.
   Action: Add "aggregationMethod": "weighted" to each. Review whether any
   should actually be "latest" (see item 4 below).
   Files: src/data/predictions/**/*.json

2. Unsorted overlays in overall displacement — The overlays array in
   overall.json has "2026-03-19" appearing before "2015-07-01".
   Action: Sort overlays by date ascending.
   File: src/data/predictions/displacement/overall.json

3. Orphan source references — 2 sources in confirmed-sources.json have
   usedIn arrays pointing to predictions that don't reference them:
   metr-becker-ai-dev-productivity-2025 claims usedIn:["tech-sector-displacement"]
   but absent from tech-sector.json; brookings-mapping-ai-economy-2025 claims
   usedIn:["workforce-ai-exposure"] but absent from workforce-exposure.json.
   Action: Either add references in the prediction files or remove from usedIn.
   File: src/data/confirmed-sources.json

4. 6 registered-but-unused sources — These sources have empty usedIn arrays:
   korinek-ai-tool-vs-agi-2026, agrawal-ai-science-2026,
   careervillage-ai-resilience-report-2026, itrev-beane-human-vibes-2025,
   nber-diaz-training-within-firms-2025, sivulka-institutional-ai-2026.
   Action: Either ingest into relevant predictions or remove from registry.
   File: src/data/confirmed-sources.json

5. No error.tsx boundary — Zero error.tsx files in src/app/. A runtime
   error on any page crashes without fallback.
   Action: Add src/app/error.tsx as a global error boundary.
   File: src/app/error.tsx (create)

6. No loading.tsx boundary — Zero loading.tsx files in src/app/. Routes
   with data fetching have no loading state.
   Action: Add src/app/loading.tsx as a global loading skeleton.
   File: src/app/loading.tsx (create)

7. Education sector evidence tiers wrong — education-sector.json marks Chegg
   subscriber loss and Pearson editorial cuts as evidenceTier: 1, but these are
   corporate proxies for sector displacement, not peer-reviewed research.
   Action: Downgrade to Tier 2 or reclassify as overlays.
   File: src/data/predictions/displacement/education-sector.json

───────────────────────────────────────────────────────
 FIX THIS WEEK (viz, code, misleading framing)
───────────────────────────────────────────────────────

DATA INTEGRITY

8. Unloaded total-jobs-lost.json — This prediction exists in the displacement
   directory but is NOT imported by data-loader.ts and not in the CLAUDE.md
   taxonomy. Either add it to the loader or archive it.
   File: src/data/predictions/displacement/total-jobs-lost.json

9. workforce-exposure category mismatch — Has category: "adoption" but lives
   in the exposure/ subdirectory and is conceptually an exposure metric.
   File: src/data/predictions/exposure/workforce-exposure.json

10. ai-business-formation aggregation method — Uses "weighted" but contains
    time-series Census data (2021-2025) with a 2030 projection mixed in.
    Should likely be "latest" for the time-series portion.
    File: src/data/predictions/adoption/ai-business-formation.json

VISUALIZATION

11. overall-us-displacement sign convention chaos — Values range from -11.5%
    to +12%, with negative and positive values BOTH meaning displacement. The
    NBER -11.5 and Eisfeldt -2.4 use opposite sign from the rest.
    Action: Standardize all displacement values as positive. Add visual
    separation between "observed" and "projected" clusters.
    File: src/data/predictions/displacement/overall.json

12. overall-us-displacement temporal mixing — Observed employment data
    (value: 0, 0, 0.1) on the same trend line as projections (5-12%).
    Many data points lack a dataType field entirely.
    Action: Tag every data point with dataType: "observed" or "projected"
    across all 19 prediction files.
    Files: src/data/predictions/**/*.json

13. workforce-ai-exposure definitional drift — Sources range from 23%
    (task exposure) to 93% (any occupation with one exposed task). Averaging
    produces 44.1%, a number no study found.
    Action: Switch to aggregationMethod: "latest" anchored to the most
    rigorous source, or display as explicit range instead of point estimate.
    File: src/data/predictions/exposure/workforce-exposure.json

14. customer-service-automation unit mismatch — BLS data point measures
    employment decline (%) while others measure interaction automation (%).
    The weighted average blends these into a meaningless 34.7%.
    Action: Move BLS data point to overlays (unit doesn't match graph).
    File: src/data/predictions/displacement/customer-service.json

15. tech-sector-displacement proxy data not tagged — Job posting declines
    (Indeed -22%, -16.5%; Lightcast -14%) are treated as job displacement.
    Posting declines overstate displacement by ~2-3x.
    Action: Tag with isProxy: true and apply conversion factors, or move
    to overlays.
    File: src/data/predictions/displacement/tech-sector.json

16. financial-services sign confusion — Mix of positive (3%, 14%) and
    negative (-3%, -1.2%) values all meaning displacement.
    Action: Standardize all values as positive for displacement.
    File: src/data/predictions/displacement/financial-services.json

CODE HEALTH

17. API routes without try/catch — 4 routes have no error handling:
    api/v1/route.ts, api/v1/predictions/[slug]/route.ts,
    api/v1/predictions/route.ts, api/predictions/route.ts.
    Action: Wrap in try/catch, return proper error responses.
    Files: src/app/api/**/*.ts

18. Hardcoded "460+" source count in 6 places — layout.tsx (3x),
    manifest.ts, Chatbot.tsx, chat/context-builder.ts all hardcode the count.
    Action: Extract to a single constant derived from confirmed-sources.json
    at build time.
    Files: src/app/layout.tsx, src/components/Chatbot.tsx, others

19. Delete duplicate cleanup script — cleanup-stale-branches.sh duplicates
    cleanup-branches.sh (which is the better version with --dry-run).
    Action: Delete cleanup-stale-branches.sh.
    File: scripts/cleanup-stale-branches.sh

───────────────────────────────────────────────────────
 INGEST WHEN READY (score >= 60, prioritized by data hunger)
───────────────────────────────────────────────────────

Priority graphs below target:
  education-sector:  4/8+  |  healthcare-admin: 4/8+
  creative-industry: 7/10+ |  customer-service: 7/10+
  freelancer-rate:   7/10+ |  high-skill-premium: 6/10+
  white-collar:      6/10+

 1. [80] NBER W34836 "Firm Data on AI" (Feb 2026) — NBER/Yotzov, Barrero, Bloom
    Targets: white-collar, overall, ai-adoption-rate
    Key stats: Execs predict 0.7% employment cut over 3yr; 80%+ firms no impact;
    78% using AI. Note: source ID may exist — check if revised data already ingested.

 2. [75] Dallas Fed "AI Aiding and Replacing Workers" (Feb 2026) — Fed Reserve
    Targets: white-collar, tech-sector, entry-level-wage-impact
    Key stat: Computer systems design employment -5% since ChatGPT; young workers
    disproportionately affected. NEW PUBLISHER (T1).

 3. [75] Gartner CS Leaders Survey (Feb 2026) — Gartner
    Target: customer-service-automation
    Key stat: 20-30% of service agents replaced by genAI by 2026.

 4. [75] Gartner Agentic AI Forecast (2025) — Gartner
    Target: customer-service-automation
    Key stat: 80% autonomous resolution by 2029; 30% cost reduction.

 5. [70] IMF SDN/2026/001 "Bridging Skill Gaps" (Jan 2026) — IMF
    Targets: high-skill-wage-premium, education-sector
    Key stat: AI-skill vacancies pay ~3% more; middle-skill squeeze.

 6. [70] ILO-NASK Refined Exposure Index (2025/2026) — ILO
    Targets: workforce-exposure, white-collar, creative-industry
    Key stat: 25% global employment exposed; 34% in high-income countries.

 7. [70] PwC AI Jobs Barometer (2025) — PwC
    Target: high-skill-wage-premium
    Key stat: 56% wage premium for AI-skilled workers (up from 25%).

 8. [70] Forrester CS 2026 Forecast — Forrester
    Target: customer-service-automation
    Key stat: 1 in 4 brands see 10% self-service increase by end 2026.

 9. [65] "Payrolls to Prompts" (Feb 2026) — Academic (verify publisher)
    Target: freelancer-rate-impact
    Key stat: >50% of businesses stopped using freelance platforms;
    spending fell from 0.66% to 0.14%.

10. [65] SHRM "23.2M Jobs Impacted" (2026) — SHRM
    Targets: overall, healthcare-admin
    Key stat: 23.2M American jobs already impacted. Verify healthcare specificity.

11. [65] HBR "How AI Is Changing the Labor Market" (Mar 2026) — HBR
    Targets: white-collar, creative-industry
    Key stat: Automation-prone openings fell 13%; analytical/creative grew 20%.

12. [60] Anthropic Economic Index Q4 — Anthropic
    Targets: white-collar, high-skill-premium
    Key stat: College-degree tasks sped up 12x; usage skews to 14.4yr education.

13. [60] Mercer Global Talent Trends 2026 — Mercer
    Target: white-collar (overlay only — sentiment, not displacement)
    Key stat: AI job-loss concerns rose from 28% to 40% in 12K-person survey.

───────────────────────────────────────────────────────
 NEXT SPRINT (UX, code cleanup, design)
───────────────────────────────────────────────────────

UX / DESIGN

20. FeaturedReads summary text illegible at 10px — line-clamp-2 at 10px
    creates unreadable micro-text. Bump to 11px or drop summaries entirely.
    File: src/components/FeaturedReads.tsx

21. HeroTriad stat labels at 9-10px too small — The three most important
    numbers on the site have labels smaller than bylines. Bump to 11-12px.
    File: src/components/HeroTriad.tsx

22. FeaturedReads orphaned 5th card on mobile — grid-cols-2 with 5 items
    leaves one card alone. Use grid-cols-1 on mobile or hide the 5th below md.
    File: src/components/FeaturedReads.tsx

23. FunnelStrip "Hover for quotes" dead on mobile — Swap to "Tap for quotes"
    on touch or remove the instruction.
    File: src/components/FunnelStrip.tsx

24. Evidence tier colors not used on homepage funnel — FunnelStrip uses its
    own color palette disconnected from the 4-tier system. A reader who learns
    tier colors on /predictions gets confused by different color semantics on
    the homepage.
    File: src/components/FunnelStrip.tsx

25. Trend indicator colors collide with tier colors — PredictionCard uses
    green-500 for positive trends next to teal tier-2 dots. Two greens mean
    different things. Use coral #F66B5C for negative trends to match brand.
    File: src/components/PredictionCard.tsx

CODE CLEANUP

26. Delete duplicate sync script — sync-and-clean.js duplicates sync-sources.js.
    File: scripts/sync-and-clean.js

27. Prune 15 unused exports — getAllBlsTrends, DimensionScores, scoreOccupation,
    getPredictionsByCategory, listDigests, AggregateStats, EstimateType,
    ESTIMATE_TYPE_DESCRIPTIONS, getGitHubActivity, getStackOverflowActivity,
    getLastFetchDate, buildDatasetLd, buildObservationLd, SubmissionInput, ProxyContext.
    Files: various in src/lib/

───────────────────────────────────────────────────────
 BACKLOG (nice-to-haves, when-touching)
───────────────────────────────────────────────────────

28. SplitFlapWord ends on "maybe?" — The terminal state undercuts the
    evidence-based tone. End on "yet." instead.
    File: src/components/SplitFlapWord.tsx

29. FunnelStrip whiskers only on hover — Show at low opacity (0.15) by
    default, brighten on hover. Rewards the glance.
    File: src/components/FunnelStrip.tsx

30. Audit unused Google Font imports — globals.css imports 4 families
    (DM Mono, DM Sans, Inter, Source Serif 4). DM Mono and DM Sans may
    be unused. Each adds 100-200ms to FCP.
    File: src/app/globals.css

31. Extract useCommitCount() hook — AboutStats.tsx and FooterStats.tsx both
    independently fetch /api/commit-count with identical patterns.
    Files: src/components/AboutStats.tsx, src/components/FooterStats.tsx

32. Move job-tasks.ts to JSON — 8,037-line TypeScript data file. Should
    be .json for faster parsing.
    File: src/data/job-tasks.ts

───────────────────────────────────────────────────────
 WATCH (informational, no action needed)
───────────────────────────────────────────────────────

- Hero stats verified: projected ~1% (correct), measured ~0% (correct)
- last-updated.json (2026-03-20) matches latest data commit
- confirmed-sources.json counts (462/462) accurate
- All history arrays sorted correctly, no duplicate entries
- CLAUDE.md taxonomy stale (lists 16 graphs, loader has 18+1 unloaded) —
  update when next editing CLAUDE.md
- auto-audit.js may have a calculation bug (reports 3% projected drift
  but independent calc confirms ~1% is correct) — investigate when touching

═══════════════════════════════════════════════════════
 END OF SWEEP
═══════════════════════════════════════════════════════
