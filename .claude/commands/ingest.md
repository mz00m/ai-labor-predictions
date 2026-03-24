---
name: source-ingestion
description: >
  Ingest research sources (papers, reports, articles, blog posts) into the
  jobsdata.ai AI Labor Predictions tracker. Extracts quantitative statistics
  about AI's impact on jobs, wages, and workforce, maps them to prediction
  graphs, and writes structured entries to the project's data files. Use this
  skill whenever the user says "ingest", "add source", "add this to jobsdata",
  "add this paper/article/report", shares a URL or PDF about AI labor impact,
  or references updating the prediction tracker data. Also trigger when the
  user pastes article text and asks to extract labor market statistics from it,
  or when they mention updating the graphs, adding a data point, or processing
  a new source for the site.
---

# Source Ingestion Skill

Ingest a research source into the jobsdata.ai AI Labor Predictions tracker. The goal is to extract every quantitative statistic from the source, map each to the correct prediction graph, and write properly formatted entries to the data files — with the user confirming each mapping before any file is changed.

## Input

The user provides a source in one of these forms:

* **URL** — a link to a research paper, report, blog post, or news article
* **Pasted text** — the content of an article or excerpt copied into the chat
* **Local file** — a reference to a file (PDF, .txt, .md) already on disk

The input is passed via: $ARGUMENTS

## Ingestion Workflow

Work through these steps in order. Do not skip steps or combine them without the user's explicit permission.

### Step 1: Fetch and Read the Source

Retrieve the source content based on the input type:

* **Pasted text** → Use it directly. Ask for the URL and publication date if not provided.
* **Local file path** → Use view or bash_tool to read the file contents.
* **URL** → Work through the waterfall below in order. Stop at the first strategy that returns ≥500 characters of meaningful text. Tell the user which strategy succeeded.

#### URL Fetch Waterfall

**Strategy 1 — curl**

```bash
curl -sL \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  --max-time 15 \
  "$URL"
```

If ≥500 characters and not a login wall or CAPTCHA → success. Otherwise move to Strategy 2.

**Strategy 2 — Python httpx**

```python
import httpx
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
with httpx.Client(follow_redirects=True, timeout=20, headers=headers) as client:
    r = client.get("$URL")
    print(r.text[:10000])
```

Install if needed: `pip install httpx -q`. If ≥500 characters → success. Otherwise move to Strategy 3.

**Strategy 3 — Direct PDF download (research papers only)**

Construct the PDF URL from the page URL using these patterns:

| Source | Page URL | PDF URL |
|--------|----------|---------|
| NBER | nber.org/papers/wNNNNN | nber.org/system/files/working_papers/wNNNNN/wNNNNN.pdf |
| arXiv | arxiv.org/abs/NNNN.NNNNN | arxiv.org/pdf/NNNN.NNNNN |

```bash
curl -sL --max-time 30 -o /tmp/paper.pdf "$PDF_URL"
```

Extract text:

```python
import subprocess, fitz  # pip install pymupdf -q
result = subprocess.run(["pdftotext", "/tmp/paper.pdf", "-"], capture_output=True, text=True)
if result.returncode == 0 and len(result.stdout) > 500:
    print(result.stdout[:15000])
else:
    doc = fitz.open("/tmp/paper.pdf")
    print("\n".join(page.get_text() for page in doc)[:15000])
```

If ≥500 characters → success. Otherwise move to Strategy 4.

**Strategy 4 — Playwright headless browser**

```bash
pip install playwright -q && python -m playwright install chromium --with-deps -q
```

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36").new_page()
    page.goto("$URL", wait_until="networkidle", timeout=30000)
    print(page.inner_text("body")[:15000])
    browser.close()
```

If ≥500 characters → success. Otherwise move to Strategy 5.

**Strategy 5 — Manual fallback**

All automated strategies failed. Tell the user what was tried and ask them to either paste the article text, upload the PDF, or copy the key sections into the chat. Do not proceed to Step 2 until content is available.

#### After fetching: clean the HTML

If the content is raw HTML, extract readable text before proceeding:

```python
from bs4 import BeautifulSoup  # pip install beautifulsoup4 -q
soup = BeautifulSoup(raw_html, "html.parser")
for tag in soup(["script", "style", "nav", "footer", "header"]):
    tag.decompose()
print(soup.get_text(separator=" ", strip=True)[:15000])
```

**NBER tip:** Strategy 3 (PDF) is the most reliable path for NBER papers. Construct the PDF URL directly from the paper number — you'll get the full text rather than just the abstract, which is essential for extracting all quantitative statistics.

If the retrieved content is under 200 characters after all strategies, warn the user that the fetch failed and wait for them to provide content manually.

### Step 2: Know the Prediction Graph Registry

These are the 17 prediction graphs on jobsdata.ai. Every extracted statistic must map to exactly one of them. The graph's unit is the most important matching criterion — a statistic can only be a data_point if its unit is directly compatible with the graph's unit.

**Displacement Graphs (8):**

| Slug | Title | Unit |
|------|-------|------|
| `overall-us-displacement` | Overall US Job Displacement by 2030 | % of US jobs |
| `total-us-jobs-lost` | Total US Jobs Lost to AI as % of Labor Force | % of US labor force |
| `white-collar-professional-displacement` | White-Collar Professional Displacement by 2030 | % of roles displaced |
| `tech-sector-displacement` | Tech Sector Job Displacement by 2030 | % of jobs displaced |
| `creative-industry-displacement` | Creative Industry Displacement by 2030 | % of roles displaced |
| `education-sector-displacement` | Education Sector Displacement by 2030 | % of roles displaced |
| `healthcare-admin-displacement` | Healthcare Administrative Displacement by 2030 | % of roles displaced |
| `customer-service-automation` | Customer Service Automation by 2028 | % of interactions automated |

**Wage Graphs (5):**

| Slug | Title | Unit |
|------|-------|------|
| `median-wage-impact` | Median Wage Impact from AI by 2030 | % change in real median wage |
| `geographic-wage-divergence` | AI Hub vs. Non-Hub Wage Divergence by 2030 | % wage premium |
| `entry-level-wage-impact` | Entry-Level Wage Impact from AI by 2030 | % wage change |
| `high-skill-wage-premium` | High-Skill AI Wage Premium by 2030 | % wage premium over median |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact by 2028 | % rate change |

**Adoption, Exposure & Signals (4):**

| Slug | Title | Unit |
|------|-------|------|
| `ai-adoption-rate` | AI Adoption Rate Across US Companies | % of firms (Census BTOS) |
| `genai-work-adoption` | Generative AI Adoption | % of adults at work |
| `workforce-ai-exposure` | US Workforce AI Exposure | % of jobs exposed |
| `earnings-call-ai-mentions` | S&P 500 AI Workforce Mentions in Earnings Calls | % of S&P 500 |

### Step 3: Extract Every Quantitative Statistic

Read the full source content and identify every quantitative claim about AI's impact on labor, jobs, wages, workforce, or the economy. For each statistic, capture:

**3a. Exact quote** — Copy the verbatim sentence(s) from the source. Never paraphrase, never summarize. This is the most important field because readers need to verify the data point against the original text.

**3b. Numeric value** — The number itself. Handle ranges like this:
* Single value (e.g., "47%") → record as value: 47
* Range (e.g., "20–30%") → record as value: 25 (midpoint), confidenceLow: 20, confidenceHigh: 30
* Negative impacts → use negative numbers (e.g., a "10% wage decline" → value: -10)

**3c. Graph mapping** — Match to the most appropriate graph using this priority:
1. **Unit compatibility** — Does the statistic's unit directly match the graph's unit? This is the primary criterion. A "% of US jobs" statistic maps to overall-us-displacement, not to workforce-ai-exposure (which measures exposure, not displacement).
2. **Topic alignment** — Is the subject matter the same? A healthcare stat goes to a healthcare graph even if the units technically fit a general displacement graph.
3. **Geographic/temporal scope** — US-specific stats map to US-specific graphs.

**3d. Data type** — Classify as one of two types:
* **data_point**: The statistic's unit directly and unambiguously matches the graph's unit. It will be plotted on the chart line. Use this only when you are confident in unit compatibility.
* **overlay**: The statistic provides relevant directional evidence but uses different units, covers a different geography, or measures something adjacent. It will appear as a contextual signal alongside the chart. When in doubt, choose overlay — it's the conservative default.

**3e. Direction (for overlays only)** — Classify the directional signal:
* **up** — suggests the graph's metric will be higher than current consensus
* **down** — suggests it will be lower
* **neutral** — informational without clear directional implication

**3f. Overlay label (for overlays only)** — Write a short label (80 characters max) in the format: "[Publisher]: [concise finding]" — e.g., "McKinsey: 30% of work hours automatable by 2030"

### Step 4: Classify the Source

Determine the following for the source as a whole (these apply to all extracted statistics):

**Evidence tier** — Classify the source, not the individual statistic:

| Tier | Description | Examples |
|------|-------------|----------|
| 1 | Peer-reviewed research, government statistics, RCTs | AER, QJE, Science, Nature, NBER working papers, BLS data, Census BTOS, SEC filings |
| 2 | Think tanks, international organizations, industry research | Brookings, McKinsey, RAND, IMF, World Bank, ILO, Gartner, Forrester, Deloitte |
| 3 | Major news outlets, trade publications, expert commentary | NYT, WSJ, FT, Reuters, Bloomberg, Wired, MIT Tech Review |
| 4 | Social media, blogs, podcasts, opinion pieces | Twitter/X, Substack, Reddit, personal blogs, podcast transcripts |

When uncertain between two tiers, choose the higher number (lower quality). A Brookings blog post is Tier 3, not Tier 2. A working paper on SSRN that hasn't been peer-reviewed is Tier 2, not Tier 1.

**Source ID** — Generate a slug in the format `{publisher}-{topic-keywords}-{year}`:
* Use lowercase, hyphens only, no special characters
* Keep it short but unique (e.g., `mckinsey-genai-workforce-2023`, `bls-ai-adoption-survey-2025`)
* Check existing data files to avoid duplicates

**Publication date** — Extract from the source. If only a month/year is available, use the first of the month (e.g., 2024-03-01). If only a year, use {year}-01-01.

### Step 5: Present the Extraction Report

Before changing any files, present a clear summary for the user to review:

```
══════════════════════════════════════════════════
  SOURCE INGESTION REPORT
══════════════════════════════════════════════════

  Title:     [source title]
  Publisher: [publisher name]
  Date:      [YYYY-MM-DD]
  Tier:      [1–4] ([tier label, e.g., "Think tank / industry research"])
  URL:       [url or "pasted text"]
  Source ID: [generated-source-id]

──────────────────────────────────────────────────
  EXTRACTED STATISTICS ([N] total)
──────────────────────────────────────────────────

  [1] → [Graph Title]
        Slug:  [graph-slug]
        Type:  DATA POINT | OVERLAY ([direction] if overlay)
        Value: [value] — or: [midpoint] (range: [low]–[high])
        Label: "[overlay label]" (overlays only)
        Quote: "[exact verbatim quote from source]"

  [2] → [Graph Title]
        ...

──────────────────────────────────────────────────
  FILE CHANGES (pending approval)
──────────────────────────────────────────────────

  src/data/predictions/[slug].json:
    + sources: [source-id]
    + history/overlays: [date], [value/direction]

  src/data/confirmed-sources.json:
    + sources["[source-id]"]: usedIn=[slug-1, slug-2, ...]
```

### Step 6: Get Per-Statistic Approval

Walk through each extracted statistic and ask the user to approve it individually. For each one, offer these options:

* **Accept** — apply as proposed
* **Skip** — do not add this statistic
* **Modify** — change the graph assignment, data type, direction, value, or label

Present statistics in small batches (2–3 at a time if there are many) rather than one massive list. This keeps decisions manageable.

If the user rejects all statistics, stop. Do not make any file changes.

### Step 7: Apply Approved Changes to Prediction Files

For each prediction JSON file that needs changes:

1. **Read** the current file content.
2. **Add the source entry** to the `sources` array (once per file, even if multiple stats map to this graph):
   ```json
   {
     "id": "[source-id]",
     "title": "[source title]",
     "url": "[url]",
     "publisher": "[publisher]",
     "evidenceTier": [tier],
     "datePublished": "[YYYY-MM-DD]",
     "excerpt": "[exact quote — use the most representative quote if multiple stats map here]"
   }
   ```
3. **For data points**, add an entry to the `history` array:
   ```json
   {
     "date": "[YYYY-MM-DD]",
     "value": [value],
     "confidenceLow": [range_low_or_null],
     "confidenceHigh": [range_high_or_null],
     "sourceIds": ["[source-id]"],
     "evidenceTier": [tier]
   }
   ```
4. **For overlays**, add an entry to the `overlays` array:
   ```json
   {
     "date": "[YYYY-MM-DD]",
     "direction": "up|down|neutral",
     "sourceIds": ["[source-id]"],
     "evidenceTier": [tier],
     "label": "[Publisher]: [short finding, 80 chars max]"
   }
   ```
5. **Keep arrays sorted by date** in ascending order (earliest first).
6. **Check for duplicates** before writing — skip if the source ID or URL already exists in the file.
7. **Validate JSON** after editing. If the file doesn't parse, fix it before moving on.

### Step 8: Update the Verified Source Registry

Update `src/data/confirmed-sources.json`:

1. **Add the source** to the `sources` object, keyed by source ID:
   ```json
   "[source-id]": {
     "id": "[source-id]",
     "title": "[source title]",
     "url": "[url]",
     "publisher": "[publisher]",
     "evidenceTier": [tier],
     "datePublished": "[YYYY-MM-DD]",
     "excerpt": "[primary excerpt — the most representative quote from this source]",
     "usedIn": ["[graph-slug-1]", "[graph-slug-2]"],
     "verified": true,
     "synthetic": false
   }
   ```
   * `usedIn` must list every graph slug this source was added to
   * Always set `verified: true` and `synthetic: false` for ingested sources
   * Skip entirely if the source ID already exists

2. **Increment counters**: Add 1 to both `totalSources` and `verifiedCount`.

### Step 9: Update Timestamps

After all file changes are applied:

1. **Set** the `lastUpdated` field in `src/data/confirmed-sources.json` to today's date (`YYYY-MM-DD`).
2. **Set** `src/data/last-updated.json` to `{ "lastUpdated": "YYYY-MM-DD" }` — this is what the site hero component reads.

### Step 10: Confirm Completion

Summarize what was done:

* How many statistics were added (and how many were skipped)
* Which graph files were modified
* Remind the user to commit and deploy if working in a git repo

## Rules

These rules are non-negotiable. They protect data integrity and reader trust.

1. **Never invent data.** Only extract statistics that are explicitly stated in the source text. If a number isn't in the source, it doesn't get added.
2. **Always use exact quotes.** Every data point and overlay must trace back to a verbatim quote. No paraphrasing, no summarizing, no rewording. Copy-paste from the source.
3. **Ranges become midpoints.** When a source says "20–30%", the plotted value is 25 with confidenceLow: 20 and confidenceHigh: 30.
4. **Negative values for losses.** Wage declines, rate drops, and job losses should be negative numbers (e.g., "10% wage decline" → value: -10). Displacement percentages remain positive because the graph's unit is "% displaced" (i.e., the displacement itself is the metric).
5. **Default to overlay when uncertain.** If you're not sure whether a stat's unit matches the graph's unit, classify it as an overlay rather than a data_point. Overlays are low-risk; bad data points distort the chart.
6. **Default to higher tier number when uncertain.** A Tier 3 source misclassified as Tier 2 erodes trust. The reverse is merely conservative.
7. **One source entry per prediction file.** If a source contributes multiple statistics to the same graph, add the source once to `sources` but add each statistic as a separate `history` or `overlay` entry.
8. **Validate JSON after every edit.** A malformed JSON file will break the site. Read back the file after writing to confirm it parses.
9. **Never write files without user approval.** The extraction report (Step 5) and per-statistic confirmation (Step 6) must happen before any file is modified.
10. **Preserve existing data.** When editing a file, never remove or modify existing entries. Only append new entries to the relevant arrays.

## Common Mapping Pitfalls

These are easy mistakes to avoid:

* **"Exposed to AI" ≠ "displaced by AI."** A stat like "60% of jobs are exposed to AI" maps to `workforce-ai-exposure`, not `overall-us-displacement`. Exposure means the job involves tasks AI can affect; displacement means the job is eliminated.
* **Global stats ≠ US stats.** "300 million jobs globally" does not map to a US-specific graph without conversion. Use overlay if the geographic scope doesn't match.
* **"Tasks automatable" ≠ "jobs displaced."** A finding that "30% of tasks within an occupation can be automated" is about task automation, not job elimination. Many jobs will be restructured rather than eliminated.
* **Productivity gains are positive.** A "7% GDP boost" has direction: up and a positive value — it's a gain, not a loss.
* **Adoption rates are adoption rates.** "75% of knowledge workers use AI tools" maps to `genai-work-adoption`, not to any displacement graph.
