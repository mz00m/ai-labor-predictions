# Top 5 Visualization Fixes — Review & Approve

Each fix is independent. Approve, modify, or reject individually.

---

## Fix 1: Remove Geographic Contamination from AI Adoption Rate

**Problem:** `ai-adoption-rate` chart is titled "AI Adoption Rate Across US Companies" with unit "% of firms (Census BTOS)", but history includes:
- ECB SAFE (66%) — European firms, wrong geography entirely
- bizjournals (71%) — T3 journalism aggregation
- Bick-Blandin-Deming (37.4%) — measures "any AI use at work," far broader than BTOS production deployment

These inflate the weighted average and create a misleading trend arrow (Census BTOS is 3.8%→17.5%, but the chart implies a surge to 71%).

**Proposed changes:**
1. Move ECB SAFE (66%) and bizjournals (71%) entries from `history[]` to `overlays[]` — they're directional signals, not the same metric
2. Move Bick-Blandin-Deming (37.4%) to overlay with label "Bick-Blandin-Deming: 37% of workers report any AI use (broader than BTOS)"
3. Move Hartley (36%) to overlay similarly
4. Keep Census BTOS entries (3.8, 5.4, 6.6, 10.2, 17.3, 17.5) as the clean history track
5. Update `currentValue` to reflect BTOS-only weighted average (~17.5%)
6. Add research note: "History tracks Census BTOS production use. Broader surveys (see overlays) show 35-70% for any AI use."

**Files changed:** `src/data/predictions/adoption/ai-adoption-rate.json`

**Trade-off:** Loses the "broader adoption story" from the main trend line, but gains honesty. The overlays still show the broader numbers.

---

## Fix 2: Fix High-Skill Premium Unit Mismatch + Earnings Call Duplicate

**Problem A:** `high-skill-wage-premium` has a Dallas Fed entry (2026-02-24, value=9.2) that measures wage *growth differential* (9.2pp faster wage growth in computer systems design), not a wage premium over median. Other entries measure 15–35% premiums. This is a different metric on the same axis.

**Problem B:** `earnings-call-ai-mentions` has two entries referencing the same sourceId `factset-earnings-q3-2025` with different values (58% on 2025-07-15 and 61% on 2025-12-01). One is wrong.

**Proposed changes:**
1. Move Dallas Fed 9.2 entry from `history[]` to `overlays[]` with label "Dallas Fed: AI-sector wage growth 9.2pp above national average" and direction "up"
2. For earnings-call duplicate: update the 2025-12-01 entry's sourceId to reflect Q4 2025 data (likely should be `factset-earnings-q4-2025`), or remove if it's truly a duplicate

**Files changed:** `src/data/predictions/wages/high-skill-premium.json`, `src/data/predictions/signals/earnings-call-mentions.json`

**Trade-off:** Minimal. These are clear data errors, not judgment calls.

---

## Fix 3: Add "Measurement Scope" Disclaimers to the 4 Worst Definitional Drift Charts

**Problem:** Four charts aggregate sources that measure fundamentally different things. The weighted average is not statistically valid when inputs measure different quantities.

| Chart | What sources actually measure |
|-------|-------------------------------|
| `workforce-ai-exposure` | Job-level (80%), task-level (23%), occupational-level (93%), "some degree" (25%) |
| `customer-service-automation` | Interaction automation (66%), job displacement (5%), headcount cuts (44%) |
| `education-sector-displacement` | Ed-tech revenue (Chegg), publisher layoffs (Pearson), sector projections (OECD) |
| `total-us-jobs-lost` | Observed 0% (Yale), projected 7% (Goldman) — fundamentally different claims |

**Proposed changes:**
1. Add a `researchNote` field to each prediction JSON (if not already present) with a clear disclaimer
2. Display the research note prominently on the detail page, above the chart
3. Proposed text for each:
   - **workforce-exposure:** "Sources use different definitions of 'exposure' — from tasks within a job to entire occupations. The range (23%–93%) reflects definitional differences, not measurement uncertainty."
   - **customer-service:** "This chart tracks interaction automation rates, not job elimination. A high automation rate may reduce headcount but does not imply equivalent job loss."
   - **education-sector:** "Direct AI displacement estimates for education are sparse. History includes ed-tech platform declines and publisher layoffs, which are proxies for broader sector impact."
   - **total-jobs-lost:** "Observed employment data (Yale, Goldman, Dallas Fed) shows near-zero net AI displacement as of 2026. Projections range from 0.75% to 7%. The gap between observed and projected is the key finding."
4. Add these as a `disclaimer` string in each JSON, rendered in `PredictionDetailClient.tsx` above the chart in a muted callout box

**Files changed:** 4 prediction JSONs, `src/lib/types.ts` (add `disclaimer?` field), `PredictionDetailClient.tsx` (render disclaimer)

**Trade-off:** Adds visual complexity to detail pages, but directly addresses the site's biggest credibility risk. A sophisticated reader who notices the definitional mixing without explanation will lose trust.

---

## Fix 4: Redesign Trend Arrows to Prevent the YoY Illusion

**Problem:** The ▲/▼ trend indicators on tiles compare the first and last data points chronologically. When a new source is ingested at a different value, the trend arrow changes — but nothing in the real world changed. Examples:
- AI Adoption: Arrow shows massive uptrend because ECB SAFE (66%) was added after Census BTOS (17.5%)
- Workforce Exposure: Arrow shifts whenever any new estimate is added

Readers interpret ▲/▼ as "things got better/worse," but it actually means "our estimate collection changed."

**Proposed changes:**
1. Change trend computation in `prediction-stats.ts` to one of these approaches:

   **Option A (recommended):** Only compute trend from same-source longitudinal data. If a source has multiple entries over time (e.g., Census BTOS quarterly), use those for the trend. If no longitudinal data exists, show no trend arrow.

   **Option B:** Compare weighted averages at two time windows (e.g., sources published before vs. after a cutoff date) and label as "Estimate shift" instead of using ▲/▼.

   **Option C:** Remove trend arrows entirely from projection-only charts. Only show them on charts with observed longitudinal data (earnings-call-mentions, ai-adoption-rate BTOS track, freelancer-rate-impact platform data).

2. Update `PredictionCard.tsx` and `PredictionDetailClient.tsx` to render the new trend logic
3. If Option A: add a `longitudinalSourceId` field to prediction JSON to identify which source provides the trend baseline

**Files changed:** `src/lib/prediction-stats.ts`, `PredictionCard.tsx`, `PredictionDetailClient.tsx`, possibly prediction JSONs

**Trade-off:** Option A is the most honest but requires identifying longitudinal sources for each chart. Option C is simplest but removes a visual element readers may find useful. Option B is a middle ground but "Estimate shift" may confuse readers who expect directional signals.

---

## Fix 5: Surface Source Range on Homepage Tiles

**Problem:** Each homepage tile shows a single weighted average number (e.g., "3%", "46.2%", "25.8%"). When the source range is wide, this creates false precision. Workforce exposure shows "46.2%" but sources range 23%–93%. A reader assumes 46.2% is a well-established finding.

The detail page already shows the range — but most readers only see the homepage.

**Proposed changes:**
1. On `PredictionCard.tsx`, when `(max - min) > 2 * |mean|` or `max > 3 * min`, show the range below the main value:
   ```
   46.2%
   range: 23–93%
   ```
2. Use smaller, muted text for the range so it doesn't overwhelm the card
3. For charts with tight ranges (freelancer-rate-impact, median-wage-impact), no range is shown — the single number is sufficient
4. Threshold: show range when `(max - min) / |mean| > 0.5` (spread is more than half the mean)

**Files changed:** `src/components/PredictionCard.tsx`, `src/lib/prediction-stats.ts` (expose min/max from `computeAggregate`)

**Trade-off:** Cards become slightly busier. But a tile showing "46.2%" without context is more damaging to credibility than a slightly busier card showing "46.2% (range: 23–93%)". The range IS the story for several of these charts.
