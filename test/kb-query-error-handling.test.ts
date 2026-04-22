import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist the Anthropic mock before module import. See step2-parallel test for
// why this pattern is needed.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: createMock };
    static APIError = class extends Error {
      status?: number;
    };
  }
  return { default: MockAnthropic, Anthropic: MockAnthropic };
});

// The route requires a valid admin token; stub the check.
vi.mock("@/lib/admin-auth", () => ({
  checkAdminToken: vi.fn(async () => true),
}));

import { POST as kbQueryPOST } from "@/app/api/kb/query/route";
import type { NextRequest } from "next/server";

const buildReq = (body: unknown, token = "admin-token"): NextRequest =>
  ({
    cookies: { get: (name: string) => (name === "kb_session" ? { value: token } : undefined) },
    nextUrl: { searchParams: new URLSearchParams() } as unknown,
    headers: { get: () => null },
    json: async () => body,
  }) as unknown as NextRequest;

describe("POST /api/kb/query — error surfacing", () => {
  beforeEach(() => {
    createMock.mockReset();
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  it("returns a 502 with the Anthropic error message when the model call throws", async () => {
    // Simulate the exact failure mode from the claude-mythos-0417 incident.
    const err = Object.assign(new Error("model: claude-mythos-0417"), { status: 404 });
    createMock.mockRejectedValue(err);

    const res = await kbQueryPOST(buildReq({ query: "What is the AI Readiness Score?" }));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toContain("model: claude-mythos-0417");
    expect(body.status).toBe(404);
  });

  it("returns 401 when the admin token is rejected", async () => {
    const { checkAdminToken } = await import("@/lib/admin-auth");
    vi.mocked(checkAdminToken).mockResolvedValueOnce(false);

    const res = await kbQueryPOST(buildReq({ query: "anything" }));
    expect(res.status).toBe(401);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 400 when query is missing", async () => {
    const res = await kbQueryPOST(buildReq({}));
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 500 when ANTHROPIC_API_KEY is not set", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const res = await kbQueryPOST(buildReq({ query: "anything" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/ANTHROPIC_API_KEY/);
  });

  it("returns a streaming Response when the model call succeeds", async () => {
    // Minimal async iterable that yields one text delta and closes.
    createMock.mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { type: "content_block_delta", delta: { type: "text_delta", text: "hello" } };
      },
    });

    const res = await kbQueryPOST(buildReq({ query: "ping" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    // Drain the stream and assert the delta landed.
    const text = await res.text();
    expect(text).toContain("hello");
  });
});
