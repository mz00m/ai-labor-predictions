import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks must be declared before importing the helper so hoisting applies to
// the transitive deps `authz.ts` reaches through `./auth` and `./db`.
vi.mock("@/lib/assessment/auth", () => ({
  getVerifiedEmail: vi.fn(),
}));
vi.mock("@/lib/assessment/db", () => ({
  getAssessment: vi.fn(),
  getUserByEmail: vi.fn(),
  saveFeedback: vi.fn(),
  saveAssessmentReport: vi.fn(),
}));
vi.mock("@/lib/assessment/analyze", () => ({
  generatePolicyAndPrompts: vi.fn(),
}));

import { requireAssessmentOwner } from "@/lib/assessment/authz";
import { getVerifiedEmail } from "@/lib/assessment/auth";
import {
  getAssessment,
  getUserByEmail,
  saveFeedback,
  saveAssessmentReport,
} from "@/lib/assessment/db";
import { generatePolicyAndPrompts } from "@/lib/assessment/analyze";
import { POST as feedbackPOST } from "@/app/api/assessment/feedback/route";
import { POST as addonPOST } from "@/app/api/assessment/addon/route";
import type { NextRequest } from "next/server";

const mockEmail = vi.mocked(getVerifiedEmail);
const mockAssessment = vi.mocked(getAssessment);
const mockUser = vi.mocked(getUserByEmail);
const mockSaveFeedback = vi.mocked(saveFeedback);
const mockSaveReport = vi.mocked(saveAssessmentReport);
const mockGeneratePolicy = vi.mocked(generatePolicyAndPrompts);

// Build a minimal Assessment-shaped object for the helper. The helper only
// looks at `userId`, but routes inspect `addOns`/`report`/`intake`, so we
// include those fields as needed per test.
const fakeAssessment = (overrides: Record<string, unknown> = {}) => ({
  id: "asmt_1",
  userId: "user_owner",
  status: "complete",
  currentStep: null,
  intake: {} as never,
  report: null,
  stepContext: null,
  addOns: { policyAndPrompts: false },
  stepFeedback: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as unknown as Awaited<ReturnType<typeof getAssessment>>);

const jsonReq = (body: unknown) =>
  ({
    json: async () => body,
  }) as unknown as NextRequest;

describe("requireAssessmentOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no verified session", async () => {
    mockEmail.mockResolvedValue(null);
    const r = await requireAssessmentOwner({} as NextRequest, "asmt_1");
    expect(r).toEqual({ ok: false, status: 401, error: "Verification required" });
  });

  it("returns 404 when the assessment does not exist", async () => {
    mockEmail.mockResolvedValue("alice@example.com");
    mockAssessment.mockResolvedValue(null);
    const r = await requireAssessmentOwner({} as NextRequest, "asmt_missing");
    expect(r).toEqual({ ok: false, status: 404, error: "Assessment not found" });
  });

  it("returns 403 when the caller is not the owner", async () => {
    mockEmail.mockResolvedValue("attacker@example.com");
    mockAssessment.mockResolvedValue(fakeAssessment({ userId: "user_victim" }));
    mockUser.mockResolvedValue({ id: "user_attacker", email: "attacker@example.com" });
    const r = await requireAssessmentOwner({} as NextRequest, "asmt_1");
    expect(r).toEqual({ ok: false, status: 403, error: "Access denied" });
  });

  it("returns 403 when email has no user record", async () => {
    mockEmail.mockResolvedValue("ghost@example.com");
    mockAssessment.mockResolvedValue(fakeAssessment({ userId: "user_owner" }));
    mockUser.mockResolvedValue(null);
    const r = await requireAssessmentOwner({} as NextRequest, "asmt_1");
    expect(r).toEqual({ ok: false, status: 403, error: "Access denied" });
  });

  it("returns ok with the assessment when the caller owns it", async () => {
    const assessment = fakeAssessment({ userId: "user_owner" });
    mockEmail.mockResolvedValue("owner@example.com");
    mockAssessment.mockResolvedValue(assessment);
    mockUser.mockResolvedValue({ id: "user_owner", email: "owner@example.com" });
    const r = await requireAssessmentOwner({} as NextRequest, "asmt_1");
    expect(r).toEqual({ ok: true, assessment, userId: "user_owner" });
  });
});

describe("POST /api/assessment/feedback — authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401s anonymous callers", async () => {
    mockEmail.mockResolvedValue(null);
    const res = await feedbackPOST(jsonReq({ assessmentId: "asmt_1", rating: 5 }));
    expect(res.status).toBe(401);
    expect(mockSaveFeedback).not.toHaveBeenCalled();
  });

  it("403s callers who don't own the target assessment", async () => {
    mockEmail.mockResolvedValue("attacker@example.com");
    mockAssessment.mockResolvedValue(fakeAssessment({ userId: "user_victim" }));
    mockUser.mockResolvedValue({ id: "user_attacker", email: "attacker@example.com" });
    const res = await feedbackPOST(jsonReq({ assessmentId: "asmt_1", rating: 1 }));
    expect(res.status).toBe(403);
    expect(mockSaveFeedback).not.toHaveBeenCalled();
  });

  it("404s when assessment is missing", async () => {
    mockEmail.mockResolvedValue("alice@example.com");
    mockAssessment.mockResolvedValue(null);
    const res = await feedbackPOST(jsonReq({ assessmentId: "asmt_missing", rating: 5 }));
    expect(res.status).toBe(404);
    expect(mockSaveFeedback).not.toHaveBeenCalled();
  });

  it("still rejects invalid payloads with 400 before auth runs", async () => {
    const res = await feedbackPOST(jsonReq({ assessmentId: "asmt_1", rating: 42 }));
    expect(res.status).toBe(400);
    expect(mockEmail).not.toHaveBeenCalled();
  });

  it("saves feedback when the caller is the owner", async () => {
    mockEmail.mockResolvedValue("owner@example.com");
    mockAssessment.mockResolvedValue(fakeAssessment({ userId: "user_owner" }));
    mockUser.mockResolvedValue({ id: "user_owner", email: "owner@example.com" });
    mockSaveFeedback.mockResolvedValue(undefined as unknown as void);
    const res = await feedbackPOST(
      jsonReq({ assessmentId: "asmt_1", rating: 4, comment: "great" }),
    );
    expect(res.status).toBe(200);
    expect(mockSaveFeedback).toHaveBeenCalledWith("asmt_1", 4, "great");
  });
});

describe("POST /api/assessment/addon — authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401s anonymous callers", async () => {
    mockEmail.mockResolvedValue(null);
    const res = await addonPOST(jsonReq({ assessmentId: "asmt_1" }));
    expect(res.status).toBe(401);
    expect(mockGeneratePolicy).not.toHaveBeenCalled();
  });

  it("403s callers who don't own the target assessment", async () => {
    mockEmail.mockResolvedValue("attacker@example.com");
    mockAssessment.mockResolvedValue(
      fakeAssessment({
        userId: "user_victim",
        addOns: { policyAndPrompts: true },
        report: { aiPolicy: null, promptLibrary: null } as never,
      }),
    );
    mockUser.mockResolvedValue({ id: "user_attacker", email: "attacker@example.com" });
    const res = await addonPOST(jsonReq({ assessmentId: "asmt_1" }));
    expect(res.status).toBe(403);
    expect(mockGeneratePolicy).not.toHaveBeenCalled();
    expect(mockSaveReport).not.toHaveBeenCalled();
  });

  it("still enforces add-on-not-purchased even for the owner", async () => {
    mockEmail.mockResolvedValue("owner@example.com");
    mockAssessment.mockResolvedValue(
      fakeAssessment({
        userId: "user_owner",
        addOns: { policyAndPrompts: false },
        report: {} as never,
      }),
    );
    mockUser.mockResolvedValue({ id: "user_owner", email: "owner@example.com" });
    const res = await addonPOST(jsonReq({ assessmentId: "asmt_1" }));
    expect(res.status).toBe(403);
    expect(mockGeneratePolicy).not.toHaveBeenCalled();
  });
});
