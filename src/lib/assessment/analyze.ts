// Core AI analysis pipeline for assessment reports
// All file content processed in-memory — never persisted

import Anthropic from "@anthropic-ai/sdk";
import {
  AssessmentIntake,
  AssessmentReport,
  AssessmentStep,
  StepContext,
  StepFeedback,
  QuickWin,
  OrganizationProfile,
  TaskAnalysis,
  ToolRecommendation,
  ImplementationRoadmap,
  RoiProjection,
  RiskAssessment,
} from "./types";
import { stripPii } from "./pii-strip";
import { getIndustryTemplate, DepartmentTemplate } from "./taxonomy";
import { getOnetSummaryForPrompt } from "./onet-tasks";
import { formatToolsForPrompt } from "@/data/tools";
import { formatResearchContextForPrompt } from "./research-context";
import { formatCapabilitiesForPrompt } from "./capabilities-context";
import { formatEvidenceCitationsForPrompt } from "./evidence-citations";
import {
  StepContextSchema,
  Step1ProfileSchema,
  Step2TasksSchema,
  Step3ToolsSchema,
  Step4RisksSchema,
} from "./schemas";

const anthropic = new Anthropic();

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

IMPORTANT RULES:
- Only reference current AI products: ChatGPT (by OpenAI), Claude (by Anthropic), Google Gemini (by Google). NEVER reference "Google Bard", "Bard", or "OpenAI Codex" — these are discontinued.
- Do NOT invent or reference any geographic location (city, state, region). The intake does not include location data.

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
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  }, { timeout: 60000 });

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

// ============================================================================
// MULTI-STEP PIPELINE
// Each step produces a focused slice of the report with ~4K max_tokens
// ============================================================================

const CONSULTING_PHILOSOPHY = `You are an experienced small business technology consultant specializing in AI tool adoption. Your clients are busy operators — nonprofit directors, small business owners, department leads, solo professionals — who need clear, prioritized, actionable guidance.

Write like a smart, experienced consultant who genuinely wants this person to succeed. Not corporate. Not academic. Not salesy.
- "Here's what I'd do first" not "Consider implementing"
- "This will save you about 4 hours a week" not "Potential efficiency gains"
- "Skip this for now" not "This may be premature"

FACTUAL ACCURACY: NEVER fabricate statistics, URLs, case studies, or research findings. Only cite data provided to you.

GEOGRAPHIC GROUNDING: The intake does NOT include the user's city, state, or region. Do NOT invent, guess, or reference any specific geographic location (cities, states, counties, regions, neighborhoods) anywhere in the report. If you need to reference location, say "your area" or "your local market." Never mention a state or city name unless the user explicitly provided it in their intake text (e.g., in their organization name, additional context, or uploaded documents). If a location appears in their organization name (e.g., "Pittsburgh Nursery"), you may reference that specific location but do not extrapolate to surrounding areas.

TOOL NAMES: Only reference current, active AI products. Use these names: ChatGPT (by OpenAI), Claude (by Anthropic), Google Gemini (by Google). NEVER reference discontinued or rebranded products such as "Google Bard", "Bard", or "OpenAI Codex". Google's AI assistant is called Gemini, not Bard.`;

function filterDepartmentsToRole(
  departments: DepartmentTemplate[],
  intake: AssessmentIntake
): DepartmentTemplate[] {
  // Collect all signals about the person's role into lowercase terms for matching
  const roleTerms = new Set<string>();

  for (const fn of intake.primaryFunctions) {
    roleTerms.add(fn.toLowerCase());
  }
  for (const role of intake.keyRoles) {
    roleTerms.add(role.toLowerCase());
  }
  if (intake.jobTitle) {
    roleTerms.add(intake.jobTitle.toLowerCase());
  }
  if (intake.departmentName) {
    roleTerms.add(intake.departmentName.toLowerCase());
  }
  if (intake.teamDescription) {
    roleTerms.add(intake.teamDescription.toLowerCase());
  }

  if (roleTerms.size === 0) return departments;

  const matched = departments.filter((dept) => {
    const deptName = dept.name.toLowerCase();
    const deptFunctions = dept.keyFunctions.map(f => f.toLowerCase());
    const deptRoles = dept.typicalRoles.map(r => r.toLowerCase());

    for (const term of Array.from(roleTerms)) {
      // Check if any role term appears in the department name, functions, or roles
      if (deptName.includes(term) || term.includes(deptName)) return true;
      for (const fn of deptFunctions) {
        if (fn.includes(term) || term.includes(fn)) return true;
      }
      for (const role of deptRoles) {
        if (role.includes(term) || term.includes(role)) return true;
      }
      // Check for common abbreviations and synonyms
      const synonyms: Record<string, string[]> = {
        "hr": ["human resources", "people", "people ops", "people operations", "talent"],
        "human resources": ["hr", "people", "people ops", "people operations", "talent"],
        "people ops": ["hr", "human resources", "people operations", "talent"],
        "finance": ["accounting", "financial", "bookkeeping", "ap/ar"],
        "accounting": ["finance", "financial", "bookkeeping"],
        "marketing": ["communications", "content", "social media", "brand"],
        "it": ["technology", "engineering", "devops", "infrastructure"],
        "technology": ["it", "engineering", "devops", "software"],
        "sales": ["business development", "revenue", "account management"],
        "operations": ["ops", "admin", "administrative"],
        "legal": ["compliance", "regulatory", "contracts"],
      };

      const termSynonyms = synonyms[term] || [];
      for (const syn of termSynonyms) {
        if (deptName.includes(syn)) return true;
        for (const fn of deptFunctions) {
          if (fn.includes(syn)) return true;
        }
      }
    }
    return false;
  });

  return matched;
}

function inferRoleFocus(intake: AssessmentIntake): string {
  // Build a clear description of what this person actually does
  const signals: string[] = [];

  if (intake.jobTitle) {
    signals.push(`Job Title: ${intake.jobTitle}`);
  }
  if (intake.departmentName) {
    signals.push(`Department: ${intake.departmentName}`);
  }
  if (intake.teamDescription) {
    signals.push(`Role/Team: ${intake.teamDescription}`);
  }
  if (intake.primaryFunctions.length > 0) {
    signals.push(`Functions: ${intake.primaryFunctions.join(", ")}`);
  }
  if (intake.keyRoles.length > 0) {
    signals.push(`Roles: ${intake.keyRoles.join(", ")}`);
  }

  if (signals.length === 0) return "";

  return `
## CRITICAL: This Person's Actual Role
The person taking this assessment works in the following capacity:
${signals.map(s => `- ${s}`).join("\n")}

**IMPORTANT: Tailor ALL recommendations to this person's actual job function, NOT the company's industry.**
For example, a People Ops person at a tech company needs HR/people management tasks (onboarding, performance reviews, benefits administration, employee engagement), NOT software engineering or DevOps tasks. A finance person at a healthcare company needs accounting and financial planning tasks, NOT clinical or medical tasks.

The company's industry (${intake.industry}) provides context for the DOMAIN they work in, but their function (${intake.primaryFunctions.join(", ")}) determines WHAT TASKS to recommend.`;
}

function buildIntakeContext(intake: AssessmentIntake): string {
  const maturityDescriptions: Record<string, string> = {
    "none": "Has NOT used AI tools yet. Start with the absolute basics.",
    "exploring": "Has tried ChatGPT or similar a few times. Ready for 1 general-purpose AI + 1 task-specific tool.",
    "piloting": "Uses AI occasionally. Ready for 2-3 tools with integration between them.",
    "some-adoption": "AI is part of regular workflow. Focus on optimizing existing tools + 1-2 additions.",
    "widespread": "Uses AI tools daily. Ready for advanced use cases and automation.",
  };

  const roleFocus = inferRoleFocus(intake);

  return `## Who This Is For
**Organization:** ${intake.organizationName}
**Industry:** ${intake.industry}${intake.industryDetail ? ` (${intake.industryDetail})` : ""}
**Size:** ${intake.companySize} people
**Scope:** ${intake.assessmentScope}
${intake.jobTitle ? `**Job Title:** ${intake.jobTitle}` : ""}
${intake.departmentName ? `**Department:** ${intake.departmentName}` : ""}
${intake.teamDescription ? `**Team/Role:** ${intake.teamDescription}` : ""}

**AI Maturity:** ${intake.currentAiUsage} — ${maturityDescriptions[intake.currentAiUsage] || "Assess from context."}
**Current Tools:** ${intake.currentTools.length > 0 ? intake.currentTools.join(", ") : "None specified"}
${intake.toolPreference ? `**Tool Approach:** ${intake.toolPreference}` : ""}
**Key Functions:** ${intake.primaryFunctions.join(", ")}
**Key Roles:** ${intake.keyRoles.join(", ")}
**Challenges:** ${intake.biggestChallenges.join("; ")}
**Goals:** ${intake.goals.join("; ")}
${intake.specificProblem ? `**Specific Problem to Solve:** ${intake.specificProblem}` : ""}
${intake.additionalContext ? `**Additional Context:** ${intake.additionalContext}` : ""}
${roleFocus}`;
}

function buildFeedbackContext(feedback?: StepFeedback[]): string {
  if (!feedback || feedback.length === 0) return "";
  const lines = ["\n## User Feedback from Previous Steps"];
  for (const fb of feedback) {
    lines.push(`\n### After Step: ${fb.step}`);
    if (fb.comments) lines.push(`Comments: ${fb.comments}`);
    if (fb.adjustments?.prioritize?.length) lines.push(`Prioritize: ${fb.adjustments.prioritize.join(", ")}`);
    if (fb.adjustments?.deprioritize?.length) lines.push(`Deprioritize: ${fb.adjustments.deprioritize.join(", ")}`);
  }
  return lines.join("\n");
}

function buildStepContextSection(stepContext?: StepContext): string {
  if (!stepContext) return "";
  const lines = ["\n## Context from Previous Analysis"];
  if (stepContext.documentInsights.length > 0) {
    lines.push("**Document Insights:** " + stepContext.documentInsights.join("; "));
  }
  if (stepContext.websiteSummary) lines.push("**Website Summary:** " + stepContext.websiteSummary);
  if (stepContext.extractedRoles?.length) lines.push("**Extracted Roles:** " + stepContext.extractedRoles.join(", "));
  if (stepContext.extractedProcesses?.length) lines.push("**Extracted Processes:** " + stepContext.extractedProcesses.join("; "));
  if (stepContext.additionalContext) lines.push("**Additional:** " + stepContext.additionalContext);
  return lines.join("\n");
}

function extractTextFromResponse(response: Anthropic.Message): string {
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

/** @internal Exported for testing */
export function parseJsonFromText(text: string): Record<string, unknown> | null {
  try {
    // Try markdown-fenced JSON first (```json ... ```)
    const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenced) {
      return JSON.parse(fenced[1].trim());
    }
    // Fall back to first { ... last }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse step JSON:", e);
  }
  return null;
}

/**
 * Shared Claude API call helper with retry logic.
 * 3 total attempts with exponential backoff (1s, 3s).
 * Detects empty/null responses as retriable failures.
 */
async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options?: { model?: string; maxTokens?: number; timeout?: number }
): Promise<Record<string, unknown> | null> {
  const maxAttempts = 3;
  const backoffMs = [1000, 3000];
  const timeoutMs = options?.timeout || 60000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await anthropic.messages.create(
        {
          model: options?.model || "claude-sonnet-4-6",
          max_tokens: options?.maxTokens || 4000,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userPrompt }],
        },
        { timeout: timeoutMs }
      );

      const text = extractTextFromResponse(response);
      if (!text || text.trim().length === 0) {
        console.warn(`[callClaude] Empty response on attempt ${attempt}/${maxAttempts}`);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, backoffMs[attempt - 1]));
          continue;
        }
        return null;
      }

      const parsed = parseJsonFromText(text);
      if (parsed === null && attempt < maxAttempts) {
        console.warn(`[callClaude] JSON parse failed on attempt ${attempt}/${maxAttempts}, retrying...`);
        await new Promise((r) => setTimeout(r, backoffMs[attempt - 1]));
        continue;
      }

      return parsed;
    } catch (err: unknown) {
      if (err instanceof Anthropic.APIConnectionTimeoutError) {
        console.error(`[callClaude] Timeout on attempt ${attempt}/${maxAttempts} (${timeoutMs}ms) — not retrying`);
        throw err;
      }

      const isRetriable =
        err instanceof Anthropic.APIConnectionError ||
        err instanceof Anthropic.RateLimitError ||
        err instanceof Anthropic.InternalServerError ||
        (err instanceof Anthropic.APIError && err.status === 529);

      if (isRetriable && attempt < maxAttempts) {
        console.warn(`[callClaude] Retriable error on attempt ${attempt}/${maxAttempts}: ${err instanceof Error ? err.message : err}`);
        await new Promise((r) => setTimeout(r, backoffMs[attempt - 1]));
        continue;
      }

      throw err;
    }
  }

  return null;
}

/**
 * Step 1: Organization Profile & Quick Wins
 * Processes files in memory, produces profile + quick wins + extractedContext
 */
export async function generateStep1Profile(
  intake: AssessmentIntake,
  fileContents: { name: string; category: string; text: string }[],
  websiteContent: string | null
): Promise<{
  report: Partial<AssessmentReport>;
  stepContext: StepContext;
}> {
  // PII strip
  const sanitizedFiles = fileContents.map((f) => {
    const result = stripPii(f.text);
    return { name: f.name, category: f.category, text: result.cleanedText, redactedCount: result.redactedCount };
  });
  const sanitizedWebsite = websiteContent ? stripPii(websiteContent).cleanedText : null;

  const template = getIndustryTemplate(intake.industry);
  // Skip research/evidence context for step 1 — it's extraction & profiling, not deep analysis
  // Steps 2-4 use these heavier contexts where they matter

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 1 of a 4-step assessment. Your job: understand the organization deeply and identify immediate AI opportunities.

Return valid JSON with these keys:
{
  "executiveSummary": "2-3 paragraphs speaking directly to the person about their biggest AI opportunities. Be specific to their work.",
  "organizationProfile": {
    "summary": "2-3 sentences about their work context",
    "industryContext": "2-3 sentences about AI trends in their industry. Cite research data if provided.",
    "aiReadinessScore": 1-10,
    "aiReadinessRationale": "2-3 sentences explaining WHY this specific score — what factors earned the points they got, and what's keeping them from a higher score. Be concrete: 'You scored 7 because X and Y, but you're not at 9 because Z.'",
    "aiReadinessNextSteps": ["2-3 specific actions to improve their readiness score — what would move them from current score toward 10"],
    "keyStrengths": ["2-3 strengths specific to their intake"],
    "keyGaps": ["2-3 gaps framed as opportunities"]
  },
  "quickWins": [
    {
      "title": "Short name for this quick win",
      "description": "What to do and why, in 2-3 sentences",
      "timeToImplement": "e.g. '30 minutes', '1 hour', 'this afternoon'",
      "impact": "high|medium|low",
      "toolSuggestion": "Specific tool name if applicable"
    }
  ],
  "extractedContext": {
    "documentInsights": ["Key findings from uploaded docs"],
    "websiteSummary": "1-2 sentence summary of their website/services",
    "extractedRoles": ["Roles identified from documents"],
    "extractedProcesses": ["Processes/workflows identified from documents"],
    "additionalContext": "Any other relevant context extracted"
  }
}

Generate 3-5 quick wins. These should be things they can try THIS WEEK.
For toolSuggestion in quick wins: many quick wins are best done with a general-purpose AI assistant (ChatGPT, Google Gemini, or Claude) rather than specialized software. For example, "Use ChatGPT or Gemini to draft your next meeting agenda" is a perfectly good quick win. Only suggest specialized tools when the task genuinely needs one.
The extractedContext will be carried to subsequent steps, so extract everything useful.`;

  let userPrompt = buildIntakeContext(intake);

  // Add file contents
  if (sanitizedFiles.length > 0) {
    userPrompt += `\n\n## Uploaded Documents (PII removed)\n`;
    for (const file of sanitizedFiles) {
      const truncated = file.text.length > 5000 ? file.text.slice(0, 5000) + "\n[...truncated]" : file.text;
      userPrompt += `\n### ${file.name} (${file.category})\n${truncated}\n`;
    }
  }

  if (sanitizedWebsite) {
    const truncated = sanitizedWebsite.length > 3000 ? sanitizedWebsite.slice(0, 3000) + "\n[...truncated]" : sanitizedWebsite;
    userPrompt += `\n\n## Website Content\n${truncated}`;
  }

  userPrompt += `\n\n## Industry Reference\n${template.departments.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, {
      model: "claude-haiku-4-5-20251001", // Haiku for speed — step 1 is extraction, not deep analysis
      maxTokens: 3000,
    });

    const validated = Step1ProfileSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 1 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step1 = validated.success ? validated.data : Step1ProfileSchema.parse({});

    const ctxValidated = StepContextSchema.safeParse(
      parsed?.extractedContext || step1.extractedContext || {}
    );
    const stepContext: StepContext = ctxValidated.success
      ? ctxValidated.data
      : StepContextSchema.parse({});

    return {
      report: {
        executiveSummary: step1.executiveSummary,
        organizationProfile: step1.organizationProfile,
        quickWins: step1.quickWins,
      },
      stepContext,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 1 Profile] Fatal error (${errName}): ${errMsg}`);
    const defaults = Step1ProfileSchema.parse({});
    return {
      report: {
        executiveSummary: defaults.executiveSummary,
        organizationProfile: defaults.organizationProfile,
        quickWins: defaults.quickWins,
      },
      stepContext: StepContextSchema.parse({}),
    };
  }
}

/**
 * Step 2: Task-by-Task Analysis
 * Uses step context + user feedback to produce detailed task analysis
 */
export async function generateStep2Tasks(
  intake: AssessmentIntake,
  previousReport: Partial<AssessmentReport>,
  stepContext?: StepContext,
  feedback?: StepFeedback[]
): Promise<Partial<AssessmentReport>> {
  const template = getIndustryTemplate(intake.industry);
  const onetSummary = getOnetSummaryForPrompt(intake.primaryFunctions, intake.industry);
  const capabilitiesContext = formatCapabilitiesForPrompt(intake.industry, intake.primaryFunctions);

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 2 of a 4-step assessment. Step 1 already produced an organization profile and quick wins. Your job: deep-dive into their specific tasks and roles.

CRITICAL RULE — Role-Based Tailoring:
The person's actual role and functions MUST drive your task recommendations. Do NOT default to the company's industry for task ideas.
- A People Ops person at a tech company needs HR tasks (onboarding workflows, performance review cycles, benefits administration, employee engagement surveys, PTO tracking, compliance documentation) — NOT software engineering or DevOps tasks.
- A finance person at a healthcare company needs accounting tasks (AP/AR, financial reporting, budget forecasting, expense management) — NOT clinical or patient care tasks.
- Look at the "Key Functions" and "Key Roles" fields in the intake. These tell you what the person actually does day-to-day. The "Industry" field tells you the domain context, not the job function.

AI Maturity Gating — The person's maturity level determines task complexity:
- "none"/"exploring": Focus on simple, single-tool tasks
- "piloting": Can handle moderate multi-step workflows
- "some-adoption"/"widespread": Ready for complex, integrated approaches

Example Tools — Be Practical:
For each task, suggest 1-3 example tools that could help. Include a MIX of:
1. **General-purpose AI assistants** (ChatGPT, Google Gemini, Claude) for tasks that don't need a specialized tool — things like drafting agendas, taking meeting notes, creating forms, brainstorming, summarizing documents, writing emails. Many tasks are best solved by simply prompting a general AI assistant, not buying dedicated software.
2. **Specialized/dedicated tools** from the tools KB when the task genuinely benefits from purpose-built software (e.g., CRM, accounting, project management).
3. **AI features in tools they already use** (e.g., Google Workspace has Gemini built in, Microsoft 365 has Copilot) — call these out when relevant.
Not every task needs a structured tool. For occasional or ad-hoc tasks (creating an agenda, drafting a one-off form, taking notes in a meeting), a general-purpose AI assistant IS the right recommendation.

Return valid JSON:
{
  "taskAnalysis": [
    {
      "taskName": "Specific task name",
      "department": "Area of work",
      "currentProcess": "How they do this today",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "Step-by-step explanation. Name specific tools where helpful, but for ad-hoc tasks just say 'use any AI assistant (ChatGPT, Gemini, Claude)'. If the person listed tools they already use (see Current Tools), reference how those specific tools can help with this task.",
      "expectedImpact": "e.g. '3-5 hours saved per week'",
      "complexity": "simple|moderate|complex",
      "estimatedTimeSaved": "e.g. '3-5 hrs/week'",
      "exampleTools": [{ "name": "Tool name", "url": "https://url", "free": true }],
      "gettingStarted": "One concrete first step that can be done RIGHT NOW with a chatbot — no setup, no signups. E.g., 'Open ChatGPT and paste your last 3 meeting agendas to get a template.' Not 'Set up automated dashboards in Asana.' The first step should feel easy and immediate.",
      "starterPrompt": "A ready-to-paste prompt the user can drop into ChatGPT, Claude, or Gemini to prototype this task immediately. Use [BRACKETS] for variables they fill in. E.g., 'I manage [TEAM SIZE] people. Here are my current project statuses: [PASTE STATUSES]. Create a concise weekly status update email for my leadership.'",
      "deploymentModel": "copilot|escalation|full-automation|agentic",
      "deploymentModelRationale": "Why this model fits"
    }
  ]
}

PROPORTIONALITY RULE: Match the distribution of recommendations to the distribution of the user's stated functions. If they listed 8 functions and mentioned grants once, do NOT make grants the focus of multiple tasks. Spread recommendations across their actual workload. If >30% of your tasks cluster on a function that represents <15% of their stated work, rebalance.

Generate 8-12 task analyses sorted by time impact (highest savings first). At least 80% of tasks MUST be directly relevant to the person's stated functions and roles — not generic industry tasks.
Use the user's feedback to adjust priorities. Reference their uploaded documents context.`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  if (previousReport.organizationProfile) {
    userPrompt += `\n\n## Step 1 Results\n**AI Readiness:** ${previousReport.organizationProfile.aiReadinessScore}/10\n**Key Strengths:** ${previousReport.organizationProfile.keyStrengths.join(", ")}\n**Key Gaps:** ${previousReport.organizationProfile.keyGaps.join(", ")}`;
  }

  userPrompt += `\n\n${onetSummary}`;
  // Filter departments to those matching the person's actual role/functions
  const relevantDepts = filterDepartmentsToRole(template.departments, intake);
  if (relevantDepts.length > 0) {
    userPrompt += `\n\n## Relevant Department Context (matched to this person's role)\n${relevantDepts.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;
  } else {
    // Fallback: show all departments but mark which ones match
    userPrompt += `\n\n## Industry Context\n${template.departments.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;
  }
  if (capabilitiesContext) userPrompt += `\n\n${capabilitiesContext}`;

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 8000, timeout: 300000 });

    let validated = Step2TasksSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 2 schema validation failed:", validated.error.flatten().fieldErrors);
      // Try to salvage individual tasks from the raw response
      const rawTasks = (parsed as Record<string, unknown>)?.taskAnalysis;
      if (Array.isArray(rawTasks) && rawTasks.length > 0) {
        // Unwrap ZodDefault → ZodArray → element
        const taskArraySchema = Step2TasksSchema.shape.taskAnalysis._def.innerType;
        const TaskSchema = taskArraySchema.element;
        const salvaged = rawTasks
          .map((t) => TaskSchema.safeParse(t))
          .filter((r) => r.success)
          .map((r) => (r as { success: true; data: unknown }).data);
        if (salvaged.length > 0) {
          console.log(`  Salvaged ${salvaged.length}/${rawTasks.length} tasks from partial response`);
          validated = { success: true, data: { taskAnalysis: salvaged } } as unknown as typeof validated;
        }
      }
    }
    const step2 = validated.success ? validated.data : Step2TasksSchema.parse({});

    return {
      taskAnalysis: step2.taskAnalysis as TaskAnalysis[],
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 2 Tasks] Fatal error (${errName}): ${errMsg}`);
    return {
      taskAnalysis: [] as TaskAnalysis[],
    };
  }
}

/**
 * Step 3: Tool Recommendations & Roadmap
 * Uses confirmed tasks + feedback to produce tools, roadmap, ROI
 */
export async function generateStep3Tools(
  intake: AssessmentIntake,
  previousReport: Partial<AssessmentReport>,
  stepContext?: StepContext,
  feedback?: StepFeedback[]
): Promise<Partial<AssessmentReport>> {
  // Pre-filter tools KB using Step 2 task signals to reduce prompt size
  const taskSignals = previousReport.taskAnalysis?.map((t) => ({
    department: t.department,
    taskName: t.taskName,
  }));
  const toolsRef = formatToolsForPrompt(intake.industry, intake.companySize, taskSignals);
  const onetSummary = getOnetSummaryForPrompt(intake.primaryFunctions, intake.industry);
  const researchContext = formatResearchContextForPrompt(intake.industry);

  const toolPrefInstructions: Record<string, string> = {
    "use-existing": `TOOL PREFERENCE: This person wants to ADD AI to tools they already use (${intake.currentTools.join(", ")}). Prioritize AI features within their existing stack — for each tool they listed, explain what AI capabilities it already has that they may not be using. Only suggest new tools if their current stack truly can't do it.`,
    "find-new": "TOOL PREFERENCE: This person is open to finding new AI-native tools. Recommend the best-fit tools regardless of their current stack.",
    "build-own": "TOOL PREFERENCE: This person wants to build custom AI solutions. Focus recommendations on APIs, frameworks, and platforms for building (e.g., API access, no-code AI builders, custom GPTs). Include off-the-shelf options as alternatives where appropriate.",
    "no-preference": `TOOL PREFERENCE: No strong preference. Show a mix of options — both AI features in tools they may already use and new purpose-built AI tools.${intake.currentTools.length > 0 ? ` They currently use: ${intake.currentTools.join(", ")}. For each tool they already have, note any AI features they may not be leveraging.` : ""}`,
  };
  const toolPrefNote = intake.toolPreference ? toolPrefInstructions[intake.toolPreference] : toolPrefInstructions["no-preference"];

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 3 of a 4-step assessment. Steps 1-2 produced a profile and task analysis. Your job: recommend tools for specific use cases, build a product-agnostic implementation roadmap, and project ROI.

${toolPrefNote}

Tool Recommendations — Product Examples:
- "start-here" (max 2): Priority Score ≥ 4.0, very easy to adopt
- "add-next" (max 3): Priority Score ≥ 3.0, builds on start-here tools
- "consider-later" (max 2): Priority Score ≥ 2.5, requires foundation
Max 6 tool categories total. Free before paid. Simple before powerful.
PROPORTIONALITY RULE: Tool recommendations must reflect the breadth of the user's actual work, not cluster on one function. If the task analysis covers 8 areas, tools should serve the highest-impact areas proportionally — not 3 tools for one niche function.
When tools from the knowledge base match, include them as concrete examples with real names, URLs, and pricing. But frame each recommendation around the USE CASE it solves, not the product itself.

General-Purpose AI Assistants (ChatGPT, Google Gemini, Claude):
Many use cases DON'T need a specialized tool. For ad-hoc and occasional tasks — writing meeting agendas, drafting forms, taking notes, brainstorming, summarizing documents, creating templates — recommend a general-purpose AI assistant as the tool. Include ChatGPT (free tier available), Google Gemini (especially if they use Google Workspace), and Claude as options. These are often the best "start-here" recommendation for people at lower AI maturity levels.
If someone already uses Google Workspace, call out that Gemini is built into Docs, Sheets, Gmail, etc.
If someone already uses Microsoft 365, call out that Copilot is built into Word, Excel, Outlook, etc.

CRITICAL — Implementation Roadmap Must Be Product-Agnostic:
The implementation roadmap and next steps must focus on USE CASES and CAPABILITIES, not specific products. Actions should describe WHAT to accomplish and WHY, not which tool to buy.
- Good: "Automate first-draft proposal generation — test with 5 real proposals this month"
- Bad: "Sign up for Jasper AI and connect it to your Google Docs"
- Good: "Set up automated client follow-up sequences triggered by intake form completion"
- Bad: "Install HubSpot and configure the sequences feature"
The tool recommendations section is where products live. The roadmap is where strategy lives.

Return valid JSON with ONLY toolRecommendations (roadmap and ROI are handled separately):
{
  "toolRecommendations": [
    {
      "category": "Use case category (e.g., 'Proposal & document drafting')",
      "toolName": "Specific product name from KB (optional — omit if no good match)",
      "recommendationTier": "start-here|add-next|consider-later",
      "purpose": "What use case this solves in their work",
      "whatItReplaces": "Specific manual process",
      "expectedValue": "Measurable benefit",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "Free tier + paid details + cost/hr math",
      "firstTask": "Concrete first task from their work",
      "upgradeSignal": "When to upgrade from free",
      "specificProducts": [{ "name": "Product", "url": "https://url", "pricing": "Free / $X/mo", "free": true }],
      "gettingStarted": ["Step 1", "Step 2", "Step 3"],
      "successKpis": ["Measurable KPI"]
    }
  ]
}`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  // Include task analysis from step 2
  if (previousReport.taskAnalysis?.length) {
    userPrompt += `\n\n## Confirmed Task Analysis (from Step 2)\n`;
    for (const task of previousReport.taskAnalysis) {
      userPrompt += `- **${task.taskName}** (${task.department}): ${task.aiOpportunity} opportunity, ${task.complexity} complexity, ~${task.estimatedTimeSaved || "unknown"} saved\n`;
    }
  }

  if (toolsRef) userPrompt += `\n\n${toolsRef}`;
  userPrompt += `\n\n${onetSummary}`;
  if (researchContext) userPrompt += `\n\n${researchContext}`;

  // Split into two parallel calls to cut wall-clock time roughly in half:
  // Call A: tool recommendations (the bulk of the output)
  // Call B: implementation roadmap + ROI projections (depends on task analysis, not tools)

  const roadmapSystemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 3B of an assessment. Steps 1-2 produced a profile and task analysis. Your job: build a product-agnostic implementation roadmap and project ROI.

CRITICAL — Implementation Roadmap Must Be Product-Agnostic:
The roadmap focuses on USE CASES and CAPABILITIES, not specific products. Actions describe WHAT to accomplish and WHY, not which tool to buy.
- Good: "Automate first-draft proposal generation — test with 5 real proposals this month"
- Bad: "Sign up for Jasper AI and connect it to your Google Docs"

Return valid JSON:
{
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "This week to 3 months",
      "objectives": ["Use-case-focused objectives"],
      "actions": [{ "title": "Action", "description": "What and why", "owner": "You / Your team", "priority": "critical|high|medium|low", "howTo": "Step-by-step approach" }],
      "expectedOutcomes": [],
      "estimatedInvestment": ""
    },
    "mediumTerm": { "timeframe": "3-6 months", "objectives": [], "actions": [], "expectedOutcomes": [], "estimatedInvestment": "" },
    "longTerm": { "timeframe": "6-12+ months", "objectives": [], "actions": [], "expectedOutcomes": [], "estimatedInvestment": "" }
  },
  "roiProjections": [
    {
      "area": "Area",
      "currentCost": "Show the math",
      "projectedSavings": "Specific",
      "timeToValue": "Specific",
      "confidence": "high|moderate|low",
      "basis": "Reasoning",
      "calculationDetail": "Full math"
    }
  ]
}`;

  // Build a lighter user prompt for roadmap (no tools KB needed)
  let roadmapUserPrompt = buildIntakeContext(intake);
  roadmapUserPrompt += buildStepContextSection(stepContext);
  roadmapUserPrompt += buildFeedbackContext(feedback);
  if (previousReport.taskAnalysis?.length) {
    roadmapUserPrompt += `\n\n## Confirmed Task Analysis (from Step 2)\n`;
    for (const task of previousReport.taskAnalysis) {
      roadmapUserPrompt += `- **${task.taskName}** (${task.department}): ${task.aiOpportunity} opportunity, ${task.complexity} complexity, ~${task.estimatedTimeSaved || "unknown"} saved\n`;
    }
  }
  if (researchContext) roadmapUserPrompt += `\n\n${researchContext}`;

  try {
    // Run both calls in parallel
    const [toolsParsed, roadmapParsed] = await Promise.all([
      callClaude(systemPrompt, userPrompt, { maxTokens: 5000, timeout: 300000 }),
      callClaude(roadmapSystemPrompt, roadmapUserPrompt, { maxTokens: 4000, timeout: 300000 }),
    ]);

    // Merge results from both calls
    const merged = {
      toolRecommendations: (toolsParsed as any)?.toolRecommendations || [],
      implementationRoadmap: (roadmapParsed as any)?.implementationRoadmap || (toolsParsed as any)?.implementationRoadmap,
      roiProjections: (roadmapParsed as any)?.roiProjections || (toolsParsed as any)?.roiProjections || [],
    };

    const validated = Step3ToolsSchema.safeParse(merged);
    if (!validated.success) {
      console.warn("Step 3 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step3 = validated.success ? validated.data : Step3ToolsSchema.parse({});

    return {
      toolRecommendations: step3.toolRecommendations,
      implementationRoadmap: step3.implementationRoadmap,
      roiProjections: step3.roiProjections,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 3 Tools] Fatal error (${errName}): ${errMsg}`);
    const defaults = Step3ToolsSchema.parse({});
    return {
      toolRecommendations: defaults.toolRecommendations,
      implementationRoadmap: defaults.implementationRoadmap,
      roiProjections: defaults.roiProjections,
    };
  }
}

/**
 * Step 4: Risk Assessment
 * Uses full report context + feedback to produce risks and next steps
 */
export async function generateStep4Risks(
  intake: AssessmentIntake,
  previousReport: Partial<AssessmentReport>,
  stepContext?: StepContext,
  feedback?: StepFeedback[]
): Promise<Partial<AssessmentReport>> {
  const researchContext = formatResearchContextForPrompt(intake.industry);
  const evidenceContext = formatEvidenceCitationsForPrompt(intake.industry);
  const capabilitiesContext = formatCapabilitiesForPrompt(intake.industry, intake.primaryFunctions);

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 4 (final) of a 4-step assessment. Steps 1-3 produced a profile, task analysis, tool recommendations, and roadmap. Your job: assess risks, identify skill gaps, and provide actionable next steps.

Return valid JSON:
{
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "riskContextNote": "1 sentence explaining what this risk level means. E.g., 'This assesses how likely AI is to significantly change or displace the core tasks in your role over the next 3-5 years.' Make clear this is about role displacement risk, NOT implementation risk.",
    "displacementRisk": "Honest but reassuring, grounded in research data. Recommend human capabilities that appreciate. Reference the 'Skills That Grow With AI' section for specific capabilities to develop — e.g., 'See the Skills That Grow With AI section below for detailed guidance on developing [capability name].'",
    "skillGaps": ["Specific skills to build. For each, reference the corresponding human capability from the capabilities section if one exists — e.g., 'Develop strategic communication skills (see Skills That Grow With AI: Stakeholder Communication for specific guidance)'. This creates a clear path from gap to action."],
    "changeManagementNotes": "Step-by-step advice with timeline",
    "dataPrivacyConsiderations": "Industry-specific, name regulations",
    "commonPitfalls": ["Industry-specific failure modes"],
    "resistanceSources": ["Where pushback comes from and how to address it"],
    "dataReadinessNote": "Honest assessment. Messy data is NOT a blocker."
  },
  "humanCapabilities": [
    {
      "name": "Capability name",
      "whyItMatters": "Why this specific capability becomes MORE valuable as AI handles routine work in their field. 2-3 sentences grounded in the capabilities data provided.",
      "howToDevelop": "1-2 concrete actions to strengthen this capability. Specific to their role.",
      "appreciationScore": 8
    }
  ],
  "furtherEvaluation": ["Generate 4-6 actionable, energizing next steps. These should be DIFFERENT from the implementation roadmap — focused on building on the context from this assessment. Include a mix of: (1) A 'Step 0' action to diagnose time sinks and grunt work in their current workflow, (2) A quick-win prototype — pick ONE task from the analysis and try it with a chatbot right now, (3) A conversation starter — spend 20 minutes discussing these results with a colleague, (4) A tool exploration — test a specific feature of an AI tool they already have access to, (5) A sample prompt they can paste into their LLM of choice along with this report to dig deeper into implementation. Make each step feel achievable in 20-30 minutes, not a multi-week project."]
}

For the risk assessment, cite research data provided.
For skills, reference the human capabilities framework AND cross-reference to the humanCapabilities section.
Be thorough on change management, common pitfalls, and resistance sources. These are high-value sections.
The riskContextNote MUST clarify that the risk level refers to AI displacement risk for this role, not implementation risk.

HUMAN CAPABILITIES — Generate 4-6 capabilities that APPRECIATE (grow in value) as AI automates routine tasks in this person's work. These are NOT generic soft skills. Each must be:
1. Specific to their actual functions and role
2. Backed by the capabilities framework data provided
3. Scored 7-10 on appreciation (how much MORE valuable this becomes with AI adoption)
4. Framed positively — "this is what makes you irreplaceable" not "this is what AI can't do"
Sort by appreciation score, highest first.`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  // Summarize what's been built so far
  if (previousReport.organizationProfile) {
    userPrompt += `\n\n## Organization Profile\nAI Readiness: ${previousReport.organizationProfile.aiReadinessScore}/10\nStrengths: ${previousReport.organizationProfile.keyStrengths.join(", ")}`;
  }
  if (previousReport.taskAnalysis?.length) {
    userPrompt += `\n\n## Tasks Identified (${previousReport.taskAnalysis.length} total)\n`;
    userPrompt += previousReport.taskAnalysis.slice(0, 5).map(t => `- ${t.taskName}: ${t.aiOpportunity} opportunity`).join("\n");
  }
  if (previousReport.toolRecommendations?.length) {
    userPrompt += `\n\n## Tools Recommended\n`;
    userPrompt += previousReport.toolRecommendations.map(t => `- ${t.toolName || t.category} (${t.recommendationTier})`).join("\n");
  }

  if (researchContext) userPrompt += `\n\n${researchContext}`;
  if (evidenceContext) userPrompt += `\n\n${evidenceContext}`;
  if (capabilitiesContext) userPrompt += `\n\n${capabilitiesContext}`;

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 4000, timeout: 300000 });

    const validated = Step4RisksSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 4 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step4 = validated.success ? validated.data : Step4RisksSchema.parse({});

    return {
      riskAssessment: step4.riskAssessment,
      furtherEvaluation: step4.furtherEvaluation,
      humanCapabilities: step4.humanCapabilities,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 4 Risks] Fatal error (${errName}): ${errMsg}`);
    const defaults = Step4RisksSchema.parse({});
    return {
      riskAssessment: defaults.riskAssessment,
      furtherEvaluation: defaults.furtherEvaluation,
      humanCapabilities: defaults.humanCapabilities,
    };
  }
}

// Legacy single-call pipeline removed in Phase 1 hardening.
// The 4-step sequential pipeline (generateStep1Profile through generateStep4Risks)
// is now the only code path. See CEO plan: 2026-04-04-assessment-pipeline.md

// EOF — legacy functions (buildSystemPrompt, buildUserPrompt, parseReportResponse) deleted.
