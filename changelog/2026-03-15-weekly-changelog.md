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

### METR Developer Productivity Retraction (key update)

METR published an update on Feb 24, 2026 retracting the reliability of their widely-cited finding that AI slows experienced developers by 19%. Their follow-up study with 57 developers across 800+ tasks found the original result was driven by severe selection bias. New estimates show speedup, not slowdown: -18% for original developers (CI: -38% to +9%) and -4% for new recruits (CI: -15% to +9%). METR is redesigning their study entirely.

**Site changes:** Updated overlay in `tech-sector.json` from "down" signal to "up" signal. Updated source entries in `confirmed-sources.json` and source-content files. Original source marked as retracted.

### Batch ingestion: 39 papers (commit `3d036c8`)
- **Daniotti (Science, 2025)** -- T1: Peer-reviewed study on AI adoption patterns
- **Merali et al. (Yale RCT, 2025)** -- T1: Randomized controlled trial measuring AI productivity effects
- **Dell'Acqua et al. (NBER/HBS, 2024)** -- T1: Field experiment on AI-augmented consulting
- **Jiang et al. (NBER, 2025)** -- T1: Wage effects of AI exposure across occupations
- **Klump meta-analysis (2024)** -- T1: Cross-study analysis of AI displacement estimates
- **Sarkar (Cursor study, 2025)** -- T1: Software development productivity with AI coding tools
- **Chatterji (NBER, 2025)** -- T1: AI and entrepreneurship effects
- **Dillon (NBER, 2025)** -- T1: AI and labor market transitions
- **BIS bulletins** -- T2: Bank for International Settlements on AI financial sector effects
- **Pew Research (2025)** -- T2: Public attitudes toward AI in the workplace
- **Microsoft Work Trend Index (2025)** -- T2: Enterprise AI adoption survey
- **Brookings (2025)** -- T2: Regional AI exposure analysis
- Updated 11 prediction graphs

### Academic sources batch: 9 papers (commit `66e0da2`)
- **Shen & Tamkin (2026)** -- T1: AI use impairs skill formation in early-career workers
- **OECD Skills Gap Report (2025)** -- T2: 1-in-3 OECD jobs have high AI exposure
- Updated 6 prediction graphs

### Individual ingestions (14 commits)
| Source | Tier | Graphs Updated |
|--------|------|----------------|
| ESB/Rabobank Dutch youth GenAI study | T1 | overall, white-collar, tech-sector |
| Google/BIDMC diagnostic AI study | T1 | healthcare-admin |
| McElheran, Brynjolfsson et al. (2024) -- AI Adoption in America | T1 | ai-adoption-rate, workforce-exposure |
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

All 18 prediction graphs were populated with data points and directional overlay signals this week. Notable data movements:

- **Overall US Job Displacement**: Multiple estimates converged around -3% weighted average from 14 sources
- **Tech Sector Displacement**: METR overlay updated from "down" (AI slows devs) to "up" (retraction confirms likely speedup), shifting the signal mix for this graph
- **Customer Service Automation**: Deutsche Bank data added (T2), reinforcing high-automation trajectory
- **Freelancer Rate Impact**: Upwork and Fiverr FY2025 earnings data showing platform revenue trends
- **Healthcare Admin Displacement**: Trinity Health RCM layoffs + Google/BIDMC diagnostic AI overlays
- **AI Adoption Rate**: McElheran/Brynjolfsson Census BTOS data providing T1 baseline

---

## C. Prediction Graph Structural Changes

### New graphs created (2 beyond original 16)
- **`robots-physical-automation`** -- Physical automation displacement estimate (~8% of physical-task jobs), 12 sources across evidence tiers
- **`total-jobs-lost`** -- Aggregate displacement tracking

### Graph removed
- **`geographic-wage-divergence`** -- Removed; defensible sources salvaged to other graphs (commit `e7862d8`)

### Metadata updates
- All 18 graphs received `currentConsensus`, `consensusRange`, and `weightedAverage` calculations
- Education and healthcare-admin descriptions updated with richer research context (commit `2a532e6`)

---

## D. Site Pages & Features

### New: Job Task Visualizer (`/task-visualizer`) -- commits `4dbaa53` through `dca0f12`
Interactive tool that breaks 34 occupations into automatable task components. Features:
- **Task Breakdown**: Slider-based task decomposition (normalized to 100%) with per-task AI capability scores
- **Compute Costs**: API cost vs. deployed cost (5x overhead) comparison across tasks
- **Automation Timeline**: Crossover model using sigmoid function (k=6) for when AI cost undercuts human labor
- **Focus Recommendations**: Durable skills analysis based on task automation risk
- 14 new job profiles added in final iteration (Copywriter, Video Editor, College Professor, etc.)
- Methodology documentation and optimistic durable-skills framing

### New: US Economy View (`/task-visualizer/economy`) -- commit `7481e1e`
Macro automation impact across 160M US workers using BLS OEWS May 2024 data:
- **Workforce Overview**: 22 SOC occupation groups segmented by income tier (Low/Middle/High)
- **Automation Wave**: Area chart projecting automation adoption 2026-2040
- **Year Explorer**: Interactive slider showing annual automation exposure by occupation
- **Income Tier Cards**: Clickable cards that filter the workforce chart
- **Gender Impact Tab**: Occupational segregation-driven differential exposure analysis
- Click-through navigation between economy view and individual job profiles

### New: Study Submission (`/suggest`) -- commit `51d4a2e`
- URL-only submission form with Zod validation
- Rate limiting: 3/hr per IP, 30/hr global
- Neon DB storage; admin GET endpoint later removed in favor of direct DB review

### New: Full-Text Search -- commit `a0ed918`
- Indexes prediction excerpts, overlay labels, and source content across 323 source-content files
- Search index built via `scripts/build-search-index.ts` (732 KB)

### New: Reading List (`/learn/reading-list`) -- commit `7f8609d`
- Rolling roster of 18 curated articles grouped by week with evidence tier badges

### New: Header Ticker -- commit `71537d3`
- Scrolling feed of 30 most recent sources at subtle 35% opacity
- Desktop only, pauses on hover, gradient fade edges

### Updated: Footer -- commit `378cff6`
- Live project stats: days since Feb 22, 2025 start + total commit count via GitHub API
- New `FooterStats` component with daily revalidation

### Updated: Navigation -- commit `9ca39b6`
- "About" promoted to top-level
- "History" moved from Learn to Analysis dropdown
- "J-Curve" renamed to "What's a J-Curve"
- "Suggest Source" added with coral accent

### Updated: Color Design System -- commits `e7cbc97`, `91fe040`, `a08706b`, `21c3258`
- Evidence tier palette aligned: indigo/teal/amber/gray (eliminated semantic collisions)
- Chart gridline opacity: 0.15-0.2 reduced to 0.06 (Stripe/Linear standard)
- Unified indigo palette across all chart types, then restored multi-hue for cost projections
- New `--accent-text` CSS variable for higher-contrast small text
- Homepage vertical rhythm varied from uniform 64px to musical spacing

### Updated: Featured Reads
- Rotated in: Sivulka essay, Oks ATM article, PIIE/Kolko article
- Removed: Dutch youth employment article (non-English source)
- Added "See all" link to Important Reads header

### Language cleanup -- commits `391aa1d` through `31f54a5`
- Replaced all em dashes with pipes/commas across site
- Humanized language across components (3 batches)

---

## E. Data Pipeline & Scripts

- **`scripts/build-search-index.ts`** -- New script to consolidate searchable text from source-content files into `search-index.json`
- **`scripts/lib/load-env.ts`** -- Shared environment loader extracted from duplicated logic across scripts
- **`scripts/cleanup-branches.sh`** -- New branch cleanup utility for stale remote branches
- **`src/lib/date-utils.ts`** -- Consolidated date utility; fixed midnight temporal bug in `apply-ingestion.ts`
- **AutoResearch pipeline** -- Ran autonomous source discovery, ingesting Deutsche Bank and Morgan Stanley, logging 11 financial institution candidates

---

## F. Configuration & Infrastructure

- **`package.json`**: New `build:search` npm script (`tsx scripts/build-search-index.ts`)
- **`next.config.js`**: Fixed for Next.js 16 compatibility (moved `outputFileTracingIncludes`, added `turbopack.root`)
- **Database**: Made optional for preview deployments without Neon branch
- **Code review cleanup**: Deduplicated tier color maps, refactored `renderDotShape` from 11 positional params to typed object, optimized `prediction-stats.ts`
- No new package dependencies added

---

## LinkedIn Post Draft

See `2026-03-15-linkedin-post.txt`
