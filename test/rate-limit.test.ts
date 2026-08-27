import { describe, expect, it } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

describe("rate limiting", () => {
  it("uses forwarded client IPs", () => {
    const request = new Request("https://jobsdata.ai", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.7");
  });

  it("enforces limits in the non-production fallback", async () => {
    const namespace = `test-${crypto.randomUUID()}`;
    const options = {
      namespace,
      identifier: "client",
      limit: 2,
      windowSeconds: 60,
    };

    expect((await checkRateLimit(options)).allowed).toBe(true);
    expect((await checkRateLimit(options)).allowed).toBe(true);
    expect((await checkRateLimit(options)).allowed).toBe(false);
  });
});
