import { describe, expect, it } from "vitest";
import { formatReview, isReviewed } from "./formatReview";

describe("formatReview", () => {
  it("shows confirmed with reviewer", () => {
    expect(formatReview({ review_status: "confirmed", reviewed_by: "admin@skud.local" })).toEqual({
      text: "✓ Подтверждено · admin@skud.local",
      className: "text-green-600",
    });
  });

  it("shows rejected without reviewer", () => {
    expect(formatReview({ review_status: "rejected" }).text).toBe("✗ Отклонено");
  });

  it("shows a dash when not reviewed", () => {
    expect(formatReview({}).text).toBe("—");
    expect(formatReview({ review_status: null }).text).toBe("—");
  });
});

describe("isReviewed", () => {
  it("is true only for a verdict", () => {
    expect(isReviewed({ review_status: "confirmed" })).toBe(true);
    expect(isReviewed({ review_status: "rejected" })).toBe(true);
    expect(isReviewed({ review_status: null })).toBe(false);
    expect(isReviewed({})).toBe(false);
  });
});
