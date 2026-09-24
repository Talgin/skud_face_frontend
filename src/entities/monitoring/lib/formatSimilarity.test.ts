import { describe, expect, it } from "vitest";
import { formatSimilarity } from "./formatSimilarity";

describe("formatSimilarity", () => {
  it.each([null, undefined, Number.NaN])("shows a dash for %s (no match)", (value) => {
    expect(formatSimilarity(value)).toEqual({
      text: "—",
      className: "text-muted-foreground",
    });
  });

  it("formats as a percentage with one decimal", () => {
    expect(formatSimilarity(0.6789).text).toBe("67.9%");
  });

  it("colors high similarity green", () => {
    expect(formatSimilarity(0.6).className).toBe("text-green-600");
    expect(formatSimilarity(0.95).className).toBe("text-green-600");
  });

  it("colors medium similarity yellow", () => {
    expect(formatSimilarity(0.45).className).toBe("text-yellow-600");
    expect(formatSimilarity(0.59).className).toBe("text-yellow-600");
  });

  it("colors low similarity red", () => {
    expect(formatSimilarity(0.44).className).toBe("text-red-600");
  });

  it("keeps a real zero instead of treating it as no match", () => {
    expect(formatSimilarity(0)).toEqual({ text: "0.0%", className: "text-red-600" });
  });

  it("clamps values outside 0..1", () => {
    expect(formatSimilarity(1.2).text).toBe("100.0%");
    expect(formatSimilarity(-0.3).text).toBe("0.0%");
  });
});
