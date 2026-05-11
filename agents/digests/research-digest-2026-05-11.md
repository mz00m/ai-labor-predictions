1	# AI Labor Research Digest — 2026-05-11
2	
3	## Summary
4	
5	This digest covers the period **2026-05-04 through 2026-05-11**. Four in-window sources were identified: two Brookings Institution research briefs (May 4 and May 5), a new Yale Budget Lab econometric analysis (May 7), and a Fortune article synthesizing the BLS April 2026 jobs report (May 8). The most policy-relevant Tier 2 finding is a rigorous U.S. econometric study from Yale Budget Lab finding **no statistically significant AI impact on employment or wages as of Q1 2026**, using synthetic differences-in-differences methods. A Census BTOS figure cited in the Brookings May 5 brief provides the freshest US AI adoption data point: **17.5% of U.S. businesses** used AI in at least one business function in the two-week reference period ending February 2026—under a broader question wording than prior BTOS waves. The BLS April 2026 jobs report (released May 9) shows 16 consecutive months of net job loss in the information sector, reaching its lowest payroll since March 2021, though economists caution against attributing this directly to AI.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### New Evidence on Data Center Employment Effects
14	
15	- **Publisher:** Brookings Institution (Global Economy and Development program)
16	- **Date:** 2026-05-04
17	- **URL:** https://www.brookings.edu/articles/new-evidence-on-data-center-employment-effects/
18	- **Evidence Tier:** 2 (Think Tank — uses BLS county-level data, 2003–2024, synthetic control method)
19	- **Source ID:** brookings-data-centers-2026
20	
21	**Context:** Authors Dany Bahar and Greg Wright assembled a dataset of approximately 770 U.S. data center facilities linked to Bureau of Labor Statistics county-level employment and wage data (2003–2024), covering 93 counties receiving their first large data center (2008–2024) and ~3,000 control counties. This is a rigorous causal study of AI infrastructure's labor market effects.
22	
23	**Statistics:**
24	
25	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
26	   **Type:** OVERLAY (down)
27	   **Value:** +4.5 % private employment (5-year effect; midpoint of 4–5% range; positive = creates jobs, not displaces)
28	   **Quote:** "Counties that receive their first large data center see total private employment rise by 4%-5% over five to six years."
29	
30	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
31	   **Type:** OVERLAY (down)
32	   **Value:** +22 % information sector employment (IT, telecom, software — data center counties)
33	   **Quote:** "Construction employment jumps 11%, and information sector employment—IT services, telecommunications, software—grows by 22%."
34	
35	3. **Graph:** Geographic Wage Divergence (`geographic-wage-divergence`)
36	   **Type:** OVERLAY (up)
37	   **Value:** +3.5 % wage premium (midpoint of 3–4% for existing workers and new hires in data center counties)
38	   **Quote:** "Wages rise by 3%-4% for both existing workers and new hires, without a significant increase in home prices."
39	
40	4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
41	   **Type:** OVERLAY (down)
42	   **Value:** +23 % information sector employment in counties with 4+ data center facilities
43	   **Quote:** "counties with four or more facilities see an impressive 23% increase in information sector employment, indicating that the technology ecosystem that drives these gains takes time and scale to develop."
44	
45	   **⚠️ Methodological note:** "Naive estimates that fail to account for preexisting growth trends overstate the effect by a factor of three." — Industry-sponsored comparisons significantly overstate job creation benefits.
46	
47	---
48	
49	### AI Growth Acceleration versus Distributional Fairness
50	
51	- **Publisher:** Brookings Institution (Center for Technology Innovation / Forum for Cooperation on AI)
52	- **Date:** 2026-05-05
53	- **URL:** https://www.brookings.edu/articles/ai-growth-acceleration-versus-distributional-fairness/
54	- **Evidence Tier:** 2 (Think Tank — background briefing for FCAI dialogue held March 31, 2026; synthesizes multiple Tier 1–2 studies)
55	- **Source ID:** brookings-fcai-fairness-2026
56	
57	**Context:** A comprehensive policy briefing by Tanner, Kyosovska, Belle, Kerry, Renda, Tabassi, and Wyckoff, synthesizing global evidence on AI diffusion and labor market outcomes. Several important statistics from recently released Tier 1 sources are cited here for the first time in this form.
58	
59	**Statistics:**
60	
61	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
62	   **Type:** DATA_POINT
63	   **Value:** 17.5 % of U.S. businesses (reference period: two weeks ending approx. February 2026)
64	   **Quote:** "U.S. Census data from February 2026 suggests roughly 17.5% of U.S. businesses used AI in at least one business function in the last two weeks."
65	   **Source of underlying data:** U.S. Census Bureau BTOS (Tier 1). Note: BTOS question wording changed in November 2025 to "used AI in at least one business function" from the prior narrower wording ("used AI in producing goods or services"), which had returned ~6% adoption. These figures are **not directly comparable** across the question-wording break.
66	
67	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
68	   **Type:** OVERLAY (up)
69	   **Value:** 70 % of firms globally reporting they "actively use AI" (US/UK/Germany/Australia executive survey, NBER w34836, Feb 2026)
70	   **Quote:** "A February 2026 National Bureau of Economic Research (NBER) working paper surveying nearly 6,000 executives across the United States, United Kingdom, Germany, and Australia reports that around 70% of firms 'actively use AI,' but executives' time spent using AI is low on average (about 1.5 hours per week)."
71	   **Note:** Multi-country global stat → overlay only. "Actively use AI" is a self-reported, broader definition than Census BTOS. Divergence from BTOS (17.5%) likely reflects definition differences and sample frame.
72	
73	3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
74	   **Type:** OVERLAY (neutral)
75	   **Value:** ~0 % firms reporting AI employment impact to date (90% of NBER survey respondents report no employment or productivity change in prior 3 years)
76	   **Quote:** "about 90% of firms report no impact on employment or productivity over the prior three years despite expecting nontrivial effects over the next three years."
77	   **Note:** Multi-country global stat (US/UK/Germany/Australia) → overlay only. Consistent with Yale Budget Lab finding below.
78	
79	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
80	   **Type:** OVERLAY (up)
81	   **Value:** 35.9 % of U.S. workers using generative AI tools (survey, December 2025; Hartley et al. 2026 working paper, cited in brief)
82	   **Quote:** "Jonathan S. Hartley, Filip Jolevski, Vitor Melo, and Brendan Moore (2026) report that 35.9% of U.S. workers used generative AI by December 2025."
83	   **Note:** From a January 2026 working paper (SSRN); the Brookings brief cites this via the ICLE literature review. Survey-based; not drawn from Census BTOS framework.
84	
85	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
86	   **Type:** OVERLAY (neutral)
87	   **Value:** Indeterminate — exposure ≠ displacement; "current measures of exposure, automation, and augmentation show no sign of being systematically related to changes in employment or unemployment" (Yale Budget Lab, cited)
88	   **Quote:** "The Yale Budget Lab's tracker similarly stresses that current measures of exposure, automation, and augmentation show no sign of being systematically related to changes in employment or unemployment."
89	
90	---
91	
92	### AI Is Probably Not (Yet) the Reason for Labor Market Weakening
93	
94	- **Publisher:** The Budget Lab at Yale
95	- **Date:** 2026-05-07
96	- **URL:** https://budgetlab.yale.edu/research/ai-probably-not-yet-reason-labor-market-weakening
97	- **Evidence Tier:** 2 (Academic think tank — rigorous econometric analysis of CPS microdata using synthetic differences-in-differences)
98	- **Source ID:** budgetlab-ai-employment-may2026
99	
100	**Context:** Ryan Nunn applies a synthetic differences-in-differences methodology to CPS monthly employment microdata through Q1 2026, comparing AI-exposed and unexposed occupations while controlling for the fact that AI-exposed occupations are less cyclical than average. Released the day before the April 2026 jobs report. Companion to a longer methodological paper also released the same day ("What We Do and Don't Know About How AI Is Affecting the Labor Market").
101	
102	**Statistics:**
103	
104	1. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
105	   **Type:** OVERLAY (down)
106	   **Value:** ~0 % (no statistically significant employment effect of AI on exposed occupations, Q1 2026)
107	   **Quote:** "When we apply our preferred strategy, we find no strong evidence of impacts as of yet. The estimate is close to zero and cannot be distinguished from it, statistically speaking."
108	   **Methodological note:** This uses synthetic DiD, explicitly addressing the limitation of earlier studies that did not control for the lower cyclicality of AI-exposed occupations. Covers employment shares AND real hourly wages (both zero-effect).
109	
110	2. **Graph:** Median Wage Impact (`median-wage-impact`)
111	   **Type:** OVERLAY (neutral)
112	   **Value:** ~0 % (no statistically significant real wage impact on AI-exposed occupations vs. unexposed, Q1 2026)
113	   **Quote:** "The same is true for Figure 2, which shows impacts on inflation-adjusted hourly wages." [Both employment and wages show near-zero treatment estimates]
114	
115	3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
116	   **Type:** OVERLAY (down) [contextual labor market data]
117	   **Value:** 20,000 net new jobs per month (recent average, per Yale Budget Lab, based on BLS monthly employment reports)
118	   **Quote:** "Payroll employment growth has been relatively weak over the prior year, at only about 20,000 net new jobs per month."
119	   **Note:** This weak hiring is attributed primarily to slowdown in net immigration, not AI, per the author.
120	
121	---
122	
123	### The Job Market Is Healing for Everyone—Except in the Office (April 2026 BLS Jobs Report Analysis)
124	
125	- **Publisher:** Fortune (reporting on underlying U.S. Bureau of Labor Statistics data)
126	- **Date:** 2026-05-08
127	- **URL:** https://fortune.com/2026/05/08/jobs-report-april-2026-ai-white-collar-layoffs-finance-wages/
128	- **Evidence Tier:** 3 (Major financial media — underlying BLS data is Tier 1; article synthesizes and adds context from market economists)
129	- **Source ID:** fortune-bls-april-jobs-2026
130	
131	**Context:** Eva Roytburg analysis of the BLS April 2026 Employment Situation Summary (released May 9, 2026 — technically just outside this digest's window by one day, but Fortune's pre-embargo analysis and the BLS release are treated together). The April jobs report is the first report showing data inside our window and is immediately relevant.
132	
133	**Statistics:**
134	
135	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
136	   **Type:** OVERLAY (up)
137	   **Value:** −13,000 information sector jobs in April 2026 alone; 16 consecutive months of net job loss; payrolls at lowest since March 2021
138	   **Quote:** "information payrolls have now fallen to their lowest level since March 2021—wiping out four years of sector gains—and have logged 16 consecutive months of net job loss. That is one of the longest peacetime declines in any major sector in modern labor data."
139	   **Note:** Fortune/BLS does NOT attribute this to AI directly; economists "remain cautious about drawing a straight line from AI to the white-collar declines." Classified as OVERLAY (up) rather than DATA_POINT due to ambiguous causation.
140	
141	2. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
142	   **Type:** OVERLAY (up)
143	   **Value:** −24,000 combined (information −13,000; finance −11,000) in April 2026
144	   **Quote:** "The 'information sector'—where the BLS counts tech, telecom, data processing, and media jobs—lost another 13,000 jobs in April, while finance shed 11,000. The monthly average this year has been about 9,000 jobs lost in information, and 12,000 in financial activities."
145	
146	3. **Graph:** Median Wage Impact (`median-wage-impact`)
147	   **Type:** OVERLAY (down)
148	   **Value:** −0.4 % estimated real wage (nominal +3.6% vs. ~4% expected inflation)
149	   **Quote:** "The April jobs report shows average hourly earnings rose 3.6% over the year, while inflation is expected to come in around 4% for April once the Consumer Price Index lands next week...Joseph Brusuelas, chief economist at RSM, predicted that real average hourly earnings will likely register flat to negative for April."
150	   **Note:** Not AI-specific; general labor market squeeze driven partly by Middle East conflict and supply chain effects. Overlay only.
151	
152	---
153	
154	## Sources Checked but Not Relevant to This Digest Window
155	
156	The following sources were fetched and reviewed but fall **outside the May 4–11, 2026 window** or did not yield new quantitative AI labor statistics not already in the site's graph data:
157	
158	| Source | Date | Reason Excluded |
159	|---|---|---|
160	| Census BTOS interactive visualization (census.gov) | January 6, 2026 (last major update) | Data accessible only via JavaScript; underlying Feb 2026 figures already captured via Brookings citation |
161	| NBER Working Paper w34836 "Firm Data on AI" (Yotzov, Barrero et al.) | February 2026 | Outside window; stats captured via Brookings citation |
162	| Yale Budget Lab "Tracking the Impact of AI on the Labor Market" | April 16, 2026 | Outside window |
163	| CompTIA "State of the Tech Workforce 2026" | March 24, 2026 | Outside window |
164	| Anthropic "Labor Market Impacts of AI: A New Measure and Early Evidence" | March 5, 2026 (updated March 8) | Outside window |
165	| ICLE "AI, Productivity, and Labor Markets: A Review of the Empirical Evidence" | February 5, 2026 | Outside window |
166	| Stanford HAI "AI Index 2026 Annual Report" | April 13, 2026 | Outside window |
167	| Goldman Sachs "How Will AI Affect the US Labor Market?" | Undated / circa late 2025–early 2026 | Cannot confirm precise date; no new quantitative findings in accessible portion |
168	| Dallas Fed "AI is simultaneously aiding and replacing workers, wage data suggest" | February 24, 2026 | Outside window |
169	| IMF Staff Discussion Note SDN/2026/001 "New Jobs Creation in the AI Age" | Early 2026 | Outside window; only partial content accessible |
170	| NBER w33509 "Artificial Intelligence and the Labor Market" | 2025 | Outside window |
171	| EPIC for America "The EPIC Jobs Report for March 2026" | ~April 3, 2026 | Outside window |
172	
173	---
174	
175	## Priority Recommendations
176	
177	### Tier 2 Sources to Ingest Immediately
178	
179	1. **Yale Budget Lab — "AI Is Probably Not (Yet) the Reason for Labor Market Weakening" (May 7, 2026)**
180	   Highest methodological rigor of this week's new sources. The synthetic DiD finding of near-zero AI impact on employment and wages (Q1 2026) is a significant **downside overlay** for `overall-us-displacement` and `median-wage-impact`. This should be flagged prominently on those graphs as the most credible null result to date using U.S. CPS microdata with a method specifically designed to isolate AI effects from confounders.
181	
182	2. **Brookings "New evidence on data center employment effects" (May 4, 2026)**
183	   First rigorous causal study of AI infrastructure's local labor market effects using synthetic control methods with BLS data. The 3–4% wage premium and 22% information sector job *growth* in data center counties are **downside overlays** for `tech-sector-displacement` and **upside overlays** for `geographic-wage-divergence`. Particularly notable: it demonstrates that naive industry estimates overstate effects by 3×.
184	
185	### Statistics That Diverge Significantly from Current Graph Consensus
186	
187	- **`ai-adoption-rate` DATA POINT gap:** The new Census BTOS February 2026 figure (**17.5%**) is notably higher than what prior BTOS waves showed (~6% with old wording), but this is a definitional change (Nov 2025 question revision from "produces goods/services" to "at least one business function"), not a real jump. Any existing data point on `ai-adoption-rate` from BTOS should be flagged with a **⚠️ SERIES BREAK** annotation effective November 2025.
188	
189	- **`tech-sector-displacement` tension:** Brookings (May 4) shows 22% IT job *growth* in data center counties; Fortune/BLS (May 8) shows 16 consecutive months of information sector job *losses* at national level. These findings are not contradictory — local AI hub job creation can coexist with national information sector contraction — but both should appear as overlays pointing in opposite directions, with appropriate context.
190	
191	- **`overall-us-displacement` — no signal despite rising AI capability:** The combination of Yale Budget Lab (May 7) null result and NBER w34836 (90% of firms report no employment impact) is a consistent pattern across multiple methodologies. If current prediction graphs imply significant displacement by this date, these findings constitute meaningful **downside revisions**.
192	
193	### New Government Data Releases
194	
195	- **BLS April 2026 Employment Situation Summary** (released May 9, 2026): Key new government data. Information sector: 16 consecutive months of loss, now at 5-year low payroll. Does NOT establish AI causation, but the sector-level trends are relevant to `tech-sector-displacement` monitoring.
196	
197	- **Census BTOS February 2026 wave** (cited in Brookings May 5, 2026): New AI adoption figure of 17.5% under expanded question wording. Recommend checking census.gov directly for the full tabulations by sector and firm size when the JavaScript-dependent interactive becomes accessible.
# AI Labor Research Digest — 2026-05-11

## Summary

This digest covers the period **2026-05-04 through 2026-05-11**. Four in-window sources were identified: two Brookings Institution research briefs (May 4 and May 5), a new Yale Budget Lab econometric analysis (May 7), and a Fortune article synthesizing the BLS April 2026 jobs report (May 8). The most policy-relevant Tier 2 finding is a rigorous U.S. econometric study from Yale Budget Lab finding **no statistically significant AI impact on employment or wages as of Q1 2026**, using synthetic differences-in-differences methods. A Census BTOS figure cited in the Brookings May 5 brief provides the freshest US AI adoption data point: **17.5% of U.S. businesses** used AI in at least one business function in the two-week reference period ending February 2026—under a broader question wording than prior BTOS waves. The BLS April 2026 jobs report (released May 9) shows 16 consecutive months of net job loss in the information sector, reaching its lowest payroll since March 2021, though economists caution against attributing this directly to AI.

---

## New Sources

---

### New Evidence on Data Center Employment Effects

- **Publisher:** Brookings Institution (Global Economy and Development program)
- **Date:** 2026-05-04
- **URL:** https://www.brookings.edu/articles/new-evidence-on-data-center-employment-effects/
- **Evidence Tier:** 2 (Think Tank — uses BLS county-level data, 2003–2024, synthetic control method)
- **Source ID:** brookings-data-centers-2026

**Context:** Authors Dany Bahar and Greg Wright assembled a dataset of approximately 770 U.S. data center facilities linked to Bureau of Labor Statistics county-level employment and wage data (2003–2024), covering 93 counties receiving their first large data center (2008–2024) and ~3,000 control counties. This is a rigorous causal study of AI infrastructure's labor market effects.

**Statistics:**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** +4.5 % private employment (5-year effect; midpoint of 4–5% range; positive = creates jobs, not displaces)
   **Quote:** "Counties that receive their first large data center see total private employment rise by 4%-5% over five to six years."

2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** +22 % information sector employment (IT, telecom, software — data center counties)
   **Quote:** "Construction employment jumps 11%, and information sector employment—IT services, telecommunications, software—grows by 22%."

3. **Graph:** Geographic Wage Divergence (`geographic-wage-divergence`)
   **Type:** OVERLAY (up)
   **Value:** +3.5 % wage premium (midpoint of 3–4% for existing workers and new hires in data center counties)
   **Quote:** "Wages rise by 3%-4% for both existing workers and new hires, without a significant increase in home prices."

4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** +23 % information sector employment in counties with 4+ data center facilities
   **Quote:** "counties with four or more facilities see an impressive 23% increase in information sector employment, indicating that the technology ecosystem that drives these gains takes time and scale to develop."

   **⚠️ Methodological note:** "Naive estimates that fail to account for preexisting growth trends overstate the effect by a factor of three." — Industry-sponsored comparisons significantly overstate job creation benefits.

---

### AI Growth Acceleration versus Distributional Fairness

- **Publisher:** Brookings Institution (Center for Technology Innovation / Forum for Cooperation on AI)
- **Date:** 2026-05-05
- **URL:** https://www.brookings.edu/articles/ai-growth-acceleration-versus-distributional-fairness/
- **Evidence Tier:** 2 (Think Tank — background briefing for FCAI dialogue held March 31, 2026; synthesizes multiple Tier 1–2 studies)
- **Source ID:** brookings-fcai-fairness-2026

**Context:** A comprehensive policy briefing by Tanner, Kyosovska, Belle, Kerry, Renda, Tabassi, and Wyckoff, synthesizing global evidence on AI diffusion and labor market outcomes. Several important statistics from recently released Tier 1 sources are cited here for the first time in this form.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 17.5 % of U.S. businesses (reference period: two weeks ending approx. February 2026)
   **Quote:** "U.S. Census data from February 2026 suggests roughly 17.5% of U.S. businesses used AI in at least one business function in the last two weeks."
   **Source of underlying data:** U.S. Census Bureau BTOS (Tier 1). Note: BTOS question wording changed in November 2025 to "used AI in at least one business function" from the prior narrower wording ("used AI in producing goods or services"), which had returned ~6% adoption. These figures are **not directly comparable** across the question-wording break.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 70 % of firms globally reporting they "actively use AI" (US/UK/Germany/Australia executive survey, NBER w34836, Feb 2026)
   **Quote:** "A February 2026 National Bureau of Economic Research (NBER) working paper surveying nearly 6,000 executives across the United States, United Kingdom, Germany, and Australia reports that around 70% of firms 'actively use AI,' but executives' time spent using AI is low on average (about 1.5 hours per week)."
   **Note:** Multi-country global stat → overlay only. "Actively use AI" is a self-reported, broader definition than Census BTOS. Divergence from BTOS (17.5%) likely reflects definition differences and sample frame.

3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** ~0 % firms reporting AI employment impact to date (90% of NBER survey respondents report no employment or productivity change in prior 3 years)
   **Quote:** "about 90% of firms report no impact on employment or productivity over the prior three years despite expecting nontrivial effects over the next three years."
   **Note:** Multi-country global stat (US/UK/Germany/Australia) → overlay only. Consistent with Yale Budget Lab finding below.

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 35.9 % of U.S. workers using generative AI tools (survey, December 2025; Hartley et al. 2026 working paper, cited in brief)
   **Quote:** "Jonathan S. Hartley, Filip Jolevski, Vitor Melo, and Brendan Moore (2026) report that 35.9% of U.S. workers used generative AI by December 2025."
   **Note:** From a January 2026 working paper (SSRN); the Brookings brief cites this via the ICLE literature review. Survey-based; not drawn from Census BTOS framework.

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** Indeterminate — exposure ≠ displacement; "current measures of exposure, automation, and augmentation show no sign of being systematically related to changes in employment or unemployment" (Yale Budget Lab, cited)
   **Quote:** "The Yale Budget Lab's tracker similarly stresses that current measures of exposure, automation, and augmentation show no sign of being systematically related to changes in employment or unemployment."

---

### AI Is Probably Not (Yet) the Reason for Labor Market Weakening

- **Publisher:** The Budget Lab at Yale
- **Date:** 2026-05-07
- **URL:** https://budgetlab.yale.edu/research/ai-probably-not-yet-reason-labor-market-weakening
- **Evidence Tier:** 2 (Academic think tank — rigorous econometric analysis of CPS microdata using synthetic differences-in-differences)
- **Source ID:** budgetlab-ai-employment-may2026

**Context:** Ryan Nunn applies a synthetic differences-in-differences methodology to CPS monthly employment microdata through Q1 2026, comparing AI-exposed and unexposed occupations while controlling for the fact that AI-exposed occupations are less cyclical than average. Released the day before the April 2026 jobs report. Companion to a longer methodological paper also released the same day ("What We Do and Don't Know About How AI Is Affecting the Labor Market").

**Statistics:**

1. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** ~0 % (no statistically significant employment effect of AI on exposed occupations, Q1 2026)
   **Quote:** "When we apply our preferred strategy, we find no strong evidence of impacts as of yet. The estimate is close to zero and cannot be distinguished from it, statistically speaking."
   **Methodological note:** This uses synthetic DiD, explicitly addressing the limitation of earlier studies that did not control for the lower cyclicality of AI-exposed occupations. Covers employment shares AND real hourly wages (both zero-effect).

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (neutral)
   **Value:** ~0 % (no statistically significant real wage impact on AI-exposed occupations vs. unexposed, Q1 2026)
   **Quote:** "The same is true for Figure 2, which shows impacts on inflation-adjusted hourly wages." [Both employment and wages show near-zero treatment estimates]

3. **Graph:** Overall U.S. Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down) [contextual labor market data]
   **Value:** 20,000 net new jobs per month (recent average, per Yale Budget Lab, based on BLS monthly employment reports)
   **Quote:** "Payroll employment growth has been relatively weak over the prior year, at only about 20,000 net new jobs per month."
   **Note:** This weak hiring is attributed primarily to slowdown in net immigration, not AI, per the author.

---

### The Job Market Is Healing for Everyone—Except in the Office (April 2026 BLS Jobs Report Analysis)

- **Publisher:** Fortune (reporting on underlying U.S. Bureau of Labor Statistics data)
- **Date:** 2026-05-08
- **URL:** https://fortune.com/2026/05/08/jobs-report-april-2026-ai-white-collar-layoffs-finance-wages/
- **Evidence Tier:** 3 (Major financial media — underlying BLS data is Tier 1; article synthesizes and adds context from market economists)
- **Source ID:** fortune-bls-april-jobs-2026

**Context:** Eva Roytburg analysis of the BLS April 2026 Employment Situation Summary (released May 9, 2026 — technically just outside this digest's window by one day, but Fortune's pre-embargo analysis and the BLS release are treated together). The April jobs report is the first report showing data inside our window and is immediately relevant.

**Statistics:**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −13,000 information sector jobs in April 2026 alone; 16 consecutive months of net job loss; payrolls at lowest since March 2021
   **Quote:** "information payrolls have now fallen to their lowest level since March 2021—wiping out four years of sector gains—and have logged 16 consecutive months of net job loss. That is one of the longest peacetime declines in any major sector in modern labor data."
   **Note:** Fortune/BLS does NOT attribute this to AI directly; economists "remain cautious about drawing a straight line from AI to the white-collar declines." Classified as OVERLAY (up) rather than DATA_POINT due to ambiguous causation.

2. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −24,000 combined (information −13,000; finance −11,000) in April 2026
   **Quote:** "The 'information sector'—where the BLS counts tech, telecom, data processing, and media jobs—lost another 13,000 jobs in April, while finance shed 11,000. The monthly average this year has been about 9,000 jobs lost in information, and 12,000 in financial activities."

3. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −0.4 % estimated real wage (nominal +3.6% vs. ~4% expected inflation)
   **Quote:** "The April jobs report shows average hourly earnings rose 3.6% over the year, while inflation is expected to come in around 4% for April once the Consumer Price Index lands next week...Joseph Brusuelas, chief economist at RSM, predicted that real average hourly earnings will likely register flat to negative for April."
   **Note:** Not AI-specific; general labor market squeeze driven partly by Middle East conflict and supply chain effects. Overlay only.

---

## Sources Checked but Not Relevant to This Digest Window

The following sources were fetched and reviewed but fall **outside the May 4–11, 2026 window** or did not yield new quantitative AI labor statistics not already in the site's graph data:

| Source | Date | Reason Excluded |
|---|---|---|
| Census BTOS interactive visualization (census.gov) | January 6, 2026 (last major update) | Data accessible only via JavaScript; underlying Feb 2026 figures already captured via Brookings citation |
| NBER Working Paper w34836 "Firm Data on AI" (Yotzov, Barrero et al.) | February 2026 | Outside window; stats captured via Brookings citation |
| Yale Budget Lab "Tracking the Impact of AI on the Labor Market" | April 16, 2026 | Outside window |
| CompTIA "State of the Tech Workforce 2026" | March 24, 2026 | Outside window |
| Anthropic "Labor Market Impacts of AI: A New Measure and Early Evidence" | March 5, 2026 (updated March 8) | Outside window |
| ICLE "AI, Productivity, and Labor Markets: A Review of the Empirical Evidence" | February 5, 2026 | Outside window |
| Stanford HAI "AI Index 2026 Annual Report" | April 13, 2026 | Outside window |
| Goldman Sachs "How Will AI Affect the US Labor Market?" | Undated / circa late 2025–early 2026 | Cannot confirm precise date; no new quantitative findings in accessible portion |
| Dallas Fed "AI is simultaneously aiding and replacing workers, wage data suggest" | February 24, 2026 | Outside window |
| IMF Staff Discussion Note SDN/2026/001 "New Jobs Creation in the AI Age" | Early 2026 | Outside window; only partial content accessible |
| NBER w33509 "Artificial Intelligence and the Labor Market" | 2025 | Outside window |
| EPIC for America "The EPIC Jobs Report for March 2026" | ~April 3, 2026 | Outside window |

---

## Priority Recommendations

### Tier 2 Sources to Ingest Immediately

1. **Yale Budget Lab — "AI Is Probably Not (Yet) the Reason for Labor Market Weakening" (May 7, 2026)**
   Highest methodological rigor of this week's new sources. The synthetic DiD finding of near-zero AI impact on employment and wages (Q1 2026) is a significant **downside overlay** for `overall-us-displacement` and `median-wage-impact`. This should be flagged prominently on those graphs as the most credible null result to date using U.S. CPS microdata with a method specifically designed to isolate AI effects from confounders.

2. **Brookings "New evidence on data center employment effects" (May 4, 2026)**
   First rigorous causal study of AI infrastructure's local labor market effects using synthetic control methods with BLS data. The 3–4% wage premium and 22% information sector job *growth* in data center counties are **downside overlays** for `tech-sector-displacement` and **upside overlays** for `geographic-wage-divergence`. Particularly notable: it demonstrates that naive industry estimates overstate effects by 3×.

### Statistics That Diverge Significantly from Current Graph Consensus

- **`ai-adoption-rate` DATA POINT gap:** The new Census BTOS February 2026 figure (**17.5%**) is notably higher than what prior BTOS waves showed (~6% with old wording), but this is a definitional change (Nov 2025 question revision from "produces goods/services" to "at least one business function"), not a real jump. Any existing data point on `ai-adoption-rate` from BTOS should be flagged with a **⚠️ SERIES BREAK** annotation effective November 2025.

- **`tech-sector-displacement` tension:** Brookings (May 4) shows 22% IT job *growth* in data center counties; Fortune/BLS (May 8) shows 16 consecutive months of information sector job *losses* at national level. These findings are not contradictory — local AI hub job creation can coexist with national information sector contraction — but both should appear as overlays pointing in opposite directions, with appropriate context.

- **`overall-us-displacement` — no signal despite rising AI capability:** The combination of Yale Budget Lab (May 7) null result and NBER w34836 (90% of firms report no employment impact) is a consistent pattern across multiple methodologies. If current prediction graphs imply significant displacement by this date, these findings constitute meaningful **downside revisions**.

### New Government Data Releases

- **BLS April 2026 Employment Situation Summary** (released May 9, 2026): Key new government data. Information sector: 16 consecutive months of loss, now at 5-year low payroll. Does NOT establish AI causation, but the sector-level trends are relevant to `tech-sector-displacement` monitoring.

- **Census BTOS February 2026 wave** (cited in Brookings May 5, 2026): New AI adoption figure of 17.5% under expanded question wording. Recommend checking census.gov directly for the full tabulations by sector and firm size when the JavaScript-dependent interactive becomes accessible.