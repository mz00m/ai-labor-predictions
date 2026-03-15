# jobsdata.ai Weekly Changelog

**Review window:** 2026-03-08 to 2026-03-15
**Generated:** 2026-03-15
**Edition:** Week 3

---

## Metrics Summary

```
COMMIT ACTIVITY
  Total commits this week:         150
  Non-merge commits:               88
  Total files changed:             1,553
  Lines added:                     171,097
  Lines removed:                   3,768

DATA ADDITIONS
  New research sources added:      91 (316 -> 407)
    Tier 1 (peer-reviewed):        47
    Tier 2 (think tank/intl org):  37
    Tier 3 (major press):          5
    Tier 4 (blog/opinion):         2
  Prediction graphs updated:       11+
  New prediction graph:            1 (robots-physical-automation)

SITE CHANGES
  New pages/routes:                5
  New components:                  20+
  Script/pipeline changes:         3
```

---

## A. New Research Sources Added

91 new sources this week (316 -> 407 total). Key ingestions:

### Batch ingestion: 39 papers (commit `3d036c8`)
- **Daniotti (Science, 2025)** -- T1: AI adoption patterns in scientific research workflows
- **Merali et al. (Yale RCT, 2025)** -- T1: Randomized controlled trial on AI productivity effects
- **Dell'Acqua et al. (NBER/HBS, 2024)** -- T1: Field experiment on AI-augmented consulting
- **Jiang et al. (NBER, 2025)** -- T1: Wage effects of AI exposure across occupations
- **Klump meta-analysis (2024)** -- T1: Cross-study analysis of AI displacement estimates
- **Sarkar (Cursor study, 2025)** -- T1: Software dev productivity with AI coding tools
- **BIS bulletins** -- T2: Bank for International Settlements on AI financial sector effects
- **Pew Research (2025)** -- T2: Public attitudes toward AI in the workplace
- **Microsoft Work Trend Index (2025)** -- T2: Enterprise AI adoption survey
- Updated 11 prediction graphs

### Academic sources batch: 9 papers (commit `66e0da2`)
- **Shen & Tamkin (2026)** -- T1: AI use impairs skill formation in early-career workers
- **OECD Skills Gap Report (2025)** -- T2: 1-in-3 OECD jobs have high AI exposure
- Updated 6 prediction graphs

### Individual ingestions
| Source | Tier | Graphs Updated |
|--------|------|----------------|
| ESB/Rabobank Dutch youth GenAI study | T1 | overall, white-collar, tech-sector |
| Google/BIDMC diagnostic AI study | T1 | healthcare-admin |
| McElheran, Brynjolfsson et al. (2024) | T1 | ai-adoption-rate, workforce-exposure |
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

### AutoResearch pipeline
- Ingested Deutsche Bank and Morgan Stanley via autonomous discovery
- Logged 11 financial institution candidates to `candidates.tsv` for future ingestion

---

## B. New Data Points & Overlay Signals

Key data movements this week:

- **Healthcare Admin Displacement**: Trinity Health RCM layoffs + Google/BIDMC diagnostic AI study add first real-world layoff signal to this graph
- **Freelancer Rate Impact**: Upwork and Fiverr FY2025 earnings provide first platform-level revenue data for gig economy exposure
- **Customer Service Automation**: Deutsche Bank estimates added (T2)
- **Tech Sector Displacement**: METR overlay updated to reflect their Feb 2026 study redesign announcement
- **AI Adoption Rate**: McElheran/Brynjolfsson Census BTOS data strengthens T1 baseline

---

## C. Prediction Graph Structural Changes

- **New graph: `robots-physical-automation`** -- Physical/industrial automation displacement estimate (~8% of physical-task jobs), 12 sources. Extends coverage beyond white-collar and service roles.
- **Removed: `geographic-wage-divergence`** -- Insufficient defensible sources; usable sources salvaged to other graphs.
- Net change: 17 -> 18 prediction graphs
- Education and healthcare-admin descriptions updated with research context

---

## D. Site Pages & Features

### New: Job Task Visualizer (`/task-visualizer`)
The headline feature this week. Interactive tool that breaks 34 occupations into automatable task components with four views:
- **Task Breakdown**: Slider-based decomposition (normalized to 100%) with per-task AI capability scores and raw API cost estimates
- **Compute Costs**: API cost vs. deployed cost (5x overhead for integration, validation, monitoring) comparison
- **Automation Timeline**: Sigmoid crossover model (k=6) projecting when AI total production cost undercuts human labor cost per task
- **Focus Recommendations**: Durable skills analysis based on which tasks are hardest to automate
- 34 job profiles with BLS wage data, O*NET-informed task structures, and compute cost modeling
- Methodology documentation explaining assumptions and limitations

### New: US Economy View (`/task-visualizer/economy`)
Macro automation exposure view built on BLS OEWS May 2024 data:
- **Workforce Overview**: 22 SOC occupation groups covering 160M workers, segmented by income tier
- **Automation Wave**: Area chart projecting adoption curves 2026-2040
- **Year Explorer**: Interactive slider with clickable bars linking to individual job profiles
- **Income Tier Cards**: Clickable Low/Middle/High cards that filter the workforce chart
- **By Gender tab**: Occupational segregation-driven differential exposure analysis
- Click-through navigation between economy view and individual job profiles

### New: Study Submission (`/suggest`)
- URL-only form with Zod validation, rate limited (3/hr per IP, 30/hr global), Neon DB storage

### New: Reading List (`/learn/reading-list`)
- 18 curated articles grouped by week with evidence tier badges

### New: Full-Text Search
- Indexes all source excerpts, overlay labels, and prediction content (732 KB index)

### Updated: Header Ticker
- Scrolling feed of 30 most recent sources, desktop only, pauses on hover

### Updated: Footer
- Live project stats (days since launch, commit count via GitHub API, daily revalidation)

### Updated: Navigation
- "About" promoted to top-level, "History" moved to Analysis dropdown, "Suggest Source" added with coral accent

### Updated: Color Design System
- Evidence tier palette: indigo/teal/amber/gray (eliminated semantic collisions with metric colors)
- Chart gridlines reduced to 0.06 opacity
- Unified then diversified chart palettes: single indigo for data, multi-hue for cost projections
- New `--accent-text` CSS variable, musical homepage spacing

### Updated: Featured Reads
- Rotated in: Sivulka essay, Oks ATM article, PIIE/Kolko article
- Removed: Dutch youth employment article

### Language & Code Cleanup
- Replaced all em dashes with pipes/commas across entire site
- Humanized language across components (3 batches)
- Fixed midnight temporal bug in ingestion pipeline
- Consolidated date utility, shared env loader, deduplicated tier color maps
- Refactored `renderDotShape` from 11 positional params to typed object

---

## E. Data Pipeline & Scripts

- **`scripts/build-search-index.ts`** -- Consolidates searchable text into lazy-loaded index
- **`scripts/lib/load-env.ts`** -- Shared env loader extracted from duplicated logic
- **`scripts/cleanup-branches.sh`** -- Stale remote branch cleanup
- **AutoResearch pipeline** -- Autonomous source discovery, ingested 2 sources, logged 11 candidates

---

## F. Configuration & Infrastructure

- **`package.json`**: New `build:search` npm script
- **`next.config.js`**: Fixed for Next.js 16 (moved `outputFileTracingIncludes`, added `turbopack.root`)
- **Database**: Made optional for preview deployments without Neon branch
- No new package dependencies

---

## LinkedIn Post Draft

See `2026-03-15-linkedin-post.txt`
