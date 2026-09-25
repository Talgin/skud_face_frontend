import { describe, expect, it } from "vitest";
import { evalTotals, nextLabel, precisionCell } from "./evalReport";

describe("precisionCell", () => {
  it("formats precision with the counts", () => {
    expect(
      precisionCell({ p_at_k: 0.5, hits: 3, judged: 6, unjudged: 0 }),
    ).toBe("0.50 (3/6)");
    expect(precisionCell({ p_at_k: 1, hits: 2, judged: 2, unjudged: 4 })).toBe(
      "1.00 (2/2, без оценки 4)",
    );
    expect(
      precisionCell({ p_at_k: null, hits: 0, judged: 0, unjudged: 6 }),
    ).toBe("–");
  });
});

describe("evalTotals", () => {
  it("counts queries and labels", () => {
    expect(
      evalTotals([
        { query: "a", relevant: 2, irrelevant: 1 },
        { query: "b", relevant: 0, irrelevant: 4 },
      ]),
    ).toBe("2 запросов · 7 оценок");
    expect(evalTotals([])).toBe("0 запросов · 0 оценок");
  });
});

describe("nextLabel", () => {
  it("sets a verdict and clears it on a second click", () => {
    expect(nextLabel(undefined, true)).toBe(true);
    expect(nextLabel(false, true)).toBe(true);
    expect(nextLabel(true, true)).toBeNull();
    expect(nextLabel(false, false)).toBeNull();
  });
});
