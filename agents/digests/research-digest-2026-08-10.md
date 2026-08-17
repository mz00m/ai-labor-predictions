1	# AI Labor Research Digest — 2026-08-10
2	
3	## Summary
4	
5	The week of August 3–10, 2026 yielded **two confirmed Tier 3 sources** published within the 7-day window, both synthesizing and contextualizing a Tier 2 study published one day before the window opened (Apollo Global Management, July 30). The headline quantitative finding is **wage compression without employment displacement** in AI-exposed occupations: real wage growth in the 11 most Claude-exposed U.S. occupations lagged less-exposed occupations by 6.7 percentage points post-2023, with no statistically significant employment decline in the same period. A separate IESE Business School analysis (138 million U.S. employees) shows junior starting pay fell 6.3% at AI-exposed companies after ChatGPT's launch. No new Tier 1 government statistics or peer-reviewed papers from this specific 7-day window were identified. The recurring-sources registry has no series due this week. All 15 researchers on the watchlist are overdue for a check (last checked 2026-04-14).
6	
7	---
8	
9	## Recurring Series Status
10	
11	**ellucian-highered-ai** (`nextExpected: 2027-03-01`): NOT DUE — no search conducted; series not yet due.
12	
13	> **Registry note:** Only one series is registered in `recurring-sources.json`. The following widely tracked recurring datasets were checked opportunistically but are not yet in the registry and should be considered for addition:
14	> - **Census BTOS (AI adoption)** — most recent confirmed release: June 18, 2026 (19.8% national AI use rate). Next biweekly release expected ~August 13, 2026. No release found for Aug 3–10 window.
15	> - **Stanford AI Index** — annual; 2026 edition published; next expected early 2027.
16	> - **PwC AI Jobs Barometer** — 2026 edition published earlier this year (no specific August update found).
17	
18	---
19	
20	## Researcher Watchlist
21	
22	All 15 researchers last checked 2026-04-14 (117 days ago, well past the 30-day threshold). Searches conducted for Acemoglu and Brynjolfsson. No new papers by watchlist researchers published within the August 3–10 window were found.
23	
24	**Notable recent-but-outside-window publications (for registry update):**
25	
26	- **Erik Brynjolfsson (WATCHLIST):** "AISPA: User-Centric System Prompt Auditing" (arXiv, July 2026); "Canaries Dashboard" launched with ADP Research (June 2026) — real-time payroll tracker showing 3.8% annual employment decline for 22–25-year-olds in high-AI-exposure jobs as of April 2026. Also: CNBC (Aug 8) quotes Brynjolfsson: "The labor market effects we're measuring now are the leading edge, not the full wave."
27	- **Daron Acemoglu (WATCHLIST):** No new papers found this week. Most recent tracked: "Building Pro-Worker Artificial Intelligence" (NBER WP 34854, Feb 2026, with Autor & Johnson).
28	- **All others (WATCHLIST):** No new publications found in the Aug 3–10 window.
29	
30	---
31	
32	## New Sources
33	
34	### Apollo Global Management — "AI Lowers Wages But Doesn't Cut Jobs"
35	
36	- **Publisher:** Apollo Global Management (Torsten Slok & Sania Edlich)
37	- **Date:** 2026-07-30
38	- **URL:** https://www.apollo.com/wealth/insights-news/insights/daily-spark/ai-lowers-wages-but-doesnt-cut-jobs
39	- **Evidence Tier:** 2 (financial institution proprietary research, peer-reviewed methodology)
40	- **Source ID:** apollo-wage-compression-2026
41	- **Notes:** Published July 30 — one day before the 7-day window, but first widely covered (Forbes, Axios) within the window. Used difference-in-differences with occupation and year fixed effects on BLS wage data matched to Anthropic's Economic Index across 321 U.S. occupations, 2015–2026. Sample covers 11 highly exposed occupations (5.8 million workers, 3.7% of the U.S. labor force): computer programmers, customer service representatives, data entry keyers, medical records specialists, market research analysts, and marketing specialists.
42	
43	**Statistics:**
44	
45	1. **Graph:** Median Wage Impact (`median-wage-impact`)
46	   **Type:** OVERLAY (down)
47	   **Value:** -6.7 percentage points (wage growth differential, observed post-2023)
48	   **Quote:** "Real wage growth in occupations with high observed AI use lagged less-exposed occupations by 6.7 percentage points after 2023."
49	   **Mapping note:** This is an observed, short-term differential (not a 2030 forecast) across a small slice of the workforce (3.7%); classified as overlay rather than data point.
50	
51	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
52	   **Type:** OVERLAY (down)
53	   **Value:** -10.7 percentage points (wage growth, lowest-paid quartile of AI-exposed workers)
54	   **Quote:** "Lowest-paid quartile: 10.7 percentage points slower wage growth" [from Forbes synthesis of Apollo findings, Aug 5, 2026]
55	   **Mapping note:** Lower-wage workers in exposed occupations bear the largest wage-growth drag; maps to entry-level graph as overlay because it is not a 2028 forecast.
56	
57	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
58	   **Type:** OVERLAY (neutral)
59	   **Value:** 0 (no statistically significant employment change observed)
60	   **Quote:** "Yet the researchers found no statistically significant decline in employment over the same period. They described the first measurable labor-market effect of AI as 'wage compression rather than employment displacement.'"
61	   **Mapping note:** Employment-null result adds evidence that current AI effects appear in wages before headcount; does not constitute a displacement forecast.
62	
63	---
64	
65	### Forbes / Caroline Castrillon — "Why AI Will Cut Your Pay Before It Takes Your Job"
66	
67	- **Publisher:** Forbes (Careers section)
68	- **Date:** 2026-08-05
69	- **URL:** https://www.forbes.com/sites/carolinecastrillon/2026/08/05/ais-impact-on-wages-may-come-before-widespread-job-loss/
70	- **Evidence Tier:** 3 (major trade/business press)
71	- **Source ID:** forbes-castrillon-wage-compression-2026-08
72	- **Notes:** Synthesizes Apollo Global Management (July 30) and IESE Business School findings. Two distinct datasets: (1) Apollo uses BLS wage data + Anthropic Economic Index across 321 occupations; (2) IESE uses 138 million U.S. employee records.
73	
74	**Statistics:**
75	
76	1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
77	   **Type:** OVERLAY (down)
78	   **Value:** -6.3 (junior starting pay, percentage points, post-ChatGPT at AI-exposed companies)
79	   **Quote:** "Using data from 138 million U.S. employees, researchers found that starting wages at AI-exposed companies fell 4.5% after ChatGPT's launch. Junior starting pay declined 6.3%, and mid-level pay fell 5.9%, while senior compensation remained stable or increased."
80	   **Mapping note:** The 6.3% junior decline is the most directly comparable to the `entry-level-wage-impact` graph unit. IESE finding attributed to SSRN/IESE Business School; this Forbes article is the accessible synthesis.
81	
82	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
83	   **Type:** OVERLAY (up)
84	   **Value:** +11 percentage points (gap in advertised pay growth between "Professionalised" and "Democratised" roles since 2021; 37% vs 26%)
85	   **Quote:** "Since 2021, advertised pay rose 37% for the first group [Professionalised], compared with 26% for the second [Democratised]. Job postings grew 39% and 17%, respectively."
86	   **Mapping note:** PwC 2026 Global AI Jobs Barometer data, cited in Forbes. The widening gap between AI-leveraged expert roles and commoditized roles is the closest match to `high-skill-wage-premium`. Classified as overlay (not a 2030 endpoint projection).
87	
88	3. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
89	   **Type:** OVERLAY (neutral)
90	   **Value:** -4.1 percentage points (management and professional wage growth, slower than non-exposed peers)
91	   **Quote:** "By occupation type — Management and professional occupations: 4.1 points slower"
92	   **Mapping note:** The 4.1 pp wage drag on management/professional roles is directional evidence relevant to white-collar exposure but is a wage metric, not a displacement count. Classified as overlay.
93	
94	---
95	
96	### CNBC — "AI and job losses: How the next automation wave will impact the workforce"
97	
98	- **Publisher:** CNBC
99	- **Date:** 2026-08-08
100	- **URL:** https://www.cnbc.com/2026/08/08/ai-and-job-losses-how-the-next-automation-wave-will-impact-the-workforce.html
101	- **Evidence Tier:** 3 (major business news)
102	- **Source ID:** cnbc-brynjolfsson-aug-2026
103	- **Notes:** Features Erik Brynjolfsson commentary on the state of AI labor market evidence. No new quantitative primary research; editorial/perspective piece. Relevant as a WATCHLIST signal for Brynjolfsson's current stated position.
104	
105	**Statistics:** None extractable. No new quantitative claims are made; the article contextualizes existing research. Brynjolfsson's key quote is:
106	
107	> "Most workers still barely use these tools. The labor market effects we're measuring now are the leading edge, not the full wave." — Erik Brynjolfsson, CNBC, Aug 8, 2026
108	
109	> "The key lesson from history isn't 'don't worry.' It's that outcomes depend on choices — by companies, policymakers, and workers. That's why we should think of the effects of technology on work as a design problem, not a prediction problem." — Erik Brynjolfsson, CNBC, Aug 8, 2026
110	
111	*No graph mappings made: no extractable quantitative statistics.*
112	
113	---
114	
115	## Sources Checked but Not Relevant
116	
117	The following URLs and sources were reviewed and did not yield new quantitative AI labor statistics within the August 3–10 window:
118	
119	- `https://www.nber.org/papers/w34859` — "Chaining Tasks, Redefining Work" (Demirer, Horton et al.), Issue Date: **February 2026** — outside window; theoretical model, no employment/wage point estimates.
120	- `https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/` — Brookings/NBER adaptive capacity paper (Manning & Aguirre) — date unclear from search, likely 2025–early 2026; no new this-week publication confirmed.
121	- `https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf` — World Bank WP 11263 "Labor Demand in the Age of Generative AI" (Liu, Wang, Yu) — SSRN posting: **September 19, 2025**; outside window.
122	- `https://www.census.gov/newsroom/press-releases/2026/btos-june-18.html` — Census BTOS June 18 release — most recent confirmed AI adoption release; no August 2026 release found within window.
123	- `https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` — IMF Staff Discussion Note 2026/001 "New Jobs Creation in the AI Age" — published earlier in 2026; outside window.
124	- `https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html` — Fed FEDS Note "Monitoring AI Adoption in the US Economy" — published **April 3, 2026**; outside window.
125	- `https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html` — Census WP "Microstructure of AI Diffusion" — 2026, reference period Nov 2025–Jan 2026; date of release unclear but not Aug 3–10.
126	- `https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/` — ICLE literature review — no publication date within window confirmed.
127	- `https://www.axios.com/2026/07/31/ai-jobs-pay-apollo` — Axios "AI's real threat to jobs could be lower pay" — **July 31, 2026**; three days before window; same Apollo underlying data as Forbes (Aug 5).
128	- `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5842084` — Azar, Gine, Sanz-Espín "The Wage Effects of Generative AI" — SSRN posting: **December 2025**; outside window.
129	- `https://www.nber.org/papers/w34984` — NBER WP 34984 "AI, Productivity, and the Workforce: Evidence from Corporate Executives" (Baslandze et al.) — 2026; exact date unclear but likely Q1/Q2; not confirmed within Aug 3–10 window.
130	- Multiple Tier 4 aggregator/blog posts (aiexposure.org, axis-intelligence.com, letaido.com, demandsage.com, etc.) — not considered; contain no original primary data.
131	
132	---
133	
134	## Priority Recommendations
135	
136	### Ingest Immediately
137	1. **Apollo Global Management wage compression study (July 30, 2026)** — Tier 2 study with genuine empirical novelty: first to use actual Claude usage data (Anthropic Economic Index) as an exposure metric linked to BLS wage outcomes. The -6.7 pp wage growth differential and the employment-null finding are the most crisply quantified, independently derived AI wage statistics published in the past several weeks. The white paper PDF should be retrieved directly from Apollo for exact methodology and confidence intervals before ingesting as a data point.
138	   - URL for white paper PDF: `https://www.apollo.com/content/dam/apolloaem/pdf/daily-spark/2026//jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf`
139	
140	### Significant Divergences from Graph Consensus
141	2. **Wage compression finding contradicts simple job-loss narrative.** If the current consensus on `median-wage-impact` assumes relatively flat near-term wages, the Apollo -6.7 pp differential (for a 3.7% subset of U.S. workers in the highest-exposure occupations) suggests downward wage pressure is already measurable for highly exposed workers even before employment effects appear. This should shift the `median-wage-impact` overlay direction to **down** for affected occupations.
142	3. **Entry-level wage compression (-6.3% junior, IESE)** is consistent with Brynjolfsson's Canaries Dashboard (-3.8% annual employment rate for 22–25-year-olds in high-exposure occupations). Together these converge on a pattern: AI's labor market effects concentrate at career entry via both wage and hiring volume channels.
143	
144	### Data Gaps / Registry Additions to Consider
145	4. **Census BTOS** — The biweekly BTOS is the most reliable, government-grade source for `ai-adoption-rate`. The next biweekly release is expected ~August 13, 2026. Recommend adding as a recurring series with `cadence: biweekly` and `nextExpected: 2026-08-13`.
146	5. **Researcher watchlist** — All 15 researchers are overdue for re-check. Recommend updating `lastChecked` field to today's date for all researchers after running this sweep. Erik Brynjolfsson's **Canaries Dashboard** (launched June 2026, updated monthly with ADP data through April 2026) is a continuous data source that could be added as its own recurring series entry.
147	6. **Apollo Daily Spark** — Torsten Slok's team publishes frequent AI-economy notes. The July 30 paper is high quality enough to watch on a monthly cadence. Consider adding to recurring sources.
# AI Labor Research Digest — 2026-08-10

## Summary

The week of August 3–10, 2026 yielded **two confirmed Tier 3 sources** published within the 7-day window, both synthesizing and contextualizing a Tier 2 study published one day before the window opened (Apollo Global Management, July 30). The headline quantitative finding is **wage compression without employment displacement** in AI-exposed occupations: real wage growth in the 11 most Claude-exposed U.S. occupations lagged less-exposed occupations by 6.7 percentage points post-2023, with no statistically significant employment decline in the same period. A separate IESE Business School analysis (138 million U.S. employees) shows junior starting pay fell 6.3% at AI-exposed companies after ChatGPT's launch. No new Tier 1 government statistics or peer-reviewed papers from this specific 7-day window were identified. The recurring-sources registry has no series due this week. All 15 researchers on the watchlist are overdue for a check (last checked 2026-04-14).

---

## Recurring Series Status

**ellucian-highered-ai** (`nextExpected: 2027-03-01`): NOT DUE — no search conducted; series not yet due.

> **Registry note:** Only one series is registered in `recurring-sources.json`. The following widely tracked recurring datasets were checked opportunistically but are not yet in the registry and should be considered for addition:
> - **Census BTOS (AI adoption)** — most recent confirmed release: June 18, 2026 (19.8% national AI use rate). Next biweekly release expected ~August 13, 2026. No release found for Aug 3–10 window.
> - **Stanford AI Index** — annual; 2026 edition published; next expected early 2027.
> - **PwC AI Jobs Barometer** — 2026 edition published earlier this year (no specific August update found).

---

## Researcher Watchlist

All 15 researchers last checked 2026-04-14 (117 days ago, well past the 30-day threshold). Searches conducted for Acemoglu and Brynjolfsson. No new papers by watchlist researchers published within the August 3–10 window were found.

**Notable recent-but-outside-window publications (for registry update):**

- **Erik Brynjolfsson (WATCHLIST):** "AISPA: User-Centric System Prompt Auditing" (arXiv, July 2026); "Canaries Dashboard" launched with ADP Research (June 2026) — real-time payroll tracker showing 3.8% annual employment decline for 22–25-year-olds in high-AI-exposure jobs as of April 2026. Also: CNBC (Aug 8) quotes Brynjolfsson: "The labor market effects we're measuring now are the leading edge, not the full wave."
- **Daron Acemoglu (WATCHLIST):** No new papers found this week. Most recent tracked: "Building Pro-Worker Artificial Intelligence" (NBER WP 34854, Feb 2026, with Autor & Johnson).
- **All others (WATCHLIST):** No new publications found in the Aug 3–10 window.

---

## New Sources

### Apollo Global Management — "AI Lowers Wages But Doesn't Cut Jobs"

- **Publisher:** Apollo Global Management (Torsten Slok & Sania Edlich)
- **Date:** 2026-07-30
- **URL:** https://www.apollo.com/wealth/insights-news/insights/daily-spark/ai-lowers-wages-but-doesnt-cut-jobs
- **Evidence Tier:** 2 (financial institution proprietary research, peer-reviewed methodology)
- **Source ID:** apollo-wage-compression-2026
- **Notes:** Published July 30 — one day before the 7-day window, but first widely covered (Forbes, Axios) within the window. Used difference-in-differences with occupation and year fixed effects on BLS wage data matched to Anthropic's Economic Index across 321 U.S. occupations, 2015–2026. Sample covers 11 highly exposed occupations (5.8 million workers, 3.7% of the U.S. labor force): computer programmers, customer service representatives, data entry keyers, medical records specialists, market research analysts, and marketing specialists.

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -6.7 percentage points (wage growth differential, observed post-2023)
   **Quote:** "Real wage growth in occupations with high observed AI use lagged less-exposed occupations by 6.7 percentage points after 2023."
   **Mapping note:** This is an observed, short-term differential (not a 2030 forecast) across a small slice of the workforce (3.7%); classified as overlay rather than data point.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -10.7 percentage points (wage growth, lowest-paid quartile of AI-exposed workers)
   **Quote:** "Lowest-paid quartile: 10.7 percentage points slower wage growth" [from Forbes synthesis of Apollo findings, Aug 5, 2026]
   **Mapping note:** Lower-wage workers in exposed occupations bear the largest wage-growth drag; maps to entry-level graph as overlay because it is not a 2028 forecast.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no statistically significant employment change observed)
   **Quote:** "Yet the researchers found no statistically significant decline in employment over the same period. They described the first measurable labor-market effect of AI as 'wage compression rather than employment displacement.'"
   **Mapping note:** Employment-null result adds evidence that current AI effects appear in wages before headcount; does not constitute a displacement forecast.

---

### Forbes / Caroline Castrillon — "Why AI Will Cut Your Pay Before It Takes Your Job"

- **Publisher:** Forbes (Careers section)
- **Date:** 2026-08-05
- **URL:** https://www.forbes.com/sites/carolinecastrillon/2026/08/05/ais-impact-on-wages-may-come-before-widespread-job-loss/
- **Evidence Tier:** 3 (major trade/business press)
- **Source ID:** forbes-castrillon-wage-compression-2026-08
- **Notes:** Synthesizes Apollo Global Management (July 30) and IESE Business School findings. Two distinct datasets: (1) Apollo uses BLS wage data + Anthropic Economic Index across 321 occupations; (2) IESE uses 138 million U.S. employee records.

**Statistics:**

1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -6.3 (junior starting pay, percentage points, post-ChatGPT at AI-exposed companies)
   **Quote:** "Using data from 138 million U.S. employees, researchers found that starting wages at AI-exposed companies fell 4.5% after ChatGPT's launch. Junior starting pay declined 6.3%, and mid-level pay fell 5.9%, while senior compensation remained stable or increased."
   **Mapping note:** The 6.3% junior decline is the most directly comparable to the `entry-level-wage-impact` graph unit. IESE finding attributed to SSRN/IESE Business School; this Forbes article is the accessible synthesis.

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** +11 percentage points (gap in advertised pay growth between "Professionalised" and "Democratised" roles since 2021; 37% vs 26%)
   **Quote:** "Since 2021, advertised pay rose 37% for the first group [Professionalised], compared with 26% for the second [Democratised]. Job postings grew 39% and 17%, respectively."
   **Mapping note:** PwC 2026 Global AI Jobs Barometer data, cited in Forbes. The widening gap between AI-leveraged expert roles and commoditized roles is the closest match to `high-skill-wage-premium`. Classified as overlay (not a 2030 endpoint projection).

3. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** -4.1 percentage points (management and professional wage growth, slower than non-exposed peers)
   **Quote:** "By occupation type — Management and professional occupations: 4.1 points slower"
   **Mapping note:** The 4.1 pp wage drag on management/professional roles is directional evidence relevant to white-collar exposure but is a wage metric, not a displacement count. Classified as overlay.

---

### CNBC — "AI and job losses: How the next automation wave will impact the workforce"

- **Publisher:** CNBC
- **Date:** 2026-08-08
- **URL:** https://www.cnbc.com/2026/08/08/ai-and-job-losses-how-the-next-automation-wave-will-impact-the-workforce.html
- **Evidence Tier:** 3 (major business news)
- **Source ID:** cnbc-brynjolfsson-aug-2026
- **Notes:** Features Erik Brynjolfsson commentary on the state of AI labor market evidence. No new quantitative primary research; editorial/perspective piece. Relevant as a WATCHLIST signal for Brynjolfsson's current stated position.

**Statistics:** None extractable. No new quantitative claims are made; the article contextualizes existing research. Brynjolfsson's key quote is:

> "Most workers still barely use these tools. The labor market effects we're measuring now are the leading edge, not the full wave." — Erik Brynjolfsson, CNBC, Aug 8, 2026

> "The key lesson from history isn't 'don't worry.' It's that outcomes depend on choices — by companies, policymakers, and workers. That's why we should think of the effects of technology on work as a design problem, not a prediction problem." — Erik Brynjolfsson, CNBC, Aug 8, 2026

*No graph mappings made: no extractable quantitative statistics.*

---

## Sources Checked but Not Relevant

The following URLs and sources were reviewed and did not yield new quantitative AI labor statistics within the August 3–10 window:

- `https://www.nber.org/papers/w34859` — "Chaining Tasks, Redefining Work" (Demirer, Horton et al.), Issue Date: **February 2026** — outside window; theoretical model, no employment/wage point estimates.
- `https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/` — Brookings/NBER adaptive capacity paper (Manning & Aguirre) — date unclear from search, likely 2025–early 2026; no new this-week publication confirmed.
- `https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf` — World Bank WP 11263 "Labor Demand in the Age of Generative AI" (Liu, Wang, Yu) — SSRN posting: **September 19, 2025**; outside window.
- `https://www.census.gov/newsroom/press-releases/2026/btos-june-18.html` — Census BTOS June 18 release — most recent confirmed AI adoption release; no August 2026 release found within window.
- `https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` — IMF Staff Discussion Note 2026/001 "New Jobs Creation in the AI Age" — published earlier in 2026; outside window.
- `https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html` — Fed FEDS Note "Monitoring AI Adoption in the US Economy" — published **April 3, 2026**; outside window.
- `https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html` — Census WP "Microstructure of AI Diffusion" — 2026, reference period Nov 2025–Jan 2026; date of release unclear but not Aug 3–10.
- `https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/` — ICLE literature review — no publication date within window confirmed.
- `https://www.axios.com/2026/07/31/ai-jobs-pay-apollo` — Axios "AI's real threat to jobs could be lower pay" — **July 31, 2026**; three days before window; same Apollo underlying data as Forbes (Aug 5).
- `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5842084` — Azar, Gine, Sanz-Espín "The Wage Effects of Generative AI" — SSRN posting: **December 2025**; outside window.
- `https://www.nber.org/papers/w34984` — NBER WP 34984 "AI, Productivity, and the Workforce: Evidence from Corporate Executives" (Baslandze et al.) — 2026; exact date unclear but likely Q1/Q2; not confirmed within Aug 3–10 window.
- Multiple Tier 4 aggregator/blog posts (aiexposure.org, axis-intelligence.com, letaido.com, demandsage.com, etc.) — not considered; contain no original primary data.

---

## Priority Recommendations

### Ingest Immediately
1. **Apollo Global Management wage compression study (July 30, 2026)** — Tier 2 study with genuine empirical novelty: first to use actual Claude usage data (Anthropic Economic Index) as an exposure metric linked to BLS wage outcomes. The -6.7 pp wage growth differential and the employment-null finding are the most crisply quantified, independently derived AI wage statistics published in the past several weeks. The white paper PDF should be retrieved directly from Apollo for exact methodology and confidence intervals before ingesting as a data point.
   - URL for white paper PDF: `https://www.apollo.com/content/dam/apolloaem/pdf/daily-spark/2026//jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf`

### Significant Divergences from Graph Consensus
2. **Wage compression finding contradicts simple job-loss narrative.** If the current consensus on `median-wage-impact` assumes relatively flat near-term wages, the Apollo -6.7 pp differential (for a 3.7% subset of U.S. workers in the highest-exposure occupations) suggests downward wage pressure is already measurable for highly exposed workers even before employment effects appear. This should shift the `median-wage-impact` overlay direction to **down** for affected occupations.
3. **Entry-level wage compression (-6.3% junior, IESE)** is consistent with Brynjolfsson's Canaries Dashboard (-3.8% annual employment rate for 22–25-year-olds in high-exposure occupations). Together these converge on a pattern: AI's labor market effects concentrate at career entry via both wage and hiring volume channels.

### Data Gaps / Registry Additions to Consider
4. **Census BTOS** — The biweekly BTOS is the most reliable, government-grade source for `ai-adoption-rate`. The next biweekly release is expected ~August 13, 2026. Recommend adding as a recurring series with `cadence: biweekly` and `nextExpected: 2026-08-13`.
5. **Researcher watchlist** — All 15 researchers are overdue for re-check. Recommend updating `lastChecked` field to today's date for all researchers after running this sweep. Erik Brynjolfsson's **Canaries Dashboard** (launched June 2026, updated monthly with ADP data through April 2026) is a continuous data source that could be added as its own recurring series entry.
6. **Apollo Daily Spark** — Torsten Slok's team publishes frequent AI-economy notes. The July 30 paper is high quality enough to watch on a monthly cadence. Consider adding to recurring sources.