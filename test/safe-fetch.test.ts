import { describe, expect, it } from "vitest";
import { assertPublicHttpUrl, isNonPublicIp, UnsafeUrlError } from "@/lib/security/safe-fetch";

describe("safe outbound URL validation", () => {
  it.each([
    "0.0.0.0",
    "10.0.0.1",
    "100.64.0.1",
    "127.0.0.1",
    "169.254.169.254",
    "172.20.0.1",
    "192.168.1.1",
    "198.18.0.1",
    "203.0.113.10",
    "224.0.0.1",
    "::",
    "::1",
    "fc00::1",
    "fe80::1",
    "ff02::1",
    "2001:db8::1",
    "::ffff:127.0.0.1",
  ])("rejects non-public IP %s", (ip) => {
    expect(isNonPublicIp(ip)).toBe(true);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])(
    "allows public IP %s",
    (ip) => {
      expect(isNonPublicIp(ip)).toBe(false);
    },
  );

  it.each([
    "http://localhost/",
    "https://service.internal/",
    "http://127.0.0.1/",
    "http://[::1]/",
    "http://169.254.169.254/latest/meta-data/",
    "ftp://example.com/file",
    "https://user:password@example.com/",
  ])("rejects unsafe URL %s", async (url) => {
    await expect(assertPublicHttpUrl(url)).rejects.toBeInstanceOf(UnsafeUrlError);
  });
});
