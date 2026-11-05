import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import {
  signToken,
  verifyToken,
  signAccessToken,
  getScopedAssessmentIds,
} from "@/lib/assessment/auth";

const req = (cookie: string) => new NextRequest("http://localhost/", { headers: { cookie } });

describe("assessment session tokens", () => {
  beforeAll(() => {
    process.env.ASSESSMENT_JWT_SECRET = "test-secret-at-least-32-bytes-long-xx";
  });

  it("verifies an email session", async () => {
    expect(await verifyToken(await signToken("a@b.com"))).toEqual({ email: "a@b.com" });
  });

  it("never accepts an assessment-scoped token as an email session", async () => {
    expect(await verifyToken(await signAccessToken(["asmt_1"]))).toBeNull();
  });

  it("reads the granted ids from the access cookie", async () => {
    const token = await signAccessToken(["asmt_1", "asmt_2"]);
    expect(await getScopedAssessmentIds(req(`assessment_access=${token}`))).toEqual(["asmt_1", "asmt_2"]);
  });

  it("ignores an email session placed in the access cookie", async () => {
    const token = await signToken("a@b.com");
    expect(await getScopedAssessmentIds(req(`assessment_access=${token}`))).toEqual([]);
  });

  it("rejects a tampered access token", async () => {
    const token = await signAccessToken(["asmt_1"]);
    expect(await getScopedAssessmentIds(req(`assessment_access=${token}x`))).toEqual([]);
  });

  it("keeps only the 10 most recent grants", async () => {
    const ids = Array.from({ length: 15 }, (_, i) => `asmt_${i}`);
    const granted = await getScopedAssessmentIds(req(`assessment_access=${await signAccessToken(ids)}`));
    expect(granted).toEqual(ids.slice(-10));
  });
});
