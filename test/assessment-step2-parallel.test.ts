import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AssessmentIntake } from "@/lib/assessment/types";

// Mock the Anthropic SDK before importing the module under test so the
// internal `anthropic.messages.create` call can be stubbed per-test.
// `vi.hoisted` is required because the `vi.mock` factory is hoisted above
// top-level `const` declarations.
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
  return {
    default: MockAnthropic,
    Anthropic: MockAnthropic,
  };
});

// Stub the heavy context builders — they pull in industry templates / O*NET
// data we don't need for this test. We only care about call fan-out and
// dedup logic in generateStep2Tasks.
vi.mock("@/lib/assessment/industry-templates", () => ({
  getIndustryTemplate: () => ({ departments: [] }),
}));
vi.mock("@/lib/assessment/onet-tasks", () => ({
  getOnetSummaryForPrompt: () => "",
}));
vi.mock("@/lib/assessment/capabilities-context", () => ({
  formatCapabilitiesForPrompt: () => "",
}));

import { generateStep2Tasks } from "@/lib/assessment/analyze";

// Shape of a single valid task object — includes all required fields per
// TaskAnalysisSchema so it survives Step2TasksSchema validation.
const validTask = (name: string) => ({
  taskName: name,
  department: "Operations",
  currentProcess: "Manual process",
  aiOpportunity: "high",
  aiApproach: "Use AI to automate",
  expectedImpact: "5 hrs/week saved",
  complexity: "simple",
  estimatedTimeSaved: "5 hrs/week",
  exampleTools: [],
  gettingStarted: "Open ChatGPT and paste your last 3 examples",
  starterPrompt: "Help me automate [THING]",
  deploymentModel: "copilot",
  deploymentModelRationale: "Low risk",
});

const intake: AssessmentIntake = {
  organizationName: "Test Org",
  industry: "technology",
  orgSize: "50-250",
  keyRoles: ["ops"],
  primaryFunctions: ["reporting"],
  biggestChallenges: ["slow reports"],
  goals: ["save time"],
  aiMaturity: "exploring",
  currentTools: [],
  budget: "under-10k",
  timeline: "3-months",
  decisionMaking: "collaborative",
  riskTolerance: "moderate",
  websiteUrl: "",
  uploadedFiles: [],
} as unknown as AssessmentIntake;

// Helper: produce a fake SDK response wrapping the given task list inside a
// `taskAnalysis` JSON payload.
const fakeResponse = (tasks: unknown[]) => ({
  content: [
    {
      type: "text",
      text: JSON.stringify({ taskAnalysis: tasks }),
    },
  ],
});

describe("generateStep2Tasks — parallelization + dedupe", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("fans out to two parallel Claude calls", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse([validTask("Weekly status report")]))
      .mockResolvedValueOnce(fakeResponse([validTask("Deeper customer segmentation analysis")]));

    const result = await generateStep2Tasks(intake, {}, undefined, undefined);

    expect(createMock).toHaveBeenCalledTimes(2);
    expect(result.taskAnalysis).toHaveLength(2);
    expect(result.taskAnalysis?.map((t) => t.taskName)).toEqual([
      "Weekly status report",
      "Deeper customer segmentation analysis",
    ]);
  });

  it("sends different focus instructions to each call", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse([validTask("A")]))
      .mockResolvedValueOnce(fakeResponse([validTask("B")]));

    await generateStep2Tasks(intake, {}, undefined, undefined);

    const userPromptA = createMock.mock.calls[0][0].messages[0].content as string;
    const userPromptB = createMock.mock.calls[1][0].messages[0].content as string;

    expect(userPromptA).toContain("TIME-SAVING AUTOMATION");
    expect(userPromptA).not.toContain("QUALITY UPLIFT AND NEW CAPABILITIES");
    expect(userPromptB).toContain("QUALITY UPLIFT AND NEW CAPABILITIES");
    expect(userPromptB).not.toContain("TIME-SAVING AUTOMATION");
  });

  it("dedupes tasks with matching names (case-insensitive) across calls", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse([validTask("Weekly Status Report"), validTask("Lead qualification")]))
      .mockResolvedValueOnce(fakeResponse([validTask("weekly status report"), validTask("Strategic planning")]));

    const result = await generateStep2Tasks(intake, {}, undefined, undefined);

    // 4 raw tasks, but "Weekly Status Report" appears in both calls → 3 unique
    expect(result.taskAnalysis).toHaveLength(3);
    const names = result.taskAnalysis?.map((t) => t.taskName.toLowerCase());
    expect(names).toContain("weekly status report");
    expect(names).toContain("lead qualification");
    expect(names).toContain("strategic planning");
  });

  it("returns partial results when only one call succeeds", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse([validTask("A"), validTask("B")]))
      .mockRejectedValueOnce(new Error("network blip"));

    const result = await generateStep2Tasks(intake, {}, undefined, undefined);

    expect(result.taskAnalysis).toHaveLength(2);
    expect(result.taskAnalysis?.map((t) => t.taskName)).toEqual(["A", "B"]);
  });

  it("throws when both calls fail (no silent empty taskAnalysis)", async () => {
    // Step 2 was changed to throw rather than silently write an empty
    // taskAnalysis to the DB — empty tasks downstream produce an empty tools
    // section and a hollow report. Surfacing 5xx lets the client recovery
    // path engage instead.
    createMock
      .mockRejectedValueOnce(new Error("network blip A"))
      .mockRejectedValueOnce(new Error("network blip B"));

    await expect(generateStep2Tasks(intake, {}, undefined, undefined)).rejects.toThrow();
  });

  it("uses smaller per-call max_tokens than the old single-call 8000", async () => {
    createMock
      .mockResolvedValueOnce(fakeResponse([validTask("A")]))
      .mockResolvedValueOnce(fakeResponse([validTask("B")]));

    await generateStep2Tasks(intake, {}, undefined, undefined);

    const firstMaxTokens = createMock.mock.calls[0][0].max_tokens;
    const secondMaxTokens = createMock.mock.calls[1][0].max_tokens;
    expect(firstMaxTokens).toBeLessThanOrEqual(5000);
    expect(secondMaxTokens).toBeLessThanOrEqual(5000);
  });
});
