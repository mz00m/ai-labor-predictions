# Proxy Metric & Outlier Study Methodology

## Problem Statement

Many labor market studies measure metrics that are **related to but not identical to** a prediction graph's unit. For example:

| Study Measures | Graph Unit | Relationship |
|---|---|---|
| Job posting decline (%) | % of jobs displaced | Proxy — postings drop faster than actual layoffs |
| Task automation potential (%) | % of roles displaced | Proxy — automatable tasks ≠ eliminated jobs |
| Relative posting change (high-AI vs low-AI occupations) | % of jobs displaced | Proxy — relative comparison, not absolute |
| Productivity gain (%) | % wage change | Proxy — partial, lagged pass-through |

Plotting these raw values on the target graph creates **false outliers** — a 12% posting decline looks like a massive displacement estimate when the graph's direct measurements cluster around 3-6%.

## Three-Way Classification

Every extracted statistic falls into one of three categories:

### 1. Direct Data Point
**Unit matches the graph exactly.** Plot as-is.

Example: "21.5% of white-collar roles face displacement" on the white-collar displacement graph (unit: "% of roles displaced").

### 2. Proxy Data Point (`isProxy: true`)
**Unit is a recognized proxy with an empirically grounded conversion factor.** Convert the value, widen the confidence bands, and plot with a weight discount.

Example: "Job postings for high-AI-substitution occupations fell 12% relative to low-substitution roles" → converted to -3.6% displacement (×0.30 factor, range -5.4% to -1.8%).

### 3. Overlay
**Directional evidence only — no reasonable numeric conversion exists.** Show as a directional band (up/down/neutral) with a label.

Example: "80% of surveyed workers report AI saves them 1+ hour/day" → overlay with direction "up" on a productivity-adjacent graph.

## Decision Tree

```
Does the stat's unit exactly match the graph's unit?
├─ YES → Direct data_point
└─ NO → Is there a known proxy conversion? (see table below)
    ├─ YES → Apply conversion → Would converted value be >2σ from graph mean?
    │   ├─ NO → Proxy data_point (isProxy: true)
    │   └─ YES → Flag for review. Consider:
    │       ├─ Is the conversion factor too generous? → Adjust or use overlay
    │       └─ Is the study measuring something fundamentally different? → Overlay
    └─ NO → Is there a reasonable new conversion you can justify?
        ├─ YES → Add to conversion table, apply as proxy
        └─ NO → Overlay (default)
```

## Proxy Conversion Table

| Proxy Metric | Target Unit | Factor | Range | Empirical Basis |
|---|---|---|---|---|
| Job posting decline (%) | % jobs displaced | 0.35 | 0.20–0.50 | Posting drops overstate displacement 2–3x; most reflect hiring freezes not eliminations (Cajner et al. 2020, Davis/Haltiwanger/Schuh 1996) |
| Task automation potential (%) | % jobs displaced | 0.30 | 0.15–0.50 | OECD (2023): only 30% of technically automatable tasks lead to actual job restructuring within 5 years; firms redeploy workers (Autor 2015) |
| Relative posting change (%) | % jobs displaced | 0.30 | 0.15–0.45 | Relative comparisons (high-AI vs low-AI occupations) capture substitution patterns but overstate net displacement due to composition effects |
| Productivity gain (%) | % wage change | 0.40 | 0.20–0.60 | Historical productivity-to-wage pass-through is ~40% in the medium run (Stansbury/Summers 2020), lower in the short run |
| Revenue automation (%) | % jobs displaced | 0.25 | 0.10–0.40 | Revenue automation often precedes headcount reallocation not reduction; firms redeploy savings to growth areas |

### Conversion Mechanics

```
convertedValue = rawValue × conversionFactor
confidenceLow  = rawValue × conversionHigh  (note: for negative values, high factor = more negative = lower bound)
confidenceHigh = rawValue × conversionLow   (note: for negative values, low factor = less negative = upper bound)
```

For the World Bank study (rawValue = -12%, factor = 0.30, range 0.15–0.45):
- convertedValue = -12 × 0.30 = **-3.6%**
- confidenceLow = -12 × 0.45 = **-5.4%**
- confidenceHigh = -12 × 0.15 = **-1.8%**
- Result: -3.6% [-5.4%, -1.8%] — fits within the graph's existing range of -3% to -6%

## Weight Discount

Proxy data points receive a **0.5× weight multiplier** in the weighted average computation, stacking with the existing tier × recency × sample-size weights. This means:

- A Tier 1 proxy point gets: 4 × recency × sampleSize × **0.5** = effective 2× (equivalent to a direct Tier 2 measurement)
- A Tier 2 proxy point gets: 2 × recency × sampleSize × **0.5** = effective 1× (equivalent to a direct Tier 3 measurement)

This ensures proxy evidence informs the average without dominating it when direct measurements are available.

## Statistical Outlier Detection

During ingestion and audits, flag any data point where:

```
|value - mean| > 2 × stddev
```

For flagged values, check:
1. **Is `metricType` different from the majority?** (e.g., "postings" on a chart dominated by "employment" and "projection") → Likely should be a proxy or overlay
2. **Does the study use nuanced language?** Words like "relative to," "compared with," "conditional on," "task-level" signal that the measurement is indirect
3. **Is the geographic or demographic scope mismatched?** (e.g., European data on a US graph, or one occupation on an economy-wide graph)

## Nuanced Language Indicators

These phrases in a study's methodology suggest proxy status:

| Phrase | Signal |
|---|---|
| "relative to" / "compared with" | Relative measure, not absolute |
| "task-level" / "occupation-level exposure" | Automation potential, not displacement |
| "job postings" / "vacancy data" | Demand signal, not employment outcome |
| "conditional on" / "holding constant" | Partial equilibrium, doesn't capture reallocation |
| "could be automated" / "susceptible to" | Potential, not realized |
| "gross" (without "net") | Doesn't account for job creation |

## JSON Schema for Proxy Data Points

```json
{
  "date": "2025-11-01",
  "value": -3.6,
  "confidenceLow": -5.4,
  "confidenceHigh": -1.8,
  "sourceIds": ["worldbank-liu-wang-yu-2025"],
  "evidenceTier": 1,
  "dataType": "observed",
  "metricType": "postings",
  "isProxy": true,
  "proxyContext": {
    "actualUnit": "relative job posting decline (%)",
    "conversionFactor": 0.30,
    "conversionLow": 0.15,
    "conversionHigh": 0.45,
    "rationale": "Relative posting decline overstates net displacement; captures hiring freezes not eliminations"
  }
}
```

## When to Add New Conversion Factors

When encountering a proxy metric not in the table:

1. Search for empirical literature on the proxy-to-target relationship
2. If peer-reviewed evidence exists for the conversion range → add to table with citation
3. If only theoretical justification exists → use conservative (lower) factor and wider range
4. If no reasonable conversion basis exists → use overlay instead
5. Document the rationale in the `proxyContext.rationale` field

## Retroactive Application

Existing data points in prediction files that appear as outliers due to metric mismatch should be reviewed during data quality audits. The audit now includes:

- **Section 2f**: Statistical outlier detection (>2σ flagging)
- **Section 2g**: Proxy metric validation (verify conversion math)

Priority candidates for retroactive proxy conversion: any `metricType: "postings"` data point on displacement graphs where the value significantly exceeds the non-postings mean.
