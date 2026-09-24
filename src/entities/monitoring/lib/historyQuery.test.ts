import { describe, expect, it } from "vitest";
import { buildHistoryQuery } from "./historyQuery";

describe("buildHistoryQuery", () => {
  it("sends only paging when no filters are set", () => {
    expect(buildHistoryQuery({}, 1, 30)).toEqual({ page: 1, page_size: 30 });
  });

  it("does not send a zero similarity (it hid every unknown face)", () => {
    expect(buildHistoryQuery({ minSimilarity: 0 }, 1, 30)).not.toHaveProperty("min_similarity");
  });

  it("sends a positive similarity", () => {
    expect(buildHistoryQuery({ minSimilarity: 0.21 }, 1, 30).min_similarity).toBe(0.21);
  });

  it("sends gender only when chosen", () => {
    expect(buildHistoryQuery({ gender: "" }, 1, 30)).not.toHaveProperty("gender");
    expect(buildHistoryQuery({ gender: "female" }, 2, 50)).toEqual({
      page: 2,
      page_size: 50,
      gender: "female",
    });
  });

  it("uses the whole chosen local day for the range", () => {
    // the calendar hands back local midnight; as an end bound that excluded the chosen day
    const day = new Date(2026, 8, 24); // 24 Sep, local midnight
    const q = buildHistoryQuery({ startDate: day, endDate: day }, 1, 30);
    expect(new Date(q.start_date as string).getTime()).toBe(new Date(2026, 8, 24, 0, 0, 0, 0).getTime());
    expect(new Date(q.end_date as string).getTime()).toBe(new Date(2026, 8, 24, 23, 59, 59, 999).getTime());
  });

  it("normalizes a date picked with a time part", () => {
    const q = buildHistoryQuery({ startDate: new Date(2026, 8, 24, 15, 30) }, 1, 30);
    expect(new Date(q.start_date as string).getTime()).toBe(new Date(2026, 8, 24).getTime());
  });

  it("combines all filters", () => {
    const q = buildHistoryQuery(
      { startDate: new Date(2026, 8, 1), endDate: new Date(2026, 8, 24), minSimilarity: 0.5, gender: "male" },
      1,
      30,
    );
    expect(Object.keys(q).sort()).toEqual(
      ["end_date", "gender", "min_similarity", "page", "page_size", "start_date"].sort(),
    );
  });
});
