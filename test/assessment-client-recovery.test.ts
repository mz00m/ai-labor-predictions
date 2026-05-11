import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Assessment } from "@/lib/assessment/types";
import { hasStepOutput, tryRecoverStepFromDb } from "@/app/assessment/progress/recovery";

const baseAssessment = (overrides: Partial<Assessment> = {}): Assessment => ({
  id: "asmt_1",
  userId: "user_owner",
  status: "analyzing",
  currentStep: null,
  intake: {} as never,
  report: null as unknown as Assessment["report"],
  stepContext: null,
  addOns: { policyAndPrompts: false },
  stepFeedback: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as unknown as Assessment);

describe("hasStepOutput", () => {
  it("returns false for null assessment", () => {
    expect(hasStepOutput(null, "profile")).toBe(false);
  });

  it("detects profile completion via organizationProfile", () => {
    const a = baseAssessment({ report: { organizationProfile: { aiReadinessScore: 5 } } as never });
    expect(hasStepOutput(a, "profile")).toBe(true);
    expect(hasStepOutput(a, "tasks")).toBe(false);
  });

  it("detects tasks completion via non-empty taskAnalysis", () => {
    const a = baseAssessment({ report: { taskAnalysis: [{ taskName: "X" }] } as never });
    expect(hasStepOutput(a, "tasks")).toBe(true);
  });

  it("treats empty taskAnalysis as incomplete", () => {
    const a = baseAssessment({ report: { taskAnalysis: [] } as never });
    expect(hasStepOutput(a, "tasks")).toBe(false);
  });

  it("detects tools completion via non-empty toolRecommendations", () => {
    const a = baseAssessment({
      report: { toolRecommendations: [{ category: "X" }] } as never,
    });
    expect(hasStepOutput(a, "tools")).toBe(true);
  });

  it("detects tools completion via status=complete (auto-pipeline finished)", () => {
    // Tools is the final AUTO step — status=complete is set after it lands.
    const a = baseAssessment({ status: "complete" });
    expect(hasStepOutput(a, "tools")).toBe(true);
  });

  it("detects risks completion via riskAssessment.displacementRisk", () => {
    const a = baseAssessment({
      report: { riskAssessment: { displacementRisk: "Low risk for this role." } } as never,
    });
    expect(hasStepOutput(a, "risks")).toBe(true);
  });

  it("treats empty riskAssessment shell as incomplete", () => {
    // A schema-default risk assessment (empty displacementRisk) is not a
    // real result — recovery should keep polling.
    const a = baseAssessment({ report: { riskAssessment: { overallRiskLevel: "low" } } as never });
    expect(hasStepOutput(a, "risks")).toBe(false);
  });

  it("detects roadmap completion via roadmap actions present", () => {
    const a = baseAssessment({
      report: {
        implementationRoadmap: {
          immediate: { actions: [{ title: "X" }] },
          mediumTerm: { actions: [] },
          longTerm: { actions: [] },
        },
      } as never,
    });
    expect(hasStepOutput(a, "roadmap")).toBe(true);
  });

  it("detects roi completion via non-empty roiProjections", () => {
    const a = baseAssessment({
      report: { roiProjections: [{ area: "X" }] } as never,
    });
    expect(hasStepOutput(a, "roi")).toBe(true);
  });
});

describe("tryRecoverStepFromDb", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Speed up poll delays — otherwise each call waits 2s × 15 = 30s.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.fetch = originalFetch;
  });

  const setFetchSequence = (responses: Array<() => Promise<Response>>) => {
    let i = 0;
    globalThis.fetch = vi.fn(async () => {
      const next = responses[Math.min(i, responses.length - 1)];
      i += 1;
      return next();
    }) as unknown as typeof fetch;
  };

  const jsonResponse = (payload: unknown) =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  const runWithTimersAdvanced = async <T>(p: Promise<T>): Promise<T> => {
    // The helper awaits setTimeout between polls; advance timers in a loop
    // until the promise settles.
    const pending = { done: false as boolean, value: undefined as T | undefined, error: undefined as unknown };
    p.then(
      (v) => { pending.done = true; pending.value = v; },
      (e) => { pending.done = true; pending.error = e; },
    );
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await vi.advanceTimersByTimeAsync(2000);
      // Allow any pending microtasks to settle.
      await Promise.resolve();
      if (pending.done) break;
    }
    if (pending.error) throw pending.error;
    return pending.value as T;
  };

  it("returns the fresh assessment once the step output lands", async () => {
    const fresh = baseAssessment({
      report: { taskAnalysis: [{ taskName: "A" }] } as never,
    });
    setFetchSequence([
      () => Promise.resolve(jsonResponse({ assessment: baseAssessment() })),
      () => Promise.resolve(jsonResponse({ assessment: baseAssessment() })),
      () => Promise.resolve(jsonResponse({ assessment: fresh })),
    ]);

    const result = await runWithTimersAdvanced(tryRecoverStepFromDb("asmt_1", "tasks"));
    expect(result).not.toBeNull();
    expect(result?.report?.taskAnalysis?.[0]?.taskName).toBe("A");
  });

  it("returns null after exhausting polls with no step output", async () => {
    setFetchSequence([
      () => Promise.resolve(jsonResponse({ assessment: baseAssessment() })),
    ]);

    const result = await runWithTimersAdvanced(tryRecoverStepFromDb("asmt_1", "tools"));
    expect(result).toBeNull();
  });

  it("tolerates transient fetch errors and non-200 responses during polling", async () => {
    // Tools is the final AUTO step — status=complete is the recovery signal.
    const fresh = baseAssessment({ status: "complete" });
    setFetchSequence([
      () => Promise.reject(new Error("network blip")),
      () => Promise.resolve(new Response("boom", { status: 500 })),
      () => Promise.resolve(jsonResponse({ assessment: fresh })),
    ]);

    const result = await runWithTimersAdvanced(tryRecoverStepFromDb("asmt_1", "tools"));
    expect(result?.status).toBe("complete");
  });
});
