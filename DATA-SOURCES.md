# Data Sources

*Sources updated: February 27, 2026*

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

### OECD (Organisation for Economic Co-operation and Development)

- **URL:** https://www.oecd.org/en/topics/sub-issues/ai-and-work.html
- **Tier:** 1
- **Auth:** None (public reports and datasets)
- **Used for:** Cross-country labor market analysis, AI skills demand research, and employment projections. Key publications include the annual *Employment Outlook*, *Skills Outlook*, and targeted reports on AI's changing demand for skills. The OECD's AI Policy Observatory (oecd.ai) tracks AI adoption and workforce policy across 38 member countries.

### ILO (International Labour Organization)

- **URL:** https://www.ilo.org/topics-and-sectors/artificial-intelligence
- **Tier:** 1
- **Auth:** None (public reports)
- **Used for:** Global estimates of occupational exposure to generative AI, gender disparity analysis, and developing-country impacts. The ILO–NASK Global Index of Occupational Exposure provides granular 6-digit occupation-level automation and augmentation scores covering nearly 30,000 tasks. Key finding: 1 in 4 workers globally are in an occupation with GenAI exposure, with significant gender gaps (4.7% female vs. 2.4% male in highest-exposure category).

### McKinsey Global Institute

- **URL:** https://www.mckinsey.com/mgi/overview
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Estimates of technical automation potential, workforce transition modeling, and AI adoption maturity. Their November 2025 analysis found 57% of US work hours could be automated with existing technologies, with up to 40% of jobs in highly automatable roles. McKinsey frames impact in terms of task-level automation potential rather than binary job loss, and emphasizes workflow redesign over simple labor substitution.

### Stanford HAI (Human-Centered AI Institute)

- **URL:** https://hai.stanford.edu/ai-index
- **Tier:** 1–2
- **Auth:** None (public reports)
- **Used for:** The annual *AI Index Report* provides comprehensive data on AI's economic impact, business adoption trends, skills demand, and investment flows. Chapter 4 (Economy) tracks employer demand for AI skills, productivity research, and adoption rates. The 2025 edition found 78% of organizations using AI (up from 55% in 2023) and confirmed AI narrows skill gaps across the workforce.

### RAND Corporation

- **URL:** https://www.rand.org/topics/artificial-intelligence.html
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Macroeconomic modeling of AI-driven labor displacement, fiscal policy implications, and sector-specific workforce analysis. Notable 2025 publications include research on federal revenue impacts of labor-replacing AI, cascading effects of AI adoption across sectors, and policy frameworks using automatic stabilizers to mitigate workforce disruption.

### Georgetown CSET (Center for Security and Emerging Technology)

- **URL:** https://cset.georgetown.edu/research-topic/workforce/
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Data-driven analysis of the US AI workforce pipeline, skills demand tracking via the PATHWISE project, and assessment of federal AI education and training executive orders. CSET provides nonpartisan analysis at the intersection of national security and emerging technology workforce needs.

### Economic Policy Institute (EPI)

- **URL:** https://www.epi.org/
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Worker-centered analysis of AI's labor market effects, wage inequality research, and institutional power dynamics. EPI's key contribution is framing AI's impact through the lens of employer-worker power imbalances rather than treating technology as an autonomous force, arguing that policy and institutional environments — not AI itself — are the decisive factors shaping wage outcomes.

### Oxford Martin Programme on the Future of Work

- **URL:** https://www.oxfordmartin.ox.ac.uk/future-of-work
- **Tier:** 1–2
- **Auth:** None (public working papers)
- **Used for:** The original Frey & Osborne (2013) "47% of jobs at risk" study that launched the modern AI-employment research field. Their 2024 reappraisal with generative AI updated these estimates. Frey's recent work on declining new job creation rates (8.2% in the 1980s → 0.5% in the 2000s) is particularly relevant to understanding whether new AI-enabled roles will absorb displaced workers.

### CEPR (Centre for Economic Policy Research)

- **URL:** https://cepr.org/
- **Tier:** 1–2
- **Auth:** None (VoxEU columns are public)
- **Used for:** European-focused economic research on AI and labor, including analyses suggesting AI may shrink rather than widen earnings inequality by displacing non-routine tasks predominantly performed by high-skill workers.

### AEI (American Enterprise Institute)

- **URL:** https://www.aei.org/
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Free-market perspective on AI labor impacts, including provocative analyses like "AI Will Collapse Wages" (Sept 2025) arguing wages will decline sharply and youth unemployment will soar. AEI co-convened the *Workforce Futures Initiative* with Brookings and Harvard Kennedy School, producing Acemoglu's cross-institutional work on automation and income inequality.

### Center for American Progress (CAP)

- **URL:** https://www.americanprogress.org/
- **Tier:** 2
- **Auth:** None (public reports)
- **Used for:** Worker-centered policy recommendations on AI governance, algorithmic management, and workforce training. CAP emphasizes rebalancing worker bargaining power, regulating automated decision-making, and strengthening social safety nets as preconditions for equitable AI adoption.

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

We monitor new publications from 22 leading researchers in AI and labor economics via their OpenAlex author profiles:

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
| Simon Johnson | MIT Sloan School of Management | Pro-worker AI, technology and prosperity |
| John Horton | MIT Sloan School of Management | Online labor markets, AI task automation |
| Menaka Hampole | Yale School of Management | AI task-level exposure, labor demand measurement |
| Dimitris Papanikolaou | Northwestern Kellogg | Technology and labor, AI exposure indices |

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
| [Acemoglu, Autor & Johnson, NBER 2026](https://www.nber.org/papers/w34854) | Pro-worker AI framework: 5 categories of tech change; only new-task-creating AI is unambiguously pro-worker | Think tank review |
| [Hampole et al., NBER 2025](https://www.nber.org/papers/w33509) | 1 SD increase in AI task exposure → ~14% decline in within-firm employment share of affected occupations | Think tank review |
| [Demirer et al., NBER 2026](https://www.nber.org/papers/w34859) | Theory of AI automation via task chaining; redefines how work decomposes under AI | Think tank review |
| [McKinsey Global Institute, Nov 2025](https://www.mckinsey.com/mgi/our-research/a-new-future-of-work-the-race-to-deploy-ai-and-raise-skills-in-europe-and-beyond) | 57% of US work hours automatable with current tech; 40% of jobs in highly automatable roles; 30% of hours automated by 2030 (midpoint scenario) | Think tank review |
| [ILO–NASK Global Index, 2025](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure) | 1 in 4 workers globally in GenAI-exposed occupations; gender gap: 4.7% female vs. 2.4% male in highest exposure | Think tank review |
| [OECD, Sept 2025](https://www.oecd.org/en/publications/artificial-intelligence-and-the-changing-demand-for-skills-in-the-labour-market_88684e36-en.html) | AI shifts skill demand toward management and business skills in non-specialist AI jobs; routine cognitive skills see significant drops | Think tank review |
| [Stanford HAI AI Index, 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report) | 78% of organizations using AI (up from 55%); AI narrows workforce skill gaps; AI skill demand rose from ~1M to ~7M workers (2023–2025) | Think tank review |
| [MIT Project Iceberg, 2025](https://mitsloan.mit.edu/ideas-made-to-matter/how-artificial-intelligence-impacts-us-labor-market) | 11.7% of wage value ($1.2T) in roles where AI can perform meaningful portions of the skill mix; 16% of classified labor tasks technically automatable | Think tank review |
| [RAND, Aug 2025](https://www.rand.org/pubs/perspectives/PEA3888-3.html) | Dual macro effects: enhanced productivity gains vs. substantial displacement in high-automation sectors; recommends automatic stabilizers for workforce disruption | Think tank review |
| [RAND, Nov 2025](https://www.rand.org/pubs/working_papers/WRA4443-1.html) | Labor-replacing AI could disrupt federal tax base; explores policy responses to shrinking labor force and potential AI-induced deflation | Think tank review |
| [EPI, 2025](https://www.epi.org/publication/ai-unbalanced-labor-markets/) | AI not a direct threat to wages/employment; employer-worker power imbalance is the decisive factor; productivity slowdown suggests limited tech impact | Think tank review |
| [Brookings, Feb 2026](https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/) | AI exposure measures miss non-technological factors (demographics, geography, industry concentration) that determine actual welfare costs of displacement | Think tank review |
| [Brookings BPEA, Sept 2025](https://www.brookings.edu/articles/technology-and-labor-markets-past-present-and-future/) | Historical adaptation model: AI will shift demand away from occupations previously helped by tech progress | Think tank review |
| [Brookings/Yale, Oct 2025](https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs) | Little evidence AI has fundamentally transformed the workforce; all three exposure groups stayed roughly constant 2022–2025 | Think tank review |
| [IMF, Apr 2025](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729) | AI could reduce wage inequality by displacing high-income tasks, but complementarity and capital returns may offset | Think tank review |
| [Frey & Osborne Reappraisal, 2024](https://oms-www.files.svdcdn.com/production/downloads/academic/2023-FoW-Working-Paper-Generative-AI-and-the-Future-of-Work-A-Reappraisal-combined.pdf) | GenAI expanded automation scope but also lowers barriers for low-skill workers; new job creation rates declining (8.2% in 1980s → 0.5% in 2000s) | Think tank review |
| [Brookings, Oct 2025](https://www.brookings.edu/articles/the-geography-of-generative-ais-workforce-impacts-will-likely-differ-from-those-of-previous-technologies/) | 30%+ of workers could see 50%+ of tasks affected; high-paying white-collar metro areas most exposed — opposite of previous automation waves | Think tank review |
| [Brookings, Jan 2026](https://www.brookings.edu/articles/counting-ai-a-blueprint-to-integrate-ai-investment-and-use-data-into-us-national-statistics/) | 18% of firms using AI as of Dec 2025; 26% of workers using AI daily/frequently; DOL planning AI Workforce Research Hub | Think tank review |
| [IMF, Jan 2026](https://www.imf.org/en/blogs/articles/2026/01/14/new-skills-and-ai-are-reshaping-the-future-of-work) | 40% of global jobs exposed; employment 3.6% lower after 5 years in high-AI-demand regions; entry-level hiring particularly affected | Think tank review |
| [OECD Employment Outlook, 2025](https://digital-skills-jobs.europa.eu/en/latest/news/oecd-employment-outlook-2025-can-we-get-through-demographic-crunch) | 27% of OECD jobs at high automation risk; AI increases demand for digital, business & management skills while diminishing routine cognitive skills | Think tank review |

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
