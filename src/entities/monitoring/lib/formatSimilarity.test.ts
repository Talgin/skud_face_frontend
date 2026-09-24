import { describe, expect, it } from "vitest";
import { formatSimilarity } from "./formatSimilarity";

describe("formatSimilarity", () => {
  it.each([null, undefined, Number.NaN])("shows a dash for %s (nobody enrolled)", (value) => {
    expect(formatSimilarity(value)).toEqual({
      text: "—",
      className: "text-muted-foreground",
    });
  });

  it("shows a whole percentage", () => {
    expect(formatSimilarity(0.4567, true).text).toBe("46%");
    expect(formatSimilarity(0.45, false).text).toBe("45%");
  });

  it("shows small similarities too", () => {
    expect(formatSimilarity(0.03, false).text).toBe("3%");
    expect(formatSimilarity(0, false).text).toBe("0%");
  });

  it("highlights recognized faces", () => {
    expect(formatSimilarity(0.56, true).className).toContain("text-green-600");
  });

  it("mutes faces that are only the nearest enrolled person", () => {
    expect(formatSimilarity(0.36, false).className).toBe("text-muted-foreground");
    expect(formatSimilarity(0.36).className).toBe("text-muted-foreground");
  });

  it("clamps values outside 0..1 (cosine can be slightly negative)", () => {
    expect(formatSimilarity(1.2, true).text).toBe("100%");
    expect(formatSimilarity(-0.3, false).text).toBe("0%");
  });
});
