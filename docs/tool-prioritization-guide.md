# AI Tool Prioritization Guide

How to sequence AI tool recommendations for small businesses and individual professionals. This framework is used by the assessment report generator and the `/ai-consultant` skill to ensure every recommendation is practical, sequenced, and honest about tradeoffs.

## The Core Problem

Most AI tool guides recommend too many tools at once with no clear order. A nonprofit director who gets a list of 8 tools with equal weight will adopt zero of them. Prioritization is the entire value of a paid assessment.

## Prioritization Framework

### Step 1: Determine the Starting Point (Maturity Gate)

The person's current AI maturity level determines what tools are even worth discussing.

| AI Maturity | What They Need | What They Don't Need |
|---|---|---|
| **None** | A single general-purpose AI (Claude or ChatGPT, free tier). Full stop. Everything else waits. | Vertical SaaS, automation platforms, multi-tool workflows |
| **Exploring** | 1 general-purpose AI + 1 task-specific tool for their biggest time sink | Complex integrations, agentic workflows, enterprise platforms |
| **Piloting** | 2-3 tools addressing their top pain points, with integration between them | More than 3 new tools, custom development, AI strategy documents |
| **Some adoption** | Optimization of existing tools + 1-2 additions that compound existing gains | Starting over with new tools that replace working ones |
| **Widespread** | Advanced use cases, custom workflows, automation between tools | Basic recommendations they've already surpassed |

**Rule: Never recommend a tool that requires capabilities the person hasn't built yet.** An AI-native CRM is useless if they've never used any AI tool. A workflow automation platform is useless if they don't have the component tools to connect.

### Step 2: Score Each Tool Candidate

For every tool in the knowledge base that matches the person's industry and size, calculate a prioritization score:

```
Priority Score = (Time Impact × 3) + (Ease of Adoption × 2) + (Cost Efficiency × 1)
                 ─────────────────────────────────────────────────────────────────────
                                              6
```

**Time Impact (1-5)**

| Score | Hours Saved/Week | Example |
|---|---|---|
| 5 | 5+ hours/week | AI drafts all first-pass grant reports |
| 4 | 3-5 hours/week | AI handles email triage and responses |
| 3 | 1-3 hours/week | AI generates meeting summaries |
| 2 | 30-60 min/week | AI proofreads documents |
| 1 | < 30 min/week | AI suggests calendar times |

**Ease of Adoption (1-5)**

| Score | What It Means |
|---|---|
| 5 | Works in a browser, no setup, useful in 10 minutes (e.g., ChatGPT free) |
| 4 | Install/sign up, useful in 30 minutes, minimal configuration (e.g., Grammarly) |
| 3 | Takes 1-2 hours to set up, needs some data input, useful within a day (e.g., Notion AI) |
| 2 | Takes a day+ to configure, needs data migration or integration setup (e.g., HubSpot CRM) |
| 1 | Multi-day setup, requires technical help or training, complex data migration (e.g., Salesforce) |

**Cost Efficiency (1-5)**

| Score | Cost Per Hour Saved |
|---|---|
| 5 | Free (open tier covers their use case) |
| 4 | < $0.50/hour saved |
| 3 | $0.50-$1.00/hour saved |
| 2 | $1.00-$2.00/hour saved |
| 1 | > $2.00/hour saved |

*Cost per hour saved = monthly tool cost ÷ (hours saved per week × 4.3)*

### Step 3: Apply the Tier Caps

After scoring, assign tools to tiers with strict caps:

| Tier | Label | Max Tools | Criteria |
|---|---|---|---|
| 1 | **Start Here** | 2 | Priority Score ≥ 4.0 AND Ease of Adoption ≥ 4 |
| 2 | **Add Next** | 3 | Priority Score ≥ 3.0 AND at least one Tier 1 tool is a prerequisite or natural predecessor |
| 3 | **Consider Later** | 2 | Priority Score ≥ 2.5 AND requires Tier 1/2 tools to be in place first |
| — | **Not Recommended** | — | Priority Score < 2.5 OR maturity gate blocks it |

**Hard cap: 6 tools total across all tiers in any single report.** If more than 6 tools score above 2.5, drop the lowest-scoring ones. Better to strongly recommend 5 tools than weakly recommend 10.

### Step 4: Sequence Within Tiers

Within each tier, tools are ordered by:

1. **Foundation tools first.** Tools that make other tools more effective come before the tools they enable. Example: a CRM comes before AI email personalization that pulls from the CRM.

2. **Free before paid.** If two tools serve similar purposes and one has a free tier, the free one goes first even if the paid one is slightly better.

3. **Quick wins before strategic plays.** A tool that saves 2 hours/week starting tomorrow beats a tool that saves 5 hours/week after 2 weeks of setup — at least for Tier 1.

### Step 5: Write the Recommendation

Each tool recommendation in the report must include:

#### What It Replaces
Name the specific manual process this tool eliminates or reduces. Not "helps with writing" but "replaces the 45 minutes you spend drafting each donor thank-you letter."

#### What It Costs
- Lead with free tier if available: "Free for up to X. Paid tier at $Y/mo adds Z."
- Include the cost-per-hour-saved calculation: "At $20/mo saving ~8 hrs/month, that's $2.50/hr — worth it if you value your time at $25+/hr."
- For free tools, say so clearly: "Completely free for your use case. No upgrade needed."

#### How Long to Learn
Be honest and specific:
- "5 minutes — paste text in, get result out"
- "20 minutes — watch the 3-minute tutorial, then try it on your next email"
- "2-3 hours spread over a week — set up your templates, learn the shortcuts"
- "A dedicated afternoon — import your data, configure your pipeline, run a test batch"

#### First Task to Try
A single, concrete task from their actual work:
- "Take your last board report draft. Paste it into Claude and say: 'Review this for clarity and suggest edits. Keep the tone professional but warm.'"
- "Upload your last 3 expense receipts to Dext. See if it categorizes them correctly."

#### When to Upgrade
The specific trigger for moving from free to paid:
- "When you're using it more than 20 times per week, the free tier will start running out — that's when Pro at $20/mo makes sense."
- "The free tier handles everything you need. Only upgrade if you want [specific feature] for [specific use case]."
- "Start with the 14-day trial. If you're still using it daily after the trial, the $15/mo is justified."

---

## Industry-Specific Prioritization Notes

### Nonprofits
- Grant management tools are high-value but often complex. Start with general-purpose AI for grant writing before adding dedicated grant management software.
- Data privacy is less restrictive than healthcare or finance but donor data still matters. Flag PII handling for any tool that touches donor records.
- Budget sensitivity is real. Lead with free tools. Frame paid tools as "costs less than 1 hour of staff time per month."

### Professional Services (Legal, Accounting, Consulting)
- Compliance and confidentiality gate everything. Any tool recommendation must address where client data goes.
- Document generation is almost always the highest-impact starting point.
- Billing/time-tracking AI is high-value but only after the person is comfortable with AI in their workflow.

### Healthcare
- HIPAA compliance is a hard gate. No tool recommendation touches patient data unless the vendor is explicitly HIPAA-compliant.
- Administrative tasks (scheduling, billing, documentation) are the safe starting point.
- Clinical decision support is out of scope for this assessment.

### Retail / E-commerce
- Inventory and customer communication are usually the biggest time sinks.
- Marketing automation has high ROI but also high setup cost — usually Tier 2 or 3.
- POS integration matters. Recommend tools that work with their existing POS before suggesting replacements.

### Education
- FERPA compliance for student data.
- Curriculum development and communication with parents/students are typically the highest-impact areas.
- Administrative burden is enormous in education — focus recommendations on reducing paperwork, not replacing instruction.

### Creative / Media
- AI tools for content creation are sensitive territory. Frame as "handles the tedious parts so you can focus on the creative parts."
- Editing, transcription, and repurposing are safer starting points than generation.
- Licensing and IP concerns should be flagged for any generative tool.

---

## Common Mistakes to Avoid

1. **Recommending enterprise tools to solo operators.** Salesforce is not the right CRM for a 5-person nonprofit. HubSpot Free or even a well-organized spreadsheet might be.

2. **Leading with the most impressive tool instead of the most useful one.** An agentic AI workflow is cool. But if they've never used ChatGPT, start there.

3. **Ignoring the switching cost.** If they already use QuickBooks and you recommend Xero with AI, the migration pain may outweigh the AI benefit. Recommend the AI add-on for what they already have.

4. **Generic "explore AI" advice.** "Explore how AI can help your marketing" is not a recommendation. "Sign up for Claude free at claude.ai and use it to draft your next 3 social media posts" is a recommendation.

5. **Pricing amnesia.** Every tool recommendation must include the exact price. "$" or "varies by plan" is not acceptable in a paid report.

6. **Forgetting the do-nothing option.** Some tasks don't need AI. If the person spends 15 minutes a week on something, automating it with a $50/mo tool is a bad trade. Say so.

7. **Recommending tools not in the knowledge base.** All tools must come from `src/data/tools/`. No invented products, no guessed URLs, no approximate pricing.

---

## How This Guide Is Used

- **Assessment generation** (`src/lib/assessment/analyze.ts`): The Claude system prompt references this framework to structure tool recommendations with proper tiering and sequencing.
- **AI Consultant skill** (`.claude/commands/ai-consultant.md`): Uses this guide to review and improve assessment reports.
- **PDF report** (`src/lib/assessment/pdf-generator.ts`): Renders tools in the tier order defined here (Start Here → Add Next → Consider Later).
- **Quality assurance**: Any review of assessment output checks recommendations against this framework.
