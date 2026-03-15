# jobsdata.ai Weekly Changelog

**Review window:** 2026-03-08 to 2026-03-15
**Generated:** 2026-03-15
**Edition:** Launch Week

---

## Metrics Summary

```
COMMIT ACTIVITY
  Total commits this week:         151 (87 non-merge)
  Total files changed:             2,082
  Lines added:                     247,967
  Lines removed:                   3,589

DATA ADDITIONS
  New research sources added:      407 (full registry built this week)
    Tier 1 (peer-reviewed):        219
    Tier 2 (think tank/intl org):  150
    Tier 3 (major press):          28
    Tier 4 (blog/opinion):         10
  New data points added:           ~200+ (across all 18 prediction graphs)
  New overlay signals added:       ~80+ (directional signals across graphs)
  Prediction graphs created:       18

SITE CHANGES
  New pages/routes:                7
  New components:                  61+
  Script/pipeline changes:         3 new scripts
```

Note: This is the launch week. The site went from zero to full deployment, so all sources and data points are new.

---

## A. New Research Sources Added

**407 verified sources** now populate the registry (`src/data/confirmed-sources.json`), spanning 18 prediction graphs. Highlights from the week's major ingestion batches:

### Batch ingestion: 39 papers (commit `3d036c8`)
- **Daniotti (Science, 2025)** — T1: Peer-reviewed study on AI adoption patterns in scientific research workflows
- **Merali et al. (Yale RCT, 2025)** — T1: Randomized controlled trial measuring AI productivity effects
- **Dell'Acqua et al. (NBER/HBS, 2024)** — T1: Field experiment on AI-augmented consulting
- **Jiang et al. (NBER, 2025)** — T1: Wage effects of AI exposure across occupations
- **Klump meta-analysis (2024)** — T1: Cross-study analysis of AI displacement estimates
- **Sarkar (Cursor study, 2025)** — T1: Software development productivity with AI coding tools
- **Chatterji (NBER, 2025)** — T1: AI and entrepreneurship effects
- **Dillon (NBER, 2025)** — T1: AI and labor market transitions
- **BIS bulletins** — T2: Bank for International Settlements on AI financial sector effects
- **Pew Research (2025)** — T2: Public attitudes toward AI in the workplace
- **Microsoft Work Trend Index (2025)** — T2: Enterprise AI adoption survey
- **Brookings (2025)** — T2: Regional AI exposure analysis
- Updated 11 prediction graphs

### Academic sources batch: 9 papers (commit `66e0da2`)
- **Becker/METR RCT (2025)** — T1: AI slows experienced developers by 19% (counterintuitive finding)
- **Shen & Tamkin (2026)** — T1: AI use impairs skill formation in early-career workers
- **OECD Skills Gap Report (2025)** — T2: 1-in-3 OECD jobs have high AI exposure
- Updated 6 prediction graphs

### Individual ingestions (14 commits)
| Source | Tier | Graphs Updated |
|--------|------|----------------|
| ESB/Rabobank Dutch youth GenAI study | T1 | overall, white-collar, tech-sector |
| Google/BIDMC diagnostic AI study | T1 | healthcare-admin |
| McElheran, Brynjolfsson et al. (2024) — AI Adoption in America | T1 | ai-adoption-rate, workforce-exposure |
| NBER technological unemployment paper | T1 | overall |
| Morgan Stanley AI survey (2026) | T2 | overall |
| Deutsche Bank AI predictions (2026) | T2 | customer-service, financial-services, tech-sector |
| Trinity Health RCM layoffs | T2 | healthcare-admin |
| McKinsey Agents/Robots report | T2 | creative-industry, overall, white-collar |
| PIIE/Kolko article | T2 | overall, ai-adoption-rate |
| Bloomberry (180M job postings) | T2 | creative-industry |
| Upwork FY2025 earnings | T2 | freelancer-rate-impact |
| Fiverr FY2025 earnings | T2 | freelancer-rate-impact |
| BizJournals AI layoffs divide | T3 | ai-adoption-rate, overall, white-collar |
| Oks ATM/iPhone bank teller article | T3 | overall, financial-services |
| Sivulka institutional AI essay | T4 | reading list only |

### AutoResearch runs
- Logged 11 financial institution candidates (BNP, Barclays, MS $920B, higher ed) to `candidates.tsv`
- Ingested Deutsche Bank and Morgan Stanley via autoresearch pipeline

---

## B. New Data Points & Overlay Signals

All 18 prediction graphs were populated with initial data points and directional overlay signals this week. Notable data movements:

- **Overall US Job Displacement**: Multiple estimates converged around -3% weighted average from 14 sources
- **Customer Service Automation**: Deutsche Bank data added (T2), reinforcing high-automation trajectory
- **Freelancer Rate Impact**: Upwork and Fiverr FY2025 earnings data showing platform revenue trends
- **Healthcare Admin Displacement**: Trinity Health RCM layoffs + Google/BIDMC diagnostic AI overlays
- **AI Adoption Rate**: McElheran/Brynjolfsson Census BTOS data providing T1 baseline

---

## C. Prediction Graph Structural Changes

### New graphs created (2 beyond original 16)
- **`robots-physical-automation`** — Physical automation displacement estimate (~8% of physical-task jobs), 12 sources across evidence tiers
- **`total-jobs-lost`** — Aggregate displacement tracking

### Graph removed
- **`geographic-wage-divergence`** — Removed; defensible sources salvaged to other graphs (commit `e7862d8`)

### Metadata updates
- All 18 graphs received `currentConsensus`, `consensusRange`, and `weightedAverage` calculations
- Education and healthcare-admin descriptions updated with richer research context (commit `2a532e6`)

---

## D. Site Pages & Features

### New: Job Task Visualizer (`/task-visualizer`) — commits `4dbaa53` through `dca0f12`
Interactive tool that breaks 34 occupations into automatable task components. Features:
- **Task Breakdown**: Slider-based task decomposition (normalized to 100%) with per-task AI capability scores
- **Compute Costs**: API cost vs. deployed cost (5x overhead) comparison across tasks
- **Automation Timeline**: Crossover model using sigmoid function (k=6) for when AI cost undercuts human labor
- **Focus Recommendations**: Durable skills analysis based on task automation risk
- 14 new job profiles added in final iteration (Copywriter, Video Editor, College Professor, etc.)

### New: US Economy View (`/task-visualizer/economy`) — commit `7481e1e`
Macro automation impact across 160M US workers using BLS OEWS May 2024 data:
- **Workforce Overview**: 22 SOC occupation groups segmented by income tier (Low/Middle/High)
- **Automation Wave**: Area chart projecting automation adoption 2026-2040
- **Year Explorer**: Interactive slider showing annual automation exposure by occupation
- **Income Tier Cards**: Clickable cards that filter the workforce chart
- **Gender Impact Tab**: Occupational segregation-driven differential exposure analysis

### New: Study Submission (`/suggest`) — commit `51d4a2e`
- URL-only submission form with Zod validation
- Rate limiting: 3/hr per IP, 30/hr global
- Neon DB storage; admin GET endpoint later removed in favor of direct DB review

### New: Full-Text Search — commit `a0ed918`
- Indexes prediction excerpts, overlay labels, and source content across 323 source-content files
- Search index built via `scripts/build-search-index.ts` (732 KB)

### New: Reading List (`/learn/reading-list`) — commit `7f8609d`
- Rolling roster of 18 curated articles grouped by week with evidence tier badges

### New: Header Ticker — commit `71537d3`
- Scrolling feed of 30 most recent sources at subtle 35% opacity
- Desktop only, pauses on hover, gradient fade edges

### Updated: Footer — commit `378cff6`
- Live project stats: days since Feb 22, 2025 start + total commit count via GitHub API
- New `FooterStats` component with daily revalidation

### Updated: Navigation — commit `9ca39b6`
- "About" promoted to top-level
- "History" moved from Learn to Analysis dropdown
- "J-Curve" renamed to "What's a J-Curve"
- "Suggest Source" added with coral accent

### Updated: Color Design System — commits `e7cbc97`, `91fe040`, `a08706b`, `21c3258`
- Evidence tier palette aligned: indigo/teal/amber/gray (eliminated semantic collisions)
- Chart gridline opacity: 0.15-0.2 reduced to 0.06 (Stripe/Linear standard)
- Unified indigo palette across all chart types, then restored multi-hue for cost projections
- New `--accent-text` CSS variable for higher-contrast small text
- Homepage vertical rhythm varied from uniform 64px to musical spacing

### Updated: Featured Reads
- Rotated in: Sivulka essay, Oks ATM article, PIIE/Kolko article
- Removed: Dutch youth employment article (non-English source)
- Added "See all" link to Important Reads header

### Language cleanup — commits `391aa1d` through `31f54a5`
- Replaced all em dashes with pipes/commas across site
- Humanized language across components (3 batches)

---

## E. Data Pipeline & Scripts

- **`scripts/build-search-index.ts`** — New script to consolidate searchable text from source-content files into `search-index.json`
- **`scripts/lib/load-env.ts`** — Shared environment loader extracted from duplicated logic across scripts
- **`scripts/cleanup-branches.sh`** — New branch cleanup utility for stale remote branches
- **`src/lib/date-utils.ts`** — Consolidated date utility; fixed midnight temporal bug in `apply-ingestion.ts`
- **AutoResearch pipeline** — Ran autonomous source discovery, ingesting Deutsche Bank and Morgan Stanley, logging 11 financial institution candidates

---

## F. Configuration & Infrastructure

- **`package.json`**: New `build:search` npm script (`tsx scripts/build-search-index.ts`)
- **`next.config.js`**: Fixed for Next.js 16 compatibility (moved `outputFileTracingIncludes`, added `turbopack.root`)
- **Database**: Made optional for preview deployments without Neon branch
- **Code review cleanup**: Deduplicated tier color maps, refactored `renderDotShape` from 11 positional params to typed object, optimized `prediction-stats.ts`
- No new package dependencies added

---

## Raw Commit List (non-merge, chronological)

| SHA | Date | Message |
|-----|------|---------|
| `7616b9f` | Mar 10 13:21 | Add robots & physical automation displacement prediction tile |
| `bee21ef` | Mar 10 13:29 | Fix robots displacement values to use positive convention |
| `dbca162` | Mar 10 13:25 | Fix Y-axis scale for earnings-call-ai-mentions to reach 100% |
| `51d4a2e` | Mar 10 13:46 | Add secure study submission feature with /suggest page |
| `dacd2c1` | Mar 10 14:00 | Remove admin GET endpoint |
| `a0ed918` | Mar 10 14:01 | Add full-text search across source content |
| `7f8609d` | Mar 10 14:00 | Ingest PIIE/Kolko article, add reading list page |
| `2b84cf6` | Mar 10 14:08 | Fix financial services displacement tile |
| `66e0da2` | Mar 10 14:32 | Ingest 9 new academic sources from reference list |
| `a52a5bc` | Mar 10 15:31 | Fix next.config.js for Next.js 16 |
| `a8159c3` | Mar 10 15:21 | Ingest McElheran, Brynjolfsson et al. (2024) |
| `29530c2` | Mar 10 15:41 | Add branch cleanup script |
| `c5f10db` | Mar 10 18:21 | Remove 10 synthetic/unverified placeholder sources |
| `fd5ce08` | Mar 10 18:30 | Ingest Bloomberry + McKinsey sources |
| `41c4561` | Mar 10 18:36 | Ingest NBER technological unemployment + Upwork FY2025 |
| `7c92f05` | Mar 10 18:38 | Ingest Fiverr FY2025 earnings |
| `aca74ec` | Mar 10 18:39 | Fix data quality issues from auto-audit |
| `161a0b7` | Mar 10 18:49 | Improve freelancer source metadata, add geographic divergence sources |
| `483248f` | Mar 10 18:55 | Add overlays for healthcare-admin and education-sector |
| `c1ee260` | Mar 10 19:26 | Make database optional for preview deployments |
| `326a040` | Mar 10 19:35 | Fix invalid next.config.js options and eslint error |
| `9d7449d` | Mar 10 19:59 | Redesign RecentSources with soft transparent aesthetic |
| `6e11782` | Mar 10 20:40 | Add evidence tier label to RecentSources entries |
| `6b8df30` | Mar 10 20:51 | Backfill dateAdded on all 466 prediction sources |
| `71537d3` | Mar 10 21:01 | Add subtle header ticker showing recently added sources |
| `488c23f` | Mar 10 21:09 | Fix header ticker by embedding it inside the Navbar |
| `311868` | Mar 10 21:15 | Remove header ticker from navbar |
| `6d38e15` | Mar 10 22:59 | Add proxy metric methodology for outlier study handling |
| `9ca39b6` | Mar 11 00:55 | Reorganize navigation menu layout |
| `e7862d8` | Mar 11 01:36 | Remove duplicate Brookings overlay from geographic-wage-divergence |
| `c538895` | Mar 11 01:56 | Remove geographic-wage-divergence tile; salvage sources |
| `7f4738c` | Mar 11 09:36 | Ingest Oks ATM/iPhone bank teller article |
| `abd1fe0` | Mar 11 09:46 | Ingest BizJournals AI layoffs divide article |
| `9f0b3c0` | Mar 11 12:30 | Move Oks article to leftmost featured read |
| `55aaac2` | Mar 11 12:33 | Add 'See all' link to Important Reads header |
| `eeea9a7` | Mar 11 13:38 | Ingest Google/BIDMC diagnostic AI study |
| `e8f0fb2` | Mar 11 19:32 | Ingest Sivulka institutional AI essay |
| `16c8e37` | Mar 11 19:44 | Add Sivulka essay to homepage featured reads |
| `f073080` | Mar 11 19:45 | Document featured reads rotation convention |
| `72c033c` | Mar 12 15:47 | Ingest ESB/Rabobank Dutch youth GenAI employment study |
| `9a6f548` | Mar 12 23:34 | Fix build error: invalid metricType in overall displacement data |
| `3d036c8` | Mar 12 18:52 | Ingest 39 new AI labor market research papers across 11 graphs |
| `fc77002` | Mar 12 17:24 | Fix missing comma in tech-sector.json |
| `9df10ee` | Mar 12 17:18 | Resolve merge conflicts |
| `eb563ac` | Mar 13 00:16 | Code review cleanup: fix config, deduplicate utilities |
| `2023d27` | Mar 13 00:51 | Auto-compute hero stats, add Zod validation, ISR, date utility |
| `d1508da` | Mar 13 01:40 | Remove Dutch youth employment article from Featured Reads |
| `391aa1d` | Mar 13 09:56 | Replace em dashes and humanize site language (batch 1) |
| `92ddf7d` | Mar 13 09:58 | Replace em dashes and humanize language (batch 2) |
| `a107621` | Mar 13 10:02 | Replace em dashes and humanize language (batch 3) |
| `05d8762` | Mar 13 10:02 | Remove remaining em dashes from FeaturedReads and digest-analyzer |
| `35528d5` | Mar 13 10:03 | Remove em dashes from JCurvePage component |
| `404b3cf` | Mar 13 10:03 | Remove final em dashes from JCurvePage |
| `31f54a5` | Mar 13 10:06 | Remove em dash from ResearchEvidence workslop finding |
| `8d72aa7` | Mar 13 13:35 | Ingest Morgan Stanley AI survey 2026 |
| `2fb9faa` | Mar 13 13:38 | Ingest Deutsche Bank AI predictions 2026 |
| `3f6ceed` | Mar 13 13:41 | autoresearch: log 7 financial institution candidates |
| `331ec2a` | Mar 13 13:43 | autoresearch: log 4 additional candidates |
| `2a532e6` | Mar 13 14:02 | Update education and healthcare-admin descriptions |
| `373a198` | Mar 13 14:03 | Ingest Trinity Health RCM layoffs |
| `c1ed9f1` | Mar 13 14:03 | Fix project start date and use paginated commits API |
| `378cff6` | Mar 13 14:01 | Replace static footer text with live project stats |
| `ad05673` | Mar 13 14:14 | Consolidate footer into cleaner stacked layout |
| `db9a278` | Mar 13 14:18 | Remove duplicate suggestion links from FooterStats |
| `1d28823` | Mar 13 14:22 | Tighten footer copy per feedback |
| `b89b63f` | Mar 13 15:28 | Add 13 new tracked researchers including Alex Imas |
| `ef80ef2` | Mar 13 16:25 | Code review cleanup: fix temporal bug, consolidate date util |
| `4dbaa53` | Mar 14 14:42 | Add Job Task Visualizer: interactive tool breaking jobs into automatable tasks |
| `66ff02a` | Mar 14 14:48 | Fix task sliders to normalize at 100% |
| `7a28d12` | Mar 14 14:59 | Add 12 more job types, detailed methodology, durable skills section |
| `7481e1e` | Mar 14 15:06 | Add US Economy view: macro automation impact across 160M workers |
| `a2a18a9` | Mar 14 15:26 | Update economy data with verified BLS OEWS May 2024 figures |
| `a399b88` | Mar 14 15:40 | Add clickable economy bars, redesigned job selector, token cost model |
| `087a623` | Mar 14 15:55 | Standardize design system and add Gender Impact tab |
| `cd9d785` | Mar 14 16:04 | Fix automation model, add risk colors, question-driven headers |
| `a08706b` | Mar 14 16:15 | Simplify color system: neutral palette for charts |
| `91fe040` | Mar 14 16:29 | Unify color system: single indigo palette |
| `6127356` | Mar 14 16:33 | Rename tabs to 'By Income' / 'By Gender', fix legend |
| `0e7f4e9` | Mar 14 16:39 | Make Year Explorer bars clickable |
| `e7cbc97` | Mar 14 17:06 | Color design review: fix tier palette, contrast, gridlines |
| `99648f9` | Mar 14 20:08 | Fix ticker fade gradient + add click-through to economy |
| `d920889` | Mar 14 20:24 | Fix automation wave chart, ticker fade, chart descriptions |
| `7a13b41` | Mar 14 20:26 | Add 14 new job profiles to ensure minimum 3 per category |
| `38c724e` | Mar 14 20:31 | Clarify compute cost methodology across all tabs |
| `3bf2872` | Mar 14 20:34 | Make income tier cards clickable to filter workforce chart |
| `21c3258` | Mar 14 21:22 | Use distinct multi-hue colors for cost projection chart lines |
| `dca0f12` | Mar 14 21:49 | Viz review fixes: crossover model, sigmoid threshold, unified categories |

---

## LinkedIn Post Draft

See `2026-03-15-linkedin-post.txt`
