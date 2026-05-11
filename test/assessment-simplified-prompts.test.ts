import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AssessmentIntake, AssessmentReport } from "@/lib/assessment/types";

// Mock Anthropic before importing analyze.ts. See step2-parallel test for the
// vi.hoisted pattern — the vi.mock factory is hoisted above top-level consts.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: createMock };
    static APIConnectionError = class extends Error {};
    static APIConnectionTimeoutError = class extends Error {};
    static RateLimitError = class extends Error {};
    static InternalServerError = class extends Error {};
    static APIError = class extends Error { status?: number; };
  }
  return { default: MockAnthropic, Anthropic: MockAnthropic };
});

// Stub heavy context builders so we're only testing prompt composition, not
// industry-template or O*NET data.
vi.mock("@/lib/assessment/taxonomy", () => ({
  getIndustryTemplate: () => ({ departments: [] }),
  INDUSTRY_TEMPLATES: {},
}));
vi.mock("@/lib/assessment/onet-tasks", () => ({
  getOnetSummaryForPrompt: () => "",
}));
vi.mock("@/lib/assessment/capabilities-context", () => ({
  formatCapabilitiesForPrompt: () => "",
}));
vi.mock("@/lib/assessment/research-context", () => ({
  formatResearchContextForPrompt: () => "",
}));
vi.mock("@/lib/assessment/evidence-citations", () => ({
  formatEvidenceCitationsForPrompt: () => "",
}));
vi.mock("@/data/tools", () => ({
  formatToolsForPrompt: () => "",
}));

import {
  generateStep2Tasks,
  generateStep3Tools,
  generateStep3Roadmap,
  generateStep4Risks,
} from "@/lib/assessment/analyze";

const fakeResponse = (payload: unknown) => ({
  content: [{ type: "text", text: JSON.stringify(payload) }],
});

const intake: AssessmentIntake = {
  organizationName: "Test Org",
  industry: "technology",
  orgSize: "50-250",
  companySize: "50-250",
  keyRoles: ["ops"],
  primaryFunctions: ["reporting"],
  biggestChallenges: ["slow reports"],
  goals: ["save time"],
  aiMaturity: "exploring",
  currentAiUsage: "exploring",
  currentTools: [],
  toolPreference: "no-preference",
  websiteUrl: "",
  uploadedFiles: [],
} as unknown as AssessmentIntake;

const emptyReport: Partial<AssessmentReport> = {};

describe("Step 2 prompt — simplified", () => {
  beforeEach(() => createMock.mockReset());

  it("asks for 3-4 tasks per leg (parallel structure from #604) and removes the old 8-12 cap", async () => {
    createMock.mockResolvedValue(
      fakeResponse({
        taskAnalysis: [
          {
            taskName: "Sample task",
            department: "ops",
            currentProcess: "manual",
            aiOpportunity: "high",
            aiApproach: "use AI",
            expectedImpact: "save time",
            complexity: "moderate",
          },
        ],
      }),
    );
    await generateStep2Tasks(intake, emptyReport);
    // System prompt no longer sets a count; each parallel leg's user prompt
    // carries the focus instruction including the per-leg count.
    const systemPrompt = createMock.mock.calls[0][0].system[0].text as string;
    expect(systemPrompt).not.toContain("8-12 task analyses");
    expect(systemPrompt).not.toContain("Generate 8-12");

    // Both parallel calls ask for 3-4 tasks in their focus instruction,
    // yielding the target 6-8 after merge + dedupe.
    const userPromptA = createMock.mock.calls[0][0].messages[0].content as string;
    const userPromptB = createMock.mock.calls[1][0].messages[0].content as string;
    expect(userPromptA).toMatch(/Generate 3-4 tasks/);
    expect(userPromptB).toMatch(/Generate 3-4 tasks/);
  });

  it("includes per-field word budgets in the system prompt", async () => {
    createMock.mockResolvedValue(
      fakeResponse({
        taskAnalysis: [
          {
            taskName: "Sample task",
            department: "ops",
            currentProcess: "manual",
            aiOpportunity: "high",
            aiApproach: "use AI",
            expectedImpact: "save time",
            complexity: "moderate",
          },
        ],
      }),
    );
    await generateStep2Tasks(intake, emptyReport);
    const systemPrompt = createMock.mock.calls[0][0].system[0].text as string;
    expect(systemPrompt).toContain("WORD BUDGETS");
    expect(systemPrompt).toMatch(/currentProcess:.*one sentence/i);
    expect(systemPrompt).toMatch(/aiApproach:.*1-2 sentences/i);
    expect(systemPrompt).toMatch(/starterPrompt:.*2-3 sentences max/i);
  });

  it("uses smaller per-leg max_tokens now that output is smaller and word-budgeted", async () => {
    createMock.mockResolvedValue(
      fakeResponse({
        taskAnalysis: [
          {
            taskName: "Sample task",
            department: "ops",
            currentProcess: "manual",
            aiOpportunity: "high",
            aiApproach: "use AI",
            expectedImpact: "save time",
            complexity: "moderate",
          },
        ],
      }),
    );
    await generateStep2Tasks(intake, emptyReport);
    // Both legs run with the same max_tokens; fewer tasks + budgets means
    // we can fit comfortably under the previous 4500.
    const legAMaxTokens = createMock.mock.calls[0][0].max_tokens as number;
    const legBMaxTokens = createMock.mock.calls[1][0].max_tokens as number;
    expect(legAMaxTokens).toBeLessThan(4500);
    expect(legBMaxTokens).toBeLessThan(4500);
    expect(legAMaxTokens).toBeGreaterThanOrEqual(2500);
  });
});

describe("Step 3 roadmap prompt — capped", () => {
  beforeEach(() => createMock.mockReset());

  it("caps phase actions and includes word budgets", async () => {
    // After the Step 3 split, roadmap is its own opt-in generator with a
    // single Claude call — its system prompt is the only one we need to inspect.
    createMock.mockResolvedValue(
      fakeResponse({
        implementationRoadmap: {
          immediate: { timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [] },
          mediumTerm: { timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [] },
          longTerm: { timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [] },
        },
      }),
    );
    await generateStep3Roadmap(intake, emptyReport);

    expect(createMock.mock.calls.length).toBeGreaterThanOrEqual(1);
    const roadmapSystem = createMock.mock.calls[0][0].system[0].text as string;
    expect(roadmapSystem).toContain("WORD BUDGETS");
    expect(roadmapSystem).toMatch(/3-5 actions/);
    expect(roadmapSystem).toMatch(/action\.description:.*one sentence/i);
    expect(roadmapSystem).toMatch(/action\.howTo:.*1-2 short sentences/i);
  });
});

describe("Step 4 prompt — drops furtherEvaluation + changeManagementNotes", () => {
  beforeEach(() => createMock.mockReset());

  it("does not ask for furtherEvaluation in the JSON template", async () => {
    createMock.mockResolvedValue(
      fakeResponse({
        riskAssessment: {
          overallRiskLevel: "moderate",
          displacementRisk: "Some risk text — non-empty so the throw guard passes.",
        },
        humanCapabilities: [],
      }),
    );
    await generateStep4Risks(intake, emptyReport);
    const systemPrompt = createMock.mock.calls[0][0].system[0].text as string;
    // The system prompt should explicitly instruct Claude NOT to produce
    // furtherEvaluation, AND the JSON schema example should not list it.
    expect(systemPrompt).toMatch(/Do NOT include a "furtherEvaluation"/);
    // The JSON template should not mention furtherEvaluation as a required key.
    const jsonTemplateMatch = systemPrompt.match(/Return valid JSON[\s\S]*?\n}/);
    expect(jsonTemplateMatch).toBeTruthy();
    const jsonTemplate = jsonTemplateMatch![0];
    expect(jsonTemplate).not.toMatch(/"furtherEvaluation"\s*:/);
  });

  it("does not reference changeManagementNotes as a required field anywhere in the prompt", async () => {
    createMock.mockResolvedValue(
      fakeResponse({
        riskAssessment: {
          overallRiskLevel: "moderate",
          displacementRisk: "Some risk text — non-empty so the throw guard passes.",
        },
        humanCapabilities: [],
      }),
    );
    await generateStep4Risks(intake, emptyReport);
    const systemPrompt = createMock.mock.calls[0][0].system[0].text as string;
    // The field is not a required key in the JSON template, and it's not asked
    // for by name. (The removal note may mention the word in prose to explain
    // why — that's fine; we only care that Claude isn't asked to produce it.)
    expect(systemPrompt).not.toMatch(/"changeManagementNotes"\s*:/);
  });

  it("still gracefully handles old reports that have furtherEvaluation (schema backward compat)", async () => {
    // Zod schema keeps the field with .default([]) so old parsed reports with
    // furtherEvaluation won't blow up. We assert the function returns the
    // expected shape even if Claude does (incorrectly) still include it.
    createMock.mockResolvedValue(
      fakeResponse({
        riskAssessment: {
          overallRiskLevel: "low",
          displacementRisk: "Low displacement risk for this role.",
        },
        humanCapabilities: [],
        furtherEvaluation: ["stray content from old prompt version"],
      }),
    );
    const result = await generateStep4Risks(intake, emptyReport);
    // Function doesn't crash; furtherEvaluation default ([]) or stray content
    // — either is acceptable, as long as the rest of the payload is present.
    expect(result.riskAssessment).toBeDefined();
    expect(result.humanCapabilities).toBeDefined();
  });
});
