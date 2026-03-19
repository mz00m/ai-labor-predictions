# Site-Wide Visualization Review

2026-03-19 | 16 charts reviewed

---

## TOP PRIORITIES

### 1. Earnings Call Mentions: currentValue Drift (Data Integrity — High)

`earnings-call-ai-mentions` displays `currentValue: 41.2` but the latest history entry (Q4 2025) is **68%**. Since this chart uses weighted aggregation (not `"latest"`), the displayed number blends all quarters back to Q1 2023. For a time-series metric tracking quarterly prevalence, a weighted average of historical quarters is misleading — readers see "41.2% of S&P 500 mention AI in earnings calls" when the actual current figure is 68%.

**Recommendation:** Switch `aggregationMethod` to `"latest"` (like `ai-adoption-rate`), or add a "Latest quarter" callout alongside the weighted average. The weighted average tells the wrong story for a metric that has a clear directional trend and where the latest measurement is what matters.

### 2. Workforce AI Exposure: Definitional Incoherence (Data Integrity — High)

The exposure chart aggregates sources measuring fundamentally different things:
- **Goldman (25%)**: Jobs at risk of automation (narrow, task-based)
- **Eloundou/OpenAI (80%)**: Jobs with *any* task overlap with LLMs (extremely broad)
- **Cognizant (93%)**: Jobs that will be "reshaped" (broadest possible definition)

The 23–93% range doesn't reflect measurement uncertainty — it reflects **definitional disagreement**. The weighted average (44.1%) is not a valid aggregate of these numbers because they're answering different questions. The existing disclaimer is excellent and explicitly says this, but the large `44.1%` headline number on the tile still dominates reader attention.

**Recommendation:** Consider displaying the range (23–93%) as the primary visual, with the weighted average secondary. Or group sources by definition type (task overlap vs. job-level risk vs. reshaping) and show mini-distributions. The current disclaimer does the right work in prose but the visual hierarchy still leads with false precision.

### 3. Overall US Displacement: Mixed Signal Types Need Stronger Visual Separation (Visualization — High)

This is the site's most important chart. It mixes:
- **Observed data** (Dallas Fed 0.1%, Yale 0%, NBER 0.6%) clustered near zero
- **Projections** ranging from -11.5% to 12%
- **Proxy metrics** (job postings decline, EPOP ratio) with conversion factors

The solid vs. dashed line distinction exists but the headline weighted average (currently ~3%) blends all three signal types together. A reader seeing "~3% projected job loss" doesn't know that observed measurements cluster near 0% while projections drive the average up.

**Recommendation:** The hero stat already handles this well by showing projected vs. measured separately. On the detail page, consider splitting the chart into two visual zones or adding a prominent "Observed vs. Projected" toggle that shows how different the picture looks depending on signal type. The current framing is honest but could be more visually explicit.

### 4. YoY Trend Indicators: The Illusion Problem (Framing — High)

Trend arrows on prediction cards compare the first vs. last data point chronologically. This means:
- Adding a new high-value source → trend goes "up"
- Adding a new low-value source → trend goes "down"
- Neither reflects real-world change

For `ai-adoption-rate` (which uses `"latest"` aggregation and tracks a single time-series), the trend arrow is meaningful. For weighted-average charts like `overall-us-displacement`, the trend arrow reflects **source accretion**, not labor market dynamics.

**Recommendation:** Either (a) suppress trend arrows on weighted-average charts, (b) change the label from "Trending" to "Estimate drift" or "Avg shifted", or (c) compute trend only from observed data points where available. The current implementation is technically correct but functionally misleading for the most important charts.

### 5. Education Sector: Insufficient Evidence Displayed as Confident Estimate (Data Integrity — High)

`education-sector-displacement` shows `currentValue: 12.2` from only 4 data points. Two are corporate proxies (Chegg stock crash, Pearson restructuring). BLS projects only 3% displacement. The disclaimer says "Insufficient evidence for confident projection" — correct — but the tile still displays 12.2% as a large bold number alongside charts with 20+ data points.

**Recommendation:** Visually distinguish low-confidence charts. Options: (a) show the source count more prominently on tiles with <6 sources, (b) use a muted/reduced visual treatment for low-evidence predictions, (c) add a confidence indicator (e.g., "Low confidence" badge) directly on the tile. The disclaimer on the detail page is good; the tile-level representation isn't cautious enough.

---

## DATA INTEGRITY ISSUES

### D1. Customer Service Automation: Apples-to-Oranges Sources

History entries mix:
- **Klarna (66%)**: Single company's AI chatbot handling rate
- **BLS (5%)**: Economy-wide employment projection for CS workers
- **Salesforce (50%)**: Platform vendor projection for their customers
- **Gartner (25%)**: Cross-industry survey estimate

These are measuring different things at different scales (single firm vs. economy-wide, interactions automated vs. jobs displaced). The weighted average (34.7%) blends company self-reports with economy-wide estimates.

**Priority: Medium.** The description clarifies "interactions automated, not job elimination" but the source heterogeneity within the "interactions automated" frame is still large. Consider splitting corporate case studies from industry-wide projections.

### D2. Financial Services: Mixed Polarity Without Explanation

History values range from -3 to +14. Negative values appear to represent employment *growth* in some scenarios, while positive values represent displacement. The weighted average (3.3%) masks genuine directional disagreement.

**Priority: Medium.** Add a note explaining what negative values mean in this context, or separate growth-scenario sources from displacement-scenario sources.

### D3. Healthcare Admin: Wide Range from Thin Evidence

Only 4 data points spanning 4.7% to 30%. The 30% outlier (from a single survey) pulls the weighted average significantly. With only 4 sources, the weighted average is highly sensitive to any single addition or removal.

**Priority: Medium.** Same treatment as education — flag as low-confidence. The Trinity Health case study (10.5% RCM staff reduction) adds valuable real-world signal but is a single-firm observation.

### D4. Freelancer Rate Impact: Monoculture Evidence

All 7 history entries are Tier 1 — but this actually signals a gap. No Tier 2 (industry analysis) or Tier 3 (journalism) sources provide cross-validation. The -5% to -32% range is entirely from research papers and platform data.

**Priority: Low.** The evidence is high-quality but narrow. Not urgent, but worth noting that the "all T1" distribution doesn't mean the estimate is robust — it means it hasn't been validated from other angles.

### D5. Hero Stat: "Weighted avg of N estimates" Count

The hero dynamically computes `projectedEstimateCount` from `overallDisplacement.history.length`. Currently at 20 data points. The label "Weighted avg of 20 estimates" is accurate but the word "estimates" is imprecise — some are observed measurements, some are projections, some are proxy conversions.

**Priority: Low.** Consider "Weighted avg of 20 data points" or "20 sources" instead of "20 estimates."

### D6. Hero Stat: Projected Job Loss Range

The `HeroStatWobble` component hardcodes the confidence range as `low={1} high={7}` for projected job loss. But the actual data range in `overall-us-displacement` spans -11.5% to 12%. The wobble range is much narrower than the true source spread.

**Priority: Medium.** Either widen the wobble range to reflect the actual source spread, or document why the 1–7% range was chosen (perhaps excluding outliers). The current range excludes both the NBER -11.5% and the World Bank 12%.

---

## VISUALIZATION DESIGN ISSUES

### V1. Point-Estimate Trap on Prediction Tiles

All 16 tiles display a single large number (the weighted average) as the dominant visual element. The "Range: min–max" text only appears when `spread / meanAbs > 0.5` (the "significant disagreement" threshold). This means:
- `workforce-ai-exposure` (23–93%): Shows disagreement warning
- `overall-us-displacement` (-11.5 to 12): Shows disagreement warning
- `ai-adoption-rate` (3.8–17.5): Shows disagreement warning
- `entry-level-wage-impact` (-12 to -3): May not trigger if mean is ~-8.9 (spread 9, meanAbs 8.9, ratio 1.01 — triggers)

The threshold is somewhat arbitrary but directionally correct. Charts where it *doesn't* trigger may still have meaningful disagreement that readers should see.

**Priority: Medium.** Consider always showing the range on tiles with >5 sources, not just when the disagreement threshold triggers. The range is informative signal, not just a warning.

### V2. Confidence Band Rendering Gaps

Confidence bands use a stacked Area trick (`confidenceBandBase` + `confidenceBandWidth`). If any history entry lacks `confidenceLow`/`confidenceHigh`, that point has no band — creating visual gaps that could be misread as "no uncertainty at this point."

**Priority: Low.** Most entries have confidence ranges. For the few that don't (e.g., `tech-sector-displacement` entry at value 2.5 with no range), consider interpolating from neighbors or showing a default uncertainty band.

### V3. Overlay Density on Mature Charts

`overall-us-displacement` has 40+ overlays. `tech-sector-displacement` has 44. At this density, the vertical colored bars (overlay reference lines) can create visual noise that competes with the actual data line.

**Priority: Low.** The grouping-by-date logic helps, but consider making overlays opt-in (collapsed by default) on charts with >20 overlays, or providing a density toggle.

### V4. Date Deduplication Labels

When multiple data points fall in the same month, the chart generates labels like "Mar 2024 (15)" with day suffixes. On small screens or tiles, this creates visual clutter.

**Priority: Low.** Acceptable trade-off for data density, but could use shorter format on mobile (e.g., "Mar '24a", "Mar '24b").

### V5. Trend Line on Weighted-Average Charts

The linear regression trend line is drawn on "observed data only" — good. But for charts where all data is projected (e.g., `creative-industry-displacement`), a trend line through projections implies a trajectory that doesn't exist in the real world.

**Priority: Medium.** Suppress trend lines on charts with zero observed data points. A trend through projections from different sources doesn't represent a real-world trajectory.

---

## FRAMING & LANGUAGE ISSUES

### F1. "Displacement" vs. "Employment Change" Label Inconsistency

`white-collar-professional-displacement` is titled "Employment in High-AI-Exposure Occupations" with unit "% employment change" — all values are negative (employment *decline*). But it's categorized under "displacement" and the slug says "displacement." Other displacement charts measure projected job loss (positive values = more displacement). This creates a polarity confusion: on some charts, bigger numbers = worse; on others, more negative = worse.

**Priority: Medium.** The detail page context maps handle this well in prose, but the tile grid juxtaposes -3% (white-collar, meaning 3% employment decline) with 23.5% (creative, meaning 23.5% of roles displaced). Different scales, different directions, same visual treatment.

### F2. "Measured Job Loss" Framing

The hero stat shows "~0% Measured job loss" with subtitle "Yale, NBER, Dallas Fed, ECB." This is the site's most important honest framing — correctly distinguishing observed from projected. But the latest observed data point in `overall-us-displacement` is `0.1%` (Dallas Fed) and `-0.9%` (Dallas Fed young workers, proxy). The hero rounds to 0 via `Math.round(Math.abs(observed.value))`.

The `-0.9%` young workers finding (employment share decline in AI-exposed occupations) is arguably the most significant observed signal in the dataset, but it gets rounded away in the hero. The `Math.abs()` call also discards sign information.

**Priority: Medium.** Consider showing "~0–1%" or keeping the wobble Easter egg (which shows -0.5 to 0.5 range). The current rounding is defensible but loses the most interesting observed signal.

### F3. Sector Displacement Reconciliation

The homepage grid shows `overall-us-displacement` at ~3% alongside `creative-industry-displacement` at 23.5%, `education-sector-displacement` at 12.2%, and `healthcare-admin-displacement` at 14.5%. A sophisticated reader will ask: how can overall displacement be 3% when multiple sectors show 12–24%?

The answer (sector-specific studies measure different things at different scales; overall includes job creation offsets; sector estimates are often exposure-based) is available in detail page context but not visible in the tile grid view.

**Priority: Medium.** Consider adding a brief reconciliation note visible at the grid level, or grouping sector predictions under the overall prediction with an explicit "these measure different things" framing.

### F4. Time Horizon Inconsistency

Most charts say "By 2030" but `customer-service-automation` says "By 2028" and `freelancer-rate-impact` says "By 2028". Adoption charts say "Current measure." This is factually correct but the grid doesn't surface these differences prominently — a reader comparing 2028 and 2030 predictions side-by-side may not notice they have different horizons.

**Priority: Low.** The time horizon is shown on each tile but in small text. Acceptable as-is.

---

## PER-CHART ASSESSMENTS

### Charts with Significant Issues

| Chart | Severity | Primary Issue |
|-------|----------|---------------|
| `earnings-call-ai-mentions` | High | currentValue (41.2%) wildly diverges from latest data (68%) |
| `workforce-ai-exposure` | High | Definitional incoherence across sources; 23–93% range |
| `education-sector-displacement` | High | 4 data points displayed with same confidence as 20-source charts |
| `overall-us-displacement` | Medium | Excellent data, but visual separation of observed vs. projected needs work |
| `customer-service-automation` | Medium | Corporate case studies mixed with economy-wide data |
| `financial-services-displacement` | Medium | Mixed polarity without explanation |
| `healthcare-admin-displacement` | Medium | Thin evidence base (4 points), wide range |

### Charts That Work Well

| Chart | Why It Works |
|-------|-------------|
| `ai-adoption-rate` | Clean time-series from consistent source (Census BTOS), `"latest"` aggregation, strong disclaimer about survey inflation |
| `genai-work-adoption` | Dedicated `AIAdoptionChart` component with clear confirmed vs. estimated distinction, dual-line design |
| `freelancer-rate-impact` | All T1 evidence, consistent direction, clear unit, good confidence ranges |
| `entry-level-wage-impact` | Consistent negative direction, reasonable source mix, clear framing |
| `median-wage-impact` | Good source diversity (T1-T4), wide range but honestly presented |
| `high-skill-wage-premium` | Consistent positive direction, reasonable range (15–35%), clear story |

---

## HONEST LIMITS

These are things that **cannot be fixed** with better visualization:

1. **The displacement literature is fundamentally fragmented.** Sources define "displacement" differently (net job loss, task elimination, role restructuring, exposure risk). No amount of visual design can make these methodologically compatible. The best the site can do — and largely does — is be transparent about this through disclaimers and context maps.

2. **Projection-dominated charts have no ground truth.** For charts like `creative-industry-displacement` or `healthcare-admin-displacement`, all data points are forecasts from different models. There is no observed baseline to anchor the weighted average. The uncertainty is irreducible until observed data arrives.

3. **The weighted average formula makes defensible but arbitrary choices.** Tier weights (4/2/1/0.5), recency scaling (1.0–1.5x), and sample size boosts (log-scaled) are reasonable but not uniquely correct. Different weight choices would produce different headline numbers. This is inherent to any evidence synthesis approach.

4. **Small-N charts will remain fragile.** Education (4 points), healthcare admin (4 points), and to some extent creative industry (8 points) will have their weighted averages shift significantly with each new source ingested. No visualization trick fixes thin evidence — only more evidence does.

5. **The absence of macro displacement is genuinely ambiguous.** "~0% measured job loss" could mean (a) AI hasn't displaced jobs yet, (b) it has but aggregate statistics are too slow to capture it, or (c) displacement is happening but being offset by job creation. The site can present this ambiguity but cannot resolve it.
