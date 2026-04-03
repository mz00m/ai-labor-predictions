// Core AI analysis pipeline for assessment reports
// All file content processed in-memory — never persisted

import Anthropic from "@anthropic-ai/sdk";
import { AssessmentIntake, AssessmentReport } from "./types";
import { stripPii } from "./pii-strip";
import { getIndustryTemplate } from "./taxonomy";
import { getOnetSummaryForPrompt } from "./onet-tasks";
import { formatToolsForPrompt } from "@/data/tools";

const anthropic = new Anthropic();

/**
 * Generate a full assessment report from intake data and uploaded file contents.
 * File contents are processed in-memory only and discarded after analysis.
 */
export async function generateAssessmentReport(
  intake: AssessmentIntake,
  fileContents: { name: string; category: string; text: string }[],
  websiteContent: string | null,
  mode: "preview" | "full"
): Promise<AssessmentReport> {
  // Step 1: Strip PII from all content
  const sanitizedFiles = fileContents.map((f) => {
    const result = stripPii(f.text);
    return {
      name: f.name,
      category: f.category,
      text: result.cleanedText,
      redactedCount: result.redactedCount,
    };
  });

  const sanitizedWebsite = websiteContent ? stripPii(websiteContent).cleanedText : null;

  // Step 2: Get industry context
  const template = getIndustryTemplate(intake.industry);

  // Step 3: Build the analysis prompt
  const systemPrompt = buildSystemPrompt(mode);
  const userPrompt = buildUserPrompt(intake, sanitizedFiles, sanitizedWebsite, template);

  // Step 4: Run Claude analysis
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: mode === "preview" ? 3000 : 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Step 5: Parse structured response
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const report = parseReportResponse(text, mode);

  return report;
}

/**
 * Generate AI policy and prompt library add-on content
 */
export async function generatePolicyAndPrompts(
  intake: AssessmentIntake,
  existingReport: AssessmentReport
): Promise<{ aiPolicy: AssessmentReport["aiPolicy"]; promptLibrary: AssessmentReport["promptLibrary"] }> {
  const systemPrompt = `You are a practical AI advisor creating ready-to-use guidelines and prompts for an individual worker or small business team.
Generate two outputs in JSON format:

1. "aiPolicy": Simple, clear AI usage guidelines with sections covering:
   - When and how to use AI in your work
   - What's a good fit for AI vs. what needs a human
   - How to handle sensitive data when using AI tools
   - Quality checks — always review AI output before using it
   - Common pitfalls to avoid
   - How to get better at using AI over time
   Each section has "title" and "content" fields. Write in second person ("you"). Keep it practical, not legalistic.

2. "promptLibrary": 10-20 copy-paste prompts tailored to their actual tasks. Each entry has:
   - "title": Short name
   - "department": Which area of their work this applies to
   - "useCase": What specific task this helps with
   - "prompt": The actual prompt template (use [BRACKETS] for variables the user fills in)
   - "tips": Array of 2-3 tips for getting better results

Make every prompt immediately usable. Include the full text they can paste into any AI tool.
Tailor everything to this person's specific industry, role, and workflows.
Return valid JSON with keys "aiPolicy" (with "sections" array) and "promptLibrary" (array).`;

  const userPrompt = `Organization: ${intake.organizationName}
Industry: ${intake.industry}
Size: ${intake.companySize}
Scope: ${intake.assessmentScope}
Key functions: ${intake.primaryFunctions.join(", ")}
Current tools: ${intake.currentTools.join(", ")}
AI maturity: ${intake.currentAiUsage}

Existing report executive summary:
${existingReport.executiveSummary}

Key recommendations from report:
${existingReport.toolRecommendations.map((r) => `- ${r.category}: ${r.purpose}`).join("\n")}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        aiPolicy: parsed.aiPolicy || { sections: [] },
        promptLibrary: parsed.promptLibrary || [],
      };
    }
  } catch {
    // Fallback
  }

  return {
    aiPolicy: { sections: [{ title: "AI Usage Policy", content: "Policy generation in progress. Please try again." }] },
    promptLibrary: [],
  };
}

function buildSystemPrompt(mode: "preview" | "full"): string {
  const base = `You are a practical AI productivity advisor helping individual workers and small business teams find where AI can save them time and improve their work. You have deep knowledge of:
- Current AI tools across industries (productivity, communication, analysis, creative, operations)
- A curated knowledge base of office automation tools (provided in the user prompt) — reference these specific products in your recommendations
- O*NET task classifications and how AI maps to specific work activities
- How individuals and small teams can realistically adopt AI tools
- Time savings and productivity gains from AI adoption based on research
- What works for people who are busy and not deeply technical

Your tone is warm, direct, and encouraging, like a knowledgeable colleague who genuinely wants to help someone work smarter. No corporate jargon, no hype. Focus on practical, specific things they can do.

Frame everything around EMPOWERMENT: AI helps them get time back for the work that matters most, the creative, strategic, human parts of their job. AI handles the repetitive, tedious, time-consuming tasks so they can focus on what they're best at.

CRITICAL INSTRUCTION: Be SPECIFIC with real-world product and service recommendations. Name actual tools (ChatGPT, Claude, Notion AI, Zapier, Grammarly, Otter.ai, Canva, etc.) with their real URLs. Include real pricing. Give real-world examples of how similar businesses or roles use these tools. This is a paid report; generic advice like "use an AI writing assistant" is not acceptable. The user is paying for specific, actionable guidance they can act on today.

## Research-Backed Framework (Stanford Digital Economy Lab, Enterprise AI Playbook 2026)

Use these research findings to ground your recommendations:

**AI Deployment Models** — Match the right model to each task:
- **Copilot**: Human does the work, AI assists (drafting, suggestions). Best for creative/strategic tasks. ~25-40% productivity gain.
- **Escalation**: AI handles routine cases (80%+), humans handle exceptions. Best for customer service, intake, triage. ~71% median productivity gain.
- **Full Automation**: AI runs the process end-to-end with periodic human review. Best for data entry, scheduling, reporting. ~40-60% productivity gain.
- **Agentic**: AI autonomously plans and executes multi-step workflows. Highest potential (~71% median productivity) but requires more setup. Best for research, analysis pipelines, multi-tool workflows.

**Common Failure Modes** — 77% of the hardest challenges are invisible costs. Warn about:
- Change management and user adoption (not the technology itself)
- Data quality issues (but note: messy data is NOT a blocker if you design around it)
- Process redesign needed before AI can help (automating a bad process just makes bad faster)
- Underestimating training time for staff
- Starting too big instead of with a focused pilot

**Organizational Resistance** — Staff functions (Legal, HR, Risk, Compliance) are the #1 source of pushback at 35%. Address this proactively in change management advice.

**Success Pattern** — 61% of successful AI projects had a prior failure. Normalize experimentation and iteration. First attempt rarely works perfectly.

**KPIs by Function** — Recommend specific, measurable success metrics:
- Customer service: resolution time, first-contact resolution rate, cost per ticket
- Content/marketing: time to publish, content volume, engagement rates
- Finance/admin: processing time per document, error rate, cycle time
- Operations: throughput, manual touch points eliminated, processing lag

IMPORTANT: The data has been pre-processed to remove PII. Do not attempt to reference specific individuals by name.`;

  if (mode === "preview") {
    return base + `\n\nGenerate a PREVIEW plan: a brief summary of their biggest AI opportunities, an AI readiness score, and 2-3 high-level task analyses with specific tool names. Make it useful enough to show value but clearly incomplete. Return JSON format matching the full report structure but with fewer items.`;
  }

  return base + `\n\nGenerate a COMPREHENSIVE personalized AI action plan in JSON format with these exact keys:
{
  "executiveSummary": "3-4 paragraphs speaking directly to the person. Summarize their biggest opportunities, what they stand to gain, and the specific approach you recommend. Be specific about their work. Include a concrete example: 'For instance, your weekly [task] could be reduced from X hours to Y minutes using [specific tool].' End with an encouraging call to action.",
  "organizationProfile": {
    "summary": "2-3 sentence overview of their work context and what makes their situation unique",
    "industryContext": "3-4 sentences grounded in real trends. Reference specific stats where possible, e.g., 'According to McKinsey, X% of tasks in [industry] are automatable.' Mention what peer companies or competitors are doing with AI.",
    "aiReadinessScore": 1-10,
    "keyStrengths": ["What they already have going for them - be specific to their intake"],
    "keyGaps": ["Where they can grow, framed as opportunities with specific solutions"]
  },
  "taskAnalysis": [
    {
      "taskName": "Name of the specific task",
      "department": "Area of their work",
      "currentProcess": "2-3 sentences describing how they likely do this today, including pain points and time spent",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "3-4 sentences with a SPECIFIC explanation of how to use AI for this. Name the tool, describe the workflow: 'Open [Tool], paste your [input], use the [feature] to generate [output]. Review and edit the result, which typically takes 5-10 minutes instead of the usual hour.'",
      "expectedImpact": "Specific: '3-5 hours saved per week' or '60% faster turnaround on client reports'",
      "complexity": "simple|moderate|complex",
      "onetAlignment": "O*NET task reference if applicable",
      "estimatedTimeSaved": "e.g. '3-5 hrs/week' or '45 min per occurrence'",
      "exampleTools": [
        { "name": "Actual product name", "url": "https://real-url.com", "free": true/false }
      ],
      "gettingStarted": "One concrete sentence: 'Start by signing up for [tool] free tier and trying it on your next [task].' Include the specific URL.",
      "deploymentModel": "copilot|escalation|full-automation|agentic — pick the model that fits this task based on the Stanford framework",
      "deploymentModelRationale": "1-2 sentences explaining why this deployment model is the best fit. Reference expected productivity gains."
    }
  ],
  "toolRecommendations": [
    {
      "toolName": "Specific product name from the tools reference (e.g., 'Grammarly', 'QuickBooks Online')",
      "category": "General category (e.g., 'AI writing assistant', 'cloud accounting')",
      "purpose": "What it does in plain language for their specific work",
      "expectedValue": "Specific measurable benefit: '~4 hours saved weekly on email drafting' not just 'saves time'",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "Exact pricing from tools reference: 'Free tier available, Pro at $20/mo' not just '$'",
      "specificProducts": [
        {
          "name": "Real product name from tools KB",
          "url": "https://actual-url.com",
          "pricing": "Free / $12/mo Pro / $25/mo Business",
          "free": true
        }
      ],
      "gettingStarted": [
        "Step 1: Go to [url] and create a free account",
        "Step 2: Install the browser extension / connect to your existing [tool]",
        "Step 3: Try it on [specific task from their intake] this week",
        "Step 4: After a week, evaluate if the paid plan is worth it for [feature]"
      ],
      "realWorldExample": "A [similar role] at a [similar-sized company] in [industry] used [tool] to [specific result]. For example, an office manager at a 15-person law firm used Zapier to automate client intake forms, saving 6 hours per week on data entry.",
      "successKpis": [
        "Specific measurable KPI to track, e.g. 'Time to first draft reduced from 2 hours to 20 minutes'",
        "Second KPI, e.g. 'Error rate on reports decreased by 40%'"
      ]
    }
  ],
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "displacementRisk": "Honest but reassuring. Frame as 'how your role evolves' not 'risk of replacement'. Reference industry data where possible.",
    "skillGaps": ["Specific skills to build with a recommended free resource for each, e.g., 'Prompt engineering basics - free course at learnprompting.org'"],
    "changeManagementNotes": "Practical, step-by-step advice for making the transition smooth. Include a suggested timeline.",
    "dataPrivacyConsiderations": "Specific to their industry. Name what data should NOT be put into AI tools and why. Reference relevant regulations if applicable (HIPAA, FERPA, etc.).",
    "commonPitfalls": [
      "Industry-specific failure mode to watch for, e.g. 'Automating your grant reporting process before standardizing your data collection will amplify inconsistencies'",
      "Second pitfall, e.g. 'Skipping the pilot phase — 61% of successful AI projects had a prior failed attempt (Stanford DEL 2026). Start small, learn, then scale.'"
    ],
    "resistanceSources": [
      "Where pushback will likely come from and how to address it, e.g. 'Your compliance team may worry about AI-generated documents — address this early by establishing a human review step for all client-facing output'"
    ],
    "dataReadinessNote": "Honest assessment of their data situation. Key insight: messy data is NOT a blocker. Recommend designing around imperfect data rather than waiting for perfect data. Give a specific example relevant to their work."
  },
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "This week to 3 months",
      "objectives": ["Specific, measurable objectives"],
      "actions": [{
        "title": "Clear action title",
        "description": "2-3 sentences with specific instructions. Not 'explore AI tools' but 'Sign up for ChatGPT free at chat.openai.com. Use it to draft your weekly client update emails for 2 weeks. Track time saved vs. your current process.'",
        "owner": "You / Your team",
        "priority": "critical|high|medium|low",
        "howTo": "Brief explainer: 'Go to [URL], click Sign Up, choose the free plan. On the main screen, type your request. Start with: [example prompt for their work].'",
        "resource": { "label": "Getting Started Guide", "url": "https://real-resource-url.com" }
      }],
      "expectedOutcomes": ["Specific measurable outcomes: 'Save 3-5 hours/week on email and document drafting within the first month'"],
      "estimatedInvestment": "Exact: '$0 for first month (free tiers), $20-60/mo after for [specific tools]'"
    },
    "mediumTerm": { "timeframe": "3-6 months", ...same structure with progressively more advanced actions },
    "longTerm": { "timeframe": "6-12+ months", ...same structure with strategic, transformative actions }
  },
  "roiProjections": [
    {
      "area": "Specific area of work",
      "currentCost": "Detailed: '~8 hours/week at estimated $X/hr = $Y/month' or 'Currently outsourcing to [service] at $Z/month'",
      "projectedSavings": "Specific: '5-6 hours/week recovered, equivalent to ~$X/month in labor value'",
      "timeToValue": "Specific: '2-3 weeks to see initial time savings, full ROI within 2 months'",
      "confidence": "high|moderate|low",
      "basis": "Cite the reasoning: 'Based on typical productivity gains of 30-40% for [task type] with AI assistance (McKinsey 2024 research) applied to your estimated [X] hours/week'",
      "calculationDetail": "Show the math: 'Current: 8 hrs/week x $35/hr = $280/week. With AI: 3 hrs/week x $35/hr = $105/week + $20/mo tool cost. Net savings: ~$680/month.'"
    }
  ],
  "furtherEvaluation": ["Specific, actionable next steps with URLs where possible. Not 'explore more tools' but 'Join the free AI for [Industry] community at [URL] to learn from peers. Post your first question about [specific challenge from their intake].'"]
}

Generate 8-12 task analyses, 6-10 tool recommendations, 3-5 ROI projections, and 5-8 next steps.
Every recommendation must be SPECIFIC to their work with NAMED PRODUCTS from the tools knowledge base, REAL URLs, REAL PRICING, and STEP-BY-STEP instructions.
Include both the product name AND general category (e.g., "Grammarly (AI writing assistant)") so users can evaluate alternatives too.
Include real-world examples of how similar businesses/roles benefited.
Show the math on ROI projections.
For each tool, always mention if a free tier exists and lead with free options.
For each task, assign a deployment model (copilot, escalation, full-automation, or agentic) based on the Stanford framework.
For each tool recommendation, include 2-3 specific KPIs the user should track to measure success.
Include 3-5 common pitfalls specific to their industry and situation. Reference the Stanford finding that 77% of challenges are invisible costs (change management, data quality, process redesign).
Normalize experimentation: mention that 61% of successful AI projects had a prior failure.
Make this report so actionable they could start implementing the first recommendation within 10 minutes of reading it.
For tool recommendations, reference specific products from the tools knowledge base provided. Include both the product name AND general category so users can evaluate alternatives.`;
}

function buildUserPrompt(
  intake: AssessmentIntake,
  files: { name: string; category: string; text: string; redactedCount: number }[],
  websiteContent: string | null,
  template: ReturnType<typeof getIndustryTemplate>
): string {
  let prompt = `## AI Action Plan Request

**Company / Organization:** ${intake.organizationName}
**Industry:** ${intake.industry}${intake.industryDetail ? ` (${intake.industryDetail})` : ""}
**Size:** ${intake.companySize} people
**Focus:** ${intake.assessmentScope === "team" ? "Individual / my own work" : intake.assessmentScope === "department" ? "My team" : "The whole business"}`;

  if (intake.departmentName) {
    prompt += `\n**Department:** ${intake.departmentName}`;
  }
  if (intake.teamDescription) {
    prompt += `\n**Team:** ${intake.teamDescription}`;
  }

  prompt += `
**Current AI Usage:** ${intake.currentAiUsage}
**Current Tools:** ${intake.currentTools.join(", ") || "Not specified"}

**Key Functions:** ${intake.primaryFunctions.join(", ")}
**Key Roles:** ${intake.keyRoles.join(", ")}
**Biggest Challenges:** ${intake.biggestChallenges.join(", ")}
**Goals:** ${intake.goals.join(", ")}`;

  if (intake.additionalContext) {
    prompt += `\n\n**Additional Context:** ${intake.additionalContext}`;
  }

  // Add file contents (sanitized)
  if (files.length > 0) {
    prompt += `\n\n## Uploaded Documents (PII removed)\n`;
    for (const file of files) {
      // Truncate very long files to keep within token limits
      const truncated = file.text.length > 5000 ? file.text.slice(0, 5000) + "\n[...truncated]" : file.text;
      prompt += `\n### ${file.name} (${file.category})${file.redactedCount > 0 ? ` [${file.redactedCount} PII items redacted]` : ""}\n${truncated}\n`;
    }
  }

  // Add website content (sanitized)
  if (websiteContent) {
    const truncated = websiteContent.length > 3000 ? websiteContent.slice(0, 3000) + "\n[...truncated]" : websiteContent;
    prompt += `\n\n## Website Content (sanitized)\n${truncated}`;
  }

  // Add industry context from our taxonomy
  prompt += `\n\n## Industry Reference Data
Common AI opportunity areas in ${template.industry}:
${template.departments.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}

Typical industry challenges: ${template.commonChallenges.join(", ")}`;

  // Add O*NET task mapping data
  const onetSummary = getOnetSummaryForPrompt(intake.primaryFunctions, intake.industry);
  prompt += `\n\n${onetSummary}`;

  // Add tools knowledge base (filtered for this assessment's industry + size)
  const toolsRef = formatToolsForPrompt(intake.industry, intake.companySize);
  if (toolsRef) {
    prompt += `\n\n${toolsRef}`;
  }

  return prompt;
}

function parseReportResponse(text: string, mode: "preview" | "full"): AssessmentReport {
  // Try to extract JSON from the response
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (mode === "preview") {
        // Return limited preview report
        return {
          executiveSummary: parsed.executiveSummary || "Assessment preview generated.",
          organizationProfile: parsed.organizationProfile || {
            summary: "",
            industryContext: "",
            aiReadinessScore: parsed.aiReadinessScore || 5,
            keyStrengths: parsed.keyStrengths || [],
            keyGaps: parsed.keyGaps || [],
          },
          taskAnalysis: (parsed.taskAnalysis || []).slice(0, 2),
          toolRecommendations: (parsed.toolRecommendations || []).slice(0, 2),
          riskAssessment: {
            overallRiskLevel: "moderate",
            displacementRisk: "Full analysis available in complete report.",
            skillGaps: [],
            changeManagementNotes: "Full analysis available in complete report.",
            dataPrivacyConsiderations: "Full analysis available in complete report.",
          },
          implementationRoadmap: {
            immediate: {
              timeframe: "0-3 months",
              objectives: parsed.implementationRoadmap?.immediate?.objectives?.slice(0, 1) || ["See full report"],
              actions: [],
              expectedOutcomes: [],
            },
            mediumTerm: {
              timeframe: "3-6 months",
              objectives: ["Unlock the full report for detailed medium-term planning"],
              actions: [],
              expectedOutcomes: [],
            },
            longTerm: {
              timeframe: "6-12+ months",
              objectives: ["Unlock the full report for long-term strategic planning"],
              actions: [],
              expectedOutcomes: [],
            },
          },
          roiProjections: [],
          furtherEvaluation: ["Unlock the full report for specific next steps"],
        };
      }

      // Full report
      return {
        executiveSummary: parsed.executiveSummary || "",
        organizationProfile: parsed.organizationProfile || {
          summary: "",
          industryContext: "",
          aiReadinessScore: 5,
          keyStrengths: [],
          keyGaps: [],
        },
        taskAnalysis: parsed.taskAnalysis || [],
        toolRecommendations: parsed.toolRecommendations || [],
        riskAssessment: parsed.riskAssessment || {
          overallRiskLevel: "moderate",
          displacementRisk: "",
          skillGaps: [],
          changeManagementNotes: "",
          dataPrivacyConsiderations: "",
        },
        implementationRoadmap: parsed.implementationRoadmap || {
          immediate: { timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [] },
          mediumTerm: { timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [] },
          longTerm: { timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [] },
        },
        roiProjections: parsed.roiProjections || [],
        furtherEvaluation: parsed.furtherEvaluation || [],
      };
    }
  } catch (e) {
    console.error("Failed to parse report JSON:", e);
  }

  // Fallback for unparseable responses
  return {
    executiveSummary: text.slice(0, 500),
    organizationProfile: {
      summary: "",
      industryContext: "",
      aiReadinessScore: 5,
      keyStrengths: [],
      keyGaps: [],
    },
    taskAnalysis: [],
    toolRecommendations: [],
    riskAssessment: {
      overallRiskLevel: "moderate",
      displacementRisk: "",
      skillGaps: [],
      changeManagementNotes: "",
      dataPrivacyConsiderations: "",
    },
    implementationRoadmap: {
      immediate: { timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [] },
      mediumTerm: { timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [] },
      longTerm: { timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [] },
    },
    roiProjections: [],
    furtherEvaluation: [],
  };
}
