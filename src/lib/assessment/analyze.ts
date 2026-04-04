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
import { getIndustryTemplate } from "./taxonomy";
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

FACTUAL ACCURACY: NEVER fabricate statistics, URLs, case studies, or research findings. Only cite data provided to you.`;

function buildIntakeContext(intake: AssessmentIntake): string {
  const maturityDescriptions: Record<string, string> = {
    "none": "Has NOT used AI tools yet. Start with the absolute basics.",
    "exploring": "Has tried ChatGPT or similar a few times. Ready for 1 general-purpose AI + 1 task-specific tool.",
    "piloting": "Uses AI occasionally. Ready for 2-3 tools with integration between them.",
    "some-adoption": "AI is part of regular workflow. Focus on optimizing existing tools + 1-2 additions.",
    "widespread": "Uses AI tools daily. Ready for advanced use cases and automation.",
  };

  return `## Who This Is For
**Organization:** ${intake.organizationName}
**Industry:** ${intake.industry}${intake.industryDetail ? ` (${intake.industryDetail})` : ""}
**Size:** ${intake.companySize} people
**Scope:** ${intake.assessmentScope}
${intake.departmentName ? `**Department:** ${intake.departmentName}` : ""}
${intake.teamDescription ? `**Team/Role:** ${intake.teamDescription}` : ""}

**AI Maturity:** ${intake.currentAiUsage} — ${maturityDescriptions[intake.currentAiUsage] || "Assess from context."}
**Current Tools:** ${intake.currentTools.length > 0 ? intake.currentTools.join(", ") : "None specified"}
**Key Functions:** ${intake.primaryFunctions.join(", ")}
**Key Roles:** ${intake.keyRoles.join(", ")}
**Challenges:** ${intake.biggestChallenges.join("; ")}
**Goals:** ${intake.goals.join("; ")}
${intake.additionalContext ? `**Additional Context:** ${intake.additionalContext}` : ""}`;
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
          model: options?.model || "claude-sonnet-4-20250514",
          max_tokens: options?.maxTokens || 4000,
          system: systemPrompt,
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
      const isTimeout =
        err instanceof Error &&
        (err.name === "APIConnectionTimeoutError" ||
          err.message?.includes("timeout"));

      const isRetriable =
        !isTimeout &&
        err instanceof Error &&
        (err.name === "APIConnectionError" ||
          err.message?.includes("ECONNRESET") ||
          (err as { status?: number }).status === 429 ||
          (err as { status?: number }).status === 529 ||
          ((err as { status?: number }).status ?? 0) >= 500);

      if (isTimeout) {
        console.error(`[callClaude] Timeout on attempt ${attempt}/${maxAttempts} (${timeoutMs}ms) — not retrying`);
        throw err;
      }

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

AI Maturity Gating — The person's maturity level determines task complexity:
- "none"/"exploring": Focus on simple, single-tool tasks
- "piloting": Can handle moderate multi-step workflows
- "some-adoption"/"widespread": Ready for complex, integrated approaches

Return valid JSON:
{
  "taskAnalysis": [
    {
      "taskName": "Specific task name",
      "department": "Area of work",
      "currentProcess": "How they do this today",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "Step-by-step explanation naming specific tools",
      "expectedImpact": "e.g. '3-5 hours saved per week'",
      "complexity": "simple|moderate|complex",
      "estimatedTimeSaved": "e.g. '3-5 hrs/week'",
      "exampleTools": [{ "name": "Tool name", "url": "https://url", "free": true }],
      "gettingStarted": "One concrete sentence",
      "deploymentModel": "copilot|escalation|full-automation|agentic",
      "deploymentModelRationale": "Why this model fits"
    }
  ]
}

Generate 8-12 task analyses sorted by time impact (highest savings first).
Use the user's feedback to adjust priorities. Reference their uploaded documents context.`;

  let userPrompt = buildIntakeContext(intake);
  userPrompt += buildStepContextSection(stepContext);
  userPrompt += buildFeedbackContext(feedback);

  if (previousReport.organizationProfile) {
    userPrompt += `\n\n## Step 1 Results\n**AI Readiness:** ${previousReport.organizationProfile.aiReadinessScore}/10\n**Key Strengths:** ${previousReport.organizationProfile.keyStrengths.join(", ")}\n**Key Gaps:** ${previousReport.organizationProfile.keyGaps.join(", ")}`;
  }

  userPrompt += `\n\n${onetSummary}`;
  userPrompt += `\n\n## Industry Context\n${template.departments.map((d) => `- ${d.name}: ${d.aiOpportunityAreas.join(", ")}`).join("\n")}`;
  if (capabilitiesContext) userPrompt += `\n\n${capabilitiesContext}`;

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 8000, timeout: 180000 });

    const validated = Step2TasksSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 2 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step2 = validated.success ? validated.data : Step2TasksSchema.parse({});

    return {
      taskAnalysis: step2.taskAnalysis,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 2 Tasks] Fatal error (${errName}): ${errMsg}`);
    return {
      taskAnalysis: Step2TasksSchema.parse({}).taskAnalysis,
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
  const toolsRef = formatToolsForPrompt(intake.industry, intake.companySize);
  const onetSummary = getOnetSummaryForPrompt(intake.primaryFunctions, intake.industry);
  const researchContext = formatResearchContextForPrompt(intake.industry);

  const systemPrompt = `${CONSULTING_PHILOSOPHY}

You are running Step 3 of a 4-step assessment. Steps 1-2 produced a profile and task analysis. Your job: recommend specific tools, build an implementation roadmap, and project ROI.

Tool Prioritization:
- "start-here" (max 2): Priority Score ≥ 4.0, very easy to adopt
- "add-next" (max 3): Priority Score ≥ 3.0, builds on start-here tools
- "consider-later" (max 2): Priority Score ≥ 2.5, requires foundation
Max 6 tools total. Free before paid. Simple before powerful.

ONLY recommend tools from the tools knowledge base provided. Use exact names, URLs, pricing.

Return valid JSON:
{
  "toolRecommendations": [
    {
      "toolName": "Specific product name",
      "category": "General category",
      "recommendationTier": "start-here|add-next|consider-later",
      "purpose": "What it does for their work",
      "whatItReplaces": "Specific manual process",
      "expectedValue": "Measurable benefit",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "Free tier + paid details + cost/hr math",
      "learningTime": "Honest estimate",
      "firstTask": "Concrete first task from their work",
      "upgradeSignal": "When to upgrade from free",
      "specificProducts": [{ "name": "Product", "url": "https://url", "pricing": "Free / $X/mo", "free": true }],
      "gettingStarted": ["Step 1", "Step 2", "Step 3"],
      "successKpis": ["Measurable KPI"]
    }
  ],
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "This week to 3 months",
      "objectives": [],
      "actions": [{ "title": "", "description": "", "owner": "You / Your team", "priority": "critical|high|medium|low", "howTo": "" }],
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

  try {
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 8000, timeout: 180000 });

    const validated = Step3ToolsSchema.safeParse(parsed);
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
 * Step 4: Risk Assessment & Policy
 * Uses full report context + feedback to produce risks, policy, prompts
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

You are running Step 4 (final) of a 4-step assessment. Steps 1-3 produced a profile, task analysis, tool recommendations, and roadmap. Your job: assess risks, recommend skills to invest in, create an AI policy, and build a prompt library.

Return valid JSON:
{
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "displacementRisk": "Honest but reassuring, grounded in research data. Recommend human capabilities that appreciate.",
    "skillGaps": ["Specific skills to build, referencing capabilities data"],
    "changeManagementNotes": "Step-by-step advice with timeline",
    "dataPrivacyConsiderations": "Industry-specific, name regulations",
    "commonPitfalls": ["Industry-specific failure modes"],
    "resistanceSources": ["Where pushback comes from and how to address it"],
    "dataReadinessNote": "Honest assessment. Messy data is NOT a blocker."
  },
  "furtherEvaluation": ["Specific, actionable next steps. No fabricated URLs."],
  "aiPolicy": {
    "sections": [
      { "title": "Section title", "content": "Practical guidelines" }
    ]
  },
  "promptLibrary": [
    {
      "title": "Prompt name",
      "department": "Work area",
      "useCase": "What this helps with",
      "prompt": "Full copy-paste prompt with [BRACKETS] for variables",
      "tips": ["Tip 1", "Tip 2"]
    }
  ]
}

For the risk assessment, cite research data provided.
For skills, reference the human capabilities framework.
For the prompt library, generate 8-12 prompts tailored to their actual tasks.
Make the AI policy practical, not legalistic. Write in second person ("you").`;

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
    const parsed = await callClaude(systemPrompt, userPrompt, { maxTokens: 8000, timeout: 180000 });

    const validated = Step4RisksSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("Step 4 schema validation failed, using defaults:", validated.error.flatten().fieldErrors);
    }
    const step4 = validated.success ? validated.data : Step4RisksSchema.parse({});

    return {
      riskAssessment: step4.riskAssessment,
      furtherEvaluation: step4.furtherEvaluation,
      aiPolicy: step4.aiPolicy,
      promptLibrary: step4.promptLibrary,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[Step 4 Risks] Fatal error (${errName}): ${errMsg}`);
    const defaults = Step4RisksSchema.parse({});
    return {
      riskAssessment: defaults.riskAssessment,
      furtherEvaluation: defaults.furtherEvaluation,
      aiPolicy: defaults.aiPolicy,
      promptLibrary: defaults.promptLibrary,
    };
  }
}

// Legacy single-call pipeline removed in Phase 1 hardening.
// The 4-step sequential pipeline (generateStep1Profile through generateStep4Risks)
// is now the only code path. See CEO plan: 2026-04-04-assessment-pipeline.md

// EOF — legacy functions (buildSystemPrompt, buildUserPrompt, parseReportResponse) deleted.
