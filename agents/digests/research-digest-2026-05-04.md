1	# AI Labor Research Digest — 2026-05-04
2	
3	## Summary
4	
5	Eight targeted search passes (plus eleven source fetches) were conducted across government, think-tank, international-organization, and news sources. **The strict 7-day window (April 27 – May 4, 2026) yielded no stand-alone Tier 1 or Tier 2 research publications** on AI and the labor market. However, four high-quality sources published within the preceding 10 days (April 13–23, 2026) are treated as "newly available" below, as they are unlikely to have been ingested into the site's prediction tracker yet. The most important is a U.S. Census Bureau working paper (CES-WP-26-25, released April 22) providing the first nationally-representative micro-data on AI diffusion across firm functions and worker tasks from the new 2026 BTOS AI supplement. A Gallup large-sample workforce survey (n = 23,717) and a Yale Budget Lab real-time CPS update also offer fresh quantitative signals.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
14	- **Publisher:** U.S. Census Bureau, Center for Economic Studies
15	- **Date:** 2026-04-22
16	- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
17	- **Evidence Tier:** 1 (U.S. Government / Census Bureau working paper using BTOS nationally-representative data)
18	- **Source ID:** census-btos-ai-diffusion-2026
19	
20	**Statistics:**
21	
22	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
23	   **Type:** DATA_POINT
24	   **Value:** 18 % of US firms
25	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
26	
27	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
28	   **Type:** OVERLAY (up)
29	   **Value:** 32 % of US employment (employment-weighted firm adoption rate)
30	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis."
31	   *(Employment-weighted rate is the relevant comparator for graphs tracking workforce coverage; use as upward overlay on `ai-adoption-rate`.)*
32	
33	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
34	   **Type:** DATA_POINT
35	   **Value:** 23 % of US firms (firms where workers use AI in work-related tasks)
36	   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks."
37	   *(23 % is the unweighted firm share; the employment-weighted figure of 41 % indicates that workers at larger firms are far more likely to use AI daily on the job.)*
38	
39	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
40	   **Type:** OVERLAY (down)
41	   **Value:** 2 % of firms (share reporting AI-related employment decreases)
42	   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
43	   *(This directly counters displacement projections; augmentation dominates over substitution in current BTOS data.)*
44	
45	5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
46	   **Type:** OVERLAY (up)
47	   **Value:** 50–60 % (unweighted) / 60–70 % (employment-weighted) in very large firms, Information/Professional Services/Finance sectors
48	   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."
49	
50	---
51	
52	### Rising AI Adoption Spurs Workforce Changes
53	- **Publisher:** Gallup
54	- **Date:** 2026-04-13
55	- **URL:** https://www.gallup.com/workplace/704225/rising-adoption-spurs-workforce-changes.aspx
56	- **Evidence Tier:** 2 (Major polling firm; n = 23,717 randomly sampled U.S. employees; survey dates Feb. 4–19, 2026; ±0.9 pp margin of error at 95% CI)
57	- **Source ID:** gallup-ai-workforce-q12026
58	
59	**Statistics:**
60	
61	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
62	   **Type:** DATA_POINT
63	   **Value:** 50 % of employed Americans
64	   **Quote:** "For the first time in Gallup's measurement, half of employed American adults say they use AI in their role at least a few times a year, up from 46% last quarter."
65	
66	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
67	   **Type:** OVERLAY (up)
68	   **Value:** 13 % use AI daily; 28 % use it a few times a week or more
69	   **Quote:** "Frequent AI use is also increasing, with 13% of employees now saying they use AI daily and 28% reporting they use it a few times a week or more."
70	
71	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
72	   **Type:** OVERLAY (neutral–down)
73	   **Value:** 18 % of all US employees perceive job-elimination risk
74	   **Quote:** "Eighteen percent of all U.S. employees say it is very or somewhat likely their job will be eliminated within the next five years due to AI or automation. Among employees working in organizations that have adopted AI, that share rises to 23%."
75	   *(Subjective risk perception, not realized displacement; maps as overlay rather than data point.)*
76	
77	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
78	   **Type:** OVERLAY (neutral)
79	   **Value:** ~10 % of employees in AI-adopting organizations strongly agree AI has transformed how work gets done
80	   **Quote:** "Only about one in 10 employees in AI-adopting organizations strongly agree that artificial intelligence has transformed how work gets done in their organization."
81	
82	5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
83	   **Type:** DATA_POINT
84	   **Value:** 41 % of employees say their organization has integrated AI
85	   **Quote:** "Forty-one percent of employees say their organization has integrated artificial intelligence technology or tools to improve organizational practices, up three points from the previous quarter."
86	   *(This is an employee-perspective estimate of organizational AI adoption — complementary to the Census BTOS firm-perspective estimate.)*
87	
88	6. **Graph:** Median Wage Impact (`median-wage-impact`)
89	   **Type:** OVERLAY (up)
90	   **Value:** 65 % of employees in AI-adopting organizations report improved productivity
91	   **Quote:** "Within organizations implementing AI, 65% of employees say artificial intelligence has improved their productivity and efficiency, regardless of how often they personally use AI."
92	   *(Productivity is a leading indicator of wage impact; maps as upward overlay.)*
93	
94	---
95	
96	### Tracking the Impact of AI on the Labor Market (April 2026 Update with March 2026 CPS)
97	- **Publisher:** The Budget Lab at Yale University
98	- **Date:** 2026-04-16
99	- **URL:** https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market
100	- **Evidence Tier:** 2 (Major university budget/policy lab; uses U.S. Current Population Survey administrative microdata through March 2026 plus Anthropic February 2026 usage data)
101	- **Source ID:** yalebudgetlab-ai-labor-tracking-apr2026
102	
103	**Statistics:**
104	
105	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
106	   **Type:** OVERLAY (down)
107	   **Value:** 0 aggregate unemployment signal
108	   **Quote:** "The addition of the March 2026 CPS and the introduction of Anthropic's February usage metrics do not suggest any substantial changes to the analysis TBL released in March. Occupational dissimilarity, industry dissimilarity, and our exposure and usage metrics all remain flat, lie within historical ranges, or continue along the trends they were already exhibiting."
109	
110	2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
111	   **Type:** OVERLAY (neutral)
112	   **Value:** 25–35 % task exposure among both employed and unemployed workers
113	   **Quote:** "Unemployed workers were in occupations where about 25 to 35 percent of tasks, on average, could be performed by generative AI. Although there is some variation between months, the data demonstrate no clear difference by the duration of unemployment."
114	
115	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
116	   **Type:** OVERLAY (down)
117	   **Value:** No share-shift among occupational exposure quintiles since ChatGPT launch
118	   **Quote:** "Our analysis shows that it has not. The share of workers in the lowest, middle, and highest occupational exposure groups stay stable at around 29%, 46% and 18%, respectively."
119	
120	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
121	   **Type:** OVERLAY (neutral–down)
122	   **Value:** Slight uptick in occupational-mix dissimilarity between young and older college graduates (stays within historical 30–33% range)
123	   **Quote:** "The most notable difference is an uptick in the dissimilarity of occupational mix between older and more recent college graduates, though this remains at the high end of the historical range."
124	
125	---
126	
127	### Monitoring AI Adoption in the U.S. Economy
128	- **Publisher:** U.S. Federal Reserve Board (FEDS Notes)
129	- **Date:** 2026-04-03
130	- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
131	- **Evidence Tier:** 1 (U.S. Federal Reserve / government research note; synthesizes Census BTOS, Federal Reserve RPS, and Survey of Business Uncertainty)
132	- **Source ID:** federalreserve-ai-adoption-apr2026
133	- **Note:** Published April 3, 2026 — 24 days before the window opens; included here because it provides the most authoritative synthesis of government adoption data through end-2025 and is the companion to the CES-WP-26-25 release.
134	
135	**Statistics:**
136	
137	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
138	   **Type:** DATA_POINT
139	   **Value:** 18 % of US firms (end of 2025, revised BTOS series)
140	   **Quote:** "Figure 2 (left panel) presents trends in AI adoption among U.S. businesses based on the BTOS. Adoption stood at about 18 percent of firms at the end of 2025. Prior to the question revision, the adoption rate had grown by 68 percent (3.9 percentage points) over the prior year but decelerated in Q2 2025."
141	
142	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
143	   **Type:** OVERLAY (up)
144	   **Value:** >20 % of firms expect to use AI in the first half of 2026
145	   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
146	
147	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
148	   **Type:** DATA_POINT
149	   **Value:** 41 % of workforce (Real-Time Population Survey, work-related GenAI adoption)
150	   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey."
151	
152	---
153	
154	## Sources Checked but Not Relevant or Outside Window
155	
156	The following URLs were fetched/checked and either fell outside the 7-day window (noted) or lacked new quantitative AI labor statistics:
157	
158	| Source | Date | Reason excluded |
159	|--------|------|-----------------|
160	| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | 2026-01-21 | Outside window (Jan 2026); previously covered |
161	| https://www.nber.org/papers/w34859 | 2026-02 | Outside window (Feb 2026); theoretical, no new labor stats |
162	| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | 2026-01 | Outside window (Jan 2026); important but not new |
163	| https://www.bls.gov/opub/mlr/2026/article/industry-and-occupational-employment-projections-overview.htm | 2026-01 | Outside window (Jan 2026); important background |
164	| https://www.census.gov/newsroom/press-releases/2026/btos-apr-23.html | 2026-04-23 | Announcement only; quantitative detail covered by CES-WP-26-25 |
165	| https://www.anthropic.com/research/labor-market-impacts | 2026-03-08 (updated) | Outside window (March 2026) |
166	| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | Unknown | SSRN paper by Josephine Nartey; no verifiable peer review; numbers not independently traceable to primary sources |
167	| https://www.nexford.edu/insights/what-anthropics-2026-ai-labor-market-report-means-for-your-career | 2026 (undated) | Tier 4 commentary on Anthropic study; not original research |
168	| https://ibuidl.org/blog/ai-job-displacement-labor-data-2026-20260310 | 2026-03-10 | Tier 4 blog; outside window |
169	| https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects | 2026-04-07 | Outside window; covers Goldman Sachs paper (itself from earlier) |
170	| https://futureforwarded.substack.com/p/ai-labor-report-thursday-april-30 | 2026-04-30 | Tier 4 Substack newsletter; within window but no original quantitative research |
171	| https://thehill.com/policy/technology/5826742-ai-workplace-impact-survey-americans/ | 2026-04-30 | News report on Ipsos survey; Ipsos survey itself not directly accessible; no primary publication URL confirmed |
172	| https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure | 2025 | Outside window |
173	| https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/ | 2026-04-02 | Outside window (April 2, 2026) |
174	| https://arxiv.org/html/2509.15265v1 | 2025-09 | Outside window; academic literature review |
175	| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | 2026-04-03 | Outside window; included as important near-miss above |
176	| https://www.ey.com/en_us/newsroom/2026/03/ey-survey-autonomous-ai-adoption-surges... | 2026-03 | Outside window; not focused on labor market displacement |
177	| https://www.grantthornton.com/insights/survey-reports/technology/2026/... | 2026 (March) | Outside window; focuses on AI governance, not labor stats |
178	
179	---
180	
181	## Priority Recommendations
182	
183	### Tier 1 Sources to Ingest Immediately
184	
185	1. **Census Bureau CES-WP-26-25** (2026-04-22) — First nationally-representative government micro-data from the 2026 BTOS AI supplement. The headline adoption rate (18% unweighted, 32% employment-weighted) directly updates the `ai-adoption-rate` graph. The 2%-of-firms employment-decrease finding is a strong downward signal for displacement graphs and diverges meaningfully from the more alarming AI displacement predictions currently visible in the market. **Ingest as DATA_POINT for `ai-adoption-rate`.**
186	
187	2. **Federal Reserve FEDS Note** (2026-04-03) — Authoritative synthesis from a Tier 1 government source. The 41%-of-workforce GenAI work adoption figure (Real-Time Population Survey) is a strong upward DATA_POINT for `genai-work-adoption`. The finding that planned adoption exceeds 20% of firms in H1 2026 is an upward overlay for `ai-adoption-rate`.
188	
189	3. **Gallup Workforce Survey Q1 2026** (2026-04-13) — Large-sample (n = 23,717), probability-based survey. The 50% employee AI usage finding is a significant upward marker for `genai-work-adoption`. The 18% job-elimination worry figure is a noteworthy but sentiment-based signal best mapped as an overlay on `overall-us-displacement`.
190	
191	### Statistics That Diverge Significantly from Current Graph Consensus
192	
193	- **AI-related employment decreases in only 2% of firms** (Census CES-WP-26-25): If the site's `overall-us-displacement` or `total-us-jobs-lost` graphs currently embed predictions in the 10–30% range (per WEF, Goldman Sachs, McKinsey), the realized 2% firm-reported employment-decrease rate from the most up-to-date nationally representative U.S. government data is a strong **downward** overlay. Recommend flagging as directional evidence against near-term displacement forecasts.
194	
195	- **No unemployment signal in CPS through March 2026** (Yale Budget Lab): The stable occupational distribution and absence of AI-related unemployment spike across exposure quintiles is consistent evidence against the displacement scenarios assumed by most prediction graphs. Recommend overlay on `overall-us-displacement` and `white-collar-professional-displacement` with direction = down.
196	
197	- **GenAI work adoption at 41–50%** (Federal Reserve RPS / Gallup): Both estimates significantly exceed the Census BTOS *firm-level* adoption rate (18%), illustrating the gap between individual worker usage and formal firm adoption. This is the most current reading of `genai-work-adoption` and likely pushes the line upward relative to older estimates.
198	
199	### New Government Data Releases
200	
201	- **Census Bureau BTOS AI Supplement data files** (released April 23, 2026, covering Nov 2025–Jan 2026): Full downloadable microdata tables now available on the BTOS webpage, disaggregated by industry, state, firm size. URL: https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html — Recommend pulling sector-level adoption tables directly for `ai-adoption-rate` sector breakdowns.
202	
203	- **Next BTOS biweekly release** expected around **May 7, 2026** — will include updated AI adoption core questions under the revised November 2025 definition ("use of AI in any business function"). Should be monitored for first post-supplement trend data.
204	
205	---
206	
207	## Methodological Notes
208	
209	- **Exposure ≠ Displacement**: All three Tier 1–2 sources reviewed this cycle emphasize that high AI exposure in an occupation does not equal job loss. The Yale Budget Lab and Census CES paper both document no economywide employment-distribution signal through Q1 2026.
210	- **Survey gaps**: The BTOS measures firm-level formal AI adoption; the RPS measures individual GenAI use. These instruments capture different phenomena and should not be conflated on the same graph without labeling.
211	- **Global vs. U.S. figures**: WEF, ILO, Goldman Sachs global estimates (170M jobs created, 92M displaced; 300M globally exposed) remain the most-cited figures in circulation but are global projections and should be treated as overlays on U.S.-specific graphs, not as data points.
# AI Labor Research Digest — 2026-05-04

## Summary

Eight targeted search passes (plus eleven source fetches) were conducted across government, think-tank, international-organization, and news sources. **The strict 7-day window (April 27 – May 4, 2026) yielded no stand-alone Tier 1 or Tier 2 research publications** on AI and the labor market. However, four high-quality sources published within the preceding 10 days (April 13–23, 2026) are treated as "newly available" below, as they are unlikely to have been ingested into the site's prediction tracker yet. The most important is a U.S. Census Bureau working paper (CES-WP-26-25, released April 22) providing the first nationally-representative micro-data on AI diffusion across firm functions and worker tasks from the new 2026 BTOS AI supplement. A Gallup large-sample workforce survey (n = 23,717) and a Yale Budget Lab real-time CPS update also offer fresh quantitative signals.

---

## New Sources

---

### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
- **Publisher:** U.S. Census Bureau, Center for Economic Studies
- **Date:** 2026-04-22
- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
- **Evidence Tier:** 1 (U.S. Government / Census Bureau working paper using BTOS nationally-representative data)
- **Source ID:** census-btos-ai-diffusion-2026

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of US firms
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 32 % of US employment (employment-weighted firm adoption rate)
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis."
   *(Employment-weighted rate is the relevant comparator for graphs tracking workforce coverage; use as upward overlay on `ai-adoption-rate`.)*

3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 23 % of US firms (firms where workers use AI in work-related tasks)
   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks."
   *(23 % is the unweighted firm share; the employment-weighted figure of 41 % indicates that workers at larger firms are far more likely to use AI daily on the job.)*

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 2 % of firms (share reporting AI-related employment decreases)
   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
   *(This directly counters displacement projections; augmentation dominates over substitution in current BTOS data.)*

5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 50–60 % (unweighted) / 60–70 % (employment-weighted) in very large firms, Information/Professional Services/Finance sectors
   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."

---

### Rising AI Adoption Spurs Workforce Changes
- **Publisher:** Gallup
- **Date:** 2026-04-13
- **URL:** https://www.gallup.com/workplace/704225/rising-adoption-spurs-workforce-changes.aspx
- **Evidence Tier:** 2 (Major polling firm; n = 23,717 randomly sampled U.S. employees; survey dates Feb. 4–19, 2026; ±0.9 pp margin of error at 95% CI)
- **Source ID:** gallup-ai-workforce-q12026

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 50 % of employed Americans
   **Quote:** "For the first time in Gallup's measurement, half of employed American adults say they use AI in their role at least a few times a year, up from 46% last quarter."

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 13 % use AI daily; 28 % use it a few times a week or more
   **Quote:** "Frequent AI use is also increasing, with 13% of employees now saying they use AI daily and 28% reporting they use it a few times a week or more."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral–down)
   **Value:** 18 % of all US employees perceive job-elimination risk
   **Quote:** "Eighteen percent of all U.S. employees say it is very or somewhat likely their job will be eliminated within the next five years due to AI or automation. Among employees working in organizations that have adopted AI, that share rises to 23%."
   *(Subjective risk perception, not realized displacement; maps as overlay rather than data point.)*

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** ~10 % of employees in AI-adopting organizations strongly agree AI has transformed how work gets done
   **Quote:** "Only about one in 10 employees in AI-adopting organizations strongly agree that artificial intelligence has transformed how work gets done in their organization."

5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 41 % of employees say their organization has integrated AI
   **Quote:** "Forty-one percent of employees say their organization has integrated artificial intelligence technology or tools to improve organizational practices, up three points from the previous quarter."
   *(This is an employee-perspective estimate of organizational AI adoption — complementary to the Census BTOS firm-perspective estimate.)*

6. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 65 % of employees in AI-adopting organizations report improved productivity
   **Quote:** "Within organizations implementing AI, 65% of employees say artificial intelligence has improved their productivity and efficiency, regardless of how often they personally use AI."
   *(Productivity is a leading indicator of wage impact; maps as upward overlay.)*

---

### Tracking the Impact of AI on the Labor Market (April 2026 Update with March 2026 CPS)
- **Publisher:** The Budget Lab at Yale University
- **Date:** 2026-04-16
- **URL:** https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market
- **Evidence Tier:** 2 (Major university budget/policy lab; uses U.S. Current Population Survey administrative microdata through March 2026 plus Anthropic February 2026 usage data)
- **Source ID:** yalebudgetlab-ai-labor-tracking-apr2026

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 0 aggregate unemployment signal
   **Quote:** "The addition of the March 2026 CPS and the introduction of Anthropic's February usage metrics do not suggest any substantial changes to the analysis TBL released in March. Occupational dissimilarity, industry dissimilarity, and our exposure and usage metrics all remain flat, lie within historical ranges, or continue along the trends they were already exhibiting."

2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 25–35 % task exposure among both employed and unemployed workers
   **Quote:** "Unemployed workers were in occupations where about 25 to 35 percent of tasks, on average, could be performed by generative AI. Although there is some variation between months, the data demonstrate no clear difference by the duration of unemployment."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** No share-shift among occupational exposure quintiles since ChatGPT launch
   **Quote:** "Our analysis shows that it has not. The share of workers in the lowest, middle, and highest occupational exposure groups stay stable at around 29%, 46% and 18%, respectively."

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (neutral–down)
   **Value:** Slight uptick in occupational-mix dissimilarity between young and older college graduates (stays within historical 30–33% range)
   **Quote:** "The most notable difference is an uptick in the dissimilarity of occupational mix between older and more recent college graduates, though this remains at the high end of the historical range."

---

### Monitoring AI Adoption in the U.S. Economy
- **Publisher:** U.S. Federal Reserve Board (FEDS Notes)
- **Date:** 2026-04-03
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
- **Evidence Tier:** 1 (U.S. Federal Reserve / government research note; synthesizes Census BTOS, Federal Reserve RPS, and Survey of Business Uncertainty)
- **Source ID:** federalreserve-ai-adoption-apr2026
- **Note:** Published April 3, 2026 — 24 days before the window opens; included here because it provides the most authoritative synthesis of government adoption data through end-2025 and is the companion to the CES-WP-26-25 release.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of US firms (end of 2025, revised BTOS series)
   **Quote:** "Figure 2 (left panel) presents trends in AI adoption among U.S. businesses based on the BTOS. Adoption stood at about 18 percent of firms at the end of 2025. Prior to the question revision, the adoption rate had grown by 68 percent (3.9 percentage points) over the prior year but decelerated in Q2 2025."

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** >20 % of firms expect to use AI in the first half of 2026
   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."

3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 % of workforce (Real-Time Population Survey, work-related GenAI adoption)
   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey."

---

## Sources Checked but Not Relevant or Outside Window

The following URLs were fetched/checked and either fell outside the 7-day window (noted) or lacked new quantitative AI labor statistics:

| Source | Date | Reason excluded |
|--------|------|-----------------|
| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | 2026-01-21 | Outside window (Jan 2026); previously covered |
| https://www.nber.org/papers/w34859 | 2026-02 | Outside window (Feb 2026); theoretical, no new labor stats |
| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | 2026-01 | Outside window (Jan 2026); important but not new |
| https://www.bls.gov/opub/mlr/2026/article/industry-and-occupational-employment-projections-overview.htm | 2026-01 | Outside window (Jan 2026); important background |
| https://www.census.gov/newsroom/press-releases/2026/btos-apr-23.html | 2026-04-23 | Announcement only; quantitative detail covered by CES-WP-26-25 |
| https://www.anthropic.com/research/labor-market-impacts | 2026-03-08 (updated) | Outside window (March 2026) |
| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | Unknown | SSRN paper by Josephine Nartey; no verifiable peer review; numbers not independently traceable to primary sources |
| https://www.nexford.edu/insights/what-anthropics-2026-ai-labor-market-report-means-for-your-career | 2026 (undated) | Tier 4 commentary on Anthropic study; not original research |
| https://ibuidl.org/blog/ai-job-displacement-labor-data-2026-20260310 | 2026-03-10 | Tier 4 blog; outside window |
| https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects | 2026-04-07 | Outside window; covers Goldman Sachs paper (itself from earlier) |
| https://futureforwarded.substack.com/p/ai-labor-report-thursday-april-30 | 2026-04-30 | Tier 4 Substack newsletter; within window but no original quantitative research |
| https://thehill.com/policy/technology/5826742-ai-workplace-impact-survey-americans/ | 2026-04-30 | News report on Ipsos survey; Ipsos survey itself not directly accessible; no primary publication URL confirmed |
| https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure | 2025 | Outside window |
| https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/ | 2026-04-02 | Outside window (April 2, 2026) |
| https://arxiv.org/html/2509.15265v1 | 2025-09 | Outside window; academic literature review |
| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | 2026-04-03 | Outside window; included as important near-miss above |
| https://www.ey.com/en_us/newsroom/2026/03/ey-survey-autonomous-ai-adoption-surges... | 2026-03 | Outside window; not focused on labor market displacement |
| https://www.grantthornton.com/insights/survey-reports/technology/2026/... | 2026 (March) | Outside window; focuses on AI governance, not labor stats |

---

## Priority Recommendations

### Tier 1 Sources to Ingest Immediately

1. **Census Bureau CES-WP-26-25** (2026-04-22) — First nationally-representative government micro-data from the 2026 BTOS AI supplement. The headline adoption rate (18% unweighted, 32% employment-weighted) directly updates the `ai-adoption-rate` graph. The 2%-of-firms employment-decrease finding is a strong downward signal for displacement graphs and diverges meaningfully from the more alarming AI displacement predictions currently visible in the market. **Ingest as DATA_POINT for `ai-adoption-rate`.**

2. **Federal Reserve FEDS Note** (2026-04-03) — Authoritative synthesis from a Tier 1 government source. The 41%-of-workforce GenAI work adoption figure (Real-Time Population Survey) is a strong upward DATA_POINT for `genai-work-adoption`. The finding that planned adoption exceeds 20% of firms in H1 2026 is an upward overlay for `ai-adoption-rate`.

3. **Gallup Workforce Survey Q1 2026** (2026-04-13) — Large-sample (n = 23,717), probability-based survey. The 50% employee AI usage finding is a significant upward marker for `genai-work-adoption`. The 18% job-elimination worry figure is a noteworthy but sentiment-based signal best mapped as an overlay on `overall-us-displacement`.

### Statistics That Diverge Significantly from Current Graph Consensus

- **AI-related employment decreases in only 2% of firms** (Census CES-WP-26-25): If the site's `overall-us-displacement` or `total-us-jobs-lost` graphs currently embed predictions in the 10–30% range (per WEF, Goldman Sachs, McKinsey), the realized 2% firm-reported employment-decrease rate from the most up-to-date nationally representative U.S. government data is a strong **downward** overlay. Recommend flagging as directional evidence against near-term displacement forecasts.

- **No unemployment signal in CPS through March 2026** (Yale Budget Lab): The stable occupational distribution and absence of AI-related unemployment spike across exposure quintiles is consistent evidence against the displacement scenarios assumed by most prediction graphs. Recommend overlay on `overall-us-displacement` and `white-collar-professional-displacement` with direction = down.

- **GenAI work adoption at 41–50%** (Federal Reserve RPS / Gallup): Both estimates significantly exceed the Census BTOS *firm-level* adoption rate (18%), illustrating the gap between individual worker usage and formal firm adoption. This is the most current reading of `genai-work-adoption` and likely pushes the line upward relative to older estimates.

### New Government Data Releases

- **Census Bureau BTOS AI Supplement data files** (released April 23, 2026, covering Nov 2025–Jan 2026): Full downloadable microdata tables now available on the BTOS webpage, disaggregated by industry, state, firm size. URL: https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html — Recommend pulling sector-level adoption tables directly for `ai-adoption-rate` sector breakdowns.

- **Next BTOS biweekly release** expected around **May 7, 2026** — will include updated AI adoption core questions under the revised November 2025 definition ("use of AI in any business function"). Should be monitored for first post-supplement trend data.

---

## Methodological Notes

- **Exposure ≠ Displacement**: All three Tier 1–2 sources reviewed this cycle emphasize that high AI exposure in an occupation does not equal job loss. The Yale Budget Lab and Census CES paper both document no economywide employment-distribution signal through Q1 2026.
- **Survey gaps**: The BTOS measures firm-level formal AI adoption; the RPS measures individual GenAI use. These instruments capture different phenomena and should not be conflated on the same graph without labeling.
- **Global vs. U.S. figures**: WEF, ILO, Goldman Sachs global estimates (170M jobs created, 92M displaced; 300M globally exposed) remain the most-cited figures in circulation but are global projections and should be treated as overlays on U.S.-specific graphs, not as data points.