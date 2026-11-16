import { describe, expect, it } from "vitest";
import { createSseParser } from "./sse";

describe("createSseParser", () => {
  it("joins events split across chunks and skips comments", () => {
    const got: string[] = [];
    const feed = createSseParser((d) => got.push(d));
    feed('data: {"type":"del');
    feed('ta","text":"a"}\n\n: keep-alive\n\ndata: {"type":"done"}\r\n\r\n');
    expect(got).toEqual(['{"type":"delta","text":"a"}', '{"type":"done"}']);
  });

  it("keeps an unfinished event in the buffer", () => {
    const got: string[] = [];
    const feed = createSseParser((d) => got.push(d));
    feed("data: x\n");
    expect(got).toEqual([]);
    feed("\n");
    expect(got).toEqual(["x"]);
  });
});
