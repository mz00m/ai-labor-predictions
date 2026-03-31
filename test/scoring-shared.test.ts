import { describe, it, expect } from "vitest";
import {
  WEIGHTS,
  adoptionSpeedScore,
  complementarityFromNEI,
  estimateComplementarityFromTasks,
  getEffectiveDimensions,
  dimensionalityAdjustment,
  clamp010,
  computeNetRisk,
} from "../src/lib/scoring-shared";

describe("WEIGHTS", () => {
  it("sums to 1.0", () => {
    const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });
});

describe("adoptionSpeedScore", () => {
  it("maps 0.6 (fastest) to ~10", () => {
    expect(adoptionSpeedScore(0.6)).toBeCloseTo(10, 1);
  });
  it("maps 1.4 (slowest) to 0", () => {
    expect(adoptionSpeedScore(1.4)).toBeCloseTo(0, 1);
  });
  it("maps 1.0 (baseline) to ~5", () => {
    expect(adoptionSpeedScore(1.0)).toBeCloseTo(5, 1);
  });
  it("clamps below 0", () => {
    expect(adoptionSpeedScore(2.0)).toBe(0);
  });
  it("clamps above 10", () => {
    expect(adoptionSpeedScore(0.0)).toBe(10);
  });
});

describe("complementarityFromNEI", () => {
  it("NEI 0 → 10 (fully enhancement)", () => {
    expect(complementarityFromNEI(0)).toBe(10);
  });
  it("NEI 1.0 → 5 (balanced)", () => {
    expect(complementarityFromNEI(1.0)).toBe(5);
  });
  it("NEI 2.0 → 0 (replacement)", () => {
    expect(complementarityFromNEI(2.0)).toBe(0);
  });
});

describe("estimateComplementarityFromTasks", () => {
  it("high interpersonal/physical → higher complementarity", () => {
    const score = estimateComplementarityFromTasks({
      "interpersonal": 0.4,
      "physical-manual": 0.3,
      "coordination-management": 0.1,
      "analysis-decision": 0.05,
      "information-processing": 0.05,
      "communication": 0.05,
      "creative-generative": 0.025,
      "technical-specialized": 0.025,
    });
    expect(score).toBeGreaterThan(5);
  });

  it("high information-processing → lower complementarity", () => {
    const score = estimateComplementarityFromTasks({
      "information-processing": 0.5,
      "communication": 0.2,
      "analysis-decision": 0.1,
      "interpersonal": 0.05,
      "physical-manual": 0.05,
      "coordination-management": 0.05,
      "creative-generative": 0.025,
      "technical-specialized": 0.025,
    });
    expect(score).toBeLessThan(5);
  });

  it("returns value between 1 and 9", () => {
    const score = estimateComplementarityFromTasks({
      "information-processing": 0.125,
      "communication": 0.125,
      "analysis-decision": 0.125,
      "interpersonal": 0.125,
      "physical-manual": 0.125,
      "coordination-management": 0.125,
      "creative-generative": 0.125,
      "technical-specialized": 0.125,
    });
    expect(score).toBeGreaterThanOrEqual(1);
    expect(score).toBeLessThanOrEqual(9);
  });
});

describe("getEffectiveDimensions", () => {
  it("counts categories with >= 10% share", () => {
    expect(getEffectiveDimensions({
      "information-processing": 0.30,
      "communication": 0.20,
      "analysis-decision": 0.15,
      "interpersonal": 0.10,
      "physical-manual": 0.10,
      "coordination-management": 0.05,
      "creative-generative": 0.05,
      "technical-specialized": 0.05,
    })).toBe(5);
  });

  it("returns 0 when all below 10%", () => {
    expect(getEffectiveDimensions({
      "information-processing": 0.09,
      "communication": 0.09,
    })).toBe(0);
  });
});

describe("dimensionalityAdjustment", () => {
  it("CFO mode: penalty at low dims", () => {
    expect(dimensionalityAdjustment(2, true)).toBe(-0.5);
  });
  it("CFO mode: bonus at high dims", () => {
    expect(dimensionalityAdjustment(6, true)).toBe(0.5);
  });
  it("CFO mode: no change in middle", () => {
    expect(dimensionalityAdjustment(4, true)).toBe(0);
  });
  it("heuristic mode: stronger penalty", () => {
    expect(dimensionalityAdjustment(2, false)).toBe(-1.5);
  });
  it("heuristic mode: bonus at 5+", () => {
    expect(dimensionalityAdjustment(5, false)).toBe(1.0);
  });
  it("respects custom lowThreshold", () => {
    // dims=3 with threshold=3 should trigger penalty
    expect(dimensionalityAdjustment(3, true, 3)).toBe(-0.5);
    // dims=3 with default threshold=2 should not
    expect(dimensionalityAdjustment(3, true)).toBe(0);
  });
});

describe("clamp010", () => {
  it("clamps negative to 0", () => {
    expect(clamp010(-5)).toBe(0);
  });
  it("clamps above 10", () => {
    expect(clamp010(15)).toBe(10);
  });
  it("passes through valid values", () => {
    expect(clamp010(5)).toBe(5);
  });
});

describe("computeNetRisk", () => {
  it("returns 5.0 when pressure equals absorption", () => {
    const result = computeNetRisk({
      technicalExposure: 5,
      adoptionSpeed: 5,
      adaptability: 5,
      demandElasticity: 5,
      complementarity: 5,
    });
    expect(result).toBeCloseTo(5.0, 1);
  });

  it("returns > 5 when pressure exceeds absorption", () => {
    const result = computeNetRisk({
      technicalExposure: 9,
      adoptionSpeed: 8,
      adaptability: 2,
      demandElasticity: 2,
      complementarity: 2,
    });
    expect(result).toBeGreaterThan(5);
  });

  it("returns < 5 when absorption exceeds pressure", () => {
    const result = computeNetRisk({
      technicalExposure: 2,
      adoptionSpeed: 2,
      adaptability: 8,
      demandElasticity: 8,
      complementarity: 8,
    });
    expect(result).toBeLessThan(5);
  });

  it("is bounded 0-10", () => {
    const extreme = computeNetRisk({
      technicalExposure: 10,
      adoptionSpeed: 10,
      adaptability: 0,
      demandElasticity: 0,
      complementarity: 0,
    });
    expect(extreme).toBeLessThanOrEqual(10);
    expect(extreme).toBeGreaterThanOrEqual(0);
  });
});
