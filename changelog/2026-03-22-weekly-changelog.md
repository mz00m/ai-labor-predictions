# jobsdata.ai Weekly Changelog — March 15–22, 2026

**Review window:** 2026-03-15 → 2026-03-22
**Generated:** 2026-03-22

---

## Commit Activity

| Metric | Count |
|--------|-------|
| Total commits | 502 |
| Files changed | 206 |
| Lines added | ~25,000+ |
| Lines removed | ~5,000+ |

*Note: Largest week since launch. Commits span PRs #328–#425.*

## Data Additions

| Metric | Count |
|--------|-------|
| New research sources added | 24+ |
| — Tier 1 (peer-reviewed/gov) | 5+ |
| — Tier 2 (think tank/industry) | 15+ |
| — Tier 3 (major press) | 4+ |
| New data points added | 20+ |
| New overlay signals added | 30+ |
| Prediction graphs updated | 11+ |
| Occupation profiles added | 47 (67 → 114) |
| New pages created | 1 (`/occupation-exposure`) |
| New prediction tiles | 1 (AI-Driven New Business Formation) |

---

## A. New Research Sources Added

### 1. Yale Budget Lab — Jan/Feb 2026 CPS Update (Tier 1)
- **Published:** March 19, 2026
- **Feeds:** `overall-us-displacement`, `workforce-ai-exposure`
- **Finding:** January/February 2026 Current Population Survey data confirms no measurable AI labor market displacement. Occupational dissimilarity flat, exposure quintiles stable, Anthropic's new "Observed Exposure" metric shows stability over disruption.
- **Commit:** `12942c1f`

### 2. Mokyr et al. (2015) — JEP History of Technological Anxiety (Tier 1)
- **Published:** 2015 (Journal of Economic Perspectives)
- **Feeds:** `overall-us-displacement` (overlay), history page enrichment
- **Finding:** 250-year survey of technological anxiety — Ricardo's reversal, Luddite nuance, Amara's Law. Enriches the /history page with anchor references to Steam and Computer revolution cards.
- **Commit:** `46aa82cb`

### 3. Oxford Internet Institute — AI Skills Wage Premium (Tier 1)
- **Published:** 2025
- **Feeds:** `high-skill-wage-premium`
- **Finding:** 23% AI skills wage premium across 10M+ UK vacancies (2018–2024). 36% premium in STEM roles. Added as proxy data point (UK data) and overlay.
- **Commit:** `bcc23e2a`

### 4. IMF SDN/2026 — IT Skill Gaps (Tier 2)
- **Feeds:** `high-skill-wage-premium`, `entry-level-wage-impact`, `tech-sector-displacement`
- **Finding:** 3% new-skill premium. Youth employment and IT skill demand signals across multiple graphs.
- **Commit:** `1f3aafba`

### 5. Gartner CS Leaders Survey Feb 2026 (Tier 2)
- **Feeds:** `customer-service-automation`
- **Finding:** 20% of CS leaders report actual AI-driven staffing cuts. 80% expect cuts. 80% report role transitions underway.
- **Commit:** `1f3aafba`

### 6. ILO-NASK GenAI Exposure 2025 (Tier 2)
- **Feeds:** `customer-service-automation`, `white-collar-professional-displacement`
- **Finding:** Clerical exposure to GenAI and cognitive role exposure signals.
- **Commit:** `1f3aafba`

### 7. CVL Economics/Animation Guild (Tier 2)
- **Feeds:** `creative-industry-displacement`
- **Finding:** Executive survey (n=300): 21.4% of entertainment jobs (~118,500) likely eliminated by GenAI by 2026. 75% of execs say AI already supported job elimination.
- **Commit:** `6c0cb190`

### 8–24. Batch Ingestion — 17 Sources on March 19 (Mixed Tiers)
- **Commit:** `2909b8c3`
- 17 new sources ingested across 9 prediction graphs in a single session
- Includes Goldman Sachs (Briggs) "How Will AI Affect the US Labor Market?" (Mar 2026) — `cd3fe874`
- Freund & Mann (2026) "Job Transformation, Specialization, and the Labor Market Effects of AI" NBER — `c6dbfd07`
- Agrawal et al. (2026) "AI in Science" NBER WP 34953 — `bb6fe28b`
- Deloitte State of AI in the Enterprise 2026 (5 overlays) — `828c847c`
- CoworkingCafe AI jobs metro study (Mar 2026) — `eaf0f26c`

### PwC AI Jobs Barometer (Tier 2)
- **Feeds:** `overall-us-displacement`, `entry-level-wage-impact`, `education-sector-displacement`
- **Finding:** 38% job growth in AI-exposed occupations. 55% skill churn. Degree requirement decline signal.
- **Commit:** `1f3aafba`

---

## B. New Data Points & Overlay Signals

**Data points added (4):**
- `overall-us-displacement`: Yale Budget Lab value: 0 (Tier 1 — no measurable displacement)
- `high-skill-wage-premium`: IMF 3% new-skill premium (Tier 2)
- `high-skill-wage-premium`: Oxford OII 23% AI skills wage premium (Tier 1, isProxy: true — UK data)
- `creative-industry-displacement`: CVL Economics 21.4% entertainment displacement (Tier 2)

**Overlays added (13):**
- `overall-us-displacement`: Yale CPS stability signal, PwC 38% job growth in exposed occupations, Mokyr historical pattern
- `workforce-ai-exposure`: Yale CPS exposure quintile stability
- `customer-service-automation`: Gartner 20% actual staffing cuts, 80% expect cuts, 80% role transitions, ILO clerical exposure
- `white-collar-professional-displacement`: ILO cognitive role exposure
- `tech-sector-displacement`: IMF IT skill demand ≠ specialist demand
- `entry-level-wage-impact`: IMF youth employment, PwC degree decline
- `education-sector-displacement`: PwC 55% skill churn

---

## C. Prediction Graph Structural Changes

### Observed vs. Projected Data Split (major)
- All 19 prediction files now tagged with `dataType: "observed"` or `"projected"` on every history entry
- Prediction detail pages now render two separate charts: "What has happened" (observed employment data with trend line) and "What researchers project" (projections with target-date reference line)
- Hero stat adds inline note showing observed displacement (~0%) alongside projection range and median
- PredictionChart gains `targetDate` prop for reference line at projection target year
- **Commits:** `7573d1e9`, `29c5c265`, `592755ec`

### Data Integrity Fixes
- Standardized sign convention: all displacement values now positive in overall and financial-services files (6 entries fixed)
- `workforce-exposure` switched to `aggregationMethod: "latest"` — the 23–93% range reflects incompatible definitions, not measurement uncertainty
- BLS employment-decline data point moved from customer-service `history[]` to `overlays[]` (unit mismatch: employment % vs interaction automation %)
- 4 tech-sector job-posting data points tagged `isProxy: true` (postings overstate displacement ~2-3x)
- Education sector evidence tier downgrades: Chegg earnings T1→T2, Pearson 10-K T1→T2, Chegg layoffs T1→T2, Duolingo blog T1→T3
- 14 prediction files received explicit `aggregationMethod: "weighted"` (were relying on implicit defaults)
- Trailing comma fix in overall.json
- Orphan `usedIn` references cleared for metr-becker and brookings-mapping
- 8 unused sources with empty `usedIn[]` removed from confirmed-sources.json (466→458)
- `total-jobs-lost.json` archived to `_archived/` (overlaps with overall-us-displacement)
- `workforce-exposure` category fixed: "adoption" → "exposure"
- **Commits:** `af333e7f`, `592755ec`, `a02cf985`

### Occupation Exposure Scoring Fixes
- Fixed double-scaling bug in `netRisk` normalization — `*10` multiplier was scaling to 0-100 instead of 0-10, saturating most occupations at max risk
- Fixed netRisk formula to normalize pressure and absorption independently — absorption was on a smaller scale and could never counterbalance high exposure
- Color gradient stops realigned to actual score distribution (72% of occupations score below 5.0)
- Three iterations of color mapping fixes: linear mapping for netRisk, sharp 3-stop gradient, final distribution-aligned stops
- Computer-math adaptability (0.734→0.800) and demand elasticity (5→8) scores updated
- **Commits:** `f11b7e63`, `9390d842`, `0090e891`, `b6ee2ee8`, `69889a75`, `c3fcaec8`, `0b661fd4`

---

## D. Site Pages & Features

### NEW PAGE: /occupation-exposure — Multi-Dimensional Displacement Risk (major)
Entirely new page launched this week. Visualizes occupation-level displacement risk across 342 BLS occupations using a 5-dimensional research-backed framework:
1. **Technical exposure** (Yale/Eloundou) — how much of the job can AI do?
2. **Institutional adoption speed** (OECD/McKinsey) — how fast is the industry adopting?
3. **Worker adaptability** (Manning & Aguirre NBER) — how transferable are the skills?
4. **Demand elasticity** (Bessen/Jevons) — does automation expand demand?
5. **AI complementarity** (Baslandze CFO survey) — does AI help workers or replace them?

Features: canvas-rendered Karpathy-style treemap sized by employment, dimension toggle pills, click-to-expand occupation detail cards with full 5-dimension score breakdown (BLS outlook, pay, education, exposure rationale), exposure vs. net-risk comparison table, expandable methodology with full source citations. Iterated through multiple rounds: SVG treemap → canvas treemap, category grouping, color gradient calibration, netRisk formula fixes.
- **Commits:** `99257b67` (page creation, 1,474 lines), `22abc63a` (Karpathy treemap rebuild), `6f774a9a`, `c58ae32f`, `b3eb505b`, many more

### NEW PAGE SECTION: Interactive Elasticity Toggle on /demand-elasticity
New interactive visualization showing how demand elasticity works across industries — toggle between "AI automates tasks" and "AI expands demand" to see how the Jevons Paradox plays out sector by sector. 6+ industries covered.
- **Commits:** `f457b7ab`, `eb13ec9f`

### NEW: AI-Driven New Business Formation Prediction Tile
New prediction tile tracking AI-driven entrepreneurship and business formation. Accompanied by a full literature review document covering Marchesi/Tang and 7+ academic sources plus Carta data.
- **Commits:** `1f43b023`, `e51cff8a`, `96a00a1f`, `1afba72a`

### History Page Enriched
Specific stories, data, and strong sources added to the technology history page. More grounded in primary research.
- **Commit:** `7813eac9`

### Social Sharing Links
Added to all explainer pages.
- **Commit:** `e47c3f66`

### Front Page Reorganized
Section order and titles updated.
- **Commit:** `01543a96`

### About Page Rewritten
Revised copy with updated methodology and credibility signals.
- **Commit:** `8ce48db9`

### Labor Economist Review of Task Visualizer
Full economist review conducted with recommendations implemented: tooltip fixes, column key additions, income strata table fixes, economic exposure display improvements.
- **Commits:** `90103d3d`, `71726dda`, `2cc86cce`, multiple table fix commits

### Task Visualizer — 47 New Occupation Profiles (67→114)
Massive expansion of the task visualizer reaching ~67% of US nonfarm employment coverage. New profiles span:
- High-employment roles: fast food worker (3.6M), admin assistant (2.0M), personal care aide (1.8M), office clerk (2.7M), assembler (1.5M), stocker/order filler (2.0M)
- Protective services: police officer, firefighter, EMT/paramedic
- Food & hospitality: cook, bartender, dining attendant, dishwasher
- Healthcare: LPN, pharmacy technician, genetic counselor, veterinary technician
- Trades: carpenter, welder, industrial machinery mechanic, forklift operator
- Education: teaching assistant, preschool teacher, childcare worker
- Other: bank teller, hairdresser, bus driver, landscaping worker, maid/housekeeper, billing clerk, shipping/receiving clerk, computer systems analyst
- Category consolidations: "Retail & Sales"/"Retail & Warehousing" → "Retail", "Food & Beverage"/"Food Service" → "Food & Hospitality", "Financial Services"/"Finance & Insurance" → "Business & Finance", "Healthcare Support" → merged into "Healthcare"
- Front page updated from 100+ → 110+ occupations
- **Commits:** `4c8487ea`, `e340681c`, `12c6474c`, `86a055f6`, `eae9aca6`, `121ecac3`, `7440d1e6`, `f04515da`, `8199704c`, `eadb21d2`, `c3fbf995`

### Five Variables Essay — New Long-Form Content
New Paul Graham-style essay "The Wrong Question About AI and Jobs" on `/occupation-exposure`. Walks through the 5 variables that determine job automation risk through flowing prose rather than a numbered-list format. ATM example with inverted-U caveat, within-firm adoption heterogeneity (Copilot stat), new task creation as the essay's landing (60% of today's jobs didn't exist in 1940). Links to 8 internal pages and 3 external research papers. Reviewed by economist review workflow with corrections (ATM timeline, macro displacement caveat). Em dashes removed for PG style clarity.
- **Commits:** `65f66abc`, `06105f48`, `ec8c1a78`, `b9c41b8c`, multiple refinement commits

### Hero Stat Animation Fixes
- Fixed count-up animation that jumped directly to final value — added 800ms ease-out cubic count-up from 0 on mount
- Fixed hydration flash where SSR rendered final value then reset to 0 on client mount
- Fixed wobble bounds calculation where low/high were identical
- **Commits:** `722cbe92`, `9f1c73d1`

### Funnel Chart Updates
- Yale Budget Lab entry updated to March 2026 CPS data
- Measured job loss color changed from red to emerald green (0% is a positive outcome, red was misleading)
- Heading updated to "AI exposure does not equal job loss"
- **Commits:** `1abebc09`, `a8cdf5d6`, `9e640423`

### Web Delights — Added Then Pruned
12 "delight" features were added (Easter eggs, microinteractions, physics demos) and then reviewed. 6 were removed as not fitting the research-first tone: 404 mini-game, disagreement shake, shuffle sources, doomer/acc Konami mode, treemap earthquake, milestone labels on scroll progress. Retained: 3D tilt on prediction cards, reading progress bar (gradient-only), count-up animations, confetti Konami code.
- **Commits:** `a5f5840f`, `a4dcbc78`, `2307c8c8`, `7f48e3ae`

### Navigation
- Learn menu reordered: "All Sources" and "Reading List" moved after "Suggest Source"
- **Commit:** `f13ad262`

---

## E. Data Pipeline & Scripts

### Claude Agent SDK Setup
- Reusable agent module and example scripts set up for programmatic research workflows
- CJS compatibility fixes (top-level await, dirname resolution)
- **Commits:** `2d68e366`, `4c10b8a0`

### Autoresearch Pipeline
- Research session run on 2026-03-21 — candidates.tsv updated with new entries
- Two sources ingested through the autoresearch workflow: CVL Economics entertainment study and Oxford OII AI skills premium
- **Commits:** `ae62946f`, `10fca6a8`, `6c0cb190`, `bcc23e2a`

### Site Improvement Sweep
- Full sweep report generated for 2026-03-21: 45 findings across data integrity, visualization, UX, code health, and content freshness (7 fix-now, 12 fix-this-week, 13 ingestion candidates, 8 next-sprint, 5 backlog)
- **Commit:** `cd3b9681`

### Code Cleanup
- Deleted duplicate scripts: `cleanup-stale-branches.sh`, `sync-and-clean.js`
- Added global `error.tsx` and `loading.tsx` error boundaries
- Extracted hardcoded source count to `SOURCE_COUNT_DISPLAY` constant
- Added try/catch error handling to 4 API routes
- **Commit:** `592755ec`

---

## F. Configuration & Infrastructure

- New file: `src/lib/constants.ts` — centralizes display constants like source count
- **Commit:** `592755ec`

---

## Raw Commit List (99 commits)

| SHA | Date | Message |
|-----|------|---------|
| `6d66f5f1` | 2026-03-22 | Refine text in FiveVariablesEssay component |
| `6d724c2c` | 2026-03-22 | Update AI job question for better clarity |
| `73811fa9` | 2026-03-22 | Refine text for clarity in FiveVariablesEssay component |
| `0fafe376` | 2026-03-22 | Fix spacing around 'and' in FiveVariablesEssay.tsx |
| `ae4a692f` | 2026-03-22 | Update link text in FiveVariablesEssay component |
| `9190509d` | 2026-03-22 | Update links in FiveVariablesEssay component |
| `944e048f` | 2026-03-22 | Refine wording for clarity in FiveVariablesEssay |
| `2b288552` | 2026-03-22 | Merge PR #425: Merge Financial Services and Finance & Insurance |
| `608b9314` | 2026-03-22 | Refine language in FiveVariablesEssay |
| `5aace242` | 2026-03-22 | Merge PR #424 |
| `be53ca43` | 2026-03-22 | Increase scroll-mt on mobile for essay anchor |
| `0e8ac8b9` | 2026-03-22 | Remove all em dashes from essay prose |
| `9b4c8d58` | 2026-03-22 | Add scroll-margin-top to essay anchor |
| `7e5a94c2` | 2026-03-22 | Merge PR #423 |
| `74533f21` | 2026-03-22 | Add anchor id to essay for direct linking |
| `5d5a5514` | 2026-03-22 | Merge PR #422 |
| `b9c41b8c` | 2026-03-22 | Rewrite Five Variables essay in PG style |
| `06105f48` | 2026-03-22 | Refine Five Variables essay with economist review |
| `ec8c1a78` | 2026-03-22 | Add anchor link and internal callouts to essay |
| `65f66abc` | 2026-03-22 | Add Five Variables essay and collapse divergence table |
| `c3fbf995` | 2026-03-22 | Merge Financial Services and Finance & Insurance into Business & Finance |
| `b19777ce` | 2026-03-21 | Merge PR #421: Fix tech-sector y-axis |
| `80300e12` | 2026-03-21 | Merge PR #420: Fix sweep items |
| `a2d973a6` | 2026-03-21 | Fix tech-sector-displacement chart y-axis to -25% to 25% |
| `a02cf985` | 2026-03-21 | Fix sweep items: sort overlays, remove unused sources, archive total-jobs-lost |
| `8c4fc1c1` | 2026-03-21 | Merge PR #419: Split prediction charts |
| `f459ffba` | 2026-03-21 | Merge PR #418 |
| `29c5c265` | 2026-03-21 | Split prediction charts into observed vs projected |
| `10fca6a8` | 2026-03-21 | autoresearch: log review candidates |
| `ae62946f` | 2026-03-21 | autoresearch: update candidates.tsv |
| `6c0cb190` | 2026-03-21 | autoresearch: ingest CVL Economics entertainment AI study |
| `bcc23e2a` | 2026-03-21 | autoresearch: ingest Oxford OII AI skills premium |
| `ff842558` | 2026-03-21 | Merge PR #417: Remove unused delight features |
| `2307c8c8` | 2026-03-21 | Remove unused delight features |
| `c35847b4` | 2026-03-21 | Merge PR #416 |
| `7f48e3ae` | 2026-03-21 | Remove J-Curve Ball Drop |
| `b4b8981e` | 2026-03-21 | Integrate Treemap Earthquake (later removed) |
| `9d9efafc` | 2026-03-21 | Merge PR #415: Add 12 web delights |
| `a4dcbc78` | 2026-03-21 | Add 12 web delights |
| `2b83ba75` | 2026-03-21 | Merge PR #414: Ingest 4 sources |
| `1f3aafba` | 2026-03-21 | Ingest 11 stats from 4 sources |
| `b43d8461` | 2026-03-21 | Merge PR #413: Add animations |
| `a5f5840f` | 2026-03-21 | Add fun animations and interactivity |
| `dbc1f07e` | 2026-03-21 | Merge PR #412 |
| `8199704c` | 2026-03-21 | Merge Healthcare Support into Healthcare |
| `860426886` | 2026-03-21 | Merge PR #411 |
| `eadb21d2` | 2026-03-21 | Consolidate duplicate category names |
| `974df064` | 2026-03-21 | Merge PR #410 |
| `f13ad268` | 2026-03-21 | Reorder Learn menu |
| `dc25565` | 2026-03-21 | Merge PR #408 |
| `592755ec` | 2026-03-21 | Fix visualization integrity, code health, data consistency |
| `0f747e28` | 2026-03-21 | Merge PR #409 |
| `7440d1e6` | 2026-03-21 | Add 13 occupations to reach 67% coverage |
| `2b50f6e1` | 2026-03-21 | Merge PR #407 |
| `7573d1e9` | 2026-03-21 | Separate observed data and projections on chart |
| `eca349c6` | 2026-03-21 | Merge PR #406 |
| `af333e7f` | 2026-03-21 | Fix 6 data integrity and resilience issues |
| `cd3b9681` | 2026-03-21 | Add site improvement sweep report |
| `0690d8ac` | 2026-03-21 | Merge PR #405 |
| `f04515da` | 2026-03-21 | Add Chief of Staff to task visualizer |
| `980d0a7d` | 2026-03-20 | Merge PR #404 |
| `c3fcaec8` | 2026-03-20 | Align netRisk color gradient to score distribution |
| `3704eba9` | 2026-03-20 | Merge PR #403 |
| `69889a75` | 2026-03-20 | Use sharp 3-stop gradient for netRisk colors |
| `3983db7f` | 2026-03-20 | Merge PR #402 |
| `366b50a8` | 2026-03-20 | Merge PR #401 |
| `9e640423` | 2026-03-20 | Update funnel chart heading |
| `0090e891` | 2026-03-20 | Make netRisk scores below 5 green |
| `f8af49a7` | 2026-03-20 | Merge PR #400 |
| `b6ee2ee8` | 2026-03-20 | Skip contrast boost for netRisk |
| `8b9bb288` | 2026-03-20 | Merge PR #399 |
| `86a055f6` | 2026-03-20 | Add veterinary technician (100th occupation) |
| `368c1349` | 2026-03-20 | Merge PR #398 |
| `f11b7e63` | 2026-03-20 | Fix double-scaling bug in netRisk normalization |
| `34ab34d7` | 2026-03-20 | Merge PR #397 |
| `9f1c73d1` | 2026-03-20 | Fix hero stat count-up flash and wobble bounds |
| `8b1879f5` | 2026-03-20 | Merge PR #396 |
| `9390d842` | 2026-03-20 | Fix netRisk formula to normalize independently |
| `a38eb401` | 2026-03-20 | Merge PR #395 |
| `12c6474c` | 2026-03-20 | Add 3 occupations, employment coverage stat |
| `009c7276` | 2026-03-20 | Merge PR #394 |
| `5981e494` | 2026-03-20 | Merge PR #393 |
| `cb1c73c7` | 2026-03-20 | Merge PR #392 |
| `eae9aca6` | 2026-03-20 | Add 10 occupation profiles |
| `a8cdf5d6` | 2026-03-20 | Change funnel chart measured loss color to green |
| `722cbe92` | 2026-03-20 | Fix hero stat count-up animation |
| `46aa82cb` | 2026-03-20 | Ingest Mokyr et al. (2015) JEP paper |
| `119d192b` | 2026-03-20 | Merge PR #391 |
| `121ecac3` | 2026-03-20 | Add genetic counselor profile |
| `4e023035` | 2026-03-20 | Merge PR #390 |
| `e340681c` | 2026-03-20 | Add 10 high-employment occupation profiles |
| `9a08fbd1` | 2026-03-20 | Merge PR #388 |
| `959f123c` | 2026-03-20 | Merge PR #389 |
| `4c8487ea` | 2026-03-20 | Add 5 high-coverage occupation profiles |
| `0b661fd4` | 2026-03-20 | Increase computer-math adaptability and elasticity scores |
| `846d3bf1` | 2026-03-20 | Merge PR #387 |
| `1abebc09` | 2026-03-20 | Update funnel chart Yale Budget Lab entry |
| `89e67c3a` | 2026-03-20 | Merge PR #386 |
| `12942c1f` | 2026-03-20 | Ingest Yale Budget Lab Jan/Feb 2026 CPS update |
| `4a65711b` | 2026-03-20 | Merge PR #385: Add Bloomberg Victorian fiction article |

---

## LinkedIn Post Draft

See `changelog/2026-03-22-linkedin-post.txt`
