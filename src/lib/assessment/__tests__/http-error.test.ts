import { describe, it, expect } from "vitest";
import { HttpError, isNonRetryable } from "../http-error";

describe("isNonRetryable", () => {
  it("treats 4xx HttpErrors as non-retryable", () => {
    expect(isNonRetryable(new HttpError("Assessment ID required for multi-step mode", 400))).toBe(true);
    expect(isNonRetryable(new HttpError("Verification required", 401))).toBe(true);
    expect(isNonRetryable(new HttpError("Too many requests", 429))).toBe(true);
  });

  it("treats 5xx HttpErrors as retryable", () => {
    expect(isNonRetryable(new HttpError("Server error", 500))).toBe(false);
    expect(isNonRetryable(new HttpError("We're having trouble on our end", 503))).toBe(false);
  });

  it("treats non-HttpError failures (network, abort) as retryable", () => {
    expect(isNonRetryable(new Error("fetch failed"))).toBe(false);
    const abort = new Error("aborted");
    abort.name = "AbortError";
    expect(isNonRetryable(abort)).toBe(false);
    expect(isNonRetryable(undefined)).toBe(false);
  });

  it("does not depend on message content (the old string-matching bug)", () => {
    // A 400 with a custom server message must still be non-retryable
    expect(isNonRetryable(new HttpError("some custom message", 400))).toBe(true);
    // A plain Error containing the old magic words must NOT be treated specially
    expect(isNonRetryable(new Error("Please check your inputs and try again."))).toBe(false);
  });
});
