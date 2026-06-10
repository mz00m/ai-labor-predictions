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

## Intent Detection (Step 0)

Before starting the workflow, scan the user's prompt for **destination intent**. The skill supports three modes:

| Mode | Trigger phrases | Behavior |
|---|---|---|
| `predictions` (default) | no destination phrase | Steps 1–10 as written. Map to graphs, write to `predictions/*.json` and `confirmed-sources.json`. Do NOT touch `FeaturedReads.tsx` or `reading-list.json` unless the user adds a destination phrase. |
| `featured` | "add to important reads", "add to featured reads", "add to top 5", "important reads only", "just important reads", "featured only" | Skip Steps 2–8 (no graph mapping, no `confirmed-sources.json` write). Run Step F (Featured Reads) and add to `reading-list.json`. |
| `both` | "ingest and add to important reads", "all the way", "everything", "predictions and important reads" | Run Steps 1–10 PLUS Step F. The article goes to graphs AND to the homepage strip. |

If the user's intent is ambiguous, ask: *"Predictions only, important reads only, or both?"* Do not guess.

When mode is `featured` or `both`, you still need title + author + publisher + date + URL — fetch the source (Step 1) and infer those, but skip the quantitative-stat extraction unless mode is `both`.

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

#### Remote-session note (Claude Code on the web)

In remote/cloud sessions, outbound traffic goes through a proxy governed by the environment's network policy. Blocked hosts fail with HTTP 403 and `x-deny-reason: host_not_allowed` (curl) or a generic 403 (WebFetch) — retrying the same host with a different strategy will not help, and Playwright (Strategy 4) is usually unavailable. Hosts observed blocked under the default policy: `arxiv.org`, `export.arxiv.org`, `pewresearch.org`. Hosts observed working: `microsoft.com`, `ilo.org`, plus WebSearch generally.

Fallback order that works when the primary host is blocked:

1. **Try an alternate host for the same document** — publisher landing page, institutional mirror, or aggregator (e.g., a Microsoft Research publication page instead of the arXiv PDF).
2. **WebSearch for the exact sentences** — search distinctive phrases from the abstract/findings and confirm the verbatim wording from at least **two independent retrievals** before using it as a quote.
3. **Flag reduced verification** — if a quote could not be confirmed against the full text, say so explicitly in the extraction report and completion summary so the user can spot-check during review.

If a host keeps blocking ingestion work, tell the user to add it to the environment's network allowlist (Environments → Network access at claude.ai/code); the change takes effect in new sessions.

If the retrieved content is under 200 characters after all strategies, warn the user that the fetch failed and wait for them to provide content manually.

### Step 1.5: Duplicate Check (before extraction)

Before extracting anything, check whether this source is already ingested. Search `src/data/confirmed-sources.json` for the URL, the title, and any plausible source-ID slug. If found, report which graphs already use it (`usedIn`) and stop — unless the user explicitly wants to add *new* statistics from it, in which case only extract stats not already present.

### Step 2: Know the Prediction Graph Registry

These are the 18 prediction graphs on jobsdata.ai. Every extracted statistic must map to exactly one of them. The graph's unit is the most important matching criterion — a statistic can only be a data_point if its unit is directly compatible with the graph's unit. File paths are `src/data/predictions/{category}/{file}` — note the file name is not always the slug.

**Displacement Graphs (9)** — files in `src/data/predictions/displacement/`:

| Slug | File | Title | Unit |
|------|------|-------|------|
| `overall-us-displacement` | `overall.json` | Projected US Job Displacement from AI by 2030 | % of US jobs |
| `white-collar-professional-displacement` | `white-collar-professional.json` | White-Collar Professional Displacement by 2030 | % of roles displaced |
| `tech-sector-displacement` | `tech-sector.json` | Tech Sector Job Displacement by 2030 | % of jobs displaced |
| `creative-industry-displacement` | `creative-industry.json` | Creative Industry Displacement by 2030 | % of roles displaced |
| `education-sector-displacement` | `education-sector.json` | Education Sector Displacement by 2030 | % of roles displaced |
| `healthcare-admin-displacement` | `healthcare-admin.json` | Healthcare Administrative Displacement by 2030 | % of roles displaced |
| `financial-services-displacement` | `financial-services.json` | Financial Services Displacement by 2030 | % of roles displaced |
| `customer-service-automation` | `customer-service.json` | Customer Service Automation by 2028 | % of interactions automated |
| `robots-physical-automation` | `robots-physical-automation.json` | Robots & Physical Automation | % of physical tasks automated |

Do NOT use `total-us-jobs-lost` — it is archived (`displacement/_archived/total-jobs-lost.json`) and must not receive new data.

**Wage Graphs (4)** — files in `src/data/predictions/wages/`:

| Slug | File | Title | Unit |
|------|------|-------|------|
| `median-wage-impact` | `median-wage-impact.json` | Median Wage Impact from AI by 2030 | % change in real median wage |
| `entry-level-wage-impact` | `entry-level-impact.json` | Entry-Level Wage Impact from AI by 2030 | % wage change |
| `high-skill-wage-premium` | `high-skill-premium.json` | High-Skill AI Wage Premium by 2030 | % wage premium over median |
| `freelancer-rate-impact` | `freelancer-rate-impact.json` | Freelancer/Gig Worker Rate Impact by 2028 | % rate change |

There is no `geographic-wage-divergence` graph. Geographic wage findings go to the closest wage graph as overlays.

**Adoption, Exposure & Signals (5)** — files in `adoption/`, `exposure/`, `signals/`:

| Slug | File | Title | Unit |
|------|------|-------|------|
| `ai-adoption-rate` | `adoption/ai-adoption-rate.json` | AI Adoption Rate Across US Companies | % of firms (Census BTOS) |
| `genai-work-adoption` | `adoption/genai-work-adoption.json` | Generative AI Adoption | % of adults at work |
| `ai-business-formation` | `adoption/ai-business-formation.json` | AI Business Formation | % of new businesses |
| `workforce-ai-exposure` | `exposure/workforce-exposure.json` | US Workforce AI Exposure | % of jobs exposed |
| `earnings-call-ai-mentions` | `signals/earnings-call-mentions.json` | S&P 500 AI Workforce Mentions in Earnings Calls | % of S&P 500 |

**Aggregation method matters.** Check the graph's `aggregationMethod` before adding a data point. On `"latest"` graphs (`ai-adoption-rate`, `genai-work-adoption`, `workforce-ai-exposure`, `earnings-call-ai-mentions`), the most recent data point becomes the chart's headline value sitewide. Adding a data point to a `"latest"` graph is a high-stakes edit: warn the user explicitly that the new point will replace the headline, and double-check unit, scale, and geography before proposing it.

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

**3d. Data type** — Classify as one of three types:
* **data_point**: The statistic's unit directly and unambiguously matches the graph's unit. It will be plotted on the chart line. Use this only when you are confident in unit compatibility.
* **proxy data_point**: The statistic is a known proxy metric with a documented conversion factor (see `docs/proxy-metric-methodology.md`). Plot it with `isProxy: true` and a `proxyContext` explaining the conversion. Proxies receive a 0.5× weight discount in aggregation. Only use conversions documented in the methodology doc — never invent a conversion factor.
* **overlay**: The statistic provides relevant directional evidence but uses different units, covers a different geography, or measures something adjacent. It will appear as a contextual signal alongside the chart. When in doubt, choose overlay — it's the conservative default.

**Hard gates — automatic overlay (never data_point) when any of these apply:**
* **Index scores are not percentages.** Exposure/automation *index* values (e.g., "mean LLM exposure 0.386" on a 0–1 scale, Felten/Webb/Eloundou-style scores) are NOT "% of jobs" and must never be plotted on a percentage chart — neither raw nor multiplied by 100.
* **Geography mismatch.** Non-US studies (Canada, EU, global) do not become data points on US graphs.
* **Population mismatch.** A stat about one occupation, one firm, or one platform does not become a data point on an economy-wide or sector-wide graph unless the graph is scoped to exactly that population.
* **Counts need a denominator.** "X million jobs" only becomes a percentage if the source itself states the percentage or the denominator.

**3d-2. Observation status (`dataType` field)** — For every data_point, classify:
* **observed** — measured outcome that has already happened (payroll data, survey of current usage, realized layoffs)
* **projected** — forecast, model output, or expert estimate about the future

The site renders these differently and the hero "measured job loss" stat reads only observed points — misclassifying a projection as observed corrupts a headline number.

**3d-3. Metric metadata** — Also capture when available:
* `metricType` — e.g., `survey`, `projection`, `administrative`, `corporate`, `model`
* `sampleSize` — number of workers/firms/respondents (boosts aggregation weight, log-scaled)

**3e. Direction (for overlays only)** — Classify the directional signal relative to the graph's metric:
* **up** — suggests the graph's metric will be higher than current consensus (for displacement: more displacement; for wages: higher wages; for adoption: more adoption)
* **down** — suggests the graph's metric will be lower (for displacement: less displacement; for wages: lower wages)
* **neutral** — informational without clear directional implication

On **displacement charts**, "up" means more displacement (bad for workers) and is colored red. Evidence of job losses, increased automation, hiring freezes → **up**. Evidence of job growth, no displacement found, resilience → **down**.

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

**Publisher** — Use the actual publishing institution or journal (e.g., "Scandinavian Journal of Work, Environment & Health", "NBER", "Brookings"), never a URL host like "doi.org", "arxiv.org", or "ssrn.com". If the journal isn't obvious from the landing page, resolve the DOI or check the paper's front matter.

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
     "evidenceTier": [tier],
     "dataType": "observed|projected",
     "metricType": "[survey|projection|administrative|corporate|model]",
     "sampleSize": [n_if_known],
     "isProxy": [true_only_for_proxy_points],
     "proxyContext": "[conversion rationale — proxy points only]"
   }
   ```
   Omit `sampleSize`, `isProxy`, and `proxyContext` when not applicable; never omit `dataType`.
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

3. **Sync the display constant**: Update `SOURCE_COUNT` in `src/lib/constants.ts` to match the new `totalSources`. This constant feeds the root metadata, the chatbot system prompt, and several page descriptions — if it drifts, the site contradicts its own registry.

### Step 9: Update Timestamps

After all file changes are applied:

1. **Set** the `lastUpdated` field in `src/data/confirmed-sources.json` to today's date (`YYYY-MM-DD`).
2. **Set** `src/data/last-updated.json` to `{ "lastUpdated": "YYYY-MM-DD" }` — this is what the site hero component reads.

### Step 9.5: Post-Write Validation

Run this after every ingestion that touched prediction files:

```bash
node -e '
const fs=require("fs"),path=require("path");
const dir="src/data/predictions";
let ok=true;
for(const cat of fs.readdirSync(dir)){
  const p=path.join(dir,cat); if(!fs.statSync(p).isDirectory()||cat==="_archived")continue;
  for(const f of fs.readdirSync(p)){
    if(!f.endsWith(".json"))continue;
    const j=JSON.parse(fs.readFileSync(path.join(p,f)));   // throws on malformed JSON
    const h=j.history||[];
    for(let i=1;i<h.length;i++) if(h[i].date<h[i-1].date){ok=false;console.log(`UNSORTED: ${f} at ${h[i].date}`);}
    for(const d of h){
      if(!d.dataType)console.log(`WARN no dataType: ${f} ${d.date}`);
      if(Math.abs(d.value)<1 && String(j.unit).includes("%") && !d.isProxy)
        console.log(`SUSPECT sub-1% value (index score?): ${f} ${d.date} value=${d.value}`);
    }
  }
}
console.log(ok?"VALIDATION PASSED":"VALIDATION FAILED");
'
```

Investigate every `SUSPECT`/`UNSORTED`/`WARN` line that involves an entry you just added. Then confirm the headline didn't move unexpectedly: report the graph's `currentValue` (or latest point on `"latest"` graphs) before vs. after.

**Hero stats are computed, not hardcoded.** `getHeroStats()` in `src/lib/data-loader.ts` derives the homepage triad from `overall-us-displacement` at build time — no manual update needed. If you changed that file, state the new computed weighted average and latest observed value in your completion summary so the user knows what the hero will show.

### Step F: Featured Reads (mode = `featured` or `both`)

When the user wants the article on the homepage "Important Reads This Week" strip, follow this exactly. The strip is a hardcoded array of **exactly 5** entries in `src/components/FeaturedReads.tsx`. The grid is `lg:grid-cols-5` — adding a 6th breaks the layout.

**F.1 — Draft the entry.** The `Article` interface is `{ author, title, summary, date, url, internal? }`. Constraints:

* `author` — `"Person Name (Publisher)"` or `"Publisher"` if no byline. Match the existing pattern (e.g., `"Ezra Klein (NYT)"`, `"Yale Budget Lab"`).
* `title` — exact source title, no editorializing.
* `summary` — 2–4 dense sentences, ~80–120 words. Lead with the most concrete numbers from the source. Use em-dashes for clauses, not commas. Match the register of existing entries — terse, evidence-first, no hedging.
* `date` — short form like `"May 3"` or `"Apr 21"` (NOT YYYY-MM-DD — this matches the existing display format).
* `url` — canonical URL.
* `internal` — omit unless the link is to a jobsdata.ai internal page.

**F.2 — Apply the rotation.** Per `CLAUDE.md`:

1. Insert the new article at **position 0** (leftmost / index 0).
2. Shift all existing articles one position right.
3. Remove the **last** article (rightmost / oldest by editorial recency, NOT necessarily oldest by `date`). The dropped article remains in `src/data/reading-list.json`.
4. Verify the array still has **exactly 5 entries** after the edit.

**F.3 — Add to `reading-list.json`.** Append a corresponding entry to `src/data/reading-list.json` at the **top** of the `articles` array (newest first). The schema differs from FeaturedReads — it uses `{ title, author, publisher, date, url, takeaway, weekFeatured, tier }`:

* `date` and `weekFeatured` use `YYYY-MM-DD` (not the short form used in FeaturedReads).
* `takeaway` should be longer/denser than the FeaturedReads `summary` — full sentences, more evidence detail. They are written for different surfaces; do not copy one into the other.
* `tier` follows the evidence-tier rubric in Step 4.

**F.4 — Validate.** Read the file back. Confirm:
* `FeaturedReads.tsx` has exactly 5 entries (count `url:` occurrences in the array).
* `reading-list.json` parses as valid JSON.

**F.5 — Always update timestamps** (Step 9) when mode is `featured` or `both`, since the homepage strip is a user-visible change.

### Step 10: Confirm Completion

Summarize what was done:

* Mode used (`predictions` / `featured` / `both`)
* How many statistics were added (and how many were skipped) — predictions/both mode
* Which graph files were modified — predictions/both mode
* Which article was bumped from FeaturedReads — featured/both mode
* Remind the user to commit and deploy if working in a git repo

## Rules

These rules are non-negotiable. They protect data integrity and reader trust.

1. **Never invent data.** Only extract statistics that are explicitly stated in the source text. If a number isn't in the source, it doesn't get added.
2. **Always use exact quotes.** Every data point and overlay must trace back to a verbatim quote. No paraphrasing, no summarizing, no rewording. Copy-paste from the source.
3. **Ranges become midpoints.** When a source says "20–30%", the plotted value is 25 with confidenceLow: 20 and confidenceHigh: 30.
4. **Sign conventions differ by category.**
   - **Displacement graphs** use positive values for displacement (higher = worse). A "6% job decline" → value: 6. A "1.2% employment growth" (counter-displacement) → value: -1.2. The chart reads "% of roles displaced" so positive = more roles displaced.
   - **Wage graphs** use negative values for declines. A "10% wage decline" → value: -10.
   - **Adoption/exposure graphs** use positive values (higher = more adoption/exposure).
5. **Default to overlay when uncertain.** If you're not sure whether a stat's unit matches the graph's unit, classify it as an overlay rather than a data_point. Overlays are low-risk; bad data points distort the chart.
6. **Default to higher tier number when uncertain.** A Tier 3 source misclassified as Tier 2 erodes trust. The reverse is merely conservative.
7. **One source entry per prediction file.** If a source contributes multiple statistics to the same graph, add the source once to `sources` but add each statistic as a separate `history` or `overlay` entry.
8. **Validate JSON after every edit.** A malformed JSON file will break the site. Read back the file after writing to confirm it parses.
9. **Never write files without user approval.** The extraction report (Step 5) and per-statistic confirmation (Step 6) must happen before any file is modified.
10. **Preserve existing data.** When editing a file, never remove or modify existing entries. Only append new entries to the relevant arrays.

## Common Mapping Pitfalls

These are easy mistakes to avoid:

* **"Exposed to AI" ≠ "displaced by AI."** A stat like "60% of jobs are exposed to AI" maps to `workforce-ai-exposure`, not `overall-us-displacement`. Exposure means the job involves tasks AI can affect; displacement means the job is eliminated.
* **Exposure index scores ≠ percentages.** "Mean LLM exposure of 0.386" is a score on a 0–1 index, not "0.386% of jobs" and not "38.6% of jobs." Cautionary tale: a Canadian study's 0.386 index score was once plotted on `workforce-ai-exposure` (a `"latest"` graph), making the site headline read "0.4% of US jobs exposed." Index scores are always overlays.
* **Global stats ≠ US stats.** "300 million jobs globally" does not map to a US-specific graph without conversion. Use overlay if the geographic scope doesn't match.
* **"Tasks automatable" ≠ "jobs displaced."** A finding that "30% of tasks within an occupation can be automated" is about task automation, not job elimination. Many jobs will be restructured rather than eliminated.
* **Productivity gains are positive.** A "7% GDP boost" has direction: up and a positive value — it's a gain, not a loss.
* **Adoption rates are adoption rates.** "75% of knowledge workers use AI tools" maps to `genai-work-adoption`, not to any displacement graph.
