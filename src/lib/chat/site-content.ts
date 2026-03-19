/**
 * Static site content for chatbot grounding.
 *
 * Extracted from page components so the chatbot can answer questions
 * about methodology, the J-curve, history, signals, and prediction context
 * without needing to parse JSX at runtime.
 */

/** Per-prediction context templates (mirrors PredictionDetailClient CONTEXT_MAP) */
export const PREDICTION_CONTEXT: Record<string, (v: number) => string> = {
  "overall-us-displacement": (v) =>
    `This means roughly ${v}% of all US jobs are projected to be eliminated or fundamentally restructured by AI and automation by 2030. "Net displacement" accounts for both jobs lost and the fact that some affected roles are restructured rather than fully eliminated. For context, 1% of the US labor force is about 1.69 million workers.`,
  "customer-service-automation": (v) =>
    `${v}% of all customer service interactions (phone calls, chat messages, emails) are projected to be resolved entirely by AI without a human agent ever getting involved. This doesn't mean ${v}% of CS jobs disappear, since the remaining interactions may need more skilled human agents, but headcount reductions are widely expected.`,
  "tech-sector-displacement": (v) =>
    `An estimated ${v}% of tech sector roles, including software engineers, QA testers, IT support, and data analysts, face displacement from AI coding assistants, automated testing, and AI-driven operations. "Displacement" means the role ceases to exist in its current form, not that the worker is necessarily unemployed.`,
  "white-collar-professional-displacement": (v) =>
    `An estimated ${v}% of white-collar professional roles in law, accounting, and finance face displacement by 2030. LLMs can now perform contract review, financial analysis, and audit procedures at near-professional quality. The Big Four accounting firms have all announced significant restructuring plans citing AI-driven productivity. Junior and mid-level roles are most exposed, while senior advisory work remains largely protected.`,
  "creative-industry-displacement": (v) =>
    `${v}% of creative roles in design, writing, and marketing are projected to be eliminated or fundamentally restructured by generative AI. Freelance platforms like Upwork and Fiverr have already reported 20-30% declines in traditional creative gig volume. The impact is bifurcated: AI-augmented creative professionals see higher demand, while those performing routine creative tasks face steep displacement.`,
  "healthcare-admin-displacement": (v) =>
    `${v}% of healthcare administrative roles, including medical coding, billing, claims processing, scheduling, and prior authorization, are projected to be automated by AI. Healthcare administration accounts for roughly 30% of US healthcare employment and over $265B in annual costs. AI coding achieves 95% accuracy, and CMS rules now permit AI-assisted prior authorization, accelerating adoption.`,
  "education-sector-displacement": (v) =>
    `${v}% of education support roles face displacement from AI. This includes tutoring, grading, content creation, and administration, but notably not core teaching, which remains among the least automatable occupations. The collapse of companies like Chegg (subscribers down 50% due to ChatGPT) signals how quickly AI can disrupt adjacent education services even while classroom teaching persists.`,
  "high-skill-wage-premium": (v) =>
    `Workers with strong AI and machine learning skills currently earn about ${v}% more than the median worker in comparable roles. This "AI premium" reflects both scarcity of talent and the outsized productivity gains AI-skilled workers deliver. A rising premium signals that AI skills are becoming more, not less, valuable.`,
  "median-wage-impact": (v) =>
    `Real (inflation-adjusted) median wages are projected to ${v < 0 ? "fall" : "rise"} by ${Math.abs(v)}% by 2030 due to AI. This combines two offsetting forces: productivity gains (which push wages up) and displacement of mid-skill tasks (which pushes wages down). The net effect is currently estimated to be ${v < 0 ? "negative" : "positive"} for the typical worker.`,
  "freelancer-rate-impact": (v) =>
    `Average freelancer hourly rates in AI-exposed categories have ${v < 0 ? "declined" : "increased"} ${Math.abs(v)}% since the launch of ChatGPT. Writing, translation, graphic design, and data work are hardest hit. This is a critical leading indicator because freelancers feel labor market shifts 12-18 months before salaried workers. They lack the institutional buffer of employment contracts and are directly exposed to market pricing.`,
  "entry-level-wage-impact": (v) =>
    `Real wages for entry-level positions (0-2 years experience) across knowledge-work industries are projected to ${v < 0 ? "decline" : "increase"} ${Math.abs(v)}% by 2030. Entry-level workers are disproportionately affected because 35% of junior-role tasks are within current AI capability vs. 18% for senior roles. The traditional career ladder, where you learn by doing routine work, is being compressed as AI handles those learning-stage tasks.`,
  "workforce-ai-exposure": (v) =>
    `An estimated ${v}% of US jobs have significant task overlap with current AI capabilities. This is an exposure measure, not a displacement count. It describes what AI could theoretically do, not what has happened. The gap between exposure and actual displacement has been wide: while exposure estimates have risen from 25% to nearly 50%, observed macro job losses attributable to AI remain near zero. Exposure is a precondition for displacement, not a guarantee of it.`,
  "ai-adoption-rate": (v) =>
    `${v}% of US firms use AI in production according to the Census Bureau's Business Trends and Outlook Survey (BTOS), up from 3.8% in mid-2023. This is the most rigorous adoption measure available. Consultancy surveys report 5-10x higher rates (55-78%) because they sample self-selected, tech-forward companies. The Census data covers all US firms and provides the ground truth. Adoption varies dramatically by sector: information and finance lead at 20-30%, while construction and agriculture remain under 5%.`,
  "genai-work-adoption": (v) =>
    `${v}% of U.S. working-age adults (18-64) now use generative AI at work, according to the St. Louis Fed / Harvard Real-Time Population Survey, a nationally representative quarterly survey of 25,000+ adults. Overall adoption (55.9%) has outpaced both the PC and internet at comparable points post-launch. The gap between overall and work adoption is consistent with workers adopting ahead of their employers.`,
  "ai-business-formation": (v) =>
    `New firm creation in AI-compatible industries has increased an estimated ${v}% since ChatGPT's release. Marchesi & Tang (2025, Chicago Booth) provide the strongest causal evidence using a difference-in-differences design. The mechanism is reduced cost of experimentation. Solo-founder share of new startups rose from 23.7% to 36.3% (Carta). New AI-era firms survive at higher rates and grow faster.`,
  "earnings-call-ai-mentions": (v) =>
    `${v}% of S&P 500 companies now mention AI in the context of workforce, efficiency, or restructuring on their quarterly earnings calls. This is up from just 8% before ChatGPT launched in late 2022. Companies that discuss AI + workforce on calls subsequently show headcount growth 3.2 percentage points lower than non-mentioners. This metric serves as a leading indicator of corporate intent: it signals what executives are planning before the layoffs and restructuring happen.`,
};

/** About page and methodology content */
export const ABOUT_CONTENT = `# About jobsdata.ai

## Mission: Evidence Over Narrative
Society is trying to figure out what AI means for work, and the answers keep changing. This dashboard synthesizes what we actually know about AI's impact on economic opportunity: not the hype, not the doom, but the evidence. It tracks how predictions about displacement, wages, adoption, and corporate behavior evolve as new research, data, and real-world evidence emerge. The goal is to help leaders in workforce development, education, philanthropy, and policy have a more thoughtful, evidence-grounded response.

## Who Built It
Matt Zieger, Chief Program & Partnership Officer at the GitLab Foundation, where he leads the AI for Economic Opportunity Fund. Co-founder and chair of OpportunityAI.

## Methodology

### How the Headline Number Is Calculated
The large number on every prediction tile is a weighted average of all data points from the selected evidence tiers. Two factors determine each point's weight:
- Tier weight: Tier 1 = 4x, Tier 2 = 2x, Tier 3 = 1x, Tier 4 = 0.5x
- Recency: Newer sources get up to 2x the weight of the oldest
- Formula: weight = tierWeight x recencyWeight; mean = sum(value x weight) / sum(weight)
- Toggling tiers on or off recalculates instantly. The trend arrow compares first and last data points chronologically.

### Evidence Tiers
- Tier 1 (Verified Research): Peer-reviewed studies (RCTs, journal articles, NBER working papers), government statistical data (BLS, Census, OECD), and SEC filings.
- Tier 2 (Institutional Analysis): Think tanks (Brookings, McKinsey), international organizations (IMF, ILO, World Bank), working papers (arXiv, SSRN, IZA), industry research, and job posting data.
- Tier 3 (Journalism): Major outlets (WSJ, FT, Fortune, CNBC). Cited when they report original data or on-the-record disclosures.
- Tier 4 (Social & Informal): Twitter/X threads, Substack, blogs. Used sparingly for ground-level signals. Lowest weight.

### Research Pipeline
An automated pipeline queries 11 sources weekly (Semantic Scholar, OpenAlex, arXiv, Scopus, NBER, Brookings, IMF, IZA, CORE, SEC EDGAR, Adzuna Jobs), deduplicates results, links papers to predictions via keyword matching, and ranks them by a composite score (evidence tier, relevance, citation velocity, tracked author).

### Tracked Researchers (18)
Erik Brynjolfsson (Stanford), Daron Acemoglu (MIT), David Autor (MIT), Tyna Eloundou (OpenAI), Daniel Rock (Wharton), Shakked Noy (MIT), Whitney Zhang (MIT), R. Maria del Rio-Chanona (UCL/ILO), Andrea Filippetti (CNR Italy), Anna Salomons (Utrecht), Pascual Restrepo (Boston University), Carl Benedikt Frey (Oxford), Michael Osborne (Oxford), Ed Felten (Princeton), Manav Raj (Wharton), Lindsey Raymond (MIT), Bharat Chandar (Stanford), Molly Kinder (Brookings).

### Known Limitations
1. Definitional heterogeneity: Sources within a single prediction may define the metric differently. "Displacement" can mean roles eliminated, tasks automated, or jobs restructured depending on the study.
2. Trend arrows reflect source mix, not real-world change: A downward arrow may mean "newer sources estimate lower" rather than "the real-world metric is declining."
3. Point estimates from wide ranges: The headline number can mask significant disagreement. When the source range is wide (e.g., 0-12%), the range itself is often more informative than the midpoint.
4. Tier fallback: When selected evidence tiers have no matching data, the system shows the all-tier average instead.
5. Coverage gaps: English-language only, relies on keyword matching which can miss or misclassify papers. Citation data lags publication.

### Update Schedule
Research digest runs weekly (Mondays) across all 11 sources. News ticker refreshes hourly. Prediction data updates when new evidence materially changes an estimate.`;

/** J-Curve explainer content */
export const JCURVE_CONTENT = `# The Productivity J-Curve

## The Productivity Paradox
Robert Solow observed in 1987: "You can see the computer age everywhere but in the productivity statistics." This pattern, transformative technology paired with disappointing productivity, has repeated with every general-purpose technology (GPT). Electricity took ~40 years from invention to measurable productivity impact. Computers took ~25 years. AI's timeline is still unfolding.

## The J-Curve Explained
A general-purpose technology (GPT) is a technology so fundamental that it eventually reshapes entire economies, not just one industry. Examples: the steam engine, electricity, the computer, and now AI. The "J-curve" describes the pattern where measured productivity initially dips or stagnates before eventually surging. During the early phase, firms invest heavily in the new technology but haven't yet reorganized work to capture the gains. The investments show up as costs, but the benefits are delayed.

## Why It Happens: The Intangible Investment Gap
When firms adopt a GPT, the actual technology is just the beginning. The real investment is in complementary intangibles: new business processes, worker training, organizational restructuring, new data infrastructure, and management practices. These intangible investments are expensed as current costs rather than capitalized as investments, creating a two-sided measurement error: investment is overstated (appears as waste), and capital accumulation is understated (the new capabilities don't show up on balance sheets).

## Three Waves, One Pattern
Every GPT follows the same arc:
1. Invention & Experimentation: Technology exists but is expensive and unreliable
2. Infrastructure & Standards: Enabling infrastructure is built (power grids, internet backbone, cloud computing)
3. Organizational Adaptation: Firms restructure around the technology
4. Productivity Surge: Measured productivity finally catches up to capability
5. Broad Diffusion: Technology becomes invisible infrastructure

## What This Means for AI Today
We are in the early "investment phase" of AI: heavy spending, modest measured productivity gains. The J-curve framework suggests several things:
- For patience: Current productivity data likely understates AI's true impact
- For caution: The gap between investment and measurable returns is normal and expected
- For measurement: Traditional productivity metrics may miss AI's value for years
- For firms: The biggest gains will come from reorganizing work, not just adding AI to existing processes

Source: Brynjolfsson, Rock & Syverson (2021), "The Productivity J-Curve: How Intangibles Complement General Purpose Technologies"`;

/** History page ("On Tap Intelligence") content */
export const HISTORY_CONTENT = `# On Tap Intelligence: Historical Technology Comparison

## Thesis
AI is doing for cognitive capabilities what electricity did for physical power: making intelligence available "on tap" as a utility rather than a scarce, expensive resource.

## Every GPT Follows the Same Arc
Every general-purpose technology (GPT) follows a 5-phase arc: invention, infrastructure, organizational adaptation, productivity surge, and broad diffusion. The pattern is remarkably consistent: 40-70 years from invention to full economic impact for steam, electricity, and computers.

"This time might be different" counterpoint: AI may compress the timeline because it can improve itself, or extend it because cognitive work restructuring is harder than physical work restructuring. The honest answer is we don't know.

## The On-Tap Intelligence Shift
Prior waves of automation followed a clear pattern: machines replaced routine physical tasks (assembly), then routine cognitive tasks (data entry). Non-routine cognitive work (reasoning, judgment, creativity) was considered the human safe zone. AI breaks this pattern. LLMs can now perform legal analysis ($400/hour tasks at marginal cost), medical reasoning, strategic consulting, and creative work. This is unprecedented: no previous technology could perform non-routine cognitive tasks.

The analogy: Before electrification, factories needed their own power source, whether a steam engine or water wheel. Power was scarce, locationally fixed, and expensive. Electrification made power available on-demand from the grid. AI is doing the same for cognitive capability: making expertise available on-demand, at marginal cost, to anyone with internet access.

## What the Pattern Predicts
History tells us the shape of what's coming, but not the specifics. The consistent pattern:
- Jobs transform more than they disappear
- New categories of work emerge that were unimaginable before
- The transition period creates real hardship
- Institutional responses (education, policy, safety nets) determine who benefits
- The gains are real but take decades to fully materialize

## Occupational Vulnerability Snapshot (based on GPT transition patterns)
Five categories:
1. High displacement risk: Routine cognitive tasks that AI can fully automate
2. Significant restructuring: Roles where AI handles 30-60% of tasks
3. Augmentation: Roles where AI amplifies human capability
4. New creation: Roles that didn't exist before AI
5. Minimal impact: Roles requiring physical presence, dexterity, or deep human connection

## Key Lessons from History
1. Invest in Complements, Not Preservation: The Morrill Acts created land-grant universities for the industrial age. The GI Bill and community colleges for the post-war economy. Today's equivalent: AI literacy programs, retraining infrastructure, new educational pathways.
2. The Distribution Problem is Institutional: Technology creates aggregate wealth but doesn't distribute it fairly by default. Example: 40 years of wage stagnation despite massive productivity gains. Ford's Five Dollar Day showed that distribution choices are as important as technological capability.
3. The Gains Are Real, The Timeline is Not: Every GPT took 40-70 years to fully transform the economy. "Eventually" is not a policy timeline. The transition period creates real hardship that requires immediate institutional response.`;

/** Signals page content */
export const SIGNALS_CONTENT = `# Leading Indicators: Where Is AI Automation Heading?

## What This Page Measures
Think of this page like construction permits for AI automation. Construction permits don't tell you what a neighborhood looks like today; they tell you what it will look like in 2-3 years. Similarly, the signals tracked here (tool downloads, GitHub stars, deployment patterns) are leading indicators of where AI automation is heading before it shows up in labor statistics.

## Theoretical Capability vs. Observed Exposure
There is a significant gap between what LLMs could theoretically automate and what they actually handle in practice. Research (including from Anthropic) shows that theoretical exposure estimates are much higher than real-world deployment. This gap is important context for interpreting displacement predictions.

## The Automation Flow
1. Tool Adoption: Developers download tools (e.g., browser-use, faster-whisper, docling)
2. Task Automation: Tasks get automated, not entire jobs. Example: a paralegal's document review task is automated, but the paralegal role persists in restructured form.
3. Productivity Absorption: Productivity absorbs the impact, until it doesn't. There's a 2-10 year lag between AI capability and labor market impact. During this phase, firms use AI to do more with the same workforce.
4. Firm Response: The task composition determines vulnerability. Jobs with >60% automatable tasks face headcount reduction; jobs with <30% face augmentation.

## Three Firm Response Paths When Workers Get More Productive

### Path 1: Reduce (Same output, fewer workers)
Firms keep output constant and cut headcount. Research: Brynjolfsson, Chandar & Chen (2025) found this pattern in entry-level roles. ADP Research shows declining job postings in AI-exposed categories. Real-world example: IBM back-office restructuring.

### Path 2: Amplify (Same team, more output)
Firms keep headcount constant and increase output. Research: Brynjolfsson, Li & Raymond (2025) found AI-assisted customer service agents handled 13.8% more issues per hour. Example: A 50-person support team handles the volume of a 70-person team.

### Path 3: Expand (New work, new roles, new markets)
Firms use productivity gains to enter new markets or create new services. This is the Jevons Paradox applied to labor: when a resource becomes more efficient, total usage sometimes increases. Historical parallel: ATMs didn't eliminate bank tellers. They made branches cheaper to operate, so banks opened more branches, and teller employment actually rose for 20 years.

## Methodology Notes
- Automation Acceleration Index: Values above 1.0 indicate acceleration. Calculated from tool download growth rates.
- "Surging" definition: 3+ consecutive months of >20% month-over-month growth.
- Community signals include GitHub stars, issues, and StackOverflow questions.
- Important caveats: CI/CD can inflate download numbers; these are relative, not absolute measures; correlation does not imply causation.
- Data sources update monthly.`;

/** Hero stats content */
export const HERO_CONTENT = `# Key Dashboard Statistics

The site headline is: "How is AI reshaping the labor market?" with the thesis: "AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they are disappearing. No measurable macro displacement, yet."

Three hero statistics:
1. ~21% Productivity boost: Median of 18 studies measuring AI's impact on worker productivity
2. ~3% Projected job loss: Weighted average of 14 estimates for overall US job displacement (from the overall-us-displacement prediction, all evidence tiers weighted)
3. ~0% Measured job loss: Based on Yale, Goldman Sachs, and Dallas Fed observed data. Despite high exposure estimates, actual macro-level job losses attributable to AI remain near zero as of early 2026.

These three numbers capture the core tension: AI demonstrably boosts productivity and is projected to displace some jobs, but observed displacement so far is minimal. The gap between projected and observed displacement is one of the most important findings on the site.`;
