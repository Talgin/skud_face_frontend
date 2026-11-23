import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS } from "../model/types";
import { filtersToParams, setTag, tagValue } from "./query";

describe("filtersToParams", () => {
  it("sends nothing for empty filters", () => {
    expect(filtersToParams(EMPTY_FILTERS).toString()).toBe("");
  });

  it("maps every filter to the API parameters", () => {
    const p = filtersToParams({
      types: ["ppe", "face"],
      cameraIds: [5, 7],
      since: new Date("2026-11-19T00:00:00Z"),
      until: new Date("2026-11-19T23:59:59Z"),
      violationsOnly: true,
      tags: ["helmet:no", "color:red"],
      q: "  123ABC ",
    });
    expect(p.get("types")).toBe("ppe,face");
    expect(p.get("camera_ids")).toBe("5,7");
    expect(p.get("since")).toBe("2026-11-19T00:00:00.000Z");
    expect(p.get("until")).toBe("2026-11-19T23:59:59.000Z");
    expect(p.get("violation")).toBe("true");
    expect(p.get("tags")).toBe("helmet:no,color:red");
    expect(p.get("q")).toBe("123ABC");
  });
});

describe("tags", () => {
  it("sets, replaces and clears one key", () => {
    let tags = setTag([], "helmet", "no");
    tags = setTag(tags, "color", "red");
    tags = setTag(tags, "helmet", "yes");
    expect(tags).toEqual(["color:red", "helmet:yes"]);
    expect(tagValue(tags, "helmet")).toBe("yes");
    expect(setTag(tags, "color", "")).toEqual(["helmet:yes"]);
    expect(tagValue([], "helmet")).toBe("");
  });

  it("does not confuse color with color.up", () => {
    const tags = ["color.up:red", "color:blue"];
    expect(tagValue(tags, "color")).toBe("blue");
    expect(setTag(tags, "color", "")).toEqual(["color.up:red"]);
  });
});
