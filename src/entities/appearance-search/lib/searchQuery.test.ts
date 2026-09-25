import { describe, expect, it } from "vitest";
import {
  buildSearchBody,
  DEFAULT_K,
  MAX_K,
  toUnixSeconds,
} from "./searchQuery";

const base = { text: "red jacket", k: 12, onePerPerson: true };

describe("buildSearchBody", () => {
  it("returns null for an empty query", () => {
    expect(buildSearchBody({ ...base, text: "   " })).toBeNull();
  });

  it("trims text and dedupes per person by default", () => {
    expect(buildSearchBody({ ...base, text: "  red jacket " })).toEqual({
      text: "red jacket",
      k: 12,
      dedupe: "track",
      camera_ids: null,
      ts_from: null,
      ts_to: null,
    });
  });

  it("sends every frame when one-per-person is off", () => {
    expect(buildSearchBody({ ...base, onePerPerson: false })?.dedupe).toBe(
      "none",
    );
  });

  it("passes the camera as a list", () => {
    expect(buildSearchBody({ ...base, cameraId: "22017" })?.camera_ids).toEqual(
      ["22017"],
    );
  });

  it("clamps k", () => {
    expect(buildSearchBody({ ...base, k: 500 })?.k).toBe(MAX_K);
    expect(buildSearchBody({ ...base, k: -3 })?.k).toBe(1);
    expect(buildSearchBody({ ...base, k: Number.NaN })?.k).toBe(DEFAULT_K);
  });

  it("converts local datetimes to unix seconds", () => {
    const body = buildSearchBody({
      ...base,
      from: "2026-09-24T09:00",
      to: "2026-09-24T18:30",
    });
    expect(body?.ts_from).toBe(new Date("2026-09-24T09:00").getTime() / 1000);
    expect((body?.ts_to ?? 0) - (body?.ts_from ?? 0)).toBe(9.5 * 3600);
  });
});

describe("toUnixSeconds", () => {
  it("ignores empty and invalid values", () => {
    expect(toUnixSeconds("")).toBeNull();
    expect(toUnixSeconds(undefined)).toBeNull();
    expect(toUnixSeconds("not a date")).toBeNull();
  });
});
