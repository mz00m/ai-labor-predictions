import { describe, it, expect } from "vitest";
import { stripPii } from "../pii-strip";

describe("stripPii", () => {
  it("redacts SSN", () => {
    const result = stripPii("My SSN is 123-45-6789.");
    expect(result.cleanedText).toBe("My SSN is [SSN REDACTED].");
    expect(result.redactedCount).toBe(1);
    expect(result.redactedTypes).toContain("SSN");
  });

  it("redacts email addresses", () => {
    const result = stripPii("Contact jane.doe@example.com for details.");
    expect(result.cleanedText).toBe("Contact [EMAIL REDACTED] for details.");
    expect(result.redactedTypes).toContain("Email");
  });

  it("redacts phone numbers", () => {
    const result = stripPii("Call (555) 123-4567 or 555-123-4567.");
    expect(result.cleanedText).not.toMatch(/555/);
    expect(result.redactedTypes).toContain("Phone");
  });

  it("redacts credit card numbers", () => {
    const result = stripPii("Card: 4111-1111-1111-1111");
    expect(result.cleanedText).toContain("[CARD REDACTED]");
    expect(result.redactedTypes).toContain("Credit Card");
  });

  it("redacts EIN", () => {
    const result = stripPii("Our EIN is 12-3456789.");
    expect(result.cleanedText).toContain("[EIN REDACTED]");
    expect(result.redactedTypes).toContain("EIN");
  });

  it("redacts IP addresses", () => {
    const result = stripPii("Server at 192.168.1.100 is down.");
    expect(result.cleanedText).toContain("[IP REDACTED]");
    expect(result.redactedTypes).toContain("IP Address");
  });

  it("redacts bank account references", () => {
    // Use a longer number that won't match the phone pattern
    const result = stripPii("routing 123456789012345");
    expect(result.cleanedText).toContain("[ACCOUNT REDACTED]");
    expect(result.redactedTypes).toContain("Bank Account");
  });

  it("handles multiple PII types in one string", () => {
    const text = "Jane at jane@co.com, SSN 111-22-3333, phone 555-867-5309.";
    const result = stripPii(text);
    expect(result.redactedCount).toBeGreaterThanOrEqual(3);
    expect(result.redactedTypes.length).toBeGreaterThanOrEqual(3);
  });

  it("returns unchanged text when no PII present", () => {
    const text = "The company uses AI tools for customer support automation.";
    const result = stripPii(text);
    expect(result.cleanedText).toBe(text);
    expect(result.redactedCount).toBe(0);
    expect(result.redactedTypes).toEqual([]);
  });
});
