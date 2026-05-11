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
  Step3ToolsOnlySchema,
  Step3RoadmapSchema,
  Step3RoiSchema,
  Step4RisksSchema,
} from "./schemas";
import { CLAUDE_SONNET, CLAUDE_HAIKU } from "@/lib/claude-models";

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
    model: CLAUDE_SONNET,
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

/**
 * Attempt to repair truncated JSON by closing any unclosed strings, arrays,
 * and objects. Used as a fallback when Claude hits max_tokens mid-output.
 * @internal
 */
function repairTruncatedJson(text: string): string {
  let inString = false;
  let escaped = false;
  const stack: string[] = []; // tracks open { and [
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" && stack[stack.length - 1] === "{") stack.pop();
    else if (ch === "]" && stack[stack.length - 1] === "[") stack.pop();
  }

  let repaired = text;
  // Close any unterminated string. Truncation often lands mid-value.
  if (inString) repaired += '"';
  // Strip a trailing comma or partial key like ,"name" with no value
  repaired = repaired.replace(/,\s*"[^"]*"\s*:?\s*$/, "").replace(/,\s*$/, "");
  // Close open arrays/objects in reverse order
  while (stack.length) {
    const open = stack.pop();
    repaired += open === "{" ? "}" : "]";
  }
  return repaired;
}

/** @internal Exported for testing */
export function parseJsonFromText(text: string): Record<string, unknown> | null {
  // 1. Try markdown-fenced JSON first (```json ... ```)
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch { /* fall through */ }
  }

  // 2. Try first { ... last }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { /* fall through */ }
  }

  // 3. Truncation salvage: take from first { to end of string, attempt repair
  const firstBrace = text.indexOf("{");
  if (firstBrace >= 0) {
    const tail = text.slice(firstBrace);
    try {
      const repaired = repairTruncatedJson(tail);
      const parsed = JSON.parse(repaired);
      console.warn("[parseJsonFromText] Recovered from truncated JSON via repair");
      return parsed;
    } catch (e) {
      console.error("Failed to parse step JSON (including truncation salvage):", e instanceof Error ? e.message : e);
    }
  }

  // 4. Log a diagnostic snippet so we can see what Claude actually emitted
  console.error(
    "[parseJsonFromText] No parseable JSON found. " +
    `Length=${text.length}, head=${JSON.stringify(text.slice(0, 300))}, ` +
    `tail=${JSON.stringify(text.slice(-200))}`
  );
  return null;
}

/**
 * Shared Claude API call helper with retry logic.
 * Up to 3 attempts with exponential backoff (1s, 3s), but the wall-clock
 * across all attempts is capped at `timeout` ms — if a retry would push
 * us past the budget, we stop and throw the last error. This prevents a
 * rate-limit blip from blowing past Vercel's 300s function ceiling.
 * Detects empty/null responses as retriable failures.
 */
async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options?: { model?: string; maxTokens?: number; timeout?: number }
): Promise<Record<string, unknown> | null> {
  const maxAttempts = 3;
  const backoffMs = [1000, 3000];
  const totalBudgetMs = options?.timeout || 60000;
  const startedAt = Date.now();

  // Per-attempt timeout shrinks as we burn through the total budget so
  // a slow first attempt doesn't leave a retry no time to run.
  const remainingBudget = () => Math.max(0, totalBudgetMs - (Date.now() - startedAt));

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const attemptTimeout = remainingBudget();
    if (attemptTimeout <= 0) {
      console.error(`[callClaude] Budget exhausted before attempt ${attempt}/${maxAttempts}`);
      if (lastErr) throw lastErr;
      return null;
    }

    try {
      const response = await anthropic.messages.create(
        {
          model: options?.model || CLAUDE_SONNET,
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
        { timeout: attemptTimeout }
      );

      const text = extractTextFromResponse(response);
      if (!text || text.trim().length === 0) {
        console.warn(`[callClaude] Empty response on attempt ${attempt}/${maxAttempts}`);
        if (attempt < maxAttempts) {
          const wait = backoffMs[attempt - 1];
          if (wait + 5_000 < remainingBudget()) {
            await new Promise((r) => setTimeout(r, wait));
            continue;
          }
          console.error(`[callClaude] Skipping retry — insufficient budget remaining (${remainingBudget()}ms)`);
        }
        return null;
      }

      const parsed = parseJsonFromText(text);
      if (parsed === null && attempt < maxAttempts) {
        console.warn(`[callClaude] JSON parse failed on attempt ${attempt}/${maxAttempts}, retrying...`);
        const wait = backoffMs[attempt - 1];
        if (wait + 5_000 < remainingBudget()) {
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        console.error(`[callClaude] Skipping retry — insufficient budget remaining (${remainingBudget()}ms)`);
        return null;
      }

      return parsed;
    } catch (err: unknown) {
      lastErr = err;
      if (err instanceof Anthropic.APIConnectionTimeoutError) {
        console.error(`[callClaude] Timeout on attempt ${attempt}/${maxAttempts} (${attemptTimeout}ms) — not retrying`);
        throw err;
      }

      const isRetriable =
        err instanceof Anthropic.APIConnectionError ||
        err instanceof Anthropic.RateLimitError ||
        err instanceof Anthropic.InternalServerError ||
        (err instanceof Anthropic.APIError && err.status === 529);

      if (isRetriable && attempt < maxAttempts) {
        const wait = backoffMs[attempt - 1];
        if (wait + 5_000 >= remainingBudget()) {
          console.error(`[callClaude] Retriable error but budget would be exceeded — giving up: ${err instanceof Error ? err.message : err}`);
          throw err;
        }
        console.warn(`[callClaude] Retriable error on attempt ${attempt}/${maxAttempts}: ${err instanceof Error ? err.message : err}`);
        await new Promise((r) => setTimeout(r, wait));
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
      model: CLAUDE_HAIKU, // Haiku for speed — step 1 is extraction, not deep analysis
      maxTokens: 3000,
    });

    if (parsed === null) {
      throw new Error("Step 1 (profile) returned no parseable response from Claude");
    }

    const validated = Step1ProfileSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 1 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step1 = validated.success ? validated.data : Step1ProfileSchema.parse({});

    // Per-field salvage: if the full schema parse fell back to defaults but
    // Claude actually returned a non-empty executive summary, keep it.
    // The .catch() helpers cover most cases, but a totally malformed object
    // (e.g. parsed === [] or non-object) still drops to defaults.
    if (!validated.success && parsed && typeof parsed === "object") {
      const raw = parsed as Record<string, unknown>;
      if (typeof raw.executiveSummary === "string" && raw.executiveSummary.trim().length > 0) {
        step1.executiveSummary = raw.executiveSummary;
      }
    }

    if (!step1.executiveSummary || step1.executiveSummary.trim().length === 0) {
      console.error("[Step 1 Profile] Executive summary empty after parse — surfacing to client for retry");
      throw new Error("Step 1 produced an empty executive summary");
    }

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
    // Rethrow so the route returns 5xx and the client recovery path engages,
    // instead of silently writing empty defaults to the DB and producing a
    // blank executive summary in the final report.
    throw err instanceof Error ? err : new Error(errMsg);
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

WORD BUDGETS — keep each field tight. Longer is NOT better. Readers are skimming.
- currentProcess: one sentence, max ~20 words
- aiApproach: 1-2 sentences, max ~40 words
- expectedImpact: one short phrase, e.g. "3-5 hours saved per week"
- gettingStarted: one sentence, max ~25 words
- starterPrompt: 2-3 sentences max
- deploymentModelRationale: one short sentence

Return valid JSON:
{
  "taskAnalysis": [
    {
      "taskName": "Specific task name",
      "department": "Area of work",
      "currentProcess": "One sentence on how they do this today",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "1-2 sentences. Name specific tools where helpful, but for ad-hoc tasks just say 'use any AI assistant (ChatGPT, Gemini, Claude)'. If the person listed tools they already use, reference those.",
      "expectedImpact": "e.g. '3-5 hours saved per week'",
      "complexity": "simple|moderate|complex",
      "estimatedTimeSaved": "e.g. '3-5 hrs/week'",
      "exampleTools": [{ "name": "Tool name", "url": "https://url", "free": true }],
      "gettingStarted": "One concrete first step that can be done RIGHT NOW with a chatbot — no setup, no signups. E.g., 'Open ChatGPT and paste your last 3 meeting agendas to get a template.'",
      "starterPrompt": "A ready-to-paste prompt (2-3 sentences max) the user can drop into ChatGPT, Claude, or Gemini. Use [BRACKETS] for variables.",
      "deploymentModel": "copilot|escalation|full-automation|agentic",
      "deploymentModelRationale": "One short sentence on why this model fits"
    }
  ]
}

PROPORTIONALITY RULE: Match the distribution of recommendations to the distribution of the user's stated functions. If they listed 8 functions and mentioned grants once, do NOT make grants the focus of multiple tasks. Spread recommendations across their actual workload. If >30% of your tasks cluster on a function that represents <15% of their stated work, rebalance.

At least 80% of tasks MUST be directly relevant to the person's stated functions and roles — not generic industry tasks. Quality and tight framing beats quantity — readers were getting overwhelmed by 10+ tasks and skimming. The per-call focus instructions below set the exact count.
Use the user's feedback to adjust priorities. Reference their uploaded documents context.`;

  let baseUserPrompt = buildIntakeContext(intake);
  baseUserPrompt += buildStepContextSection(stepContext);
  baseUserPrompt += buildFeedbackContext(feedback);

  if (previousReport.organizationProfile) {
    baseUserPrompt += `\n\n## Step 1 Results\n**AI Readiness:** ${previousReport.organizationProfile.aiReadinessScore}/10\n**Key Strengths:** ${previousReport.organizationProfile.keyStrengths.join(", ")}\n**Key Gaps:** ${previousReport.organizationProfile.keyGaps.join(", ")}`;
  }

  baseUserPrompt += `\n\n${onetSummary}`;
  // Filter departments to those matching the person's actual role/functions
  const relevantDepts = filterDepartmentsToRole(template.departments, intake);
  if (relevantDepts.length > 0) {
    baseUserPrompt += `\n\n## Relevant Department Context (matched to this person's role)\n${relevantDepts.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;
  } else {
    // Fallback: show all departments but mark which ones match
    baseUserPrompt += `\n\n## Industry Context\n${template.departments.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;
  }
  if (capabilitiesContext) baseUserPrompt += `\n\n${capabilitiesContext}`;

  // Parallelize into two complementary calls to halve wall-clock and stay
  // well under Vercel's 300s function limit. Each leg asks for 3-4 tasks so
  // the merged, deduped output lands in the 6-8 range readers find scannable
  // (tester feedback flagged 10+ as overwhelming). max_tokens trimmed from
  // the old 4500 per leg to 3000 now that output is smaller and word budgets
  // apply — roughly 30% faster per leg.
  const timeSavingsFocus = `\n\n## YOUR FOCUS FOR THIS CALL\nGenerate 3-4 tasks focused on **TIME-SAVING AUTOMATION** — repetitive, high-hour-volume work where AI saves the most hours per week. Sort by hours saved, highest first. A parallel call is handling quality-uplift and new-capability tasks; do NOT duplicate those. Avoid tasks like "improve report quality" or "enable new analysis" — focus purely on speed/automation of existing work.`;
  const capabilityFocus = `\n\n## YOUR FOCUS FOR THIS CALL\nGenerate 3-4 tasks focused on **QUALITY UPLIFT AND NEW CAPABILITIES** — how AI can make outputs materially better, enable analysis/work that wasn't feasible before, or let the team take on more strategic responsibilities. A parallel call is handling time-saving automation; do NOT duplicate pure speed/efficiency tasks. Focus on: better decision quality, deeper analysis, faster iteration cycles, cross-team workflows, work that was previously too expensive to do.`;

  const parseAndSalvage = (parsed: unknown, callLabel: string): TaskAnalysis[] => {
    const validated = Step2TasksSchema.safeParse(parsed);
    if (validated.success) return validated.data.taskAnalysis as TaskAnalysis[];

    console.warn(`Step 2 ${callLabel} schema validation failed:`, validated.error.flatten().fieldErrors);
    const rawTasks = (parsed as Record<string, unknown>)?.taskAnalysis;
    if (Array.isArray(rawTasks) && rawTasks.length > 0) {
      const taskArraySchema = Step2TasksSchema.shape.taskAnalysis._def.innerType;
      const TaskSchema = taskArraySchema.element;
      const salvaged = rawTasks
        .map((t) => TaskSchema.safeParse(t))
        .filter((r) => r.success)
        .map((r) => (r as { success: true; data: unknown }).data) as TaskAnalysis[];
      if (salvaged.length > 0) {
        console.log(`  Salvaged ${salvaged.length}/${rawTasks.length} tasks from ${callLabel}`);
        return salvaged;
      }
    }
    return [];
  };

  try {
    const [timeCall, capabilityCall] = await Promise.allSettled([
      callClaude(systemPrompt, baseUserPrompt + timeSavingsFocus, { maxTokens: 3000, timeout: 180000 }),
      callClaude(systemPrompt, baseUserPrompt + capabilityFocus, { maxTokens: 3000, timeout: 180000 }),
    ]);

    const timeTasks = timeCall.status === "fulfilled"
      ? parseAndSalvage(timeCall.value, "time-savings call")
      : (console.error(`[Step 2 Tasks] time-savings call failed: ${timeCall.reason}`), []);
    const capabilityTasks = capabilityCall.status === "fulfilled"
      ? parseAndSalvage(capabilityCall.value, "capability call")
      : (console.error(`[Step 2 Tasks] capability call failed: ${capabilityCall.reason}`), []);

    // Dedupe by taskName (case-insensitive) in case the two calls overlap
    const seen = new Set<string>();
    const merged: TaskAnalysis[] = [];
    for (const t of [...timeTasks, ...capabilityTasks]) {
      const key = (t.taskName || "").toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(t);
    }

    if (merged.length === 0) {
      console.error("[Step 2 Tasks] Both calls produced zero usable tasks — surfacing to client for retry");
      throw new Error("Step 2 produced no usable tasks");
    }

    return { taskAnalysis: merged };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 2 Tasks] Fatal error (${errName}): ${errMsg}`);
    throw err instanceof Error ? err : new Error(errMsg);
  }
}

/**
 * Step 3: Tool Recommendations & Roadmap
 * Uses confirmed tasks + feedback to produce tools, roadmap, ROI
 */
/**
 * Step 3 (Tools): generate ONLY the tool recommendations.
 *
 * Split out from the original combined tools+roadmap+ROI step so that the
 * auto-pipeline can stop here and hand the user actionable tool picks fast.
 * Roadmap and ROI are now their own opt-in generators (`generateStep3Roadmap`,
 * `generateStep3Roi`) and run only when the user asks for them on the report
 * page. The previous combined call regularly took 2-3 minutes; this one
 * should land in 30-60s on a single Sonnet call.
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
  const researchContext = formatResearchContextForPrompt(intake.industry);

  const toolPrefInstructions: Record<string, string> = {
    "use-existing": `TOOL PREFERENCE: This person wants to ADD AI to tools they already use (${intake.currentTools.join(", ")}). Prioritize AI features within their existing stack — for each tool they listed, explain what AI capabilities it already has that they may not be using. Only suggest new tools if their current stack truly can't do it.`,
    "find-new": "TOOL PREFERENCE: This person is open to finding new AI-native tools. Recommend the best-fit tools regardless of their current stack.",
    "build-own": "TOOL PREFERENCE: This person wants to build custom AI solutions. Focus recommendations on APIs, frameworks, and platforms for building (e.g., API access, no-code AI builders, custom GPTs). Include off-the-shelf options as alternatives where appropriate.",
    "no-preference": `TOOL PREFERENCE: No strong preference. Show a mix of options — both AI features in tools they may already use and new purpose-built AI tools.${intake.currentTools.length > 0 ? ` They currently use: ${intake.currentTools.join(", ")}. For each tool they already have, note any AI features they may not be leveraging.` : ""}`,
  };
  const toolPrefNote = intake.toolPreference ? toolPrefInstructions[intake.toolPreference] : toolPrefInstructions["no-preference"];

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running the Tools step of a multi-part assessment. Earlier steps produced a profile and a task analysis. Your job — and ONLY your job — is to recommend specific AI tools for the highest-impact tasks. Roadmap and ROI are produced by separate, opt-in steps later, so do not include them here.

${toolPrefNote}

Tool Recommendations — Product Examples:
- "start-here" (max 2): Priority Score ≥ 4.0, very easy to adopt
- "add-next" (max 2): Priority Score ≥ 3.0, builds on start-here tools
- "consider-later" (max 1): Priority Score ≥ 2.5, requires foundation
Max 4-5 tool categories total. Free before paid. Simple before powerful. Tight beats thorough.
PROPORTIONALITY RULE: Tool recommendations must reflect the breadth of the user's actual work, not cluster on one function. If the task analysis covers 8 areas, tools should serve the highest-impact areas proportionally — not 3 tools for one niche function.
When tools from the knowledge base match, include them as concrete examples with real names, URLs, and pricing. But frame each recommendation around the USE CASE it solves, not the product itself.

General-Purpose AI Assistants (ChatGPT, Google Gemini, Claude):
Many use cases DON'T need a specialized tool. For ad-hoc and occasional tasks — writing meeting agendas, drafting forms, taking notes, brainstorming, summarizing documents, creating templates — recommend a general-purpose AI assistant as the tool. Include ChatGPT (free tier available), Google Gemini (especially if they use Google Workspace), and Claude as options. These are often the best "start-here" recommendation for people at lower AI maturity levels.
If someone already uses Google Workspace, call out that Gemini is built into Docs, Sheets, Gmail, etc.
If someone already uses Microsoft 365, call out that Copilot is built into Word, Excel, Outlook, etc.

CRITICAL OUTPUT FORMAT: Your entire response must be a single valid JSON object and nothing else. No prose before, no prose after, no markdown fences. Start your response with the opening { character. Keep field values concise — long prose fields risk hitting the output limit mid-string and breaking JSON parsing.

Return valid JSON with ONLY a toolRecommendations array (no roadmap, no ROI):
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

  // Include task analysis from step 2 — cap at 10 tasks to bound prompt size
  if (previousReport.taskAnalysis?.length) {
    const topTasks = [...previousReport.taskAnalysis]
      .sort((a, b) => (b.aiOpportunity === "high" ? 1 : 0) - (a.aiOpportunity === "high" ? 1 : 0))
      .slice(0, 10);
    userPrompt += `\n\n## Confirmed Task Analysis (from Step 2)\n`;
    for (const task of topTasks) {
      userPrompt += `- **${task.taskName}** (${task.department}): ${task.aiOpportunity} opportunity, ${task.complexity} complexity, ~${task.estimatedTimeSaved || "unknown"} saved\n`;
    }
  }

  if (toolsRef) userPrompt += `\n\n${toolsRef}`;
  // Skip onetSummary from tools call — it's large and tools don't need it
  if (researchContext) userPrompt += `\n\n${researchContext}`;

  try {
    // Single-purpose call: tools only. Switched to Haiku — Sonnet was
    // regularly hitting the 240s timeout even on the trimmed prompt. Tool
    // recommendations are structured/extractive generation (categories,
    // tiers, pricing, getting-started steps), well within Haiku's capability
    // band, and Haiku is roughly 3-5× faster. max_tokens raised to 4500
    // after observing truncation failures at 3000 — Haiku is fast enough
    // that the headroom is essentially free latency-wise, and unclosed
    // JSON failures are far worse than slightly slower responses.
    const parsed = await callClaude(systemPrompt, userPrompt, {
      model: CLAUDE_HAIKU,
      maxTokens: 4500,
      timeout: 180000,
    });

    if (parsed === null) {
      throw new Error("Step 3 (tools) returned no parseable response from Claude");
    }

    const validated = Step3ToolsOnlySchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 3 (tools) schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step3 = validated.success ? validated.data : Step3ToolsOnlySchema.parse({});

    if (step3.toolRecommendations.length === 0) {
      console.error("[Step 3 Tools] No tool recommendations after parse — surfacing to client for retry");
      throw new Error("Step 3 produced no tool recommendations");
    }

    return { toolRecommendations: step3.toolRecommendations };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 3 Tools] Fatal error (${errName}): ${errMsg}`);
    throw err instanceof Error ? err : new Error(errMsg);
  }
}

/**
 * Step 3 (Roadmap): generate ONLY the implementation roadmap. Opt-in.
 *
 * Runs after the user has reviewed tools and clicks "Generate roadmap" on
 * the report page. Single Sonnet call, no tools KB — depends only on the
 * intake + task analysis + already-generated tool recommendations.
 */
export async function generateStep3Roadmap(
  intake: AssessmentIntake,
  previousReport: Partial<AssessmentReport>,
  stepContext?: StepContext,
  feedback?: StepFeedback[]
): Promise<Partial<AssessmentReport>> {
  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are generating the Implementation Roadmap section of an assessment. Earlier steps produced a profile, task analysis, and a list of recommended tools. Your job — and ONLY your job — is to build a product-agnostic 12-month roadmap.

CRITICAL — Roadmap Must Be Product-Agnostic:
The roadmap focuses on USE CASES and CAPABILITIES, not specific products. Actions describe WHAT to accomplish and WHY, not which tool to buy.
- Good: "Automate first-draft proposal generation — test with 5 real proposals this month"
- Bad: "Sign up for Jasper AI and connect it to your Google Docs"

WORD BUDGETS — readers were getting overwhelmed by long roadmaps. Keep it tight.
- Per phase: 2-4 objectives, 3-5 actions, 2-3 expectedOutcomes. Do NOT exceed these caps.
- action.description: one sentence, max ~20 words
- action.howTo: 1-2 short sentences, max ~35 words
- objectives and expectedOutcomes: one short phrase each, not full sentences

Return valid JSON with ONLY an implementationRoadmap object:
{
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "This week to 3 months",
      "objectives": ["Short phrase"],
      "actions": [{ "title": "Action", "description": "One sentence: what and why", "owner": "You / Your team", "priority": "critical|high|medium|low", "howTo": "1-2 short sentences" }],
      "expectedOutcomes": ["Short phrase"],
      "estimatedInvestment": "Short phrase"
    },
    "mediumTerm": { "timeframe": "3-6 months", "objectives": [], "actions": [], "expectedOutcomes": [], "estimatedInvestment": "" },
    "longTerm": { "timeframe": "6-12+ months", "objectives": [], "actions": [], "expectedOutcomes": [], "estimatedInvestment": "" }
  }
}`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  if (previousReport.taskAnalysis?.length) {
    const topTasks = [...previousReport.taskAnalysis]
      .sort((a, b) => (b.aiOpportunity === "high" ? 1 : 0) - (a.aiOpportunity === "high" ? 1 : 0))
      .slice(0, 10);
    userPrompt += `\n\n## Confirmed Task Analysis\n`;
    for (const task of topTasks) {
      userPrompt += `- **${task.taskName}** (${task.department}): ${task.aiOpportunity} opportunity, ~${task.estimatedTimeSaved || "unknown"} saved\n`;
    }
  }

  if (previousReport.toolRecommendations?.length) {
    userPrompt += `\n\n## Tools Already Recommended\n`;
    for (const t of previousReport.toolRecommendations) {
      userPrompt += `- ${t.toolName || t.category} (${t.recommendationTier || t.priorityTier}): ${t.purpose}\n`;
    }
  }

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, {
      maxTokens: 4000,
      timeout: 240000,
    });

    if (parsed === null) {
      throw new Error("Step 3 (roadmap) returned no parseable response from Claude");
    }

    const validated = Step3RoadmapSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 3 (roadmap) schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step3 = validated.success ? validated.data : Step3RoadmapSchema.parse({});

    return { implementationRoadmap: step3.implementationRoadmap };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 3 Roadmap] Fatal error (${errName}): ${errMsg}`);
    throw err instanceof Error ? err : new Error(errMsg);
  }
}

/**
 * Step 3 (ROI): generate ONLY the ROI projections. Opt-in.
 *
 * Single Sonnet call. Uses task analysis + tool recommendations to produce
 * cost/savings/time-to-value estimates with shown math.
 */
export async function generateStep3Roi(
  intake: AssessmentIntake,
  previousReport: Partial<AssessmentReport>,
  stepContext?: StepContext,
  feedback?: StepFeedback[]
): Promise<Partial<AssessmentReport>> {
  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are generating the ROI Projections section of an assessment. Earlier steps produced a profile, task analysis, and tool recommendations. Your job — and ONLY your job — is to project the ROI of the highest-impact areas. Show the math.

Return valid JSON with ONLY a roiProjections array:
{
  "roiProjections": [
    {
      "area": "Specific area of work, not generic",
      "currentCost": "Show the math: hours/week × $/hr or $/month",
      "projectedSavings": "Concrete dollar or hour figure",
      "timeToValue": "How quickly this pays back: weeks, 1 month, 3 months",
      "confidence": "high|moderate|low",
      "basis": "Why you can project this — what assumption or evidence",
      "calculationDetail": "Full math: e.g., '3 hrs/wk × $50/hr × 50 wks = $7,500/yr saved'"
    }
  ]
}

Generate 3-5 ROI projections. Pick areas with the largest impact. Be specific with numbers — never vague.`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  if (previousReport.taskAnalysis?.length) {
    const topTasks = [...previousReport.taskAnalysis]
      .sort((a, b) => (b.aiOpportunity === "high" ? 1 : 0) - (a.aiOpportunity === "high" ? 1 : 0))
      .slice(0, 10);
    userPrompt += `\n\n## Confirmed Task Analysis\n`;
    for (const task of topTasks) {
      userPrompt += `- **${task.taskName}** (${task.department}): ${task.aiOpportunity} opportunity, ~${task.estimatedTimeSaved || "unknown"} saved\n`;
    }
  }

  if (previousReport.toolRecommendations?.length) {
    userPrompt += `\n\n## Tools Already Recommended\n`;
    for (const t of previousReport.toolRecommendations) {
      userPrompt += `- ${t.toolName || t.category}: ${t.purpose}${t.estimatedMonthlyCost ? ` (cost: ${t.estimatedMonthlyCost})` : ""}\n`;
    }
  }

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, {
      maxTokens: 3000,
      timeout: 240000,
    });

    if (parsed === null) {
      throw new Error("Step 3 (ROI) returned no parseable response from Claude");
    }

    const validated = Step3RoiSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 3 (ROI) schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step3 = validated.success ? validated.data : Step3RoiSchema.parse({});

    return { roiProjections: step3.roiProjections };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 3 ROI] Fatal error (${errName}): ${errMsg}`);
    throw err instanceof Error ? err : new Error(errMsg);
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

Return valid JSON. Do NOT include a "furtherEvaluation" array or a "changeManagementNotes" field — those sections were removed because they duplicated the implementation roadmap. Any change-management guidance belongs inside the roadmap's action list (handled by Step 3), not here.

{
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "riskContextNote": "1 sentence explaining what this risk level means. E.g., 'This assesses how likely AI is to significantly change or displace the core tasks in your role over the next 3-5 years.' Make clear this is about role displacement risk, NOT implementation risk.",
    "displacementRisk": "Honest but reassuring, grounded in research data. Recommend human capabilities that appreciate. Reference the 'Skills That Grow With AI' section for specific capabilities to develop — e.g., 'See the Skills That Grow With AI section below for detailed guidance on developing [capability name].'",
    "skillGaps": ["Specific skills to build. For each, reference the corresponding human capability from the capabilities section if one exists — e.g., 'Develop strategic communication skills (see Skills That Grow With AI: Stakeholder Communication for specific guidance)'. This creates a clear path from gap to action."],
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
  ]
}

For the risk assessment, cite research data provided.
For skills, reference the human capabilities framework AND cross-reference to the humanCapabilities section.
Be thorough on common pitfalls and resistance sources. These are high-value sections that readers use to stress-test their rollout.
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
    // Total wall-clock cap of 240s leaves ~60s of headroom under Vercel's 300s
    // function ceiling for DB writes and response serialization. The prior
    // 300s timeout could collide with maxDuration and cause the function to
    // abort mid-write.
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 4000, timeout: 240000 });

    if (parsed === null) {
      throw new Error("Step 4 (risks) returned no parseable response from Claude");
    }

    const validated = Step4RisksSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 4 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step4 = validated.success ? validated.data : Step4RisksSchema.parse({});

    if (!step4.riskAssessment.displacementRisk || step4.riskAssessment.displacementRisk.trim().length === 0) {
      console.error("[Step 4 Risks] Empty displacement risk — surfacing to client for retry");
      throw new Error("Step 4 produced an empty risk assessment");
    }

    return {
      riskAssessment: step4.riskAssessment,
      furtherEvaluation: step4.furtherEvaluation,
      humanCapabilities: step4.humanCapabilities,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 4 Risks] Fatal error (${errName}): ${errMsg}`);
    throw err instanceof Error ? err : new Error(errMsg);
  }
}

// Legacy single-call pipeline removed in Phase 1 hardening.
// The 4-step sequential pipeline (generateStep1Profile through generateStep4Risks)
// is now the only code path. See CEO plan: 2026-04-04-assessment-pipeline.md

// EOF — legacy functions (buildSystemPrompt, buildUserPrompt, parseReportResponse) deleted.
