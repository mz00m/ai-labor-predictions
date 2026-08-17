1	# AI Labor Research Digest — 2026-08-03
2	
3	## Summary
4	
5	This week's sweep (July 27–August 3, 2026) yielded two substantive new sources published squarely within the window: Apollo Global Management's causal difference-in-differences study using observed Anthropic AI-usage data (July 30) and the inaugural Revelio Labs AI Labor Market Tracker (July 28). The Apollo paper is the week's headline find — it provides the first causal wage-compression estimates derived from *actual* AI usage logs (not theoretical exposure), documenting a statistically significant 6.7% decline in real wage growth for high-exposure workers post-2023 with no detectable aggregate employment effect. The Revelio Labs tracker, a Tier 3 private-data source, independently corroborates employer-demand suppression in exposed occupations and finds a 4% relative employment shortfall at the occupation level since ChatGPT's launch. No Tier 1 peer-reviewed or government statistical releases fell within the seven-day window. The only series in the recurring-sources registry (`ellucian-highered-ai`) is not due until March 2027. All 15 watchlist researchers were overdue for a check (last checked 2026-04-14); no new publications from any of them were found within this specific 7-day window, though notable works from earlier in 2026 are flagged below.
6	
7	---
8	
9	## Recurring Series Status
10	
11	- **ellucian-highered-ai** (`nextExpected: 2027-03-01`): Not due — no check performed.
12	
13	*Note: The PwC 2026 Global AI Jobs Barometer (published June 15, 2026) is an important recurring release that does not yet appear in the recurring-sources.json registry. It was released six weeks before this digest window and is documented under "Sources Checked but Not Relevant" below. Recommend adding `pwc-ai-jobs-barometer` to the registry.*
14	
15	---
16	
17	## Watchlist Summary (All 15 researchers, last checked 2026-04-14 — >30 days overdue)
18	
19	Searches run for all 15 researchers. No new publications found within the July 27–August 3 window for any watchlist researcher. The most significant watchlist items discovered from earlier in 2026 (outside the window) are:
20	
21	- **Erik Brynjolfsson** (Stanford DEL): Canaries dashboard extended to April 2026 data (launched June 1, 2026); shows a **16% relative employment decline** for workers aged 22–25 in the most-exposed roles; macro "Takeoff Tracker" reads mostly neutral. Also: "Adoption of Industrial AI in America" (AEA P&P, May 2026).
22	- **Daron Acemoglu** (MIT): "Building Pro-Worker Artificial Intelligence" (NBER w34854, with Autor and Johnson, Feb 2026). Also signatory on the Stanford DEL "We Must Act Now" statement (July 13, 2026).
23	- **Alexander Bick / David Deming** (St. Louis Fed / Harvard): "What Work Does Generative AI Do?" (Working Paper, April 2026) — finds genAI adoption widespread, >80% of occupations have adoption rates >20%, but existing exposure measures explain only ~50% of variation.
24	- **Jed Kolko** (PIIE): "Research on AI and the Labor Market Is Still in the First Inning" (Brookings, March 10, 2026).
25	
26	*Recommend updating `lastChecked` for all researchers to 2026-08-03.*
27	
28	---
29	
30	## New Sources
31	
32	### The Impact of AI on the U.S. Labor Market: Early Evidence from Observed Adoption
33	- **Publisher:** Apollo Global Management
34	- **Date:** 2026-07-30
35	- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
36	- **Evidence Tier:** 2 (Investment bank research; rigorous DiD methodology using observed Anthropic usage logs; not peer-reviewed)
37	- **Source ID:** apollo-ai-us-labor-2026
38	- **Authors:** Sania Edlich and Torsten Slok
39	
40	**Methodology note:** Uses a difference-in-differences design with occupation and year fixed effects across 321 BLS-matched occupations, 2015–2025. "High exposure" is defined as Anthropic Economic Index score ≥0.5 (at least half of an occupation's tasks observed being performed with AI). This is observed usage, not theoretical exposure — a significantly more conservative and arguably more accurate measure. The Anthropic Economic Index was released in March 2026 (Massenkoff and McCrory, 2026).
41	
42	**Statistics:**
43	
44	1. **Graph:** Median Wage Impact (`median-wage-impact`)
45	   **Type:** OVERLAY (down)
46	   **Value:** -6.7 percentage points (real wage growth differential post-2023 for high-exposure occupations)
47	   **Quote:** "high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage compression rather than workforce reduction"
48	   **Notes:** Statistically significant at p<0.01. Observed 2023–2025, not projected to 2030. Applies to ~3.7% of US labor force in "high-exposure" occupations. Unit mismatch with graph (graph: % change in real median wage by 2030; stat: measured growth differential for exposed subset) → classified OVERLAY.
49	
50	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
51	   **Type:** OVERLAY (down)
52	   **Value:** -10.7 percentage points (real wage growth differential for bottom wage quartile in AI-exposed occupations post-2023)
53	   **Quote:** "workers in the bottom quartile of the wage distribution had their real wage growth decline by around 10.7% relative to low-exposure occupations"
54	   **Notes:** p<0.01. Effect is gradient: Q1 −10.7%, Q2 −5.4%, Q3 −4.0%, Q4 not significant. This is a current measured effect (2023–2025), not a 2030 projection, and applies to the bottom quartile within AI-exposed occupations only → OVERLAY.
55	
56	3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
57	   **Type:** DATA_POINT
58	   **Value:** 3.7 (% of US labor force in truly high AI-usage occupations, using actual Claude interaction logs)
59	   **Quote:** "5.8 million workers in the U.S. are currently working in high exposure occupations (as defined above), which represents about 3.7% of the U.S. labor force… This number is significantly lower than theoretical estimates have projected over the past three years."
60	   **Notes:** This is a lower-bound "observed usage" measure; theoretical exposure measures would yield far higher estimates. Represents occupations where ≥50% of tasks are observed being performed with AI (Anthropic Economic Index ≥0.5). Directly comparable to the `workforce-ai-exposure` graph unit, though conservative.
61	
62	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
63	   **Type:** OVERLAY (neutral)
64	   **Value:** 0 (no detectable aggregate employment effect through 2025)
65	   **Quote:** "no significant employment effect was found from an occupation having a high AI exposure score"
66	   **Notes:** The employment interaction coefficient is −0.0639 (s.e. 0.0870), statistically insignificant. Robust across exposure cutoffs of 0.4 and 0.6. This is a null finding that constrains displacement claims.
67	
68	5. **Graph:** Financial Services Displacement (`financial-services-displacement`)
69	   **Type:** OVERLAY (down)
70	   **Value:** -0.2 (real wage growth effect for financial and investment analysts, 2022–2024, Anthropic score 0.57)
71	   **Quote:** "Financial and Investment Analysts (0.25%)… Anthropic Score: 0.57… △Real Wage (%): -0.2"
72	   **Notes:** From Appendix B occupation-level table. Small real-world effect observed in this occupation; Anthropic score of 0.57 classifies it as "high exposure." Employment change was +16.9% in the same period. Wage compression, not displacement.
73	
74	6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
75	   **Type:** OVERLAY (down)
76	   **Value:** -4.1 percentage points (real wage growth differential for management/professional occupations in high-exposure group)
77	   **Quote:** "Management and professional occupations (such as top executives, financial managers, and administrators) also had significant impacts on their real wage growth, as it fell 4.1% relative to non-exposure peers"
78	   **Notes:** p<0.10. Management/Professional subgroup coefficient: −0.0395. Applies to 2,035 occupation-year observations in that subgroup. This is a wage effect, not a displacement rate → OVERLAY.
79	
80	---
81	
82	### Revelio Labs AI Labor Market Tracker — July 2026 (Inaugural Edition)
83	- **Publisher:** Revelio Labs
84	- **Date:** 2026-07-28
85	- **URL:** https://www.reveliolabs.com/ai-labor-market-tracker/us/july-2026
86	- **Evidence Tier:** 3 (Proprietary workforce/job-posting data; not peer-reviewed; combines original analyses with academic replications; sophisticated methodology)
87	- **Source ID:** revelio-ai-labor-tracker-july-2026
88	- **Authors:** Lisa K. Simon (Chief Economist), Ben Zweig (CEO), Caelan Wilkie-Rogers
89	
90	**Description:** Inaugural monthly AI Labor Market Tracker from Revelio Labs, launched July 28, 2026. Built on 1.1 billion professional profiles and 5 billion job postings; covers labor supply, employer demand, employment/wages, work activities, and hiring process. Distinguishes between AI exposure (anticipation effects) and AI adoption (firm-level realization).
91	
92	**Statistics:**
93	
94	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
95	   **Type:** OVERLAY (down)
96	   **Value:** -4.0 (% employment growth differential between most vs. least AI-exposed occupations since Oct 2022)
97	   **Quote:** "Since ChatGPT's launch, employment in occupations containing the most AI-exposed work has grown about 4% less than employment in the least-exposed occupations."
98	   **Notes:** Based on event-study design (Brynjolfsson, Chandar, Chen 2025 replication/extension); two-way fixed effects with occupation and month. This is a *growth differential*, not an absolute displacement rate. Applied to the most vs. least AI-exposed quintile occupations → OVERLAY.
99	
100	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
101	   **Type:** OVERLAY (up)
102	   **Value:** 27.0 (% headcount growth advantage of AI-adopting firms vs. non-adopters since Oct 2022)
103	   **Quote:** "firms that have actually adopted AI have grown headcount 27% more than non-adopters today. The growth is concentrated in senior roles, which are up 31%, compared with 6% for junior roles."
104	   **Notes:** AI-adopting firms identified via posting for AI-integrator roles (Hosseini Maasoum and Lichtinger 2025 approach). Adopting firms were growing faster pre-adoption; not random assignment. Key distinction: exposure suppresses certain occupational demand, but adoption correlates with firm-level expansion → OVERLAY (up) because the signal for the `ai-adoption-rate` graph is that adopting firms *grow*, not shrink.
105	
106	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
107	   **Type:** OVERLAY (down)
108	   **Value:** -25.0 (percentage points, headcount growth gap between senior and junior roles at AI-adopting firms: senior +31%, junior +6%)
109	   **Quote:** "Senior headcount grows by 31%, compared with only 6% for junior roles. While lower compared to senior level employment growth, junior growth is still higher at adopting firms compared to non-AI adopting firms."
110	   **Notes:** This is a headcount growth statistic (not a wage measure), so unit is incompatible with the graph's wage unit. The statistic signals structural pressure on entry-level headcount at firms deploying AI → OVERLAY (down).
111	
112	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
113	   **Type:** OVERLAY (up)
114	   **Value:** 31.0 (% of newly reported professional certifications that are AI-related, June 2026)
115	   **Quote:** "31% of all newly reported certifications on professional profiles in June 2026 were AI certifications."
116	   **Notes:** From Revelio Labs workforce data from professional online profiles. Of those AI certifications, 47% were specifically Generative AI & LLM related. This reflects supply-side upskilling rather than direct work adoption → OVERLAY (up).
117	
118	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
119	   **Type:** OVERLAY (up)
120	   **Value:** 8.4 (percentage points, year-over-year change in activity-mix dissimilarity index, June 2026)
121	   **Quote:** "In June 2026 the year-over-year change in the activity mix dissimilarity index increased to 8.4 percentage points, meaning that 8.4% of the economy's headcount-weighted activity mix would need to be reallocated across activities to return to its June 2025 composition."
122	   **Notes:** Unique within-occupation metric. Most of the change is *within* occupations, not across them, meaning occupation-level employment data understates the transformation. "Work is changing faster than jobs." This accelerating within-occupation change is a signal that AI exposure is broadening → OVERLAY (up).
123	
124	---
125	
126	## Sources Checked but Not Relevant (within 7-day window or closely proximate)
127	
128	The following URLs were fetched or searched. They either fall outside the July 27–August 3 window, do not contain new AI labor statistics not already documented in the jobsdata.ai database, or are secondary aggregations from Tier 4 sources without original quantitative claims:
129	
130	- **https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html** — PwC 2026 Global AI Jobs Barometer, June 15, 2026. *Outside 7-day window.* Rich original data (AI skills wage premium hit 62%; AI jobs growing 8× faster than total; entry-level AI-exposed roles grew 35% since 2019 while other entry-level declined 10%) — highly relevant but predates the window.
131	- **https://www.stlouisfed.org/on-the-economy/2026/jul/new-survey-findings-ai-adoption-eighth-district** — St. Louis Fed, July 16, 2026. *Outside 7-day window.* Key data: 34% of Eighth District firms use AI regularly by a small share of employees; 49% expect no staffing effect from AI in next 12 months; ~20% expect slight staffing reductions.
132	- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census BTOS story, May 21, 2026. *Outside 7-day window.* Key data: AI usage 17–20% of US businesses (Dec 2025–May 2026); 20–23% expected usage within 6 months.
133	- **https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html** — Census working paper on BTOS microstructure. Date unclear, likely spring 2026. Key data: 18% of firms used AI in a business function (Nov 2025–Jan 2026), 32% employment-weighted; AI employment decreases in only 2% of firms. *Uncertain whether within window.*
134	- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Fed FEDS Note, April 3, 2026. *Outside window.* BTOS adoption at ~18% of firms end of 2025; >20% expect to use AI in H1 2026.
135	- **https://www.nber.org/papers/w34859** — NBER w34859 "Chaining Tasks, Redefining Work," February 2026. Theoretical framework paper; no quantitative employment statistics for graph mapping. *Outside window.*
136	- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/Manning & Aguirre NBER paper. Date of Brookings post unclear; underlying NBER paper 2026. References 3.9% of US workers at high exposure and low adaptive capacity. *Date unclear; may be outside window.*
137	- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF Staff Discussion Note SDN2026/001 "Bridging Skill Gaps for the Future." Date: early 2026. Contains wage premium data for new skills (UK: up to 15% for 4+ new skills; US: 8.5%). *Outside window or date unclear.*
138	- **https://www.reveliolabs.com/news/ai-and-work/introduction-the-revelio-ai-labor-market-tracker** — Blog post introducing the tracker, July 28, 2026. *Redundant with the tracker itself; same source.*
139	- Multiple Tier 4 roundup/aggregation sites (letaido.com, axis-intelligence.com, designrush.com, click-vision.com, etc.) — No original quantitative claims; all statistics traced back to older primary sources.
140	- **https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026** — S&P Global PMI survey, 2026. Shows -5 net employment balance globally; 8 pp more large enterprises reporting AI-related job reductions than gains. *Date unclear; not confirmed within 7-day window.*
141	
142	---
143	
144	## Priority Recommendations
145	
146	### Ingest Immediately
147	1. **Apollo Global Management (July 30, 2026)** — Tier 2. This is the highest-priority ingest. It is the first causal wage estimate using *observed* rather than theoretical AI exposure, and its findings diverge materially from the current consensus: wage compression is now measurable and significant (−6.7%), whereas employment displacement is not. This directly informs the `median-wage-impact` and `entry-level-wage-impact` graphs.
148	
149	2. **Revelio Labs AI Labor Market Tracker (July 28, 2026)** — Tier 3. First edition of a monthly recurring data product. The −4% occupation-level employment growth differential corroborates the Brynjolfsson Canaries research using different data. The 27% headcount growth advantage for AI-adopting firms is an important counter-signal for displacement narratives. Recommend adding to the recurring-sources registry for monthly tracking.
150	
151	### Statistics Diverging from Graph Consensus
152	- **Apollo −6.7% wage compression** differs in direction from the IMF/Brookings literature citing wage premiums for AI-skilled workers. The key distinction: Apollo captures wage suppression for *workers in AI-exposed occupations*, whereas PwC/IMF capture wage premiums for *workers who have AI skills*. These are two different population cuts. Both can be simultaneously true. Ingestors should flag this as an important methodological divergence for the `median-wage-impact` graph.
153	- **Apollo's 3.7% "truly high-usage" workforce** sharply undercuts theoretical exposure estimates (which range from 19% to 60+% of US workers depending on the measure). The Revelio Labs tracker explicitly documents this gap: "Work is changing faster than jobs." The `workforce-ai-exposure` graph should carry a note distinguishing theoretical exposure (high) from observed high-usage (3.7%).
154	- **Apollo null employment finding** provides evidence against the displacement narratives underpinning most `overall-us-displacement` graph projections — at least for the 2023–2025 period. The story is wage compression, not headcount reduction, so far.
155	
156	### Recurring Series / Registry Updates
157	- Add **Revelio Labs AI Labor Market Tracker** to recurring-sources.json (`cadence: monthly`, `releasePattern: last Monday of each month`, `targetGraphs: [overall-us-displacement, ai-adoption-rate, entry-level-wage-impact, workforce-ai-exposure]`).
158	- Add **PwC Global AI Jobs Barometer** to recurring-sources.json (`cadence: annual`, `releasePattern: June each year`, `targetGraphs: [high-skill-wage-premium, entry-level-wage-impact, ai-adoption-rate]`). 2026 edition published June 15, 2026; mark `lastIngested: 2026-06-15`.
159	
160	### New Government Data to Watch
161	- **Census BTOS biweekly release** — Next release due ~August 6, 2026. Latest available data runs through ~early July 2026. The AI supplement questions (Nov 2025–Feb 2026 window) have been published; the next wave of AI supplement data has not yet been announced. Monitor for `ai-adoption-rate` graph.
162	- **BLS Occupational Employment and Wage Statistics (OEWS)** annual update — typically released May. 2026 edition would update the base data used in the Apollo paper (currently through May 2024). Not yet released for 2026.
# AI Labor Research Digest — 2026-08-03

## Summary

This week's sweep (July 27–August 3, 2026) yielded two substantive new sources published squarely within the window: Apollo Global Management's causal difference-in-differences study using observed Anthropic AI-usage data (July 30) and the inaugural Revelio Labs AI Labor Market Tracker (July 28). The Apollo paper is the week's headline find — it provides the first causal wage-compression estimates derived from *actual* AI usage logs (not theoretical exposure), documenting a statistically significant 6.7% decline in real wage growth for high-exposure workers post-2023 with no detectable aggregate employment effect. The Revelio Labs tracker, a Tier 3 private-data source, independently corroborates employer-demand suppression in exposed occupations and finds a 4% relative employment shortfall at the occupation level since ChatGPT's launch. No Tier 1 peer-reviewed or government statistical releases fell within the seven-day window. The only series in the recurring-sources registry (`ellucian-highered-ai`) is not due until March 2027. All 15 watchlist researchers were overdue for a check (last checked 2026-04-14); no new publications from any of them were found within this specific 7-day window, though notable works from earlier in 2026 are flagged below.

---

## Recurring Series Status

- **ellucian-highered-ai** (`nextExpected: 2027-03-01`): Not due — no check performed.

*Note: The PwC 2026 Global AI Jobs Barometer (published June 15, 2026) is an important recurring release that does not yet appear in the recurring-sources.json registry. It was released six weeks before this digest window and is documented under "Sources Checked but Not Relevant" below. Recommend adding `pwc-ai-jobs-barometer` to the registry.*

---

## Watchlist Summary (All 15 researchers, last checked 2026-04-14 — >30 days overdue)

Searches run for all 15 researchers. No new publications found within the July 27–August 3 window for any watchlist researcher. The most significant watchlist items discovered from earlier in 2026 (outside the window) are:

- **Erik Brynjolfsson** (Stanford DEL): Canaries dashboard extended to April 2026 data (launched June 1, 2026); shows a **16% relative employment decline** for workers aged 22–25 in the most-exposed roles; macro "Takeoff Tracker" reads mostly neutral. Also: "Adoption of Industrial AI in America" (AEA P&P, May 2026).
- **Daron Acemoglu** (MIT): "Building Pro-Worker Artificial Intelligence" (NBER w34854, with Autor and Johnson, Feb 2026). Also signatory on the Stanford DEL "We Must Act Now" statement (July 13, 2026).
- **Alexander Bick / David Deming** (St. Louis Fed / Harvard): "What Work Does Generative AI Do?" (Working Paper, April 2026) — finds genAI adoption widespread, >80% of occupations have adoption rates >20%, but existing exposure measures explain only ~50% of variation.
- **Jed Kolko** (PIIE): "Research on AI and the Labor Market Is Still in the First Inning" (Brookings, March 10, 2026).

*Recommend updating `lastChecked` for all researchers to 2026-08-03.*

---

## New Sources

### The Impact of AI on the U.S. Labor Market: Early Evidence from Observed Adoption
- **Publisher:** Apollo Global Management
- **Date:** 2026-07-30
- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf
- **Evidence Tier:** 2 (Investment bank research; rigorous DiD methodology using observed Anthropic usage logs; not peer-reviewed)
- **Source ID:** apollo-ai-us-labor-2026
- **Authors:** Sania Edlich and Torsten Slok

**Methodology note:** Uses a difference-in-differences design with occupation and year fixed effects across 321 BLS-matched occupations, 2015–2025. "High exposure" is defined as Anthropic Economic Index score ≥0.5 (at least half of an occupation's tasks observed being performed with AI). This is observed usage, not theoretical exposure — a significantly more conservative and arguably more accurate measure. The Anthropic Economic Index was released in March 2026 (Massenkoff and McCrory, 2026).

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -6.7 percentage points (real wage growth differential post-2023 for high-exposure occupations)
   **Quote:** "high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage compression rather than workforce reduction"
   **Notes:** Statistically significant at p<0.01. Observed 2023–2025, not projected to 2030. Applies to ~3.7% of US labor force in "high-exposure" occupations. Unit mismatch with graph (graph: % change in real median wage by 2030; stat: measured growth differential for exposed subset) → classified OVERLAY.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -10.7 percentage points (real wage growth differential for bottom wage quartile in AI-exposed occupations post-2023)
   **Quote:** "workers in the bottom quartile of the wage distribution had their real wage growth decline by around 10.7% relative to low-exposure occupations"
   **Notes:** p<0.01. Effect is gradient: Q1 −10.7%, Q2 −5.4%, Q3 −4.0%, Q4 not significant. This is a current measured effect (2023–2025), not a 2030 projection, and applies to the bottom quartile within AI-exposed occupations only → OVERLAY.

3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** DATA_POINT
   **Value:** 3.7 (% of US labor force in truly high AI-usage occupations, using actual Claude interaction logs)
   **Quote:** "5.8 million workers in the U.S. are currently working in high exposure occupations (as defined above), which represents about 3.7% of the U.S. labor force… This number is significantly lower than theoretical estimates have projected over the past three years."
   **Notes:** This is a lower-bound "observed usage" measure; theoretical exposure measures would yield far higher estimates. Represents occupations where ≥50% of tasks are observed being performed with AI (Anthropic Economic Index ≥0.5). Directly comparable to the `workforce-ai-exposure` graph unit, though conservative.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no detectable aggregate employment effect through 2025)
   **Quote:** "no significant employment effect was found from an occupation having a high AI exposure score"
   **Notes:** The employment interaction coefficient is −0.0639 (s.e. 0.0870), statistically insignificant. Robust across exposure cutoffs of 0.4 and 0.6. This is a null finding that constrains displacement claims.

5. **Graph:** Financial Services Displacement (`financial-services-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -0.2 (real wage growth effect for financial and investment analysts, 2022–2024, Anthropic score 0.57)
   **Quote:** "Financial and Investment Analysts (0.25%)… Anthropic Score: 0.57… △Real Wage (%): -0.2"
   **Notes:** From Appendix B occupation-level table. Small real-world effect observed in this occupation; Anthropic score of 0.57 classifies it as "high exposure." Employment change was +16.9% in the same period. Wage compression, not displacement.

6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -4.1 percentage points (real wage growth differential for management/professional occupations in high-exposure group)
   **Quote:** "Management and professional occupations (such as top executives, financial managers, and administrators) also had significant impacts on their real wage growth, as it fell 4.1% relative to non-exposure peers"
   **Notes:** p<0.10. Management/Professional subgroup coefficient: −0.0395. Applies to 2,035 occupation-year observations in that subgroup. This is a wage effect, not a displacement rate → OVERLAY.

---

### Revelio Labs AI Labor Market Tracker — July 2026 (Inaugural Edition)
- **Publisher:** Revelio Labs
- **Date:** 2026-07-28
- **URL:** https://www.reveliolabs.com/ai-labor-market-tracker/us/july-2026
- **Evidence Tier:** 3 (Proprietary workforce/job-posting data; not peer-reviewed; combines original analyses with academic replications; sophisticated methodology)
- **Source ID:** revelio-ai-labor-tracker-july-2026
- **Authors:** Lisa K. Simon (Chief Economist), Ben Zweig (CEO), Caelan Wilkie-Rogers

**Description:** Inaugural monthly AI Labor Market Tracker from Revelio Labs, launched July 28, 2026. Built on 1.1 billion professional profiles and 5 billion job postings; covers labor supply, employer demand, employment/wages, work activities, and hiring process. Distinguishes between AI exposure (anticipation effects) and AI adoption (firm-level realization).

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -4.0 (% employment growth differential between most vs. least AI-exposed occupations since Oct 2022)
   **Quote:** "Since ChatGPT's launch, employment in occupations containing the most AI-exposed work has grown about 4% less than employment in the least-exposed occupations."
   **Notes:** Based on event-study design (Brynjolfsson, Chandar, Chen 2025 replication/extension); two-way fixed effects with occupation and month. This is a *growth differential*, not an absolute displacement rate. Applied to the most vs. least AI-exposed quintile occupations → OVERLAY.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 27.0 (% headcount growth advantage of AI-adopting firms vs. non-adopters since Oct 2022)
   **Quote:** "firms that have actually adopted AI have grown headcount 27% more than non-adopters today. The growth is concentrated in senior roles, which are up 31%, compared with 6% for junior roles."
   **Notes:** AI-adopting firms identified via posting for AI-integrator roles (Hosseini Maasoum and Lichtinger 2025 approach). Adopting firms were growing faster pre-adoption; not random assignment. Key distinction: exposure suppresses certain occupational demand, but adoption correlates with firm-level expansion → OVERLAY (up) because the signal for the `ai-adoption-rate` graph is that adopting firms *grow*, not shrink.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -25.0 (percentage points, headcount growth gap between senior and junior roles at AI-adopting firms: senior +31%, junior +6%)
   **Quote:** "Senior headcount grows by 31%, compared with only 6% for junior roles. While lower compared to senior level employment growth, junior growth is still higher at adopting firms compared to non-AI adopting firms."
   **Notes:** This is a headcount growth statistic (not a wage measure), so unit is incompatible with the graph's wage unit. The statistic signals structural pressure on entry-level headcount at firms deploying AI → OVERLAY (down).

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 31.0 (% of newly reported professional certifications that are AI-related, June 2026)
   **Quote:** "31% of all newly reported certifications on professional profiles in June 2026 were AI certifications."
   **Notes:** From Revelio Labs workforce data from professional online profiles. Of those AI certifications, 47% were specifically Generative AI & LLM related. This reflects supply-side upskilling rather than direct work adoption → OVERLAY (up).

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 8.4 (percentage points, year-over-year change in activity-mix dissimilarity index, June 2026)
   **Quote:** "In June 2026 the year-over-year change in the activity mix dissimilarity index increased to 8.4 percentage points, meaning that 8.4% of the economy's headcount-weighted activity mix would need to be reallocated across activities to return to its June 2025 composition."
   **Notes:** Unique within-occupation metric. Most of the change is *within* occupations, not across them, meaning occupation-level employment data understates the transformation. "Work is changing faster than jobs." This accelerating within-occupation change is a signal that AI exposure is broadening → OVERLAY (up).

---

## Sources Checked but Not Relevant (within 7-day window or closely proximate)

The following URLs were fetched or searched. They either fall outside the July 27–August 3 window, do not contain new AI labor statistics not already documented in the jobsdata.ai database, or are secondary aggregations from Tier 4 sources without original quantitative claims:

- **https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html** — PwC 2026 Global AI Jobs Barometer, June 15, 2026. *Outside 7-day window.* Rich original data (AI skills wage premium hit 62%; AI jobs growing 8× faster than total; entry-level AI-exposed roles grew 35% since 2019 while other entry-level declined 10%) — highly relevant but predates the window.
- **https://www.stlouisfed.org/on-the-economy/2026/jul/new-survey-findings-ai-adoption-eighth-district** — St. Louis Fed, July 16, 2026. *Outside 7-day window.* Key data: 34% of Eighth District firms use AI regularly by a small share of employees; 49% expect no staffing effect from AI in next 12 months; ~20% expect slight staffing reductions.
- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census BTOS story, May 21, 2026. *Outside 7-day window.* Key data: AI usage 17–20% of US businesses (Dec 2025–May 2026); 20–23% expected usage within 6 months.
- **https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html** — Census working paper on BTOS microstructure. Date unclear, likely spring 2026. Key data: 18% of firms used AI in a business function (Nov 2025–Jan 2026), 32% employment-weighted; AI employment decreases in only 2% of firms. *Uncertain whether within window.*
- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Fed FEDS Note, April 3, 2026. *Outside window.* BTOS adoption at ~18% of firms end of 2025; >20% expect to use AI in H1 2026.
- **https://www.nber.org/papers/w34859** — NBER w34859 "Chaining Tasks, Redefining Work," February 2026. Theoretical framework paper; no quantitative employment statistics for graph mapping. *Outside window.*
- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/Manning & Aguirre NBER paper. Date of Brookings post unclear; underlying NBER paper 2026. References 3.9% of US workers at high exposure and low adaptive capacity. *Date unclear; may be outside window.*
- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF Staff Discussion Note SDN2026/001 "Bridging Skill Gaps for the Future." Date: early 2026. Contains wage premium data for new skills (UK: up to 15% for 4+ new skills; US: 8.5%). *Outside window or date unclear.*
- **https://www.reveliolabs.com/news/ai-and-work/introduction-the-revelio-ai-labor-market-tracker** — Blog post introducing the tracker, July 28, 2026. *Redundant with the tracker itself; same source.*
- Multiple Tier 4 roundup/aggregation sites (letaido.com, axis-intelligence.com, designrush.com, click-vision.com, etc.) — No original quantitative claims; all statistics traced back to older primary sources.
- **https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026** — S&P Global PMI survey, 2026. Shows -5 net employment balance globally; 8 pp more large enterprises reporting AI-related job reductions than gains. *Date unclear; not confirmed within 7-day window.*

---

## Priority Recommendations

### Ingest Immediately
1. **Apollo Global Management (July 30, 2026)** — Tier 2. This is the highest-priority ingest. It is the first causal wage estimate using *observed* rather than theoretical AI exposure, and its findings diverge materially from the current consensus: wage compression is now measurable and significant (−6.7%), whereas employment displacement is not. This directly informs the `median-wage-impact` and `entry-level-wage-impact` graphs.

2. **Revelio Labs AI Labor Market Tracker (July 28, 2026)** — Tier 3. First edition of a monthly recurring data product. The −4% occupation-level employment growth differential corroborates the Brynjolfsson Canaries research using different data. The 27% headcount growth advantage for AI-adopting firms is an important counter-signal for displacement narratives. Recommend adding to the recurring-sources registry for monthly tracking.

### Statistics Diverging from Graph Consensus
- **Apollo −6.7% wage compression** differs in direction from the IMF/Brookings literature citing wage premiums for AI-skilled workers. The key distinction: Apollo captures wage suppression for *workers in AI-exposed occupations*, whereas PwC/IMF capture wage premiums for *workers who have AI skills*. These are two different population cuts. Both can be simultaneously true. Ingestors should flag this as an important methodological divergence for the `median-wage-impact` graph.
- **Apollo's 3.7% "truly high-usage" workforce** sharply undercuts theoretical exposure estimates (which range from 19% to 60+% of US workers depending on the measure). The Revelio Labs tracker explicitly documents this gap: "Work is changing faster than jobs." The `workforce-ai-exposure` graph should carry a note distinguishing theoretical exposure (high) from observed high-usage (3.7%).
- **Apollo null employment finding** provides evidence against the displacement narratives underpinning most `overall-us-displacement` graph projections — at least for the 2023–2025 period. The story is wage compression, not headcount reduction, so far.

### Recurring Series / Registry Updates
- Add **Revelio Labs AI Labor Market Tracker** to recurring-sources.json (`cadence: monthly`, `releasePattern: last Monday of each month`, `targetGraphs: [overall-us-displacement, ai-adoption-rate, entry-level-wage-impact, workforce-ai-exposure]`).
- Add **PwC Global AI Jobs Barometer** to recurring-sources.json (`cadence: annual`, `releasePattern: June each year`, `targetGraphs: [high-skill-wage-premium, entry-level-wage-impact, ai-adoption-rate]`). 2026 edition published June 15, 2026; mark `lastIngested: 2026-06-15`.

### New Government Data to Watch
- **Census BTOS biweekly release** — Next release due ~August 6, 2026. Latest available data runs through ~early July 2026. The AI supplement questions (Nov 2025–Feb 2026 window) have been published; the next wave of AI supplement data has not yet been announced. Monitor for `ai-adoption-rate` graph.
- **BLS Occupational Employment and Wage Statistics (OEWS)** annual update — typically released May. 2026 edition would update the base data used in the Apollo paper (currently through May 2024). Not yet released for 2026.