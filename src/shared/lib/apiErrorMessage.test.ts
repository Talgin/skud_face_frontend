import { describe, expect, it } from "vitest";
import { apiErrorMessage } from "./apiErrorMessage";

describe("apiErrorMessage", () => {
  it("is null without an error", () => {
    expect(apiErrorMessage(undefined)).toBeNull();
  });

  it("shows the backend's detail", () => {
    expect(
      apiErrorMessage({
        status: 422,
        data: { detail: "No face found in the photo" },
      }),
    ).toBe("No face found in the photo");
  });

  it("joins FastAPI validation errors", () => {
    const error = {
      status: 422,
      data: {
        detail: [
          { loc: ["body", "name"], msg: "Field required" },
          { msg: "Too long" },
        ],
      },
    };
    expect(apiErrorMessage(error)).toBe("Field required; Too long");
  });

  it("explains server errors and lost connections without raw objects", () => {
    expect(
      apiErrorMessage({ status: 500, data: "Internal Server Error" }),
    ).toBe("Internal Server Error");
    expect(apiErrorMessage({ status: 502, data: null })).toMatch(/502/);
    expect(
      apiErrorMessage({
        status: "FETCH_ERROR",
        error: "TypeError: Failed to fetch",
      }),
    ).toMatch(/Сервер недоступен/);
    expect(apiErrorMessage({ status: 403, data: null })).toMatch(/прав/);
  });
});
