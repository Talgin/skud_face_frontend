import { describe, expect, it } from "vitest";
import type { SearchHit, SearchResponse } from "../types";
import {
  attributesSummary,
  cameraLabel,
  formatScore,
  hitPerson,
  openImageUrl,
  scoreBreakdown,
  searchImageUrl,
  statusLine,
} from "./format";

const hit: SearchHit = {
  id: "face:abc_frame.jpg",
  score: 0.1234,
  whole_score: 0.11,
  phrase_scores: [0.12, 0.09],
  weakest: 0.09,
  below_floor: false,
  kind: "face",
  camera_id: "22017",
  camera_host: "10.1.22.17",
  track_id: "17",
  person_id: "",
  frame_object: "abc_frame.jpg",
  timestamp: 1790000000,
  when: "2026-09-24 19:01:00",
  frame_available: true,
  vms_url: null,
};

describe("image urls", () => {
  it("escapes the row id and goes through the proxy", () => {
    expect(searchImageUrl("face:a/b.jpg", "thumb")).toBe(
      "/api/search/events/face%3Aa%2Fb.jpg/thumb",
    );
    expect(searchImageUrl("x", "annotated")).toBe(
      "/api/search/events/x/frame?annotate=1",
    );
    expect(searchImageUrl("x", "frame")).toBe("/api/search/events/x/frame");
  });

  it("opens the frame while it exists, else the stored crop", () => {
    expect(openImageUrl(hit)).toMatch(/\/frame$/);
    expect(openImageUrl({ ...hit, frame_available: false })).toMatch(
      /\/thumb$/,
    );
    expect(openImageUrl({ ...hit, frame_available: null })).toMatch(/\/frame$/);
  });
});

describe("scores", () => {
  it("shows three decimals", () => {
    expect(formatScore(0.1234)).toBe("0.123");
    expect(formatScore(Number.NaN)).toBe("—");
  });

  it("explains the fused score", () => {
    expect(scoreBreakdown(hit)).toBe("целиком 0.110 · фразы 0.120 0.090");
    expect(
      scoreBreakdown({ ...hit, phrase_scores: [], below_floor: true }),
    ).toBe("целиком 0.110 · ниже уровня шума");
  });
});

describe("cameraLabel", () => {
  it("uses the host when the camera has no name", () => {
    expect(
      cameraLabel({
        camera_id: "22017",
        camera_host: "10.1.22.17",
        name: "camera 22017",
      }),
    ).toBe("22017 · 10.1.22.17");
  });
  it("prefers a real name", () => {
    expect(
      cameraLabel({ camera_id: "1", camera_host: "10.0.0.1", name: "Вход" }),
    ).toBe("1 · Вход");
  });
});

describe("hitPerson", () => {
  it("names a face DB match", () => {
    expect(
      hitPerson({
        ...hit,
        person_id: "student-1",
        recognition: {
          person_id: "student-1",
          is_known: true,
          person_name: "Едилхан Дидар",
        },
      }),
    ).toEqual({ label: "Едилхан Дидар", known: true });
  });

  it("falls back to the person id without a name", () => {
    expect(
      hitPerson({
        ...hit,
        recognition: { person_id: "student-2", is_known: true },
      }).label,
    ).toBe("student-2");
  });

  it("says unknown when recognition ran but nobody matched", () => {
    expect(
      hitPerson({ ...hit, recognition: { person_id: "", is_known: false } }),
    ).toEqual({ label: "Неизвестный", known: false });
  });

  it("shows the track without recognition", () => {
    expect(hitPerson(hit)).toEqual({ label: "трек 17", known: false });
    expect(hitPerson({ ...hit, track_id: "" }).label).toBe("—");
  });
});

describe("attributesSummary", () => {
  it("joins known slots and drops unknown/none", () => {
    expect(
      attributesSummary({
        upper_color: "white",
        upper_type: "shirt",
        lower_color: "blue",
        lower_type: "jeans",
        bag: "none",
        headwear: "cap",
      }),
    ).toBe("white shirt · blue jeans · cap");
    expect(
      attributesSummary({ upper_color: "unknown", upper_type: "unknown" }),
    ).toBe("");
    expect(attributesSummary(null)).toBe("");
  });
});

describe("statusLine", () => {
  const res: SearchResponse = {
    query: "q",
    text: "q",
    phrases: ["a person wearing blue jeans"],
    notes: ["yesterday"],
    constraints: { lower_color: "blue" },
    filter: "",
    ts_from: null,
    ts_to: null,
    camera_ids: [],
    hits: [hit],
  };
  it("says what was understood", () => {
    expect(statusLine(res, 123.4)).toBe(
      "Найдено: 1 · 123 мс · понято: yesterday · фразы: a person wearing blue jeans · атрибуты: lower_color=blue",
    );
  });
  it("omits empty parts", () => {
    expect(
      statusLine({ ...res, notes: [], phrases: [], constraints: {} }, 5),
    ).toBe("Найдено: 1 · 5 мс");
  });
});
