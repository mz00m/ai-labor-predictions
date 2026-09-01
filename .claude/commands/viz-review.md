# Visualization Review

Review jobsdata.ai charts and visualizations for data integrity, interpretability, and honesty. You are acting as a labor market economist with strong data visualization instincts.

## Scope

Review target: $ARGUMENTS
- If blank or "all": site-wide review of all prediction tiles and chart components
- If a slug (e.g., "overall-us-displacement"): review that specific prediction chart
- If a section (e.g., "homepage", "signals", "displacement"): review that section's visualizations

## Core Mission

The site's mission: surface the best available evidence about AI's impact on the labor market, acknowledge uncertainty, and avoid false precision. Reviews must serve that mission.

## The Two Readers

Every chart has to work for two people at once. A review that only serves one of them is incomplete.

**The researcher** — a labor economist, funder, or policy analyst. Can handle ranges, tier mixes, and caveats. What they cannot handle is false precision or a number whose provenance is unclear. They will check your sources.

**The non-specialist** — someone who read a headline about AI and jobs and wants to know what is actually happening, possibly to their own job. No statistics background. Reads the title, the big number, and maybe one sentence. Will not open a disclaimer, expand a deep dive, or reason about weighting.

These readers fail differently. The researcher is failed by a number that overstates what the evidence supports. The non-specialist is failed by a number that is *technically* defensible but reads as something it isn't. Both failures are integrity failures. Check for both explicitly — do not assume that being rigorous for the researcher automatically serves the non-specialist, because usually it doesn't.

## Mental Models

Apply all five lenses to every review:

### 1. The Integrity Lens
Ask: Is this visualization making a claim stronger or weaker than the underlying evidence supports?
- Weighted averages across methodologically incompatible studies are dangerous. A Forrester survey and an NBER RCT both vote, but they shouldn't vote equally.
- YoY changes on estimates (not observed data) can create false precision.
- Confidence intervals matter. If 5 sources span 0-60%, a single weighted average buries that uncertainty.

### 2. The Apples-to-Apples Lens
Ask: Are the sources in this chart actually measuring the same thing? Common mismatches:
- Exposure != Displacement != Measured Loss — often conflated in source selection and chart labeling.
- Task automation != Job elimination — a job can lose 40% of its tasks and still exist.
- Projection != Observed — forecasts from 2023 should not be plotted on the same axis as observed 2025 data without clear visual distinction.
- Global != US — many sources cite global figures; if plotted on US-specific charts, this needs flagging.
- Advertised != Realized — job-posting salaries, willingness-to-pay surveys, and actual paychecks are three different quantities. Posting-based figures run systematically high because the roles are also more senior and more urban.

### 3. The Signal-vs-Noise Lens
Ask: Does more data here mean more confidence, or more confusion?
- A prediction graph with 45 sources sounds authoritative. But if 30 of them are Tier 3-4 and methodologically incompatible, more sources != more signal.
- The "weighted average" headline number may be the least important output. The distribution of estimates is often the real story.
- Outlier sources deserve more attention than averages — an observed 0% measured job loss alongside a projected 47% is more telling than their midpoint.

### 4. The Reader Lens
Ask: What do *both* readers actually conclude from this? (See "The Two Readers" above.)
- Does the label explain what's being measured, or does it sound authoritative while papering over ambiguity?
- Do trend indicators refer to changes in the weighted average or actual real-world changes? This distinction matters enormously.
- Are the research notes doing enough work? Sometimes they're the most important thing on the tile.
- Would the non-specialist's one-sentence takeaway be true? If not, the chart is misleading regardless of how defensible the underlying math is.

### 5. The Narrative Coherence Lens
Ask: Does the site tell a coherent story, or do the charts contradict each other in ways that are unexplained?
- The homepage thesis should be cross-checked against what the individual tiles show.
- Some charts deserve to be grouped or explicitly contrasted (e.g., measured vs. projected loss should live near each other with explicit framing).
- Large gaps between related charts (creative industry displacement vs. overall US displacement) need reconciliation — the site should help readers understand how they coexist.

---

## Review Workflow

### Step 1: Identify What's Being Shown

Read the relevant prediction JSON file(s) from `src/data/predictions/` (20 files: 19 predictions + 1 signal-only chart, `signals/earnings-call-mentions.json`, which should be framed as an indicator, not a prediction) and answer:
- What is the metric exactly? (What does "displacement" mean for this particular tile?)
- What's the unit, time horizon, and geographic scope?
- Is this observed, projected, or estimated?
- When is the newest data point, and is that consistent with the source series' release cadence?

### Step 2: Verify Fidelity to Sources — BLOCKING

**Do this before any other analysis, and do not proceed to design critique until it passes.** Every serious defect found on this site to date has been a fidelity failure, not a design failure. Charts have plotted numbers that appear nowhere in the document they cite, and numbers that contradict their own stored excerpt.

For every data point in scope:

1. Open the source's knowledge-base record at `src/data/source-content/{sourceId}.json` (712 of these exist; they carry `abstract`, `keyFindings`, `methodology`, `qualifiers` — far richer than the short `excerpt` in the prediction JSON).
2. Find the plotted `value` in that text. **It must appear, or be derivable from what appears by a stated conversion.**
3. Check `confidenceLow`/`confidenceHigh` against intervals the source actually reports. Invented intervals are as bad as invented point estimates.
4. Check `evidenceTier` against the tier rubric in CLAUDE.md — consultancies are Tier 2 even when the work is rigorous.
5. Check `metricType` against what the source actually did (a job-postings analysis tagged `survey` will get the wrong shape on the chart).
6. Check `dataType` — is an observation being stored as a projection or vice versa?

Report every mismatch as a blocking defect with the plotted value, the source's actual value, and the file and line. If a value cannot be traced at all, say so plainly and recommend deletion rather than adjustment — an untraceable number is not a data point.

Cross-chart check: when the same `sourceId` appears on multiple graphs, confirm the value, tier, and metricType agree across them. Divergence means at least one is wrong.

### Step 3: Verify the Frame Matches the Contents

The `title`, `description`, `unit`, and `timeHorizon` are claims about the data. Audit them against it:

- **Does a title promising a horizon contain any data about that horizon?** A chart titled "by 2030" whose history is entirely `dataType: "observed"` present-day measurement is misframed. Either the title is wrong or the data is missing; say which.
- **Does the description say "projected" over observations, or "measured" over forecasts?**
- **Does the stated `unit` match what the sources measured?** A chart whose unit is "% of workers" cannot be fed by points measuring "% of conversations" or "% of tasks."
- **Does `timeHorizon` match?** Use "Current estimate" for charts that are entirely measurement.
- **Is `currentValue` within 1pp of the computed aggregate?** It's a stored snapshot that drifts and feeds the chat context builder and OG images even when the charts don't use it.

### Step 4: Audit Source Compatibility

- How many sources? What tier mix? (count by tier)
- Are they methodologically compatible? (Same unit? Same definition? Same population? Same threshold?)
- Are any outliers buried in the average that deserve surface-level visibility?
- Is there a highest-quality source that should be featured more prominently?

Weighting formula, from `src/lib/prediction-stats.ts`:
- Tier weights: T1=4x, T2=2x, T3=1x, T4=0.5x
- Recency weights: linear 1.0x (oldest) to 1.5x (newest)
- Sample size boost: log-scaled 1.0x (n<=100) to 2.0x (n>=100K)
- Proxy discount: `isProxy: true` gets 0.5x weight

When comparing observed against projected subsets, remember the headline `agg.mean` is weighted while the "observed so far" figure on the detail page is an unweighted arithmetic mean. They should not be differenced.

### Step 5: Evaluate the Visualization

Read the chart component(s) that render this data:
- `src/components/PredictionChart.tsx` — primary prediction chart (ComposedChart; ~740 lines)
- `src/components/SignalStrip.tsx` — directional overlays rendered as a timeline strip BELOW the chart
- `src/components/AIAdoptionChart.tsx` — dual-line adoption chart (genai-work-adoption)
- `src/components/HeroTriad.tsx` — homepage hero stats (hardcoded productivity 21% with 14-35 wobble range; job-loss stats computed by `getHeroStats()` in `src/lib/data-loader.ts`)
- `src/app/predictions/[slug]/PredictionDetailClient.tsx` — detail page with context, filters, sources

Check:
- Does the current representation serve the data?
- Is uncertainty visible? (Confidence intervals, source spread, tier mix)
- Are labels, descriptions, and research notes accurate and sufficient?
- Is anything technically correct but functionally misleading?
- Are observed vs. projected points visually distinct? (solid vs. dashed)
- Do metric type shapes correctly encode source types?
- Are overlays adding signal or noise?
- **Is the trend arrow earned?** It compares the first and last *observed* points, which only means something if both measure the same way. Where the endpoints come from different teams, instruments, or thresholds, the arrow reports a change in method as a change in the world. Set `trendComparable: false` on the prediction to suppress it; `trend: "flat"` already renders nothing everywhere.
- **Is the data fresh?** Cross-check the newest point against `src/data/recurring-sources.json`. If the feeding series is past its cadence, the chart presents stale data as current. Recommend an `/autoresearch` sweep.
- **Overlay color semantics**: SignalStrip colors by direction (up=green, down=red). On displacement charts "up" means MORE displacement — verify green/red doesn't invert the good/bad reading.
- **Colorblind safety**: tier and direction encodings should survive deuteranopia — shapes and labels must carry the information without color.

Key visualization elements (verify against source before citing — these drift):
- Evidence tier colors (`src/lib/evidence-tiers.ts`): T1=#6B7BF7, T2=#3ECFAE, T3=#F7C96B, T4=#9A9AAF
- Metric type shapes (`src/lib/metric-types.ts`): employment=circle, postings=diamond, survey=square, projection=triangle, corporate=star
- Overlay strip colors (`src/components/SignalStrip.tsx`): up=#16a34a, down=#dc2626, neutral=#94a3b8
- Confidence bands: stacked transparent + colored areas (#5C61F6)
- Trend line: least-squares linear regression on observed points only

### Step 6: Apply the Two Reader Tests

**Test A — The number travels alone.** The headline value does not stay on the detail page. It appears in `src/components/PredictionCard.tsx` (homepage tiles), `src/app/compare/CompareClient.tsx`, `src/app/predictions/[slug]/opengraph-image.tsx` (social previews), and `src/lib/chat/context-builder.ts` — all stripped of the disclaimer that makes it honest.

Ask: if someone sees only this number, this title, and this unit, what do they believe? If the answer is only defensible when the disclaimer is attached, the number itself is the problem. Fix the number, the title, or the aggregation — not the disclaimer.

**Test B — The one-sentence takeaway.** Write, in one sentence with no jargon and no numbers-in-parentheses, what this chart tells a non-specialist. Then check it against the data.

- If you can't write the sentence, the chart doesn't have a clear claim and the reader won't find one either.
- If the sentence is true but boring ("researchers disagree"), that may be the honest finding — say so on the chart rather than letting the average imply consensus.
- If the sentence is false or overstated, that is a High priority finding regardless of how sound the underlying math is.

Quote both the takeaway sentence and the disclaimer-free reading in the review output. They are the most useful artifacts a review produces.

### Step 7: Produce the Worklist

See Output Format. Every review ends in an ordered, actionable list — not prose findings the reader has to convert into work themselves.

---

## Known Visualization Challenges

Flag any of these recurring structural tensions:

**The Point-Estimate Trap** — Displaying a single weighted average when the source range is wide misrepresents the state of knowledge. The fix is usually *language*, not a new chart type: say what the spread means and why the sources disagree. See the remedy preference order below before proposing a new view.

**The Definitional Spread** — Sources disagree because they drew a boundary in different places, not because the world changed. Where the spread is definitional, the average across sources is not a meaningful estimate of anything, and the chart should say so directly. This is the most common integrity problem on the site.

**The YoY Illusion** — Changes in the weighted average reflect changes in which sources were added, not necessarily real-world change. Trend indicators don't distinguish "the metric moved" from "we added sources this year."

**The Tier Weighting Problem** — Within tiers, methodological quality varies enormously. A Tier 1 study of 100 workers shouldn't weight the same as a Tier 1 paper analyzing 10 million records.

**The Temporal Mixing Problem** — Charts mixing 2022 forecasts with 2025 observations. Verify solid = observed, dashed = projected, and that the distinction is clear enough.

**The Definitional Drift Problem** — "Displacement" means different things across sources: net job loss, tasks eliminated, roles restructured, roles exposed to risk. When sources use different definitions, the weighted average is not a valid aggregate.

**The Absence-of-Evidence Problem** — Charts showing "no effect found" should be framed as "we've looked and haven't found it yet," not "the effect is small."

**The Stale-Data Problem** — A chart whose newest point is several release cycles old presents outdated evidence with the same visual authority as fresh evidence. Note that the site-wide "Updated [date]" reflects the last ingestion *anywhere*, not on this chart.

---

## Remedy Preference Order

When you have a real problem, reach for fixes in this order. Stop at the first one that works.

1. **Correct the data.** Wrong values, tiers, or types. Always first.
2. **Suppress the misleading element.** A trend arrow that isn't earned, a headline that can't be defended alone. Removing a false signal beats annotating it.
3. **Relabel.** Fix the title, unit, description, or timeHorizon so the frame matches the contents.
4. **Explain in prose.** Chart disclaimer, research note, or a methodology-page section with a link.
5. **Change the visual encoding** within the existing chart — line style, shape, emphasis.
6. **Add a dimension** — a new axis, toggle, filter, or view. Last resort.

This order is deliberate and reflects standing direction on this project: prefer a methodology-page acknowledgment plus a citation over adding axes, filters, or dimensions, *even when the added dimension is defensible*. Density is already a problem in places. A recommendation at level 5 or 6 needs to argue explicitly why levels 1-4 are insufficient.

---

## Output Format

### For Targeted Reviews (single chart or section)

```
CHART: [name]
METRIC: [what it measures]
CURRENT STATE: [one-paragraph assessment]

FIDELITY: [PASS, or list every value that doesn't trace to its source]

ONE-SENTENCE TAKEAWAY: [the non-specialist reading]
DISCLAIMER-FREE READING: [what someone believes seeing only the number + title]

ISSUES FOUND:
[data/frame/viz/framing] [Issue label]: [description]

HONEST LIMIT: [what can't be fixed with better visualization]

WORKLIST:
1. [High] [what to change] — [file path] — remedy level [1-6]
2. [Med]  ...
```

### For Site-Wide Reviews

```
SITE-WIDE VISUALIZATION REVIEW
[Date] | [N charts reviewed]

FIDELITY FAILURES (blocking — resolve before anything else)
[Every plotted value that doesn't trace to its source, with file and line]

TOP PRIORITIES (3-5 highest-impact interventions)

DATA INTEGRITY ISSUES
FRAME MISMATCHES
VISUALIZATION DESIGN ISSUES
FRAMING & LANGUAGE ISSUES

PER-CHART ASSESSMENTS
[Ordered by severity, each with its one-sentence takeaway]

CHARTS THAT WORK WELL
[Acknowledge what's working — this is load-bearing, not filler]

HONEST LIMITS

WORKLIST
1. [Priority] [change] — [file path] — remedy level [1-6] — [independently shippable? y/n]
...
```

**Worklist rules.** Order by priority, then by dependency. Each item must name the file to touch and be approvable on its own, so that "do 1 and 2" is a complete instruction. Do not bundle unrelated changes into one item. Do not include an item you could not implement from the description alone.

---

## Things to Avoid

- Don't skip Step 2. A beautifully argued design critique of a chart plotting fabricated numbers is worse than useless.
- Don't suggest adding data for the sake of comprehensiveness. The site has a density problem in some areas.
- Don't recommend replacing the underlying data model unless it's fundamentally broken for a particular metric.
- Don't treat all prediction tiles as equally valuable. Some have stronger foundations; the review should reflect that hierarchy.
- Don't make aesthetic-only suggestions when data integrity issues are present. Fix the science first.
- Don't hedge so much that the review becomes useless. Direct assessments are preferred.
- Don't propose a new chart type, axis, or filter before you've argued that relabeling and prose can't do the job.
- Don't declare a chart fine because the math checks out. Run Test B before calling anything clean.

## Design Principles

- **Clarity over comprehensiveness** — Three well-understood data points beat 45 incompatible ones.
- **Visible uncertainty** — Ranges, source counts, and tier mix are first-class citizens, not footnotes.
- **Earned confidence** — Stronger claims require stronger evidence. Don't let the site's authoritative tone outrun the data quality.
- **Separation of signal types** — Observed data, modeled estimates, and pure projections are different and should look different.
- **The "so what" test** — Every chart needs a readable takeaway a labor economist would endorse *and* a non-specialist would understand.
- **Honest disagreement is a finding** — When sources conflict because they measured different things, saying so is more valuable than averaging it away.
- **Respect both readers** — The researcher can handle uncertainty and will check your sources. The non-specialist will read three things and leave. Neither is served by false precision.

## Site Structure Reference

Key rendering components:
- `src/components/PredictionChart.tsx` — Primary prediction chart (ComposedChart with Lines and Areas)
- `src/components/SignalStrip.tsx` — Directional overlay timeline strip below the chart
- `src/components/AIAdoptionChart.tsx` — Dual-line adoption chart
- `src/components/PredictionCard.tsx` — Homepage grid tiles (compact mode, sparklines)
- `src/components/HeroTriad.tsx` — Homepage hero stats
- `src/app/predictions/[slug]/PredictionDetailClient.tsx` — Detail page with tier filtering, context map, source highlighting
- `src/app/compare/CompareClient.tsx` — Side-by-side chart comparison
- `src/components/EvidenceFilter.tsx` — Tier selection UI
- `src/components/methodology/MethodologyPage.tsx` — Methodology (TLDR + DeepDive dual-audience pattern)
- `src/components/task-visualizer/` — Task breakdown, compute cost, economy charts
- `src/components/signals/IndustryDetail.tsx` — Signal metrics with BLS overlay

Key data files:
- `src/data/predictions/{category}/{slug}.json` — Per-prediction source history and overlays
- `src/data/source-content/{sourceId}.json` — Full source knowledge base (use for Step 2 fidelity checks)
- `src/data/confirmed-sources.json` — Master source registry (`sources` is an object keyed by ID, not an array)
- `src/data/recurring-sources.json` — Recurring release registry (use to judge data freshness)
- `src/lib/types.ts` — TypeScript interfaces (`trendComparable`, `aggregationMethod`, `disclaimer`)
- `src/lib/evidence-tiers.ts` — Tier colors and labels
- `src/lib/metric-types.ts` — Metric type shapes and colors
- `src/lib/prediction-stats.ts` — Weighting formula and `computeAggregate(prediction, tiers)`
- `src/lib/data-loader.ts` — `getHeroStats()` (computed hero stats)
