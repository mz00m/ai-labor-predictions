import { describe, expect, it } from "vitest";
import confirmedSources from "@/data/confirmed-sources.json";
import siteStats from "@/data/site-stats.json";

describe("generated site statistics", () => {
  it("matches the canonical source registry", () => {
    const sources = Object.values(
      (confirmedSources as { sources: Record<string, { _action?: string; usedIn?: string[] }> }).sources,
    );
    const active = sources.filter((source) => source._action !== "REMOVE");

    expect(siteStats.sourceLibraryCount).toBe(sources.length);
    expect(siteStats.sourceCount).toBe(active.length);
    expect(siteStats.linkedSourceCount).toBe(
      active.filter((source) => (source.usedIn?.length ?? 0) > 0).length,
    );
  });
});
