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
- `overall-us-displacement` — "Overall US Job Displacement by 2030" — unit: "% of US jobs"
- `total-us-jobs-lost` — "Total US Jobs Lost to AI as % of Labor Force" — unit: "% of US labor force"
- `white-collar-professional-displacement` — "White-Collar Professional Displacement by 2030" — unit: "% of roles displaced"
- `tech-sector-displacement` — "Tech Sector Job Displacement by 2030" — unit: "% of jobs displaced"
- `creative-industry-displacement` — "Creative Industry Displacement by 2030" — unit: "% of roles displaced"
- `education-sector-displacement` — "Education Sector Displacement by 2030" — unit: "% of roles displaced"
- `healthcare-admin-displacement` — "Healthcare Administrative Displacement by 2030" — unit: "% of roles displaced"
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

4. **DATA TYPE** — Classify as:
   - `data_point`: Units directly match the graph → plotted on the chart line
   - `overlay`: Provides directional evidence but different units → shown as directional signal
   - When unsure, default to `overlay`

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
    Type:  DATA POINT / OVERLAY
    Value: [value] (midpoint of [low]–[high]) — or just the value if not a range
    Quote: "[exact quote from source]"

[2] → [Graph Title] ([slug])
    ...

--- Proposed File Changes ---

[filename].json:
  + history: date=[date], value=[value], range=[[low], [high]], tier=[tier]
  + source: [source-id]
```

### Step 5: Ask for Confirmation

After presenting the report, ask the user if they want to apply the changes. Offer options:
- Apply all changes
- Skip specific statistics
- Modify values or graph assignments

### Step 6: Apply Changes

When confirmed, for each prediction JSON file that needs changes:

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

### Critical Rules

- **NEVER invent data.** Only extract statistics explicitly stated in the source text.
- **ALWAYS provide exact quotes.** Every data point must trace back to verbatim source text.
- **RANGES → MIDPOINTS.** When a source says "20-30%", plot 25% with confidenceLow=20 and confidenceHigh=30.
- **NEGATIVE VALUES for losses.** Wage declines and rate drops should be negative (e.g., -10 for "10% wage decline").
- **CONSERVATIVE classification.** When unsure between data_point and overlay, choose overlay. When unsure about tier, choose the higher number (lower quality).
- **ONE source entry per file.** If a source has multiple stats for the same graph, add the source once but add each stat as a separate history/overlay entry.
- **Validate JSON** after editing each file to ensure it's still valid.
