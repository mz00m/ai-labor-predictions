1	# AI Labor Research Digest — 2026-04-27
2	
3	## Summary
4	
5	The April 20–27 window produced one primary Tier 1 event: the U.S. Census Bureau's formal public release of the BTOS AI supplemental dataset on April 23, 2026. The quantitative statistics from that dataset were pre-published in a Federal Reserve FEDS Note on April 3 (just outside the window). A review of searches also surfaces several high-quality Tier 1–2 sources from the prior three months that may not yet be tracked by jobsdata.ai: the IMF Staff Discussion Note SDN/2026/001 (January 2026), the Brookings/NBER adaptive-capacity paper (January 2026), NBER w34836 "Firm Data on AI" (February 2026, revised March 2026), NBER w34984 "AI, Productivity, and the Workforce" (March 2026), and a Goldman Sachs "scarring" report covered by CNN on April 7, 2026. No new peer-reviewed papers or Tier 2 think-tank reports with quantitative AI labor market statistics were published within the strict April 20–27 window beyond the Census BTOS data release.
6	
7	---
8	
9	## New Sources
10	
11	### U.S. Census Bureau — Business Trends and Outlook Survey (BTOS) AI Supplement Public Data Release
12	- **Publisher:** U.S. Census Bureau
13	- **Date:** 2026-04-23
14	- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-apr-23.html
15	- **Evidence Tier:** 1 (Government Statistics)
16	- **Source ID:** census-btos-ai-2026
17	
18	**Context:** New supplemental AI questions were added to the BTOS from November 17, 2025 to February 8, 2026. The April 23, 2026 release makes the full AI supplement available as data-download files and visualizations. Quantitative statistics below are drawn from the Federal Reserve Board's FEDS Note of April 3, 2026 (Jeffrey S. Allen, "Monitoring AI Adoption in the US Economy"), which formally pre-analyzed this same BTOS dataset and is the definitive published source for the figures. The BTOS sample covers approximately 1.2 million businesses.
19	
20	**Statistics:**
21	
22	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
23	   **Type:** DATA_POINT
24	   **Value:** 18 %
25	   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
26	   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.htm
27	   **Note:** Uses BTOS question revised in November 2025 to capture AI use "in any of its business functions" (broader than the prior "producing goods or services" definition). The prior-definition adoption rate grew 68% (3.9 pp) over the year ending September 2025 before the question change.
28	
29	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
30	   **Type:** DATA_POINT
31	   **Value:** 41 %
32	   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025. These metrics grew by about 31 percent (9.7 percentage points) and 26 percent (10.4 percentage points), respectively, for the year ending in November."
33	   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, ibid.
34	   **Note:** From the Real-Time Population Survey (RPS), individual-level, defines GenAI specifically (ChatGPT, Gemini, Midjourney etc.). Distinct from the firm-level BTOS figure above.
35	
36	3. **Graph:** AI Adoption Rate — forward-looking overlay (`ai-adoption-rate`)
37	   **Type:** OVERLAY (up)
38	   **Value:** 20 %
39	   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
40	   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, ibid.
41	   **Note:** This is a planned-adoption figure (intent over next 6 months), not actual adoption. It suggests the 18% figure will rise further during H1 2026.
42	
43	---
44	
45	## Important Recent Sources Outside the 7-Day Window
46	*(Published since 2026-01-01; likely not yet in the tracker; recommend ingesting)*
47	
48	### Federal Reserve Board — "Monitoring AI Adoption in the US Economy" (FEDS Note)
49	- **Publisher:** Federal Reserve Board of Governors
50	- **Date:** 2026-04-03
51	- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.htm
52	- **Evidence Tier:** 1 (Federal Reserve official research note)
53	- **Source ID:** fed-ai-adoption-monitoring-2026
54	
55	**Statistics:**
56	
57	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
58	   **Type:** DATA_POINT
59	   **Value:** 18 %
60	   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
61	
62	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
63	   **Type:** DATA_POINT
64	   **Value:** 41 %
65	   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce"
66	   **Note:** November 2025 measurement. Grew 31% (9.7 pp) year-over-year. Daily usage: ~12% of workforce.
67	
68	3. **Graph:** AI Adoption Rate — sector overlay (`ai-adoption-rate`)
69	   **Type:** OVERLAY (up)
70	   **Value:** 33 %
71	   **Quote:** "The professional, scientific, and technical services ('professional services') and financial sectors stand out in terms of levels of adoption, at about 33 and 30 percent."
72	   **Note:** Sector-specific BTOS figures for professional services and finance. Substantially above the 18% economy-wide average, supporting the hypothesis that cognitive/analytical work is absorbing AI first.
73	
74	---
75	
76	### Goldman Sachs Research — AI Job Loss Scarring Study (via CNN)
77	- **Publisher:** Goldman Sachs (Mei & Rindels); reported by CNN Business
78	- **Date:** 2026-04-07
79	- **URL:** https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
80	- **Evidence Tier:** 3 (Major news, covering Tier 2 Goldman Sachs research)
81	- **Source ID:** goldmansachs-scarring-2026
82	
83	**Context:** Goldman Sachs economists Pierfrancesco Mei and Jessica Rindels used National Longitudinal Surveys data to track labor market outcomes of workers displaced by technology since 1980, extrapolating implications for AI displacement.
84	
85	**Statistics:**
86	
87	1. **Graph:** Median Wage Impact (`median-wage-impact`)
88	   **Type:** OVERLAY (down)
89	   **Value:** -10 %
90	   **Quote:** "10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
91	   **Note:** This is a *historical* analogue stat for tech-displaced workers, not a forward projection for AI specifically. Maps as overlay (down) on `median-wage-impact` because it establishes a baseline for expected AI-displacement wage scarring.
92	
93	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
94	   **Type:** OVERLAY (neutral)
95	   **Value:** 6.5 % (midpoint of 6–7% range)
96	   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
97	   **Note:** This is a restatement of a previously established Goldman Sachs estimate, not new; included for cross-reference. Maps as overlay only; not a new data point.
98	
99	---
100	
101	### NBER Working Paper 34836 — "Firm Data on AI" (Yotzov, Barrero, Bloom et al.)
102	- **Publisher:** National Bureau of Economic Research
103	- **Date:** 2026-02 (revised 2026-03)
104	- **URL:** https://www.nber.org/papers/w34836
105	- **Evidence Tier:** 1 (NBER Working Paper, multi-country executive survey, ~6,000 respondents across US, UK, Germany, Australia)
106	- **Source ID:** nber-firm-data-ai-w34836-2026
107	
108	**Context:** First representative international data on firm-level AI use. Surveys ~6,000 CFOs, CEOs and senior executives from stratified firm samples in four countries.
109	
110	**Statistics:**
111	
112	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
113	   **Type:** OVERLAY (up)
114	   **Value:** 69 %
115	   **Quote:** "69% of firms actively use AI, with higher usage rates at younger and more productive firms."
116	   **Note:** Employment-weighted estimate from Survey of Business Uncertainty (SBU) methodology. Higher than Census BTOS 18% because it targets larger firms and uses employment-weighting. These estimates are not comparable to BTOS; include as overlay not data point to avoid conflating methodologies.
117	
118	2. **Graph:** AI Adoption Rate — historical impact overlay (`ai-adoption-rate`)
119	   **Type:** OVERLAY (neutral)
120	   **Value:** 90 %
121	   **Quote:** "executives report little own-firm impact of AI over the last 3 years, with nine-in-ten reporting no impact on employment or productivity."
122	   **Note:** 90% of surveyed firms report no employment or productivity impact over past 3 years. This is a "null result" finding — maps as overlay (neutral) on `ai-adoption-rate`, contextualizing the gap between adoption and measured impact.
123	
124	3. **Graph:** Total US Jobs Lost — executive forecast overlay (`total-us-jobs-lost`)
125	   **Type:** OVERLAY (down)
126	   **Value:** -0.7 %
127	   **Quote:** "these same executives predict sizable effects over the next 3 years, predicting that AI will boost productivity at their firms by an average of 1.4%, raise output 0.8%, and cut employment 0.7%."
128	   **Note:** A 3-year forward forecast from firm executives, not a structural labor market projection. Map as overlay (down) on `total-us-jobs-lost` as a near-term directional signal; employment cut of 0.7% is modest relative to most displacement forecasts.
129	
130	4. **Graph:** Total US Jobs Lost — employee forecast contrast overlay (`total-us-jobs-lost`)
131	   **Type:** OVERLAY (up)
132	   **Value:** 0.5 %
133	   **Quote:** "In contrast, employees anticipate that AI will raise employment 0.5% at their firms in the next 3 years, highlighting an expectations gap between employers and employees."
134	   **Note:** Employees expect net job creation (+0.5%) while executives forecast net job losses (−0.7%). This "expectations gap" is an important divergence from the displacement consensus. Map as overlay (up).
135	
136	---
137	
138	### NBER Working Paper 34984 — "AI, Productivity, and the Workforce: Evidence from Corporate Executives" (Baslandze, Edwards, Graham et al.)
139	- **Publisher:** National Bureau of Economic Research / Federal Reserve Banks of Atlanta & Richmond
140	- **Date:** 2026-03
141	- **URL:** https://www.nber.org/papers/w34984
142	- **Evidence Tier:** 1 (NBER Working Paper, ~750 corporate executive survey)
143	- **Source ID:** nber-ai-productivity-workforce-w34984-2026
144	
145	**Context:** Survey of ~750 CFOs primarily in late 2025 and early 2026. Finds a "productivity paradox" — perceived gains exceed measured gains.
146	
147	**Statistics:**
148	
149	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
150	   **Type:** OVERLAY (up)
151	   **Value:** 50 % (approximate "more than half")
152	   **Quote:** "We document substantial heterogeneity in AI adoption across firms, with more than half having already invested, though many smaller firms are only beginning to do so."
153	   **Note:** "Invested" in AI, not necessarily actively using. Treat as overlay; not directly comparable to Census BTOS "use in business functions" question.
154	
155	2. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
156	   **Type:** OVERLAY (down)
157	   **Value:** N/A — directional
158	   **Quote:** "We also find evidence of compositional reallocation of labor both within and across firms, with routine clerical roles declining and a relative demand for skilled technical roles increasing."
159	   **Note:** No specific percentage given for the clerical role decline. Qualitative finding confirms the hollowing-out hypothesis. Map as overlay (down) on `white-collar-professional-displacement` given directional content; no data point value extractable.
160	
161	3. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
162	   **Type:** OVERLAY (neutral)
163	   **Value:** N/A — null finding
164	   **Quote:** "In labor markets, we find little evidence of near-term aggregate employment declines due to AI, though larger companies anticipate AI-driven workforce reductions, while smaller firms expect modest gains."
165	   **Note:** Important null result from corporate survey data. Larger firms anticipate reductions; smaller firms expect gains. Net near-term effect is essentially zero in aggregate.
166	
167	---
168	
169	### IMF Staff Discussion Note SDN/2026/001 — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age"
170	- **Publisher:** International Monetary Fund (Research Department)
171	- **Date:** 2026-01
172	- **URL:** https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf
173	- **Evidence Tier:** 2 (IMF Staff Discussion Note; cross-country analysis using Lightcast vacancy data for US, UK, Germany, Denmark, Brazil, South Africa)
174	- **Source ID:** imf-sdn-skill-gaps-2026
175	
176	**Context:** Examines demand and supply of new skills (especially IT and AI) across six countries using Lightcast job posting data. Presents new Skill Imbalance Index and Skill Readiness Index.
177	
178	**Statistics:**
179	
180	1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
181	   **Type:** OVERLAY (up)
182	   **Value:** 10 %
183	   **Quote:** "roughly 1 in 10 job postings requires at least one new skill in advanced economies"
184	   **Note:** Measures new-skill demand (proxy for AI-related transformation) in job postings, not direct displacement. Treat as overlay on `workforce-ai-exposure`; global advanced economy figure, not US-specific.
185	
186	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
187	   **Type:** OVERLAY (down)
188	   **Value:** -3.6 %
189	   **Quote:** "employment levels are 3.6 percent lower in regions with greater demand for AI-related skills than in other regions five years after the appearance of these skills. This poses challenges for white-collar middle-skilled jobs, young workers, and some categories of IT specialists."
190	   **Note:** This is a regional US employment effect in occupations with "high exposure and low complementarity to AI" (≈30% of total employment). Strongest signal in this report for near-term displacement. Maps as overlay (down) on `entry-level-wage-impact` because the IMF explicitly notes this "poses challenges for… young workers" — entry-level workers are the primary affected group. The unit is employment change (not wages), so this is an overlay, not a data point.
191	
192	3. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
193	   **Type:** OVERLAY (up)
194	   **Value:** 3.0 % (average of 3–3.4% range)
195	   **Quote:** "new skills are associated with 3–3.4 percent higher wages (Figure 5, panel 1)"
196	   **Note:** Vacancy-level wage premium for postings requiring at least one new skill vs. otherwise identical postings (same 4-digit ISCO occupation × industry × county × year). US and UK data 2020–2024. Maps as overlay (up) on `high-skill-wage-premium`.
197	
198	4. **Graph:** High-Skill Wage Premium — AI-developer skills overlay (`high-skill-wage-premium`)
199	   **Type:** OVERLAY (up)
200	   **Value:** 8 % (>8% for AI developer, ~2% for AI user)
201	   **Quote:** "In the United States, high wage premiums of above 8 percent are concentrated among AI-developer skills, whereas AI-user skill postings display a smaller premium close to 2 percent."
202	   **Note:** Suggests strong bifurcation: building AI pays a large premium; using AI pays a modest one. Maps as overlay (up) on `high-skill-wage-premium`.
203	
204	5. **Graph:** Median Wage Impact (`median-wage-impact`)
205	   **Type:** OVERLAY (up)
206	   **Value:** 2.3 %
207	   **Quote:** "A 1 percentage point increase in job postings requiring new skills raises average hourly wages by 2.3 percent"
208	   **Note:** US commuting-zone causal estimate (IV shift-share design, 2013–2023). This is the broad new-skills wage effect (not AI-specific). Maps as overlay (up) on `median-wage-impact`; global and not US-displacement specific.
209	
210	---
211	
212	### Brookings Institution / NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (Manning, Aguirre, Muro, Methkupally)
213	- **Publisher:** Brookings Institution / Centre for the Governance of AI (GovAI); associated NBER chapter
214	- **Date:** 2026-01-21
215	- **URL:** https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/
216	- **Evidence Tier:** 2 (Brookings Institution / NBER chapter; uses six datasets including SIPP, ACS, OEWS, Lightcast, O*NET)
217	- **Source ID:** brookings-adaptive-capacity-2026
218	
219	**Context:** Introduces "adaptive capacity index" — combines AI exposure (Eloundou et al. LLM exposure measure) with worker-level adaptive factors (savings, age, labor market density, skill transferability). Covers 356 occupations, 95.9% of US workforce.
220	
221	**Statistics:**
222	
223	1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
224	   **Type:** OVERLAY (neutral)
225	   **Value:** 3.9 %
226	   **Quote:** "the share of workers in highly exposed occupations with low adaptive capacity ranges from 2.4% to 6.9% in the nation's metro areas, with a national average of 3.9%."
227	   **Note:** This is the share of workers in *both* high-AI-exposure *and* low-adaptive-capacity occupations — the double-vulnerable group. Distinct from gross AI exposure figures. The national average of 3.9% represents 6.1 million workers in absolute terms.
228	
229	2. **Graph:** Workforce AI Exposure — total high-exposure overlay (`workforce-ai-exposure`)
230	   **Type:** OVERLAY (neutral)
231	   **Value:** 26.5 (million workers; 70% of top-quartile exposed)
232	   **Quote:** "Of the 37.1 million U.S. workers in the top quartile of occupational AI exposure, 26.5 million also have above-median adaptive capacity, meaning they are among those best positioned to make a job transition if displacement occurs."
233	   **Note:** Key finding: most highly-AI-exposed workers (71%) have *above-median* adaptive capacity. Maps as overlay (neutral) on `workforce-ai-exposure` — the implication is that gross exposure overstates displacement risk for the majority.
234	
235	3. **Graph:** Healthcare Admin Displacement — vulnerable clerical workers overlay (`healthcare-admin-displacement`)
236	   **Type:** OVERLAY (up)
237	   **Value:** 831,000 (workers)
238	   **Quote:** "medical secretaries and administrative assistants (831,000) stand out as some of the largest occupations in the list [of high-exposure, low-adaptive-capacity roles]. The combination of employment size, potentially elevated automation impacts, and precarious worker traits highlights occupations where policymakers may benefit from greater visibility into AI's workforce effects."
239	   **Note:** Medical secretaries are healthcare admin workers with both high AI exposure and low adaptive capacity. No percentage figure given, but 831,000 workers is the relevant scale. Map as overlay (up) on `healthcare-admin-displacement`.
240	
241	4. **Graph:** White-Collar Professional Displacement — gender overlay (`white-collar-professional-displacement`)
242	   **Type:** OVERLAY (up)
243	   **Value:** 86 % (female share)
244	   **Quote:** "some 6.1 million workers (4.2% of the workforce in the sample) will likely contend with both high AI exposure and low adaptive capacity. These workers tend to be concentrated in clerical and administrative roles, and about 86% are women"
245	   **Note:** Gender concentration in the most vulnerable group. No graph directly tracks gender; maps as overlay on `white-collar-professional-displacement` as the roles affected are primarily clerical/administrative white-collar.
246	
247	---
248	
249	## Sources Checked but Not Relevant
250	
251	The following URLs were fetched or searched but did not yield new, quantitative AI labor market statistics within the April 20–27 window:
252	
253	- https://www.nber.org/papers/w34859 — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (NBER w34859, February 2026). Theoretical framework paper; empirical findings are directional (AI chains co-occur, adjacency predicts execution) but no extractable labor market outcome statistics.
254	- https://www.oecd.org/en/topics/ai-and-work.html — OECD AI and Work page. References April 2026 conference; no new quantitative publications within window.
255	- https://www.imf.org/en/news/seminars/conferences/2026/11/17/imf-oecd-piie-world-bank-conference — Call for papers; future conference, no data.
256	- https://www.ilo.org/publications/generative-ai-and-jobs-2025-update — ILO 2025 update (pre-window).
257	- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 — SSRN "AI Job Displacement Analysis 2025–2030" (Josephine Nartey). Tier 4 aggregation paper; statistics are secondary compilations from WEF/McKinsey, not original research. Date unclear; excluded.
258	- https://www.ey.com/en_us/newsroom/2026/03/ey-survey-autonomous-ai-adoption-surges — EY survey (March 2026). Tech-sector governance/security focus; no labor market displacement or wage statistics.
259	- https://www.grantthornton.com/insights/survey-reports/technology/2026/technology-2026-ai-impact-survey-report — Grant Thornton (March 2026). Technology governance focus; no extractable labor statistics.
260	- https://ibuidl.org/blog/ai-job-displacement-labor-data-2026 — iBuidl.org (March 10, 2026). Tier 4 blog citing secondary sources; statistics not independently verified.
261	- https://www.nexford.edu/insights/what-anthropics-2026-ai-labor-market-report-means-for-your-career — Nexford University blog. Tier 4; secondary commentary on Anthropic March 2026 paper.
262	- https://www.tomshardware.com/tech-industry/tech-industry-lays-off-nearly-80-000-employees-in-the-first-quarter-of-2026 — Tom's Hardware (April 2026). Reports 78,557 tech layoffs Q1 2026 (76%+ US), 47.9% attributed to AI (Nikkei Asia source). Within window (article citing Q1 2026 data), but sourced from industry tracking site Layoffs.fyi aggregation, not primary research. Tier 4; excluded from statistics.
263	- https://secondtalent.com/resources/ai-impact-job-market/ — Second Talent blog. Tier 4; secondary aggregation.
264	- https://www.anthropic.com/research/labor-market-impacts — Anthropic "Labor Market Impacts of AI: A New Measure and Early Evidence" (March 5, 2026). Important paper but published March 5 (outside window). Key finding: for every 10 pp increase in observed AI exposure (coverage), BLS employment growth projection drops 0.6 pp. No aggregate displacement figure. Should be tracked separately; outside this digest's window.
265	- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market — Yale Budget Lab tracker (updated through March 2026 CPS). Notes "no substantial changes" to analysis as of April 2026 update. Within window but no new quantitative statistics.
266	- https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning — PIIE blog (2026, date unclear). Literature review. No new quantitative findings.
267	- https://www.dallasfed.org/research/economics/2026/0224 — Dallas Fed "AI is simultaneously aiding and replacing workers" (February 24, 2026). Outside window; covers wage divergence between AI-exposed sectors, but referenced in existing tracker entries. Consider for ingestion.
268	- https://www.hbr.org/2026/03/research-how-ai-is-changing-the-labor-market — HBR (March 2026). Tier 3 commentary; outside window.
269	
270	---
271	
272	## Priority Recommendations
273	
274	### 1. Ingest Immediately (Tier 1)
275	- **Federal Reserve FEDS Note (April 3, 2026)** — "Monitoring AI Adoption in the US Economy." Provides the most comprehensive current US data on AI adoption rates across firm types, sizes, and industries. Three surveys synthesized (BTOS, RPS, SBU). The `ai-adoption-rate` DATA_POINT of 18% (BTOS, Dec 2025) and `genai-work-adoption` DATA_POINT of 41% (RPS, Nov 2025) are the most authoritative current figures for the Census BTOS graph family.
276	- **NBER w34836 "Firm Data on AI" (February/March 2026)** — First representative international executive survey (~6,000 respondents). Contains the only direct employer-forecast data point: executives project −0.7% employment over 3 years vs. employees projecting +0.5%. Important counter-evidence and "expectations gap" finding.
277	- **NBER w34984 "AI, Productivity, and the Workforce" (March 2026)** — US CFO/executive survey (~750). Documents the "productivity paradox" (perceived > measured gains). Confirms compositional shift from clerical to technical roles. Near-term null result on aggregate employment is significant.
278	- **IMF SDN/2026/001 (January 2026)** — First cross-country causal evidence on AI skill adoption's wage and employment effects. Key statistics: 3.6% employment reduction in AI-exposed, low-complementarity occupations after 5 years (US local labor markets); 3–3.4% wage premium for new-skill postings; AI developer skill premium >8% in the US.
279	
280	### 2. Statistics That Diverge from Current Graph Consensus
281	- **NBER w34836 null finding**: Over 80% of firms report zero employment or productivity impact from AI over the past 3 years. This contrasts with many displacement forecasts embedded in the prediction graphs and should be weighed carefully against forward-looking estimates.
282	- **Brookings/NBER adaptive capacity finding**: Only 3.9% of the US workforce (6.1 million workers) is both highly AI-exposed AND has low adaptive capacity. This is substantially below most headline displacement estimates that use gross exposure figures.
283	- **IMF SDN employment effect at 5 years**: The −3.6% employment level effect in AI-exposed, low-complementarity occupations (≈30% of total employment) is specific and empirically identified. It is directionally aligned with displacement narratives but smaller in magnitude than most forecasts.
284	- **Goldman Sachs scarring study (April 7)**: The 10-year earnings penalty of −10 pp for tech-displaced workers (historical analogue) is more severe than most wage impact forecasts — relevant context for `median-wage-impact` graph downside scenarios.
285	
286	### 3. New Government Data Releases
287	- **Census Bureau BTOS AI Supplement** (April 23, 2026, formally public): The data download files now include AI adoption rates by sector, state, firm size, and the 25 most populous MSAs. This enables local `geographic-wage-divergence` analysis and state-level tracking. The data files are at https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html
288	- **Census Bureau HTOPS** (April 23, 2026): Household-level AI usage data from June 2025 sample is now publicly available. Covers "use of Artificial Intelligence (AI)" and "opinions of AI based on experience" — potential `genai-work-adoption` data point once specific figures are extracted from the public-use file.
289	- **BLS Employment Projections 2024–2034** (published 2025, cited in multiple April 2026 sources): BLS now formally projects 3.1% total employment growth 2024–2034, down from 13% over 2014–2024. Multiple papers cite the BLS projection-adjustment finding (−0.6 pp growth per 10 pp AI exposure increase) as evidence that official forecasts already embed AI displacement effects.
# AI Labor Research Digest — 2026-04-27

## Summary

The April 20–27 window produced one primary Tier 1 event: the U.S. Census Bureau's formal public release of the BTOS AI supplemental dataset on April 23, 2026. The quantitative statistics from that dataset were pre-published in a Federal Reserve FEDS Note on April 3 (just outside the window). A review of searches also surfaces several high-quality Tier 1–2 sources from the prior three months that may not yet be tracked by jobsdata.ai: the IMF Staff Discussion Note SDN/2026/001 (January 2026), the Brookings/NBER adaptive-capacity paper (January 2026), NBER w34836 "Firm Data on AI" (February 2026, revised March 2026), NBER w34984 "AI, Productivity, and the Workforce" (March 2026), and a Goldman Sachs "scarring" report covered by CNN on April 7, 2026. No new peer-reviewed papers or Tier 2 think-tank reports with quantitative AI labor market statistics were published within the strict April 20–27 window beyond the Census BTOS data release.

---

## New Sources

### U.S. Census Bureau — Business Trends and Outlook Survey (BTOS) AI Supplement Public Data Release
- **Publisher:** U.S. Census Bureau
- **Date:** 2026-04-23
- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-apr-23.html
- **Evidence Tier:** 1 (Government Statistics)
- **Source ID:** census-btos-ai-2026

**Context:** New supplemental AI questions were added to the BTOS from November 17, 2025 to February 8, 2026. The April 23, 2026 release makes the full AI supplement available as data-download files and visualizations. Quantitative statistics below are drawn from the Federal Reserve Board's FEDS Note of April 3, 2026 (Jeffrey S. Allen, "Monitoring AI Adoption in the US Economy"), which formally pre-analyzed this same BTOS dataset and is the definitive published source for the figures. The BTOS sample covers approximately 1.2 million businesses.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 %
   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.htm
   **Note:** Uses BTOS question revised in November 2025 to capture AI use "in any of its business functions" (broader than the prior "producing goods or services" definition). The prior-definition adoption rate grew 68% (3.9 pp) over the year ending September 2025 before the question change.

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 %
   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025. These metrics grew by about 31 percent (9.7 percentage points) and 26 percent (10.4 percentage points), respectively, for the year ending in November."
   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, ibid.
   **Note:** From the Real-Time Population Survey (RPS), individual-level, defines GenAI specifically (ChatGPT, Gemini, Midjourney etc.). Distinct from the firm-level BTOS figure above.

3. **Graph:** AI Adoption Rate — forward-looking overlay (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 20 %
   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
   **Source for quote:** Federal Reserve FEDS Note, April 3, 2026, ibid.
   **Note:** This is a planned-adoption figure (intent over next 6 months), not actual adoption. It suggests the 18% figure will rise further during H1 2026.

---

## Important Recent Sources Outside the 7-Day Window
*(Published since 2026-01-01; likely not yet in the tracker; recommend ingesting)*

### Federal Reserve Board — "Monitoring AI Adoption in the US Economy" (FEDS Note)
- **Publisher:** Federal Reserve Board of Governors
- **Date:** 2026-04-03
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.htm
- **Evidence Tier:** 1 (Federal Reserve official research note)
- **Source ID:** fed-ai-adoption-monitoring-2026

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 %
   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 %
   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce"
   **Note:** November 2025 measurement. Grew 31% (9.7 pp) year-over-year. Daily usage: ~12% of workforce.

3. **Graph:** AI Adoption Rate — sector overlay (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 33 %
   **Quote:** "The professional, scientific, and technical services ('professional services') and financial sectors stand out in terms of levels of adoption, at about 33 and 30 percent."
   **Note:** Sector-specific BTOS figures for professional services and finance. Substantially above the 18% economy-wide average, supporting the hypothesis that cognitive/analytical work is absorbing AI first.

---

### Goldman Sachs Research — AI Job Loss Scarring Study (via CNN)
- **Publisher:** Goldman Sachs (Mei & Rindels); reported by CNN Business
- **Date:** 2026-04-07
- **URL:** https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
- **Evidence Tier:** 3 (Major news, covering Tier 2 Goldman Sachs research)
- **Source ID:** goldmansachs-scarring-2026

**Context:** Goldman Sachs economists Pierfrancesco Mei and Jessica Rindels used National Longitudinal Surveys data to track labor market outcomes of workers displaced by technology since 1980, extrapolating implications for AI displacement.

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -10 %
   **Quote:** "10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
   **Note:** This is a *historical* analogue stat for tech-displaced workers, not a forward projection for AI specifically. Maps as overlay (down) on `median-wage-impact` because it establishes a baseline for expected AI-displacement wage scarring.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 6.5 % (midpoint of 6–7% range)
   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
   **Note:** This is a restatement of a previously established Goldman Sachs estimate, not new; included for cross-reference. Maps as overlay only; not a new data point.

---

### NBER Working Paper 34836 — "Firm Data on AI" (Yotzov, Barrero, Bloom et al.)
- **Publisher:** National Bureau of Economic Research
- **Date:** 2026-02 (revised 2026-03)
- **URL:** https://www.nber.org/papers/w34836
- **Evidence Tier:** 1 (NBER Working Paper, multi-country executive survey, ~6,000 respondents across US, UK, Germany, Australia)
- **Source ID:** nber-firm-data-ai-w34836-2026

**Context:** First representative international data on firm-level AI use. Surveys ~6,000 CFOs, CEOs and senior executives from stratified firm samples in four countries.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 69 %
   **Quote:** "69% of firms actively use AI, with higher usage rates at younger and more productive firms."
   **Note:** Employment-weighted estimate from Survey of Business Uncertainty (SBU) methodology. Higher than Census BTOS 18% because it targets larger firms and uses employment-weighting. These estimates are not comparable to BTOS; include as overlay not data point to avoid conflating methodologies.

2. **Graph:** AI Adoption Rate — historical impact overlay (`ai-adoption-rate`)
   **Type:** OVERLAY (neutral)
   **Value:** 90 %
   **Quote:** "executives report little own-firm impact of AI over the last 3 years, with nine-in-ten reporting no impact on employment or productivity."
   **Note:** 90% of surveyed firms report no employment or productivity impact over past 3 years. This is a "null result" finding — maps as overlay (neutral) on `ai-adoption-rate`, contextualizing the gap between adoption and measured impact.

3. **Graph:** Total US Jobs Lost — executive forecast overlay (`total-us-jobs-lost`)
   **Type:** OVERLAY (down)
   **Value:** -0.7 %
   **Quote:** "these same executives predict sizable effects over the next 3 years, predicting that AI will boost productivity at their firms by an average of 1.4%, raise output 0.8%, and cut employment 0.7%."
   **Note:** A 3-year forward forecast from firm executives, not a structural labor market projection. Map as overlay (down) on `total-us-jobs-lost` as a near-term directional signal; employment cut of 0.7% is modest relative to most displacement forecasts.

4. **Graph:** Total US Jobs Lost — employee forecast contrast overlay (`total-us-jobs-lost`)
   **Type:** OVERLAY (up)
   **Value:** 0.5 %
   **Quote:** "In contrast, employees anticipate that AI will raise employment 0.5% at their firms in the next 3 years, highlighting an expectations gap between employers and employees."
   **Note:** Employees expect net job creation (+0.5%) while executives forecast net job losses (−0.7%). This "expectations gap" is an important divergence from the displacement consensus. Map as overlay (up).

---

### NBER Working Paper 34984 — "AI, Productivity, and the Workforce: Evidence from Corporate Executives" (Baslandze, Edwards, Graham et al.)
- **Publisher:** National Bureau of Economic Research / Federal Reserve Banks of Atlanta & Richmond
- **Date:** 2026-03
- **URL:** https://www.nber.org/papers/w34984
- **Evidence Tier:** 1 (NBER Working Paper, ~750 corporate executive survey)
- **Source ID:** nber-ai-productivity-workforce-w34984-2026

**Context:** Survey of ~750 CFOs primarily in late 2025 and early 2026. Finds a "productivity paradox" — perceived gains exceed measured gains.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 50 % (approximate "more than half")
   **Quote:** "We document substantial heterogeneity in AI adoption across firms, with more than half having already invested, though many smaller firms are only beginning to do so."
   **Note:** "Invested" in AI, not necessarily actively using. Treat as overlay; not directly comparable to Census BTOS "use in business functions" question.

2. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down)
   **Value:** N/A — directional
   **Quote:** "We also find evidence of compositional reallocation of labor both within and across firms, with routine clerical roles declining and a relative demand for skilled technical roles increasing."
   **Note:** No specific percentage given for the clerical role decline. Qualitative finding confirms the hollowing-out hypothesis. Map as overlay (down) on `white-collar-professional-displacement` given directional content; no data point value extractable.

3. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
   **Type:** OVERLAY (neutral)
   **Value:** N/A — null finding
   **Quote:** "In labor markets, we find little evidence of near-term aggregate employment declines due to AI, though larger companies anticipate AI-driven workforce reductions, while smaller firms expect modest gains."
   **Note:** Important null result from corporate survey data. Larger firms anticipate reductions; smaller firms expect gains. Net near-term effect is essentially zero in aggregate.

---

### IMF Staff Discussion Note SDN/2026/001 — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age"
- **Publisher:** International Monetary Fund (Research Department)
- **Date:** 2026-01
- **URL:** https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf
- **Evidence Tier:** 2 (IMF Staff Discussion Note; cross-country analysis using Lightcast vacancy data for US, UK, Germany, Denmark, Brazil, South Africa)
- **Source ID:** imf-sdn-skill-gaps-2026

**Context:** Examines demand and supply of new skills (especially IT and AI) across six countries using Lightcast job posting data. Presents new Skill Imbalance Index and Skill Readiness Index.

**Statistics:**

1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 10 %
   **Quote:** "roughly 1 in 10 job postings requires at least one new skill in advanced economies"
   **Note:** Measures new-skill demand (proxy for AI-related transformation) in job postings, not direct displacement. Treat as overlay on `workforce-ai-exposure`; global advanced economy figure, not US-specific.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -3.6 %
   **Quote:** "employment levels are 3.6 percent lower in regions with greater demand for AI-related skills than in other regions five years after the appearance of these skills. This poses challenges for white-collar middle-skilled jobs, young workers, and some categories of IT specialists."
   **Note:** This is a regional US employment effect in occupations with "high exposure and low complementarity to AI" (≈30% of total employment). Strongest signal in this report for near-term displacement. Maps as overlay (down) on `entry-level-wage-impact` because the IMF explicitly notes this "poses challenges for… young workers" — entry-level workers are the primary affected group. The unit is employment change (not wages), so this is an overlay, not a data point.

3. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 3.0 % (average of 3–3.4% range)
   **Quote:** "new skills are associated with 3–3.4 percent higher wages (Figure 5, panel 1)"
   **Note:** Vacancy-level wage premium for postings requiring at least one new skill vs. otherwise identical postings (same 4-digit ISCO occupation × industry × county × year). US and UK data 2020–2024. Maps as overlay (up) on `high-skill-wage-premium`.

4. **Graph:** High-Skill Wage Premium — AI-developer skills overlay (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 8 % (>8% for AI developer, ~2% for AI user)
   **Quote:** "In the United States, high wage premiums of above 8 percent are concentrated among AI-developer skills, whereas AI-user skill postings display a smaller premium close to 2 percent."
   **Note:** Suggests strong bifurcation: building AI pays a large premium; using AI pays a modest one. Maps as overlay (up) on `high-skill-wage-premium`.

5. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 2.3 %
   **Quote:** "A 1 percentage point increase in job postings requiring new skills raises average hourly wages by 2.3 percent"
   **Note:** US commuting-zone causal estimate (IV shift-share design, 2013–2023). This is the broad new-skills wage effect (not AI-specific). Maps as overlay (up) on `median-wage-impact`; global and not US-displacement specific.

---

### Brookings Institution / NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (Manning, Aguirre, Muro, Methkupally)
- **Publisher:** Brookings Institution / Centre for the Governance of AI (GovAI); associated NBER chapter
- **Date:** 2026-01-21
- **URL:** https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/
- **Evidence Tier:** 2 (Brookings Institution / NBER chapter; uses six datasets including SIPP, ACS, OEWS, Lightcast, O*NET)
- **Source ID:** brookings-adaptive-capacity-2026

**Context:** Introduces "adaptive capacity index" — combines AI exposure (Eloundou et al. LLM exposure measure) with worker-level adaptive factors (savings, age, labor market density, skill transferability). Covers 356 occupations, 95.9% of US workforce.

**Statistics:**

1. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 3.9 %
   **Quote:** "the share of workers in highly exposed occupations with low adaptive capacity ranges from 2.4% to 6.9% in the nation's metro areas, with a national average of 3.9%."
   **Note:** This is the share of workers in *both* high-AI-exposure *and* low-adaptive-capacity occupations — the double-vulnerable group. Distinct from gross AI exposure figures. The national average of 3.9% represents 6.1 million workers in absolute terms.

2. **Graph:** Workforce AI Exposure — total high-exposure overlay (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 26.5 (million workers; 70% of top-quartile exposed)
   **Quote:** "Of the 37.1 million U.S. workers in the top quartile of occupational AI exposure, 26.5 million also have above-median adaptive capacity, meaning they are among those best positioned to make a job transition if displacement occurs."
   **Note:** Key finding: most highly-AI-exposed workers (71%) have *above-median* adaptive capacity. Maps as overlay (neutral) on `workforce-ai-exposure` — the implication is that gross exposure overstates displacement risk for the majority.

3. **Graph:** Healthcare Admin Displacement — vulnerable clerical workers overlay (`healthcare-admin-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 831,000 (workers)
   **Quote:** "medical secretaries and administrative assistants (831,000) stand out as some of the largest occupations in the list [of high-exposure, low-adaptive-capacity roles]. The combination of employment size, potentially elevated automation impacts, and precarious worker traits highlights occupations where policymakers may benefit from greater visibility into AI's workforce effects."
   **Note:** Medical secretaries are healthcare admin workers with both high AI exposure and low adaptive capacity. No percentage figure given, but 831,000 workers is the relevant scale. Map as overlay (up) on `healthcare-admin-displacement`.

4. **Graph:** White-Collar Professional Displacement — gender overlay (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 86 % (female share)
   **Quote:** "some 6.1 million workers (4.2% of the workforce in the sample) will likely contend with both high AI exposure and low adaptive capacity. These workers tend to be concentrated in clerical and administrative roles, and about 86% are women"
   **Note:** Gender concentration in the most vulnerable group. No graph directly tracks gender; maps as overlay on `white-collar-professional-displacement` as the roles affected are primarily clerical/administrative white-collar.

---

## Sources Checked but Not Relevant

The following URLs were fetched or searched but did not yield new, quantitative AI labor market statistics within the April 20–27 window:

- https://www.nber.org/papers/w34859 — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (NBER w34859, February 2026). Theoretical framework paper; empirical findings are directional (AI chains co-occur, adjacency predicts execution) but no extractable labor market outcome statistics.
- https://www.oecd.org/en/topics/ai-and-work.html — OECD AI and Work page. References April 2026 conference; no new quantitative publications within window.
- https://www.imf.org/en/news/seminars/conferences/2026/11/17/imf-oecd-piie-world-bank-conference — Call for papers; future conference, no data.
- https://www.ilo.org/publications/generative-ai-and-jobs-2025-update — ILO 2025 update (pre-window).
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 — SSRN "AI Job Displacement Analysis 2025–2030" (Josephine Nartey). Tier 4 aggregation paper; statistics are secondary compilations from WEF/McKinsey, not original research. Date unclear; excluded.
- https://www.ey.com/en_us/newsroom/2026/03/ey-survey-autonomous-ai-adoption-surges — EY survey (March 2026). Tech-sector governance/security focus; no labor market displacement or wage statistics.
- https://www.grantthornton.com/insights/survey-reports/technology/2026/technology-2026-ai-impact-survey-report — Grant Thornton (March 2026). Technology governance focus; no extractable labor statistics.
- https://ibuidl.org/blog/ai-job-displacement-labor-data-2026 — iBuidl.org (March 10, 2026). Tier 4 blog citing secondary sources; statistics not independently verified.
- https://www.nexford.edu/insights/what-anthropics-2026-ai-labor-market-report-means-for-your-career — Nexford University blog. Tier 4; secondary commentary on Anthropic March 2026 paper.
- https://www.tomshardware.com/tech-industry/tech-industry-lays-off-nearly-80-000-employees-in-the-first-quarter-of-2026 — Tom's Hardware (April 2026). Reports 78,557 tech layoffs Q1 2026 (76%+ US), 47.9% attributed to AI (Nikkei Asia source). Within window (article citing Q1 2026 data), but sourced from industry tracking site Layoffs.fyi aggregation, not primary research. Tier 4; excluded from statistics.
- https://secondtalent.com/resources/ai-impact-job-market/ — Second Talent blog. Tier 4; secondary aggregation.
- https://www.anthropic.com/research/labor-market-impacts — Anthropic "Labor Market Impacts of AI: A New Measure and Early Evidence" (March 5, 2026). Important paper but published March 5 (outside window). Key finding: for every 10 pp increase in observed AI exposure (coverage), BLS employment growth projection drops 0.6 pp. No aggregate displacement figure. Should be tracked separately; outside this digest's window.
- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market — Yale Budget Lab tracker (updated through March 2026 CPS). Notes "no substantial changes" to analysis as of April 2026 update. Within window but no new quantitative statistics.
- https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning — PIIE blog (2026, date unclear). Literature review. No new quantitative findings.
- https://www.dallasfed.org/research/economics/2026/0224 — Dallas Fed "AI is simultaneously aiding and replacing workers" (February 24, 2026). Outside window; covers wage divergence between AI-exposed sectors, but referenced in existing tracker entries. Consider for ingestion.
- https://www.hbr.org/2026/03/research-how-ai-is-changing-the-labor-market — HBR (March 2026). Tier 3 commentary; outside window.

---

## Priority Recommendations

### 1. Ingest Immediately (Tier 1)
- **Federal Reserve FEDS Note (April 3, 2026)** — "Monitoring AI Adoption in the US Economy." Provides the most comprehensive current US data on AI adoption rates across firm types, sizes, and industries. Three surveys synthesized (BTOS, RPS, SBU). The `ai-adoption-rate` DATA_POINT of 18% (BTOS, Dec 2025) and `genai-work-adoption` DATA_POINT of 41% (RPS, Nov 2025) are the most authoritative current figures for the Census BTOS graph family.
- **NBER w34836 "Firm Data on AI" (February/March 2026)** — First representative international executive survey (~6,000 respondents). Contains the only direct employer-forecast data point: executives project −0.7% employment over 3 years vs. employees projecting +0.5%. Important counter-evidence and "expectations gap" finding.
- **NBER w34984 "AI, Productivity, and the Workforce" (March 2026)** — US CFO/executive survey (~750). Documents the "productivity paradox" (perceived > measured gains). Confirms compositional shift from clerical to technical roles. Near-term null result on aggregate employment is significant.
- **IMF SDN/2026/001 (January 2026)** — First cross-country causal evidence on AI skill adoption's wage and employment effects. Key statistics: 3.6% employment reduction in AI-exposed, low-complementarity occupations after 5 years (US local labor markets); 3–3.4% wage premium for new-skill postings; AI developer skill premium >8% in the US.

### 2. Statistics That Diverge from Current Graph Consensus
- **NBER w34836 null finding**: Over 80% of firms report zero employment or productivity impact from AI over the past 3 years. This contrasts with many displacement forecasts embedded in the prediction graphs and should be weighed carefully against forward-looking estimates.
- **Brookings/NBER adaptive capacity finding**: Only 3.9% of the US workforce (6.1 million workers) is both highly AI-exposed AND has low adaptive capacity. This is substantially below most headline displacement estimates that use gross exposure figures.
- **IMF SDN employment effect at 5 years**: The −3.6% employment level effect in AI-exposed, low-complementarity occupations (≈30% of total employment) is specific and empirically identified. It is directionally aligned with displacement narratives but smaller in magnitude than most forecasts.
- **Goldman Sachs scarring study (April 7)**: The 10-year earnings penalty of −10 pp for tech-displaced workers (historical analogue) is more severe than most wage impact forecasts — relevant context for `median-wage-impact` graph downside scenarios.

### 3. New Government Data Releases
- **Census Bureau BTOS AI Supplement** (April 23, 2026, formally public): The data download files now include AI adoption rates by sector, state, firm size, and the 25 most populous MSAs. This enables local `geographic-wage-divergence` analysis and state-level tracking. The data files are at https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html
- **Census Bureau HTOPS** (April 23, 2026): Household-level AI usage data from June 2025 sample is now publicly available. Covers "use of Artificial Intelligence (AI)" and "opinions of AI based on experience" — potential `genai-work-adoption` data point once specific figures are extracted from the public-use file.
- **BLS Employment Projections 2024–2034** (published 2025, cited in multiple April 2026 sources): BLS now formally projects 3.1% total employment growth 2024–2034, down from 13% over 2014–2024. Multiple papers cite the BLS projection-adjustment finding (−0.6 pp growth per 10 pp AI exposure increase) as evidence that official forecasts already embed AI displacement effects.