import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AssessmentIntake } from "@/lib/assessment/types";

// Mock Anthropic SDK before importing. See step2-parallel test for hoisting notes.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: createMock };
    static APIConnectionError = class extends Error {};
    static APIConnectionTimeoutError = class extends Error {};
    static RateLimitError = class extends Error {};
    static InternalServerError = class extends Error {};
    static APIError = class extends Error {
      status?: number;
    };
  }
  return { default: MockAnthropic, Anthropic: MockAnthropic };
});

// Stub heavy context builders so we can focus on the Claude call behavior.
vi.mock("@/data/tools/index", () => ({
  formatToolsForPrompt: () => "## Tools KB\n(stubbed)",
}));
vi.mock("@/lib/assessment/onet-tasks", () => ({
  getOnetSummaryForPrompt: () => "",
}));
vi.mock("@/lib/assessment/research-context", () => ({
  formatResearchContextForPrompt: () => "",
}));

import { generateStep3Tools } from "@/lib/assessment/analyze";

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
  currentTools: [],
  toolPreference: "no-preference",
  budget: "under-10k",
  timeline: "3-months",
  decisionMaking: "collaborative",
  riskTolerance: "moderate",
  websiteUrl: "",
  uploadedFiles: [],
} as unknown as AssessmentIntake;

const validTool = (category: string) => ({
  category,
  purpose: "solve X",
  expectedValue: "save time",
  implementationEffort: "low",
  priorityTier: "immediate",
});

const validRoadmap = () => ({
  immediate: {
    timeframe: "This week to 3 months",
    objectives: ["do things"],
    actions: [{ title: "Action", description: "d", owner: "you", priority: "high", howTo: "how" }],
    expectedOutcomes: ["outcome"],
    estimatedInvestment: "$100/mo",
  },
  mediumTerm: { timeframe: "3-6mo", objectives: [], actions: [], expectedOutcomes: [], estimatedInvestment: "" },
  longTerm: { timeframe: "6-12mo+", objectives: [], actions: [], expectedOutcomes: [], estimatedInvestment: "" },
});

const validROI = () => [
  {
    area: "Reporting",
    currentCost: "$X",
    projectedSavings: "$Y",
    timeToValue: "3 months",
    confidence: "moderate",
    basis: "reasoning",
    calculationDetail: "math",
  },
];

const fakeResponse = (payload: unknown) => ({
  content: [{ type: "text", text: JSON.stringify(payload) }],
});

describe("generateStep3Tools — resilience to slow/failed calls", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("returns tools when the roadmap call fails", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse({ toolRecommendations: [validTool("A"), validTool("B")] }))
      .mockRejectedValueOnce(new Error("upstream hang"));

    const result = await generateStep3Tools(intake, {}, undefined, undefined);

    expect(result.toolRecommendations).toHaveLength(2);
    // Roadmap and ROI fall back to schema defaults — not null/undefined errors.
    expect(result.implementationRoadmap).toBeDefined();
    expect(result.roiProjections).toEqual([]);
  });

  it("returns roadmap + ROI when the tools call fails", async () => {
    createMock
      .mockRejectedValueOnce(new Error("upstream hang"))
      .mockResolvedValueOnce(
        fakeResponse({ implementationRoadmap: validRoadmap(), roiProjections: validROI() }),
      );

    const result = await generateStep3Tools(intake, {}, undefined, undefined);

    expect(result.toolRecommendations).toEqual([]);
    expect(result.implementationRoadmap?.immediate?.objectives).toEqual(["do things"]);
    expect(result.roiProjections).toHaveLength(1);
  });

  it("returns defaults when both calls fail — does not throw", async () => {
    createMock
      .mockRejectedValueOnce(new Error("A failed"))
      .mockRejectedValueOnce(new Error("B failed"));

    const result = await generateStep3Tools(intake, {}, undefined, undefined);

    expect(result.toolRecommendations).toEqual([]);
    expect(result.roiProjections).toEqual([]);
  });

  it("uses per-call timeout below the Vercel 300s function budget", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse({ toolRecommendations: [validTool("A")] }))
      .mockResolvedValueOnce(fakeResponse({ implementationRoadmap: validRoadmap(), roiProjections: validROI() }));

    await generateStep3Tools(intake, {}, undefined, undefined);

    // Timeout is the second arg to anthropic.messages.create.
    const opts0 = createMock.mock.calls[0][1];
    const opts1 = createMock.mock.calls[1][1];
    expect(opts0.timeout).toBeLessThan(300000);
    expect(opts1.timeout).toBeLessThan(300000);
    expect(opts0.timeout).toBeGreaterThanOrEqual(120000);
    expect(opts1.timeout).toBeGreaterThanOrEqual(120000);
  });

  it("happy path merges both calls into a complete step 3 result", async () => {
    createMock
      .mockResolvedValueOnce(
        fakeResponse({ toolRecommendations: [validTool("Docs"), validTool("CRM"), validTool("Reporting")] }),
      )
      .mockResolvedValueOnce(
        fakeResponse({ implementationRoadmap: validRoadmap(), roiProjections: validROI() }),
      );

    const result = await generateStep3Tools(intake, {}, undefined, undefined);

    expect(result.toolRecommendations).toHaveLength(3);
    expect(result.implementationRoadmap?.immediate?.actions).toHaveLength(1);
    expect(result.roiProjections).toHaveLength(1);
  });
});
