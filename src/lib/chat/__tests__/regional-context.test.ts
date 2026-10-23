import { describe, expect, it } from "vitest";
import { buildRegionalContext } from "../regional-context";

describe("buildRegionalContext", () => {
  it("matches a metro and its counties with a lowercase state code", () => {
    const ctx = buildRegionalContext(
      "how can i get an analysis of impacts in my regions - Harrisonburg, Va and Rockingham Co, Va?"
    );
    expect(ctx).toContain("map?view=metro&id=25500");
    expect(ctx).toContain("map?view=county&id=51165");
    expect(ctx).not.toContain("Rockingham County, North Carolina");
  });

  it("matches a state by name", () => {
    expect(buildRegionalContext("Is AI hurting jobs in Ohio?")).toContain("map?view=country&id=39");
  });

  it("does not treat common words as places", () => {
    expect(buildRegionalContext("Will mobile apps replace call centers?")).toBeNull();
    expect(buildRegionalContext("how does electricity compare to AI?")).toBeNull();
  });

  it("does not read 'in' after a comma as Indiana", () => {
    const ctx = buildRegionalContext("Hi, in my county what happens to nurses?");
    expect(ctx).not.toContain("Indiana");
    expect(ctx).toContain("No specific region was matched");
  });
});
