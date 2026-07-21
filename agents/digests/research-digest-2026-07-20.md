1	# AI Labor Research Digest — 2026-07-20
2	
3	## Summary
4	
5	The week of July 13–20, 2026 was dominated by a single landmark event: the release of **"We Must Act Now: A Statement on AI's Transformation of the Economy"** (July 13), a joint open letter organized by Stanford's Digital Economy Lab and signed by 200+ economists and researchers, including 16 Nobel laureates and 9 watchlist researchers. The statement warns that AI could produce economic disruption exceeding the Industrial Revolution on a vastly compressed timeline and calls for urgent institutional action. Concurrent Fortune and Quartz reporting on the statement cited the Brynjolfsson/ADP Canaries Dashboard (data through April 2026), showing employment for workers aged 22–25 in AI-exposed occupations contracting more than 4% annually — a persistent signal that has grown by roughly half a percentage point per month since late 2022. The second significant source within the window is media coverage (phys.org, July 14) of NBER Working Paper 35353 by Althoff & Reichardt (Stanford/SIEPR), published June 22, finding that AI's task-simplification effect could raise lower-skilled workers' lifetime earnings by 15–45%. No Tier 1 government statistical releases (BLS, Census BTOS) with new AI-specific labor content were confirmed within the 7-day window; the Census BTOS July 2 biweekly release carried no new substantive AI narrative beyond the May 2026 data story.
6	
7	---
8	
9	## Recurring Series Status
10	
11	**Registry sweep (asOf 2026-07-20):**
12	
13	| Series ID | Next Expected | Status |
14	|---|---|---|
15	| `ellucian-highered-ai` | 2027-03-01 | **Not due** — last ingested 2026-03-04 (3rd Annual Edition); next release expected March 2027 |
16	
17	*Note: Census BTOS, Challenger Gray & Christmas, FactSet Earnings Insight, and PwC Barometer are tracked informally but are not yet in recurring-sources.json. Status for context:*
18	- **Census BTOS** — July 2, 2026 biweekly release confirmed; most recent AI-specific analysis covers data through May 3, 2026. No new AI narrative this week. Next biweekly release expected ~July 16 (not confirmed as of this digest).
19	- **Challenger Gray & Christmas** — June 2026 report released July 1 (just outside window): AI cited in 101,743 cuts YTD (23% of all cuts), leading reason for 4th consecutive month.
20	- **FactSet Earnings Insight** — July 17 Earnings Season Update published (within window); covers early Q2 2026 earnings season (10% reported). No AI workforce mention statistics extracted — this update focuses on aggregate EPS/revenue, not AI-mention language.
21	- **PwC AI Jobs Barometer 2026** — released June 15, 2026 (outside window).
22	
23	---
24	
25	## Watchlist Researcher Check
26	
27	*All 15 researchers last checked 2026-04-14 (97 days ago — exceeds 30-day threshold). Sweep conducted 2026-07-20.*
28	
29	**Researchers with new activity this week:**
30	
31	| Researcher | Affiliation | Activity |
32	|---|---|---|
33	| Daron Acemoglu | MIT | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
34	| Erik Brynjolfsson | Stanford DEL | Co-organized "We Must Act Now" (July 13, 2026); Canaries Dashboard extended to April 2026 data **WATCHLIST** |
35	| Pascual Restrepo | Yale | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
36	| Maria del Rio-Chanona | UCL/ILO | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
37	| Alex Imas | Chicago Booth | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
38	| Molly Kinder | Breakwater Initiative | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
39	| David Deming | Harvard/NBER | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
40	| Neil Thompson | MIT FutureTech | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
41	
42	**Researchers with no new publications found in last 7 days:**
43	- Martha Gimbel (Yale Budget Lab) — published July 9 op-ed ("The US Economy Is Walking a Tightrope Between Aging and AI"), just outside window; did not sign the statement
44	- James Bessen (BU TPRI) — no new publications found
45	- Jed Kolko (PIIE) — no new publications found
46	- Daniel Rock (Wharton) — no new publications found
47	- Alexander Bick (Fed Reserve St. Louis) — no new publications found
48	- Andrea Eisfeldt (UCLA Anderson) — no new publications found
49	- Shakked Noy (MIT FutureTech) — no new publications found
50	
51	---
52	
53	## New Sources
54	
55	---
56	
57	### "We Must Act Now: A Statement on AI's Transformation of the Economy"
58	
59	- **Publisher:** Stanford University Digital Economy Lab (organized by Erik Brynjolfsson, Ajay Agrawal, Anton Korinek, Tom Cunningham)
60	- **Date:** 2026-07-13
61	- **URL:** https://www.wemustactnow.ai
62	- **Evidence Tier:** 2 (Academic coalition — 200+ signatories including 16 Nobel laureates, industry leaders from OpenAI, Google, Anthropic)
63	- **Source ID:** stanford-del-joint-statement-2026
64	
65	**Note on statistics:** The statement itself is a 3-point qualitative document with no embedded quantitative claims. Quantitative statistics cited in the same-day coverage originate from Brynjolfsson's ADP/Stanford Digital Economy Lab Canaries Dashboard (launched June 2026, extended to April 2026 data). Those statistics are attributed to the Fortune July 13 article below. The statement's primary significance is institutional: former AI-displacement skeptics (Acemoglu, Johnson) are now calling for urgent action — a meaningful shift in the expert consensus baseline.
66	
67	**Statement text (verbatim, full):**
68	> "AI may become radically more powerful over the next 10 years. This could drive an unprecedented transformation of our economy, larger than the Industrial Revolution, but unfolding over a vastly shorter time frame. It could bring risks, including large-scale job displacement, as well as opportunities such as major gains in living standards. Economists, policymakers and technology leaders must act now to understand the economics of transformative AI and to build the incentives, guardrails, and institutions needed to steer AI in a direction that complements humans and benefits society."
69	
70	**Statistics (cited in concurrent Fortune/Quartz reporting on the statement, July 13, 2026, sourced to Brynjolfsson/ADP Canaries Dashboard):**
71	
72	1. **Graph:** White-Collar/Professional Displacement (`white-collar-professional-displacement`)
73	   **Type:** OVERLAY (down)
74	   **Value:** −4 (% annual employment change for workers ages 22–25 in AI-exposed occupations, as of April 2026)
75	   **Quote:** "employment for workers ages 22 to 25 in AI-exposed occupations shrinking more than 4% annually, even as the aggregate labor market looks calm"
76	   *(Fortune, July 13, 2026 — citing Brynjolfsson/ADP Canaries Dashboard through April 2026)*
77	   **Mapping note:** This is an observed employment rate-of-change, not a % of roles displaced by 2030. Classified OVERLAY (not data_point) because the unit is annual employment change %, not lifetime displacement share. Direction is down — consistent with early displacement pressure on white-collar early-career roles.
78	
79	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
80	   **Type:** OVERLAY (down)
81	   **Value:** −4 (% annual employment change, early-career, AI-exposed occupations)
82	   **Quote:** "I still see a big gap there, a big mismatch, and I'm kind of worried that we're not going to be ready for the tsunami that's coming"
83	   *(Erik Brynjolfsson, quoted in Quartz, July 13, 2026)*
84	   **Mapping note:** Qualitative signal from Brynjolfsson characterizing aggregate risk. Combined with the Canaries data, this is an overlay directional signal, not a data point.
85	
86	---
87	
88	### "Task-Specific Technical Change and Comparative Advantage" (NBER Working Paper 35353)
89	
90	- **Publisher:** National Bureau of Economic Research
91	- **Date:** 2026-06-22 (NBER publication); 2026-07-14 (phys.org media coverage — within digest window)
92	- **URL:** https://www.nber.org/papers/w35353 | https://phys.org/news/2026-07-skilled-workers-ai-world.html
93	- **Evidence Tier:** 1 (NBER working paper — peer-reviewed pipeline, government-adjacent pre-publication standard)
94	- **Source ID:** althoff-reichardt-nber-w35353-2026
95	- **Authors:** Lukas Althoff (Stanford/SIEPR), Hugo Reichardt
96	
97	**Paper abstract summary:** Using a dynamic general-equilibrium task-based model with multidimensional skills and on-the-job accumulation, the paper finds that AI's "task simplification" effect — reducing the skill requirements of specific tasks — is the key equalizing force. Lower-skill workers can access previously inaccessible jobs; wage inequality narrows across slow-to-rapid AI scenarios. Adoption costs (higher for lower-skill workers) dampen but do not eliminate the decline in inequality.
98	
99	**Statistics:**
100	
101	1. **Graph:** Median Wage Impact (`median-wage-impact`)
102	   **Type:** OVERLAY (up)
103	   **Value:** 30 (% lifetime earnings increase — midpoint of 15–45% range)
104	   **Quote:** "over a lifetime, these workers stand to earn 15% to 45% more than they would without AI's support"
105	   *(phys.org, July 14, 2026, summarizing Althoff & Reichardt NBER W35353)*
106	   **Mapping note:** "These workers" refers specifically to lower-skilled workers; not median-worker-wide. Range midpoint used as numeric value. This is a long-run GE model estimate, not a measured outcome. OVERLAY not DATA_POINT because it is a distributional sub-estimate, not a median wage forecast.
107	
108	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
109	   **Type:** OVERLAY (down)
110	   **Value:** N/A (direction only — no specific % premium reduction stated)
111	   **Quote:** "AI's workplace impact will be to narrow the wage gap between the highest and lowest earners, a gap that has been growing and that many fear will continue to worsen in an AI world"
112	   *(phys.org, July 14, 2026)*
113	   **Mapping note:** The paper predicts premium compression, not premium elimination. No specific percentage for skill-premium reduction is stated in the accessible text. Direction overlay only.
114	
115	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
116	   **Type:** OVERLAY (up)
117	   **Value:** 30 (% lifetime earnings increase — midpoint of 15–45% range, for lower-skilled workers)
118	   **Quote:** "By reducing the skills required to perform specific tasks, AI will enable lower-skilled workers to take on higher-paying roles. His estimates suggest that, over a lifetime, these workers stand to earn 15% to 45% more than they would without AI's support."
119	   *(phys.org, July 14, 2026)*
120	   **Mapping note:** "Lower-skilled workers" as the relevant cohort overlaps substantially with entry-level workers. This is a complementary overlay to the median-wage-impact mapping above, not a duplicate data point — the mechanism (task simplification enabling upskilling) is specifically entry-level relevant.
121	
122	---
123	
124	## Sources Checked but Not Relevant
125	
126	The following URLs were fetched or search results reviewed; they yielded no new quantitative AI labor statistics within the July 13–20, 2026 window:
127	
128	- https://insight.factset.com/sp-500-earnings-season-update-july-17-2026 — Q2 2026 early earnings season; no AI workforce mention counts; general EPS/revenue data only
129	- https://www.census.gov/newsroom/press-releases/2026/btos-july-2.html — routine biweekly BTOS data release; no new AI-specific narrative; substantive AI analysis last published May 2026
130	- https://www.challengergray.com/blog/challenger-report-june-layoffs-cool-to-45849-down-53-from-may-ai-leads-reasons-for-fourth-consecutive-month/ — June 2026 Challenger report released July 1 (12 days outside window); important but not within scope
131	- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Brookings adaptive capacity analysis; date not confirmed within window; described research on 26.5M high-exposure workers with adaptive capacity
132	- https://bitsjournal.researchfloor.org/generative-artificial-intelligence-exposure-and-u-s-occupational-wage-polarization-early-evidence-and-workforce-education-implications-from-2018-2025-occupational-data/ — descriptive pre-print; 2026 publication but date not confirmed within window; limited causal identification
133	- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — review article; Tier 3; no new primary data; published before window
134	- https://blog.letaido.com/ai-job-displacement-statistics — Tier 4 blog; aggregates previously published stats; no primary data
135	- https://axis-intelligence.com/ai-job-displacement-statistics/ — Tier 4 market intelligence; aggregates Goldman/Stanford/WEF stats; no primary data
136	- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN/2026/001 "Bridging Skill Gaps"; published January 2026; outside window
137	- https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html — PwC Barometer; released June 15, 2026; outside window
138	- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed note published April 3, 2026; outside window
139	
140	---
141	
142	## Priority Recommendations
143	
144	### Tier 1 sources requiring immediate attention
145	1. **NBER W35353 (Althoff & Reichardt)** — Ingest as a DATA_POINT overlaid on `median-wage-impact` and `entry-level-wage-impact`. This is the only new Tier 1 source with quantitative statistics in the window. Caveat: results are long-run GE model estimates, not near-term forecasts; label accordingly.
146	
147	### Divergences from current consensus
148	2. **Althoff/Reichardt wage result contradicts bearish consensus on entry-level wages.** Most sources in the current graph ecosystem show downward pressure on entry-level wages and employment. NBER W35353 argues for the opposite long-run direction (15–45% lifetime earnings increase for lower-skilled workers via task simplification). This is a significant methodological divergence worth surfacing as a "contrarian overlay" in the graph commentary.
149	
150	3. **Brynjolfsson Canaries Dashboard >4% annual employment decline (ages 22–25, AI-exposed occupations)** — Updated to April 2026 data. This is the strongest near-real-time signal of early-career displacement and should be overlaid on `white-collar-professional-displacement` and `overall-us-displacement`. It has been growing by ~0.5 percentage points per month and has not mean-reverted since late 2022.
151	
152	### New government data releases / near-term tracking
153	4. **Census BTOS** — A July 16, 2026 biweekly release may exist but was not confirmed at time of digest. Recommend checking https://www.census.gov/newsroom/press-releases/2026/btos-july-16.html or equivalent. If confirmed, verify whether new AI-specific supplemental data is included (the Nov 2025–Feb 2026 AI supplement concluded; any new supplement would require a new announcement).
154	
155	5. **Challenger Gray & Christmas July 2026 report** — Not yet released. Expected first week of August 2026 (covering July cuts). Given AI led reasons for 4th consecutive month in June (23% YTD, 101,743 cuts), this report is high-priority for `earnings-call-ai-mentions` (signal) and `tech-sector-displacement` (overlay).
156	
157	6. **FactSet Earnings Insight full weekly PDF** — The July 17 online summary does not include AI mention counts. Recommend fetching the full Earnings Insight PDF at https://insight.factset.com/topic/earnings once the PDF is posted (typically mid-week), as it typically tracks % of S&P 500 companies mentioning AI in earnings calls — directly relevant to the `earnings-call-ai-mentions` graph.
158	
159	### Institutional significance
160	7. **"We Must Act Now" signatory list as a consensus-shift signal** — The co-signing of this statement by Daron Acemoglu (who previously called AI productivity hype "brainless") and Simon Johnson represents a meaningful shift in the expert baseline from "wait and see" toward "act now." While qualitative, this shifts the prior distribution on `overall-us-displacement` toward higher near-term effects. Recommend flagging this in the graph contextual notes.
161	
162	---
163	
164	*Digest compiled: 2026-07-20 | Sources searched: 8 targeted queries + recursive fetches | Watchlist sweep: 15 researchers checked | Recurring series sweep: 1 series checked*
# AI Labor Research Digest — 2026-07-20

## Summary

The week of July 13–20, 2026 was dominated by a single landmark event: the release of **"We Must Act Now: A Statement on AI's Transformation of the Economy"** (July 13), a joint open letter organized by Stanford's Digital Economy Lab and signed by 200+ economists and researchers, including 16 Nobel laureates and 9 watchlist researchers. The statement warns that AI could produce economic disruption exceeding the Industrial Revolution on a vastly compressed timeline and calls for urgent institutional action. Concurrent Fortune and Quartz reporting on the statement cited the Brynjolfsson/ADP Canaries Dashboard (data through April 2026), showing employment for workers aged 22–25 in AI-exposed occupations contracting more than 4% annually — a persistent signal that has grown by roughly half a percentage point per month since late 2022. The second significant source within the window is media coverage (phys.org, July 14) of NBER Working Paper 35353 by Althoff & Reichardt (Stanford/SIEPR), published June 22, finding that AI's task-simplification effect could raise lower-skilled workers' lifetime earnings by 15–45%. No Tier 1 government statistical releases (BLS, Census BTOS) with new AI-specific labor content were confirmed within the 7-day window; the Census BTOS July 2 biweekly release carried no new substantive AI narrative beyond the May 2026 data story.

---

## Recurring Series Status

**Registry sweep (asOf 2026-07-20):**

| Series ID | Next Expected | Status |
|---|---|---|
| `ellucian-highered-ai` | 2027-03-01 | **Not due** — last ingested 2026-03-04 (3rd Annual Edition); next release expected March 2027 |

*Note: Census BTOS, Challenger Gray & Christmas, FactSet Earnings Insight, and PwC Barometer are tracked informally but are not yet in recurring-sources.json. Status for context:*
- **Census BTOS** — July 2, 2026 biweekly release confirmed; most recent AI-specific analysis covers data through May 3, 2026. No new AI narrative this week. Next biweekly release expected ~July 16 (not confirmed as of this digest).
- **Challenger Gray & Christmas** — June 2026 report released July 1 (just outside window): AI cited in 101,743 cuts YTD (23% of all cuts), leading reason for 4th consecutive month.
- **FactSet Earnings Insight** — July 17 Earnings Season Update published (within window); covers early Q2 2026 earnings season (10% reported). No AI workforce mention statistics extracted — this update focuses on aggregate EPS/revenue, not AI-mention language.
- **PwC AI Jobs Barometer 2026** — released June 15, 2026 (outside window).

---

## Watchlist Researcher Check

*All 15 researchers last checked 2026-04-14 (97 days ago — exceeds 30-day threshold). Sweep conducted 2026-07-20.*

**Researchers with new activity this week:**

| Researcher | Affiliation | Activity |
|---|---|---|
| Daron Acemoglu | MIT | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| Erik Brynjolfsson | Stanford DEL | Co-organized "We Must Act Now" (July 13, 2026); Canaries Dashboard extended to April 2026 data **WATCHLIST** |
| Pascual Restrepo | Yale | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| Maria del Rio-Chanona | UCL/ILO | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| Alex Imas | Chicago Booth | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| Molly Kinder | Breakwater Initiative | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| David Deming | Harvard/NBER | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |
| Neil Thompson | MIT FutureTech | Signed "We Must Act Now" (July 13, 2026) **WATCHLIST** |

**Researchers with no new publications found in last 7 days:**
- Martha Gimbel (Yale Budget Lab) — published July 9 op-ed ("The US Economy Is Walking a Tightrope Between Aging and AI"), just outside window; did not sign the statement
- James Bessen (BU TPRI) — no new publications found
- Jed Kolko (PIIE) — no new publications found
- Daniel Rock (Wharton) — no new publications found
- Alexander Bick (Fed Reserve St. Louis) — no new publications found
- Andrea Eisfeldt (UCLA Anderson) — no new publications found
- Shakked Noy (MIT FutureTech) — no new publications found

---

## New Sources

---

### "We Must Act Now: A Statement on AI's Transformation of the Economy"

- **Publisher:** Stanford University Digital Economy Lab (organized by Erik Brynjolfsson, Ajay Agrawal, Anton Korinek, Tom Cunningham)
- **Date:** 2026-07-13
- **URL:** https://www.wemustactnow.ai
- **Evidence Tier:** 2 (Academic coalition — 200+ signatories including 16 Nobel laureates, industry leaders from OpenAI, Google, Anthropic)
- **Source ID:** stanford-del-joint-statement-2026

**Note on statistics:** The statement itself is a 3-point qualitative document with no embedded quantitative claims. Quantitative statistics cited in the same-day coverage originate from Brynjolfsson's ADP/Stanford Digital Economy Lab Canaries Dashboard (launched June 2026, extended to April 2026 data). Those statistics are attributed to the Fortune July 13 article below. The statement's primary significance is institutional: former AI-displacement skeptics (Acemoglu, Johnson) are now calling for urgent action — a meaningful shift in the expert consensus baseline.

**Statement text (verbatim, full):**
> "AI may become radically more powerful over the next 10 years. This could drive an unprecedented transformation of our economy, larger than the Industrial Revolution, but unfolding over a vastly shorter time frame. It could bring risks, including large-scale job displacement, as well as opportunities such as major gains in living standards. Economists, policymakers and technology leaders must act now to understand the economics of transformative AI and to build the incentives, guardrails, and institutions needed to steer AI in a direction that complements humans and benefits society."

**Statistics (cited in concurrent Fortune/Quartz reporting on the statement, July 13, 2026, sourced to Brynjolfsson/ADP Canaries Dashboard):**

1. **Graph:** White-Collar/Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −4 (% annual employment change for workers ages 22–25 in AI-exposed occupations, as of April 2026)
   **Quote:** "employment for workers ages 22 to 25 in AI-exposed occupations shrinking more than 4% annually, even as the aggregate labor market looks calm"
   *(Fortune, July 13, 2026 — citing Brynjolfsson/ADP Canaries Dashboard through April 2026)*
   **Mapping note:** This is an observed employment rate-of-change, not a % of roles displaced by 2030. Classified OVERLAY (not data_point) because the unit is annual employment change %, not lifetime displacement share. Direction is down — consistent with early displacement pressure on white-collar early-career roles.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −4 (% annual employment change, early-career, AI-exposed occupations)
   **Quote:** "I still see a big gap there, a big mismatch, and I'm kind of worried that we're not going to be ready for the tsunami that's coming"
   *(Erik Brynjolfsson, quoted in Quartz, July 13, 2026)*
   **Mapping note:** Qualitative signal from Brynjolfsson characterizing aggregate risk. Combined with the Canaries data, this is an overlay directional signal, not a data point.

---

### "Task-Specific Technical Change and Comparative Advantage" (NBER Working Paper 35353)

- **Publisher:** National Bureau of Economic Research
- **Date:** 2026-06-22 (NBER publication); 2026-07-14 (phys.org media coverage — within digest window)
- **URL:** https://www.nber.org/papers/w35353 | https://phys.org/news/2026-07-skilled-workers-ai-world.html
- **Evidence Tier:** 1 (NBER working paper — peer-reviewed pipeline, government-adjacent pre-publication standard)
- **Source ID:** althoff-reichardt-nber-w35353-2026
- **Authors:** Lukas Althoff (Stanford/SIEPR), Hugo Reichardt

**Paper abstract summary:** Using a dynamic general-equilibrium task-based model with multidimensional skills and on-the-job accumulation, the paper finds that AI's "task simplification" effect — reducing the skill requirements of specific tasks — is the key equalizing force. Lower-skill workers can access previously inaccessible jobs; wage inequality narrows across slow-to-rapid AI scenarios. Adoption costs (higher for lower-skill workers) dampen but do not eliminate the decline in inequality.

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 30 (% lifetime earnings increase — midpoint of 15–45% range)
   **Quote:** "over a lifetime, these workers stand to earn 15% to 45% more than they would without AI's support"
   *(phys.org, July 14, 2026, summarizing Althoff & Reichardt NBER W35353)*
   **Mapping note:** "These workers" refers specifically to lower-skilled workers; not median-worker-wide. Range midpoint used as numeric value. This is a long-run GE model estimate, not a measured outcome. OVERLAY not DATA_POINT because it is a distributional sub-estimate, not a median wage forecast.

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (down)
   **Value:** N/A (direction only — no specific % premium reduction stated)
   **Quote:** "AI's workplace impact will be to narrow the wage gap between the highest and lowest earners, a gap that has been growing and that many fear will continue to worsen in an AI world"
   *(phys.org, July 14, 2026)*
   **Mapping note:** The paper predicts premium compression, not premium elimination. No specific percentage for skill-premium reduction is stated in the accessible text. Direction overlay only.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 30 (% lifetime earnings increase — midpoint of 15–45% range, for lower-skilled workers)
   **Quote:** "By reducing the skills required to perform specific tasks, AI will enable lower-skilled workers to take on higher-paying roles. His estimates suggest that, over a lifetime, these workers stand to earn 15% to 45% more than they would without AI's support."
   *(phys.org, July 14, 2026)*
   **Mapping note:** "Lower-skilled workers" as the relevant cohort overlaps substantially with entry-level workers. This is a complementary overlay to the median-wage-impact mapping above, not a duplicate data point — the mechanism (task simplification enabling upskilling) is specifically entry-level relevant.

---

## Sources Checked but Not Relevant

The following URLs were fetched or search results reviewed; they yielded no new quantitative AI labor statistics within the July 13–20, 2026 window:

- https://insight.factset.com/sp-500-earnings-season-update-july-17-2026 — Q2 2026 early earnings season; no AI workforce mention counts; general EPS/revenue data only
- https://www.census.gov/newsroom/press-releases/2026/btos-july-2.html — routine biweekly BTOS data release; no new AI-specific narrative; substantive AI analysis last published May 2026
- https://www.challengergray.com/blog/challenger-report-june-layoffs-cool-to-45849-down-53-from-may-ai-leads-reasons-for-fourth-consecutive-month/ — June 2026 Challenger report released July 1 (12 days outside window); important but not within scope
- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Brookings adaptive capacity analysis; date not confirmed within window; described research on 26.5M high-exposure workers with adaptive capacity
- https://bitsjournal.researchfloor.org/generative-artificial-intelligence-exposure-and-u-s-occupational-wage-polarization-early-evidence-and-workforce-education-implications-from-2018-2025-occupational-data/ — descriptive pre-print; 2026 publication but date not confirmed within window; limited causal identification
- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — review article; Tier 3; no new primary data; published before window
- https://blog.letaido.com/ai-job-displacement-statistics — Tier 4 blog; aggregates previously published stats; no primary data
- https://axis-intelligence.com/ai-job-displacement-statistics/ — Tier 4 market intelligence; aggregates Goldman/Stanford/WEF stats; no primary data
- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN/2026/001 "Bridging Skill Gaps"; published January 2026; outside window
- https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html — PwC Barometer; released June 15, 2026; outside window
- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed note published April 3, 2026; outside window

---

## Priority Recommendations

### Tier 1 sources requiring immediate attention
1. **NBER W35353 (Althoff & Reichardt)** — Ingest as a DATA_POINT overlaid on `median-wage-impact` and `entry-level-wage-impact`. This is the only new Tier 1 source with quantitative statistics in the window. Caveat: results are long-run GE model estimates, not near-term forecasts; label accordingly.

### Divergences from current consensus
2. **Althoff/Reichardt wage result contradicts bearish consensus on entry-level wages.** Most sources in the current graph ecosystem show downward pressure on entry-level wages and employment. NBER W35353 argues for the opposite long-run direction (15–45% lifetime earnings increase for lower-skilled workers via task simplification). This is a significant methodological divergence worth surfacing as a "contrarian overlay" in the graph commentary.

3. **Brynjolfsson Canaries Dashboard >4% annual employment decline (ages 22–25, AI-exposed occupations)** — Updated to April 2026 data. This is the strongest near-real-time signal of early-career displacement and should be overlaid on `white-collar-professional-displacement` and `overall-us-displacement`. It has been growing by ~0.5 percentage points per month and has not mean-reverted since late 2022.

### New government data releases / near-term tracking
4. **Census BTOS** — A July 16, 2026 biweekly release may exist but was not confirmed at time of digest. Recommend checking https://www.census.gov/newsroom/press-releases/2026/btos-july-16.html or equivalent. If confirmed, verify whether new AI-specific supplemental data is included (the Nov 2025–Feb 2026 AI supplement concluded; any new supplement would require a new announcement).

5. **Challenger Gray & Christmas July 2026 report** — Not yet released. Expected first week of August 2026 (covering July cuts). Given AI led reasons for 4th consecutive month in June (23% YTD, 101,743 cuts), this report is high-priority for `earnings-call-ai-mentions` (signal) and `tech-sector-displacement` (overlay).

6. **FactSet Earnings Insight full weekly PDF** — The July 17 online summary does not include AI mention counts. Recommend fetching the full Earnings Insight PDF at https://insight.factset.com/topic/earnings once the PDF is posted (typically mid-week), as it typically tracks % of S&P 500 companies mentioning AI in earnings calls — directly relevant to the `earnings-call-ai-mentions` graph.

### Institutional significance
7. **"We Must Act Now" signatory list as a consensus-shift signal** — The co-signing of this statement by Daron Acemoglu (who previously called AI productivity hype "brainless") and Simon Johnson represents a meaningful shift in the expert baseline from "wait and see" toward "act now." While qualitative, this shifts the prior distribution on `overall-us-displacement` toward higher near-term effects. Recommend flagging this in the graph contextual notes.

---

*Digest compiled: 2026-07-20 | Sources searched: 8 targeted queries + recursive fetches | Watchlist sweep: 15 researchers checked | Recurring series sweep: 1 series checked*