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
    max_tokens: mode === "preview" ? 2000 : 8000,
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

Your tone is warm, direct, and encouraging — like a knowledgeable colleague who genuinely wants to help someone work smarter. No corporate jargon, no hype. Focus on practical, specific things they can do.

Frame everything around EMPOWERMENT: AI helps them get time back for the work that matters most — the creative, strategic, human parts of their job. AI handles the repetitive, tedious, time-consuming tasks so they can focus on what they're best at.

IMPORTANT: The data has been pre-processed to remove PII. Do not attempt to reference specific individuals by name.`;

  if (mode === "preview") {
    return base + `\n\nGenerate a PREVIEW plan: a brief summary of their biggest AI opportunities, an AI readiness score, and 2-3 high-level recommendations. Make it useful enough to show value but clearly incomplete — they should see that the full plan goes much deeper. Return JSON format.`;
  }

  return base + `\n\nGenerate a COMPREHENSIVE personalized AI action plan in JSON format with these exact keys:
{
  "executiveSummary": "2-3 paragraphs speaking directly to the person. Summarize their biggest opportunities and what they stand to gain. Be specific about their work.",
  "organizationProfile": {
    "summary": "Brief overview of their work context",
    "industryContext": "How AI is being adopted in their industry right now — ground it in real trends",
    "aiReadinessScore": 1-10,
    "keyStrengths": ["What they already have going for them"],
    "keyGaps": ["Where they can grow — frame as opportunities, not deficiencies"]
  },
  "taskAnalysis": [
    {
      "taskName": "...",
      "department": "...",
      "currentProcess": "How they likely do this today",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "Specifically how AI can help with this task — be concrete",
      "expectedImpact": "Time saved or quality improvement they can expect",
      "complexity": "simple|moderate|complex",
      "onetAlignment": "Optional O*NET task reference"
    }
  ],
  "toolRecommendations": [
    {
      "category": "General category of tool (e.g., 'AI writing assistant', not a specific brand)",
      "purpose": "What it does in plain language",
      "expectedValue": "Specific benefit for their work",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "$ range (include free options where they exist)"
    }
  ],
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "displacementRisk": "Honest but reassuring — frame as 'how your role evolves' not 'risk of replacement'",
    "skillGaps": ["Skills to build — frame as growth opportunities"],
    "changeManagementNotes": "Practical advice for making the transition smooth",
    "dataPrivacyConsiderations": "What to watch out for with their specific data"
  },
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "This week to 3 months",
      "objectives": ["..."],
      "actions": [{ "title": "...", "description": "Specific, concrete step", "owner": "You / Your team", "priority": "critical|high|medium|low" }],
      "expectedOutcomes": ["..."],
      "estimatedInvestment": "$ range (emphasize free and low-cost options first)"
    },
    "mediumTerm": { same structure, "timeframe": "3-6 months" },
    "longTerm": { same structure, "timeframe": "6-12+ months" }
  },
  "roiProjections": [
    {
      "area": "...",
      "currentCost": "Estimated time or money they spend today",
      "projectedSavings": "Hours per week or dollars saved",
      "timeToValue": "How quickly they'll see results",
      "confidence": "high|moderate|low",
      "basis": "What this estimate is based on"
    }
  ],
  "furtherEvaluation": ["Specific, concrete next steps they can take to keep building momentum"]
}

Generate 8-12 task analyses, 6-10 tool recommendations, 3-5 ROI projections, and 5-8 next steps.
Make every recommendation SPECIFIC to their actual work. Reference their tasks, their challenges, their tools.
For tool recommendations, reference specific products from the tools knowledge base provided. Include both the product name AND general category (e.g., "Grammarly (AI writing assistant)") so users can evaluate alternatives too.
ALWAYS emphasize: AI is here to handle the tedious parts so they can focus on the work that needs a human — the creative, relational, strategic parts of their job.
Prioritize free and low-cost tools first, especially for individuals and very small teams.`;
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
