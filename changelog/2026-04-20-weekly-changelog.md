# jobsdata.ai Weekly Changelog — Week of April 13-20, 2026

**Review window:** 2026-04-13 → 2026-04-20
**Generated:** 2026-04-20
**Branch:** `claude/run-changelog-linkedin-post-xkbXJ`

---

## Metrics

```
COMMIT ACTIVITY
  Total commits this week:         48
  Total files changed:             427
  Lines added:                     ~207,040  (includes 196K from semantic-token migration)
  Lines removed:                   ~5,041

DATA ADDITIONS
  New research sources added:      13
    Tier 1 (peer-reviewed/gov):    6
    Tier 2 (institutional):        5
    Tier 3 (major press):          0
    Tier 4 (commentary/blog):      2
  New data points added:           2
  New overlay signals added:       ~30
  Prediction graphs updated:       9

SITE CHANGES
  New pages or features:           5
  Script/pipeline changes:         3

REGISTRY STATE
  Confirmed sources total:         529 (up from ~524)
  Verified sources:                519 (up from ~514)
```

---

## A. New Research Sources Added

### Tier 1 — Peer-reviewed / Government / SEC

1. **Barth, Hoen, Kerr, Kerr — "Declining Occupations and Career Outcomes in Norway"** (NBER w35096, 2026-04-20)
   - Feeds: `white-collar-professional-displacement`, `median-wage-impact`
   - Finding: Workers initially in occupations that later decline 25%+ show 0.4 lower future years of work and 4.7% cumulative earnings loss over 2007-2024.
   - Commit: `9441be7`

2. **Yale Budget Lab — "April 2026 CPS Tracker Update"** (Gimbel, Kendall, Kulsakdinun, 2026-04-16)
   - Feeds: `overall-us-displacement`, `workforce-ai-exposure`
   - Finding: March CPS + Anthropic February usage metrics show no substantial change. Dissimilarity, exposure, and usage metrics remain flat or within historical ranges. Exposure/automation/augmentation measures show no relationship with employment or unemployment changes.
   - Commit: `33098cb`

3. **NY Fed Liberty Street Economics — Hashim, Kosar, van der Klaauw** (2026-04-14)
   - Feeds: `genai-work-adoption` (new data point: 39%), `overall-us-displacement`
   - Finding: Based on Nov 2025 Survey of Consumer Expectations supplemental questions. 39% of US workers using GenAI at work. 62% of workers expect AI-driven unemployment rise over next 12 months. Coverage of education, income, training-access, and tool-availability disparities.
   - Commit: `7c027c5`

4. **Federal Reserve FEDS Note — "AI Adoption Monitoring"** (2026)
   - Feeds: `ai-adoption-rate` (new data point: 18%), `overall-us-displacement`, `genai-work-adoption`
   - Finding: BTOS 18% firm adoption end-2025 (new data_point). RPS 41% workforce GenAI Nov 2025. SBU 78% employment-weighted firm adoption. >20% planned H1 2026 adoption.
   - Commit: `eddd6d1` (k0t1k digest)

5. **Anthropic + McCrory — "Exposure Analysis"** (via Fortune, 2026)
   - Feeds: `tech-sector-displacement`, `workforce-ai-exposure`
   - Finding: Coding shows 94% theoretical exposure vs ~30% actual task adoption.
   - Commit: `eddd6d1`

6. **OpenAI — "AI Jobs Transition Framework" (Richmond, 2026)**
   - Feeds: `overall-us-displacement`, `genai-work-adoption`, `workforce-ai-exposure`
   - Commit: `e0b9b92`

### Tier 2 — Institutional Analysis

7. **Stanford HAI — "The 2026 AI Index Report"** (featured read)
   - Findings: Software developers aged 22-25 employment down 20% since 2024. GenAI 53% global / 28.3% US adoption. Physicians -83% note-writing time.
   - Commit: `eddd6d1`

8. **Molly Kinder (Brookings) — "Medical Residency Model for AI Workforce"** (Jan 2026)
   - Feeds: `entry-level-wage-impact`
   - Context: Hassabis Davos 2026 warning that AI will hit junior-level jobs and internships this year.
   - Commit: `84c6b1d`

9. **Gallup — "Rising AI Adoption Spurs Workforce Changes"** (Feb 2026, n=23,717)
   - Feeds: `genai-work-adoption`, `ai-adoption-rate`
   - Commit: `ec56146`

10. **Goldman Sachs — Displacement Analysis** (via Fortune)
    - Feeds: `overall-us-displacement`, `entry-level-wage-impact`
    - Findings: -16k net US jobs/month; -25k substitution / +9k augmentation; entry-level wage gap +3.3pp per 1 SD AI exposure.
    - Commit: `eddd6d1`

11. **Goldman Sachs — Scarring Analysis** (via CNN)
    - Feeds: `overall-us-displacement`, `median-wage-impact`
    - Findings: Tech-displaced workers -10pp real earnings 10yrs later, >3% short-run hit, recession amplifies joblessness risk by +5pp.
    - Commit: `eddd6d1`

12. **Challenger — March 2026 Layoffs Report** (via Forbes)
    - Feeds: `overall-us-displacement`
    - Finding: AI cited in 25% of 60,620 March 2026 job cut announcements.
    - Commit: `eddd6d1`

### Tier 4 — Commentary / Blog

13. **Matthew Yglesias — "Not Bad Marketing" (Slow Boring)** (April 2026)
    - Feeds: `overall-us-displacement`
    - Finding: AI-company executives' predictions of large-scale disemployment reflect sincere belief rather than strategic messaging. One directional overlay (up).
    - Commit: `f6f1835`

14. **Alex Imas — "What Will Be Scarce?" (Substack)** (April 14, 2026)
    - Feeds: `customer-service-automation` (down), `creative-industry-displacement` (down)
    - Findings: Starbucks rolling back automation, rehiring baristas. Imas/Mandel experiment: human art commands 44% exclusivity premium vs only 21% for AI art.
    - Commit: `6fef825`

---

## B. New Data Points & Overlay Signals

### New data points

- `ai-adoption-rate`: Fed BTOS 18% firm adoption end-2025 (Tier 1)
- `genai-work-adoption`: NY Fed SCE 39% US workers using GenAI at work, Nov 2025 (Tier 1)

### New overlays by graph

| Graph | Overlays added | Notable |
|---|---|---|
| `overall-us-displacement` | ~8 | Yale Budget Lab (neutral + down), NY Fed SCE (up), Yglesias (up), OpenAI Richmond, Goldman x2, Challenger, Fed FEDS |
| `white-collar-professional-displacement` | 1 | NBER Barth: -0.4 years of work for declining-occupation cohorts (up) |
| `median-wage-impact` | 1 | NBER Barth: 4.7% cumulative earnings loss (down) |
| `entry-level-wage-impact` | 1 | Kinder/Brookings: Hassabis Davos warning on juniors and internships (down) |
| `customer-service-automation` | 1 | Imas: Starbucks rehiring baristas (down) |
| `creative-industry-displacement` | 1 | Imas/Mandel: 44% human exclusivity premium (down) |
| `workforce-ai-exposure` | 5 | Yale Budget Lab (3x neutral), OpenAI Richmond, Anthropic/McCrory |
| `genai-work-adoption` | 10+ | NY Fed SCE (4), Gallup (3), OpenAI Richmond (1), Fed FEDS (1) |
| `ai-adoption-rate` | 2 | Gallup Feb 2026 coverage |

Hero stat drift: weighted average on `overall-us-displacement` remains within ~1pp of the currently-displayed "~1% Projected job loss" — no hero update needed this week.

---

## C. Prediction Graph Structural Changes

No schema changes this week. Unicode restoration (→, —) applied across several files after an incidental `ensure_ascii=True` escape in commit `9441be7` (cosmetic, same rendering, different bytes).

---

## D. Site Pages & Features

### New pages

1. **`/prediction`** — 12 evidence-backed 2030 forecasts with betting UI (PR #565, commit `6def188`)
   - 12 research-backed predictions across displacement, wages, adoption, productivity
   - Interactive "Place Your Prediction" form with sliders and localStorage
   - Six-economist assessment (Acemoglu, Brynjolfsson, Gimbel, Bessen, Kolko, Imas) with convergence/divergence analysis
   - Currently unlisted in navigation while iterating on content

2. **`/scorecard/[slug]` + `/scorecard`** — Layer 1 AI Scorecard for 342 occupations (commit `4481717`)
   - SSG pages with generateStaticParams, autocomplete search
   - Score computation using existing exposure field (1-10 scale)
   - Four score bands: Getting Started, Building Momentum, AI-Powered, AI-Native
   - Task breakdown bars from taskComposition data
   - Zero API calls at runtime, $0 runtime cost
   - Sitemap updated with 342+ new URLs

### New features

3. **Layer 2 Quick Plan** (commit `acf7876`)
   - `POST /api/assessment/quick-plan`: single Haiku call (~$0.01-0.03)
   - Input: occupation + team size + industry + free-text goal
   - Output: 5 personalized actions with timelines and tool recommendations
   - Zod validation on both input and Haiku JSON output
   - Templated fallback if Haiku fails, times out, or returns bad JSON
   - `QuickPlan` client component integrated into `ScorecardView`

4. **Inline AI score preview in assessment form step 2** (commit `d754130`)
   - New API route for fuzzy occupation matching (keeps 118K JSON server-side)
   - `AiScorePreview` component with loading, disambiguation, and preview states
   - Animated score count-up and glow in preview

5. **Assessment synonym matching + microinteractions** (PR #572)
   - Fixed 12 broken alias slug references to match enriched-occupations data
   - Added broad token + category keyword fallback
   - Spring-loaded Continue/Submit buttons, pill pop animations, particle burst
   - All animations respect `prefers-reduced-motion`

### Design system overhaul

- **FINDING-001**: Google Fonts → `next/font` migration (performance)
- **FINDING-003**: Removed left-border grow on card hover; removed left accent bar from nav-row hover
- **FINDING-004**: Established systematic type scale across 116 files (1,770 insertions / 1,755 deletions)
- **FINDING-005**: Added ARIA attributes on Navbar + interactive components; added focus-visible keyboard focus ring
- Color token consolidation across 40 files (263 insertions / 202 deletions)
- Border opacity values → semantic tokens: 305 values migrated across 107 files
- Spacing standardization across pages
- Hero triad stat opacity bump from 10-15% to 18-20%

### Chart fixes

- Switched prediction charts to numeric time axis with quarterly ticks
- Removed target date phantom point that stretched charts to 2030
- Evenly-spaced quarterly timeline on X-axis

### Copy fixes

- Updated occupation-exposure hero copy and typo fixes (#560, #561)

### Featured Reads promoted to homepage

- Alex Imas "What Will Be Scarce?" (position 0, commit `6fef825`)
- Stanford HAI "The 2026 AI Index Report" (commit `eddd6d1`)
- WSJ "The Economy Is Growing, Jobs Aren't" (commit `eddd6d1`)
- NY Fed SCE workplace AI article (commit `7c027c5`)
- Yale Budget Lab April 2026 CPS tracker (commit `33098cb`)
- OpenAI AI Jobs Transition Framework (commit `e0b9b92`)

---

## E. Data Pipeline & Scripts

- **Weekly research digest 2026-W16** (PR #589, tracked-economist focused) — standard fetch (60 items) + OpenAlex tracked-author fetch (38 items, 180-day window) + 10 curated blog posts surfaced via web search. Highlights: Bick/Blandin/Deming, Acemoglu-Autor-Johnson, Imas, Kinder, NBER forecast survey.
- **Weekly research digest 2026-W17** (PR #591, automated)
- **`/researcher-check` skill** + `src/data/researcher-watchlist.json` with 15 economists for systematic publication scanning (commit `ec56146`)
- **Daniel Rock added as Voice 7** in labor-economist-review skill (UVA/Wharton, "GPTs are GPTs") — PRs #568, #569
- **Assessment submit validation + fetch reliability fix** (commit `7db531c`)

---

## F. Configuration & Infrastructure

- `@anthropic-ai/sdk` unchanged at `^0.78.0`
- Anthropic SDK usage modernized post-review (bumped `claude-sonnet-4-20250514` → `claude-sonnet-4-6`, replaced string-match error handling with typed exceptions, added ephemeral prompt caching to assessment pipeline and digest analyzer) — commit `4a55860` on this branch

---

## Raw Commit List

```
9441be7 2026-04-20 ingest: Barth et al. 'Declining Occupations in Norway' (NBER w35096) (#592)
404da6d 2026-04-20 chore: weekly research digest 2026-W17 [automated] (#591)
f6f1835 2026-04-20 ingest: Yglesias Slow Boring 'not bad marketing' → overall-us-displacement (#590)
84c6b1d 2026-04-19 research: weekly digest 2026-W16 — tracked-economist focused (#589)
21b0f78 2026-04-19 Style/semantic border tokens (#588)
77c0884 2026-04-19 fix: switch prediction charts to numeric time axis with quarterly ticks
16bdc8c 2026-04-19 fix: remove target date phantom point that stretched chart to 2030 (#587)
ee8c6ed 2026-04-19 fix: evenly-spaced quarterly timeline on prediction chart X axis (#586)
259840f 2026-04-19 Style/semantic border tokens (#585)
063e8e5 2026-04-19 Style/semantic border tokens (#584)
4a53658 2026-04-18 Style/semantic border tokens (#583)
2a2fa8f 2026-04-17 style: improve visual hierarchy and reduce density across site (#582)
2de1c5b 2026-04-17 Style/semantic border tokens (#581)
b715e2a 2026-04-17 Style/semantic border tokens (#580)
821a0af 2026-04-17 Style/semantic border tokens (#579)
6cbecad 2026-04-17 Style/semantic border tokens (#578)
42452d3 2026-04-17 Style/semantic border tokens (#577)
32ee853 2026-04-17 Style/semantic border tokens (#576)
bf77b3b 2026-04-17 style: standardize spacing across pages (#575)
4d5765f 2026-04-17 style: migrate 305 border opacity values to semantic tokens (#574)
e0b9b92 2026-04-17 Ingest OpenAI AI Jobs Transition Framework (Richmond, 2026) (#573)
b8d8fc7 2026-04-16 Feat/assessment synonym matching (#572)
33098cb 2026-04-16 Ingest Yale Budget Lab April 2026 CPS tracker update (#571)
131a1af 2026-04-16 feat: add synonym matching and clarify AI exposure score labeling (#570)
d754130 2026-04-16 feat: integrate instant AI score preview into assessment form step 2
cb1de4b 2026-04-16 Claude/add rock reviewer cv ohk (#569)
acf7876 2026-04-16 feat: add Layer 2 Quick Plan — personalized AI action plan via Claude Haiku
4481717 2026-04-16 feat: add Layer 1 AI Scorecard — instant score for 342 occupations
445a37e 2026-04-16 Add Daniel Rock as Voice 7 in labor economist review skill (#568)
f0ab13e 2026-04-16 Claude/predictions betting page doy5 a (#567)
1201747 2026-04-16 Claude/predictions betting page doy5 a (#566)
e76a5d1 2026-04-16 style: bump hero triad stat opacity from 10-15% to 18-20%
fd7b938 2026-04-16 style(design): FINDING-005 — ARIA for interactive components
473cdb1 2026-04-16 style(design): FINDING-005 — add ARIA attributes to Navbar
db55495 2026-04-16 style(design): color token consolidation
452014e 2026-04-16 style(design): FINDING-004 — establish systematic type scale
8499121 2026-04-16 style(design): FINDING-003b — remove left accent bar from nav-row hover
50a380c 2026-04-16 style(design): FINDING-005 — add focus-visible keyboard focus ring
acb1795 2026-04-16 style(design): FINDING-003 — remove left-border grow on card hover
ae1e722 2026-04-16 style(design): FINDING-001 — migrate Google Fonts to next/font
6def188 2026-04-16 Add /prediction page: 12 evidence-backed 2030 forecasts with betting UI (#565)
ec56146 2026-04-15 feat: add Gallup AI adoption overlays + researcher tracking system
7c027c5 2026-04-15 Ingest NY Fed SCE article on workplace AI use and training (#564)
6fef825 2026-04-14 Ingest Imas "What will be scarce?" (post-commodity economy essay) (#563)
eddd6d1 2026-04-14 Claude/add labor research digest k0t1k (#562)
37d423e 2026-04-13 Fix typos in occupation-exposure copy (#561)
ae6f76c 2026-04-13 Update occupation-exposure hero copy (#560)
7db531c 2026-04-13 fix: assessment submit validation and fetch reliability
2b403c9 2026-04-13 Claude/add labor research digest k0t1k (#559)
```

---

## LinkedIn Post (publishable)

See `changelog/2026-04-20-linkedin-post.txt`.
