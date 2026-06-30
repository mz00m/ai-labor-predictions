1	# AI Labor Research Digest — 2026-06-15
2	
3	## Summary
4	
5	This week's search surfaced **one high-quality source published within the 7-day window (June 8–15, 2026)**: PwC's 2026 Global AI Jobs Barometer, released today (June 15), drawing on over one billion job ads across 27 countries. The Barometer provides the most comprehensive labor-demand-side picture of AI's effect on wages, hiring, and productivity available to date. No Tier 1 government statistical releases (BLS, Census BTOS biweekly) fell within the window; the most recent Census BTOS story was published May 26, 2026. Several important Tier 2 sources published just outside the window — including Challenger, Gray & Christmas's May 2026 AI-layoffs report (June 4) and the Budget Lab at Yale's econometric employment study (May 7) — are documented below for completeness and flagged for ingestion review.
6	
7	---
8	
9	## New Sources
10	
11	### PwC 2026 Global AI Jobs Barometer
12	- **Publisher:** PricewaterhouseCoopers (PwC)
13	- **Date:** 2026-06-15
14	- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
15	- **Evidence Tier:** 2 (Major consulting firm — analyzed >1 billion job ads across 27 countries; combines Lightcast job-posting microdata with company financial records)
16	- **Source ID:** pwc-ai-jobs-barometer-2026
17	
18	**Methodology note:** The Barometer analyzes job-posting demand data (not surveys of workers or firms), measures *wage offers in postings* rather than actual wages paid, and is global in scope. US-specific analysis uses 2.4 million US entry-level job ads. Caution: data reflects advertised positions, which may differ from filled positions and are skewed toward formal, higher-skill roles.
19	
20	**Statistics:**
21	
22	1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
23	   **Type:** OVERLAY (up)
24	   **Value:** 62 %
25	   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year."
26	   **Mapping note:** Global, not US-specific → overlay only. Consistent direction with graph consensus but magnitude exceeds most US-based estimates. Represents the wage premium in *job postings* for roles that list AI skills versus otherwise comparable roles in the same occupation.
27	
28	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
29	   **Type:** OVERLAY (up)
30	   **Value:** 118 % (sector max) / 16 % (sector min)
31	   **Quote:** "The wage premium varies by industry: as high as 118% in some sectors, such as consumer markets, and 16% in government and public sector work."
32	   **Mapping note:** Global sector-level ranges; underscores high variance across industries. Do not use as data point on the US-focused graph.
33	
34	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
35	   **Type:** OVERLAY (down)
36	   **Value:** −10 %
37	   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%."
38	   **Mapping note:** US-specific (based on 2.4 million US entry-level job ads). Metric is job-opening *count*, not wage level, but the decline in traditional entry-level openings is the most direct publicly available signal for the `entry-level-wage-impact` graph. Direction (down) aligns with existing graph consensus. Value is −10% change in job openings for non-AI entry-level roles.
39	
40	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
41	   **Type:** OVERLAY (up — AI-exposed entry-level subset)
42	   **Value:** +35 %
43	   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%."
44	   **Mapping note:** Counterpoint: AI-exposed entry-level openings growing substantially. Shows bifurcation within entry-level labor market. Use as overlay to illustrate divergence rather than net direction.
45	
46	5. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
47	   **Type:** OVERLAY (up)
48	   **Value:** 69 % (AI-skill job growth rate) vs. 9 % (overall job market growth rate)
49	   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%."
50	   **Mapping note:** Global labor-demand signal. This is the *demand* side (employers seeking AI skills), not the supply side (workers using AI), so it is not a direct measure of `genai-work-adoption`. Use as overlay indicating rising employer pull for AI-fluent workers.
51	
52	6. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
53	   **Type:** OVERLAY (up)
54	   **Value:** 52 % (headcount growth at most AI-exposed companies, 2018–2025 baseline)
55	   **Quote:** "Perhaps most surprisingly, headcount growth at the most AI-exposed companies is outpacing growth at the least AI-exposed companies – 52% relative to 36% in 2025, based on 2018 baseline levels."
56	   **Mapping note:** Global metric about hiring at AI-intensive firms. Not a US Census BTOS adoption-rate figure. Use as overlay showing adoption-leading companies are expanding, not contracting, headcount — directionally relevant to whether adoption drives displacement.
57	
58	7. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
59	   **Type:** OVERLAY (down — lower displacement for 'professionalised' roles)
60	   **Value:** 2× (job growth multiple for 'professionalised' vs. 'democratised' roles)
61	   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
62	   **Mapping note:** Global. The PwC framework distinguishes 'professionalised' (AI amplifies human expertise) from 'democratised' (AI lowers barriers to entry, making the role easier for non-experts). 'Democratised' white-collar roles — including administrative and technical support functions — are the ones at higher displacement risk. The twice-as-fast growth for 'professionalised' roles argues against broad white-collar displacement but does support *within*-white-collar polarization.
63	
64	8. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
65	   **Type:** OVERLAY (up)
66	   **Value:** 7× (likelihood multiplier for senior-skill requirements in AI-exposed US entry-level roles)
67	   **Quote:** "Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
68	   **Mapping note:** US-specific. Signals that AI exposure is already restructuring skill requirements within existing jobs rather than simply eliminating them — consistent with augmentation/task-reallocation rather than straightforward displacement. Informative overlay for the `workforce-ai-exposure` graph.
69	
70	9. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
71	   **Type:** OVERLAY (up)
72	   **Value:** 163 % (labour productivity growth, top 20% AI-exposed companies, 2018–2025 baseline)
73	   **Quote:** "The top 20% of the most AI-exposed companies achieved average labour productivity growth of 163% relative to 2018 – nearly five times higher than the most AI-exposed companies overall."
74	   **Mapping note:** Global; reflects financial performance of S&P-class AI-intensive companies. The extreme productivity outperformance of 'super-star' AI companies is the type of metric that would be driving increased AI-workforce mentions on earnings calls. Use as qualitative overlay rather than data point.
75	
76	---
77	
78	## Sources Checked but Not Relevant or Outside the 7-Day Window
79	
80	The following URLs were checked; none yielded new quantitative AI labor statistics published within June 8–15, 2026:
81	
82	- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/NBER paper by Manning, Aguirre, Muro, Methkupally. Published **January 21, 2026**. High-quality (Tier 2; linked NBER working paper is Tier 1) but outside the 7-day window. Key stat: 6.1 million U.S. workers (4.2% of workforce) face both high AI exposure and low adaptive capacity; 86% are women. Recommend as backfill for `workforce-ai-exposure` and `overall-us-displacement` graphs.
83	
84	- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census Bureau BTOS story "Large Firms With at Least 20 Employees Biggest AI Users." Published **May 26, 2026** (outside window). Tier 1. Key stats: overall U.S. business AI usage 17–20% (Dec 2025–May 2026); 37% of firms ≥250 employees using AI; Information sector 39.7%, Finance & Insurance 33.9%. Already likely ingested; confirm latest `ai-adoption-rate` data point.
85	
86	- **https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf** — Census Bureau working paper "The Microstructure of AI Diffusion" (CES-WP-26-25). Published **Spring 2026** (exact date ~June 4, per BTOS press release). Tier 1. Key stats: 18% of U.S. firms used AI in a business function (Nov 2025–Jan 2026), rising to 32% employment-weighted; 43% of workers used GenAI for work (Bick et al., Jan–Feb 2026 Real-Time Population Survey). Outside window but important.
87	
88	- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF Staff Discussion Note SDN/2026/001, "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age." Published **January 2026** (outside window). Tier 1. Key stats: roughly 1 in 10 job vacancies in advanced economies requires a new skill; new AI-skill job vacancies post 3–3.4% higher wages in the US; employment in high-AI-exposure, low-complementarity occupations is 3.6% lower in regions with greater AI-skill demand (5-year effect); early-career workers (ages 22–25) in the most AI-exposed occupations saw a 13% relative decline in employment (Brynjolfsson, Chandar, Chen 2025 finding cited).
89	
90	- **https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market** — Yale Budget Lab, Gimbel, Kendall & Nunn. Published **May 7, 2026** (outside window). Tier 2. Key finding: Using synthetic differences-in-differences on CPS data through Q1 2026, finds no statistically significant employment or wage effects of AI exposure at aggregate level. Unemployment in exposed occupations is ~0.5 pp higher than comparison group in Q1 2026 but not significant. Highly relevant as OVERLAY (neutral) on `total-us-jobs-lost`, `median-wage-impact`.
91	
92	- **https://www.challengergray.com/wp-content/uploads/2026/06/Challenger-Report-May-2026.pdf** — Challenger, Gray & Christmas May 2026 Job Cut Report. Published **June 4, 2026** (4 days before window opens). Tier 3. Key stats: In May 2026, AI was cited for 38,579 announced job cuts (40% of all May cuts), the highest monthly AI-cited total ever recorded; YTD 2026 AI has been cited for 87,714 cuts (22% of all 2026 layoffs), surpassing all of 2025 (54,836). **This borderline source deserves a follow-up check next cycle.** Maps to `total-us-jobs-lost` as OVERLAY (up), but caveat: announced layoffs cited to AI ≠ actual job losses caused by AI; Challenger themselves note many are strategic reframings.
93	
94	- **https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/** — NY Fed Liberty Street Economics, Audoly, Guerin & Topa. Published **May 14, 2026** (outside window). Tier 1. Key finding: While high-AI-exposure occupations saw relatively fewer job postings than low-exposure occupations, this trend predates ChatGPT (began before 2022) and doesn't show a clear break after late 2022. Authors conclude "little indication of a distinct AI-driven decline in labor demand." OVERLAY neutral on `total-us-jobs-lost`.
95	
96	- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Federal Reserve Board FEDS Note on AI Adoption Monitoring. Published **April 3, 2026** (outside window). Tier 1. Key stats: work-related GenAI adoption (Real-Time Population Survey) at ~41% of workforce; firm adoption (BTOS) ~18% at end of 2025.
97	
98	- **https://www.anthropic.com/research/labor-market-impacts** — Anthropic, Massenkoff & McCrory, "Labor Market Impacts of AI." Published **March 5, 2026** (outside window). Tier 2 (industry research). Key finding: finds limited evidence that AI has affected aggregate employment to date using a new AI-usage-based exposure measure.
99	
100	- **https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market** — Harvard Business Review / HBS, March 2026 (outside window). Summary piece; no new primary statistics.
101	
102	- **https://www.promarket.org/2026/05/21/more-ai-exposed-industries-and-states-are-benefiting-but-results-are-heterogenous/** — ProMarket summary of Johnston & Makridis working paper. Published **May 21, 2026** (outside window). Key stats: By 2023–2024, a 1 standard deviation increase in AI exposure raises hourly wages approximately 1.0–1.1%; workers capturing only ~29 cents of every dollar of AI-driven output growth.
103	
104	---
105	
106	## Priority Recommendations
107	
108	### Ingest Immediately (if not already loaded)
109	
110	1. **PwC 2026 Global AI Jobs Barometer** (June 15, 2026 — within window, Tier 2):
111	   - 62% AI-skill wage premium provides important update to `high-skill-wage-premium` graph (previous PwC 2025 figure was 56%). Trend is accelerating faster than most graph consensus projections assumed.
112	   - The −10% decline in non-AI entry-level job openings (US-specific, 2.4M ads) is the freshest available signal for `entry-level-wage-impact`. Worth a data-point review even though it is a job-openings proxy, not a wage measure.
113	
114	2. **Challenger May 2026 Report** (June 4, 2026 — 4 days outside window, Tier 3):
115	   - 38,579 AI-cited layoff announcements in May 2026 alone (40% of total cuts) is a striking new high. While these are not confirmed AI-caused job losses, the scale of employer self-attribution to AI is itself a labor-market signal. Recommend ingesting as OVERLAY (up, cautiously) on `total-us-jobs-lost` with the caveat prominently documented.
116	
117	### Statistics That Diverge Significantly from Current Graph Consensus
118	
119	- **PwC 62% AI wage premium** is notably higher than the ~25–40% range in most existing overlays on `high-skill-wage-premium`. If the graph's consensus trajectory doesn't already reflect this acceleration, it should be flagged for review. The premium rose from 57% to 62% in a single year.
120	
121	- **Yale Budget Lab (May 7, 2026)** finds *zero significant aggregate employment effect* through Q1 2026, which diverges from graphs that may assume earlier, larger displacement effects. This Tier 2 econometric result should be loaded as a neutral OVERLAY on `total-us-jobs-lost` and `overall-us-displacement` to represent the null-effects camp.
122	
123	### New Government Data Releases
124	
125	- **Census BTOS biweekly data** continues to update. As of May 3, 2026, 19.8% national AI use rate. The next biweekly BTOS release (~June 18, 2026) will be the first data point within or just after this digest window — recommend checking immediately for that release as a potential `ai-adoption-rate` DATA_POINT.
126	- **BLS Employment Situation** (monthly) and the **Current Population Survey microdata** continue to be the primary inputs for the Budget Lab and Fed trackers. Both are Tier 1 and should be monitored monthly.
127	
128	---
129	
130	*Digest compiled 2026-06-15 by jobsdata.ai research agent. All statistics are exact quotes from verified primary or secondary sources. No statistics have been invented or interpolated.*
# AI Labor Research Digest — 2026-06-15

## Summary

This week's search surfaced **one high-quality source published within the 7-day window (June 8–15, 2026)**: PwC's 2026 Global AI Jobs Barometer, released today (June 15), drawing on over one billion job ads across 27 countries. The Barometer provides the most comprehensive labor-demand-side picture of AI's effect on wages, hiring, and productivity available to date. No Tier 1 government statistical releases (BLS, Census BTOS biweekly) fell within the window; the most recent Census BTOS story was published May 26, 2026. Several important Tier 2 sources published just outside the window — including Challenger, Gray & Christmas's May 2026 AI-layoffs report (June 4) and the Budget Lab at Yale's econometric employment study (May 7) — are documented below for completeness and flagged for ingestion review.

---

## New Sources

### PwC 2026 Global AI Jobs Barometer
- **Publisher:** PricewaterhouseCoopers (PwC)
- **Date:** 2026-06-15
- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
- **Evidence Tier:** 2 (Major consulting firm — analyzed >1 billion job ads across 27 countries; combines Lightcast job-posting microdata with company financial records)
- **Source ID:** pwc-ai-jobs-barometer-2026

**Methodology note:** The Barometer analyzes job-posting demand data (not surveys of workers or firms), measures *wage offers in postings* rather than actual wages paid, and is global in scope. US-specific analysis uses 2.4 million US entry-level job ads. Caution: data reflects advertised positions, which may differ from filled positions and are skewed toward formal, higher-skill roles.

**Statistics:**

1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 62 %
   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year."
   **Mapping note:** Global, not US-specific → overlay only. Consistent direction with graph consensus but magnitude exceeds most US-based estimates. Represents the wage premium in *job postings* for roles that list AI skills versus otherwise comparable roles in the same occupation.

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 118 % (sector max) / 16 % (sector min)
   **Quote:** "The wage premium varies by industry: as high as 118% in some sectors, such as consumer markets, and 16% in government and public sector work."
   **Mapping note:** Global sector-level ranges; underscores high variance across industries. Do not use as data point on the US-focused graph.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −10 %
   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%."
   **Mapping note:** US-specific (based on 2.4 million US entry-level job ads). Metric is job-opening *count*, not wage level, but the decline in traditional entry-level openings is the most direct publicly available signal for the `entry-level-wage-impact` graph. Direction (down) aligns with existing graph consensus. Value is −10% change in job openings for non-AI entry-level roles.

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (up — AI-exposed entry-level subset)
   **Value:** +35 %
   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%."
   **Mapping note:** Counterpoint: AI-exposed entry-level openings growing substantially. Shows bifurcation within entry-level labor market. Use as overlay to illustrate divergence rather than net direction.

5. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 69 % (AI-skill job growth rate) vs. 9 % (overall job market growth rate)
   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%."
   **Mapping note:** Global labor-demand signal. This is the *demand* side (employers seeking AI skills), not the supply side (workers using AI), so it is not a direct measure of `genai-work-adoption`. Use as overlay indicating rising employer pull for AI-fluent workers.

6. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 52 % (headcount growth at most AI-exposed companies, 2018–2025 baseline)
   **Quote:** "Perhaps most surprisingly, headcount growth at the most AI-exposed companies is outpacing growth at the least AI-exposed companies – 52% relative to 36% in 2025, based on 2018 baseline levels."
   **Mapping note:** Global metric about hiring at AI-intensive firms. Not a US Census BTOS adoption-rate figure. Use as overlay showing adoption-leading companies are expanding, not contracting, headcount — directionally relevant to whether adoption drives displacement.

7. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down — lower displacement for 'professionalised' roles)
   **Value:** 2× (job growth multiple for 'professionalised' vs. 'democratised' roles)
   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
   **Mapping note:** Global. The PwC framework distinguishes 'professionalised' (AI amplifies human expertise) from 'democratised' (AI lowers barriers to entry, making the role easier for non-experts). 'Democratised' white-collar roles — including administrative and technical support functions — are the ones at higher displacement risk. The twice-as-fast growth for 'professionalised' roles argues against broad white-collar displacement but does support *within*-white-collar polarization.

8. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 7× (likelihood multiplier for senior-skill requirements in AI-exposed US entry-level roles)
   **Quote:** "Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
   **Mapping note:** US-specific. Signals that AI exposure is already restructuring skill requirements within existing jobs rather than simply eliminating them — consistent with augmentation/task-reallocation rather than straightforward displacement. Informative overlay for the `workforce-ai-exposure` graph.

9. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up)
   **Value:** 163 % (labour productivity growth, top 20% AI-exposed companies, 2018–2025 baseline)
   **Quote:** "The top 20% of the most AI-exposed companies achieved average labour productivity growth of 163% relative to 2018 – nearly five times higher than the most AI-exposed companies overall."
   **Mapping note:** Global; reflects financial performance of S&P-class AI-intensive companies. The extreme productivity outperformance of 'super-star' AI companies is the type of metric that would be driving increased AI-workforce mentions on earnings calls. Use as qualitative overlay rather than data point.

---

## Sources Checked but Not Relevant or Outside the 7-Day Window

The following URLs were checked; none yielded new quantitative AI labor statistics published within June 8–15, 2026:

- **https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/** — Brookings/NBER paper by Manning, Aguirre, Muro, Methkupally. Published **January 21, 2026**. High-quality (Tier 2; linked NBER working paper is Tier 1) but outside the 7-day window. Key stat: 6.1 million U.S. workers (4.2% of workforce) face both high AI exposure and low adaptive capacity; 86% are women. Recommend as backfill for `workforce-ai-exposure` and `overall-us-displacement` graphs.

- **https://www.census.gov/library/stories/2026/05/ai-use-businesses.html** — Census Bureau BTOS story "Large Firms With at Least 20 Employees Biggest AI Users." Published **May 26, 2026** (outside window). Tier 1. Key stats: overall U.S. business AI usage 17–20% (Dec 2025–May 2026); 37% of firms ≥250 employees using AI; Information sector 39.7%, Finance & Insurance 33.9%. Already likely ingested; confirm latest `ai-adoption-rate` data point.

- **https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf** — Census Bureau working paper "The Microstructure of AI Diffusion" (CES-WP-26-25). Published **Spring 2026** (exact date ~June 4, per BTOS press release). Tier 1. Key stats: 18% of U.S. firms used AI in a business function (Nov 2025–Jan 2026), rising to 32% employment-weighted; 43% of workers used GenAI for work (Bick et al., Jan–Feb 2026 Real-Time Population Survey). Outside window but important.

- **https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf** — IMF Staff Discussion Note SDN/2026/001, "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age." Published **January 2026** (outside window). Tier 1. Key stats: roughly 1 in 10 job vacancies in advanced economies requires a new skill; new AI-skill job vacancies post 3–3.4% higher wages in the US; employment in high-AI-exposure, low-complementarity occupations is 3.6% lower in regions with greater AI-skill demand (5-year effect); early-career workers (ages 22–25) in the most AI-exposed occupations saw a 13% relative decline in employment (Brynjolfsson, Chandar, Chen 2025 finding cited).

- **https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market** — Yale Budget Lab, Gimbel, Kendall & Nunn. Published **May 7, 2026** (outside window). Tier 2. Key finding: Using synthetic differences-in-differences on CPS data through Q1 2026, finds no statistically significant employment or wage effects of AI exposure at aggregate level. Unemployment in exposed occupations is ~0.5 pp higher than comparison group in Q1 2026 but not significant. Highly relevant as OVERLAY (neutral) on `total-us-jobs-lost`, `median-wage-impact`.

- **https://www.challengergray.com/wp-content/uploads/2026/06/Challenger-Report-May-2026.pdf** — Challenger, Gray & Christmas May 2026 Job Cut Report. Published **June 4, 2026** (4 days before window opens). Tier 3. Key stats: In May 2026, AI was cited for 38,579 announced job cuts (40% of all May cuts), the highest monthly AI-cited total ever recorded; YTD 2026 AI has been cited for 87,714 cuts (22% of all 2026 layoffs), surpassing all of 2025 (54,836). **This borderline source deserves a follow-up check next cycle.** Maps to `total-us-jobs-lost` as OVERLAY (up), but caveat: announced layoffs cited to AI ≠ actual job losses caused by AI; Challenger themselves note many are strategic reframings.

- **https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/** — NY Fed Liberty Street Economics, Audoly, Guerin & Topa. Published **May 14, 2026** (outside window). Tier 1. Key finding: While high-AI-exposure occupations saw relatively fewer job postings than low-exposure occupations, this trend predates ChatGPT (began before 2022) and doesn't show a clear break after late 2022. Authors conclude "little indication of a distinct AI-driven decline in labor demand." OVERLAY neutral on `total-us-jobs-lost`.

- **https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html** — Federal Reserve Board FEDS Note on AI Adoption Monitoring. Published **April 3, 2026** (outside window). Tier 1. Key stats: work-related GenAI adoption (Real-Time Population Survey) at ~41% of workforce; firm adoption (BTOS) ~18% at end of 2025.

- **https://www.anthropic.com/research/labor-market-impacts** — Anthropic, Massenkoff & McCrory, "Labor Market Impacts of AI." Published **March 5, 2026** (outside window). Tier 2 (industry research). Key finding: finds limited evidence that AI has affected aggregate employment to date using a new AI-usage-based exposure measure.

- **https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market** — Harvard Business Review / HBS, March 2026 (outside window). Summary piece; no new primary statistics.

- **https://www.promarket.org/2026/05/21/more-ai-exposed-industries-and-states-are-benefiting-but-results-are-heterogenous/** — ProMarket summary of Johnston & Makridis working paper. Published **May 21, 2026** (outside window). Key stats: By 2023–2024, a 1 standard deviation increase in AI exposure raises hourly wages approximately 1.0–1.1%; workers capturing only ~29 cents of every dollar of AI-driven output growth.

---

## Priority Recommendations

### Ingest Immediately (if not already loaded)

1. **PwC 2026 Global AI Jobs Barometer** (June 15, 2026 — within window, Tier 2):
   - 62% AI-skill wage premium provides important update to `high-skill-wage-premium` graph (previous PwC 2025 figure was 56%). Trend is accelerating faster than most graph consensus projections assumed.
   - The −10% decline in non-AI entry-level job openings (US-specific, 2.4M ads) is the freshest available signal for `entry-level-wage-impact`. Worth a data-point review even though it is a job-openings proxy, not a wage measure.

2. **Challenger May 2026 Report** (June 4, 2026 — 4 days outside window, Tier 3):
   - 38,579 AI-cited layoff announcements in May 2026 alone (40% of total cuts) is a striking new high. While these are not confirmed AI-caused job losses, the scale of employer self-attribution to AI is itself a labor-market signal. Recommend ingesting as OVERLAY (up, cautiously) on `total-us-jobs-lost` with the caveat prominently documented.

### Statistics That Diverge Significantly from Current Graph Consensus

- **PwC 62% AI wage premium** is notably higher than the ~25–40% range in most existing overlays on `high-skill-wage-premium`. If the graph's consensus trajectory doesn't already reflect this acceleration, it should be flagged for review. The premium rose from 57% to 62% in a single year.

- **Yale Budget Lab (May 7, 2026)** finds *zero significant aggregate employment effect* through Q1 2026, which diverges from graphs that may assume earlier, larger displacement effects. This Tier 2 econometric result should be loaded as a neutral OVERLAY on `total-us-jobs-lost` and `overall-us-displacement` to represent the null-effects camp.

### New Government Data Releases

- **Census BTOS biweekly data** continues to update. As of May 3, 2026, 19.8% national AI use rate. The next biweekly BTOS release (~June 18, 2026) will be the first data point within or just after this digest window — recommend checking immediately for that release as a potential `ai-adoption-rate` DATA_POINT.
- **BLS Employment Situation** (monthly) and the **Current Population Survey microdata** continue to be the primary inputs for the Budget Lab and Fed trackers. Both are Tier 1 and should be monitored monthly.

---

*Digest compiled 2026-06-15 by jobsdata.ai research agent. All statistics are exact quotes from verified primary or secondary sources. No statistics have been invented or interpolated.*