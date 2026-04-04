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
    max_tokens: mode === "preview" ? 6000 : 16000,
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

function parseJsonFromText(text: string): Record<string, unknown> | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse step JSON:", e);
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

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001", // Haiku for speed — step 1 is extraction, not deep analysis
    max_tokens: 3000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractTextFromResponse(response);
  const parsed = parseJsonFromText(text);

  const extractedCtx = (parsed?.extractedContext as Record<string, unknown>) || {};
  const stepContext: StepContext = {
    documentInsights: (extractedCtx.documentInsights as string[]) || [],
    websiteSummary: (extractedCtx.websiteSummary as string) || undefined,
    extractedRoles: (extractedCtx.extractedRoles as string[]) || undefined,
    extractedProcesses: (extractedCtx.extractedProcesses as string[]) || undefined,
    additionalContext: (extractedCtx.additionalContext as string) || undefined,
  };

  return {
    report: {
      executiveSummary: (parsed?.executiveSummary as string) || "",
      organizationProfile: (parsed?.organizationProfile as OrganizationProfile) || {
        summary: "", industryContext: "", aiReadinessScore: 5, keyStrengths: [], keyGaps: [],
      },
      quickWins: (parsed?.quickWins as QuickWin[]) || [],
    },
    stepContext,
  };
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractTextFromResponse(response);
  const parsed = parseJsonFromText(text);

  return {
    taskAnalysis: (parsed?.taskAnalysis as TaskAnalysis[]) || [],
  };
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractTextFromResponse(response);
  const parsed = parseJsonFromText(text);

  return {
    toolRecommendations: (parsed?.toolRecommendations as ToolRecommendation[]) || [],
    implementationRoadmap: (parsed?.implementationRoadmap as ImplementationRoadmap) || {
      immediate: { timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [] },
      mediumTerm: { timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [] },
      longTerm: { timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [] },
    },
    roiProjections: (parsed?.roiProjections as RoiProjection[]) || [],
  };
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractTextFromResponse(response);
  const parsed = parseJsonFromText(text);

  return {
    riskAssessment: (parsed?.riskAssessment as RiskAssessment) || {
      overallRiskLevel: "moderate",
      displacementRisk: "",
      skillGaps: [],
      changeManagementNotes: "",
      dataPrivacyConsiderations: "",
    },
    furtherEvaluation: (parsed?.furtherEvaluation as string[]) || [],
    aiPolicy: parsed?.aiPolicy as AssessmentReport["aiPolicy"],
    promptLibrary: parsed?.promptLibrary as AssessmentReport["promptLibrary"],
  };
}

// ============================================================================
// LEGACY SINGLE-CALL PIPELINE (kept as fallback)
// ============================================================================

function buildSystemPrompt(mode: "preview" | "full"): string {
  const base = `You are an experienced small business technology consultant specializing in AI tool adoption. Your clients are busy operators — nonprofit directors, small business owners, department leads, solo professionals — who need clear, prioritized, actionable guidance, not a technology showcase.

## Your Consulting Philosophy

**Start with the work, not the tool.** Every recommendation begins with what the person actually does all day — the tasks that eat their time, the bottlenecks that frustrate them, the quality gaps they know exist but can't fix because they're stretched thin.

**Prioritize ruthlessly.** Most small organizations can absorb 1-2 new tools at a time. Recommending 8 tools at once is the same as recommending zero. Your job is to sequence: what first, what next, what later, what never.

**Free before paid. Simple before powerful.** A tool they actually use beats a tool that's theoretically better.

**Measure in hours, not features.** Decision-makers care about: "How many hours per week does this save me?" and "How long until I see results?" Not feature comparisons.

## Deep Contextualization Rules

You will receive detailed intake data including the person's AI maturity level, their specific work functions, their team structure, uploaded documents about their organization, and possibly their website content. USE ALL OF THIS to contextualize every recommendation:

**AI Maturity Gating** — The person's current AI maturity level determines what tools are appropriate:
| Maturity | What They Need | What They Don't Need |
|---|---|---|
| **none** | A single general-purpose AI (Claude or ChatGPT, free tier). Full stop. Everything else waits. | Vertical SaaS, automation platforms, multi-tool workflows |
| **exploring** | 1 general-purpose AI + 1 task-specific tool for their biggest time sink | Complex integrations, agentic workflows, enterprise platforms |
| **piloting** | 2-3 tools addressing top pain points, with integration between them | More than 3 new tools, custom development |
| **some-adoption** | Optimization of existing tools + 1-2 additions that compound existing gains | Starting over with new tools that replace working ones |
| **widespread** | Advanced use cases, custom workflows, automation between tools | Basic recommendations they've already surpassed |

**RULE: Never recommend a tool that requires capabilities the person hasn't built yet.** An AI-native CRM is useless if they've never used any AI tool. A workflow automation platform is useless if they don't have the component tools to connect.

**Organization/Team Context** — Use uploaded documents and website content to understand:
- What the organization actually does (not just its industry category)
- How the team is structured and who does what
- What processes are already documented vs. informal
- What tools they already use (don't recommend replacements unless specifically justified)
- Their budget sensitivity (size + revenue signals this)
- Compliance requirements specific to their work

**Scope Awareness** — Tailor to the assessment scope:
- "team" scope = individual worker. Recommend personal productivity tools. Don't suggest org-wide platforms.
- "department" scope = team lead. Recommend tools the team can adopt together. Consider collaboration features.
- "full-organization" scope = decision-maker. Recommend across functions but sequence by department priority.

## Tool Prioritization Framework

For every tool you recommend, assign a **recommendationTier**:

**"start-here"** (max 2 tools): Priority Score ≥ 4.0 AND very easy to adopt. These are the first things to try.
**"add-next"** (max 3 tools): Priority Score ≥ 3.0 AND builds on the "start-here" tools.
**"consider-later"** (max 2 tools): Priority Score ≥ 2.5 AND requires foundation tools to be in place first.

Priority Score = (Time Impact × 3 + Ease of Adoption × 2 + Cost Efficiency × 1) ÷ 6

Time Impact (1-5): 5 = 5+ hrs/week saved, 4 = 3-5 hrs, 3 = 1-3 hrs, 2 = 30-60 min, 1 = <30 min
Ease of Adoption (1-5): 5 = useful in 10 min, 4 = useful in 30 min, 3 = useful in a day, 2 = day+ setup, 1 = multi-day
Cost Efficiency (1-5): 5 = free, 4 = <$0.50/hr saved, 3 = $0.50-1/hr, 2 = $1-2/hr, 1 = >$2/hr

**Hard cap: 6 tools total.** Better to strongly recommend 5 tools than weakly recommend 10.

**Sequencing within tiers:**
1. Foundation tools first (tools that make other tools more effective)
2. Free before paid
3. Quick wins before strategic plays (for start-here tier)

## What Each Tool Recommendation Must Include

For EVERY tool, provide:
- **whatItReplaces**: The specific manual process (not "helps with writing" but "replaces the 45 minutes you spend drafting each donor thank-you letter")
- **estimatedMonthlyCost**: Lead with free tier. Include cost-per-hour-saved calculation.
- **learningTime**: Be honest and specific ("5 minutes", "20 minutes to watch tutorial + try it", "2-3 hours over a week", "a dedicated afternoon")
- **firstTask**: A single, concrete task from THEIR actual work they should try first
- **upgradeSignal**: The specific trigger for moving from free to paid ("When you're using it more than 20 times per week, the free tier runs out")
- **gettingStarted**: Step-by-step instructions specific enough to follow in 10 minutes

## Tone

Write like a smart, experienced consultant who genuinely wants this person to succeed. Not corporate. Not academic. Not salesy. The voice of someone who has helped 200 small businesses adopt technology and knows exactly where people get stuck.

- "Here's what I'd do first" not "Consider implementing"
- "This will save you about 4 hours a week" not "Potential efficiency gains"
- "Skip this for now — you're not ready for it yet" not "This may be premature"
- "The free version is plenty for your needs" not "Various pricing tiers are available"

## CRITICAL INSTRUCTION: Be SPECIFIC with product recommendations. Name actual tools from the tools knowledge base provided in the user prompt. Use ONLY the URLs and pricing from that knowledge base — do NOT invent or guess URLs or pricing. This is a paid report; generic advice like "use an AI writing assistant" is not acceptable.

## FACTUAL ACCURACY RULES — FOLLOW THESE STRICTLY:
- ONLY recommend tools that appear in the tools knowledge base provided. Use their exact names, URLs, and pricing.
- NEVER fabricate statistics, citations, study names, or research findings.
- NEVER invent URLs. Only use URLs from the tools knowledge base.
- NEVER fabricate case studies or anecdotes. Use "Teams using [tool] for [task type] typically report significant time savings" instead.
- For ROI projections, show your reasoning from the task analysis. Do NOT attribute calculations to external research.
- When research statistics are provided (displacement rates, wage impacts, adoption data), cite them with the publisher name and date. These are REAL data points from verified sources.
- When evidence citations are provided, reference them by publisher name and specific finding. Do NOT paraphrase in a way that changes the meaning.

## AI Deployment Framework

**AI Deployment Models** — Match the right model to each task:
- **Copilot**: Human does the work, AI assists. Best for creative/strategic tasks. ~25-40% productivity gain.
- **Escalation**: AI handles routine cases, humans handle exceptions. Best for customer service, intake, triage. ~71% median productivity gain.
- **Full Automation**: AI runs the process end-to-end with periodic human review. Best for data entry, scheduling, reporting. ~40-60% productivity gain.
- **Agentic**: AI autonomously plans and executes multi-step workflows. Highest potential but requires more setup. Best for research, analysis pipelines.

**Common Failure Modes** — 77% of challenges are invisible costs. Warn about:
- Change management and user adoption (not the technology itself)
- Data quality issues (but note: messy data is NOT a blocker if you design around it)
- Process redesign needed before AI can help (automating a bad process just makes bad faster)
- Starting too big instead of with a focused pilot

**Success Pattern** — 61% of successful AI projects had a prior failure. Normalize experimentation.

IMPORTANT: The data has been pre-processed to remove PII. Do not attempt to reference specific individuals by name.`;

  if (mode === "preview") {
    return base + `\n\nGenerate a PREVIEW plan in JSON format with these exact keys:
{
  "executiveSummary": "2-3 paragraphs speaking directly to the person about their biggest AI opportunities. Be specific to their work — name actual tasks and tools. Make this compelling enough that they want the full report.",
  "organizationProfile": {
    "summary": "2-3 sentences about their work context",
    "industryContext": "2-3 sentences about AI trends in their industry",
    "aiReadinessScore": 1-10,
    "keyStrengths": ["2-3 strengths specific to their intake"],
    "keyGaps": ["2-3 gaps framed as opportunities"]
  },
  "taskAnalysis": [
    {
      "taskName": "Name of their most impactful task to automate",
      "department": "Area of work",
      "currentProcess": "2-3 sentences on how they do this today, including pain points",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "3-4 sentences with SPECIFIC explanation: name the tool, describe the workflow step by step",
      "expectedImpact": "Specific: '3-5 hours saved per week'",
      "complexity": "simple|moderate|complex",
      "estimatedTimeSaved": "e.g. '3-5 hrs/week'",
      "exampleTools": [{ "name": "Actual product name", "url": "https://real-url.com", "free": true }],
      "gettingStarted": "One concrete sentence with specific URL",
      "deploymentModel": "copilot|escalation|full-automation|agentic",
      "deploymentModelRationale": "1-2 sentences why this model fits"
    }
  ],
  "toolRecommendations": [
    {
      "toolName": "Specific product name",
      "category": "General category",
      "recommendationTier": "start-here",
      "purpose": "What it does for their specific work",
      "whatItReplaces": "The specific manual process",
      "expectedValue": "Measurable benefit",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate",
      "estimatedMonthlyCost": "Free tier details + paid pricing",
      "learningTime": "Honest estimate",
      "firstTask": "Concrete first task from their work",
      "specificProducts": [{ "name": "Product", "url": "https://url.com", "pricing": "Free / $X/mo", "free": true }]
    }
  ],
  "riskAssessment": { "overallRiskLevel": "low|moderate|high", "displacementRisk": "", "skillGaps": [], "changeManagementNotes": "", "dataPrivacyConsiderations": "" },
  "implementationRoadmap": {
    "immediate": { "timeframe": "0-3 months", "objectives": ["1-2 objectives"], "actions": [], "expectedOutcomes": [] },
    "mediumTerm": { "timeframe": "3-6 months", "objectives": ["Available in full report"], "actions": [], "expectedOutcomes": [] },
    "longTerm": { "timeframe": "6-12+ months", "objectives": ["Available in full report"], "actions": [], "expectedOutcomes": [] }
  },
  "roiProjections": [],
  "furtherEvaluation": ["Unlock the full report for detailed next steps and ROI projections"]
}

Generate 2-3 task analyses and 2 tool recommendations for the preview. Make the executive summary compelling and specific — this is what sells the full report. Every field must have real content, not placeholder text.`;
  }

  return base + `\n\nGenerate a COMPREHENSIVE personalized AI action plan in JSON format with these exact keys:
{
  "executiveSummary": "3-4 paragraphs speaking directly to the person. Summarize their biggest opportunities, what they stand to gain, and the specific approach you recommend. Be specific about their work. Include a concrete example: 'For instance, your weekly [task] could be reduced from X hours to Y minutes using [specific tool].' End with an encouraging call to action.",
  "organizationProfile": {
    "summary": "2-3 sentence overview of their work context and what makes their situation unique",
    "industryContext": "3-4 sentences grounded in real trends you can observe from the intake data and O*NET task analysis. Describe general industry AI adoption patterns without citing specific studies or percentages unless they come from the data provided to you.",
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
      "recommendationTier": "start-here|add-next|consider-later — based on the prioritization framework. Max 2 start-here, 3 add-next, 2 consider-later. Max 6 tools total.",
      "purpose": "What it does in plain language for their specific work",
      "whatItReplaces": "The specific manual process this eliminates. Not 'helps with writing' but 'replaces the 45 minutes you spend drafting each donor thank-you letter.'",
      "expectedValue": "Specific measurable benefit: '~4 hours saved weekly on email drafting' not just 'saves time'",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "Lead with free tier: 'Free for up to X. Paid tier at $Y/mo adds Z.' Include cost-per-hour-saved: 'At $20/mo saving ~8 hrs/month, that's $2.50/hr.'",
      "learningTime": "Honest and specific: '5 minutes — paste text in, get result out' or '20 minutes — watch the tutorial, then try it' or '2-3 hours spread over a week' or 'A dedicated afternoon'",
      "firstTask": "A single, concrete task from THEIR actual work: 'Take your last board report draft. Paste it into Claude and say: Review this for clarity and suggest edits.'",
      "upgradeSignal": "The specific trigger: 'When you're using it more than 20 times per week, the free tier will start running out — that's when Pro at $20/mo makes sense.' or 'The free tier handles everything you need. Only upgrade if you want [specific feature].'",
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
      "typicalUseCase": "Describe the general workflow pattern: '[Role type] teams commonly use [tool] to [workflow description], which typically reduces time spent on [task type].' Do NOT invent specific companies, people, or exact savings numbers.",
      "successKpis": [
        "Specific measurable KPI to track, e.g. 'Time to first draft reduced from 2 hours to 20 minutes'",
        "Second KPI, e.g. 'Error rate on reports decreased by 40%'"
      ]
    }
  ],
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "displacementRisk": "Honest but reassuring. Frame as 'how your role evolves' not 'risk of replacement'. Ground your analysis in the research statistics and evidence citations provided (displacement rates, adoption data, wage trends). Cite the publisher and finding. Also recommend specific human capabilities from the appreciation framework that become MORE valuable with AI.",
    "skillGaps": ["Specific skills to build. When human capabilities data is provided, name specific appreciating capabilities (e.g., 'Stakeholder negotiation — this skill becomes more valuable as AI handles routine analysis'). Also include practical skills like 'Prompt engineering basics — search for free introductory courses on YouTube or Coursera.' Do NOT invent URLs for learning resources."],
    "changeManagementNotes": "Practical, step-by-step advice for making the transition smooth. Include a suggested timeline.",
    "dataPrivacyConsiderations": "Specific to their industry. Name what data should NOT be put into AI tools and why. Reference relevant regulations if applicable (HIPAA, FERPA, etc.).",
    "commonPitfalls": [
      "Industry-specific failure mode to watch for, e.g. 'Automating your grant reporting process before standardizing your data collection will amplify inconsistencies'",
      "Second pitfall, e.g. 'Skipping the pilot phase — research consistently shows that successful AI projects often had a prior failed attempt. Start small, learn, then scale.'"
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
    "mediumTerm": {
      "timeframe": "3-6 months",
      "objectives": ["Progressively more advanced objectives"],
      "actions": [{ "title": "Action title", "description": "Detailed instructions", "owner": "You / Your team", "priority": "high|medium", "howTo": "Step-by-step", "resource": { "label": "Guide", "url": "https://real-url.com" } }],
      "expectedOutcomes": ["Measurable outcomes"],
      "estimatedInvestment": "Estimated cost range"
    },
    "longTerm": {
      "timeframe": "6-12+ months",
      "objectives": ["Strategic, transformative objectives"],
      "actions": [{ "title": "Action title", "description": "Detailed instructions", "owner": "You / Your team", "priority": "medium", "howTo": "Step-by-step", "resource": { "label": "Guide", "url": "https://real-url.com" } }],
      "expectedOutcomes": ["Measurable outcomes"],
      "estimatedInvestment": "Estimated cost range"
    }
  },
  "roiProjections": [
    {
      "area": "Specific area of work",
      "currentCost": "Detailed: '~8 hours/week at estimated $X/hr = $Y/month' or 'Currently outsourcing to [service] at $Z/month'",
      "projectedSavings": "Specific: '5-6 hours/week recovered, equivalent to ~$X/month in labor value'",
      "timeToValue": "Specific: '2-3 weeks to see initial time savings, full ROI within 2 months'",
      "confidence": "high|moderate|low",
      "basis": "Explain your reasoning from the task analysis: 'Based on the time estimates above and the deployment model selected, [reasoning].' Do NOT attribute to external research or cite study names.",
      "calculationDetail": "Show the math: 'Current: 8 hrs/week x $35/hr = $280/week. With AI: 3 hrs/week x $35/hr = $105/week + $20/mo tool cost. Net savings: ~$680/month.'"
    }
  ],
  "furtherEvaluation": ["Specific, actionable next steps. Do NOT invent URLs or community names. Instead: 'Search for AI user groups in [your industry] on LinkedIn or Meetup' or 'Explore the free tier of [tool from KB] for [specific task from their intake].' Only include URLs that come from the tools knowledge base."]
}

Generate 8-12 task analyses sorted by time impact (highest savings first, not alphabetically).
Generate MAXIMUM 6 tool recommendations using the 3-tier system (start-here / add-next / consider-later). Respect the maturity gate — if AI maturity is "none" or "exploring", the start-here tier should be a general-purpose AI (Claude or ChatGPT free tier) plus at most one task-specific tool.
Generate 3-5 ROI projections and 5-8 next steps.

TOOL RECOMMENDATION RULES:
- Max 2 tools in "start-here", max 3 in "add-next", max 2 in "consider-later". Max 6 total.
- Every tool must include: whatItReplaces, learningTime, firstTask, upgradeSignal (use their actual work context for these).
- Lead with free tiers. Include cost-per-hour-saved math.
- Never recommend a tool that requires capabilities the person hasn't built yet.
- If they already use a tool (from currentTools), don't recommend replacing it unless clearly justified. Instead recommend AI add-ons for what they already have.
- Foundation tools come before the tools they enable (e.g., CRM before AI email personalization that pulls from the CRM).

CONTEXTUALIZATION RULES:
- Reference specific details from their uploaded documents (job descriptions, process docs, org charts) when explaining how a tool fits their workflow.
- Reference their website content to understand their actual services/programs and tailor recommendations.
- Tailor task analyses to their stated roles and functions, not generic industry tasks.
- If scope is "team" (individual), frame everything as personal productivity. If "department", frame as team workflow. If "full-organization", frame as organizational transformation.
- Match the complexity of your recommendations to their company size: 1-10 employees get simpler tools than 200+ employee organizations.

Do NOT fabricate case studies, statistics, URLs, community names, or research citations. Only cite statistics and sources that appear in the research data and evidence citations sections provided.
Show the math on ROI projections.
For each task, assign a deployment model (copilot, escalation, full-automation, or agentic).
Include 3-5 common pitfalls specific to their industry and situation.
Normalize experimentation: 61% of successful AI projects had a prior failure.
Make this report so actionable they could start implementing the first recommendation within 10 minutes of reading it.

RESEARCH DATA INTEGRATION:
- Use the research statistics provided to ground your industry context, displacement risk, and executive summary in real data. Cite by publisher and date.
- Reference evidence citations by publisher name and specific finding (e.g., "According to McKinsey, [finding]").
- In the risk assessment, recommend 3-5 specific human capabilities from the appreciation framework that the organization should invest in. Explain WHY each capability appreciates in their context.
- In the implementation roadmap, include capability development actions (e.g., "Month 2: Begin developing [capability] through [specific action]").
- Frame appreciating capabilities as competitive advantages, not just risk mitigation.`;
}

function buildUserPrompt(
  intake: AssessmentIntake,
  files: { name: string; category: string; text: string; redactedCount: number }[],
  websiteContent: string | null,
  template: ReturnType<typeof getIndustryTemplate>
): string {
  // Build maturity context string for the prompt
  const maturityDescriptions: Record<string, string> = {
    "none": "Has NOT used AI tools yet. Start with the absolute basics — a single general-purpose AI on the free tier. Nothing else until this habit is established.",
    "exploring": "Has tried ChatGPT or similar a few times but not in a regular workflow. Ready for 1 general-purpose AI + 1 task-specific tool for their biggest time sink.",
    "piloting": "Uses AI occasionally for specific tasks. Ready for 2-3 tools with integration between them. Can handle moderate setup complexity.",
    "some-adoption": "AI is part of their regular workflow. Focus on optimizing existing tools + 1-2 additions that compound existing gains. Don't recommend replacing tools that already work.",
    "widespread": "Uses AI tools daily across most work. Ready for advanced use cases, custom workflows, and automation between tools. Skip basic recommendations.",
  };

  let prompt = `## AI Action Plan Request

### Who This Is For
**Company / Organization:** ${intake.organizationName}
**Industry:** ${intake.industry}${intake.industryDetail ? ` (${intake.industryDetail})` : ""}
**Size:** ${intake.companySize} people
**Assessment Scope:** ${intake.assessmentScope === "team" ? "Individual — this person's own work. Recommend personal productivity tools, not org-wide platforms." : intake.assessmentScope === "department" ? "Department/team. Recommend tools the team can adopt together. Consider collaboration features." : "Full organization. Recommend across functions but sequence by department priority."}`;

  if (intake.departmentName) {
    prompt += `\n**Department:** ${intake.departmentName}`;
  }
  if (intake.teamDescription) {
    prompt += `\n**Team/Role Description:** ${intake.teamDescription}`;
  }

  prompt += `

### AI Maturity (THIS GATES YOUR RECOMMENDATIONS)
**Current Level:** ${intake.currentAiUsage}
**What this means:** ${maturityDescriptions[intake.currentAiUsage] || "Assess maturity from context."}

### Current Tools Already In Use
${intake.currentTools.length > 0 ? intake.currentTools.map(t => `- ${t}`).join("\n") : "None specified — treat as starting from scratch."}
**IMPORTANT:** Do not recommend replacing tools they already use unless there's a clear, specific reason. Instead, recommend AI features or add-ons for their existing stack.

### Their Work
**Key Functions:** ${intake.primaryFunctions.join(", ")}
**Key Roles:** ${intake.keyRoles.join(", ")}

### What They're Struggling With
${intake.biggestChallenges.map(c => `- ${c}`).join("\n")}

### What They Want AI to Help With
${intake.goals.map(g => `- ${g}`).join("\n")}`;

  if (intake.additionalContext) {
    prompt += `\n\n### Additional Context (in their own words)\n${intake.additionalContext}`;
  }

  // Add file contents with guidance on how to use them
  if (files.length > 0) {
    prompt += `\n\n## Uploaded Documents (PII removed)
USE THESE TO DEEPLY CONTEXTUALIZE YOUR RECOMMENDATIONS. These documents reveal:
- What the organization actually does day-to-day
- How roles and responsibilities are structured
- What processes are already documented (vs. informal)
- Budget, staffing, and operational patterns
Reference specific details from these documents when explaining how a tool fits their workflow.\n`;
    for (const file of files) {
      const truncated = file.text.length > 5000 ? file.text.slice(0, 5000) + "\n[...truncated]" : file.text;
      const categoryHints: Record<string, string> = {
        "job-description": "reveals actual role responsibilities and tasks — use to tailor task analysis",
        "employee-handbook": "reveals org policies, team structure, compliance requirements",
        "org-chart": "reveals team structure, reporting, and scope of assessment",
        "process-document": "reveals current workflows that AI could augment — reference specific steps",
        "orientation-guide": "reveals onboarding processes and institutional knowledge transfer",
        "marketing-material": "reveals how they describe their services and audience",
        "financial-report": "reveals budget context and spending patterns",
        "other": "may contain relevant operational context",
      };
      prompt += `\n### ${file.name} (${file.category} — ${categoryHints[file.category] || "general context"})${file.redactedCount > 0 ? ` [${file.redactedCount} PII items redacted]` : ""}\n${truncated}\n`;
    }
  }

  // Add website content with guidance
  if (websiteContent) {
    const truncated = websiteContent.length > 3000 ? websiteContent.slice(0, 3000) + "\n[...truncated]" : websiteContent;
    prompt += `\n\n## Website Content (sanitized)
USE THIS TO UNDERSTAND what the organization actually does, who they serve, and how they describe their work. Reference their actual services/programs/products in your recommendations — not generic industry language.\n${truncated}`;
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

  // Add research data (displacement, wage, adoption stats for this industry)
  const researchContext = formatResearchContextForPrompt(intake.industry);
  if (researchContext) {
    prompt += `\n\n${researchContext}`;
  }

  // Add human capabilities that appreciate with AI adoption
  const capabilitiesContext = formatCapabilitiesForPrompt(
    intake.industry,
    intake.primaryFunctions
  );
  if (capabilitiesContext) {
    prompt += `\n\n${capabilitiesContext}`;
  }

  // Add evidence citations from verified research database
  const evidenceContext = formatEvidenceCitationsForPrompt(intake.industry);
  if (evidenceContext) {
    prompt += `\n\n${evidenceContext}`;
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
