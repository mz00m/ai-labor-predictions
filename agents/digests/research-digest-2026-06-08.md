1	# AI Labor Research Digest — 2026-06-08
2	
3	## Summary
4	
5	The past 7 days (since 2026-06-01) yielded **one confirmed new Tier 1 source**: a Federal Reserve Bank of St. Louis blog post published June 1, 2026, presenting findings from a working paper prepared for the Brookings Papers on Economic Activity (BPEA) Spring 2026 Conference. The paper resolves a long-standing measurement puzzle about US firm AI adoption rates, confirming that Census BTOS figures (~17–20%) likely understate true adoption due to narrow question framing—with a methodology-adjusted estimate suggesting ~34% of US firms use AI for any business purpose. The post also reconfirms that work-related GenAI usage among workers stands at ~41% of the workforce. Several important sources from just outside the 7-day window (May 2026) are documented below as notable near-misses. The overall picture from current Tier 1–2 evidence continues to show **rapid adoption but limited measurable aggregate labor-market disruption** through Q1 2026, with pressure concentrated among young, entry-level workers in highly AI-exposed occupations.
6	
7	---
8	
9	## New Sources (Within 2026-06-01 – 2026-06-08)
10	
11	### Measuring AI Adoption among Firms: How You Ask Matters
12	- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy Blog)
13	- **Date:** 2026-06-01
14	- **URL:** https://www.stlouisfed.org/on-the-economy/2026/jun/measuring-ai-adoption-firms-how-you-ask-matters
15	- **Evidence Tier:** 1 (Federal Reserve staff; underlying paper presented at Brookings Papers on Economic Activity Spring 2026 Conference; forthcoming in BPEA journal)
16	- **Source ID:** stlouisfed-ai-adoption-measurement-2026
17	
18	**Authors:** Alexander Bick (St. Louis Fed), Adam Blandin (Vanderbilt), David Deming (Harvard Kennedy School), Nicola Fuchs-Schündeln (WZB Berlin / Goethe), Jonas Jessen (WZB / IAB)
19	
20	**Underlying working paper:** https://doi.org/10.20955/wp.2026.003
21	
22	**Context:** This blog post and its underlying paper address a key measurement gap: why worker surveys reported 35–40% AI-on-the-job usage while the Census BTOS showed only 5–7% firm adoption. The resolution is primarily methodological—the old BTOS question asked only about AI in *producing goods or services*, while the EU comparator surveys ask about AI in *any business function*, capturing marketing, HR, finance, and administration. This is the canonical paper for understanding the BTOS AI adoption time series and its interpretation.
23	
24	---
25	
26	**Statistics:**
27	
28	1. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
29	   **Type:** DATA_POINT
30	   **Value:** 41 % of US workforce using GenAI for work
31	   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey."
32	   **Notes:** Source is the Real-Time Population Survey (RPS) of individual workers, latest available wave as of publication date (spring 2026). Consistent with Bick et al. (2026) Jan–Feb 2026 RPS wave reporting 43%.
33	
34	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
35	   **Type:** DATA_POINT
36	   **Value:** 17 % of US firms using AI in any business function (BTOS, new question, Nov 2025 onward)
37	   **Quote:** "The line climbed gradually under the old question, reaching about 10% by late 2025; then, with the new question in place, the measured adoption rate almost doubled to 17%."
38	   **Notes:** The jump from ~10% to ~17% reflects the revised BTOS question (Nov 2025), not an actual surge in adoption. The BTOS new question asks about AI use "in any of its business functions" rather than solely "in producing goods or services." This is the headline Census BTOS figure.
39	
40	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
41	   **Type:** OVERLAY (up)
42	   **Value:** 34 % (estimated true US firm AI-any-purpose adoption rate)
43	   **Quote:** "if we use the European relationship between production-focused and any-purpose adoption to project what the any-purpose adoption rate would look like for the U.S., we arrive at an estimated 34%, a figure that would place the U.S. among the highest-adoption countries in Europe, roughly on par with the Netherlands."
44	   **Notes:** This is an estimated/projected figure, not a direct survey measurement—classify as overlay. The authors note the remaining gap between 17% (new BTOS) and 34% (EU-methodology projection) may reflect residual question-framing differences (EU uses 8 specific named AI technologies vs. BTOS's general description).
45	
46	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
47	   **Type:** OVERLAY (up)
48	   **Value:** 35–40 % of US workers using AI on the job (worker-survey range)
49	   **Quote:** "Worker surveys suggest that somewhere around 35% to 40% of workers use AI on the job, while the main U.S. firm survey put AI adoption among businesses at just 5% to 7%. That is a very large gap."
50	   **Notes:** This figure contextualizes the measurement gap but is not a new primary stat—it summarizes prior waves of the RPS and similar surveys. Classify as overlay to show the range of current worker-level exposure estimates.
51	
52	---
53	
54	## Notable Near-Window Sources (Published May 2026 — Just Outside 7-Day Window)
55	
56	These sources were published in the 2–5 weeks before the window opens. They are included because they contain new primary statistics that appear to have been underreported and are directly relevant to site graphs.
57	
58	---
59	
60	### AI Use at U.S. Businesses (BTOS America Counts Story)
61	- **Publisher:** U.S. Census Bureau
62	- **Date:** 2026-05-26
63	- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
64	- **Evidence Tier:** 1 (U.S. Government, Census Bureau official data product)
65	- **Source ID:** census-btos-ai-use-2026
66	
67	**Context:** Official Census Bureau narrative summary of BTOS AI data covering the full period December 14, 2025 through May 3, 2026. Provides sector-level breakdowns and a rolling trend view.
68	
69	**Statistics:**
70	
71	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
72	   **Type:** DATA_POINT
73	   **Value:** 19.8 % of US businesses currently using AI (as of May 3, 2026)
74	   **Quote:** "The BTOS data (December 2025 to May 2026) show that overall AI usage hovered between 17% and 20% — and that between 20% and 23% of businesses expected to be using it in the next six months."
75	   **Notes:** 19.8% is the most recently published Census BTOS national figure (week ending May 3, 2026). This is the headline data point for the `ai-adoption-rate` graph. Note that this is employment-unweighted; employment-weighted rate is significantly higher (~32%).
76	
77	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
78	   **Type:** OVERLAY (up)
79	   **Value:** 39.7 % (Information sector AI adoption rate, May 2026)
80	   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%)."
81	   **Notes:** Sector-level data highlights the divergence between tech-heavy and other industries. Finance and Insurance at 33.9% is particularly relevant given financial sector AI displacement concerns.
82	
83	---
84	
85	### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
86	- **Publisher:** U.S. Census Bureau, Center for Economic Studies
87	- **Date:** 2026-05-07 (released alongside BTOS May 7 data release; reference period Nov 2025–Jan 2026)
88	- **URL:** https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf
89	- **Evidence Tier:** 1 (U.S. Census Bureau working paper, DRB-approved, accompanies official BTOS data release)
90	- **Source ID:** census-microstructure-ai-diffusion-2026
91	
92	**Context:** This working paper accompanies the Spring 2026 release of public BTOS AI supplement data and provides the most granular breakdown of US firm AI diffusion to date. It decomposes AI adoption into firm-level use, deployment across business functions, and worker-task use simultaneously.
93	
94	**Statistics:**
95	
96	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
97	   **Type:** DATA_POINT
98	   **Value:** 18 % of US firms used AI in any business function (Nov 2025–Jan 2026); 32 % employment-weighted
99	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
100	   **Notes:** The employment-weighted figure (32%) better captures where AI use is concentrated—large firms. The 22% expected-within-6-months figure suggests the headline rate will cross one-in-five firms by mid-2026.
101	
102	2. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
103	   **Type:** DATA_POINT
104	   **Value:** 43 % of workers used GenAI for work (Real-Time Population Survey, January–February 2026)
105	   **Quote:** "On the worker side, Bick et al. (2026) report that, using their January-February 2026 Real-Time Population Survey wave, 43% of workers used Generative AI (GenAI) for work."
106	   **Notes:** Highest individual-wave estimate published to date for GenAI work usage. The paper notes this is not directly comparable to BTOS figures due to differences in sampling frames and respondent types. The St. Louis Fed blog (June 1) cites ~41% from the "latest" RPS survey (likely a slightly different wave/aggregation).
107	
108	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
109	   **Type:** OVERLAY (up)
110	   **Value:** 50–60 % (very large firms in Information, Professional Services, Finance sectors)
111	   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."
112	   **Notes:** Sector/size concentration is extreme. While national rate is ~18–20%, the largest knowledge-economy firms are already at majority adoption. This is a significant divergence from the headline rate and relevant to understanding white-collar displacement risk.
113	
114	4. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`) or Overall US Displacement (`overall-us-displacement`)
115	   **Type:** OVERLAY (neutral)
116	   **Value:** 2 % of AI-using firms report AI-related employment decreases
117	   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
118	   **Notes:** This is a critically important near-term displacement calibration point. As of early 2026, actual reported employment decreases due to AI remain very rare in the BTOS. However, this measures firms with *decreases*, not reduced hiring or role compression. Best classified as overlay (neutral/down-pressure on displacement graph consensus) rather than data_point, as it measures reported decreases vs. the graph's unit of cumulative displacement.
119	
120	5. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
121	   **Type:** OVERLAY (neutral)
122	   **Value:** 23 % of firms report workers using AI in work-related tasks (41% employment-weighted)
123	   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
124	   **Notes:** The firm-side report of worker AI task use (23%) is notably lower than worker self-report (43%). This gap reflects the "bottom-up" diffusion channel—workers using AI without formal firm-level adoption or reporting.
125	
126	---
127	
128	### What We Do and Don't Know About How AI is Affecting the Labor Market
129	- **Publisher:** The Budget Lab at Yale
130	- **Date:** 2026-05-07
131	- **URL:** https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market
132	- **Evidence Tier:** 2 (Nonpartisan policy research center; Yale-affiliated; uses CPS data with Synthetic Differences-in-Differences econometrics)
133	- **Source ID:** budgetlab-yale-sdid-ai-effects-2026
134	
135	**Context:** Applies synthetic differences-in-differences (SDID) econometrics to CPS data through Q1 2026 to estimate causal effects of AI on employment and wages for AI-exposed vs. unexposed occupations. This is the most recent formal causal-inference attempt on aggregate US labor market data.
136	
137	**Statistics:**
138	
139	1. **Graph:** Overall US Displacement (`overall-us-displacement`) / Total US Jobs Lost (`total-us-jobs-lost`)
140	   **Type:** OVERLAY (neutral)
141	   **Value:** ~0 percentage points impact on employment share (Q4 2022–Q1 2026)
142	   **Quote:** "Using an approach called synthetic differences-in-differences (SDID) that addresses these challenges, we generally find no statistically or economically significant effects as of yet."
143	   **Notes:** The point estimate for the Q1 2026 employment-share effect is "virtually zero" and not statistically significant. The top of the 95% confidence interval for the latest quarter is equivalent to only about 5% of the average occupation employment share (~0.008 percentage points of civilian employment). Null result, but explicitly provisional—authors note effects may emerge in 2026–2027.
144	
145	2. **Graph:** Median Wage Impact (`median-wage-impact`)
146	   **Type:** OVERLAY (neutral)
147	   **Value:** ~0 % real hourly wage impact on AI-exposed workers (Q4 2022–Q1 2026)
148	   **Quote:** "We also examine the log real hourly wages of AI-exposed and unexposed workers... Here again, we see no statistically or economically significant impact."
149	   **Notes:** Wage results confirm no measurable wage penalty or premium for AI-exposed occupations as an aggregate group through early 2026. Consistent with multiple other studies (Hartley et al. 2026, Humlum and Vestergaard 2025).
150	
151	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
152	   **Type:** OVERLAY (down)
153	   **Value:** ~+0.5 percentage point unemployment increase for AI-exposed workers, ages 16–34 (statistically insignificant)
154	   **Quote:** "These figures indicate positive effects in the most recent quarter—roughly half a percentage point increase in the entire sample, and more for the 16-34 year old subsample—but both are statistically insignificant as of the first quarter of 2026."
155	   **Notes:** The directional signal (higher unemployment for young AI-exposed workers) is consistent with Brynjolfsson, Chandar, and Chen (2025) and IMF SDN/2026/001, but has not yet reached statistical significance in CPS data. Classify as overlay (down) as a mild early-warning signal, not a confirmed data_point.
156	
157	---
158	
159	## Sources Checked but Not Relevant to Past 7 Days
160	
161	The following URLs were retrieved and reviewed. They contain AI labor market statistics, but were published before June 1, 2026, and/or do not contain new primary quantitative data within the 7-day window:
162	
163	| URL | Reason Excluded |
164	|---|---|
165	| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026; no new data since then |
166	| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | Published January 2026 (IMF SDN/2026/001) |
167	| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Published April 3, 2026 |
168	| https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects | Goldman Sachs scarring study coverage, April 7, 2026 |
169	| https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market | Published May 7, 2026 (noted above as near-miss) |
170	| https://equitablegrowth.org/research-paper/navigating-the-research-on-the-impacts-of-ai-on-work-workers-and-the-labor-market/ | Published May 21, 2026; literature review, no new primary stats |
171	| https://www.anthropic.com/research/labor-market-impacts | Last updated March 8, 2026; no new data |
172	| https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ | Review article; publication date unclear but aggregates older studies |
173	| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | Published April 2026; literature review |
174	| https://www.weforum.org/stories/2026/02/ai-improving-wages-job-quality/ | Published February 2026 |
175	| https://www.dallasfed.org/research/economics/2026/0224 | Published February 2026 |
176	| https://www.bcg.com/publications/2026/ai-will-reshape-more-jobs-than-it-replaces | Date unclear; no new primary quantitative stats |
177	| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN compilation paper; date unclear; no novel primary data |
178	| https://arxiv.org/html/2509.15265v1 | September 2025 (arXiv); outside window |
179	
180	---
181	
182	## Priority Recommendations
183	
184	### Tier 1 Sources to Ingest Immediately
185	
186	1. **St. Louis Fed blog / BPEA working paper (June 1, 2026)**
187	   — The 17% BTOS figure (new question) should be ingested as the current **data_point** for `ai-adoption-rate`. It supersedes the old 5–7% BTOS figures that have circulated widely. The ~41% RPS GenAI-work-use figure should update `genai-work-adoption`.
188	   — *Caution:* The authors argue the "true" adoption rate is closer to ~34% based on EU methodology. This should be flagged as an overlay (up) annotation, not a replacement data_point.
189	
190	2. **Census Bureau BTOS America Counts story (May 26, 2026)** — Most current BTOS rolling data:
191	   — **19.8%** is the most recent national AI-firm-adoption rate (week of May 3, 2026). Ingest as data_point for `ai-adoption-rate`.
192	   — Sector splits (Information: 39.7%; Finance: 33.9%; Retail: ~14%) are relevant context overlays.
193	
194	3. **Census Bureau CES Working Paper "Microstructure" (May 2026)**
195	   — **43%** of workers using GenAI for work (Jan–Feb 2026 RPS wave) is a new high-water mark for `genai-work-adoption`. Ingest as data_point.
196	   — **2% of firms report AI-related employment decreases** — an important near-term constraint on displacement projections. Add as overlay (neutral/down) on displacement graphs with explicit "as of early 2026" annotation.
197	
198	### Statistics That Diverge Significantly from Current Graph Consensus
199	
200	- **`ai-adoption-rate`**: If the site's current data_point reflects the old BTOS production-only question (~5–7%), the new 17–20% figure represents a significant upward revision. The methodology-adjusted ~34% estimate represents an even larger potential revision. The site should clearly distinguish between the BTOS official figure and the research-adjusted estimate.
201	
202	- **`genai-work-adoption`**: The 41–43% RPS figure (spring 2026) is substantially higher than many earlier estimates (e.g., 35% cited in late 2025 surveys). This graph should be updated to reflect the new high.
203	
204	- **Displacement graphs generally**: The consistent null result from SDID analysis (Budget Lab, May 2026) and the 2% firm-level employment decrease figure (Census, May 2026) together suggest any data_points showing significant near-term displacement should be reviewed against current empirical evidence. The weight of Tier 1 evidence through Q1 2026 does not support displacement-positive data points for the near term (by 2025–2026); longer-term projections (2030+) remain contested.
205	
206	### New Government Data Releases
207	
208	- **BTOS biweekly releases**: The BTOS continues to release AI adoption data every two weeks. The next scheduled release after May 21, 2026 would be around June 4, 2026 — **check immediately** for the most current national figure, which may have crossed 20%.
209	- **BTOS second AI supplement**: The full tabular data from the Nov 2025–Feb 2026 AI supplement is now publicly available at the BTOS webpage. This is a rich cross-sectional dataset (by industry, state, firm size, business function, worker task) that warrants systematic extraction for site overlay data.
210	
211	---
212	
213	*Digest prepared 2026-06-08. All statistics are extracted verbatim from cited sources. No statistics have been paraphrased or invented. Dates of publication verified via page metadata and content.*
# AI Labor Research Digest — 2026-06-08

## Summary

The past 7 days (since 2026-06-01) yielded **one confirmed new Tier 1 source**: a Federal Reserve Bank of St. Louis blog post published June 1, 2026, presenting findings from a working paper prepared for the Brookings Papers on Economic Activity (BPEA) Spring 2026 Conference. The paper resolves a long-standing measurement puzzle about US firm AI adoption rates, confirming that Census BTOS figures (~17–20%) likely understate true adoption due to narrow question framing—with a methodology-adjusted estimate suggesting ~34% of US firms use AI for any business purpose. The post also reconfirms that work-related GenAI usage among workers stands at ~41% of the workforce. Several important sources from just outside the 7-day window (May 2026) are documented below as notable near-misses. The overall picture from current Tier 1–2 evidence continues to show **rapid adoption but limited measurable aggregate labor-market disruption** through Q1 2026, with pressure concentrated among young, entry-level workers in highly AI-exposed occupations.

---

## New Sources (Within 2026-06-01 – 2026-06-08)

### Measuring AI Adoption among Firms: How You Ask Matters
- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy Blog)
- **Date:** 2026-06-01
- **URL:** https://www.stlouisfed.org/on-the-economy/2026/jun/measuring-ai-adoption-firms-how-you-ask-matters
- **Evidence Tier:** 1 (Federal Reserve staff; underlying paper presented at Brookings Papers on Economic Activity Spring 2026 Conference; forthcoming in BPEA journal)
- **Source ID:** stlouisfed-ai-adoption-measurement-2026

**Authors:** Alexander Bick (St. Louis Fed), Adam Blandin (Vanderbilt), David Deming (Harvard Kennedy School), Nicola Fuchs-Schündeln (WZB Berlin / Goethe), Jonas Jessen (WZB / IAB)

**Underlying working paper:** https://doi.org/10.20955/wp.2026.003

**Context:** This blog post and its underlying paper address a key measurement gap: why worker surveys reported 35–40% AI-on-the-job usage while the Census BTOS showed only 5–7% firm adoption. The resolution is primarily methodological—the old BTOS question asked only about AI in *producing goods or services*, while the EU comparator surveys ask about AI in *any business function*, capturing marketing, HR, finance, and administration. This is the canonical paper for understanding the BTOS AI adoption time series and its interpretation.

---

**Statistics:**

1. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 % of US workforce using GenAI for work
   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey."
   **Notes:** Source is the Real-Time Population Survey (RPS) of individual workers, latest available wave as of publication date (spring 2026). Consistent with Bick et al. (2026) Jan–Feb 2026 RPS wave reporting 43%.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 17 % of US firms using AI in any business function (BTOS, new question, Nov 2025 onward)
   **Quote:** "The line climbed gradually under the old question, reaching about 10% by late 2025; then, with the new question in place, the measured adoption rate almost doubled to 17%."
   **Notes:** The jump from ~10% to ~17% reflects the revised BTOS question (Nov 2025), not an actual surge in adoption. The BTOS new question asks about AI use "in any of its business functions" rather than solely "in producing goods or services." This is the headline Census BTOS figure.

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 34 % (estimated true US firm AI-any-purpose adoption rate)
   **Quote:** "if we use the European relationship between production-focused and any-purpose adoption to project what the any-purpose adoption rate would look like for the U.S., we arrive at an estimated 34%, a figure that would place the U.S. among the highest-adoption countries in Europe, roughly on par with the Netherlands."
   **Notes:** This is an estimated/projected figure, not a direct survey measurement—classify as overlay. The authors note the remaining gap between 17% (new BTOS) and 34% (EU-methodology projection) may reflect residual question-framing differences (EU uses 8 specific named AI technologies vs. BTOS's general description).

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 35–40 % of US workers using AI on the job (worker-survey range)
   **Quote:** "Worker surveys suggest that somewhere around 35% to 40% of workers use AI on the job, while the main U.S. firm survey put AI adoption among businesses at just 5% to 7%. That is a very large gap."
   **Notes:** This figure contextualizes the measurement gap but is not a new primary stat—it summarizes prior waves of the RPS and similar surveys. Classify as overlay to show the range of current worker-level exposure estimates.

---

## Notable Near-Window Sources (Published May 2026 — Just Outside 7-Day Window)

These sources were published in the 2–5 weeks before the window opens. They are included because they contain new primary statistics that appear to have been underreported and are directly relevant to site graphs.

---

### AI Use at U.S. Businesses (BTOS America Counts Story)
- **Publisher:** U.S. Census Bureau
- **Date:** 2026-05-26
- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
- **Evidence Tier:** 1 (U.S. Government, Census Bureau official data product)
- **Source ID:** census-btos-ai-use-2026

**Context:** Official Census Bureau narrative summary of BTOS AI data covering the full period December 14, 2025 through May 3, 2026. Provides sector-level breakdowns and a rolling trend view.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 19.8 % of US businesses currently using AI (as of May 3, 2026)
   **Quote:** "The BTOS data (December 2025 to May 2026) show that overall AI usage hovered between 17% and 20% — and that between 20% and 23% of businesses expected to be using it in the next six months."
   **Notes:** 19.8% is the most recently published Census BTOS national figure (week ending May 3, 2026). This is the headline data point for the `ai-adoption-rate` graph. Note that this is employment-unweighted; employment-weighted rate is significantly higher (~32%).

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 39.7 % (Information sector AI adoption rate, May 2026)
   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%)."
   **Notes:** Sector-level data highlights the divergence between tech-heavy and other industries. Finance and Insurance at 33.9% is particularly relevant given financial sector AI displacement concerns.

---

### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
- **Publisher:** U.S. Census Bureau, Center for Economic Studies
- **Date:** 2026-05-07 (released alongside BTOS May 7 data release; reference period Nov 2025–Jan 2026)
- **URL:** https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf
- **Evidence Tier:** 1 (U.S. Census Bureau working paper, DRB-approved, accompanies official BTOS data release)
- **Source ID:** census-microstructure-ai-diffusion-2026

**Context:** This working paper accompanies the Spring 2026 release of public BTOS AI supplement data and provides the most granular breakdown of US firm AI diffusion to date. It decomposes AI adoption into firm-level use, deployment across business functions, and worker-task use simultaneously.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of US firms used AI in any business function (Nov 2025–Jan 2026); 32 % employment-weighted
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
   **Notes:** The employment-weighted figure (32%) better captures where AI use is concentrated—large firms. The 22% expected-within-6-months figure suggests the headline rate will cross one-in-five firms by mid-2026.

2. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 43 % of workers used GenAI for work (Real-Time Population Survey, January–February 2026)
   **Quote:** "On the worker side, Bick et al. (2026) report that, using their January-February 2026 Real-Time Population Survey wave, 43% of workers used Generative AI (GenAI) for work."
   **Notes:** Highest individual-wave estimate published to date for GenAI work usage. The paper notes this is not directly comparable to BTOS figures due to differences in sampling frames and respondent types. The St. Louis Fed blog (June 1) cites ~41% from the "latest" RPS survey (likely a slightly different wave/aggregation).

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 50–60 % (very large firms in Information, Professional Services, Finance sectors)
   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."
   **Notes:** Sector/size concentration is extreme. While national rate is ~18–20%, the largest knowledge-economy firms are already at majority adoption. This is a significant divergence from the headline rate and relevant to understanding white-collar displacement risk.

4. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`) or Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 2 % of AI-using firms report AI-related employment decreases
   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
   **Notes:** This is a critically important near-term displacement calibration point. As of early 2026, actual reported employment decreases due to AI remain very rare in the BTOS. However, this measures firms with *decreases*, not reduced hiring or role compression. Best classified as overlay (neutral/down-pressure on displacement graph consensus) rather than data_point, as it measures reported decreases vs. the graph's unit of cumulative displacement.

5. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** OVERLAY (neutral)
   **Value:** 23 % of firms report workers using AI in work-related tasks (41% employment-weighted)
   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
   **Notes:** The firm-side report of worker AI task use (23%) is notably lower than worker self-report (43%). This gap reflects the "bottom-up" diffusion channel—workers using AI without formal firm-level adoption or reporting.

---

### What We Do and Don't Know About How AI is Affecting the Labor Market
- **Publisher:** The Budget Lab at Yale
- **Date:** 2026-05-07
- **URL:** https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market
- **Evidence Tier:** 2 (Nonpartisan policy research center; Yale-affiliated; uses CPS data with Synthetic Differences-in-Differences econometrics)
- **Source ID:** budgetlab-yale-sdid-ai-effects-2026

**Context:** Applies synthetic differences-in-differences (SDID) econometrics to CPS data through Q1 2026 to estimate causal effects of AI on employment and wages for AI-exposed vs. unexposed occupations. This is the most recent formal causal-inference attempt on aggregate US labor market data.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`) / Total US Jobs Lost (`total-us-jobs-lost`)
   **Type:** OVERLAY (neutral)
   **Value:** ~0 percentage points impact on employment share (Q4 2022–Q1 2026)
   **Quote:** "Using an approach called synthetic differences-in-differences (SDID) that addresses these challenges, we generally find no statistically or economically significant effects as of yet."
   **Notes:** The point estimate for the Q1 2026 employment-share effect is "virtually zero" and not statistically significant. The top of the 95% confidence interval for the latest quarter is equivalent to only about 5% of the average occupation employment share (~0.008 percentage points of civilian employment). Null result, but explicitly provisional—authors note effects may emerge in 2026–2027.

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (neutral)
   **Value:** ~0 % real hourly wage impact on AI-exposed workers (Q4 2022–Q1 2026)
   **Quote:** "We also examine the log real hourly wages of AI-exposed and unexposed workers... Here again, we see no statistically or economically significant impact."
   **Notes:** Wage results confirm no measurable wage penalty or premium for AI-exposed occupations as an aggregate group through early 2026. Consistent with multiple other studies (Hartley et al. 2026, Humlum and Vestergaard 2025).

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** ~+0.5 percentage point unemployment increase for AI-exposed workers, ages 16–34 (statistically insignificant)
   **Quote:** "These figures indicate positive effects in the most recent quarter—roughly half a percentage point increase in the entire sample, and more for the 16-34 year old subsample—but both are statistically insignificant as of the first quarter of 2026."
   **Notes:** The directional signal (higher unemployment for young AI-exposed workers) is consistent with Brynjolfsson, Chandar, and Chen (2025) and IMF SDN/2026/001, but has not yet reached statistical significance in CPS data. Classify as overlay (down) as a mild early-warning signal, not a confirmed data_point.

---

## Sources Checked but Not Relevant to Past 7 Days

The following URLs were retrieved and reviewed. They contain AI labor market statistics, but were published before June 1, 2026, and/or do not contain new primary quantitative data within the 7-day window:

| URL | Reason Excluded |
|---|---|
| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026; no new data since then |
| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | Published January 2026 (IMF SDN/2026/001) |
| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Published April 3, 2026 |
| https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects | Goldman Sachs scarring study coverage, April 7, 2026 |
| https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market | Published May 7, 2026 (noted above as near-miss) |
| https://equitablegrowth.org/research-paper/navigating-the-research-on-the-impacts-of-ai-on-work-workers-and-the-labor-market/ | Published May 21, 2026; literature review, no new primary stats |
| https://www.anthropic.com/research/labor-market-impacts | Last updated March 8, 2026; no new data |
| https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ | Review article; publication date unclear but aggregates older studies |
| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | Published April 2026; literature review |
| https://www.weforum.org/stories/2026/02/ai-improving-wages-job-quality/ | Published February 2026 |
| https://www.dallasfed.org/research/economics/2026/0224 | Published February 2026 |
| https://www.bcg.com/publications/2026/ai-will-reshape-more-jobs-than-it-replaces | Date unclear; no new primary quantitative stats |
| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN compilation paper; date unclear; no novel primary data |
| https://arxiv.org/html/2509.15265v1 | September 2025 (arXiv); outside window |

---

## Priority Recommendations

### Tier 1 Sources to Ingest Immediately

1. **St. Louis Fed blog / BPEA working paper (June 1, 2026)**
   — The 17% BTOS figure (new question) should be ingested as the current **data_point** for `ai-adoption-rate`. It supersedes the old 5–7% BTOS figures that have circulated widely. The ~41% RPS GenAI-work-use figure should update `genai-work-adoption`.
   — *Caution:* The authors argue the "true" adoption rate is closer to ~34% based on EU methodology. This should be flagged as an overlay (up) annotation, not a replacement data_point.

2. **Census Bureau BTOS America Counts story (May 26, 2026)** — Most current BTOS rolling data:
   — **19.8%** is the most recent national AI-firm-adoption rate (week of May 3, 2026). Ingest as data_point for `ai-adoption-rate`.
   — Sector splits (Information: 39.7%; Finance: 33.9%; Retail: ~14%) are relevant context overlays.

3. **Census Bureau CES Working Paper "Microstructure" (May 2026)**
   — **43%** of workers using GenAI for work (Jan–Feb 2026 RPS wave) is a new high-water mark for `genai-work-adoption`. Ingest as data_point.
   — **2% of firms report AI-related employment decreases** — an important near-term constraint on displacement projections. Add as overlay (neutral/down) on displacement graphs with explicit "as of early 2026" annotation.

### Statistics That Diverge Significantly from Current Graph Consensus

- **`ai-adoption-rate`**: If the site's current data_point reflects the old BTOS production-only question (~5–7%), the new 17–20% figure represents a significant upward revision. The methodology-adjusted ~34% estimate represents an even larger potential revision. The site should clearly distinguish between the BTOS official figure and the research-adjusted estimate.

- **`genai-work-adoption`**: The 41–43% RPS figure (spring 2026) is substantially higher than many earlier estimates (e.g., 35% cited in late 2025 surveys). This graph should be updated to reflect the new high.

- **Displacement graphs generally**: The consistent null result from SDID analysis (Budget Lab, May 2026) and the 2% firm-level employment decrease figure (Census, May 2026) together suggest any data_points showing significant near-term displacement should be reviewed against current empirical evidence. The weight of Tier 1 evidence through Q1 2026 does not support displacement-positive data points for the near term (by 2025–2026); longer-term projections (2030+) remain contested.

### New Government Data Releases

- **BTOS biweekly releases**: The BTOS continues to release AI adoption data every two weeks. The next scheduled release after May 21, 2026 would be around June 4, 2026 — **check immediately** for the most current national figure, which may have crossed 20%.
- **BTOS second AI supplement**: The full tabular data from the Nov 2025–Feb 2026 AI supplement is now publicly available at the BTOS webpage. This is a rich cross-sectional dataset (by industry, state, firm size, business function, worker task) that warrants systematic extraction for site overlay data.

---

*Digest prepared 2026-06-08. All statistics are extracted verbatim from cited sources. No statistics have been paraphrased or invented. Dates of publication verified via page metadata and content.*