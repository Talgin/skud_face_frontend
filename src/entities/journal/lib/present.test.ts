import { describe, expect, it } from "vitest";
import type { JournalEvent } from "../model/types";
import { colorName, lookOf } from "./present";

const base: JournalEvent = {
  id: "x",
  type: "ppe",
  type_label: "Контроль СИЗ",
  ts: "2026-11-19T11:55:28Z",
  camera_id: 5,
  camera_host: "rtsp-test-camera",
  title: "Без каски",
  violation: true,
  tags: [],
  has_crop: true,
  has_frame: true,
  data: {},
};

describe("card looks", () => {
  it("PPE shows helmet / vest with tones and the upper clothing color", () => {
    const e = {
      ...base,
      data: {
        helmet: false,
        vest: true,
        colors: { up: "light_blue", low: "black" },
      },
    };
    const f = lookOf("ppe").fields(e);
    expect(f[0]).toEqual({ label: "Каска", value: "нет", tone: "bad" });
    expect(f[1]).toEqual({ label: "Жилет", value: "есть", tone: "good" });
    expect(f[2]).toEqual({ label: "Верх", value: "голубой" });
    expect(
      lookOf("ppe")
        .details(e)
        .map((x) => x.label),
    ).toContain("Низ");
  });

  it("PPE marks an unjudged helmet as unknown", () => {
    const f = lookOf("ppe").fields({
      ...base,
      data: { helmet: null, vest: false },
    });
    expect(f[0]).toEqual({
      label: "Каска",
      value: "не определено",
      tone: "muted",
    });
  });

  it("face and LPR use the title", () => {
    expect(
      lookOf("face").fields({ ...base, type: "face", title: "Unknown" })[0]
        .value,
    ).toBe("Unknown");
    expect(
      lookOf("lpr").fields({ ...base, type: "lpr", title: "123ABC02" })[0],
    ).toEqual({
      label: "Номер",
      value: "123ABC02",
    });
  });

  it("unknown types fall back to a generic look", () => {
    const look = lookOf("pose");
    expect(look.badge).toBe("Событие");
    expect(
      look.details({ ...base, type: "pose", data: { a: 1, b: { c: 2 } } }),
    ).toEqual([
      { label: "a", value: "1" },
      { label: "b", value: '{"c":2}' },
    ]);
  });

  it("translates colors and keeps unknown ones", () => {
    expect(colorName("green")).toBe("зелёный");
    expect(colorName("teal")).toBe("teal");
    expect(colorName(undefined)).toBe("—");
  });
});
