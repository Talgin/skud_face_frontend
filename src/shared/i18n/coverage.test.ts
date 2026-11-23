import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { en } from "./dict/en";
import { kk } from "./dict/kk";

// Every t("...") in the app must have an English and a Kazakh entry, so no screen shows Russian in
// the other languages. New text: wrap it in t() and add it to dict/en.ts and dict/kk.ts.
const SRC = join(__dirname, "..", "..");
const CYRILLIC = /[А-Яа-яЁё]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

function translationKeys(): Map<string, string> {
  const keys = new Map<string, string>();
  for (const file of sourceFiles(SRC)) {
    if (file.includes(join("shared", "i18n", "dict"))) continue;
    const text = readFileSync(file, "utf8");
    for (const m of Array.from(
      text.matchAll(/(?<![\w.$])t\(\s*"((?:\\.|[^"\\])*)"/g),
    )) {
      keys.set(JSON.parse(`"${m[1]}"`), file.slice(SRC.length + 1));
    }
  }
  return keys;
}

describe("translations", () => {
  const keys = translationKeys();

  it("finds the app's strings", () => {
    expect(keys.size).toBeGreaterThan(300);
  });

  for (const [lang, dict] of [
    ["en", en],
    ["kk", kk],
  ] as const) {
    it(`every UI string has a ${lang} translation`, () => {
      const missing = Array.from(keys)
        .filter(([k]) => !dict[k])
        .map(([k, f]) => `${f}: ${k}`);
      expect(missing).toEqual([]);
    });
  }

  it("English texts contain no Cyrillic", () => {
    const leftovers = Object.entries(en).filter(([, v]) => CYRILLIC.test(v));
    expect(leftovers).toEqual([]);
  });
});
