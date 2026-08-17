1	# AI Labor Research Digest — 2026-08-17
2	
3	## Summary
4	
5	Three substantively new AI labor market sources were identified within the August 10–17, 2026 window. The most significant is a **revised August 12 update** to the Brynjolfsson, Chandar & Chen "Canaries in the Coal Mine?" paper (WATCHLIST: Brynjolfsson), which now shows the entry-level AI employment gap widening to **19%** using ADP payroll data through June 2026 — up from 15% at the July 2025 vintage. The U.S. Census Bureau released new **Household Trends and Outlook Pulse Survey (HTOPS)** data on August 11 showing **55% of U.S. workers** report having used AI on the job. A July 2026 **Apollo Global Management whitepaper** (Tier 2, widely covered this week) uses Anthropic Economic Index adoption data and finds high-exposure occupations experienced a **6.7% decline in real wage growth** post-2023, with no aggregate employment effect. The Brynjolfsson revision is a high-priority Tier 1 find; the Census HTOPS is Tier 1 government data newly released this week.
6	
7	---
8	
9	## Recurring Series Status
10	
11	- **ellucian-highered-ai**: nextExpected 2027-03-01 — not due, no check required.
12	- **Census BTOS** (not formally tracked but monitored): Latest release found is June 18, 2026. No new BTOS release detected in the past 7 days.
13	- **Census HTOPS**: New release dated **August 11, 2026** — "About a Third of Workers Who Used AI in the Last Week Said They Completed Tasks One to Two Hours Faster" (March 2026 survey data). Treated as a standalone Tier 1 data release this week.
14	
15	---
16	
17	## Researcher Watchlist Sweep
18	
19	All 15 researchers have `lastChecked: 2026-04-14` — all are >30 days overdue. Searches conducted for each:
20	
21	| Researcher | Status |
22	|---|---|
23	| **Erik Brynjolfsson** | ✅ NEW — "Canaries in the Coal Mine?" revised August 12, 2026 |
24	| **Bharat Chandar** | ✅ NEW — Co-author on same Canaries revision |
25	| **Ruyu Chen** | ✅ NEW — Co-author on same Canaries revision |
26	| Martha Gimbel | No new publications in last 7 days found |
27	| Daron Acemoglu | No new publications in last 7 days found |
28	| Pascual Restrepo | No new publications in last 7 days found |
29	| James Bessen | No new publications in last 7 days found |
30	| Jed Kolko | No new publications in last 7 days found |
31	| Alex Imas | No new publications in last 7 days found |
32	| Molly Kinder | No new publications in last 7 days found |
33	| Daniel Rock | No new publications in last 7 days found |
34	| Alexander Bick | No new publications in last 7 days found (April 2026 paper "What Work Does Generative AI Do?" pre-dates window) |
35	| David Deming | No new publications in last 7 days found (same April 2026 paper pre-dates window) |
36	| Maria del Rio-Chanona | No new publications in last 7 days found (arXiv review paper is Sept 2025) |
37	| Andrea Eisfeldt | No new publications in last 7 days found |
38	| Neil Thompson | No new publications in last 7 days found |
39	
40	---
41	
42	## New Sources
43	
44	---
45	
46	### Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)
47	
48	- **Publisher:** Stanford Digital Economy Lab
49	- **Date:** 2026-08-12
50	- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
51	- **PDF:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
52	- **Evidence Tier:** 1 (Academic working paper, peer-reviewed institution, ADP administrative payroll microdata covering millions of U.S. workers)
53	- **Source ID:** stanford-del-canaries-aug2026
54	- **WATCHLIST:** Erik Brynjolfsson, Bharat Chandar (Ruyu Chen co-author)
55	- **Dataset:** ADP payroll records through **June 2026** (extended from the prior August 2025 vintage which ran through ~September 2025)
56	
57	**Statistics:**
58	
59	1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
60	   **Type:** OVERLAY (down)
61	   **Value:** −19 (percentage-point shortfall in employment of ages 22–25 in high-AI-exposure occupations relative to less-exposed peers)
62	   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
63	   **Note:** This is an employment (not wage) gap for entry-level workers. Maps to `entry-level-wage-impact` as a directional overlay because it confirms AI is compressing career-entry opportunities; does not map to `overall-us-displacement` (no aggregate job destruction). Use overlay(down) direction.
64	
65	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
66	   **Type:** OVERLAY (up)
67	   **Value:** −11 (percent absolute decline in employment, ages 22–25, two most-exposed quintiles, Nov 2022–Jun 2026)
68	   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
69	   **Note:** Software developers are specifically named as a leading case-study occupation in the paper. Tech-sector signal, not full-economy displacement. OVERLAY only.
70	
71	3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
72	   **Type:** OVERLAY (neutral)
73	   **Value:** 0 (no detectable aggregate economy-wide displacement)
74	   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
75	   **Note:** This is a null finding that serves as a constraint on `overall-us-displacement` predictions — the graph should reflect that observed aggregate displacement remains near zero as of mid-2026.
76	
77	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
78	   **Type:** OVERLAY (up)
79	   **Value:** 19 (shortfall percentage, widened from 15% in July 2025 vintage to 19% as of June 2026)
80	   **Quote:** "This divergence has widened steadily since we first documented it in August 2025: by this same measure, the shortfall was 15% at the July 2025 data vintage and is 19% as of June 2026."
81	   **Note:** The widening of the gap suggests AI exposure is having progressively larger effects over time. OVERLAY (up) on workforce-ai-exposure — increasing AI impact signal.
82	
83	5. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
84	   **Type:** OVERLAY (down)
85	   **Value:** N/A — mechanism note
86	   **Quote:** "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations. The declines are concentrated in occupations where AI usage tends to automate human tasks."
87	   **Note:** Hiring suppression (not layoffs) as the mechanism. Relevant to interpreting entry-level wage impact as operating through reduced employment rather than direct wage cuts.
88	
89	6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
90	   **Type:** OVERLAY (up)
91	   **Value:** N/A — mechanism note (codified vs tacit knowledge)
92	   **Quote:** "Employment has declined among young workers in occupations that rely heavily on codified knowledge: formal, standardized, documented knowledge that can be taught through education, textbooks, or written procedures. In contrast, employment has increased among experienced workers in occupations that rely more heavily on tacit knowledge acquired through practice, mentorship, and repeated exposure to real situations."
93	   **Note:** White-collar professional roles (lawyers, accountants, analysts) rely on codified knowledge and are seeing early-career contraction. OVERLAY (up) on white-collar-professional-displacement.
94	
95	---
96	
97	### About a Third of Workers Who Used AI in the Last Week Said They Completed Tasks One to Two Hours Faster
98	
99	- **Publisher:** U.S. Census Bureau (Household Trends and Outlook Pulse Survey, HTOPS, March 2026 wave)
100	- **Date:** 2026-08-11
101	- **URL:** https://www.census.gov/library/stories/2026/08/ai-use-at-work.html
102	- **Evidence Tier:** 1 (U.S. government survey, ~60,000 household HTOPS panel, nationally representative, March 2026 collection)
103	- **Source ID:** census-htops-ai-work-aug2026
104	
105	**Statistics:**
106	
107	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
108	   **Type:** DATA_POINT
109	   **Value:** 55 (percent of U.S. workers who report using AI on the job for at least one task)
110	   **Quote:** "About 55% of U.S. workers said they have used Artificial Intelligence (AI) on the job for at least one of 11 tasks asked about on the U.S. Census Bureau's March 2026 Household Trends and Outlook Pulse Survey (HTOPS)."
111	   **Note:** This is as of March 2026. "AI" is defined broadly (ML, NLP, virtual agents, voice recognition) and covers "any use" across 11 task types — not GenAI specifically. The unit is broader than GenAI-only measures (which typically show 35–41%). Use as DATA_POINT but flag the broader definition vs. other series. HTOPS question was revised to "any business function" framing.
112	
113	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
114	   **Type:** OVERLAY (up)
115	   **Value:** 24 (percent of AI users at work who reported daily AI use last week)
116	   **Quote:** "About 24% of AI users at work — those who reported using AI for any of the survey's 11 tasks — said they used AI every day in the last week."
117	   **Note:** Intensive margin (daily use rate among AI users). This is 24% of the 55% who use AI at all — so approximately 13% of the full workforce uses AI daily. OVERLAY (up) on genai-work-adoption.
118	
119	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
120	   **Type:** OVERLAY (neutral)
121	   **Value:** N/A — composition note
122	   **Quote:** "The top five ways people said they've used AI at work: 37% said to search for information or technical help. 32% to write communications, documentation or instructions. 32% to generate ideas. 31% to interpret, translate or summarize information. 27% to do administrative tasks."
123	   **Note:** Task composition data. Indicates AI use is dominated by information retrieval and writing assistance — relevant to which occupations and task categories are most affected. Administrative use (27%) is relevant to `customer-service-automation` and `white-collar-professional-displacement` overlays.
124	
125	---
126	
127	### The Impact of AI on the U.S. Labor Market: Early Evidence from Observed Adoption
128	
129	- **Publisher:** Apollo Global Management (authors: Sania Edlich and Torsten Slok)
130	- **Date:** 2026-07-30 (paper date; prominently covered in major press week of August 12, 2026)
131	- **URL:** https://www.apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
132	- **Evidence Tier:** 2 (Industry whitepaper with quasi-experimental DiD methodology using BLS OEWS + Anthropic Economic Index + CPS; not peer-reviewed but rigorous quantitative design; Apollo is a major institutional asset manager with research credibility)
133	- **Source ID:** apollo-ai-labor-market-jul2026
134	- **Note:** Paper published July 30, 2026 — one week before our search window. Featured in Inc.com on August 12, 2026. Included because it gained widespread visibility this week and the Inc.com coverage is within the window. Flag as just outside the 7-day cutoff if strict adherence required.
135	
136	**Statistics:**
137	
138	1. **Graph:** Median Wage Impact (`median-wage-impact`)
139	   **Type:** OVERLAY (down)
140	   **Value:** −6.7 (percent decline in real wage growth for high-AI-exposure occupations post-2023, relative to low-exposure occupations)
141	   **Quote:** "we find that high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage compression rather than workforce reduction."
142	   **Note:** This is a relative decline in real wage *growth*, not a level change in median wages. The DiD design controls for occupation and year fixed effects. Maps as OVERLAY (down) on median-wage-impact — this is not a 2030 prediction but current observed evidence of wage compression. High exposure defined as Anthropic Economic Index ≥ 0.5.
143	
144	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
145	   **Type:** OVERLAY (down)
146	   **Value:** −10.7 (percent decline in real wage growth for bottom wage quartile in high-exposure occupations, post-2023)
147	   **Quote:** "The effect is concentrated among the lowest earners: service workers face a 24.3 percent decline and the bottom wage quartile a 10.7 percent decline, while top earners show no significant effect."
148	   **Note:** The bottom-quartile wage effect (−10.7%) maps to `entry-level-wage-impact`. The service worker estimate (−24.3%) is from a small subsample (n=239) and authors flag it should be "interpreted with caution." Use −10.7% (bottom quartile) as the primary mapping.
149	
150	3. **Graph:** Customer Service Automation (`customer-service-automation`)
151	   **Type:** OVERLAY (up)
152	   **Value:** N/A — exposure signal (Customer Service Reps have Anthropic score 0.70, highest among major occupations)
153	   **Quote:** "Service occupations (such as childcare workers, concierges, waiters, police officers, social workers, and others) had their real wage growth fall by about 24.3% relative to low-exposure occupations after 2023."
154	   **Note:** From Appendix B: Customer Service Representatives (Anthropic score 0.70) have seen −5.3% employment change and +2.6% wage change 2022–2024, suggesting employment suppression is not yet dominant but wage compression is. OVERLAY (up) on customer-service-automation — supports thesis of accelerating automation pressure.
155	
156	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
157	   **Type:** OVERLAY (up)
158	   **Value:** 3.7 (percent of U.S. labor force currently in high-AI-exposure occupations per Anthropic Economic Index ≥ 0.5 threshold)
159	   **Quote:** "5.8 million workers in the U.S. are currently working in high exposure occupations (as defined above), which represents about 3.7% of the U.S. labor force. This number is significantly lower than theoretical estimates have projected over the past three years."
160	   **Note:** This is a *realized adoption* measure, not a theoretical exposure measure. It is explicitly lower than O*NET-based exposure estimates. Maps as OVERLAY on `workforce-ai-exposure` (direction: neutral — adds new "realized" data layer that is lower than existing theoretical estimates on the graph).
161	
162	5. **Graph:** Median Wage Impact (`median-wage-impact`)
163	   **Type:** OVERLAY (down)
164	   **Value:** −28 (billion USD aggregate annual labor income loss, as lower bound)
165	   **Quote:** "it produces a conservative lower-bound estimate of aggregate labor income loss ($28 billion annually across 5.8 million workers), grounding an otherwise theoretical debate in a concrete macroeconomic magnitude."
166	   **Note:** Unit is dollars not %, so cannot be used as DATA_POINT on the % wage-change graph. Record as context. OVERLAY (down) — confirms direction of wage suppression effect.
167	
168	---
169	
170	## Sources Checked but Not Relevant (to This Week's Window)
171	
172	The following sources were fetched or found but date outside the August 10–17, 2026 window or contain no new quantitative AI labor statistics:
173	
174	- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/Manning/Aguirre adaptive capacity article. Published January 21, 2026. Important (NBER WP 34705) but outside window.
175	- **https://www.nber.org/papers/w34859** — NBER WP 34859 "Chaining Tasks, Redefining Work." Issue date February 2026. Outside window; theoretical framework paper with no new employment or wage statistics.
176	- **https://arxiv.org/html/2509.15265v1** — del Rio-Chanona et al., ILO/UCL "AI and jobs: A review." Pre-print dated September 18, 2025. Outside window.
177	- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census BTOS analysis, May 26, 2026. Outside window (last BTOS update found was June 18, 2026).
178	- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Fed FEDS Note on AI adoption monitoring. April 2026. Outside window.
179	- **https://www.inc.com/bruce-crumley/ai-isnt-taking-your-job-its-silently-shrinking-your-paycheck/91389581** — Inc.com news article (Aug 12, 2026) covering the Apollo whitepaper. Tier 3 news coverage; all statistics sourced to Apollo whitepaper above.
180	- **https://www.ilo.org/resource/news/new-ilo-world-bank-paper-highlights-uneven-global-impact-generative-ai-jobs** — ILO-World Bank background study for WDR 2026. No specific date found within window.
181	- **https://www.pwc.com/gx/en/1/services/ai/ai-jobs-barometer.html** — PwC 2026 AI Jobs Barometer. No 2026-08-10+ update found; last known edition was earlier 2026.
182	- **blog.letaido.com, axis-intelligence.com, click-vision.com, designrush.com, sqmagazine.co.uk** — Tier 3–4 aggregator/blog sites. No original data produced this week.
183	- **https://www.brookings.edu/articles/new-evidence-on-data-center-employment-effects/** — Brookings (Bahar & Wright), published August 10, 2026. Relevant to AI infrastructure employment but covers data center construction jobs, not direct AI labor displacement. No quantitative AI displacement statistics.
184	
185	---
186	
187	## Priority Recommendations
188	
189	### Ingest Immediately (Tier 1)
190	
191	1. **Brynjolfsson, Chandar & Chen "Canaries" August 12, 2026 Revision** — The most important find this week. This is the authoritative longitudinal ADP payroll study tracking AI's employment effects. The gap for ages 22–25 has widened to **19%** (from 15% one year ago), extending through **June 2026** data. The codified vs. tacit knowledge mechanism is a new finding that refines understanding of which white-collar roles are contracting. Should be ingested as DATA_POINT updates for `entry-level-wage-impact` (as proxy for entry-level career opportunity decline) and as constraint data on `overall-us-displacement` (no aggregate displacement).
192	
193	2. **Census HTOPS August 11, 2026** — Official U.S. government survey showing **55% of U.S. workers** report job-related AI use as of March 2026. This is a new Tier 1 data point for `genai-work-adoption`. Note: the 55% figure uses a broader AI definition than the RTPS GenAI-specific measure (which shows ~41%). Both should be displayed on the same graph with source labels.
194	
195	### Flag for Discussion (Tier 2)
196	
197	3. **Apollo Global Management whitepaper (July 30, 2026)** — Novel use of Anthropic realized-usage data (not theoretical exposure) as the treatment variable in a DiD regression. The **−6.7% real wage growth** finding for high-exposure occupations is the first causal estimate using observed AI adoption data. Significant divergence from other studies: no employment effect but a real wage suppression effect. Key limitation: only 11 of 800 occupations qualify as "high exposure" under the strict Anthropic score ≥ 0.5 threshold, covering 3.7% of the workforce. The service-worker −24.3% estimate is based on n=239 and should be treated cautiously.
198	
199	### Divergence Alert
200	
201	- The Brynjolfsson et al. "no aggregate job displacement" finding and the Apollo "no employment effects" finding both confirm that `overall-us-displacement` predictions extending above ~5% by 2030 remain unsupported by observed data. Both papers find the action is in **hiring suppression** and **wage compression** rather than mass layoffs — a mechanism that affects `entry-level-wage-impact` and `median-wage-impact` graphs more than displacement graphs.
202	- The Apollo finding of a **6.7% real wage growth decline** for high-exposure workers diverges from the Brynjolfsson et al. finding that "adjustment is occurring through employment rather than base compensation." The two papers use different treatment definitions and time windows; this discrepancy should be flagged on `median-wage-impact`.
203	
204	### New Government Data
205	
206	- **Census HTOPS** is a recurring bimonthly survey. The next wave (May 2026 data) should be watched for. The March 2026 wave reported here is the first to measure AI use across 11 task categories.
207	- No new BTOS release was found in this 7-day window; the last known BTOS AI supplement data was from the June 18, 2026 release.
# AI Labor Research Digest — 2026-08-17

## Summary

Three substantively new AI labor market sources were identified within the August 10–17, 2026 window. The most significant is a **revised August 12 update** to the Brynjolfsson, Chandar & Chen "Canaries in the Coal Mine?" paper (WATCHLIST: Brynjolfsson), which now shows the entry-level AI employment gap widening to **19%** using ADP payroll data through June 2026 — up from 15% at the July 2025 vintage. The U.S. Census Bureau released new **Household Trends and Outlook Pulse Survey (HTOPS)** data on August 11 showing **55% of U.S. workers** report having used AI on the job. A July 2026 **Apollo Global Management whitepaper** (Tier 2, widely covered this week) uses Anthropic Economic Index adoption data and finds high-exposure occupations experienced a **6.7% decline in real wage growth** post-2023, with no aggregate employment effect. The Brynjolfsson revision is a high-priority Tier 1 find; the Census HTOPS is Tier 1 government data newly released this week.

---

## Recurring Series Status

- **ellucian-highered-ai**: nextExpected 2027-03-01 — not due, no check required.
- **Census BTOS** (not formally tracked but monitored): Latest release found is June 18, 2026. No new BTOS release detected in the past 7 days.
- **Census HTOPS**: New release dated **August 11, 2026** — "About a Third of Workers Who Used AI in the Last Week Said They Completed Tasks One to Two Hours Faster" (March 2026 survey data). Treated as a standalone Tier 1 data release this week.

---

## Researcher Watchlist Sweep

All 15 researchers have `lastChecked: 2026-04-14` — all are >30 days overdue. Searches conducted for each:

| Researcher | Status |
|---|---|
| **Erik Brynjolfsson** | ✅ NEW — "Canaries in the Coal Mine?" revised August 12, 2026 |
| **Bharat Chandar** | ✅ NEW — Co-author on same Canaries revision |
| **Ruyu Chen** | ✅ NEW — Co-author on same Canaries revision |
| Martha Gimbel | No new publications in last 7 days found |
| Daron Acemoglu | No new publications in last 7 days found |
| Pascual Restrepo | No new publications in last 7 days found |
| James Bessen | No new publications in last 7 days found |
| Jed Kolko | No new publications in last 7 days found |
| Alex Imas | No new publications in last 7 days found |
| Molly Kinder | No new publications in last 7 days found |
| Daniel Rock | No new publications in last 7 days found |
| Alexander Bick | No new publications in last 7 days found (April 2026 paper "What Work Does Generative AI Do?" pre-dates window) |
| David Deming | No new publications in last 7 days found (same April 2026 paper pre-dates window) |
| Maria del Rio-Chanona | No new publications in last 7 days found (arXiv review paper is Sept 2025) |
| Andrea Eisfeldt | No new publications in last 7 days found |
| Neil Thompson | No new publications in last 7 days found |

---

## New Sources

---

### Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)

- **Publisher:** Stanford Digital Economy Lab
- **Date:** 2026-08-12
- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
- **PDF:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
- **Evidence Tier:** 1 (Academic working paper, peer-reviewed institution, ADP administrative payroll microdata covering millions of U.S. workers)
- **Source ID:** stanford-del-canaries-aug2026
- **WATCHLIST:** Erik Brynjolfsson, Bharat Chandar (Ruyu Chen co-author)
- **Dataset:** ADP payroll records through **June 2026** (extended from the prior August 2025 vintage which ran through ~September 2025)

**Statistics:**

1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −19 (percentage-point shortfall in employment of ages 22–25 in high-AI-exposure occupations relative to less-exposed peers)
   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
   **Note:** This is an employment (not wage) gap for entry-level workers. Maps to `entry-level-wage-impact` as a directional overlay because it confirms AI is compressing career-entry opportunities; does not map to `overall-us-displacement` (no aggregate job destruction). Use overlay(down) direction.

2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −11 (percent absolute decline in employment, ages 22–25, two most-exposed quintiles, Nov 2022–Jun 2026)
   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
   **Note:** Software developers are specifically named as a leading case-study occupation in the paper. Tech-sector signal, not full-economy displacement. OVERLAY only.

3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no detectable aggregate economy-wide displacement)
   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
   **Note:** This is a null finding that serves as a constraint on `overall-us-displacement` predictions — the graph should reflect that observed aggregate displacement remains near zero as of mid-2026.

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 19 (shortfall percentage, widened from 15% in July 2025 vintage to 19% as of June 2026)
   **Quote:** "This divergence has widened steadily since we first documented it in August 2025: by this same measure, the shortfall was 15% at the July 2025 data vintage and is 19% as of June 2026."
   **Note:** The widening of the gap suggests AI exposure is having progressively larger effects over time. OVERLAY (up) on workforce-ai-exposure — increasing AI impact signal.

5. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** N/A — mechanism note
   **Quote:** "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations. The declines are concentrated in occupations where AI usage tends to automate human tasks."
   **Note:** Hiring suppression (not layoffs) as the mechanism. Relevant to interpreting entry-level wage impact as operating through reduced employment rather than direct wage cuts.

6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** N/A — mechanism note (codified vs tacit knowledge)
   **Quote:** "Employment has declined among young workers in occupations that rely heavily on codified knowledge: formal, standardized, documented knowledge that can be taught through education, textbooks, or written procedures. In contrast, employment has increased among experienced workers in occupations that rely more heavily on tacit knowledge acquired through practice, mentorship, and repeated exposure to real situations."
   **Note:** White-collar professional roles (lawyers, accountants, analysts) rely on codified knowledge and are seeing early-career contraction. OVERLAY (up) on white-collar-professional-displacement.

---

### About a Third of Workers Who Used AI in the Last Week Said They Completed Tasks One to Two Hours Faster

- **Publisher:** U.S. Census Bureau (Household Trends and Outlook Pulse Survey, HTOPS, March 2026 wave)
- **Date:** 2026-08-11
- **URL:** https://www.census.gov/library/stories/2026/08/ai-use-at-work.html
- **Evidence Tier:** 1 (U.S. government survey, ~60,000 household HTOPS panel, nationally representative, March 2026 collection)
- **Source ID:** census-htops-ai-work-aug2026

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 55 (percent of U.S. workers who report using AI on the job for at least one task)
   **Quote:** "About 55% of U.S. workers said they have used Artificial Intelligence (AI) on the job for at least one of 11 tasks asked about on the U.S. Census Bureau's March 2026 Household Trends and Outlook Pulse Survey (HTOPS)."
   **Note:** This is as of March 2026. "AI" is defined broadly (ML, NLP, virtual agents, voice recognition) and covers "any use" across 11 task types — not GenAI specifically. The unit is broader than GenAI-only measures (which typically show 35–41%). Use as DATA_POINT but flag the broader definition vs. other series. HTOPS question was revised to "any business function" framing.

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 24 (percent of AI users at work who reported daily AI use last week)
   **Quote:** "About 24% of AI users at work — those who reported using AI for any of the survey's 11 tasks — said they used AI every day in the last week."
   **Note:** Intensive margin (daily use rate among AI users). This is 24% of the 55% who use AI at all — so approximately 13% of the full workforce uses AI daily. OVERLAY (up) on genai-work-adoption.

3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (neutral)
   **Value:** N/A — composition note
   **Quote:** "The top five ways people said they've used AI at work: 37% said to search for information or technical help. 32% to write communications, documentation or instructions. 32% to generate ideas. 31% to interpret, translate or summarize information. 27% to do administrative tasks."
   **Note:** Task composition data. Indicates AI use is dominated by information retrieval and writing assistance — relevant to which occupations and task categories are most affected. Administrative use (27%) is relevant to `customer-service-automation` and `white-collar-professional-displacement` overlays.

---

### The Impact of AI on the U.S. Labor Market: Early Evidence from Observed Adoption

- **Publisher:** Apollo Global Management (authors: Sania Edlich and Torsten Slok)
- **Date:** 2026-07-30 (paper date; prominently covered in major press week of August 12, 2026)
- **URL:** https://www.apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
- **Evidence Tier:** 2 (Industry whitepaper with quasi-experimental DiD methodology using BLS OEWS + Anthropic Economic Index + CPS; not peer-reviewed but rigorous quantitative design; Apollo is a major institutional asset manager with research credibility)
- **Source ID:** apollo-ai-labor-market-jul2026
- **Note:** Paper published July 30, 2026 — one week before our search window. Featured in Inc.com on August 12, 2026. Included because it gained widespread visibility this week and the Inc.com coverage is within the window. Flag as just outside the 7-day cutoff if strict adherence required.

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −6.7 (percent decline in real wage growth for high-AI-exposure occupations post-2023, relative to low-exposure occupations)
   **Quote:** "we find that high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage compression rather than workforce reduction."
   **Note:** This is a relative decline in real wage *growth*, not a level change in median wages. The DiD design controls for occupation and year fixed effects. Maps as OVERLAY (down) on median-wage-impact — this is not a 2030 prediction but current observed evidence of wage compression. High exposure defined as Anthropic Economic Index ≥ 0.5.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −10.7 (percent decline in real wage growth for bottom wage quartile in high-exposure occupations, post-2023)
   **Quote:** "The effect is concentrated among the lowest earners: service workers face a 24.3 percent decline and the bottom wage quartile a 10.7 percent decline, while top earners show no significant effect."
   **Note:** The bottom-quartile wage effect (−10.7%) maps to `entry-level-wage-impact`. The service worker estimate (−24.3%) is from a small subsample (n=239) and authors flag it should be "interpreted with caution." Use −10.7% (bottom quartile) as the primary mapping.

3. **Graph:** Customer Service Automation (`customer-service-automation`)
   **Type:** OVERLAY (up)
   **Value:** N/A — exposure signal (Customer Service Reps have Anthropic score 0.70, highest among major occupations)
   **Quote:** "Service occupations (such as childcare workers, concierges, waiters, police officers, social workers, and others) had their real wage growth fall by about 24.3% relative to low-exposure occupations after 2023."
   **Note:** From Appendix B: Customer Service Representatives (Anthropic score 0.70) have seen −5.3% employment change and +2.6% wage change 2022–2024, suggesting employment suppression is not yet dominant but wage compression is. OVERLAY (up) on customer-service-automation — supports thesis of accelerating automation pressure.

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 3.7 (percent of U.S. labor force currently in high-AI-exposure occupations per Anthropic Economic Index ≥ 0.5 threshold)
   **Quote:** "5.8 million workers in the U.S. are currently working in high exposure occupations (as defined above), which represents about 3.7% of the U.S. labor force. This number is significantly lower than theoretical estimates have projected over the past three years."
   **Note:** This is a *realized adoption* measure, not a theoretical exposure measure. It is explicitly lower than O*NET-based exposure estimates. Maps as OVERLAY on `workforce-ai-exposure` (direction: neutral — adds new "realized" data layer that is lower than existing theoretical estimates on the graph).

5. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −28 (billion USD aggregate annual labor income loss, as lower bound)
   **Quote:** "it produces a conservative lower-bound estimate of aggregate labor income loss ($28 billion annually across 5.8 million workers), grounding an otherwise theoretical debate in a concrete macroeconomic magnitude."
   **Note:** Unit is dollars not %, so cannot be used as DATA_POINT on the % wage-change graph. Record as context. OVERLAY (down) — confirms direction of wage suppression effect.

---

## Sources Checked but Not Relevant (to This Week's Window)

The following sources were fetched or found but date outside the August 10–17, 2026 window or contain no new quantitative AI labor statistics:

- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/Manning/Aguirre adaptive capacity article. Published January 21, 2026. Important (NBER WP 34705) but outside window.
- **https://www.nber.org/papers/w34859** — NBER WP 34859 "Chaining Tasks, Redefining Work." Issue date February 2026. Outside window; theoretical framework paper with no new employment or wage statistics.
- **https://arxiv.org/html/2509.15265v1** — del Rio-Chanona et al., ILO/UCL "AI and jobs: A review." Pre-print dated September 18, 2025. Outside window.
- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census BTOS analysis, May 26, 2026. Outside window (last BTOS update found was June 18, 2026).
- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Fed FEDS Note on AI adoption monitoring. April 2026. Outside window.
- **https://www.inc.com/bruce-crumley/ai-isnt-taking-your-job-its-silently-shrinking-your-paycheck/91389581** — Inc.com news article (Aug 12, 2026) covering the Apollo whitepaper. Tier 3 news coverage; all statistics sourced to Apollo whitepaper above.
- **https://www.ilo.org/resource/news/new-ilo-world-bank-paper-highlights-uneven-global-impact-generative-ai-jobs** — ILO-World Bank background study for WDR 2026. No specific date found within window.
- **https://www.pwc.com/gx/en/1/services/ai/ai-jobs-barometer.html** — PwC 2026 AI Jobs Barometer. No 2026-08-10+ update found; last known edition was earlier 2026.
- **blog.letaido.com, axis-intelligence.com, click-vision.com, designrush.com, sqmagazine.co.uk** — Tier 3–4 aggregator/blog sites. No original data produced this week.
- **https://www.brookings.edu/articles/new-evidence-on-data-center-employment-effects/** — Brookings (Bahar & Wright), published August 10, 2026. Relevant to AI infrastructure employment but covers data center construction jobs, not direct AI labor displacement. No quantitative AI displacement statistics.

---

## Priority Recommendations

### Ingest Immediately (Tier 1)

1. **Brynjolfsson, Chandar & Chen "Canaries" August 12, 2026 Revision** — The most important find this week. This is the authoritative longitudinal ADP payroll study tracking AI's employment effects. The gap for ages 22–25 has widened to **19%** (from 15% one year ago), extending through **June 2026** data. The codified vs. tacit knowledge mechanism is a new finding that refines understanding of which white-collar roles are contracting. Should be ingested as DATA_POINT updates for `entry-level-wage-impact` (as proxy for entry-level career opportunity decline) and as constraint data on `overall-us-displacement` (no aggregate displacement).

2. **Census HTOPS August 11, 2026** — Official U.S. government survey showing **55% of U.S. workers** report job-related AI use as of March 2026. This is a new Tier 1 data point for `genai-work-adoption`. Note: the 55% figure uses a broader AI definition than the RTPS GenAI-specific measure (which shows ~41%). Both should be displayed on the same graph with source labels.

### Flag for Discussion (Tier 2)

3. **Apollo Global Management whitepaper (July 30, 2026)** — Novel use of Anthropic realized-usage data (not theoretical exposure) as the treatment variable in a DiD regression. The **−6.7% real wage growth** finding for high-exposure occupations is the first causal estimate using observed AI adoption data. Significant divergence from other studies: no employment effect but a real wage suppression effect. Key limitation: only 11 of 800 occupations qualify as "high exposure" under the strict Anthropic score ≥ 0.5 threshold, covering 3.7% of the workforce. The service-worker −24.3% estimate is based on n=239 and should be treated cautiously.

### Divergence Alert

- The Brynjolfsson et al. "no aggregate job displacement" finding and the Apollo "no employment effects" finding both confirm that `overall-us-displacement` predictions extending above ~5% by 2030 remain unsupported by observed data. Both papers find the action is in **hiring suppression** and **wage compression** rather than mass layoffs — a mechanism that affects `entry-level-wage-impact` and `median-wage-impact` graphs more than displacement graphs.
- The Apollo finding of a **6.7% real wage growth decline** for high-exposure workers diverges from the Brynjolfsson et al. finding that "adjustment is occurring through employment rather than base compensation." The two papers use different treatment definitions and time windows; this discrepancy should be flagged on `median-wage-impact`.

### New Government Data

- **Census HTOPS** is a recurring bimonthly survey. The next wave (May 2026 data) should be watched for. The March 2026 wave reported here is the first to measure AI use across 11 task categories.
- No new BTOS release was found in this 7-day window; the last known BTOS AI supplement data was from the June 18, 2026 release.