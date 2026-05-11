import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseJsonFromText } from "../src/lib/assessment/analyze";
import {
  Step1ProfileSchema,
  Step2TasksSchema,
  Step3ToolsSchema,
  Step4RisksSchema,
  StepContextSchema,
} from "../src/lib/assessment/schemas";

// ─── parseJsonFromText unit tests ────────────────────────────────

describe("parseJsonFromText", () => {
  it("extracts JSON from markdown-fenced code block", () => {
    const text = 'Some preamble\n```json\n{"key": "value"}\n```\nSome trailing text';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ key: "value" });
  });

  it("extracts JSON from fenced block without json language tag", () => {
    const text = '```\n{"a": 1, "b": 2}\n```';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("extracts raw JSON object from text", () => {
    const text = 'Here is the result: {"score": 7, "label": "high"}';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ score: 7, label: "high" });
  });

  it("handles nested JSON objects", () => {
    const text = '{"outer": {"inner": [1, 2, 3]}}';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ outer: { inner: [1, 2, 3] } });
  });

  it("returns null for malformed JSON", () => {
    const text = '{"broken": }';
    const result = parseJsonFromText(text);
    expect(result).toBeNull();
  });

  it("returns null for empty string", () => {
    const result = parseJsonFromText("");
    expect(result).toBeNull();
  });

  it("returns null for text with no JSON", () => {
    const result = parseJsonFromText("Just some plain text with no JSON at all.");
    expect(result).toBeNull();
  });

  it("prefers fenced block over raw JSON", () => {
    const text = '{"raw": true}\n```json\n{"fenced": true}\n```';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ fenced: true });
  });
});

// ─── Zod schema safe defaults ────────────────────────────────────

describe("Zod schema safe defaults", () => {
  it("Step1ProfileSchema.parse({}) returns valid defaults", () => {
    const defaults = Step1ProfileSchema.parse({});
    expect(defaults.executiveSummary).toBe("");
    expect(defaults.organizationProfile.aiReadinessScore).toBe(5);
    expect(defaults.organizationProfile.keyStrengths).toEqual([]);
    expect(defaults.organizationProfile.keyGaps).toEqual([]);
    expect(defaults.quickWins).toEqual([]);
  });

  it("Step2TasksSchema.parse({}) returns valid defaults", () => {
    const defaults = Step2TasksSchema.parse({});
    expect(defaults.taskAnalysis).toEqual([]);
  });

  it("Step3ToolsSchema.parse({}) returns valid defaults", () => {
    const defaults = Step3ToolsSchema.parse({});
    expect(defaults.toolRecommendations).toEqual([]);
    expect(defaults.implementationRoadmap.immediate.timeframe).toBe("0-3 months");
    expect(defaults.implementationRoadmap.mediumTerm.timeframe).toBe("3-6 months");
    expect(defaults.implementationRoadmap.longTerm.timeframe).toBe("6-12+ months");
    expect(defaults.roiProjections).toEqual([]);
  });

  it("Step4RisksSchema.parse({}) returns valid defaults", () => {
    const defaults = Step4RisksSchema.parse({});
    expect(defaults.riskAssessment.overallRiskLevel).toBe("moderate");
    expect(defaults.riskAssessment.skillGaps).toEqual([]);
    expect(defaults.furtherEvaluation).toEqual([]);
  });

  it("StepContextSchema.parse({}) returns valid defaults", () => {
    const defaults = StepContextSchema.parse({});
    expect(defaults.documentInsights).toEqual([]);
  });
});

// ─── Step generators surface failures honestly ───────────────────
//
// Prior behavior: on a fatal Claude API error, each step returned empty
// defaults. That silently produced reports with blank executive summaries
// and empty tools sections. New contract: rethrow so the route returns 5xx
// and the client recovery path can engage instead of writing empty defaults
// to the DB.

// Mock the Anthropic SDK so callClaude throws on every attempt
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = {
        create: vi.fn().mockRejectedValue(new Error("Connection refused")),
      };
    },
  };
});

describe("Step generators surface failures on API error", () => {
  const minimalIntake = {
    organizationName: "Test Org",
    industry: "technology" as const,
    companySize: "11-50" as const,
    assessmentScope: "full-organization" as const,
    primaryFunctions: ["Engineering"],
    keyRoles: ["Developer"],
    currentTools: [],
    currentAiUsage: "exploring" as const,
    biggestChallenges: ["Scaling"],
    goals: ["Automate testing"],
    uploadedFiles: [],
  };

  // Dynamic import so the mock is applied before the module loads
  let generateStep1Profile: typeof import("../src/lib/assessment/analyze").generateStep1Profile;
  let generateStep2Tasks: typeof import("../src/lib/assessment/analyze").generateStep2Tasks;
  let generateStep3Tools: typeof import("../src/lib/assessment/analyze").generateStep3Tools;
  let generateStep4Risks: typeof import("../src/lib/assessment/analyze").generateStep4Risks;

  beforeEach(async () => {
    const mod = await import("../src/lib/assessment/analyze");
    generateStep1Profile = mod.generateStep1Profile;
    generateStep2Tasks = mod.generateStep2Tasks;
    generateStep3Tools = mod.generateStep3Tools;
    generateStep4Risks = mod.generateStep4Risks;
  });

  it("generateStep1Profile throws on API failure (no silent empty report)", async () => {
    await expect(generateStep1Profile(minimalIntake, [], null)).rejects.toThrow();
  });

  it("generateStep2Tasks throws on API failure (no silent empty taskAnalysis)", async () => {
    await expect(generateStep2Tasks(minimalIntake, {} as any)).rejects.toThrow();
  });

  it("generateStep3Tools throws on API failure (no silent empty tools section)", async () => {
    await expect(generateStep3Tools(minimalIntake, {} as any)).rejects.toThrow();
  });

  it("generateStep4Risks throws on API failure (no silent empty risk assessment)", async () => {
    await expect(generateStep4Risks(minimalIntake, {} as any)).rejects.toThrow();
  });
});
