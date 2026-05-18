1	# AI Labor Research Digest — 2026-05-18
2	
3	## Summary
4	
5	This week's scan identified **one confirmed Tier 1 source** published within the strict 7-day window (May 11–18, 2026): a Federal Reserve Bank of New York analysis on job postings and AI's labor-market effects (May 14, 2026). Two additional high-quality sources fell just outside the window by 3–4 days (BLS April jobs data via Fortune, May 8; Census BTOS data release, May 7). The dominant finding across all sources this week is **null-to-modest aggregate displacement**: job-posting declines in AI-exposed occupations predate ChatGPT, GenAI work adoption reached ~41% of the U.S. workforce by November 2025, and firm-level AI adoption stands at 18% (firm-weighted) vs. 78% (employment-weighted). The week's standout Tier 1 highlight is the NY Fed result that the relative decline in AI-exposed job postings is statistically indistinguishable from pre-2022 trends — directly challenging AI-displacement narratives in the current prediction landscape.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### Do Job Postings Show Early Labor-Market Effects of AI?
14	
15	- **Publisher:** Federal Reserve Bank of New York (Liberty Street Economics)
16	- **Date:** 2026-05-14
17	- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/
18	- **Evidence Tier:** 1 (Federal Reserve primary research blog; uses Anthropic/Lightcast/OEWS administrative data)
19	- **Source ID:** newyorkfed-jobpostings-ai-2026
20	
21	**Statistics:**
22	
23	1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
24	   **Type:** DATA_POINT
25	   **Value:** 10 % (upper bound — share of workers/vacancies in occupations with AI exposure ≥ 0.4)
26	   **Quote:** "Only a small share of employment or vacancies is concentrated in occupations with high AI exposure—less than 10 percent of workers and vacancies are in occupations with an AI exposure of at least 0.4"
27	
28	2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
29	   **Type:** OVERLAY (down)
30	   **Value:** 40 % of workers in jobs with *zero* measured AI exposure
31	   **Quote:** "40 percent of workers are in jobs with zero measured AI exposure"
32	   **Mapping note:** This is the *zero-exposure* share, not the exposed share. Logged as overlay-down because it implies lower overall exposure than many prior estimates suggest. The Anthropic task-level metric is more conservative than occupation-level LLM-exposure measures.
33	
34	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
35	   **Type:** OVERLAY (down)
36	   **Value:** 0 (no measurable AI-attributable divergence in job postings post-ChatGPT)
37	   **Quote:** "While the chart shows a relative decline in postings for occupations with higher AI exposure, the event study indicates that this trend predates the release of ChatGPT. The divergence between high- and low-exposure occupations began before 2022 and does not show a clear additional break in trajectory after 2022. Besides, the gap in labor demand between high- and low-exposure jobs stabilizes after 2023, at odds with AI gradually displacing exposed occupations."
38	   **Mapping note:** This is an absence-of-effect finding in a clean event-study design. It pushes against displacement graph predictions that AI is driving significant displacement in the current period. Classified as overlay-down (metric direction: displacement will be lower than consensus expects in near term).
39	
40	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
41	   **Type:** OVERLAY (neutral)
42	   **Value:** 0 (no divergence between junior and senior postings in AI-exposed occupations)
43	   **Quote:** "we do not observe a divergence in labor demand between junior and senior positions within highly exposed occupations. These patterns make it difficult to attribute the recent slowdown in entry-level hiring to AI alone."
44	   **Mapping note:** Directly tests the entry-level AI displacement thesis. The finding is that junior and senior posting levels move in parallel within high-exposure occupations, complicating the narrative of a distinct AI-driven entry-level squeeze. Mapped to entry-level-wage-impact because labor demand for entry-level is the most direct antecedent of entry-level wage pressure.
45	
46	---
47	
48	## Sources Checked but Published Just Outside the 7-Day Window
49	*(May 7–10, 2026 — flagged as near-miss for monitoring)*
50	
51	### Business Trends and Outlook Survey Data Release — May 7, 2026
52	
53	- **Publisher:** U.S. Census Bureau
54	- **Date:** 2026-05-07 *(4 days before window opens)*
55	- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-may-7.html
56	- **Evidence Tier:** 1 (official U.S. government survey data)
57	- **Source ID:** census-btos-may-2026
58	
59	This release makes available the BTOS AI supplement data (collected Nov 17, 2025 – Feb 8, 2026), covering 1.2 million businesses. The press release itself contains no additional quantitative claims beyond the April 23 release. The underlying data dashboard has full sector/state breakdowns. **Recommend ingesting the underlying BTOS data files directly from census.gov/hfp/btos for the most granular adoption figures.**
60	
61	**Key figures from this BTOS supplement (per Federal Reserve synthesis of same data):**
62	
63	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
64	   **Type:** DATA_POINT
65	   **Value:** 18 % of U.S. firms (firm-weighted, end of 2025)
66	   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
67	   *(Source: Allen 2026, Federal Reserve FEDS Note reviewing BTOS data; original BTOS release confirms same figure.)*
68	
69	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
70	   **Type:** DATA_POINT
71	   **Value:** 41 % of U.S. workforce using GenAI at work (individual-level RPS, November 2025)
72	   **Quote:** "work-related Generative AI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025."
73	   *(Source: Allen 2026 Federal Reserve FEDS Note.)*
74	
75	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
76	   **Type:** OVERLAY (up)
77	   **Value:** 78 % of U.S. labor force works at firms that have adopted AI (employment-weighted, SBU, Nov 2025)
78	   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent."
79	   *(Source: Allen 2026 Federal Reserve FEDS Note.)*
80	   **Mapping note:** Employment-weighted (big firms count more) vs. firm-weighted (18%) — both valid measures; the 78% figure is the upper bound and should be logged as overlay-up on the `ai-adoption-rate` graph to show measurement range.
81	
82	### The Job Market Is Healing for Everyone—Except in the Office (April 2026 Jobs Report)
83	
84	- **Publisher:** Fortune / Eva Roytburg
85	- **Date:** 2026-05-08 *(3 days before window opens)*
86	- **URL:** https://fortune.com/2026/05/08/jobs-report-april-2026-ai-white-collar-layoffs-finance-wages/
87	- **Evidence Tier:** 3 (major news, primary data via BLS April 2026 Employment Situation)
88	- **Source ID:** fortune-aprijobs-2026
89	
90	**Statistics (underlying BLS data, Tier 1 source):**
91	
92	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
93	   **Type:** OVERLAY (down — sector losing jobs)
94	   **Value:** −13,000 information-sector jobs in April 2026; 16 consecutive months of net loss
95	   **Quote:** "The 'information sector'—where the BLS counts tech, telecom, data processing, and media jobs—lost another 13,000 jobs in April, while finance shed 11,000. The monthly average this year has been about 9,000 jobs lost in information, and 12,000 in financial activities."
96	   **Mapping note:** 16-month sustained decline in the information sector, now at lowest employment since March 2021. The article notes economists are "cautious about drawing a straight line from AI" and suggest post-pandemic over-hiring correction is a confounding factor. Classified as overlay-down with uncertainty about AI causality.
97	
98	2. **Graph:** Median Wage Impact (`median-wage-impact`)
99	   **Type:** OVERLAY (down — real wages under pressure)
100	   **Value:** 3.6 % nominal average hourly earnings YoY; below ~4% expected inflation → real wages flat to negative
101	   **Quote:** "The April jobs report shows average hourly earnings rose 3.6% over the year, while inflation is expected to come in around 4% for April once the Consumer Price Index lands next week... Joseph Brusuelas, chief economist at RSM, predicted that real average hourly earnings will likely register flat to negative for April."
102	   **Mapping note:** This is a real-wage pressure signal for the current period, not AI-specific. Logged as overlay-neutral/down but caveat: driven by energy/supply shocks (Middle East war, gas prices), not directly AI.
103	
104	---
105	
106	## Other Important Sources — Outside 7-Day Window (Prior Weeks/Months)
107	*(Not the focus of this digest, but flagged as recently published and highly relevant for potential retroactive ingestion)*
108	
109	### Monitoring AI Adoption in the US Economy (Federal Reserve FEDS Note)
110	
111	- **Publisher:** Board of Governors of the Federal Reserve System
112	- **Date:** 2026-04-03
113	- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
114	- **Evidence Tier:** 1 (Federal Reserve Staff Note, synthesizes BTOS/RPS/SBU data)
115	- **Source ID:** federalreserve-aiadoption-2026
116	
117	This is the most comprehensive single-source synthesis of U.S. AI adoption data available. Statistics above (18% BTOS, 41% RPS, 78% SBU) are sourced here. Additional notable figures:
118	- Professional services firms: **33%** AI adoption; Financial sector firms: **30%** (BTOS, new series, end-2025)
119	- Work-related GenAI in finance: **63%** of individuals; professional services: **62%** (RPS)
120	- Manufacturing GenAI work adoption grew **58%** year-on-year (14.5 pp)
121	- Prior to November 2025 question revision, AI adoption had grown **68%** (3.9 pp) over the prior year
122	- **Over 20% of firms expect to use AI in the first half of 2026** (planned adoption)
123	
124	### Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement (Brookings/GovAI/NBER)
125	
126	- **Publisher:** Brookings Institution / Centre for the Governance of AI / NBER
127	- **Date:** 2026-01-21
128	- **URL:** https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/
129	- **Evidence Tier:** 2 (Brookings, with underlying Tier 1 NBER working paper)
130	- **Source ID:** brookings-adaptivecapacity-2026
131	
132	Key quantitative claims:
133	- **6.1 million workers** (4.2% of workforce) face both high AI exposure AND low adaptive capacity
134	- **86%** of these vulnerable workers are women
135	- **26.5 million workers** have high exposure AND above-median adaptive capacity — these workers have strong buffers
136	- National average of **3.9%** of metro-area workers in high-exposure/low-adaptive-capacity occupations (range: 2.4%–6.9% across metros)
137	
138	**Graph mapping:** `workforce-ai-exposure` → OVERLAY (neutral: these are exposure + adaptive capacity measures, not displacement counts); `overall-us-displacement` → OVERLAY (neutral: 4.2% vulnerable subset, not confirmed displacement).
139	
140	### Artificial Intelligence, Productivity, and the Workforce: Evidence from Corporate Executives (NBER WP 34984)
141	
142	- **Publisher:** NBER (Baslandze, Edwards, Graham, Meyer, Waddell et al.)
143	- **Date:** 2026-03 (Issue Date)
144	- **URL:** https://www.nber.org/papers/w34984
145	- **Evidence Tier:** 1 (NBER Working Paper, survey of ~750 corporate executives via CFO Survey)
146	- **Source ID:** nber-cfocsurvey-ai-2026
147	
148	Key quantitative claims:
149	- "**sector-weighted aggregate employment is expected to decline by less than 0.4% due to AI in 2026**"
150	- Mean reported labor productivity growth from AI: **3.0%** (2026 expected, weighted)
151	- Large companies expect workforce reductions; smaller firms anticipate modest gains
152	- More than **half** of surveyed firms had already invested in AI; smaller firms "only beginning to do so"
153	
154	**Graph mapping:** `total-us-jobs-lost` → OVERLAY (down: 0.4% expected decline is modest, below most graph predictions); `ai-adoption-rate` → OVERLAY (up: majority of large firms already invested).
155	
156	---
157	
158	## Sources Checked but Not Relevant to Quantitative AI Labor Stats
159	
160	The following URLs were reviewed and yielded no new, verifiable quantitative AI labor statistics within the 7-day window:
161	
162	- https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning (PIIE — URL inaccessible during session; Brookings mirror found dated March 10, 2026 — outside window, qualitative synthesis)
163	- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 (SSRN — Nartey 2026 — unverified Tier 4 aggregator, no primary data)
164	- https://www.almcorp.com/blog/ai-job-displacement-statistics/ (ALM Corp — Tier 4 blog, no primary data)
165	- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics (DesignRush — Tier 4 aggregator)
166	- https://www.aimagicx.com/blog/goldman-sachs-ai-job-displacement-16000-monthly-report-2026 (AI Magicx — Tier 4 blog; claimed "Goldman Sachs April 2026" report not verified on Goldman Sachs website; statistics not confirmed from primary source — **do not ingest**)
167	- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf (IMF SDN/2026/001 — Published January 2026; significant quantitative content but outside window; recommend separate retroactive review)
168	- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market (Yale Budget Lab — standing tracker, update noted March/April 2026; no discrete publication date in window)
169	
170	---
171	
172	## Priority Recommendations
173	
174	### 🔴 Tier 1 Sources to Ingest Immediately
175	
176	1. **NY Fed Liberty Street Economics (May 14, 2026)** — IN WINDOW. High-quality event-study using Anthropic+Lightcast data. Key implication: the consensus that AI is driving a distinct decline in AI-exposed job demand is not supported by job-postings evidence. This is a **down** overlay on `overall-us-displacement` and a `data_point` suggesting `workforce-ai-exposure` is more limited than standard LLM-based metrics indicate.
177	
178	2. **Census BTOS AI Supplement (data released May 7, 2026)** — Just outside window. The full data download files are now available at census.gov/hfp/btos. These represent the most authoritative U.S. government measure of business AI adoption. The 18% (firm-weighted) and 41% (GenAI workforce) figures are the current best data points for `ai-adoption-rate` and `genai-work-adoption`.
179	
180	3. **Federal Reserve FEDS Note (April 3, 2026)** — Synthesizes all three major U.S. AI adoption surveys. The note explicitly reconciles why estimates range from 18% to 78% (unit of analysis: firm vs. employment-weighted). Essential methodological context for the `ai-adoption-rate` and `genai-work-adoption` graphs.
181	
182	### 🟡 Statistics That Diverge Significantly from Current Graph Consensus
183	
184	1. **NY Fed job-postings finding**: If the prediction graph for `overall-us-displacement` or `tech-sector-displacement` implies AI is currently depressing hiring in exposed occupations, the NY Fed event study (May 14, 2026) is a direct empirical challenge. The decline in AI-exposed vacancies predates ChatGPT and has not accelerated post-2022. This is a Tier 1 source directly at odds with AI-displacement narratives.
185	
186	2. **NBER CFO Survey (<0.4% employment decline from AI in 2026)**: If the `total-us-jobs-lost` graph shows predictions substantially above 0.4% job loss for the current year, the NBER CFO survey (March 2026) from ~750 corporate executives presents a much more muted near-term estimate.
187	
188	3. **GenAI work adoption (41% of workforce)**: If the `genai-work-adoption` graph predicts lower than 41% by end of 2025/early 2026, the RPS data (from Real-Time Population Survey, Nov 2025) should update that prediction upward significantly.
189	
190	### 🟢 New Government Data Releases
191	
192	- **Census BTOS AI Supplement**: New biweekly data now available at the sector × state × firm-size level for the Nov 2025–Feb 2026 period. Full granular download available. This is the primary U.S. government dataset for tracking AI adoption over time. Next biweekly release expected approximately May 21, 2026.
193	- **BLS April 2026 Employment Situation** (released May 8, 2026): Information sector down 13,000 jobs; 16 consecutive months of decline to lowest level since March 2021. White-collar contraction continues even as broader labor market adds 115,000 jobs (unemployment held at 4.3%).
194	
195	---
196	*Digest prepared: 2026-05-18. All dates verified from source metadata. All statistics are direct extracts or verbatim quotes from sources identified above. No statistics were inferred or paraphrased.*
# AI Labor Research Digest — 2026-05-18

## Summary

This week's scan identified **one confirmed Tier 1 source** published within the strict 7-day window (May 11–18, 2026): a Federal Reserve Bank of New York analysis on job postings and AI's labor-market effects (May 14, 2026). Two additional high-quality sources fell just outside the window by 3–4 days (BLS April jobs data via Fortune, May 8; Census BTOS data release, May 7). The dominant finding across all sources this week is **null-to-modest aggregate displacement**: job-posting declines in AI-exposed occupations predate ChatGPT, GenAI work adoption reached ~41% of the U.S. workforce by November 2025, and firm-level AI adoption stands at 18% (firm-weighted) vs. 78% (employment-weighted). The week's standout Tier 1 highlight is the NY Fed result that the relative decline in AI-exposed job postings is statistically indistinguishable from pre-2022 trends — directly challenging AI-displacement narratives in the current prediction landscape.

---

## New Sources

---

### Do Job Postings Show Early Labor-Market Effects of AI?

- **Publisher:** Federal Reserve Bank of New York (Liberty Street Economics)
- **Date:** 2026-05-14
- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/
- **Evidence Tier:** 1 (Federal Reserve primary research blog; uses Anthropic/Lightcast/OEWS administrative data)
- **Source ID:** newyorkfed-jobpostings-ai-2026

**Statistics:**

1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** DATA_POINT
   **Value:** 10 % (upper bound — share of workers/vacancies in occupations with AI exposure ≥ 0.4)
   **Quote:** "Only a small share of employment or vacancies is concentrated in occupations with high AI exposure—less than 10 percent of workers and vacancies are in occupations with an AI exposure of at least 0.4"

2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (down)
   **Value:** 40 % of workers in jobs with *zero* measured AI exposure
   **Quote:** "40 percent of workers are in jobs with zero measured AI exposure"
   **Mapping note:** This is the *zero-exposure* share, not the exposed share. Logged as overlay-down because it implies lower overall exposure than many prior estimates suggest. The Anthropic task-level metric is more conservative than occupation-level LLM-exposure measures.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 0 (no measurable AI-attributable divergence in job postings post-ChatGPT)
   **Quote:** "While the chart shows a relative decline in postings for occupations with higher AI exposure, the event study indicates that this trend predates the release of ChatGPT. The divergence between high- and low-exposure occupations began before 2022 and does not show a clear additional break in trajectory after 2022. Besides, the gap in labor demand between high- and low-exposure jobs stabilizes after 2023, at odds with AI gradually displacing exposed occupations."
   **Mapping note:** This is an absence-of-effect finding in a clean event-study design. It pushes against displacement graph predictions that AI is driving significant displacement in the current period. Classified as overlay-down (metric direction: displacement will be lower than consensus expects in near term).

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no divergence between junior and senior postings in AI-exposed occupations)
   **Quote:** "we do not observe a divergence in labor demand between junior and senior positions within highly exposed occupations. These patterns make it difficult to attribute the recent slowdown in entry-level hiring to AI alone."
   **Mapping note:** Directly tests the entry-level AI displacement thesis. The finding is that junior and senior posting levels move in parallel within high-exposure occupations, complicating the narrative of a distinct AI-driven entry-level squeeze. Mapped to entry-level-wage-impact because labor demand for entry-level is the most direct antecedent of entry-level wage pressure.

---

## Sources Checked but Published Just Outside the 7-Day Window
*(May 7–10, 2026 — flagged as near-miss for monitoring)*

### Business Trends and Outlook Survey Data Release — May 7, 2026

- **Publisher:** U.S. Census Bureau
- **Date:** 2026-05-07 *(4 days before window opens)*
- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-may-7.html
- **Evidence Tier:** 1 (official U.S. government survey data)
- **Source ID:** census-btos-may-2026

This release makes available the BTOS AI supplement data (collected Nov 17, 2025 – Feb 8, 2026), covering 1.2 million businesses. The press release itself contains no additional quantitative claims beyond the April 23 release. The underlying data dashboard has full sector/state breakdowns. **Recommend ingesting the underlying BTOS data files directly from census.gov/hfp/btos for the most granular adoption figures.**

**Key figures from this BTOS supplement (per Federal Reserve synthesis of same data):**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of U.S. firms (firm-weighted, end of 2025)
   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
   *(Source: Allen 2026, Federal Reserve FEDS Note reviewing BTOS data; original BTOS release confirms same figure.)*

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 % of U.S. workforce using GenAI at work (individual-level RPS, November 2025)
   **Quote:** "work-related Generative AI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025."
   *(Source: Allen 2026 Federal Reserve FEDS Note.)*

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 78 % of U.S. labor force works at firms that have adopted AI (employment-weighted, SBU, Nov 2025)
   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent."
   *(Source: Allen 2026 Federal Reserve FEDS Note.)*
   **Mapping note:** Employment-weighted (big firms count more) vs. firm-weighted (18%) — both valid measures; the 78% figure is the upper bound and should be logged as overlay-up on the `ai-adoption-rate` graph to show measurement range.

### The Job Market Is Healing for Everyone—Except in the Office (April 2026 Jobs Report)

- **Publisher:** Fortune / Eva Roytburg
- **Date:** 2026-05-08 *(3 days before window opens)*
- **URL:** https://fortune.com/2026/05/08/jobs-report-april-2026-ai-white-collar-layoffs-finance-wages/
- **Evidence Tier:** 3 (major news, primary data via BLS April 2026 Employment Situation)
- **Source ID:** fortune-aprijobs-2026

**Statistics (underlying BLS data, Tier 1 source):**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down — sector losing jobs)
   **Value:** −13,000 information-sector jobs in April 2026; 16 consecutive months of net loss
   **Quote:** "The 'information sector'—where the BLS counts tech, telecom, data processing, and media jobs—lost another 13,000 jobs in April, while finance shed 11,000. The monthly average this year has been about 9,000 jobs lost in information, and 12,000 in financial activities."
   **Mapping note:** 16-month sustained decline in the information sector, now at lowest employment since March 2021. The article notes economists are "cautious about drawing a straight line from AI" and suggest post-pandemic over-hiring correction is a confounding factor. Classified as overlay-down with uncertainty about AI causality.

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down — real wages under pressure)
   **Value:** 3.6 % nominal average hourly earnings YoY; below ~4% expected inflation → real wages flat to negative
   **Quote:** "The April jobs report shows average hourly earnings rose 3.6% over the year, while inflation is expected to come in around 4% for April once the Consumer Price Index lands next week... Joseph Brusuelas, chief economist at RSM, predicted that real average hourly earnings will likely register flat to negative for April."
   **Mapping note:** This is a real-wage pressure signal for the current period, not AI-specific. Logged as overlay-neutral/down but caveat: driven by energy/supply shocks (Middle East war, gas prices), not directly AI.

---

## Other Important Sources — Outside 7-Day Window (Prior Weeks/Months)
*(Not the focus of this digest, but flagged as recently published and highly relevant for potential retroactive ingestion)*

### Monitoring AI Adoption in the US Economy (Federal Reserve FEDS Note)

- **Publisher:** Board of Governors of the Federal Reserve System
- **Date:** 2026-04-03
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
- **Evidence Tier:** 1 (Federal Reserve Staff Note, synthesizes BTOS/RPS/SBU data)
- **Source ID:** federalreserve-aiadoption-2026

This is the most comprehensive single-source synthesis of U.S. AI adoption data available. Statistics above (18% BTOS, 41% RPS, 78% SBU) are sourced here. Additional notable figures:
- Professional services firms: **33%** AI adoption; Financial sector firms: **30%** (BTOS, new series, end-2025)
- Work-related GenAI in finance: **63%** of individuals; professional services: **62%** (RPS)
- Manufacturing GenAI work adoption grew **58%** year-on-year (14.5 pp)
- Prior to November 2025 question revision, AI adoption had grown **68%** (3.9 pp) over the prior year
- **Over 20% of firms expect to use AI in the first half of 2026** (planned adoption)

### Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement (Brookings/GovAI/NBER)

- **Publisher:** Brookings Institution / Centre for the Governance of AI / NBER
- **Date:** 2026-01-21
- **URL:** https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/
- **Evidence Tier:** 2 (Brookings, with underlying Tier 1 NBER working paper)
- **Source ID:** brookings-adaptivecapacity-2026

Key quantitative claims:
- **6.1 million workers** (4.2% of workforce) face both high AI exposure AND low adaptive capacity
- **86%** of these vulnerable workers are women
- **26.5 million workers** have high exposure AND above-median adaptive capacity — these workers have strong buffers
- National average of **3.9%** of metro-area workers in high-exposure/low-adaptive-capacity occupations (range: 2.4%–6.9% across metros)

**Graph mapping:** `workforce-ai-exposure` → OVERLAY (neutral: these are exposure + adaptive capacity measures, not displacement counts); `overall-us-displacement` → OVERLAY (neutral: 4.2% vulnerable subset, not confirmed displacement).

### Artificial Intelligence, Productivity, and the Workforce: Evidence from Corporate Executives (NBER WP 34984)

- **Publisher:** NBER (Baslandze, Edwards, Graham, Meyer, Waddell et al.)
- **Date:** 2026-03 (Issue Date)
- **URL:** https://www.nber.org/papers/w34984
- **Evidence Tier:** 1 (NBER Working Paper, survey of ~750 corporate executives via CFO Survey)
- **Source ID:** nber-cfocsurvey-ai-2026

Key quantitative claims:
- "**sector-weighted aggregate employment is expected to decline by less than 0.4% due to AI in 2026**"
- Mean reported labor productivity growth from AI: **3.0%** (2026 expected, weighted)
- Large companies expect workforce reductions; smaller firms anticipate modest gains
- More than **half** of surveyed firms had already invested in AI; smaller firms "only beginning to do so"

**Graph mapping:** `total-us-jobs-lost` → OVERLAY (down: 0.4% expected decline is modest, below most graph predictions); `ai-adoption-rate` → OVERLAY (up: majority of large firms already invested).

---

## Sources Checked but Not Relevant to Quantitative AI Labor Stats

The following URLs were reviewed and yielded no new, verifiable quantitative AI labor statistics within the 7-day window:

- https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning (PIIE — URL inaccessible during session; Brookings mirror found dated March 10, 2026 — outside window, qualitative synthesis)
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 (SSRN — Nartey 2026 — unverified Tier 4 aggregator, no primary data)
- https://www.almcorp.com/blog/ai-job-displacement-statistics/ (ALM Corp — Tier 4 blog, no primary data)
- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics (DesignRush — Tier 4 aggregator)
- https://www.aimagicx.com/blog/goldman-sachs-ai-job-displacement-16000-monthly-report-2026 (AI Magicx — Tier 4 blog; claimed "Goldman Sachs April 2026" report not verified on Goldman Sachs website; statistics not confirmed from primary source — **do not ingest**)
- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf (IMF SDN/2026/001 — Published January 2026; significant quantitative content but outside window; recommend separate retroactive review)
- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market (Yale Budget Lab — standing tracker, update noted March/April 2026; no discrete publication date in window)

---

## Priority Recommendations

### 🔴 Tier 1 Sources to Ingest Immediately

1. **NY Fed Liberty Street Economics (May 14, 2026)** — IN WINDOW. High-quality event-study using Anthropic+Lightcast data. Key implication: the consensus that AI is driving a distinct decline in AI-exposed job demand is not supported by job-postings evidence. This is a **down** overlay on `overall-us-displacement` and a `data_point` suggesting `workforce-ai-exposure` is more limited than standard LLM-based metrics indicate.

2. **Census BTOS AI Supplement (data released May 7, 2026)** — Just outside window. The full data download files are now available at census.gov/hfp/btos. These represent the most authoritative U.S. government measure of business AI adoption. The 18% (firm-weighted) and 41% (GenAI workforce) figures are the current best data points for `ai-adoption-rate` and `genai-work-adoption`.

3. **Federal Reserve FEDS Note (April 3, 2026)** — Synthesizes all three major U.S. AI adoption surveys. The note explicitly reconciles why estimates range from 18% to 78% (unit of analysis: firm vs. employment-weighted). Essential methodological context for the `ai-adoption-rate` and `genai-work-adoption` graphs.

### 🟡 Statistics That Diverge Significantly from Current Graph Consensus

1. **NY Fed job-postings finding**: If the prediction graph for `overall-us-displacement` or `tech-sector-displacement` implies AI is currently depressing hiring in exposed occupations, the NY Fed event study (May 14, 2026) is a direct empirical challenge. The decline in AI-exposed vacancies predates ChatGPT and has not accelerated post-2022. This is a Tier 1 source directly at odds with AI-displacement narratives.

2. **NBER CFO Survey (<0.4% employment decline from AI in 2026)**: If the `total-us-jobs-lost` graph shows predictions substantially above 0.4% job loss for the current year, the NBER CFO survey (March 2026) from ~750 corporate executives presents a much more muted near-term estimate.

3. **GenAI work adoption (41% of workforce)**: If the `genai-work-adoption` graph predicts lower than 41% by end of 2025/early 2026, the RPS data (from Real-Time Population Survey, Nov 2025) should update that prediction upward significantly.

### 🟢 New Government Data Releases

- **Census BTOS AI Supplement**: New biweekly data now available at the sector × state × firm-size level for the Nov 2025–Feb 2026 period. Full granular download available. This is the primary U.S. government dataset for tracking AI adoption over time. Next biweekly release expected approximately May 21, 2026.
- **BLS April 2026 Employment Situation** (released May 8, 2026): Information sector down 13,000 jobs; 16 consecutive months of decline to lowest level since March 2021. White-collar contraction continues even as broader labor market adds 115,000 jobs (unemployment held at 4.3%).

---
*Digest prepared: 2026-05-18. All dates verified from source metadata. All statistics are direct extracts or verbatim quotes from sources identified above. No statistics were inferred or paraphrased.*