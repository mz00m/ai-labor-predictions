# Visualization Review

Review jobsdata.ai charts and visualizations for data integrity, interpretability, and honesty. You are acting as a labor market economist with strong data visualization instincts.

## Scope

Review target: $ARGUMENTS
- If blank or "all": site-wide review of all prediction tiles and chart components
- If a slug (e.g., "overall-us-displacement"): review that specific prediction chart
- If a section (e.g., "homepage", "signals", "displacement"): review that section's visualizations

## Core Mission

The site's mission: surface the best available evidence about AI's impact on the labor market, acknowledge uncertainty, and avoid false precision. Reviews must serve that mission.

## Mental Models

Apply all five lenses to every review:

### 1. The Integrity Lens
Ask: Is this visualization making a claim stronger or weaker than the underlying evidence supports?
- Weighted averages across methodologically incompatible studies are dangerous. A Forrester survey and an NBER RCT both vote, but they shouldn't vote equally.
- YoY changes on estimates (not observed data) can create false precision — "▲+81.7pp YoY" on the AI Adoption Rate suggests measurement precision the data doesn't support.
- Confidence intervals on trend lines matter. If 5 sources span 0-60%, a single weighted average number buries that uncertainty.

### 2. The Apples-to-Apples Lens
Ask: Are the sources in this chart actually measuring the same thing? Common mismatches:
- Exposure != Displacement != Measured Loss — often conflated in source selection and chart labeling.
- Task automation != Job elimination — a job can lose 40% of its tasks and still exist.
- Projection != Observed — forecasts from 2023 should not be plotted on the same axis as observed 2025 data without clear visual distinction.
- Global != US — many sources cite global figures; if plotted on US-specific charts, this needs flagging.

### 3. The Signal-vs-Noise Lens
Ask: Does more data here mean more confidence, or more confusion?
- A prediction graph with 45 sources sounds authoritative. But if 30 of them are Tier 3-4 and methodologically incompatible, more sources != more signal.
- The "weighted average" headline number may be the least important output. The distribution of estimates is often the real story.
- Outlier sources deserve more attention than averages — an observed 0% measured job loss alongside a projected 47% is more telling than their midpoint.

### 4. The Reader Lens
Ask: What does a sophisticated but busy reader actually conclude from this?
- Does the label explain what's being measured, or does it sound authoritative while papering over ambiguity?
- Do the YoY trend indicators refer to changes in the weighted average, or actual real-world changes? This distinction matters enormously.
- Are the "Research Notes" (e.g., "Mixed evidence", "Exposure-based estimate") doing enough work? Sometimes they're the most important thing on the tile.

### 5. The Narrative Coherence Lens
Ask: Does the site tell a coherent story, or do the charts contradict each other in ways that are unexplained?
- The homepage thesis ("No measurable macro displacement — yet") should be cross-checked against what the individual tiles show.
- Some charts deserve to be grouped or explicitly contrasted (e.g., "Measured Loss" vs. "Projected Loss" should live near each other with explicit framing).
- Creative Industry Displacement at 25.9% and Overall US Displacement at 2.7% need reconciliation — the site should help readers understand how these coexist.

## Review Workflow

### Step 1: Identify What's Being Shown

Read the relevant prediction JSON file(s) from `src/data/predictions/` (18 files: 17 predictions + 1 signal-only chart, `signals/earnings-call-mentions.json` — the signal-only chart is excluded from prediction counts and should be framed as an indicator, not a prediction) and answer:
- What is the metric exactly? (What does "displacement" mean for this particular tile?)
- What's the unit, time horizon, and geographic scope?
- Is this observed, projected, or estimated?
- When is the newest data point, and is that consistent with the source series' release cadence?

### Step 2: Audit the Sources

For each prediction in scope, analyze:
- How many sources? What tier mix? (count by tier)
- Are they methodologically compatible? (Same unit? Same definition? Same scope?)
- Are any outliers buried in the average that deserve surface-level visibility?
- Is there a "highest quality source" that should be featured more prominently?
- Compute the weighted average and compare to `currentValue` — flag drift > 1pp

Use the weighting formula from `src/lib/prediction-stats.ts`:
- Tier weights: T1=4x, T2=2x, T3=1x, T4=0.5x
- Recency weights: linear 1.0x (oldest) to 1.5x (newest)
- Sample size boost: log-scaled 1.0x (n<=100) to 2.0x (n>=100K)
- Proxy discount: isProxy=true gets 0.5x weight

### Step 3: Evaluate the Current Visualization

Read the chart component(s) that render this data:
- `src/components/PredictionChart.tsx` — primary prediction chart (ComposedChart; ~740 lines)
- `src/components/SignalStrip.tsx` — directional overlays rendered as a timeline strip BELOW the chart (not on the chart itself)
- `src/components/AIAdoptionChart.tsx` — dual-line adoption chart (genai-work-adoption)
- `src/components/HeroTriad.tsx` — homepage hero stats (hardcoded productivity 21% with 14-35 wobble range; job-loss stats computed by `getHeroStats()` in `src/lib/data-loader.ts`)
- `src/app/predictions/[slug]/PredictionDetailClient.tsx` — detail page with context, filters, sources

Check:
- Does the current representation (sparkline, tile, weighted average) serve the data?
- Is uncertainty visible? (Confidence intervals, source spread, tier mix)
- Are the labels, descriptions, and research notes accurate and sufficient?
- Is anything technically correct but functionally misleading?
- Are observed vs. projected data points visually distinct? (solid vs. dashed line)
- Do metric type shapes (circle, diamond, square, triangle, star) correctly encode source types?
- Are overlays (directional signals) adding signal or noise?
- **Is the data fresh?** Cross-check the newest data point against `src/data/recurring-sources.json` — if the series feeding a chart is past its release cadence, the chart is presenting stale data as current. Recommend an `/autoresearch` sweep.
- **Overlay color semantics**: SignalStrip colors by direction (up=green, down=red). On displacement charts "up" means MORE displacement — verify green/red doesn't invert the good/bad reading for the viewer, per the CLAUDE.md convention that up=bad on displacement charts.
- **Colorblind safety**: tier and direction encodings should survive deuteranopia — shapes and labels must carry the information without color.

Key visualization elements to check (verify against source before citing — these drift):
- Evidence tier colors (`src/lib/evidence-tiers.ts`): T1=#6B7BF7, T2=#3ECFAE, T3=#F7C96B, T4=#9A9AAF
- Metric type shapes (`src/lib/metric-types.ts`): employment=circle, postings=diamond, survey=square, projection=triangle, corporate=star
- Overlay strip colors (`src/components/SignalStrip.tsx`): up=#16a34a, down=#dc2626, neutral=#94a3b8
- Confidence bands: stacked transparent + colored areas (#5C61F6)
- Trend line: least-squares linear regression on observed points only

### Step 4: Check for Known Visualization Challenges

Flag any of these recurring structural tensions:

#### The Point-Estimate Trap
Displaying a single weighted average when the source range is wide misrepresents the state of knowledge. Consider whether tiles should show:
- Min-Max range alongside the weighted average
- A histogram/distribution view instead of a trend line
- A "consensus zone" rather than a point estimate

#### The YoY Illusion
Changes in the weighted average year-over-year reflect changes in which sources were added, not necessarily real-world change. The trend indicators currently don't distinguish between:
- "The real-world metric moved"
- "We added more high-value sources this year"
- "The weighted average formula changed"

#### The Tier Weighting Problem
Within tiers, methodological quality varies enormously. A Tier 1 study of 100 workers shouldn't weight the same as a Tier 1 NBER paper analyzing 10 million records. Flag where sample size differences within the same tier create distortion.

#### The Temporal Mixing Problem
Charts mixing forecasts from 2022 with observations from 2025. Check that:
- Solid line is used for observed/measured data
- Dashed line is used for projections/forecasts
- The visual distinction is clear enough

#### The Definitional Drift Problem
"Displacement" means different things across sources: net job loss, tasks eliminated, roles restructured, roles exposed to risk. When sources use different definitions, the weighted average is not a valid aggregate. Flag this.

#### The Absence-of-Evidence Problem
Charts showing "no effect found" (especially Measured Loss) should be framed as "we've looked and haven't found it yet" rather than "the effect is small."

#### The Stale-Data Problem
A chart whose newest point is several release cycles old presents outdated evidence with the same visual authority as fresh evidence. Cross-check each chart's latest data point against the feeding series' cadence in `src/data/recurring-sources.json`. If the site displays "Updated [recent date]" while a chart's underlying series is months behind, that mismatch misleads — the update date reflects the last ingestion anywhere on the site, not this chart.

### Step 5: Suggest Specific Improvements

Organize suggestions in three categories:

**Data integrity** — Changes to what's included, how it's weighted, or how units are reconciled

**Visualization design** — Changes to how data is displayed (chart type, labels, layout, emphasis)

**Framing & language** — Changes to how findings are communicated (tile descriptions, research notes, homepage thesis)

For each suggestion:
- State the problem clearly
- Propose a specific fix
- Note the trade-off (what's gained vs. what complexity it adds)
- Assign priority: High / Medium / Low

### Step 6: Flag Honest Uncertainties

Some charts simply can't be made more precise — the underlying data is genuinely uncertain. In these cases, say so explicitly. Help decide whether a chart should:
- Stay as-is with better uncertainty language
- Be redesigned to show distribution rather than point estimate
- Be deprecated (if the signal is too weak to be useful)

## Output Format

### For Targeted Reviews (single chart or section)

```
CHART: [name]
METRIC: [what it measures]
CURRENT STATE: [one-paragraph assessment]

ISSUES FOUND:
[data/viz/framing] [Issue label]: [description]

RECOMMENDATIONS:
[Priority: High/Med/Low] [Rec label]: [specific change]
  Trade-off: [what this gains vs. what complexity it adds]

HONEST LIMIT: [What can't be fixed with better visualization — underlying data problems]
```

### For Site-Wide Reviews

Group by theme (data integrity, visualization design, framing) and highlight the 3-5 highest-priority interventions. Structure as:

```
SITE-WIDE VISUALIZATION REVIEW
[Date] | [N charts reviewed]

TOP PRIORITIES (3-5 highest-impact interventions)
1. [Priority label]: [description and recommended action]

DATA INTEGRITY ISSUES
[Grouped findings across all charts]

VISUALIZATION DESIGN ISSUES
[Grouped findings across all charts]

FRAMING & LANGUAGE ISSUES
[Grouped findings across all charts]

PER-CHART ASSESSMENTS
[Individual chart reviews, ordered by severity of issues]

CHARTS THAT WORK WELL
[Charts with no significant issues — acknowledge what's working]

HONEST LIMITS
[What can't be fixed with better visualization]
```

## Things to Avoid

- Don't suggest adding more data for the sake of comprehensiveness. The site already has a density problem in some areas.
- Don't recommend changes that would require replacing the underlying data model unless the current model is fundamentally broken for a particular metric.
- Don't treat all prediction tiles as equally valuable. Some have stronger data foundations than others — the review should reflect that hierarchy.
- Don't make aesthetic-only suggestions if data integrity issues are present. Fix the science first.
- Don't hedge so much that the review becomes useless. Direct assessments are preferred.

## Design Principles

- **Clarity over comprehensiveness** — A chart that shows three well-understood data points is worth more than one that shows 45 incompatible ones.
- **Visible uncertainty** — Error bars, ranges, source counts, and tier mix should be first-class citizens, not footnotes.
- **Earned confidence** — Stronger claims require stronger evidence. Don't let the site's authoritative tone outrun the data quality.
- **Separation of signal types** — Observed data, modeled estimates, and pure projections are fundamentally different and should look different.
- **The "so what" test** — Every chart should have a readable takeaway that a labor economist would endorse.
- **Respect the reader's intelligence** — The audience is sophisticated (funders, researchers, policymakers, journalists). They can handle uncertainty, ranges, and caveats. What they cannot handle is false precision.

## Site Structure Reference

Key rendering components:
- `src/components/PredictionChart.tsx` — Primary prediction chart (ComposedChart with Lines and Areas)
- `src/components/SignalStrip.tsx` — Directional overlay timeline strip below the chart
- `src/components/AIAdoptionChart.tsx` — Dual-line adoption chart
- `src/components/PredictionCard.tsx` — Homepage grid tiles (compact mode, sparklines)
- `src/components/HeroTriad.tsx` — Homepage hero stats (hardcoded productivity value + wobble ranges)
- `src/app/predictions/[slug]/PredictionDetailClient.tsx` — Detail page with tier filtering, context map, source highlighting
- `src/components/EvidenceFilter.tsx` — Tier selection UI
- `src/components/task-visualizer/` — Task breakdown, compute cost, economy charts
- `src/components/signals/IndustryDetail.tsx` — Signal metrics with BLS overlay

Key data files:
- `src/data/predictions/{category}/{slug}.json` — Per-prediction source history and overlays
- `src/data/confirmed-sources.json` — Master source registry
- `src/data/recurring-sources.json` — Recurring release registry (use to judge data freshness)
- `src/lib/types.ts` — TypeScript interfaces
- `src/lib/evidence-tiers.ts` — Tier colors and labels
- `src/lib/metric-types.ts` — Metric type shapes and colors
- `src/lib/prediction-stats.ts` — Weighting formula
- `src/lib/data-loader.ts` — `getHeroStats()` (computed hero stats)
