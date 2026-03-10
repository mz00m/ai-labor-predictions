# Source Ingestion Skill

You are ingesting a research source into the AI Labor Predictions tracker. Your job is to extract ALL quantitative statistics from the source, map each to the correct prediction graph, and write properly formatted entries to the data files.

## Input

The user has provided the following source to ingest:

$ARGUMENTS

## Step-by-Step Process

### Step 1: Fetch the Source Content

- If the input is a URL, use `WebFetch` to retrieve the page content
- If the input is pasted text, use it directly
- If the input references a local file, use `Read` to load it

### Step 2: Load the Prediction Graph Registry

Read all 17 prediction JSON files to understand the available graphs. Here is the complete registry for reference:

**Displacement Graphs:**
- `overall-us-displacement` — "Projected US Job Displacement from AI by 2030" — unit: "% of US jobs"
- `white-collar-professional-displacement` — "White-Collar Professional Displacement by 2030" — unit: "% of roles displaced"
- `tech-sector-displacement` — "Tech Sector Job Displacement by 2030" — unit: "% of jobs displaced"
- `creative-industry-displacement` — "Creative Industry Displacement by 2030" — unit: "% of roles displaced"
- `education-sector-displacement` — "Education Sector Displacement by 2030" — unit: "% of roles displaced"
- `healthcare-admin-displacement` — "Healthcare Administrative Displacement by 2030" — unit: "% of roles displaced"
- `financial-services-displacement` — "Financial Services Displacement by 2030" — unit: "% of roles displaced"
- `customer-service-automation` — "Customer Service Automation by 2028" — unit: "% of interactions automated"

**Wage Graphs:**
- `median-wage-impact` — "Median Wage Impact from AI by 2030" — unit: "% change in real median wage"
- `geographic-wage-divergence` — "AI Hub vs. Non-Hub Wage Divergence by 2030" — unit: "% wage premium"
- `entry-level-wage-impact` — "Entry-Level Wage Impact from AI by 2030" — unit: "% wage change"
- `high-skill-wage-premium` — "High-Skill AI Wage Premium by 2030" — unit: "% wage premium over median"
- `freelancer-rate-impact` — "Freelancer/Gig Worker Rate Impact by 2028" — unit: "% rate change"

**Adoption, Exposure & Signals:**
- `ai-adoption-rate` — "AI Adoption Rate Across US Companies" — unit: "% of firms (Census BTOS)"
- `genai-work-adoption` — "Generative AI Adoption" — unit: "% of adults at work"
- `workforce-ai-exposure` — "US Workforce AI Exposure" — unit: "% of jobs exposed"
- `earnings-call-ai-mentions` — "S&P 500 AI Workforce Mentions in Earnings Calls" — unit: "% of S&P 500"

### Step 3: Extract Statistics

From the source content, extract EVERY quantitative statistic related to AI's impact on labor, jobs, wages, or workforce. For each statistic:

1. **EXACT QUOTE** — Copy the exact verbatim sentence(s) from the source. Never paraphrase. This is critical for reader trust and verifiability.

2. **VALUE** — The numeric value. For ranges (e.g., "20-30%"):
   - Use the midpoint as the value (e.g., 25)
   - Record the range bounds separately

3. **GRAPH MAPPING** — Match to the most appropriate graph based on:
   - **Unit compatibility** (most important — does the stat's unit match the graph's unit?)
   - **Topic alignment** (secondary)

4. **DATA TYPE** — Classify using this decision tree:

   **Step A: Direct unit match?**
   Does the stat's unit exactly match the graph's unit (e.g., "% of jobs displaced" → displacement graph)?
   - YES → `data_point` (standard). Proceed to step 5.
   - NO → Go to Step B.

   **Step B: Known proxy metric with conversion?**
   Is the stat a recognized proxy for the graph's unit? Check the proxy conversion table:

   | Proxy Metric | Target Unit | Conversion Factor | Range | Rationale |
   |---|---|---|---|---|
   | Job posting decline (%) | % jobs displaced | 0.35 | 0.2–0.5 | Posting drops overstate displacement ~2–3x; most reflect hiring freezes, not eliminations (Cajner et al., Davis/Haltiwanger) |
   | Task automation potential (%) | % jobs displaced | 0.30 | 0.15–0.50 | Not all automatable tasks lead to job cuts; firms redeploy workers (Autor, OECD 2023) |
   | Relative posting change (%) | % jobs displaced | 0.30 | 0.15–0.45 | Relative comparisons (high-AI vs low-AI occupations) capture substitution patterns but not net displacement |
   | Productivity gain (%) | % wage change | 0.40 | 0.20–0.60 | Historical pass-through of productivity to wages is partial and lagged (Stansbury/Summers) |
   | Revenue impact (%) | % jobs displaced | 0.25 | 0.10–0.40 | Revenue automation ≠ headcount reduction; firms often redeploy savings to growth |

   - If proxy match found → `data_point` with `isProxy: true`. Apply conversion:
     - `value` = rawValue × conversionFactor (use midpoint)
     - `confidenceLow` = rawValue × conversionLow
     - `confidenceHigh` = rawValue × conversionHigh
     - Include `proxyContext` object with `actualUnit`, factors, and `rationale`
     - The point receives 0.5× weight discount in the weighted average automatically
   - If no proxy match → Go to Step C.

   **Step C: Outlier check — would plotting this create a statistical outlier?**
   Compare the proposed value against existing data points on the target graph:
   - Compute the mean and standard deviation of existing `history[]` values
   - If |proposedValue - mean| > 2 × stddev → FLAG as potential outlier
   - Present the flag to the user: "This value (X%) is >2 SD from the graph mean (Y% ± Z%). Recommend: overlay unless you can justify the deviation."

   **Step D: Default to overlay**
   - `overlay`: Provides directional evidence but different units → shown as directional signal
   - When unsure, default to `overlay`

   **Example — World Bank posting study:**
   Source says: "Job postings for high-AI-substitution occupations fell 12% relative to low-substitution roles"
   - Unit: "relative job posting decline (%)" ≠ graph unit "% of US jobs" → not a direct match
   - Proxy table match: "Relative posting change → % jobs displaced" with factor 0.30 [0.15–0.45]
   - Converted: value = -12 × 0.30 = -3.6, confidenceLow = -12 × 0.45 = -5.4, confidenceHigh = -12 × 0.15 = -1.8
   - Result: `data_point` with `isProxy: true`, value = -3.6, range [-5.4, -1.8]
   - This plots sensibly alongside direct displacement estimates (-3% to -6%) instead of appearing as a -12% outlier

5. **EVIDENCE TIER** — Classify the source (not individual stats):
   - **Tier 1**: Peer-reviewed journals (AER, QJE, Science, Nature), NBER/CEPR working papers, government statistics (BLS, Census, OECD data tables), SEC filings, RCTs
   - **Tier 2**: Think tanks (Brookings, McKinsey, RAND), international orgs (IMF, World Bank, ILO), industry research (Gartner, Forrester, Deloitte), prediction markets
   - **Tier 3**: Major news outlets (NYT, WSJ, FT, Reuters, Bloomberg), trade publications, expert commentary
   - **Tier 4**: Twitter/X, Reddit, blogs, Substack, podcasts

6. **SOURCE ID** — Generate as: `{publisher-slug}-{topic-keywords}-{year}` (e.g., `gartner-cs-agents-replaced-2025`). Check that the ID doesn't already exist in the target file.

### Step 4: Present Extraction Report

Before making any changes, present a clear report to the user:

```
=== SOURCE INGESTION REPORT ===

Title:     [source title]
Publisher: [publisher]
Date:      [YYYY-MM-DD]
Tier:      [1-4] ([tier label])
URL:       [url if available]

--- Extracted Statistics ---

[1] → [Graph Title] ([slug])
    Type:  DATA POINT / OVERLAY / PROXY DATA POINT
    Value: [value] (midpoint of [low]–[high]) — or just the value if not a range
    Quote: "[exact quote from source]"

    (If PROXY DATA POINT):
    Raw:        [rawValue] [actualUnit]
    Converted:  [convertedValue] [graphUnit] (×[factor], range [low]–[high])
    Rationale:  [why this conversion]
    Outlier?:   [YES/NO — is converted value >2 SD from graph mean?]

[2] → [Graph Title] ([slug])
    ...

--- Proposed File Changes ---

[filename].json:
  + history: date=[date], value=[value], range=[[low], [high]], tier=[tier]
  + source: [source-id]
```

### Step 5: Ask for Confirmation (Per-Statistic)

After presenting the report, ask the user to approve **each extracted statistic individually**. For each statistic, use `AskUserQuestion` to let the user:
- **Accept** — apply as proposed
- **Skip** — do not add this statistic
- **Modify** — change the graph assignment, direction, value, or label

Walk through each statistic one at a time (or in small batches of 2-3 if there are many). Only apply statistics the user explicitly approves. If the user rejects all statistics, stop — do not make any file changes.

### Step 6: Apply Approved Changes

For each **approved** prediction JSON file that needs changes:

1. **Read** the current file
2. **Add the Source entry** to the `sources` array:
   ```json
   {
     "id": "[source-id]",
     "title": "[source title]",
     "url": "[url]",
     "publisher": "[publisher]",
     "evidenceTier": [tier],
     "datePublished": "[YYYY-MM-DD]",
     "excerpt": "[exact quote used for this graph's statistic]"
   }
   ```
3. **For data points**, add to the `history` array:
   ```json
   {
     "date": "[publication date YYYY-MM-DD]",
     "value": [value],
     "confidenceLow": [range_low if range],
     "confidenceHigh": [range_high if range],
     "sourceIds": ["[source-id]"],
     "evidenceTier": [tier]
   }
   ```
   **For proxy data points** (when `isProxy: true`), use the converted value and add proxy metadata:
   ```json
   {
     "date": "[publication date YYYY-MM-DD]",
     "value": [convertedValue],
     "confidenceLow": [rawValue × conversionLow],
     "confidenceHigh": [rawValue × conversionHigh],
     "sourceIds": ["[source-id]"],
     "evidenceTier": [tier],
     "metricType": "[postings|survey|etc]",
     "isProxy": true,
     "proxyContext": {
       "actualUnit": "[what the study actually measured]",
       "conversionFactor": [factor used],
       "conversionLow": [low end of range],
       "conversionHigh": [high end of range],
       "rationale": "[why this conversion factor, ≤120 chars]"
     }
   }
   ```
4. **For overlays**, add to the `overlays` array:
   ```json
   {
     "date": "[publication date YYYY-MM-DD]",
     "direction": "up|down|neutral",
     "sourceIds": ["[source-id]"],
     "evidenceTier": [tier],
     "label": "[Publisher]: [short finding, ~80 chars max]"
   }
   ```
5. **Keep arrays sorted by date** (ascending)
6. **Check for duplicates** — skip if source ID or URL already exists

### Step 7: Populate Chatbot Content Store

After applying changes to prediction files, populate the chatbot source content store so the chat assistant can answer questions grounded in this source's full text. This is REQUIRED for every ingested source regardless of evidence tier.

1. **Write a source content JSON file** to `src/data/source-content/[source-id].json` with this structure:
   ```json
   {
     "id": "[source-id]",
     "abstract": "[2-4 sentence summary of the source's main argument and findings, 500-2000 chars]",
     "keyFindings": ["Finding 1 with specific numbers", "Finding 2", "Finding 3"],
     "methodology": "[Study design, data sources, sample size, time period, analytical approach. If not a study, describe the evidence basis.]",
     "qualifiers": "[Caveats, limitations, uncertainty language, scope restrictions mentioned by the authors.]",
     "fetchedAt": "[today's date YYYY-MM-DD]"
   }
   ```
2. **keyFindings** should have 3-5 items, each a single sentence with specific numbers and dates when available
3. **Use the authors' own language** where possible — do not editorialize
4. **Include dates** in findings: e.g., "As of Q1 2026, 12.3% of US firms use AI in production"
5. If the source file already exists in `src/data/source-content/`, skip this step

### Step 8: Add to Verified Source List

After applying changes to prediction files, also update `src/data/confirmed-sources.json`:

1. **Read** the current file
2. **Add a source entry** to the `sources` object for each approved source (keyed by source ID):
   ```json
   "[source-id]": {
     "id": "[source-id]",
     "title": "[source title]",
     "url": "[url]",
     "publisher": "[publisher]",
     "evidenceTier": [tier],
     "datePublished": "[YYYY-MM-DD]",
     "excerpt": "[primary excerpt from this source]",
     "usedIn": ["[graph-slug-1]", "[graph-slug-2]"],
     "verified": true,
     "synthetic": false
   }
   ```
   - The `usedIn` array should list **every** prediction graph slug this source was added to
   - Set `verified: true` and `synthetic: false` for all ingested sources
   - Skip if the source ID already exists in the file
3. **Increment** `totalSources` and `verifiedCount` by the number of new sources added (usually 1)

### Step 9: Update Last Updated Date

After all file changes are applied:

1. **Update** the `lastUpdated` field in `src/data/confirmed-sources.json` to today's date (`YYYY-MM-DD`)
2. **Update** `src/data/last-updated.json` to `{ "lastUpdated": "YYYY-MM-DD" }` with today's date — this is what the site Hero reads to display "Updated ..."
3. This ensures the site header reflects the most recent ingestion

### Critical Rules

- **NEVER invent data.** Only extract statistics explicitly stated in the source text.
- **ALWAYS provide exact quotes.** Every data point must trace back to verbatim source text.
- **RANGES → MIDPOINTS.** When a source says "20-30%", plot 25% with confidenceLow=20 and confidenceHigh=30.
- **NEGATIVE VALUES for losses.** Wage declines and rate drops should be negative (e.g., -10 for "10% wage decline").
- **CONSERVATIVE classification.** When unsure between data_point and overlay, choose overlay. When unsure about tier, choose the higher number (lower quality).
- **ONE source entry per file.** If a source has multiple stats for the same graph, add the source once but add each stat as a separate history/overlay entry.
- **Validate JSON** after editing each file to ensure it's still valid.
