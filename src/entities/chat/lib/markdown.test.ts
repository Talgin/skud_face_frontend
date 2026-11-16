import { describe, expect, it } from "vitest";
import { parseBlocks } from "./markdown";

describe("parseBlocks", () => {
  it("splits paragraphs, lists and code", () => {
    const blocks = parseBlocks(
      "Нашёл 3 кадра:\n\n- камера 1, 19:02\n- камера 2\n\n1. a\n2. b\n```\nx\n```",
    );
    expect(blocks.map((b) => b.kind)).toEqual(["p", "ul", "ol", "code"]);
    expect(blocks[1]).toEqual({
      kind: "ul",
      items: ["камера 1, 19:02", "камера 2"],
    });
  });

  it("keeps consecutive lines in one paragraph", () => {
    expect(parseBlocks("a\nb")).toEqual([{ kind: "p", lines: ["a", "b"] }]);
  });
});
