# Research Brief: Hero Stats & Prediction Graph Update Sweep (Jan-Apr 2026)

**Date:** 2026-04-13
**Mode:** Interactive
**Sources reviewed:** 22
**Sources recommended (RRS >= 6):** 14
**Sources borderline (RRS 4-5):** 4
**Search strategies used:** 12

---

## Executive Summary

The Jan-Apr 2026 research sweep surfaces several findings that should update jobsdata.ai. The "~0% measured job loss" hero stat is under pressure: Goldman Sachs now estimates ~25,000 AI-displaced jobs/month (net ~16,000 after augmentation offsets), and the Dallas Fed documents a 1% employment decline across the top 10% of AI-exposed industries. Entry-level workers are the clearest canary: Brynjolfsson's Stanford work shows 13-20% employment declines for workers aged 22-25 in AI-exposed roles. However, aggregate economy-wide displacement remains small--Yale Budget Lab's CPS monitoring through Dec 2025 still shows no meaningful economy-wide shift. On productivity, the ~21% median holds: Stanford HAI 2026 reports 14% (customer service) to 26% (software dev), consistent with prior ranges. AI adoption among firms hit ~18% (BTOS, broadened definition) with the Fed noting 78% of the labor force works at firms that have adopted AI. S&P 500 AI earnings call mentions hit a record 68%.

**Key update candidates:**
- Hero stat "~0% measured job loss" may need nuancing given Goldman's 16K net/month estimate
- `ai-adoption-rate` graph: BTOS broadened to ~18% (up from ~10% production-only)
- `genai-work-adoption`: 41% work-related GenAI adoption (Fed RPS), 26% weekly use (Gallup)
- `earnings-call-ai-mentions`: 68% of S&P 500 in Q4 2025 (record high)
- `entry-level-wage-impact`: Strong new evidence of 13-20% employment declines for young workers
- `customer-service-automation`: Gartner projects 80% of routine interactions automated by 2026

---

## Key Findings

1. **Goldman Sachs (Apr 2026):** AI is displacing ~25,000 jobs/month, with ~9,000 created through augmentation, netting ~16,000 lost jobs/month. 6-7% of workers projected displaced over the 10-year adoption timeline. Maps to `total-us-jobs-lost`, `overall-us-displacement`.

2. **Federal Reserve FEDS Notes (Apr 3, 2026):** AI adoption at ~18% of firms (BTOS), but 78% of the labor force works at AI-adopting firms (employment-weighted). Work-related GenAI adoption at 41% (RPS). Maps to `ai-adoption-rate`, `genai-work-adoption`.

3. **Stanford HAI AI Index 2026 (Apr 2026):** Software developer employment for ages 22-25 fell ~20% since 2022. AI boosting productivity 14% in customer service, 26% in software development. GenAI consumer value at $172B annually. Maps to `tech-sector-displacement`, `entry-level-wage-impact`.

4. **FactSet/S&P 500 Earnings (Mar 2026):** 68% of S&P 500 (331/485) cited AI on Q4 2025 calls--record high. IT at 94%, Financials at 91%. Maps to `earnings-call-ai-mentions`.

5. **Brynjolfsson/Stanford Digital Economy Lab (Aug 2025, updated):** 13% relative decline in employment for early-career workers in most AI-exposed jobs. For ages 22-25 in software: ~20% decline. Older workers (30+) in same roles grew 6-12%. Maps to `entry-level-wage-impact`, `tech-sector-displacement`.

6. **Dallas Fed (Feb 24, 2026):** In top 10% of AI-exposed industries, employment down 1%, wages up 8.5%. Computer systems design: employment -5%, wages +16.7%. Maps to `median-wage-impact`, `high-skill-wage-premium`, `overall-us-displacement`.

7. **Yale Budget Lab (Feb 2026, Nov/Dec CPS update):** No meaningful economy-wide shift in occupational or industry dissimilarity measures. AI displacement remains within historical ranges. Confirms "~0% measured job loss" at aggregate level. Maps to `overall-us-displacement`.

8. **NBER WP 34836 - Firm Data on AI (Feb 2026):** 69% of firms use AI; 90% report no impact on employment or productivity over last 3 years. Executives predict: productivity +1.4%, output +0.8%, employment -0.7% over next 3 years. Maps to `overall-us-displacement`, `ai-adoption-rate`.

9. **BLS Employment Situation (Apr 4, 2026, for March data):** Nonfarm payrolls +178K (above 60K expected). Unemployment 4.3%. Financial activities -15K. Government -8K. Healthcare +76K. Maps to overall labor market context.

10. **BLS Productivity (Mar 2026, Q4 2025 revised):** Nonfarm productivity +1.8% (Q4 2025 SAAR), +2.5% YoY, +2.1% annual 2025. Maps to `median-wage-impact` (productivity-wage relationship).

11. **Gartner (Feb 2026):** 91% of customer service leaders under pressure to implement AI. Projects 80% of routine interactions automated by 2026; one in 10 agent interactions automated in 2026. By 2029: 80% of common issues resolved autonomously. Maps to `customer-service-automation`.

12. **Gallup (Jan-Feb 2026):** 26% of employed adults use AI at least a few times/week. 13% daily (up from 10% in 2024). Tech/finance workers far more likely to use daily. Maps to `genai-work-adoption`.

13. **Anthropic Economic Index (Mar 2026):** Theoretical AI coverage exceeds 80% in computer/math, business/finance (94.3%), management (91.3%), office admin (90%), legal (89%). Actual adoption far below theoretical. "Suggestive evidence" of slowed hiring for ages 22-25 in exposed occupations. Maps to `workforce-ai-exposure`, `white-collar-professional-displacement`.

14. **PwC Global AI Jobs Barometer (2025):** AI-skilled jobs command 56% wage premium (up from 25% prior year). Productivity growth 4x higher in AI-exposed sectors. Jobs growing even in most automatable roles. Maps to `high-skill-wage-premium`.

---

## Recommended Sources (RRS >= 6)

### [1] Goldman Sachs: AI Job Displacement Research — Goldman Sachs, Apr 2026
- **URL:** https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-us-labor-market
- **Tier:** 2
- **RRS:** 9 (quality 3 + recency 2 + quant 2 + relevance 2)
- **Stats:** ~25K jobs displaced/month; ~9K created via augmentation; net ~16K/month. 6-7% displaced over 10yr. 10pp earnings scarring 10yrs post-displacement.
- **Maps to:** `total-us-jobs-lost`, `overall-us-displacement`, `entry-level-wage-impact`
- **Why:** First credible estimate of monthly net AI displacement with specific numbers. Directly challenges "~0% measured job loss" hero stat.

### [2] Federal Reserve FEDS Notes: Monitoring AI Adoption — Fed Board, Apr 3, 2026
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
- **Tier:** 1
- **RRS:** 9 (quality 4 + recency 2 + quant 2 + relevance 1)
- **Stats:** 18% firm adoption (BTOS); 78% employment-weighted (SBU); 41% work-related GenAI (RPS); 54% LLM adoption (employment-weighted); 12% daily use; professional services 33% adoption, finance 30%.
- **Maps to:** `ai-adoption-rate`, `genai-work-adoption`
- **Why:** Definitive government synthesis of all major AI adoption surveys. Gold standard for adoption graph updates.

### [3] Stanford HAI AI Index 2026 — Stanford, Apr 2026
- **URL:** https://hai.stanford.edu/ai-index/2026-ai-index-report
- **Tier:** 1
- **RRS:** 9 (quality 4 + recency 2 + quant 2 + relevance 1)
- **Stats:** Software dev employment for 22-25 down ~20%. Productivity: +14% customer service, +26% software dev. GenAI consumer value $172B/yr. 88% organizational adoption. 53% population adoption within 3 years.
- **Maps to:** `tech-sector-displacement`, `entry-level-wage-impact`, `genai-work-adoption`
- **Why:** Annual benchmark report with broad coverage of economy chapter. Multiple graph-mappable stats.

### [4] FactSet: S&P 500 AI Earnings Mentions Q4 2025 — FactSet, Mar 2026
- **URL:** https://insight.factset.com/more-than-65-of-sp-500-earnings-calls-for-q4-cited-ai
- **Tier:** 2
- **RRS:** 8 (quality 3 + recency 2 + quant 2 + relevance 1)
- **Stats:** 68% (331/485) cited AI in Q4--record. IT 94%, Financials 91%, Comms 89%. Financials +13 QoQ. 5yr avg 149, 10yr avg 94.
- **Maps to:** `earnings-call-ai-mentions`
- **Why:** Direct data point for the earnings call graph. Q4 2025 is latest complete quarter.

### [5] Brynjolfsson/Stanford: Canaries in the Coal Mine — Stanford DEL, Aug 2025
- **URL:** https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf
- **Tier:** 1
- **RRS:** 8 (quality 4 + recency 1 + quant 2 + relevance 1)
- **Stats:** 13% relative employment decline for early-career AI-exposed workers. 20% decline for software devs 22-25. Workers 30+ grew 6-12% in same roles. 16% relative decline controlling for firm-level shocks.
- **Maps to:** `entry-level-wage-impact`, `tech-sector-displacement`, `overall-us-displacement`
- **Why:** Foundational empirical study on entry-level displacement. Uses ADP payroll microdata.

### [6] Dallas Fed: AI Aiding and Replacing Workers — Dallas Fed, Feb 24, 2026
- **URL:** https://www.dallasfed.org/research/economics/2026/0224
- **Tier:** 1
- **RRS:** 8 (quality 4 + recency 2 + quant 2 + relevance 0)
- **Stats:** Top 10% AI-exposed industries: employment -1%, wages +8.5%. Computer systems design: employment -5%, wages +16.7%. National nominal weekly wages +7.5% since fall 2022.
- **Maps to:** `median-wage-impact`, `high-skill-wage-premium`
- **Why:** Federal Reserve regional research with granular industry-level wage and employment data. Shows divergence pattern.

### [7] Yale Budget Lab: Nov/Dec CPS Update — Yale, Feb 2026
- **URL:** https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-novemberdecember-cps-update
- **Tier:** 1
- **RRS:** 7 (quality 4 + recency 1 + quant 1 + relevance 1)
- **Stats:** Occupational/industry dissimilarity metrics remain flat through Dec 2025. No meaningful aggregate shift. All metrics within historical ranges.
- **Maps to:** `overall-us-displacement`
- **Why:** Ongoing CPS monitoring series. Key input to "~0% measured job loss" hero stat. Confirms aggregate stability even as pockets of displacement emerge.

### [8] NBER WP 34836: Firm Data on AI — NBER, Feb 2026
- **URL:** https://www.nber.org/papers/w34836
- **Tier:** 1
- **RRS:** 8 (quality 4 + recency 2 + quant 2 + relevance 0)
- **Stats:** 69% of firms use AI. 90% report no employment/productivity impact (last 3yr). Expected: productivity +1.4%, output +0.8%, employment -0.7% (next 3yr). Exec usage: 1.5 hrs/week.
- **Maps to:** `ai-adoption-rate`, `overall-us-displacement`
- **Why:** Large-scale multi-country executive survey. The 90% "no impact yet" finding is striking and important for calibrating displacement timelines.

### [9] Anthropic Economic Index — Anthropic, Mar 2026
- **URL:** https://www.anthropic.com/research/labor-market-impacts
- **Tier:** 2
- **RRS:** 7 (quality 3 + recency 2 + quant 1 + relevance 1)
- **Stats:** Theoretical AI coverage: computer/math & business/finance 94.3%, management 91.3%, office/admin 90%, legal 89%, architecture/engineering 84.8%, arts/media 83.7%. Actual usage far below theoretical.
- **Maps to:** `workforce-ai-exposure`, `white-collar-professional-displacement`
- **Why:** Novel "observed vs. theoretical exposure" framework. Based on actual Claude usage data. Directly maps to exposure graph.

### [10] BLS Employment Situation — BLS, Apr 4, 2026 (March data)
- **URL:** https://www.bls.gov/news.release/empsit.nr0.htm
- **Tier:** 1
- **RRS:** 7 (quality 4 + recency 2 + quant 2 + relevance -1)
- **Stats:** +178K nonfarm payrolls (vs 60K expected). Unemployment 4.3%. Financial activities -15K. Feb revised to -133K. Healthcare +76K.
- **Maps to:** General labor context, `overall-us-displacement`
- **Why:** Monthly benchmark. The Feb -133K revision and Mar beat provide labor market backdrop.

### [11] BLS Productivity Q4 2025 — BLS, Mar 2026
- **URL:** https://www.bls.gov/news.release/prod2.nr0.htm
- **Tier:** 1
- **RRS:** 7 (quality 4 + recency 2 + quant 2 + relevance -1)
- **Stats:** Nonfarm productivity +1.8% Q4 SAAR, +2.5% YoY, +2.1% annual 2025. Manufacturing productivity -2.5% Q4 but +2.0% annual (largest since 2010).
- **Maps to:** `median-wage-impact` (productivity-wage channel)
- **Why:** Official productivity data. 2.1% annual is healthy but does not yet show an AI-driven productivity surge.

### [12] Gallup Workplace AI Usage — Gallup, Jan-Feb 2026
- **URL:** https://news.gallup.com/poll/708224/gen-adoption-steady-skepticism-climbs.aspx
- **Tier:** 2
- **RRS:** 7 (quality 3 + recency 2 + quant 2 + relevance 0)
- **Stats:** 26% use AI at least few times/week. 13% daily (up from 10%). Tech/finance lead adoption. Only 30% of workers say manager supports AI use.
- **Maps to:** `genai-work-adoption`
- **Why:** Large-sample (23K+) workforce survey with trend data.

### [13] Gartner: Customer Service AI — Gartner, Feb-Mar 2026
- **URL:** https://www.gartner.com/en/newsroom/press-releases/2026-02-18-gartner-survey-finds-ninety-one-percent-of-customer-service-leaders-under-pressure-to-implement-ai-in-2026
- **Tier:** 2
- **RRS:** 6 (quality 3 + recency 2 + quant 1 + relevance 0)
- **Stats:** 91% of CS leaders pressured to implement AI. 1-in-10 agent interactions automated by 2026 (up from 1.6%). 80% of routine interactions expected automated 2026. $80B labor cost reduction projected.
- **Maps to:** `customer-service-automation`
- **Why:** Leading industry analyst on customer service automation trajectory.

### [14] PwC Global AI Jobs Barometer — PwC, 2025
- **URL:** https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html
- **Tier:** 2
- **RRS:** 6 (quality 3 + recency 1 + quant 2 + relevance 0)
- **Stats:** 56% wage premium for AI skills (up from 25%). 4x productivity growth in AI-exposed sectors. Jobs growing even in most automatable roles.
- **Maps to:** `high-skill-wage-premium`
- **Why:** Large-scale wage premium data across 15 countries. The 56% premium is a strong data point.

---

## Borderline Sources (RRS 4-5)

### [15] Upwork Q4 2025 Earnings — Upwork, Feb 2026
- **URL:** https://investors.upwork.com/news-releases/news-release-details/upwork-reports-fourth-quarter-and-full-year-2025-financial
- **RRS:** 5 (quality 2 + recency 2 + quant 1 + relevance 0)
- **Notes:** Revenue +4% YoY to $198.4M. AI-related GSV >$300M annualized, up 50%. Active clients 785K. Relevant to `freelancer-rate-impact` but doesn't directly report freelancer rate changes.

### [16] BLS Employment Projections 2024-2034 — BLS, 2026
- **URL:** https://www.bls.gov/opub/mlr/2026/article/industry-and-occupational-employment-projections-overview.htm
- **RRS:** 5 (quality 4 + recency 1 + quant 1 + relevance -1)
- **Notes:** Total employment +3.1% over decade. Software devs +17.9%. Retail trade -1.2%. AI impact on specific occupations noted but projections assume historical pace of tech change.

### [17] IMF: New Jobs Creation in the AI Age — IMF, Jan 2026
- **URL:** https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf
- **RRS:** 5 (quality 3 + recency 2 + quant 1 + relevance -1)
- **Notes:** 40% of global jobs exposed. 170M new jobs possible by 2030, 92M could disappear. Broader global framing, less specific to US graph updates.

### [18] Brookings: Research in the First Inning — Brookings, 2026
- **URL:** https://www.brookings.edu/articles/research-on-ai-and-the-labor-market-is-still-in-the-first-inning/
- **RRS:** 4 (quality 3 + recency 1 + quant 0 + relevance 0)
- **Notes:** Meta-analysis framing piece. <5% workers switched jobs 33 months post-ChatGPT. Qualitative synthesis, limited new quantitative data.

---

## Reviewed But Excluded

- **Acemoglu TFP estimates** — RRS 3. No new 2026 update to the 0.53-0.66% TFP estimate. Original paper still the reference.
- **Adobe State of Creativity** — RRS 2. 77% of creatives use GenAI, but no displacement or rate data.
- **Various Medium/Substack freelancer rate articles** — RRS 1-2. No primary data, aggregation of secondary sources.
- **UNCTAD creative industry report** — RRS 3. Global scope, limited quantitative US data.
- **BLS JOLTS Feb 2026** — RRS 3. 6.9M job openings. No AI-specific breakout. General context only.

---

## Gaps and Follow-Up

1. **Yale Budget Lab 2026 CPS updates:** The Nov/Dec update is latest available. Check for Jan/Feb/Mar 2026 updates--these would be the most important source for validating or challenging the "~0% measured job loss" stat.

2. **Census BTOS 2026 waves:** March 2026 data releases referenced but specific new AI adoption percentages not yet published in the press releases I could access. The broadened definition (~18%) needs to be tracked as a break in the series.

3. **Freelancer rate data:** Still weak. Upwork earnings show platform-level revenue, not freelancer rate changes. Fiverr has not yet reported Q4 2025. A direct freelancer rate impact dataset remains a gap.

4. **Acemoglu update:** No new 2026 paper found. The 0.53-0.66% TFP estimate remains the reference. Watch for any response to Goldman's more optimistic estimates.

5. **Education sector displacement:** No strong new quantitative source found for 2026. This graph remains data-sparse.

6. **Financial services displacement:** Dallas Fed shows -5% in computer systems design (not financial services specifically). Need sector-specific data.

7. **Q1 2026 earnings call data:** Not yet available. Q4 2025 (68%) is the latest. Q1 2026 should be available by July.

8. **BLS Q1 2026 productivity:** Releases May 7. Will be important for tracking whether AI is showing up in aggregate productivity data.

9. **Stanford HAI full economy chapter:** The AI Index 2026 full PDF likely contains more granular statistics than the summary pages I accessed. Manual retrieval recommended.

10. **Goldman Sachs methodology:** The "16K net jobs/month" figure needs scrutiny--how are they measuring this? Is it model-based or observed? Fortune reporting suggests model-based estimates.

---

## Suggested Hero Stat Updates

| Current Stat | Suggested Update | Rationale |
|---|---|---|
| ~21% productivity boost | Hold at ~21% | Stanford HAI 2026 reports 14-26% range. Median of studies unchanged. |
| ~1% projected job loss | Consider revising to ~1-2% | Goldman's 6-7% over 10yr (~0.6-0.7%/yr) + NBER exec expectations of -0.7% over 3yr both suggest modest upward pressure. |
| ~0% measured job loss | Add nuance | Aggregate CPS: still ~0%. But Dallas Fed shows -1% in top AI-exposed industries, Goldman estimates -16K net/month. "~0% aggregate, concentrated pockets emerging" may be more accurate. |
