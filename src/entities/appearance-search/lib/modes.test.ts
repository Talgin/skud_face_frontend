import { describe, expect, it } from "vitest";
import { canToggle, nextModes } from "./modes";

describe("nextModes", () => {
  it("adds and removes a mode, keeping the list sorted and unique", () => {
    expect(nextModes(["face"], "recognition", true)).toEqual([
      "face",
      "recognition",
    ]);
    expect(nextModes(["face", "recognition"], "face", true)).toEqual([
      "face",
      "recognition",
    ]);
    expect(nextModes(["face", "recognition"], "recognition", false)).toEqual([
      "face",
    ]);
  });
});

describe("canToggle", () => {
  it("blocks switching on a mode without its source", () => {
    expect(canToggle(false, { ok: false, reason: "no stream" })).toBe(false);
    expect(canToggle(false, { ok: true, reason: "" })).toBe(true);
    expect(canToggle(false, undefined)).toBe(true);
  });
  it("always allows switching off", () => {
    expect(canToggle(true, { ok: false, reason: "no stream" })).toBe(true);
  });
});
