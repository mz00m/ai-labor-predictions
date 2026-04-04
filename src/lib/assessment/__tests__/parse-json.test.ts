import { describe, it, expect } from "vitest";
import { parseJsonFromText } from "../analyze";

describe("parseJsonFromText", () => {
  it("parses plain JSON object", () => {
    const result = parseJsonFromText('{"key": "value", "num": 42}');
    expect(result).toEqual({ key: "value", num: 42 });
  });

  it("parses JSON embedded in surrounding text", () => {
    const text = 'Here is the result:\n{"score": 7, "label": "high"}\nEnd of response.';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ score: 7, label: "high" });
  });

  it("parses markdown-fenced JSON with ```json tag", () => {
    const text = 'Here is the analysis:\n```json\n{"tasks": ["a", "b"], "ready": true}\n```\nDone.';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ tasks: ["a", "b"], ready: true });
  });

  it("parses markdown-fenced JSON without json tag", () => {
    const text = '```\n{"plain": "fence"}\n```';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ plain: "fence" });
  });

  it("prefers fenced JSON over bare JSON in surrounding text", () => {
    const text = 'Bad: {"wrong": true}\n```json\n{"correct": true}\n```';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ correct: true });
  });

  it("returns null for completely invalid text", () => {
    expect(parseJsonFromText("no json here at all")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseJsonFromText('{"broken": }')).toBeNull();
  });

  it("handles nested objects", () => {
    const text = '{"outer": {"inner": [1, 2, 3]}}';
    const result = parseJsonFromText(text);
    expect(result).toEqual({ outer: { inner: [1, 2, 3] } });
  });

  it("returns null for empty string", () => {
    expect(parseJsonFromText("")).toBeNull();
  });
});
