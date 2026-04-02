// Core AI analysis pipeline for assessment reports
// All file content processed in-memory — never persisted

import Anthropic from "@anthropic-ai/sdk";
import { AssessmentIntake, AssessmentReport } from "./types";
import { stripPii } from "./pii-strip";
import { getIndustryTemplate } from "./taxonomy";

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
  const systemPrompt = `You are an AI policy and implementation expert creating organizational AI guidelines.
Generate two outputs in JSON format:

1. "aiPolicy": An AI usage policy document with sections covering:
   - Purpose and scope
   - Approved use cases
   - Data handling and privacy requirements
   - Quality assurance and human oversight
   - Prohibited uses
   - Training and compliance
   - Review and update schedule
   Each section has "title" and "content" fields.

2. "promptLibrary": 10-20 practical prompts tailored to the organization's workflows. Each entry has:
   - "title": Short name
   - "department": Which team uses this
   - "useCase": What business task this addresses
   - "prompt": The actual prompt template (use [BRACKETS] for variables)
   - "tips": Array of 2-3 usage tips

Tailor everything to this specific organization's industry, size, and workflows.
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
  const base = `You are an AI adoption strategist analyzing an organization to produce an actionable AI implementation plan. You have deep knowledge of:
- Current AI tools across industries (productivity, communication, analysis, creative, operations)
- O*NET task classifications and how AI maps to specific work activities
- Implementation best practices for small and mid-size organizations
- ROI frameworks for AI tool adoption
- Change management for technology adoption

Your tone is professional, evidence-based, and practitioner-focused. No hype — just practical recommendations.

IMPORTANT: The organization data has been pre-processed to remove PII. Do not attempt to reference specific individuals.`;

  if (mode === "preview") {
    return base + `\n\nGenerate a PREVIEW report: executive summary, high-level AI readiness score, and 2-3 top-line recommendations only. Keep it compelling but clearly incomplete to encourage the full report purchase. Return JSON format.`;
  }

  return base + `\n\nGenerate a COMPREHENSIVE assessment report in JSON format with these exact keys:
{
  "executiveSummary": "2-3 paragraph overview",
  "organizationProfile": {
    "summary": "...",
    "industryContext": "Current AI adoption trends in this industry",
    "aiReadinessScore": 1-10,
    "keyStrengths": ["..."],
    "keyGaps": ["..."]
  },
  "taskAnalysis": [
    {
      "taskName": "...",
      "department": "...",
      "currentProcess": "...",
      "aiOpportunity": "high|medium|low",
      "aiApproach": "How AI can improve this task",
      "expectedImpact": "...",
      "complexity": "simple|moderate|complex",
      "onetAlignment": "Optional O*NET task reference"
    }
  ],
  "toolRecommendations": [
    {
      "category": "General category of tool (not a specific product)",
      "purpose": "What it does for this org",
      "expectedValue": "Specific expected benefit",
      "implementationEffort": "low|medium|high",
      "priorityTier": "immediate|medium-term|long-term",
      "estimatedMonthlyCost": "$ range"
    }
  ],
  "riskAssessment": {
    "overallRiskLevel": "low|moderate|high",
    "displacementRisk": "Assessment of job displacement risk",
    "skillGaps": ["..."],
    "changeManagementNotes": "...",
    "dataPrivacyConsiderations": "..."
  },
  "implementationRoadmap": {
    "immediate": {
      "timeframe": "0-3 months",
      "objectives": ["..."],
      "actions": [{ "title": "...", "description": "...", "owner": "Suggested role", "priority": "critical|high|medium|low" }],
      "expectedOutcomes": ["..."],
      "estimatedInvestment": "$ range"
    },
    "mediumTerm": { same structure, "timeframe": "3-6 months" },
    "longTerm": { same structure, "timeframe": "6-12+ months" }
  },
  "roiProjections": [
    {
      "area": "...",
      "currentCost": "Estimated current cost (time or money)",
      "projectedSavings": "...",
      "timeToValue": "...",
      "confidence": "high|moderate|low",
      "basis": "What this estimate is based on"
    }
  ],
  "furtherEvaluation": ["Specific next steps for deeper analysis"]
}

Generate 8-12 task analyses, 6-10 tool recommendations, 3-5 ROI projections, and 5-8 further evaluation points.
Make recommendations SPECIFIC and ACTIONABLE — reference the organization's actual functions and challenges.
For tool recommendations, use general categories (e.g., "AI writing assistant", "intelligent document processing") rather than specific product names.`;
}

function buildUserPrompt(
  intake: AssessmentIntake,
  files: { name: string; category: string; text: string; redactedCount: number }[],
  websiteContent: string | null,
  template: ReturnType<typeof getIndustryTemplate>
): string {
  let prompt = `## Organization Assessment Request

**Organization:** ${intake.organizationName}
**Industry:** ${intake.industry}${intake.industryDetail ? ` (${intake.industryDetail})` : ""}
**Size:** ${intake.companySize} employees
**Assessment Scope:** ${intake.assessmentScope}`;

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
