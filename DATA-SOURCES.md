# Data Sources

This document lists every external data source that powers this site — where it comes from, how we access it, and what it's used for. Our goal is full transparency about the evidence behind every chart, prediction, and headline you see here.

We classify sources into **evidence tiers**:

| Tier | Meaning | Examples |
|------|---------|---------|
| 1 | Top-tier empirical research, regulatory filings | NBER working papers, SEC filings, IZA Discussion Papers |
| 2 | Peer-reviewed academic work, reputable data providers | Scopus-indexed journals, OpenAlex, Adzuna job data |
| 3 | News reporting, pre-publication research | Google News, arXiv preprints |
| 4 | Forecasts and prediction markets | Metaculus, Polymarket, Kalshi |

---

## Academic & Research Sources

### Scopus (Elsevier)

- **URL:** https://api.elsevier.com/content/search/scopus
- **Tier:** 2
- **Auth:** API key ([register at dev.elsevier.com](https://dev.elsevier.com/))
- **Used for:** Discovering peer-reviewed academic papers on AI and labor markets. We search for combinations of terms like "artificial intelligence" + "labor market", "generative AI" + "employment", and "large language model" + "job displacement" (post-2023 literature).

### CORE (Open Access Research)

- **URL:** https://api.core.ac.uk/v3
- **Tier:** 2
- **Auth:** API key ([register at core.ac.uk](https://core.ac.uk/services/api))
- **Used for:** Searching full-text open-access academic papers on AI and labor. Complements Scopus by surfacing papers that may not be behind paywalls.

### arXiv (Preprint Repository)

- **URL:** https://export.arxiv.org/api/query
- **Tier:** 2–3
- **Auth:** None (public API)
- **Used for:** Discovering preprints on AI-labor topics before they go through peer review. Useful for catching the latest research early, though findings are not yet peer-reviewed.

### Semantic Scholar

- **URL:** https://api.semanticscholar.org/graph/v1/paper/search
- **Tier:** 2
- **Auth:** None (public API)
- **Used for:** AI-powered academic paper search with automatic relevance ranking. Searches for terms like "artificial intelligence labor market displacement", "generative AI jobs wages", and "AI wage inequality automation".

### OpenAlex (Open Academic Index)

- **URL:** https://api.openalex.org
- **Tier:** 2
- **Auth:** None (uses polite-pool with email)
- **Used for:** Broad scholarly search using concept IDs, institutional filtering, and author tracking. Acts as the backbone for our IMF and IZA data feeds and for monitoring 18 tracked researchers (see below).

### NBER (National Bureau of Economic Research)

- **URLs:**
  - https://www.nber.org/rss/ls.xml (Labor Studies)
  - https://www.nber.org/rss/pr.xml (Productivity, Innovation & Entrepreneurship)
- **Tier:** 1
- **Auth:** None (public RSS)
- **Used for:** Discovering NBER working papers on labor economics, automation, and productivity — some of the highest-quality economics research available. Papers are filtered for AI-relevance using keyword matching.

### Brookings Institution

- **URLs:**
  - https://www.brookings.edu/topic/labor-markets/feed/
  - https://www.brookings.edu/topic/technology-innovation/feed/
  - https://www.brookings.edu/topic/artificial-intelligence/feed/
- **Tier:** 2
- **Auth:** None (public RSS)
- **Used for:** Policy research and analysis on AI, labor markets, and technology from one of the leading US think tanks.

### IMF (International Monetary Fund)

- **Accessed via:** OpenAlex (Institution ID: I107986439)
- **Tier:** 2
- **Auth:** None
- **Used for:** IMF working papers and staff discussion notes on AI and global labor markets.

### IZA (Institute of Labor Economics)

- **Accessed via:** OpenAlex (Source ID: S4306402567)
- **Tier:** 1
- **Auth:** None
- **Used for:** IZA Discussion Papers on labor economics and AI — one of the world's largest networks of labor economists.

---

## Job Market & Employment Data

### Adzuna (Real-Time Job Postings)

- **URL:** https://api.adzuna.com/v1/api/jobs/us/search/1
- **Tier:** 2
- **Auth:** App ID + API key ([register at developer.adzuna.com](https://developer.adzuna.com/))
- **Used for:** Live job posting counts and salary data for AI-related positions. We track categories including "artificial intelligence", "customer service chatbot", "data entry", "software engineer AI", and "prompt engineer" to monitor real-time labor demand shifts.

### Indeed Hiring Lab

- **URL:** https://www.hiringlab.org/
- **Tier:** 2
- **Auth:** None (curated data points)
- **Used for:** Year-over-year trend data on job postings. Key data points include AI job posting growth rates, customer service rep posting declines, and prompt engineering trends.

### Lightcast (Labor Market Analytics)

- **URL:** https://lightcast.io/resources
- **Tier:** 2
- **Auth:** None (curated data points)
- **Used for:** Occupational-level trend data. Notably used for tracking declines in data entry and admin job postings.

### LinkedIn Economic Graph

- **URL:** https://economicgraph.linkedin.com/
- **Tier:** 2
- **Auth:** None (curated data points)
- **Used for:** AI skills premium data (e.g., AI/ML roles commanding ~28% higher salaries) and job posting growth trends for AI-related positions.

---

## Corporate Filings

### SEC EDGAR (Full-Text Search)

- **URL:** https://efts.sec.gov/LATEST/search-index
- **Tier:** 1
- **Auth:** None (public API, rate limit: 10 req/sec)
- **Used for:** Searching 10-K, 10-Q, and 8-K filings for corporate disclosures about AI workforce changes. We search for phrases like "artificial intelligence" + "workforce reduction" and "generative AI" + "cost savings" + "employees" in filings from 2023 onward. This is the most concrete evidence of how companies are actually acting on AI.

---

## Prediction Markets & Forecasting

### Metaculus

- **URL:** https://www.metaculus.com/api2/questions/{id}/
- **Tier:** 4
- **Auth:** None (public API)
- **Used for:** Community predictions on AI labor market questions. We pull live community forecasts and prediction history to enrich our curated predictions with crowd wisdom.

### Polymarket

- **URL:** https://polymarket.com (deep links to specific markets)
- **Tier:** 4
- **Auth:** None (public links)
- **Used for:** Real-money prediction market odds on AI-related labor outcomes. Linked from individual prediction detail pages for cross-referencing.

### Kalshi

- **URL:** https://kalshi.com (deep links to specific markets)
- **Tier:** 4
- **Auth:** None (public links)
- **Used for:** Regulated real-money prediction market odds on specific labor market outcomes. Linked from individual prediction detail pages.

---

## News & Real-Time Signals

### Google News (RSS)

- **URLs:**
  - `https://news.google.com/rss/search?q=AI+jobs+when:7d`
  - `https://news.google.com/rss/search?q=AI+layoffs+when:7d`
  - `https://news.google.com/rss/search?q=AI+hiring+workforce+when:7d`
  - `https://news.google.com/rss/search?q=artificial+intelligence+employment+when:7d`
- **Tier:** 3
- **Auth:** None (public RSS)
- **Used for:** The news ticker at the top of the site. Fetches headlines from the last 7 days related to AI jobs, layoffs, and hiring. Headlines are automatically classified by sentiment (positive / negative / neutral). Refreshed every hour.

---

## Tracked Researchers

We monitor new publications from 18 leading researchers in AI and labor economics via their OpenAlex author profiles:

| Researcher | Affiliation | Focus |
|------------|-------------|-------|
| Erik Brynjolfsson | Stanford Digital Economy Lab | AI & productivity, digital economy |
| Daron Acemoglu | MIT | AI economics, automation, inequality |
| David Autor | MIT | Labor economics, task framework, polarization |
| Tyna Eloundou | OpenAI | AI exposure, GPT labor impacts |
| Daniel Rock | Wharton | AI adoption, productivity measurement |
| Shakked Noy | MIT | AI productivity experiments |
| Whitney Zhang | MIT | AI productivity experiments |
| R. Maria del Rio-Chanona | UCL / ILO | AI & jobs, labor market networks |
| Andrea Filippetti | National Research Council, Italy | Innovation, regional economics |
| Anna Salomons | Utrecht University | Automation, labor markets, skills |
| Pascual Restrepo | Boston University | Automation, robots, demographics |
| Carl Benedikt Frey | Oxford Martin School | Future of employment, automation risk |
| Michael Osborne | University of Oxford | Machine learning, automation susceptibility |
| Ed Felten | Princeton University | AI exposure indices, technology policy |
| Manav Raj | Wharton | AI impact on work, generative AI |
| Lindsey Raymond | MIT | AI at work, productivity |
| Bharat Chandar | Stanford | AI displacement, labor economics |
| Molly Kinder | Brookings Institution | AI workforce transitions, essential workers |

---

## Key Studies Featured on the Site

These individual studies are prominently cited across the dashboard:

| Study | Finding | Where It Appears |
|-------|---------|------------------|
| [del Rio-Chanona et al., 2025](https://arxiv.org/abs/2509.15265) | 20–60% productivity gains in controlled experiments | Evidence summary |
| [Brynjolfsson et al., Stanford 2025](https://www.nber.org/papers/w33856) | ~20% headcount decline for early-career software developers | Evidence summary |
| [Anthropic Economic Index, 2026](https://www.anthropic.com/research/the-anthropic-economic-index) | 52% augmentation vs 45% automation in real AI usage | Evidence summary |
| [Chen et al., HBS 2025](https://www.hbs.edu/faculty/Pages/item.aspx?num=66491) | 17% fewer postings in highly automatable occupations | Evidence summary |
| [Ramp Economics Lab, 2026](https://ramp.com/blog/ai-spending-trends-2026) | 33:1 freelancer-to-AI cost substitution ratio | Evidence summary |
| [Yale Budget Lab, 2025](https://budgetlab.yale.edu/research/ai-labor-market-2025) | No macro employment effect yet | Evidence summary |
| [Noy & Zhang, Science 2023](https://www.science.org/doi/10.1126/science.adh2586) | 37% faster task completion with AI assistance | Funnel strip |
| [Brynjolfsson, Li, Raymond, QJE 2025](https://academic.oup.com/qje/article/140/2/889/7990658) | 15% average productivity increase (issues resolved/hour) | Funnel strip |
| [IMF, 2024](https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity) | 40% of global employment exposed to AI | Funnel strip |
| [WEF, 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/) | 92M roles displaced by 2030 (8% of jobs), net gain of 78M | Funnel strip |
| [HBS, 2025](https://www.hbs.edu/faculty/Pages/item.aspx?num=67045) | 13% job posting decline for structured/repetitive roles | Funnel strip |
| [World Bank, 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5504741) | 12% posting decline in high-AI-substitution occupations | Funnel strip |
| [Stanford / ADP, 2025](https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data/) | 6% employment decline for 22–25 year-olds in AI-exposed jobs | Funnel strip |
| [Stanford / World Bank, 2026](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5136877) | LLM adoption grew from 30% to 38% among US workers (2024–2025) | Funnel strip |
| [Goldman Sachs, 2025](https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce) | 6–7% projected displacement; no macro signal yet | Funnel strip |
| [Dallas Fed, 2026](https://www.dallasfed.org/research/economics/2026/0106) | 0.1% actual decline, younger workers only | Funnel strip |
| [Bick, Blandin & Deming, NBER 2024](https://www.nber.org/papers/w32966) | ~1.4% aggregate time savings across all US workers | Funnel strip |
| [Forrester, 2026](https://www.forrester.com/press-newsroom/forrester-impact-ai-jobs-forecast/) | 6% of US jobs lost to AI/automation by 2030 | Funnel strip |

---

## Internal Curated Data

We maintain JSON files with historical data points for each prediction tracked on the site. Each data point includes a date, value, confidence interval, source attribution, and evidence tier. These are stored in `src/data/predictions/` and cover:

- **Displacement** — Overall US displacement, total jobs lost, and sector-specific predictions (white-collar, tech, creative, education, healthcare admin, customer service)
- **Wages** — Median wage impact, geographic divergence, entry-level impact, high-skill premium, freelancer rate impact
- **Adoption** — AI adoption rate, generative AI work adoption
- **Exposure** — Workforce AI exposure
- **Signals** — Earnings call AI mentions

---

## How Data Flows Through the Site

1. **Research feed** (`/api/research`) — Aggregates papers from Scopus, CORE, arXiv, Semantic Scholar, OpenAlex, NBER, Brookings, IMF, and IZA. Deduplicates by DOI/title. Cached for 24 hours.
2. **Predictions** (`/api/predictions`) — Loads curated JSON predictions and enriches them with live Metaculus community forecasts. Cached for 1 hour.
3. **News ticker** (`/api/ticker`) — Pulls Google News RSS, classifies sentiment, deduplicates. Cached for 1 hour.
4. **Weekly digest** (`npm run digest`) — Scores and ranks the latest papers into a weekly summary file used on the site.

---

*Last updated: February 2026*
