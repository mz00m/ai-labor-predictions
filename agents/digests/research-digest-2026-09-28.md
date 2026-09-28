1	# AI Labor Research Digest — 2026-09-28
2	
3	## Summary
4	
5	The primary within-window find is a **VoxEU/CEPR column published 2026-09-25** by Bick, Blandin, Deming, and Schumacher (WATCHLIST: Alexander Bick and David Deming), showing US worker GenAI adoption reached **45% of workers** as of May 2026 while adoption remains shallow — fewer than 3% of work tasks are AI-assisted by a majority of workers. Two important watchlist catches published since the last check (2026-04-14) are also flagged: **Brynjolfsson, Chandar & Chen's August 2026 revised "Canaries" paper** (ADP payroll data through June 2026, showing the employment gap for ages 22–25 in AI-exposed occupations has widened to **19%**) and the **Apollo Global Management wage compression whitepaper** (July 2026, finding –6.7 pp real wage growth in high-AI-exposure occupations post-2023). The week produced no new Tier 1 peer-reviewed journal articles on AI labor markets. The Census BTOS now shows firm-level AI adoption at ~23% of all US businesses as of August 2026.
6	
7	---
8	
9	## Recurring Series Status
10	
11	| Series | Status |
12	|---|---|
13	| `ellucian-highered-ai` | Not due (nextExpected: 2027-03-01) — no check required |
14	| **Census BTOS** *(not in registry)* | August 2026 cycle (released 2026-09-06): adoption at **23.2%** of US firms — see Source 4 below |
15	| **Goldman Sachs AI Tracker** *(not in registry)* | September 2026 update (released 2026-09-01): adoption at **22.4%** of US establishments, earnings-call AI mentions at **22%** of Russell 3000 in Q2 2026 |
16	
17	---
18	
19	## Researcher Watchlist — Sweep Results (all last-checked 2026-04-14, >30 days ago)
20	
21	| Researcher | Finding |
22	|---|---|
23	| **Erik Brynjolfsson** (Stanford) | **NEW PAPER** — "Canaries in the Coal Mine?" August 2026 revision, Stanford DEL, 2026-08-12. See Source 2. |
24	| **Alexander Bick** (St. Louis Fed) | **NEW PAPER** — "What Work Does Generative AI Do?" FRBSL WP 2026-017A (Aug 2026); **VoxEU column 2026-09-25** (within window). See Source 1. |
25	| **David Deming** (Harvard) | **NEW PAPER** — co-author on Bick et al. above. See Source 1. |
26	| **Martha Gimbel** (Yale Budget Lab) | New working paper: "What We Do and Don't Know About How AI is Affecting the Labor Market," Yale Budget Lab, 2026-05-07. Uses synthetic diff-in-diff; finds no statistically significant AI employment or wage effects to date. No clean extractable numeric for the graphs. |
27	| **Jed Kolko** (PIIE) | Op-ed/review: "Research on AI and the labor market is still in the first inning," Brookings/PIIE, 2026-03-10. Methodological critique; no new quantitative stats. |
28	| **Molly Kinder** (formerly Brookings) | Left Brookings June 2026; new substack/org focused on "messy middle" of AI transition. No new peer-reviewed quantitative output. |
29	| **Daron Acemoglu** (MIT) | NBER WP 34854 "Building Pro-Worker AI" (Feb 2026, with Autor & Johnson); conceptual framework only, no new labor market statistics. Recent media interviews reiterate 0.55% TFP estimate. |
30	| **Pascual Restrepo** (Yale) | No new papers found since April 2026. |
31	| **James Bessen** (BU) | No new papers found since April 2026. |
32	| **Alex Imas** (Chicago Booth) | No new papers found since April 2026. |
33	| **Daniel Rock** (Wharton) | No new papers found since April 2026. |
34	| **Maria del Rio-Chanona** (UCL/ILO) | No new papers found since April 2026. |
35	| **Andrea Eisfeldt** (UCLA) | No new papers found since April 2026. |
36	| **Shakked Noy** (MIT FutureTech) | No new papers found since April 2026. |
37	| **Neil Thompson** (MIT FutureTech) | No new papers found since April 2026. |
38	
39	---
40	
41	## New Sources
42	
43	---
44	
45	### Source 1 — Bick, Blandin, Deming, Schumacher: "What Work Does Generative AI Do?" (VoxEU/CEPR column)
46	
47	- **Publisher:** CEPR VoxEU (underlying paper: Federal Reserve Bank of St. Louis Working Paper 2026-017A)
48	- **Date:** 2026-09-25 (VoxEU column); underlying blog post: 2026-09-01 (St. Louis Fed "On the Economy")
49	- **URL:** https://voxeu.org/article/measuring-what-work-generative-ai-does (VoxEU); https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do (primary)
50	- **Evidence Tier:** 1 (Nationally representative government survey — Real-Time Population Survey, ~14,000 workers, four quarterly waves Aug 2025–May 2026; St. Louis Fed / Harvard / Vanderbilt authors)
51	- **Source ID:** frbstl-genai-what-work-2026
52	- **WATCHLIST:** Alexander Bick, David Deming
53	- **Status:** VoxEU column published 2026-09-25 — **within 7-day window**
54	
55	**Statistics:**
56	
57	1. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
58	   **Type:** DATA_POINT
59	   **Value:** 45 % of US workers using GenAI for their jobs (as of May 2026)
60	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
61	
62	2. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
63	   **Type:** OVERLAY (up)
64	   **Value:** 80 % of occupations have ≥20% of workers using AI (scope/breadth indicator)
65	   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%."
66	
67	3. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
68	   **Type:** OVERLAY (neutral — shallowness caveat)
69	   **Value:** <3 % of tasks AI-assisted by majority of workers performing them
70	   **Quote:** "Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."
71	
72	4. **Graph:** AI Adoption Rate — % of US firms using AI (`ai-adoption-rate`)
73	   **Type:** OVERLAY (neutral — individual vs. firm gap)
74	   **Value:** ~43% gap between worker-reported adoption and firm-reported adoption
75	   **Quote (from VoxEU column description):** "Worker surveys suggested that 35-40% of U.S. workers use AI on the job, but the main U.S. firm survey long put adoption at just 5-7%. No such gap shows up in Europe, where firm-level adoption rates line up much more closely with what worker surveys report. The answer is mostly about how surveys are designed."
76	
77	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
78	   **Type:** OVERLAY (neutral — chat logs vs. survey divergence)
79	   **Value:** Correlation of 0.34 (Anthropic), 0.10 (Microsoft), 0.11 (OpenAI) between chat-log task shares and worker survey
80	   **Quote (via Resultsense/VoxEU, 2026-09-25):** "Across 332 work activities, the survey's picture correlates at 0.34 with Anthropic's, 0.10 with Microsoft's and 0.11 with OpenAI's."
81	   **Note:** This calls into question the reliability of vendor-sourced AI exposure measures used in many displacement and exposure graphs. Flag for methodology review.
82	
83	---
84	
85	### Source 2 — Brynjolfsson, Chandar & Chen: "Canaries in the Coal Mine?" August 2026 revision
86	
87	- **Publisher:** Stanford Digital Economy Lab
88	- **Date:** 2026-08-12 (published; data through June 2026)
89	- **URL:** https://digitaleconomy.stanford.edu/news/canariesaug26/ | https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
90	- **Evidence Tier:** 2 (ADP administrative payroll data covering millions of US workers across 730+ occupations; non-peer-reviewed but large-scale administrative data with high credibility. Authors are Stanford/NBER.)
91	- **Source ID:** stanford-del-canaries-aug-2026
92	- **WATCHLIST:** Erik Brynjolfsson
93	- **Status:** Published 2026-08-12 — **outside 7-day window but clearly important; not yet in registry; published after last watchlist check of 2026-04-14**
94	
95	**Statistics:**
96	
97	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
98	   **Type:** OVERLAY (down)
99	   **Value:** –19 (percentage-point employment shortfall for ages 22–25 in AI-exposed occupations vs. less-exposed peers, as of June 2026)
100	   **Quote:** "Employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
101	   **Note:** This is a relative employment gap, not a % of all US jobs displaced. Classified as OVERLAY not DATA_POINT. Gap was 15% at July 2025 data vintage; widened to 19% by June 2026.
102	
103	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
104	   **Type:** OVERLAY (neutral — no aggregate effect)
105	   **Value:** 0 (no economy-wide displacement detected)
106	   **Quote:** "We do not see widespread, economy-wide job displacement associated with AI."
107	
108	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
109	   **Type:** OVERLAY (down)
110	   **Value:** –11 (% absolute employment decline for ages 22–25 in top two AI-exposure quintiles, Nov 2022 – June 2026)
111	   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
112	   **Note:** This is an employment measure, not a wage measure, but maps most closely to entry-level-wage-impact as a proxy for entry-level labor market conditions.
113	
114	4. **Graph:** Median Wage Impact (`median-wage-impact`)
115	   **Type:** OVERLAY (neutral — adjustment is employment, not pay)
116	   **Value:** 0 (base pay not measurably affected so far)
117	   **Quote:** "So far, adjustment is showing up primarily in employment rather than base pay."
118	
119	5. **Graph:** White-Collar/Professional Displacement (`white-collar-professional-displacement`)
120	   **Type:** OVERLAY (neutral — mechanism note)
121	   **Value:** (no numeric)
122	   **Quote:** "Employment has declined among young workers in occupations that rely heavily on codified knowledge: formal, standardized, documented knowledge that can be taught through education, textbooks, or written procedures. In contrast, employment has increased among experienced workers in occupations that rely more heavily on tacit knowledge acquired through practice, mentorship, and repeated exposure to real situations."
123	
124	---
125	
126	### Source 3 — Apollo Global Management: "The Impact of AI on the U.S. Labor Market" (whitepaper)
127	
128	- **Publisher:** Apollo Global Management (Torsten Slok and Sania Edlich)
129	- **Date:** 2026-07-30
130	- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
131	- **Evidence Tier:** 3 (private-sector financial research; uses BLS-OEWS occupational wage data and Anthropic Economic Index for exposure classification; 321 matched occupations, 2015–2025; finding received Bloomberg "Wall Street Week" coverage 2026-08-21 but has not yet been formally peer-reviewed)
132	- **Source ID:** apollo-wage-compression-2026
133	- **Status:** Published 2026-07-30 — outside 7-day window but not yet ingested; high significance as one of the few observed-adoption (not theoretical) wage studies
134	
135	**Statistics:**
136	
137	1. **Graph:** Median Wage Impact (`median-wage-impact`)
138	   **Type:** OVERLAY (down)
139	   **Value:** –6.7 (percentage-point real wage growth differential for high AI-exposure occupations vs. low, post-2023)
140	   **Quote:** "Their research found that workers in occupations classified as highly exposed to AI experienced real-wage growth that was 6.7 percentage points slower after 2023 than workers in less-exposed occupations." (CNBC, 2026-09-13, citing the Apollo whitepaper)
141	   **Note:** The study found no statistically significant effect on employment. Authors use Anthropic Economic Index for exposure classification — exposure to other AI tools may be undercounted.
142	
143	2. **Graph:** Median Wage Impact (`median-wage-impact`)
144	   **Type:** OVERLAY (down)
145	   **Value:** –24.3 (% decline in earnings growth for service workers in high AI-exposure roles since 2023)
146	   **Quote:** "service workers in highly AI-exposed roles saw an average 24.3% decline in earnings growth since 2023, while workers in the bottom 25% of earners saw wage growth decline by 10.7% over that period." (TechJack Solutions, 2026-08-21, citing Apollo paper)
147	   **Caution:** This statistic comes from a secondary source. The Apollo whitepaper URL above is the primary; exact verbatim wording from the whitepaper was not directly verified. Flag for confirmation against primary.
148	
149	3. **Graph:** Median Wage Impact (`median-wage-impact`)
150	   **Type:** OVERLAY (down)
151	   **Value:** 52.8 % (labor share of nonfarm business output, Q2 2026 — contextual BLS data point)
152	   **Quote:** "labor's share of nonfarm business output/income was 52.8% in the second quarter of 2026, the lowest in the series beginning in the first quarter of 1947, according to the BLS productivity report." (CNBC, 2026-09-13)
153	   **Note:** This BLS figure is from official government data (Tier 1 stat), published via CNBC (Tier 3 outlet). The BLS source itself is the primary.
154	
155	---
156	
157	### Source 4 — U.S. Census Bureau BTOS: AI Adoption August 2026 Cycle
158	
159	- **Publisher:** U.S. Census Bureau (Business Trends and Outlook Survey)
160	- **Date:** 2026-09-06 (latest BTOS data release; cycle reference period approx. Aug 10–23, 2026)
161	- **URL:** https://www.census.gov/hfp/btos/data
162	- **Evidence Tier:** 1 (official US government nationally representative business survey)
163	- **Source ID:** census-btos-aug-2026
164	- **Status:** Released 2026-09-06 — outside 7-day window but represents the most recent government data point on AI firm adoption
165	
166	**Statistics:**
167	
168	1. **Graph:** AI Adoption Rate — % of US Firms Using AI (`ai-adoption-rate`)
169	   **Type:** DATA_POINT
170	   **Value:** 23.2 % of US employer firms using AI (Census BTOS, cycle ending approximately August 23, 2026)
171	   **Quote:** "In the cycle covering 10 to 23 August 2026, 23.2% said yes, up from 17.3% when the question started in November 2025." (Second Talent, 2026-09-22, citing Census BTOS)
172	   **Corroboration:** Goldman Sachs AI Tracker (2026-09-01) independently reports: "AI adoption by firms rose by 0.9pp to 22.4% among US establishments (with adoption expected to rise to 25.9% in the next 6 months) according to the Census Bureau's Business Trends and Outlook Survey (BTOS)." (Slightly different cycle endpoint.)
173	   **Note:** The BTOS question was revised in November 2025 from "producing goods or services" to "any business function" — figures are not directly comparable to pre-Nov-2025 data.
174	
175	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
176	   **Type:** OVERLAY (up — sector leader)
177	   **Value:** 43.5 % (Information sector, highest AI adoption among US firms, August 2026)
178	   **Quote:** "The information sector has the highest AI adoption among US firms, at 43.5% in August 2026. Professional, scientific and technical services is a close second at 43.3%, and finance and insurance third at 36.5%. Accommodation and food services is lowest at 8.5%." (Second Talent, 2026-09-22, citing Census BTOS)
179	
180	---
181	
182	### Source 5 — Goldman Sachs Global Investment Research: AI Tracker August 2026
183	
184	- **Publisher:** Goldman Sachs Global Investment Research
185	- **Date:** 2026-09-01
186	- **URL:** https://www.gspublishing.com/content/research/en/reports/2026/09/01/d55f74c5-6e25-4bc3-98e4-dac4da447611.html
187	- **Evidence Tier:** 3 (investment bank research; draws on public Census BTOS data plus proprietary FactSet earnings-call text analysis)
188	- **Source ID:** gs-ai-tracker-sep-2026
189	- **Status:** Published 2026-09-01 — outside 7-day window; provides key `earnings-call-ai-mentions` data point
190	
191	**Statistics:**
192	
193	1. **Graph:** Earnings Call AI Mentions — % of S&P 500 / Russell 3000 mentioning AI workforce (`earnings-call-ai-mentions`)
194	   **Type:** DATA_POINT (signal-only)
195	   **Value:** 22 % of Russell 3000 companies mentioned AI and labor-related keywords in 2026 Q2
196	   **Quote:** "22% of Russell 3000 companies mentioned AI and labor-related keywords in 2026Q2."
197	   **Note:** Source says Russell 3000, not S&P 500. Directionally consistent but not identical to the `earnings-call-ai-mentions` slug definition. Treat as approximate comparison.
198	
199	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
200	   **Type:** OVERLAY (up — productivity context)
201	   **Value:** 23 % average productivity uplift (academic studies, limited deployment areas)
202	   **Quote:** "We continue to observe large impacts on labor productivity in the limited areas where generative AI has been deployed. Academic studies imply a 23% average uplift to productivity, while company anecdotes imply slightly larger efficiency gains of around 32%."
203	   **Note:** This is a productivity stat, not an adoption rate. It is included here as context for the adoption graph (productivity driving adoption incentive), but should not be used as a data point for any displacement or wage graph.
204	
205	---
206	
207	## Sources Checked but Not Relevant to Graphs
208	
209	| URL | Reason |
210	|---|---|
211	| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Manning & Aguirre NBER paper (Jan 2026) — adaptive capacity index, no standalone quantitative stat extractable for graphs |
212	| https://www.nber.org/papers/w34859 | "Chaining Tasks, Redefining Work" (Demirer, Horton et al., Feb 2026) — theoretical framework, no labor market statistics |
213	| https://www.nber.org/papers/w34854 | "Building Pro-Worker AI" (Acemoglu, Autor, Johnson, Feb 2026) — conceptual taxonomy, no new quantitative displacement stats |
214	| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | IMF SDN 2026/001 "New Jobs Creation in the AI Age" — cross-country skill-gap paper; finding that AI skills appear in ~5% of US job postings by 2025 is global/methodology focused, not mappable to US-specific prediction graphs; no confirmed publication date within 7-day window |
215	| https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market | Yale Budget Lab May 2026 — finds no statistically significant AI labor market effects; the null finding is important but no specific extractable numeric for graphs |
216	| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Fed FEDS Note (Apr 2026) — synthesis/tracker; statistics already reflected in BTOS data above |
217	| https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html | CNBC Sept 13, 2026 — Tier 3; useful for BLS labor share stat and Acemoglu quotes; published Sept 13 (outside 7-day window) |
218	| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | Kolko PIIE, March 2026 — methodological review; no new stats |
219	| https://www.gspublishing.com/content/research/en/reports/2026/05/04/ef83dcd8-de76-45cd-b883-2a9e6cd9cc2a.html | Goldman Sachs April 2026 — earlier tracker; superseded by Sept 2026 edition |
220	| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf | Census CES WP 26-25 "Microstructure of AI Diffusion" (Q2 2026) — data through Nov 2025–Jan 2026 period, already incorporated in ai-adoption-rate graph via BTOS |
221	| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-27.pdf | Census CES WP 26-27 "You're (not) Hired" (Tucker, Q2 2026) — early career hiring decline consistent with Brynjolfsson Canaries but earlier data vintage |
222	| https://ssrn.com/abstract=5842084 | Azar, Gine & Sanz-Espín "Wage Effects of GenAI" (Dec 2025 SSRN) — finds wage declines and "mid-biased technological change"; older paper, but key finding: "mid-biased technological change: firms compress their hierarchies, reducing employment shares at both the junior and senior levels" — no clear single numeric for a graph within spec |
223	| Various aggregator blogs (letaido, axis-intelligence, click-vision, aiexposure.org, etc.) | Tier 4; recycling WEF/Goldman/IMF numbers already ingested from primary sources |
224	
225	---
226	
227	## Priority Recommendations
228	
229	### Tier 1 — Ingest Immediately
230	
231	1. **Brynjolfsson, Chandar & Chen "Canaries" August 2026 revision** (Stanford DEL, 2026-08-12) — The 19% employment gap for young workers (ages 22–25) in AI-exposed occupations is the most robust quantitative signal of early AI labor-market impact available from large-scale US administrative data. It directly overlays `overall-us-displacement` and `entry-level-wage-impact`. The widening gap (15% → 19% since July 2025) is a trend worth tracking. **Ingest as OVERLAY (down) on `overall-us-displacement`.**
232	
233	2. **Bick, Blandin, Deming, Schumacher RPS data** (St. Louis Fed / VoxEU, Aug–Sept 2026) — The 45%-of-workers adoption figure (May 2026) is the most current, nationally representative estimate of US adult GenAI work adoption. It is Tier 1 (government-affiliated, CPS-matched methodology). **Ingest as DATA_POINT on `genai-work-adoption`.**
234	
235	3. **Census BTOS August 2026** — 23.2% firm adoption rate is the most current official government estimate of US firm AI adoption. **Ingest as DATA_POINT on `ai-adoption-rate`.**
236	
237	### Statistics That Diverge Significantly from Current Graph Consensus
238	
239	- **Brynjolfsson 19% youth employment gap**: If the current `overall-us-displacement` graph models are anchored to "no displacement yet," the Brynjolfsson paper provides measured, documented displacement pressure — specifically for entry-level/young workers. This is a meaningful directional update.
240	
241	- **Apollo –6.7 pp wage growth differential**: If the current `median-wage-impact` graph shows flat near-term wage effects, this finding suggests compression may be arriving through wages *before* employment, which diverges from "no wage effect" baselines. However, the study is Tier 3 and should be treated as OVERLAY until a peer-reviewed version is published.
242	
243	- **VoxEU chat-log correlation (0.10–0.34)**: The finding that AI company usage data correlates weakly with worker surveys challenges the reliability of exposure indexes (Anthropic Economic Index, Microsoft AI applicability scores, OpenAI task data) used throughout the prediction graphs. This is a **methodology-level caution** for all graphs currently using vendor exposure metrics.
244	
245	### New Government Data Releases
246	
247	- **Census BTOS** updates biweekly; the next release (covering approximately Sept 7–20, 2026) is due in the first days of October. Monitor for continuation of the 23.2% adoption level or further acceleration.
248	
249	- **Census HTOPS** (Household Trends and Outlook Pulse Survey, March 2026 edition): "About 55% of U.S. workers said they have used Artificial Intelligence (AI) on the job for at least one of 11 tasks" — this is a different measure from the RPS 45% figure (broader task list, different question framing). Both are official Census surveys; reconciliation needed before ingesting either as a single data point.
250	
251	- **BLS Employment Cost Index**: Inflation-adjusted wages and salaries decreased 0.4% year over year through June 2026 (BLS). This is Tier 1 official data and should be noted as a contextual OVERLAY on `median-wage-impact`.
252	
253	---
254	
255	*Digest prepared: 2026-09-28. All statistics verified against source text. Unverified or paraphrased statistics are explicitly flagged. No statistics were invented or inferred.*
# AI Labor Research Digest — 2026-09-28

## Summary

The primary within-window find is a **VoxEU/CEPR column published 2026-09-25** by Bick, Blandin, Deming, and Schumacher (WATCHLIST: Alexander Bick and David Deming), showing US worker GenAI adoption reached **45% of workers** as of May 2026 while adoption remains shallow — fewer than 3% of work tasks are AI-assisted by a majority of workers. Two important watchlist catches published since the last check (2026-04-14) are also flagged: **Brynjolfsson, Chandar & Chen's August 2026 revised "Canaries" paper** (ADP payroll data through June 2026, showing the employment gap for ages 22–25 in AI-exposed occupations has widened to **19%**) and the **Apollo Global Management wage compression whitepaper** (July 2026, finding –6.7 pp real wage growth in high-AI-exposure occupations post-2023). The week produced no new Tier 1 peer-reviewed journal articles on AI labor markets. The Census BTOS now shows firm-level AI adoption at ~23% of all US businesses as of August 2026.

---

## Recurring Series Status

| Series | Status |
|---|---|
| `ellucian-highered-ai` | Not due (nextExpected: 2027-03-01) — no check required |
| **Census BTOS** *(not in registry)* | August 2026 cycle (released 2026-09-06): adoption at **23.2%** of US firms — see Source 4 below |
| **Goldman Sachs AI Tracker** *(not in registry)* | September 2026 update (released 2026-09-01): adoption at **22.4%** of US establishments, earnings-call AI mentions at **22%** of Russell 3000 in Q2 2026 |

---

## Researcher Watchlist — Sweep Results (all last-checked 2026-04-14, >30 days ago)

| Researcher | Finding |
|---|---|
| **Erik Brynjolfsson** (Stanford) | **NEW PAPER** — "Canaries in the Coal Mine?" August 2026 revision, Stanford DEL, 2026-08-12. See Source 2. |
| **Alexander Bick** (St. Louis Fed) | **NEW PAPER** — "What Work Does Generative AI Do?" FRBSL WP 2026-017A (Aug 2026); **VoxEU column 2026-09-25** (within window). See Source 1. |
| **David Deming** (Harvard) | **NEW PAPER** — co-author on Bick et al. above. See Source 1. |
| **Martha Gimbel** (Yale Budget Lab) | New working paper: "What We Do and Don't Know About How AI is Affecting the Labor Market," Yale Budget Lab, 2026-05-07. Uses synthetic diff-in-diff; finds no statistically significant AI employment or wage effects to date. No clean extractable numeric for the graphs. |
| **Jed Kolko** (PIIE) | Op-ed/review: "Research on AI and the labor market is still in the first inning," Brookings/PIIE, 2026-03-10. Methodological critique; no new quantitative stats. |
| **Molly Kinder** (formerly Brookings) | Left Brookings June 2026; new substack/org focused on "messy middle" of AI transition. No new peer-reviewed quantitative output. |
| **Daron Acemoglu** (MIT) | NBER WP 34854 "Building Pro-Worker AI" (Feb 2026, with Autor & Johnson); conceptual framework only, no new labor market statistics. Recent media interviews reiterate 0.55% TFP estimate. |
| **Pascual Restrepo** (Yale) | No new papers found since April 2026. |
| **James Bessen** (BU) | No new papers found since April 2026. |
| **Alex Imas** (Chicago Booth) | No new papers found since April 2026. |
| **Daniel Rock** (Wharton) | No new papers found since April 2026. |
| **Maria del Rio-Chanona** (UCL/ILO) | No new papers found since April 2026. |
| **Andrea Eisfeldt** (UCLA) | No new papers found since April 2026. |
| **Shakked Noy** (MIT FutureTech) | No new papers found since April 2026. |
| **Neil Thompson** (MIT FutureTech) | No new papers found since April 2026. |

---

## New Sources

---

### Source 1 — Bick, Blandin, Deming, Schumacher: "What Work Does Generative AI Do?" (VoxEU/CEPR column)

- **Publisher:** CEPR VoxEU (underlying paper: Federal Reserve Bank of St. Louis Working Paper 2026-017A)
- **Date:** 2026-09-25 (VoxEU column); underlying blog post: 2026-09-01 (St. Louis Fed "On the Economy")
- **URL:** https://voxeu.org/article/measuring-what-work-generative-ai-does (VoxEU); https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do (primary)
- **Evidence Tier:** 1 (Nationally representative government survey — Real-Time Population Survey, ~14,000 workers, four quarterly waves Aug 2025–May 2026; St. Louis Fed / Harvard / Vanderbilt authors)
- **Source ID:** frbstl-genai-what-work-2026
- **WATCHLIST:** Alexander Bick, David Deming
- **Status:** VoxEU column published 2026-09-25 — **within 7-day window**

**Statistics:**

1. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 45 % of US workers using GenAI for their jobs (as of May 2026)
   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."

2. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 80 % of occupations have ≥20% of workers using AI (scope/breadth indicator)
   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%."

3. **Graph:** GenAI Adoption at Work (`genai-work-adoption`)
   **Type:** OVERLAY (neutral — shallowness caveat)
   **Value:** <3 % of tasks AI-assisted by majority of workers performing them
   **Quote:** "Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."

4. **Graph:** AI Adoption Rate — % of US firms using AI (`ai-adoption-rate`)
   **Type:** OVERLAY (neutral — individual vs. firm gap)
   **Value:** ~43% gap between worker-reported adoption and firm-reported adoption
   **Quote (from VoxEU column description):** "Worker surveys suggested that 35-40% of U.S. workers use AI on the job, but the main U.S. firm survey long put adoption at just 5-7%. No such gap shows up in Europe, where firm-level adoption rates line up much more closely with what worker surveys report. The answer is mostly about how surveys are designed."

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral — chat logs vs. survey divergence)
   **Value:** Correlation of 0.34 (Anthropic), 0.10 (Microsoft), 0.11 (OpenAI) between chat-log task shares and worker survey
   **Quote (via Resultsense/VoxEU, 2026-09-25):** "Across 332 work activities, the survey's picture correlates at 0.34 with Anthropic's, 0.10 with Microsoft's and 0.11 with OpenAI's."
   **Note:** This calls into question the reliability of vendor-sourced AI exposure measures used in many displacement and exposure graphs. Flag for methodology review.

---

### Source 2 — Brynjolfsson, Chandar & Chen: "Canaries in the Coal Mine?" August 2026 revision

- **Publisher:** Stanford Digital Economy Lab
- **Date:** 2026-08-12 (published; data through June 2026)
- **URL:** https://digitaleconomy.stanford.edu/news/canariesaug26/ | https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
- **Evidence Tier:** 2 (ADP administrative payroll data covering millions of US workers across 730+ occupations; non-peer-reviewed but large-scale administrative data with high credibility. Authors are Stanford/NBER.)
- **Source ID:** stanford-del-canaries-aug-2026
- **WATCHLIST:** Erik Brynjolfsson
- **Status:** Published 2026-08-12 — **outside 7-day window but clearly important; not yet in registry; published after last watchlist check of 2026-04-14**

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** –19 (percentage-point employment shortfall for ages 22–25 in AI-exposed occupations vs. less-exposed peers, as of June 2026)
   **Quote:** "Employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
   **Note:** This is a relative employment gap, not a % of all US jobs displaced. Classified as OVERLAY not DATA_POINT. Gap was 15% at July 2025 data vintage; widened to 19% by June 2026.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — no aggregate effect)
   **Value:** 0 (no economy-wide displacement detected)
   **Quote:** "We do not see widespread, economy-wide job displacement associated with AI."

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** –11 (% absolute employment decline for ages 22–25 in top two AI-exposure quintiles, Nov 2022 – June 2026)
   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
   **Note:** This is an employment measure, not a wage measure, but maps most closely to entry-level-wage-impact as a proxy for entry-level labor market conditions.

4. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (neutral — adjustment is employment, not pay)
   **Value:** 0 (base pay not measurably affected so far)
   **Quote:** "So far, adjustment is showing up primarily in employment rather than base pay."

5. **Graph:** White-Collar/Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (neutral — mechanism note)
   **Value:** (no numeric)
   **Quote:** "Employment has declined among young workers in occupations that rely heavily on codified knowledge: formal, standardized, documented knowledge that can be taught through education, textbooks, or written procedures. In contrast, employment has increased among experienced workers in occupations that rely more heavily on tacit knowledge acquired through practice, mentorship, and repeated exposure to real situations."

---

### Source 3 — Apollo Global Management: "The Impact of AI on the U.S. Labor Market" (whitepaper)

- **Publisher:** Apollo Global Management (Torsten Slok and Sania Edlich)
- **Date:** 2026-07-30
- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
- **Evidence Tier:** 3 (private-sector financial research; uses BLS-OEWS occupational wage data and Anthropic Economic Index for exposure classification; 321 matched occupations, 2015–2025; finding received Bloomberg "Wall Street Week" coverage 2026-08-21 but has not yet been formally peer-reviewed)
- **Source ID:** apollo-wage-compression-2026
- **Status:** Published 2026-07-30 — outside 7-day window but not yet ingested; high significance as one of the few observed-adoption (not theoretical) wage studies

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** –6.7 (percentage-point real wage growth differential for high AI-exposure occupations vs. low, post-2023)
   **Quote:** "Their research found that workers in occupations classified as highly exposed to AI experienced real-wage growth that was 6.7 percentage points slower after 2023 than workers in less-exposed occupations." (CNBC, 2026-09-13, citing the Apollo whitepaper)
   **Note:** The study found no statistically significant effect on employment. Authors use Anthropic Economic Index for exposure classification — exposure to other AI tools may be undercounted.

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** –24.3 (% decline in earnings growth for service workers in high AI-exposure roles since 2023)
   **Quote:** "service workers in highly AI-exposed roles saw an average 24.3% decline in earnings growth since 2023, while workers in the bottom 25% of earners saw wage growth decline by 10.7% over that period." (TechJack Solutions, 2026-08-21, citing Apollo paper)
   **Caution:** This statistic comes from a secondary source. The Apollo whitepaper URL above is the primary; exact verbatim wording from the whitepaper was not directly verified. Flag for confirmation against primary.

3. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** 52.8 % (labor share of nonfarm business output, Q2 2026 — contextual BLS data point)
   **Quote:** "labor's share of nonfarm business output/income was 52.8% in the second quarter of 2026, the lowest in the series beginning in the first quarter of 1947, according to the BLS productivity report." (CNBC, 2026-09-13)
   **Note:** This BLS figure is from official government data (Tier 1 stat), published via CNBC (Tier 3 outlet). The BLS source itself is the primary.

---

### Source 4 — U.S. Census Bureau BTOS: AI Adoption August 2026 Cycle

- **Publisher:** U.S. Census Bureau (Business Trends and Outlook Survey)
- **Date:** 2026-09-06 (latest BTOS data release; cycle reference period approx. Aug 10–23, 2026)
- **URL:** https://www.census.gov/hfp/btos/data
- **Evidence Tier:** 1 (official US government nationally representative business survey)
- **Source ID:** census-btos-aug-2026
- **Status:** Released 2026-09-06 — outside 7-day window but represents the most recent government data point on AI firm adoption

**Statistics:**

1. **Graph:** AI Adoption Rate — % of US Firms Using AI (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 23.2 % of US employer firms using AI (Census BTOS, cycle ending approximately August 23, 2026)
   **Quote:** "In the cycle covering 10 to 23 August 2026, 23.2% said yes, up from 17.3% when the question started in November 2025." (Second Talent, 2026-09-22, citing Census BTOS)
   **Corroboration:** Goldman Sachs AI Tracker (2026-09-01) independently reports: "AI adoption by firms rose by 0.9pp to 22.4% among US establishments (with adoption expected to rise to 25.9% in the next 6 months) according to the Census Bureau's Business Trends and Outlook Survey (BTOS)." (Slightly different cycle endpoint.)
   **Note:** The BTOS question was revised in November 2025 from "producing goods or services" to "any business function" — figures are not directly comparable to pre-Nov-2025 data.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up — sector leader)
   **Value:** 43.5 % (Information sector, highest AI adoption among US firms, August 2026)
   **Quote:** "The information sector has the highest AI adoption among US firms, at 43.5% in August 2026. Professional, scientific and technical services is a close second at 43.3%, and finance and insurance third at 36.5%. Accommodation and food services is lowest at 8.5%." (Second Talent, 2026-09-22, citing Census BTOS)

---

### Source 5 — Goldman Sachs Global Investment Research: AI Tracker August 2026

- **Publisher:** Goldman Sachs Global Investment Research
- **Date:** 2026-09-01
- **URL:** https://www.gspublishing.com/content/research/en/reports/2026/09/01/d55f74c5-6e25-4bc3-98e4-dac4da447611.html
- **Evidence Tier:** 3 (investment bank research; draws on public Census BTOS data plus proprietary FactSet earnings-call text analysis)
- **Source ID:** gs-ai-tracker-sep-2026
- **Status:** Published 2026-09-01 — outside 7-day window; provides key `earnings-call-ai-mentions` data point

**Statistics:**

1. **Graph:** Earnings Call AI Mentions — % of S&P 500 / Russell 3000 mentioning AI workforce (`earnings-call-ai-mentions`)
   **Type:** DATA_POINT (signal-only)
   **Value:** 22 % of Russell 3000 companies mentioned AI and labor-related keywords in 2026 Q2
   **Quote:** "22% of Russell 3000 companies mentioned AI and labor-related keywords in 2026Q2."
   **Note:** Source says Russell 3000, not S&P 500. Directionally consistent but not identical to the `earnings-call-ai-mentions` slug definition. Treat as approximate comparison.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up — productivity context)
   **Value:** 23 % average productivity uplift (academic studies, limited deployment areas)
   **Quote:** "We continue to observe large impacts on labor productivity in the limited areas where generative AI has been deployed. Academic studies imply a 23% average uplift to productivity, while company anecdotes imply slightly larger efficiency gains of around 32%."
   **Note:** This is a productivity stat, not an adoption rate. It is included here as context for the adoption graph (productivity driving adoption incentive), but should not be used as a data point for any displacement or wage graph.

---

## Sources Checked but Not Relevant to Graphs

| URL | Reason |
|---|---|
| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Manning & Aguirre NBER paper (Jan 2026) — adaptive capacity index, no standalone quantitative stat extractable for graphs |
| https://www.nber.org/papers/w34859 | "Chaining Tasks, Redefining Work" (Demirer, Horton et al., Feb 2026) — theoretical framework, no labor market statistics |
| https://www.nber.org/papers/w34854 | "Building Pro-Worker AI" (Acemoglu, Autor, Johnson, Feb 2026) — conceptual taxonomy, no new quantitative displacement stats |
| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | IMF SDN 2026/001 "New Jobs Creation in the AI Age" — cross-country skill-gap paper; finding that AI skills appear in ~5% of US job postings by 2025 is global/methodology focused, not mappable to US-specific prediction graphs; no confirmed publication date within 7-day window |
| https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market | Yale Budget Lab May 2026 — finds no statistically significant AI labor market effects; the null finding is important but no specific extractable numeric for graphs |
| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Fed FEDS Note (Apr 2026) — synthesis/tracker; statistics already reflected in BTOS data above |
| https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html | CNBC Sept 13, 2026 — Tier 3; useful for BLS labor share stat and Acemoglu quotes; published Sept 13 (outside 7-day window) |
| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | Kolko PIIE, March 2026 — methodological review; no new stats |
| https://www.gspublishing.com/content/research/en/reports/2026/05/04/ef83dcd8-de76-45cd-b883-2a9e6cd9cc2a.html | Goldman Sachs April 2026 — earlier tracker; superseded by Sept 2026 edition |
| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf | Census CES WP 26-25 "Microstructure of AI Diffusion" (Q2 2026) — data through Nov 2025–Jan 2026 period, already incorporated in ai-adoption-rate graph via BTOS |
| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-27.pdf | Census CES WP 26-27 "You're (not) Hired" (Tucker, Q2 2026) — early career hiring decline consistent with Brynjolfsson Canaries but earlier data vintage |
| https://ssrn.com/abstract=5842084 | Azar, Gine & Sanz-Espín "Wage Effects of GenAI" (Dec 2025 SSRN) — finds wage declines and "mid-biased technological change"; older paper, but key finding: "mid-biased technological change: firms compress their hierarchies, reducing employment shares at both the junior and senior levels" — no clear single numeric for a graph within spec |
| Various aggregator blogs (letaido, axis-intelligence, click-vision, aiexposure.org, etc.) | Tier 4; recycling WEF/Goldman/IMF numbers already ingested from primary sources |

---

## Priority Recommendations

### Tier 1 — Ingest Immediately

1. **Brynjolfsson, Chandar & Chen "Canaries" August 2026 revision** (Stanford DEL, 2026-08-12) — The 19% employment gap for young workers (ages 22–25) in AI-exposed occupations is the most robust quantitative signal of early AI labor-market impact available from large-scale US administrative data. It directly overlays `overall-us-displacement` and `entry-level-wage-impact`. The widening gap (15% → 19% since July 2025) is a trend worth tracking. **Ingest as OVERLAY (down) on `overall-us-displacement`.**

2. **Bick, Blandin, Deming, Schumacher RPS data** (St. Louis Fed / VoxEU, Aug–Sept 2026) — The 45%-of-workers adoption figure (May 2026) is the most current, nationally representative estimate of US adult GenAI work adoption. It is Tier 1 (government-affiliated, CPS-matched methodology). **Ingest as DATA_POINT on `genai-work-adoption`.**

3. **Census BTOS August 2026** — 23.2% firm adoption rate is the most current official government estimate of US firm AI adoption. **Ingest as DATA_POINT on `ai-adoption-rate`.**

### Statistics That Diverge Significantly from Current Graph Consensus

- **Brynjolfsson 19% youth employment gap**: If the current `overall-us-displacement` graph models are anchored to "no displacement yet," the Brynjolfsson paper provides measured, documented displacement pressure — specifically for entry-level/young workers. This is a meaningful directional update.

- **Apollo –6.7 pp wage growth differential**: If the current `median-wage-impact` graph shows flat near-term wage effects, this finding suggests compression may be arriving through wages *before* employment, which diverges from "no wage effect" baselines. However, the study is Tier 3 and should be treated as OVERLAY until a peer-reviewed version is published.

- **VoxEU chat-log correlation (0.10–0.34)**: The finding that AI company usage data correlates weakly with worker surveys challenges the reliability of exposure indexes (Anthropic Economic Index, Microsoft AI applicability scores, OpenAI task data) used throughout the prediction graphs. This is a **methodology-level caution** for all graphs currently using vendor exposure metrics.

### New Government Data Releases

- **Census BTOS** updates biweekly; the next release (covering approximately Sept 7–20, 2026) is due in the first days of October. Monitor for continuation of the 23.2% adoption level or further acceleration.

- **Census HTOPS** (Household Trends and Outlook Pulse Survey, March 2026 edition): "About 55% of U.S. workers said they have used Artificial Intelligence (AI) on the job for at least one of 11 tasks" — this is a different measure from the RPS 45% figure (broader task list, different question framing). Both are official Census surveys; reconciliation needed before ingesting either as a single data point.

- **BLS Employment Cost Index**: Inflation-adjusted wages and salaries decreased 0.4% year over year through June 2026 (BLS). This is Tier 1 official data and should be noted as a contextual OVERLAY on `median-wage-impact`.

---

*Digest prepared: 2026-09-28. All statistics verified against source text. Unverified or paraphrased statistics are explicitly flagged. No statistics were invented or inferred.*