1	# AI Labor Research Digest — 2026-06-29
2	
3	## Summary
4	
5	The 7-day window (June 22–29, 2026) yielded **one primary in-window source**: Anthropic's Economic Index report "Cadences," published June 26, 2026, which introduced the first survey of Claude users (n ≈ 9,700) linked to actual session telemetry. This Tier 3 source is notable for its methodology (observed behavior cross-checked against self-reported beliefs) but is significantly biased toward knowledge workers already using frontier AI. No new Tier 1 government or peer-reviewed data were released in the strict 7-day window. Two high-quality Tier 2 sources published within the preceding two weeks — the PwC 2026 Global AI Jobs Barometer (June 15) and the Stanford Digital Economy Lab's AI Economic Indicators launch (June 10) — are flagged as possibly missed and included here. The overall picture across all three is consistent: wage premiums for AI-skilled workers are rising sharply, aggregate displacement remains modest and concentrated at the entry level, and AI-exposed companies are paradoxically growing headcount faster than less-exposed peers.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### Anthropic Economic Index Report: "Cadences"
14	
15	- **Publisher:** Anthropic
16	- **Date:** 2026-06-26
17	- **URL:** https://www.anthropic.com/research/economic-index-june-2026-report
18	- **Evidence Tier:** 3 (Tech company proprietary research — AI vendor, survey of own users)
19	- **Source ID:** anthropic-economic-index-june-2026
20	- **Key caveat:** Sample is ~9,700 active Claude users, heavily skewed toward Computer & Mathematical occupations (~30% of respondents vs. 4% of US employment). Workers at highest displacement risk (entry-level roles being substituted, not augmented) are structurally absent from a survey of active Claude users. All statistics below reflect Claude users, not the general workforce.
21	
22	**Statistics:**
23	
24	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
25	   **Type:** OVERLAY (up)
26	   **Value:** 35+ % of workers (surveyed Claude users)
27	   **Quote:** "Over a third expect AI to be able to do most or nearly all of their work tasks next year (Figure 3.2)."
28	   **Mapping note:** This is anticipated exposure among active Claude users (skewed high) 12 months forward, not current adoption across all US adults. The direction is clearly upward but cannot serve as a DATA_POINT for the `genai-work-adoption` graph, which targets all US adults.
29	
30	2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
31	   **Type:** OVERLAY (up)
32	   **Value:** ~50 % of tasks (median Claude user self-report)
33	   **Quote:** "Roughly half of the approximately 9,700 Claude users surveyed reported that AI can already handle 50% or more of their work tasks. A striking 4% said Claude could perform their entire job today."
34	   *(Source: TechTimes coverage of Anthropic report, June 28, 2026, quoting the report's survey chapter. The primary Anthropic report states: "reported exposure systematically exceeds observed exposure.")*
35	   **Mapping note:** "Tasks" ≠ "jobs." This is self-reported task coverage by active Claude users only; cannot be used as a DATA_POINT for the general-workforce exposure metric.
36	
37	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
38	   **Type:** OVERLAY (up)
39	   **Value:** 10 % (self-reported job-loss probability among active Claude users)
40	   **Quote:** "10% rated losing their own jobs as likely or very likely. This is slightly below the annualized hazard rate of losing a job in the US; however, since our respondents skew toward knowledge workers in stable employment (a group that plausibly faces below-average separation risk at baseline), this may still indicate elevated perceived risk."
41	   **Mapping note:** This is perceived job-loss risk among AI-heavy users, not measured displacement. OVERLAY only.
42	
43	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
44	   **Type:** OVERLAY (up)
45	   **Value:** 38 % (share of job-loss-worried Claude users attributing risk to AI)
46	   **Quote:** "38% of the respondents who rated their job loss as likely or very likely attributed their forecasts to AI."
47	   **Mapping note:** Directional signal that AI is a leading concern among at-risk knowledge workers; cannot be converted to a displacement percentage.
48	
49	5. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
50	   **Type:** OVERLAY (up)
51	   **Value:** 57 % (share of Claude users reporting AI made their skills more valuable)
52	   **Quote:** "the majority of people also report learning more with AI (68%) and feeling like AI has made their skills more valuable (57%). Figure 3.7 shows how these two outcomes vary with the share of automated sessions... the share of people reporting that AI is increasing the market value of their skills rises with automation share."
53	   **Mapping note:** Subjective perception of rising skill value among active Claude users; consistent with documented wage premium trajectory, but not a wage measurement.
54	
55	6. **Graph:** Median Wage Impact (`median-wage-impact`)
56	   **Type:** OVERLAY (up)
57	   **Value:** 86 % (share of Claude users reporting productivity gains in speed)
58	   **Quote:** "large majorities of people report productivity gains in speed, scope, and quality of their work (86%, 82%, and 69%, respectively), while 27% report gains through cost savings on services they would otherwise have to purchase."
59	   **Mapping note:** Productivity gains among active Claude users are a leading indicator for eventual wage effects; direction is upward but timing and diffusion to median workers remain uncertain.
60	
61	7. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
62	   **Type:** OVERLAY (down)
63	   **Value:** >33 % (Claude users assigning >60% probability of junior colleague job loss)
64	   **Quote:** "Respondents were especially worried about job loss for their junior colleagues, with over one third stating that the probability of a junior colleague losing their job in the next year was over 60%. Respondents were also more concerned about job loss (for everyone) in lower-income countries."
65	   **Mapping note:** Perceptions of entry-level vulnerability are running hotter than aggregate data, consistent with other evidence of hiring slowdowns for 22–25-year-olds in AI-exposed roles.
66	
67	---
68	
69	### PwC 2026 Global AI Jobs Barometer
70	
71	- **Publisher:** PricewaterhouseCoopers (PwC Global)
72	- **Date:** 2026-06-15
73	- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
74	- **Evidence Tier:** 2 (Major consulting firm — analysis of >1 billion job ads across 27 countries)
75	- **Source ID:** pwc-ai-jobs-barometer-2026
76	- **Key caveat:** Global, not US-specific. Job-ad analysis captures *posted* wages, not realized wages. Published June 15, just outside the strict 7-day window; included because it is a major annual report likely not yet ingested.
77	
78	**Statistics:**
79	
80	1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
81	   **Type:** OVERLAY (up)
82	   **Value:** 62 % (global AI skills wage premium, 2026)
83	   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year. The wage premium varies by industry: as high as 118% in some sectors, such as consumer markets, and 16% in government and public sector work."
84	   **Mapping note:** Global stat (27 countries); represents *posted* advertised wages, not realized compensation. Applied as OVERLAY to the US `high-skill-wage-premium` graph, direction up.
85	
86	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
87	   **Type:** OVERLAY (up)
88	   **Value:** 69 % faster growth rate (AI-skill jobs vs. total jobs market)
89	   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%. The number of AI jobs is almost twice as high as 2024, with growth in AI jobs outpacing all jobs since 2015."
90	   **Mapping note:** Global job-posting metric; cannot substitute for Census BTOS firm-level adoption, but is directionally consistent.
91	
92	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
93	   **Type:** OVERLAY (neutral — divergent)
94	   **Value:** +35 % / −10 % (AI-exposed vs. other entry-level roles, since 2019)
95	   **Quote:** "Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
96	   **Mapping note:** US-specific data point, but it measures role *counts and skill requirements*, not wages directly. The divergence suggests AI is bifurcating entry-level prospects rather than uniformly raising or lowering them. Use as OVERLAY (neutral) pending wage data.
97	
98	4. **Graph:** Median Wage Impact (`median-wage-impact`)
99	   **Type:** OVERLAY (up)
100	   **Value:** 24 % vs. 17 % (wage growth at most vs. least AI-exposed companies)
101	   **Quote:** "Companies most able to use AI are seeing faster headcount growth than the least AI-exposed companies (52% vs 36%) and higher wage growth (24% vs 17%)."
102	   **Mapping note:** Global company-level comparison, not individual worker wages. Applied as OVERLAY; consistent with augmentation-vs-displacement framing where AI-adopting firms grow wages and headcount together.
103	
104	5. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
105	   **Type:** OVERLAY (neutral — divergent)
106	   **Value:** ×2 (professionalised jobs growing twice as fast as democratised)
107	   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
108	   **Mapping note:** Distinction between professionalised (AI augments, human expertise valued more) and democratised (AI lowers skill barrier) is directly relevant to white-collar displacement forecasts. AI is not uniformly displacing white-collar roles — it is splitting them. OVERLAY neutral.
109	
110	6. **Graph:** Geographic Wage Divergence (`geographic-wage-divergence`)
111	   **Type:** OVERLAY (up)
112	   **Value:** 163 % (labor productivity growth for top 20% most AI-exposed companies vs. 2018)
113	   **Quote:** "Within this group, a pronounced 'super-star' effect is emerging. The top 20% of the most AI-exposed companies achieved average labour productivity growth of 163% relative to 2018 – nearly five times higher than the most AI-exposed companies overall."
114	   **Mapping note:** Company-level productivity divergence implies geographic wage divergence as AI hub companies cluster. Applied as OVERLAY (up) — the AI hub premium is likely growing.
115	
116	---
117	
118	### Stanford Digital Economy Lab — AI Economic Indicators Launch (Canaries Dashboard)
119	
120	- **Publisher:** Stanford Digital Economy Lab / ADP Research (joint)
121	- **Date:** 2026-06-10
122	- **URL:** https://digitaleconomy.stanford.edu/project/indicators/
123	- **Evidence Tier:** 2 (Academic + payroll data partnership — ADP payroll records from 25,000 firms, 4.6M workers; monthly updates)
124	- **Source ID:** stanford-del-ai-economic-indicators-2026
125	- **Key caveat:** Sample restricted to ADP-payroll firms matched to occupation codes; not fully representative of all US employment. Published June 10, just outside the strict 7-day window; included because it is a major new data infrastructure launch.
126	
127	**Statistics:**
128	
129	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
130	   **Type:** OVERLAY (up)
131	   **Value:** ~0 % net aggregate (modest positive/negative divergence by quintile)
132	   **Quote:** "We group workers by their AI exposure score, comparing employment trends across these groups. We see modest differences between the five exposure groups, although employment growth is lowest for the most exposed occupations." (Stanford DEL Canaries Dashboard description)
133	   **Mapping note:** At the aggregate level, no dramatic displacement. The *directional signal* is upward (toward more displacement) but the *current measured level* is near zero. Applied as OVERLAY (neutral) for the aggregate graph.
134	
135	2. **Graph:** Overall US Displacement — entry-level sub-signal (`overall-us-displacement`)
136	   **Type:** OVERLAY (up)
137	   **Value:** Declining (for two most exposed quintiles, early-career 22–25)
138	   **Quote:** "For early-career workers (22-25), the two most exposed groups of occupations see noticeable declines since the introduction of ChatGPT, while the other three occupation groups see growth. These patterns become less stark, and ultimately disappear, as we consider older workers." (Stanford DEL Canaries Dashboard)
139	   **Mapping note:** This is ADP payroll-based evidence of real employment decline among the most AI-exposed early-career workers. This is the strongest empirical signal of emerging displacement in the data — but it is narrow, age-specific, and not yet aggregate. OVERLAY (up) for displacement graphs.
140	
141	3. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
142	   **Type:** OVERLAY (neutral)
143	   **Value:** 0 (no decisive evidence of takeoff)
144	   **Quote:** "The Takeoff Tracker monitors macroeconomic indicators associated with advances in AI capabilities and broader economic change. Stanford Digital Economy Lab said its current set of 12 indicators shows no decisive evidence of takeoff at present." (EdTech Innovation Hub coverage of Stanford DEL launch, June 10, 2026)
145	   **Mapping note:** The absence of macro takeoff signals means the earnings-call AI-mention surge is not yet translating into measurable economy-wide productivity effects. OVERLAY neutral.
146	
147	---
148	
149	## Sources Checked but Not Relevant or Outside Window
150	
151	The following URLs were fetched and reviewed but did not yield new quantitative AI labor statistics published within the June 22–29, 2026 window, or did not contain sufficient quantitative claims to extract:
152	
153	- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Published January 21, 2026. Outside window. Strong analysis (Brookings/NBER adaptive capacity index); statistics likely already ingested.
154	- **https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html** — Published April 15, 2026 (Census CES Working Paper on AI Diffusion Microstructure). Outside window. Major Tier 1 source; likely not yet ingested (see Priority Recommendations below).
155	- **https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market** — Published May 7, 2026. Outside window. Budget Lab synthetic DID analysis finding no statistically significant AI employment effects as of Q1 2026.
156	- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Published April 3, 2026. Outside window. Federal Reserve synthesis of BTOS + RPS data.
157	- **https://www.census.gov/newsroom/press-releases/2026/btos-june-18.html** — Released June 18, 2026. Tip sheet only; no new quantitative AI-specific statistics released beyond previously reported BTOS figures.
158	- **https://www.census.gov/newsroom/press-releases/2026/btos-june-4.html** — Released June 4, 2026. Same: tip sheet only, refers to AI supplement data from Nov 2025–Feb 2026, previously reported.
159	- **https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026** — Published June 2, 2026. Outside window. Important Tier 2 report; see Priority Recommendations.
160	- **https://www.bcg.com/publications/2026/ai-will-reshape-more-jobs-than-it-replaces** — Published April 3, 2026. Outside window.
161	- **https://www.nber.org/papers/w33867** — Published May 2025 (NBER w33867, Wang & Wong "AI and Technological Unemployment"). Outside window and outside 2026.
162	- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF SDN/2026/001 "New Jobs Creation in the AI Age." Published January 2026. Outside window.
163	- **https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html** — Full Barometer page; stats extracted from press release above.
164	- **https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure** — ILO refined occupational exposure index, 2025. Outside window.
165	- **https://www.techtimes.com/articles/319232/20260628/anthropic-survey-9700-workers-half-say-ai-already-handles-most-job-tasks.htm** — Secondary coverage of Anthropic Economic Index (June 28, 2026). Used to cross-reference Anthropic primary source.
166	- **Various aggregator/blog sources** (designrush.com, almcorp.com, click-vision.com, sqmagazine.co.uk, datarefs.com, index.dev, medhacloud.com, etc.) — Tier 4; statistics either not new, not verifiable to original sources within the window, or paraphrased aggregations of older research.
167	
168	---
169	
170	## Priority Recommendations
171	
172	### Ingest Immediately
173	
174	1. **Census Bureau CES Working Paper CES-WP-26-25** (April 15, 2026) — Tier 1. Nationally representative BTOS data (Nov 2025–Jan 2026) on AI diffusion across firms, business functions, and worker tasks. Key DATA_POINT candidates:
175	   - "During the supplement reference period (Nov 2025-Jan 2026), **18% of firms used AI in a business function**, rising to **32% on an employment-weighted basis**" → `ai-adoption-rate` DATA_POINT (18%) and `genai-work-adoption` OVERLAY
176	   - "**AI-related employment decreases are rare, occurring in only 2% of firms**" → `overall-us-displacement` OVERLAY (down — actual firm-level measurement)
177	   - "**Most users (66%) rely on AI solely to augment tasks**" → `workforce-ai-exposure` OVERLAY (neutral — augmentation dominant)
178	   - "**43% of workers used Generative AI for work**" (Real-Time Population Survey, January–February 2026, cited in working paper) → `genai-work-adoption` strong DATA_POINT candidate
179	   - URL: https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf
180	
181	2. **Census BTOS Story: "Large Firms With at Least 20 Employees Biggest AI Users"** (May 2026) — Tier 1. Contains:
182	   - "The BTOS data (December 2025 to May 2026) show that **overall AI usage hovered between 17% and 20%**" → `ai-adoption-rate` DATA_POINT
183	   - "**37% of firms with at least 250 employees** reported using AI in their business operations" → `ai-adoption-rate` large-firm breakdown
184	   - "**Information (39.7%) and Finance and Insurance (33.9%)** sectors both higher than national rate (19.8%)" → sector overlays
185	   - URL: https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
186	
187	3. **S&P Global PMI Special Report: "The AI and Labor Landscape 2026"** (June 2, 2026) — Tier 2. Contains the first PMI-based evidence of net negative employment impact. Key stats:
188	   - "the latest findings show a **negative global net impact for the past year (-5 points)**" → `overall-us-displacement` OVERLAY (up — global signal, direction is toward displacement)
189	   - "the proportion reporting AI-related job reductions was **8 points higher** than the share reporting gains" among large enterprises → `total-us-jobs-lost` OVERLAY (up)
190	   - "**22% of AI projects target a fully autonomous end state**" → `customer-service-automation` OVERLAY (neutral — autonomy remains limited)
191	   - URL: https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026
192	
193	### Statistics That Diverge Significantly from Current Consensus
194	
195	- **PwC 2026 AI skills wage premium at 62%** is a significant jump from 2025's 57% and represents a continuing acceleration. If the site's `high-skill-wage-premium` graph shows a slower trajectory, this data point should prompt a reassessment.
196	- **Anthropic survey finding that 10% of active Claude users perceive their own job loss as "likely or very likely"** — if the graph consensus for `overall-us-displacement` is tracking near the Goldman Sachs 6–7% baseline, this perceptions signal (among high-AI-exposure workers) is running notably above consensus and should be tracked as a leading indicator.
197	- **Stanford DEL Canaries Dashboard** shows employment declining for the two most-exposed quintiles of early-career workers (22–25) — if the `total-us-jobs-lost` or `overall-us-displacement` graphs do not yet reflect entry-level contraction, this payroll-based evidence (ADP, 4.6M workers, 25K firms) is the strongest real-data support for adding an early-signal OVERLAY.
198	
199	### New Government Data Releases
200	
201	- **Census BTOS biweekly release — June 18, 2026**: No new aggregate statistics; the release confirms continuation of the established BTOS data stream. Next release expected ~July 2, 2026 and may contain updated AI adoption figures for late June.
202	- **Census BTOS biweekly release — June 4, 2026**: Same — tip sheet only.
203	- **BLS JOLTS and CPS data** are being used by the Budget Lab and Anthropic for ongoing labor market tracking; no standalone AI-focused release was identified in the window.
204	
205	---
206	
207	*Digest prepared: 2026-06-29. Window covered: 2026-06-22 through 2026-06-29.*
# AI Labor Research Digest — 2026-06-29

## Summary

The 7-day window (June 22–29, 2026) yielded **one primary in-window source**: Anthropic's Economic Index report "Cadences," published June 26, 2026, which introduced the first survey of Claude users (n ≈ 9,700) linked to actual session telemetry. This Tier 3 source is notable for its methodology (observed behavior cross-checked against self-reported beliefs) but is significantly biased toward knowledge workers already using frontier AI. No new Tier 1 government or peer-reviewed data were released in the strict 7-day window. Two high-quality Tier 2 sources published within the preceding two weeks — the PwC 2026 Global AI Jobs Barometer (June 15) and the Stanford Digital Economy Lab's AI Economic Indicators launch (June 10) — are flagged as possibly missed and included here. The overall picture across all three is consistent: wage premiums for AI-skilled workers are rising sharply, aggregate displacement remains modest and concentrated at the entry level, and AI-exposed companies are paradoxically growing headcount faster than less-exposed peers.

---

## New Sources

---

### Anthropic Economic Index Report: "Cadences"

- **Publisher:** Anthropic
- **Date:** 2026-06-26
- **URL:** https://www.anthropic.com/research/economic-index-june-2026-report
- **Evidence Tier:** 3 (Tech company proprietary research — AI vendor, survey of own users)
- **Source ID:** anthropic-economic-index-june-2026
- **Key caveat:** Sample is ~9,700 active Claude users, heavily skewed toward Computer & Mathematical occupations (~30% of respondents vs. 4% of US employment). Workers at highest displacement risk (entry-level roles being substituted, not augmented) are structurally absent from a survey of active Claude users. All statistics below reflect Claude users, not the general workforce.

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 35+ % of workers (surveyed Claude users)
   **Quote:** "Over a third expect AI to be able to do most or nearly all of their work tasks next year (Figure 3.2)."
   **Mapping note:** This is anticipated exposure among active Claude users (skewed high) 12 months forward, not current adoption across all US adults. The direction is clearly upward but cannot serve as a DATA_POINT for the `genai-work-adoption` graph, which targets all US adults.

2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** ~50 % of tasks (median Claude user self-report)
   **Quote:** "Roughly half of the approximately 9,700 Claude users surveyed reported that AI can already handle 50% or more of their work tasks. A striking 4% said Claude could perform their entire job today."
   *(Source: TechTimes coverage of Anthropic report, June 28, 2026, quoting the report's survey chapter. The primary Anthropic report states: "reported exposure systematically exceeds observed exposure.")*
   **Mapping note:** "Tasks" ≠ "jobs." This is self-reported task coverage by active Claude users only; cannot be used as a DATA_POINT for the general-workforce exposure metric.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 10 % (self-reported job-loss probability among active Claude users)
   **Quote:** "10% rated losing their own jobs as likely or very likely. This is slightly below the annualized hazard rate of losing a job in the US; however, since our respondents skew toward knowledge workers in stable employment (a group that plausibly faces below-average separation risk at baseline), this may still indicate elevated perceived risk."
   **Mapping note:** This is perceived job-loss risk among AI-heavy users, not measured displacement. OVERLAY only.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 38 % (share of job-loss-worried Claude users attributing risk to AI)
   **Quote:** "38% of the respondents who rated their job loss as likely or very likely attributed their forecasts to AI."
   **Mapping note:** Directional signal that AI is a leading concern among at-risk knowledge workers; cannot be converted to a displacement percentage.

5. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 57 % (share of Claude users reporting AI made their skills more valuable)
   **Quote:** "the majority of people also report learning more with AI (68%) and feeling like AI has made their skills more valuable (57%). Figure 3.7 shows how these two outcomes vary with the share of automated sessions... the share of people reporting that AI is increasing the market value of their skills rises with automation share."
   **Mapping note:** Subjective perception of rising skill value among active Claude users; consistent with documented wage premium trajectory, but not a wage measurement.

6. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 86 % (share of Claude users reporting productivity gains in speed)
   **Quote:** "large majorities of people report productivity gains in speed, scope, and quality of their work (86%, 82%, and 69%, respectively), while 27% report gains through cost savings on services they would otherwise have to purchase."
   **Mapping note:** Productivity gains among active Claude users are a leading indicator for eventual wage effects; direction is upward but timing and diffusion to median workers remain uncertain.

7. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** >33 % (Claude users assigning >60% probability of junior colleague job loss)
   **Quote:** "Respondents were especially worried about job loss for their junior colleagues, with over one third stating that the probability of a junior colleague losing their job in the next year was over 60%. Respondents were also more concerned about job loss (for everyone) in lower-income countries."
   **Mapping note:** Perceptions of entry-level vulnerability are running hotter than aggregate data, consistent with other evidence of hiring slowdowns for 22–25-year-olds in AI-exposed roles.

---

### PwC 2026 Global AI Jobs Barometer

- **Publisher:** PricewaterhouseCoopers (PwC Global)
- **Date:** 2026-06-15
- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
- **Evidence Tier:** 2 (Major consulting firm — analysis of >1 billion job ads across 27 countries)
- **Source ID:** pwc-ai-jobs-barometer-2026
- **Key caveat:** Global, not US-specific. Job-ad analysis captures *posted* wages, not realized wages. Published June 15, just outside the strict 7-day window; included because it is a major annual report likely not yet ingested.

**Statistics:**

1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 62 % (global AI skills wage premium, 2026)
   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year. The wage premium varies by industry: as high as 118% in some sectors, such as consumer markets, and 16% in government and public sector work."
   **Mapping note:** Global stat (27 countries); represents *posted* advertised wages, not realized compensation. Applied as OVERLAY to the US `high-skill-wage-premium` graph, direction up.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 69 % faster growth rate (AI-skill jobs vs. total jobs market)
   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%. The number of AI jobs is almost twice as high as 2024, with growth in AI jobs outpacing all jobs since 2015."
   **Mapping note:** Global job-posting metric; cannot substitute for Census BTOS firm-level adoption, but is directionally consistent.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (neutral — divergent)
   **Value:** +35 % / −10 % (AI-exposed vs. other entry-level roles, since 2019)
   **Quote:** "Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
   **Mapping note:** US-specific data point, but it measures role *counts and skill requirements*, not wages directly. The divergence suggests AI is bifurcating entry-level prospects rather than uniformly raising or lowering them. Use as OVERLAY (neutral) pending wage data.

4. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 24 % vs. 17 % (wage growth at most vs. least AI-exposed companies)
   **Quote:** "Companies most able to use AI are seeing faster headcount growth than the least AI-exposed companies (52% vs 36%) and higher wage growth (24% vs 17%)."
   **Mapping note:** Global company-level comparison, not individual worker wages. Applied as OVERLAY; consistent with augmentation-vs-displacement framing where AI-adopting firms grow wages and headcount together.

5. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (neutral — divergent)
   **Value:** ×2 (professionalised jobs growing twice as fast as democratised)
   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
   **Mapping note:** Distinction between professionalised (AI augments, human expertise valued more) and democratised (AI lowers skill barrier) is directly relevant to white-collar displacement forecasts. AI is not uniformly displacing white-collar roles — it is splitting them. OVERLAY neutral.

6. **Graph:** Geographic Wage Divergence (`geographic-wage-divergence`)
   **Type:** OVERLAY (up)
   **Value:** 163 % (labor productivity growth for top 20% most AI-exposed companies vs. 2018)
   **Quote:** "Within this group, a pronounced 'super-star' effect is emerging. The top 20% of the most AI-exposed companies achieved average labour productivity growth of 163% relative to 2018 – nearly five times higher than the most AI-exposed companies overall."
   **Mapping note:** Company-level productivity divergence implies geographic wage divergence as AI hub companies cluster. Applied as OVERLAY (up) — the AI hub premium is likely growing.

---

### Stanford Digital Economy Lab — AI Economic Indicators Launch (Canaries Dashboard)

- **Publisher:** Stanford Digital Economy Lab / ADP Research (joint)
- **Date:** 2026-06-10
- **URL:** https://digitaleconomy.stanford.edu/project/indicators/
- **Evidence Tier:** 2 (Academic + payroll data partnership — ADP payroll records from 25,000 firms, 4.6M workers; monthly updates)
- **Source ID:** stanford-del-ai-economic-indicators-2026
- **Key caveat:** Sample restricted to ADP-payroll firms matched to occupation codes; not fully representative of all US employment. Published June 10, just outside the strict 7-day window; included because it is a major new data infrastructure launch.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** ~0 % net aggregate (modest positive/negative divergence by quintile)
   **Quote:** "We group workers by their AI exposure score, comparing employment trends across these groups. We see modest differences between the five exposure groups, although employment growth is lowest for the most exposed occupations." (Stanford DEL Canaries Dashboard description)
   **Mapping note:** At the aggregate level, no dramatic displacement. The *directional signal* is upward (toward more displacement) but the *current measured level* is near zero. Applied as OVERLAY (neutral) for the aggregate graph.

2. **Graph:** Overall US Displacement — entry-level sub-signal (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** Declining (for two most exposed quintiles, early-career 22–25)
   **Quote:** "For early-career workers (22-25), the two most exposed groups of occupations see noticeable declines since the introduction of ChatGPT, while the other three occupation groups see growth. These patterns become less stark, and ultimately disappear, as we consider older workers." (Stanford DEL Canaries Dashboard)
   **Mapping note:** This is ADP payroll-based evidence of real employment decline among the most AI-exposed early-career workers. This is the strongest empirical signal of emerging displacement in the data — but it is narrow, age-specific, and not yet aggregate. OVERLAY (up) for displacement graphs.

3. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no decisive evidence of takeoff)
   **Quote:** "The Takeoff Tracker monitors macroeconomic indicators associated with advances in AI capabilities and broader economic change. Stanford Digital Economy Lab said its current set of 12 indicators shows no decisive evidence of takeoff at present." (EdTech Innovation Hub coverage of Stanford DEL launch, June 10, 2026)
   **Mapping note:** The absence of macro takeoff signals means the earnings-call AI-mention surge is not yet translating into measurable economy-wide productivity effects. OVERLAY neutral.

---

## Sources Checked but Not Relevant or Outside Window

The following URLs were fetched and reviewed but did not yield new quantitative AI labor statistics published within the June 22–29, 2026 window, or did not contain sufficient quantitative claims to extract:

- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Published January 21, 2026. Outside window. Strong analysis (Brookings/NBER adaptive capacity index); statistics likely already ingested.
- **https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html** — Published April 15, 2026 (Census CES Working Paper on AI Diffusion Microstructure). Outside window. Major Tier 1 source; likely not yet ingested (see Priority Recommendations below).
- **https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market** — Published May 7, 2026. Outside window. Budget Lab synthetic DID analysis finding no statistically significant AI employment effects as of Q1 2026.
- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Published April 3, 2026. Outside window. Federal Reserve synthesis of BTOS + RPS data.
- **https://www.census.gov/newsroom/press-releases/2026/btos-june-18.html** — Released June 18, 2026. Tip sheet only; no new quantitative AI-specific statistics released beyond previously reported BTOS figures.
- **https://www.census.gov/newsroom/press-releases/2026/btos-june-4.html** — Released June 4, 2026. Same: tip sheet only, refers to AI supplement data from Nov 2025–Feb 2026, previously reported.
- **https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026** — Published June 2, 2026. Outside window. Important Tier 2 report; see Priority Recommendations.
- **https://www.bcg.com/publications/2026/ai-will-reshape-more-jobs-than-it-replaces** — Published April 3, 2026. Outside window.
- **https://www.nber.org/papers/w33867** — Published May 2025 (NBER w33867, Wang & Wong "AI and Technological Unemployment"). Outside window and outside 2026.
- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF SDN/2026/001 "New Jobs Creation in the AI Age." Published January 2026. Outside window.
- **https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html** — Full Barometer page; stats extracted from press release above.
- **https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure** — ILO refined occupational exposure index, 2025. Outside window.
- **https://www.techtimes.com/articles/319232/20260628/anthropic-survey-9700-workers-half-say-ai-already-handles-most-job-tasks.htm** — Secondary coverage of Anthropic Economic Index (June 28, 2026). Used to cross-reference Anthropic primary source.
- **Various aggregator/blog sources** (designrush.com, almcorp.com, click-vision.com, sqmagazine.co.uk, datarefs.com, index.dev, medhacloud.com, etc.) — Tier 4; statistics either not new, not verifiable to original sources within the window, or paraphrased aggregations of older research.

---

## Priority Recommendations

### Ingest Immediately

1. **Census Bureau CES Working Paper CES-WP-26-25** (April 15, 2026) — Tier 1. Nationally representative BTOS data (Nov 2025–Jan 2026) on AI diffusion across firms, business functions, and worker tasks. Key DATA_POINT candidates:
   - "During the supplement reference period (Nov 2025-Jan 2026), **18% of firms used AI in a business function**, rising to **32% on an employment-weighted basis**" → `ai-adoption-rate` DATA_POINT (18%) and `genai-work-adoption` OVERLAY
   - "**AI-related employment decreases are rare, occurring in only 2% of firms**" → `overall-us-displacement` OVERLAY (down — actual firm-level measurement)
   - "**Most users (66%) rely on AI solely to augment tasks**" → `workforce-ai-exposure` OVERLAY (neutral — augmentation dominant)
   - "**43% of workers used Generative AI for work**" (Real-Time Population Survey, January–February 2026, cited in working paper) → `genai-work-adoption` strong DATA_POINT candidate
   - URL: https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf

2. **Census BTOS Story: "Large Firms With at Least 20 Employees Biggest AI Users"** (May 2026) — Tier 1. Contains:
   - "The BTOS data (December 2025 to May 2026) show that **overall AI usage hovered between 17% and 20%**" → `ai-adoption-rate` DATA_POINT
   - "**37% of firms with at least 250 employees** reported using AI in their business operations" → `ai-adoption-rate` large-firm breakdown
   - "**Information (39.7%) and Finance and Insurance (33.9%)** sectors both higher than national rate (19.8%)" → sector overlays
   - URL: https://www.census.gov/library/stories/2026/05/ai-use-businesses.html

3. **S&P Global PMI Special Report: "The AI and Labor Landscape 2026"** (June 2, 2026) — Tier 2. Contains the first PMI-based evidence of net negative employment impact. Key stats:
   - "the latest findings show a **negative global net impact for the past year (-5 points)**" → `overall-us-displacement` OVERLAY (up — global signal, direction is toward displacement)
   - "the proportion reporting AI-related job reductions was **8 points higher** than the share reporting gains" among large enterprises → `total-us-jobs-lost` OVERLAY (up)
   - "**22% of AI projects target a fully autonomous end state**" → `customer-service-automation` OVERLAY (neutral — autonomy remains limited)
   - URL: https://www.spglobal.com/en/research-insights/special-reports/ai-impact-on-employment-2026

### Statistics That Diverge Significantly from Current Consensus

- **PwC 2026 AI skills wage premium at 62%** is a significant jump from 2025's 57% and represents a continuing acceleration. If the site's `high-skill-wage-premium` graph shows a slower trajectory, this data point should prompt a reassessment.
- **Anthropic survey finding that 10% of active Claude users perceive their own job loss as "likely or very likely"** — if the graph consensus for `overall-us-displacement` is tracking near the Goldman Sachs 6–7% baseline, this perceptions signal (among high-AI-exposure workers) is running notably above consensus and should be tracked as a leading indicator.
- **Stanford DEL Canaries Dashboard** shows employment declining for the two most-exposed quintiles of early-career workers (22–25) — if the `total-us-jobs-lost` or `overall-us-displacement` graphs do not yet reflect entry-level contraction, this payroll-based evidence (ADP, 4.6M workers, 25K firms) is the strongest real-data support for adding an early-signal OVERLAY.

### New Government Data Releases

- **Census BTOS biweekly release — June 18, 2026**: No new aggregate statistics; the release confirms continuation of the established BTOS data stream. Next release expected ~July 2, 2026 and may contain updated AI adoption figures for late June.
- **Census BTOS biweekly release — June 4, 2026**: Same — tip sheet only.
- **BLS JOLTS and CPS data** are being used by the Budget Lab and Anthropic for ongoing labor market tracking; no standalone AI-focused release was identified in the window.

---

*Digest prepared: 2026-06-29. Window covered: 2026-06-22 through 2026-06-29.*