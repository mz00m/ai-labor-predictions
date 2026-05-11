import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AssessmentIntake, AssessmentReport } from "@/lib/assessment/types";

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

import {
  generateStep3Tools,
  generateStep3Roadmap,
  generateStep3Roi,
} from "@/lib/assessment/analyze";

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

describe("generateStep3Tools — single-call tools-only step", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("returns only the toolRecommendations payload (roadmap and ROI are separate)", async () => {
    createMock.mockResolvedValueOnce(
      fakeResponse({ toolRecommendations: [validTool("Docs"), validTool("CRM")] }),
    );

    const result = await generateStep3Tools(intake, {}, undefined, undefined);

    expect(result.toolRecommendations).toHaveLength(2);
    // Roadmap and ROI are now opt-in steps — they must NOT be returned by
    // the tools call. The previous combined behavior is what made step 3
    // slow and surfaced the "ROI without tools" partial-failure mode.
    expect(result.implementationRoadmap).toBeUndefined();
    expect(result.roiProjections).toBeUndefined();
  });

  it("makes exactly one Claude call (no parallel fan-out)", async () => {
    createMock.mockResolvedValueOnce(
      fakeResponse({ toolRecommendations: [validTool("Docs")] }),
    );

    await generateStep3Tools(intake, {}, undefined, undefined);

    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the tools call fails (no silent empty tools section)", async () => {
    createMock.mockRejectedValueOnce(new Error("upstream hang"));

    await expect(generateStep3Tools(intake, {}, undefined, undefined)).rejects.toThrow();
  });

  it("throws when the response parses but produces zero tools", async () => {
    createMock.mockResolvedValueOnce(fakeResponse({ toolRecommendations: [] }));

    await expect(generateStep3Tools(intake, {}, undefined, undefined)).rejects.toThrow();
  });

  it("uses a per-call timeout below the Vercel 300s function budget", async () => {
    createMock.mockResolvedValueOnce(fakeResponse({ toolRecommendations: [validTool("A")] }));

    await generateStep3Tools(intake, {}, undefined, undefined);

    const opts = createMock.mock.calls[0][1];
    expect(opts.timeout).toBeLessThan(300000);
    expect(opts.timeout).toBeGreaterThanOrEqual(120000);
  });
});

describe("generateStep3Roadmap — opt-in roadmap step", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("returns only the implementationRoadmap payload", async () => {
    createMock.mockResolvedValueOnce(
      fakeResponse({ implementationRoadmap: validRoadmap() }),
    );

    const result = await generateStep3Roadmap(intake, {}, undefined, undefined);

    expect(result.implementationRoadmap?.immediate?.actions).toHaveLength(1);
    expect(result.toolRecommendations).toBeUndefined();
    expect(result.roiProjections).toBeUndefined();
  });

  it("throws when the call fails", async () => {
    createMock.mockRejectedValueOnce(new Error("hang"));

    await expect(generateStep3Roadmap(intake, {}, undefined, undefined)).rejects.toThrow();
  });

  it("references already-generated tool recommendations in the prompt", async () => {
    const previousReport: Partial<AssessmentReport> = {
      toolRecommendations: [
        {
          category: "Docs",
          toolName: "Notion AI",
          purpose: "drafting",
          expectedValue: "save time",
          implementationEffort: "low",
          priorityTier: "immediate",
          recommendationTier: "start-here",
        },
      ],
    };
    createMock.mockResolvedValueOnce(fakeResponse({ implementationRoadmap: validRoadmap() }));

    await generateStep3Roadmap(intake, previousReport, undefined, undefined);

    const userPrompt = createMock.mock.calls[0][0].messages[0].content as string;
    expect(userPrompt).toContain("Notion AI");
  });
});

describe("generateStep3Roi — opt-in ROI step", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("returns only the roiProjections payload", async () => {
    createMock.mockResolvedValueOnce(fakeResponse({ roiProjections: validROI() }));

    const result = await generateStep3Roi(intake, {}, undefined, undefined);

    expect(result.roiProjections).toHaveLength(1);
    expect(result.toolRecommendations).toBeUndefined();
    expect(result.implementationRoadmap).toBeUndefined();
  });

  it("throws when the call fails", async () => {
    createMock.mockRejectedValueOnce(new Error("hang"));

    await expect(generateStep3Roi(intake, {}, undefined, undefined)).rejects.toThrow();
  });
});
