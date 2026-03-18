# Literature Review: AI, Solo Entrepreneurs, and Business Formation

**Date:** 2026-03-18
**Purpose:** Evaluate whether sufficient evidence exists to build a prediction tile on AI-driven solo entrepreneurship / business formation.

---

## Executive Summary

There is a **strong and growing body of evidence** linking AI tools to changes in entrepreneurship and business formation patterns. The evidence spans government data (Census BFS, BLS), academic research (NBER, HBS, OECD), platform data (Stripe Atlas, Carta), and institutional analysis. The most promising prediction tile candidate would track **AI-related new business applications** or **solo/nonemployer business formation rates**, with sufficient Tier 1-2 data to build a credible time series.

**Verdict: Yes, there is enough evidence for a prediction tile.** The strongest candidate metric is one of:
1. "AI-Related New Business Applications (% of total)" — backed by Census BFS write-in data
2. "Solo-Founded Startup Share" — backed by Carta data showing rise from 17% (2017) to 38% (2024)
3. "Revenue Per Employee at AI-Native Startups" — backed by VC/Carta data showing 6x efficiency gains

---

## I. Government Data (Tier 1)

### Census Bureau — Business Formation Statistics (BFS)

**Source:** [Census BFS](https://www.census.gov/econ/bfs/index.html), monthly releases

- **5.48M** new business applications in 2023 (all-time record), **5.20M** in 2024, on pace for ~5.1M in 2025.
- Post-pandemic surge remains elevated vs. pre-2020 baseline (~3.5M/yr), though cooling from the 2023 peak.
- Feb 2026: 496,443 applications (seasonally adjusted), down 5.8% from January.
- **Key insight:** The surge is not AI-specific but AI-related applications are a growing share (see Dinlersoz below).

### Census Bureau — "Starting Up AI" Working Paper (CES-WP-24-09)

**Source:** Dinlersoz, Dogan, & Zolas (2024), [Census Bureau](https://www2.census.gov/ces/wp/2024/CES-WP-24-09.pdf)

- Using write-in data from business applications (2004-2023), identified AI-related business applications.
- AI business applications were **stable 2004-2011**, began rising in **2012**, accelerated from **2016**, with a **large discrete jump in 2023**.
- AI business applications have a **higher likelihood of becoming employer startups** compared to other applications.
- Resulting businesses exhibit **higher revenue and average wages** but **lower survival rates**.
- Geographic concentration: CA (19.8%), FL (9.4%), NY (8.3%), TX (7.5%).
- **Evidence tier: 1** (Census Bureau working paper with administrative data)

### Census Bureau — Nonemployer Statistics

**Source:** [Census NES](https://www.census.gov/programs-surveys/nonemployer-statistics.html), 2023 release (May 2025)

- **30.4M nonemployer businesses** in 2023, up 2.1% YoY.
- Nonemployers grew at **2.7% annually** (2012-2023) vs. 1.1% for employer businesses.
- Post-pandemic spike: +4.9% in 2021, +4.7% in 2022, moderating to +2.1% in 2023.
- Nonemployers now represent **~78% of all U.S. businesses**.
- These are the "solo" businesses — sole proprietors, self-employed, gig workers.
- **Evidence tier: 1** (Census Bureau official statistics)

### SBA Office of Advocacy — "AI in Business: Small Firms Closing In" (Sep 2025)

**Source:** [SBA Advocacy](https://advocacy.sba.gov/2025/09/24/ai-in-business-small-firms-closing-in/)

- Small business (<250 employees) AI use rate: **8.8%** (up from 6.3% six months prior).
- Large business AI use rate: ~11%.
- Small businesses are about **one year behind** large businesses in AI adoption trajectory.
- Small businesses more likely to use AI for **marketing** functions.
- **Evidence tier: 1** (Federal agency analysis of Census BTOS data)

### BLS — Self-Employment Data

- ~33M Americans (17.3% of workers) engaged in some form of self-employment (Census WP, 2019 baseline).
- Share of self-employed aged 65+ increased from 13.0% (2013) to 16.3% (2023).
- **Note:** BLS self-employment data does not yet cleanly separate AI-driven self-employment from other causes. This is a data gap.
- **Evidence tier: 1** (government statistics, but not AI-specific)

---

## II. Academic Research (Tier 1)

### Bao, Lou & Sun (2025) — "GenAI and STEM Entrepreneurship"

**Source:** [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=bao2025) | Already in confirmed-sources.json

- GenAI availability **increased STEM incorporated entrepreneurship rates**.
- AI tools **lower barriers** to new venture creation by enabling smaller founding teams.
- Technical professionals leveraging AI to **replace functions previously requiring additional hires**.
- Entrepreneurship may serve as a **positive labor market adjustment channel** for AI-affected workers.
- **Qualifier:** STEM entrepreneurship is a narrow segment; increased formation ≠ guaranteed survival.
- **Evidence tier: 1**

### Otis, Clarke, Delecourt, Holtz & Koning (2023) — "The Uneven Impact of Generative AI on Entrepreneurial Performance"

**Source:** [HBS Working Paper 24-042](https://www.hbs.edu/ris/Publication%20Files/24-042_05d87e28-7543-4644-b5a4-cba80e69c3e9.pdf) | Already in confirmed-sources.json

- No statistically significant **average** effect of GenAI on revenues or profits.
- **High-performing businesses** improved by ~15%.
- **Low-performing businesses** declined by ~8-10%.
- AI **amplifies existing performance disparities** — a Matthew effect.
- **Evidence tier: 1** (HBS working paper, but Kenyan sample — generalizability caveat)

### Fossen, McLemore & Sorgner (2024) — "Artificial Intelligence and Entrepreneurship"

**Source:** [IZA DP 17055](https://www.iza.org/publications/dp/17055/artificial-intelligence-and-entrepreneurship) / *Foundations and Trends in Entrepreneurship*, Vol. 20(8), pp. 781-904

- Comprehensive **124-page survey** of the entire AI-entrepreneurship literature.
- AI that *automates* jobs increases **necessity** entrepreneurship; AI that *transforms* jobs increases **opportunity** entrepreneurship.
- AI alters regional entrepreneurship ecosystems and potentially reduces the role of geography.
- EU AI regulation could shape the entrepreneurship landscape.
- **Evidence tier: 1** (peer-reviewed journal, 124-page literature survey)

### Cai & Gu (2024) — "AI as Co-founder: GenAI for Entrepreneurship"

**Source:** [arXiv:2512.06506](https://www.arxiv.org/pdf/2512.06506)

- Uses the **universe of newly registered firms in China** (12+ million firms, 2021-2024) combined with AI patent data.
- "One of the first pieces of systematic evidence on how technological breakthroughs, such as GenAI, facilitate firm entry."
- Firms formed after ChatGPT had **fewer shareholders and smaller founding teams**, consistent with AI substituting for labor at the startup stage.
- **Evidence tier: 1** (large-scale empirical data, not yet peer-reviewed)

### Obschonka et al. (2025) — "AI and Entrepreneurship: A Call for Research"

**Source:** [*Entrepreneurship Theory and Practice*](https://journals.sagepub.com/doi/10.1177/10422587241304676), SAGE

- AI tools reduce barriers to entry, creating new opportunities for aspiring entrepreneurs from diverse backgrounds.
- Could also exacerbate inequalities by concentrating resources in organizations capable of developing cutting-edge AI.
- **Evidence tier: 1** (peer-reviewed journal)

### Tian et al. (2025) — "The Impact of AI Technological Innovation on Global Entrepreneurial Activities"

**Source:** [*Socio-Economic Planning Sciences*](https://www.sciencedirect.com/science/article/abs/pii/S0038012125002307), ScienceDirect

- AI technological innovation significantly promotes entrepreneurial activities through two paths: **entrepreneurship education** and **AI investment**.
- Impact is particularly strong among **highly educated and young** entrepreneur groups.
- **Evidence tier: 1** (peer-reviewed journal)

### Review of Managerial Science — AI and Entrepreneurship Hybrid Review (Springer, 2025)

**Source:** [Springer Link](https://link.springer.com/article/10.1007/s11846-025-00839-4)

- Analysis of **345 peer-reviewed articles** on AI and entrepreneurship.
- AI can "significantly reduce the barriers to entry for start-ups, making entrepreneurship more accessible and inclusive."
- Mechanisms: improved decision-making, reduced costs, accelerated business model innovation cycles.
- **Evidence tier: 1** (peer-reviewed meta-review)

### Brynjolfsson, Korinek & Agrawal (2025) — "A Research Agenda for the Economics of Transformative AI"

**Source:** [NBER WP 34256](https://www.nber.org/papers/w34256)

- Framework paper covering AI's economic implications including labor markets, growth, entrepreneurship.
- Notes the connection between AI-driven productivity gains and new firm creation.
- **Evidence tier: 1** (NBER working paper)

### Dinlersoz, Dogan & Zolas (2024) — "Starting Up AI"

**Source:** [Census CES-WP-24-09](https://www2.census.gov/ces/wp/2024/CES-WP-24-09.pdf)

- Most rigorous study of AI-specific business formation using administrative data.
- AI startups show higher revenue, higher wages, but lower survival rates.
- Large discrete jump in AI business applications in 2023.
- **Evidence tier: 1** (Census working paper with comprehensive admin data)

### "Digital Co-Founders: Transforming Imagination into Viable Solo Business via Agentic AI" (Nov 2025)

**Source:** [arXiv:2511.09533](https://arxiv.org/html/2511.09533v1)

- Formal framework for AI-augmented solo business: imagination shaping → reality testing → reality scaling.
- Positions AI-augmented solo business as a theoretically distinct entrepreneurial context.
- Bridges effectuation and lean startup methods to one-person ventures with agentic AI.
- **Evidence tier: 1-2** (arXiv preprint, academic rigor but not peer-reviewed)

---

## III. Institutional / Think Tank Reports (Tier 2)

### OECD — "The Effects of Generative AI on Productivity, Innovation and Entrepreneurship" (June 2025)

**Source:** [OECD AI Papers No. 39](https://www.oecd.org/en/publications/the-effects-of-generative-ai-on-productivity-innovation-and-entrepreneurship_b21df222-en.html), Calvino, Reijerink & Samek

- Review of 80+ experimental studies.
- GenAI can **lower entry barriers** for businesses and **support early-stage growth**.
- Entrepreneurs in high-performing firms see **greater business gains** from GenAI.
- Lower-performing firms benefit less or may face setbacks.
- Less-creative users benefit more from AI idea generation; highly creative users see limited additional benefit.
- AI-generated ideas may be **more similar to one another** — gains in individual creativity at cost of collective novelty.
- Annual labor productivity growth from AI: **0.2 to 1.3 percentage points** across G7 (next decade).
- **Evidence tier: 2** (OECD institutional report)

### OECD — "Generative AI and the SME Workforce" (2024-2025)

**Source:** [OECD](https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en.html)

- Survey of 5,000+ SMEs across 7 countries.
- **31% of SMEs** now use generative AI.
- 65% of SME AI users report **increased employee performance**.
- 35% say it enabled them to **scale up**, 29% to **compete with larger companies**.
- **Evidence tier: 2**

### UNCTAD — "Artificial Intelligence Unleashed: Transforming the Entrepreneurial Landscape" (2025)

**Source:** [UNCTAD](https://unctad.org/system/files/official-document/diae2025d4_en.pdf)

- Comprehensive report on AI and entrepreneurship in developing countries.
- References multiple OECD, McKinsey, and World Bank sources.
- **Evidence tier: 2**

### McKinsey — "The State of AI in 2025"

**Source:** [McKinsey](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

- 88% of organizations regularly use AI in at least one function.
- 72% report using GenAI (up from 33% in 2024).
- However, **>80% of companies report no material contribution to earnings** yet.
- **Evidence tier: 2** (enterprise-focused, less about new firm creation)

---

## IV. Platform & Industry Data (Tier 2-3)

### Stripe Atlas — 2025 Year in Review

**Source:** [Stripe Blog](https://stripe.com/blog/stripe-atlas-startups-in-2025-year-in-review)

- Atlas company formations **up 41%** in 2025; now incorporates **25% of all Delaware corporations**.
- 23,000+ startups incorporated in 2025 (up from 13,000 in 2023).
- AI startups as share of Atlas formations: **15% (Jan 2023) → 33% (2024) → 42% (2025)**.
- AI share among LLCs (small/bootstrapped): **5% (2023) → 22% (2025)**.
- **20% of Atlas startups** charged first customer within 30 days (up from 8% in 2020).
- Startups reaching $100K revenue in first 6 months: **56% more than 2024**, getting there **11% faster**.
- 2025 cohort generated **39% more revenue** in first 6 months than 2024.
- Companies reaching $10M ARR within 3 months: **double** the 2024 count.
- Funded startups declining (2.2% fundraised within 3 months, down from 3.1%) — suggests more bootstrapped/solo ventures.
- Average time to first hire **increased 49% since 2019** — startups operating lean for longer.
- **Evidence tier: 2-3** (platform data, large sample but self-selected)

### Shopify — AI & Solo Merchants (2024-2025)

**Source:** [Shopify Blog](https://www.shopify.com/blog/expanding-your-ai-horizons-summer-edition-25), [Shopify News](https://www.shopify.com/news/shopify-open-ai-commerce)

- **5.6-5.8M** live Shopify stores worldwide (2025); ~6.9M total merchants.
- **97%** of surveyed SMB Shopify merchants planned to incorporate AI into operations (2024).
- AI Store Builder turns week-long store setup into a guided conversation — lowering barriers for solo entrepreneurs.
- Partnered with OpenAI for **agentic commerce** directly inside ChatGPT.
- **29%** of Shopify stores sell 1-9 products, highlighting prevalence of solo/niche DTC brands.
- BFCM 2025: $14.6B in merchant sales (+27%); 15,800 entrepreneurs made first-ever sale.
- **Evidence tier: 2-3** (platform data)

### Carta — Solo Founders Report & Startup Headcount Data (2024-2025)

**Source:** [Carta Solo Founders Report](https://carta.com/data/solo-founders-report/), [Carta Headcount Data](https://carta.com/data/startup-headcounts-2024/) (45,000+ startups)

- Solo founders now start **36.3%** of all new companies (H1 2025), up from 23.7% (2019) and **17% (2017)**.
- Three-founder teams dropped to **16%** (lowest in a decade).
- Average consumer startup at seed round: **<3.5 employees** (down from 6.4 in 2022).
- Series A teams average **16.8 employees** (down from 25.9 in 2021).
- Series B teams average **48.2** (down from 72.3 in 2022).
- Median time to first hire increased from **214 days (2019) to 284 days (2024)**.
- New monthly hires across startups fell **>50%** between Jan 2022 and Jan 2024.
- However, solo founders receive only **14.7% of total VC cash** despite representing 30% of startups.
- **Evidence tier: 2** (Carta platform data, large sample of 45K+ startups)

### AI-Native Startup Efficiency Metrics

**Sources:** Various (Pavilion, Crunchbase, individual company reports)

- AI-native startups achieve **$3.48M revenue per employee** (6x higher than other SaaS).
- Operate with **40% smaller teams**.
- Reach unicorn status **~1 year faster** than non-AI counterparts.
- Example: Lovable reached **$17M ARR with 15 employees** in 3 months post-launch.
- Best AI companies: **>$1M ARR per employee** (3x what was previously considered "great").
- **Bessemer's "AI Supernovas"**: top AI companies achieve **$1.13M ARR per FTE** (4-5x above typical SaaS benchmarks).
- Notable tiny-team successes: **Cursor** (~$2B ARR, <50 employees), **Midjourney** ($200M+ ARR, ~40 people, zero VC raised), **Bolt** ($40M ARR in 2 months, 15 people).
- AI startups reaching **$100M ARR with <100 employees** vs. 300-500 employees for 2010s SaaS champions.
- AI startups reach $5M annualized revenue in **24 months** vs. 37 months for SaaS in 2018 (Stripe data).
- **Evidence tier: 2-3** (industry analysis, Bessemer/Stripe/individual company data)

### Y Combinator Batch Data (2024-2025)

**Source:** [CNBC](https://www.cnbc.com/2025/03/15/y-combinator-startups-are-fastest-growing-in-fund-history-because-of-ai.html), [PitchBook](https://pitchbook.com/news/articles/y-combinator-is-going-all-in-on-ai-agents-making-up-nearly-50-of-latest-batch), various

- **88%** of YC S25 batch classified as AI-native (up from 15% two years prior).
- AI-focused startups: 871 (2024) → 1,140 (2025) = 53% of all new YC startups.
- Garry Tan (YC CEO): *"For about a quarter of current YC startups, 95% of the code was written by AI."*
- AI capabilities "recalibrating the incubator's preference for multi-founder teams" — strong solo founders now feasible.
- Winter 2025 batch grew **10% per week** in aggregate — fastest-growing and most profitable batch in YC history.
- Solo founders at YC specifically: only **9.5%** (YC still favors co-founders).
- However, broader ecosystem solo founding rate rising to **36-38%** per Carta.
- **Evidence tier: 2-3** (institutional data + journalism)

### VC Funding Trends

**Source:** [Crunchbase](https://news.crunchbase.com/ai/big-funding-trends-charts-eoy-2025/)

- AI captured **52.7% of total global VC deal value** in 2025 — first time >50%.
- **$202.3B** invested in AI sector in 2025, up **75% YoY** from $114B in 2024.
- AI drove **>70% of all VC activity** in Q1 2025 (EY).
- **Evidence tier: 2-3**

---

## V. Notable Claims & Predictions (Tier 3-4)

### Sam Altman — "One-Person Billion-Dollar Company"

**Source:** [TechCrunch](https://techcrunch.com/2025/02/01/ai-agents-could-birth-the-first-one-person-unicorn-but-at-what-societal-cost/), various

- Predicted in an interview with Alexis Ohanian that AI will enable a one-person billion-dollar company.
- Timeline: 2026-2028.
- **Dario Amodei** (Anthropic CEO) puts odds at **70-80%** this could happen **as early as 2026**.
- A dedicated tracking site exists: [1person1billion.ai](https://www.1person1billion.ai/race).
- Emerging near-examples: **Base44** (solo founder → 300K users, $3.5M ARR, sold to Wix for $80M in 6 months).
- **Evidence tier: 4** (prediction/commentary, no confirmed cases yet)

### Hui, Reshef & Zhou (2024) — Freelancer Impact (Counter-Evidence)

**Source:** [*Organization Science*](https://www.brookings.edu/articles/is-generative-ai-a-job-killer-evidence-from-the-freelance-market/), 35(6): 1977-89

- Writing freelancers: **-2% jobs, -5.2% earnings** post-ChatGPT.
- Image freelancers: **-3.7% jobs, -9.4% income** post-DALL-E/Midjourney.
- **High-skilled freelancers disproportionately affected** — top-rated saw larger drops than average.
- Important counter-evidence: AI doesn't just enable solopreneurs, it also **threatens existing solo workers**.
- **Evidence tier: 1** (peer-reviewed, *Organization Science*)

### CB Insights — AI Unicorn Efficiency (2024)

**Source:** CB Insights

- AI unicorns in 2024 averaged **~200 employees** and reached $1B valuation in **just 2 years**.
- Non-AI unicorns typically required **9 years** and nearly double the team size.
- **Evidence tier: 2** (industry research)

### Simply Business — "The Power of One: 2025 Solopreneur Report"

**Source:** [Simply Business](https://www.simplybusiness.com/resource/solopreneur-trend-report/)

- Survey of 1,000+ solopreneurs.
- 78% expect AI to change their operations.
- 68% believe AI will benefit their businesses.
- **Evidence tier: 3** (industry survey)

### Collective Research on Solopreneur Demographics

- 54.4% of solopreneurs are women.
- 62% of Gen Z plan to start a business someday.
- 20% of solopreneurs earn $100K-$300K annually without employees.
- 76% work remotely at least part-time.
- **Evidence tier: 3**

---

## VI. Key Data Gaps & Limitations

1. **No clean causal identification**: The post-pandemic business formation surge confounds AI's specific contribution. Disentangling AI-driven formation from pandemic-era self-employment shifts (stimulus, remote work, gig economy) is difficult.

2. **Survival rates**: AI business applications show **higher formation but lower survival**. A prediction tile on formation alone could be misleading without the survival counterpoint.

3. **Nonemployer ≠ "AI solo entrepreneur"**: The 30.4M nonemployer businesses include DoorDash drivers, Etsy sellers, and freelance consultants. Only a fraction are "AI-enabled solopreneurs" in the meaningful sense.

4. **Self-employment data lag**: BLS/Census self-employment data lags 1-2 years and doesn't separate AI-driven self-employment.

5. **Platform data selection bias**: Stripe Atlas and Carta data skew toward tech-savvy, US-incorporated startups. Not representative of all business formation.

6. **Revenue per employee**: Impressive but partially artifact of AI companies being capital-intensive (compute costs replace labor costs). High revenue/employee may coexist with low profit/employee.

7. **The "one-person unicorn" claim**: Remains speculative. No examples exist yet. The tracking site (1person1billion.ai) has zero confirmed cases.

---

## VII. Prediction Tile Assessment

### Candidate Metrics

| Metric | Unit | Data Quality | Time Series | Feasibility |
|--------|------|-------------|-------------|-------------|
| AI-related new business applications (% of total) | % of applications | Tier 1 (Census BFS) | 2004-2023 annual | HIGH |
| Solo-founded startup share | % of startups | Tier 2-3 (Carta) | 2017-2024 annual | MEDIUM |
| Nonemployer business count | millions | Tier 1 (Census NES) | 2012-2023 annual | MEDIUM (not AI-specific) |
| Revenue per employee at AI startups | $M/employee | Tier 3 (industry) | 2022-2025 | LOW (sparse, non-standardized) |
| AI startup share of VC funding | % of VC deals | Tier 2-3 (Crunchbase) | 2020-2025 | MEDIUM |
| SME GenAI adoption rate | % of SMEs | Tier 2 (OECD) | 2024-2025 | LOW (only 2 data points) |

### Recommended Tile: "AI-Driven New Business Formation"

**Slug:** `ai-business-formation`
**Title:** "AI-Related New Business Applications by 2028"
**Unit:** % of total new business applications that are AI-related
**Category:** New category "Entrepreneurship" or add to "Adoption"

**Why this metric:**
- Built on **Tier 1 Census BFS data** with a time series back to 2004
- The Dinlersoz, Dogan & Zolas (2024) paper provides rigorous methodology for identifying AI applications from write-in data
- Shows a clear trend with a dramatic inflection point (2023 jump)
- Complements existing displacement/adoption tiles by showing the "creation" side of creative destruction
- Can incorporate Stripe Atlas data as Tier 2-3 corroboration
- Can layer in Bao/Lou/Sun and Otis findings as overlays

**Alternative tile:** "Solo-Founded Startup Share by 2028" (% of new startups with solo founder)
- Less data depth but captures the more culturally resonant "solopreneur + AI" narrative
- Carta data (2017-2024) provides a clean trend line
- Could add Census nonemployer data as corroboration

### Sources Available for Immediate Ingestion

| Source | Tier | Key Stat | Status |
|--------|------|----------|--------|
| Dinlersoz, Dogan & Zolas (2024) | 1 | AI business apps surge, esp. 2023 | NOT INGESTED |
| Census BFS monthly data | 1 | 5.2M applications (2024) | NOT INGESTED |
| Census NES (2023) | 1 | 30.4M nonemployer businesses | NOT INGESTED |
| SBA "AI in Business" (2025) | 1 | 8.8% small business AI adoption | NOT INGESTED |
| OECD AI Paper No. 39 (2025) | 2 | 80+ studies, entry barrier reduction | NOT INGESTED |
| Stripe Atlas Year in Review (2025) | 2-3 | 42% AI share, 41% formation growth | NOT INGESTED |
| Carta Solo Founders Report (2025) | 2 | 36.3% solo founders (up from 17%) | NOT INGESTED |
| Fossen, McLemore & Sorgner (2024) | 1 | 124-page AI-entrepreneurship survey | NOT INGESTED |
| Cai & Gu (2024) | 1 | 12M Chinese firms, smaller teams post-ChatGPT | NOT INGESTED |
| Hui, Reshef & Zhou (2024) | 1 | Freelancer income declines (counter-evidence) | NOT INGESTED |
| CB Insights AI unicorn data (2024) | 2 | ~200 employees to $1B in 2 years | NOT INGESTED |
| Bao, Lou & Sun (2025) | 1 | STEM entrepreneurship increase | ALREADY IN SYSTEM |
| Otis et al. (2023) | 1 | +15%/-10% heterogeneous effects | ALREADY IN SYSTEM |

---

## VIII. Conclusion

The evidence base is **sufficient for a prediction tile**, with the strongest backing for an "AI-related business formation" metric using Census BFS data. The narrative arc is compelling: AI tools are lowering barriers to entry, enabling smaller founding teams, accelerating time-to-revenue, and driving a measurable increase in AI-specific business applications. The data has both historical depth (2004-present) and institutional credibility (Census Bureau).

Key caution: this metric measures business *formation*, not *survival* or *success*. The Dinlersoz data shows AI startups have lower survival rates, and the Otis data shows AI amplifies rather than equalizes performance. A responsible tile would need to convey both the formation surge and the survival caveat.

**Next steps:**
1. Decide on metric (AI business applications % vs. solo founder share vs. something else)
2. Ingest the Dinlersoz (2024) Census working paper as anchor source
3. Build the prediction JSON with historical time series
4. Determine projection methodology and confidence intervals
5. Add overlays from supporting sources (Stripe, Carta, OECD, Bao/Lou/Sun)
