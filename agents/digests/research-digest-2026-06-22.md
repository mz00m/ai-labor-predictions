1	# AI Labor Research Digest — 2026-06-22
2	
3	## Summary
4	
5	This week's search found two quantitative sources published within the 7-day window (June 15–22, 2026): PwC's 2026 Global AI Jobs Barometer (released June 15, Tier 2) and a TechTimes investigative report on 2026 tech layoffs (published June 16, Tier 3). No Tier 1 peer-reviewed government statistics or NBER/academic working papers were released in this specific window, though several important studies published in the prior 4–8 weeks are flagged below for awareness. The dominant findings this week: PwC's billion-job-ad analysis documents a widening wage premium for AI skills (now 62%) and a "two-track" labor market splitting professionalised vs. democratised roles, while TechTimes synthesizes industry tracker data showing tech/finance/healthcare layoffs running at 1,115 per working day YTD, though only 17–26% of those are attributed to AI by the primary tracking firm (Challenger, Gray & Christmas).
6	
7	---
8	
9	## New Sources
10	
11	### PwC 2026 Global AI Jobs Barometer
12	
13	- **Publisher:** PwC (PricewaterhouseCoopers Global Network)
14	- **Date:** 2026-06-15
15	- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html (press release also at PR Newswire: https://www.prnewswire.com/news-releases/ai-reshapes-global-labour-market-into-two-distinct-paths-rewarding-human-skills-pwc-2026-global-ai-jobs-barometer-302798989.html)
16	- **Evidence Tier:** 2 (Major professional services firm, large-scale primary data analysis)
17	- **Source ID:** pwc-ai-jobs-barometer-2026
18	
19	**Methodology note:** Analysis of "more than one billion job ads across six continents" in 27 countries/territories, combined with company financial data and occupational task data. US entry-level analysis based on 2.4 million entry-level job postings. Figures are global unless the source text specifies US.
20	
21	**Statistics:**
22	
23	1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
24	   **Type:** OVERLAY (up)
25	   **Value:** 62 %
26	   **Note:** Global figure (not US-only) → overlay rule applies. Directionally bullish on premium: up from 57% last year.
27	   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%"
28	
29	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
30	   **Type:** OVERLAY (up)
31	   **Value:** 42 % faster salary growth (professionalised vs. democratised roles)
32	   **Note:** Global figure; unit is relative growth rate difference, not absolute premium level. Corroborates stat #1 directionally.
33	   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
34	
35	3. **Graph:** Median Wage Impact (`median-wage-impact`)
36	   **Type:** OVERLAY (up)
37	   **Value:** 24 % (AI-exposed company wage growth 2018–2025); 17 % (least-exposed)
38	   **Note:** Global; these are absolute cumulative wage growth levels (2018 baseline), not % change in real median US wages by 2030. Directionally signals AI exposure correlates with higher wage growth.
39	   **Quote:** "Companies most able to use AI are seeing faster headcount growth than the least AI-exposed companies (52% vs 36%) and higher wage growth (24% vs 17%)"
40	
41	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
42	   **Type:** OVERLAY (down)
43	   **Value:** -10 % (decline in non-AI-exposed entry-level job openings since 2019)
44	   **Note:** US entry-level data (2.4M job ads), but unit is job openings, not wages. Directionally negative for non-AI entry-level workers. AI-exposed entry-level roles grew 35% in contrast; net effect is bifurcation, not uniform decline.
45	   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles declined by 10%"
46	
47	5. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
48	   **Type:** OVERLAY (up)
49	   **Value:** 69 % (year-over-year growth in job postings requiring specific AI skills)
50	   **Note:** Global figure; unit is growth rate of AI-skill job postings, not % of adults using GenAI. Directionally indicates rapid diffusion of AI-skill demand into the workforce.
51	   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%)"
52	
53	6. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
54	   **Type:** OVERLAY (down)
55	   **Value:** 52 % (headcount growth, most AI-exposed companies, 2018–2025 cumulative)
56	   **Note:** Global figure. Headcount growth at AI-exposed companies outpacing least-exposed (52% vs 36%) is an anti-displacement signal. Applies as a downward overlay on net job-loss projections.
57	   **Quote:** "Headcount growth at the most AI-exposed companies is outpacing growth at the least AI-exposed companies – 52% relative to 36% in 2025, based on 2018 baseline levels."
58	
59	---
60	
61	### Tech Layoffs Hit 1,115 a Day in 2026: Companies Cite AI but Cuts Fail to Boost Returns
62	
63	- **Publisher:** TechTimes
64	- **Date:** 2026-06-16
65	- **URL:** https://www.techtimes.com/articles/318466/20260616/tech-layoffs-hit-1115-day-2026-companies-cite-ai-cuts-fail-boost-returns.htm
66	- **Evidence Tier:** 3 (Major trade/tech news publication; synthesizes and cites primary data from Challenger, Gray & Christmas; Stanford Digital Economy Lab; Gartner; NBER; METR)
67	- **Source ID:** techtimes-tech-layoffs-june2026
68	
69	**Methodology note:** This is a synthesizing journalism article, not a primary study. Statistics are drawn from named third-party sources (Challenger, Gray & Christmas layoff tracker; Stanford Digital Economy Lab/ADP payroll data; Gartner executive survey; NBER working paper; METR RCT). Each statistic below is attributed to its original source where possible. Quality of individual statistics should be assessed against those underlying sources.
70	
71	**Statistics:**
72	
73	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
74	   **Type:** OVERLAY (up)
75	   **Value:** 183,966 workers (247 events, YTD through June 14, 2026)
76	   **Note:** Absolute count (workers), not percentage of tech workforce displaced. Unit mismatch → overlay. Covers tech, finance, and healthcare sectors combined, not tech only. The daily pace of 1,115/day is nearly double 2025's 564/day. Source: SkillSyncer layoff tracker as cited by TechTimes.
77	   **Quote:** "As of June 14, 2026, 247 layoff events have displaced 183,966 workers across the tech, finance, and healthcare sectors — an average of 1,115 jobs lost every working day, nearly double the 564-per-day pace recorded in 2025."
78	
79	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
80	   **Type:** OVERLAY (up)
81	   **Value:** 21.5 % (midpoint of 17–26%; share of total US layoffs attributed to AI, YTD 2026)
82	   **Note:** Attributed to Challenger, Gray & Christmas. This is share of layoffs citing AI as reason — not % of US jobs displaced by 2030. Unit mismatch → overlay. "About 17% to 26% of total layoffs depending on the month."
83	   **Quote:** "The Challenger, Gray & Christmas outplacement firm, which tracks layoff announcements by stated reason, found AI cited in roughly 50,000 U.S. job cuts year-to-date — a figure representing about 17% to 26% of total layoffs depending on the month."
84	
85	3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
86	   **Type:** OVERLAY (up)
87	   **Value:** -20 % (employment decline for software developers aged 22–25 from 2022 peak)
88	   **Note:** Source: Stanford Digital Economy Lab, using ADP payroll records. US data, software developers only (subset of tech). Employment for developers 26+ grew 6–12% over the same period. Unit mismatch with graph (% displaced vs. % employment change) → overlay.
89	   **Quote:** "Stanford's Digital Economy Lab, using ADP payroll records covering millions of workers, found that employment for software developers aged 22 to 25 fell nearly 20% from its peak in late 2022 — even as employment for developers over 26 grew between 6% and 12% over the same period."
90	
91	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
92	   **Type:** OVERLAY (down)
93	   **Value:** -25 % (entry-level hiring decline at 15 largest tech firms, 2023–2024)
94	   **Note:** Source: Stanford HAI 2026 AI Index as cited by TechTimes (reproduced from earlier sources). US tech firms only; unit is hiring volume, not wages → overlay.
95	   **Quote:** "Entry-level hiring at the 15 largest tech firms dropped 25% between 2023 and 2024."
96	
97	5. **Graph:** Overall US Displacement (`overall-us-displacement`)
98	   **Type:** OVERLAY (down)
99	   **Value:** 90 % (share of executives reporting zero AI employment impact at own companies)
100	   **Note:** Source: NBER working paper (unnamed) cited by TechTimes. This is a downward/contra-displacement overlay: 90% of executives self-report no impact, even as peers announce AI-attributed layoffs publicly. Caution: this is self-reported and may be subject to social desirability bias in either direction.
101	   **Quote:** "A National Bureau of Economic Research working paper found that 90% of executives say AI has had zero employment impact at their own companies, even as their peers make AI the headline of their layoff announcements."
102	
103	6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
104	   **Type:** OVERLAY (up)
105	   **Value:** 80 % (share of AI-deploying firms that have already reduced headcount)
106	   **Note:** Source: Gartner, May 2026 survey of 350 global executives at $1B+ revenue companies already deploying AI agents/automation/digital twins. Important caveat: this is a self-selected sample of confirmed AI deployers, not representative of all firms. Global scope.
107	   **Quote:** "In May 2026, Gartner published findings from a survey of 350 global business executives at companies with at least $1 billion in annual revenue — all of them already piloting or deploying AI agents, automation, or digital twins. The result was unambiguous: 80% had reduced headcount."
108	
109	---
110	
111	## Sources Checked but Not Relevant to This Digest Period
112	
113	The following sources were identified and checked but fall **outside the June 15–22, 2026 window** or did not contain new, extractable quantitative AI labor statistics:
114	
115	- **Budget Lab at Yale** — "What We Do and Don't Know About How AI is Affecting the Labor Market" (May 7, 2026): Uses synthetic diff-in-diff design; finds no statistically significant AI effect on employment or wages through Q1 2026. High relevance but outside window. URL: https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market
116	
117	- **NY Fed Liberty Street Economics** — "Do Job Postings Show Early Labor-Market Effects of AI?" (May 14, 2026): Event study of Lightcast job postings; divergence in AI-exposed vs. unexposed postings predates ChatGPT release, argues against AI-specific demand decline. Outside window. URL: https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/
118	
119	- **Census Bureau story** — "Large Firms With at Least 20 Employees Biggest AI Users" (May 2026): BTOS data Dec 2025–May 2026; overall AI usage 17–20%. Outside window. URL: https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
120	
121	- **Census Bureau working paper CES-WP-26-25** — "The Microstructure of AI Diffusion" (June 4, 2026): 18% of firms used AI in a business function Nov 2025–Jan 2026 (32% employment-weighted); AI-related employment decreases rare (2% of firms). Outside window. URL: https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
122	
123	- **Brookings Institution** — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (January 21, 2026): 6.1 million workers face high AI exposure AND low adaptive capacity; 26.5 million highly exposed workers have above-median adaptive capacity; 86% of vulnerable workers are women. Outside window but highly relevant. URL: https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/
124	
125	- **IMF Staff Discussion Note SDN/2026/001** — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (January 2026): AI-related skill vacancies carry 3–3.4% higher wage offers; regions with higher AI skill demand show employment 3.6% lower in high-exposure, low-complementarity occupations after 5 years. Outside window. URL: https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf
126	
127	- **NBER Working Paper 34859** — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (February 2026): Theoretical/empirical framework; no direct quantitative labor market outcome statistics. Outside window. URL: https://www.nber.org/papers/w34859
128	
129	- **Anthropic** — "Labor Market Impacts of AI: A New Measure and Early Evidence" (March 2026): 14% decline in job-finding rate for workers aged 22–25 in AI-exposed occupations (barely statistically significant); no aggregate unemployment impact. Outside window. URL: https://www.anthropic.com/research/labor-market-impacts
130	
131	- **Federal Reserve Board** — "Monitoring AI Adoption in the US Economy" (April 3, 2026): GenAI work adoption at 41% of US workforce (RPS), firm AI adoption at 18% (BTOS end-2025). Outside window. URL: https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
132	
133	- **New York Fed (June 22 post)**: Search results indicated a follow-up NY Fed Liberty Street Economics post was expected on June 22, 2026. If published, this may contain quantifiable statistics for the next digest cycle. URL: https://libertystreeteconomics.newyorkfed.org (check for June 22 posts)
134	
135	---
136	
137	## Priority Recommendations
138	
139	### Tier 1–2 Sources to Ingest Immediately
140	
141	1. **PwC 2026 Global AI Jobs Barometer (June 15, 2026)** — Tier 2. The 62% AI skills wage premium and the two-track labor market findings are directly actionable for `high-skill-wage-premium` and `entry-level-wage-impact` graphs. Flag: global scope, so treat as overlay rather than data_point.
142	
143	2. **IMPORTANT: Verify the NY Fed June 22 post** — The May 14 Liberty Street Economics post explicitly stated "Look for our next post on June 22." A Federal Reserve Bank of New York post published today would be a Tier 1 government-affiliated source potentially within the window. Recommend fetching: https://libertystreeteconomics.newyorkfed.org/
144	
145	### Statistics that Diverge Significantly from Graph Consensus
146	
147	- **PwC: 62% wage premium for AI skills** — The `high-skill-wage-premium` graph presumably tracks a US-based consensus. The PwC global figure of 62% (up from 57% last year) is considerably higher than prior IMF/NBER estimates and warrants a directional overlay (up) regardless of whether existing graph consensus is lower.
148	
149	- **TechTimes/Gartner: 80% of AI-deploying firms cut headcount** — If the existing `white-collar-professional-displacement` graph consensus is well below 80%, this is a significant divergence. However, critical caveat: sample is pre-selected for AI deployers, not the universe of US firms. The 90% "zero employment impact" from the NBER paper (same TechTimes article) directly contradicts this. Flag as conflicting signals for editorial note.
150	
151	- **PwC: Non-AI entry-level roles shrank 10% since 2019** — The `entry-level-wage-impact` graph likely lacks current empirical data on this specific bifurcation. The 35% growth in AI-exposed entry-level roles vs. -10% for others is a novel and actionable finding for this graph.
152	
153	### New Government Data Releases
154	
155	- **Census BTOS AI Supplement (June 4, 2026)**: The most recent government AI adoption data (BTOS biweekly release) shows national AI adoption at 19.8% of US firms as of May 2026. This is the authoritative figure for the `ai-adoption-rate` graph and was released June 4, just outside our window. It should be treated as the current baseline data_point for that graph: **19.8% of US firms using AI in business functions as of May 3, 2026** (Census BTOS). Recommend ingesting this as a data_point for `ai-adoption-rate` from the prior week's release cycle.
156	
157	### Methodological Note
158	
159	The Budget Lab at Yale's May 7 paper using synthetic differences-in-differences finds **no statistically significant AI labor market footprint** through Q1 2026 in employment or wages — a finding consistent with Anthropic's March 2026 paper and the NY Fed's May 2026 job postings analysis. This consensus of null aggregate results contrasts with the narrative in the TechTimes article and the PwC "two-track" framing. Both are valid: aggregate effects can be zero while within-group dispersion (young workers, AI-exposed vs. unexposed) widens. Prediction graphs tracking *aggregate* displacement should weight null-result findings heavily. Graphs tracking the *high-skill premium* or *entry-level impact* have more empirical support for directionality.
# AI Labor Research Digest — 2026-06-22

## Summary

This week's search found two quantitative sources published within the 7-day window (June 15–22, 2026): PwC's 2026 Global AI Jobs Barometer (released June 15, Tier 2) and a TechTimes investigative report on 2026 tech layoffs (published June 16, Tier 3). No Tier 1 peer-reviewed government statistics or NBER/academic working papers were released in this specific window, though several important studies published in the prior 4–8 weeks are flagged below for awareness. The dominant findings this week: PwC's billion-job-ad analysis documents a widening wage premium for AI skills (now 62%) and a "two-track" labor market splitting professionalised vs. democratised roles, while TechTimes synthesizes industry tracker data showing tech/finance/healthcare layoffs running at 1,115 per working day YTD, though only 17–26% of those are attributed to AI by the primary tracking firm (Challenger, Gray & Christmas).

---

## New Sources

### PwC 2026 Global AI Jobs Barometer

- **Publisher:** PwC (PricewaterhouseCoopers Global Network)
- **Date:** 2026-06-15
- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html (press release also at PR Newswire: https://www.prnewswire.com/news-releases/ai-reshapes-global-labour-market-into-two-distinct-paths-rewarding-human-skills-pwc-2026-global-ai-jobs-barometer-302798989.html)
- **Evidence Tier:** 2 (Major professional services firm, large-scale primary data analysis)
- **Source ID:** pwc-ai-jobs-barometer-2026

**Methodology note:** Analysis of "more than one billion job ads across six continents" in 27 countries/territories, combined with company financial data and occupational task data. US entry-level analysis based on 2.4 million entry-level job postings. Figures are global unless the source text specifies US.

**Statistics:**

1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 62 %
   **Note:** Global figure (not US-only) → overlay rule applies. Directionally bullish on premium: up from 57% last year.
   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%"

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 42 % faster salary growth (professionalised vs. democratised roles)
   **Note:** Global figure; unit is relative growth rate difference, not absolute premium level. Corroborates stat #1 directionally.
   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."

3. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 24 % (AI-exposed company wage growth 2018–2025); 17 % (least-exposed)
   **Note:** Global; these are absolute cumulative wage growth levels (2018 baseline), not % change in real median US wages by 2030. Directionally signals AI exposure correlates with higher wage growth.
   **Quote:** "Companies most able to use AI are seeing faster headcount growth than the least AI-exposed companies (52% vs 36%) and higher wage growth (24% vs 17%)"

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -10 % (decline in non-AI-exposed entry-level job openings since 2019)
   **Note:** US entry-level data (2.4M job ads), but unit is job openings, not wages. Directionally negative for non-AI entry-level workers. AI-exposed entry-level roles grew 35% in contrast; net effect is bifurcation, not uniform decline.
   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles declined by 10%"

5. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 69 % (year-over-year growth in job postings requiring specific AI skills)
   **Note:** Global figure; unit is growth rate of AI-skill job postings, not % of adults using GenAI. Directionally indicates rapid diffusion of AI-skill demand into the workforce.
   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%)"

6. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
   **Type:** OVERLAY (down)
   **Value:** 52 % (headcount growth, most AI-exposed companies, 2018–2025 cumulative)
   **Note:** Global figure. Headcount growth at AI-exposed companies outpacing least-exposed (52% vs 36%) is an anti-displacement signal. Applies as a downward overlay on net job-loss projections.
   **Quote:** "Headcount growth at the most AI-exposed companies is outpacing growth at the least AI-exposed companies – 52% relative to 36% in 2025, based on 2018 baseline levels."

---

### Tech Layoffs Hit 1,115 a Day in 2026: Companies Cite AI but Cuts Fail to Boost Returns

- **Publisher:** TechTimes
- **Date:** 2026-06-16
- **URL:** https://www.techtimes.com/articles/318466/20260616/tech-layoffs-hit-1115-day-2026-companies-cite-ai-cuts-fail-boost-returns.htm
- **Evidence Tier:** 3 (Major trade/tech news publication; synthesizes and cites primary data from Challenger, Gray & Christmas; Stanford Digital Economy Lab; Gartner; NBER; METR)
- **Source ID:** techtimes-tech-layoffs-june2026

**Methodology note:** This is a synthesizing journalism article, not a primary study. Statistics are drawn from named third-party sources (Challenger, Gray & Christmas layoff tracker; Stanford Digital Economy Lab/ADP payroll data; Gartner executive survey; NBER working paper; METR RCT). Each statistic below is attributed to its original source where possible. Quality of individual statistics should be assessed against those underlying sources.

**Statistics:**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 183,966 workers (247 events, YTD through June 14, 2026)
   **Note:** Absolute count (workers), not percentage of tech workforce displaced. Unit mismatch → overlay. Covers tech, finance, and healthcare sectors combined, not tech only. The daily pace of 1,115/day is nearly double 2025's 564/day. Source: SkillSyncer layoff tracker as cited by TechTimes.
   **Quote:** "As of June 14, 2026, 247 layoff events have displaced 183,966 workers across the tech, finance, and healthcare sectors — an average of 1,115 jobs lost every working day, nearly double the 564-per-day pace recorded in 2025."

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 21.5 % (midpoint of 17–26%; share of total US layoffs attributed to AI, YTD 2026)
   **Note:** Attributed to Challenger, Gray & Christmas. This is share of layoffs citing AI as reason — not % of US jobs displaced by 2030. Unit mismatch → overlay. "About 17% to 26% of total layoffs depending on the month."
   **Quote:** "The Challenger, Gray & Christmas outplacement firm, which tracks layoff announcements by stated reason, found AI cited in roughly 50,000 U.S. job cuts year-to-date — a figure representing about 17% to 26% of total layoffs depending on the month."

3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** -20 % (employment decline for software developers aged 22–25 from 2022 peak)
   **Note:** Source: Stanford Digital Economy Lab, using ADP payroll records. US data, software developers only (subset of tech). Employment for developers 26+ grew 6–12% over the same period. Unit mismatch with graph (% displaced vs. % employment change) → overlay.
   **Quote:** "Stanford's Digital Economy Lab, using ADP payroll records covering millions of workers, found that employment for software developers aged 22 to 25 fell nearly 20% from its peak in late 2022 — even as employment for developers over 26 grew between 6% and 12% over the same period."

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -25 % (entry-level hiring decline at 15 largest tech firms, 2023–2024)
   **Note:** Source: Stanford HAI 2026 AI Index as cited by TechTimes (reproduced from earlier sources). US tech firms only; unit is hiring volume, not wages → overlay.
   **Quote:** "Entry-level hiring at the 15 largest tech firms dropped 25% between 2023 and 2024."

5. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 90 % (share of executives reporting zero AI employment impact at own companies)
   **Note:** Source: NBER working paper (unnamed) cited by TechTimes. This is a downward/contra-displacement overlay: 90% of executives self-report no impact, even as peers announce AI-attributed layoffs publicly. Caution: this is self-reported and may be subject to social desirability bias in either direction.
   **Quote:** "A National Bureau of Economic Research working paper found that 90% of executives say AI has had zero employment impact at their own companies, even as their peers make AI the headline of their layoff announcements."

6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 80 % (share of AI-deploying firms that have already reduced headcount)
   **Note:** Source: Gartner, May 2026 survey of 350 global executives at $1B+ revenue companies already deploying AI agents/automation/digital twins. Important caveat: this is a self-selected sample of confirmed AI deployers, not representative of all firms. Global scope.
   **Quote:** "In May 2026, Gartner published findings from a survey of 350 global business executives at companies with at least $1 billion in annual revenue — all of them already piloting or deploying AI agents, automation, or digital twins. The result was unambiguous: 80% had reduced headcount."

---

## Sources Checked but Not Relevant to This Digest Period

The following sources were identified and checked but fall **outside the June 15–22, 2026 window** or did not contain new, extractable quantitative AI labor statistics:

- **Budget Lab at Yale** — "What We Do and Don't Know About How AI is Affecting the Labor Market" (May 7, 2026): Uses synthetic diff-in-diff design; finds no statistically significant AI effect on employment or wages through Q1 2026. High relevance but outside window. URL: https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market

- **NY Fed Liberty Street Economics** — "Do Job Postings Show Early Labor-Market Effects of AI?" (May 14, 2026): Event study of Lightcast job postings; divergence in AI-exposed vs. unexposed postings predates ChatGPT release, argues against AI-specific demand decline. Outside window. URL: https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/

- **Census Bureau story** — "Large Firms With at Least 20 Employees Biggest AI Users" (May 2026): BTOS data Dec 2025–May 2026; overall AI usage 17–20%. Outside window. URL: https://www.census.gov/library/stories/2026/05/ai-use-businesses.html

- **Census Bureau working paper CES-WP-26-25** — "The Microstructure of AI Diffusion" (June 4, 2026): 18% of firms used AI in a business function Nov 2025–Jan 2026 (32% employment-weighted); AI-related employment decreases rare (2% of firms). Outside window. URL: https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html

- **Brookings Institution** — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (January 21, 2026): 6.1 million workers face high AI exposure AND low adaptive capacity; 26.5 million highly exposed workers have above-median adaptive capacity; 86% of vulnerable workers are women. Outside window but highly relevant. URL: https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/

- **IMF Staff Discussion Note SDN/2026/001** — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (January 2026): AI-related skill vacancies carry 3–3.4% higher wage offers; regions with higher AI skill demand show employment 3.6% lower in high-exposure, low-complementarity occupations after 5 years. Outside window. URL: https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf

- **NBER Working Paper 34859** — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (February 2026): Theoretical/empirical framework; no direct quantitative labor market outcome statistics. Outside window. URL: https://www.nber.org/papers/w34859

- **Anthropic** — "Labor Market Impacts of AI: A New Measure and Early Evidence" (March 2026): 14% decline in job-finding rate for workers aged 22–25 in AI-exposed occupations (barely statistically significant); no aggregate unemployment impact. Outside window. URL: https://www.anthropic.com/research/labor-market-impacts

- **Federal Reserve Board** — "Monitoring AI Adoption in the US Economy" (April 3, 2026): GenAI work adoption at 41% of US workforce (RPS), firm AI adoption at 18% (BTOS end-2025). Outside window. URL: https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html

- **New York Fed (June 22 post)**: Search results indicated a follow-up NY Fed Liberty Street Economics post was expected on June 22, 2026. If published, this may contain quantifiable statistics for the next digest cycle. URL: https://libertystreeteconomics.newyorkfed.org (check for June 22 posts)

---

## Priority Recommendations

### Tier 1–2 Sources to Ingest Immediately

1. **PwC 2026 Global AI Jobs Barometer (June 15, 2026)** — Tier 2. The 62% AI skills wage premium and the two-track labor market findings are directly actionable for `high-skill-wage-premium` and `entry-level-wage-impact` graphs. Flag: global scope, so treat as overlay rather than data_point.

2. **IMPORTANT: Verify the NY Fed June 22 post** — The May 14 Liberty Street Economics post explicitly stated "Look for our next post on June 22." A Federal Reserve Bank of New York post published today would be a Tier 1 government-affiliated source potentially within the window. Recommend fetching: https://libertystreeteconomics.newyorkfed.org/

### Statistics that Diverge Significantly from Graph Consensus

- **PwC: 62% wage premium for AI skills** — The `high-skill-wage-premium` graph presumably tracks a US-based consensus. The PwC global figure of 62% (up from 57% last year) is considerably higher than prior IMF/NBER estimates and warrants a directional overlay (up) regardless of whether existing graph consensus is lower.

- **TechTimes/Gartner: 80% of AI-deploying firms cut headcount** — If the existing `white-collar-professional-displacement` graph consensus is well below 80%, this is a significant divergence. However, critical caveat: sample is pre-selected for AI deployers, not the universe of US firms. The 90% "zero employment impact" from the NBER paper (same TechTimes article) directly contradicts this. Flag as conflicting signals for editorial note.

- **PwC: Non-AI entry-level roles shrank 10% since 2019** — The `entry-level-wage-impact` graph likely lacks current empirical data on this specific bifurcation. The 35% growth in AI-exposed entry-level roles vs. -10% for others is a novel and actionable finding for this graph.

### New Government Data Releases

- **Census BTOS AI Supplement (June 4, 2026)**: The most recent government AI adoption data (BTOS biweekly release) shows national AI adoption at 19.8% of US firms as of May 2026. This is the authoritative figure for the `ai-adoption-rate` graph and was released June 4, just outside our window. It should be treated as the current baseline data_point for that graph: **19.8% of US firms using AI in business functions as of May 3, 2026** (Census BTOS). Recommend ingesting this as a data_point for `ai-adoption-rate` from the prior week's release cycle.

### Methodological Note

The Budget Lab at Yale's May 7 paper using synthetic differences-in-differences finds **no statistically significant AI labor market footprint** through Q1 2026 in employment or wages — a finding consistent with Anthropic's March 2026 paper and the NY Fed's May 2026 job postings analysis. This consensus of null aggregate results contrasts with the narrative in the TechTimes article and the PwC "two-track" framing. Both are valid: aggregate effects can be zero while within-group dispersion (young workers, AI-exposed vs. unexposed) widens. Prediction graphs tracking *aggregate* displacement should weight null-result findings heavily. Graphs tracking the *high-skill premium* or *entry-level impact* have more empirical support for directionality.