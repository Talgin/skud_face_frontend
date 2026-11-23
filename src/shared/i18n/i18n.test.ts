import { describe, expect, it } from "vitest";
import { en } from "./dict/en";
import { kk } from "./dict/kk";
import { getLang, t } from "./index";

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

describe("i18n", () => {
  it("defaults to Russian and returns the key itself", () => {
    expect(getLang()).toBe("ru");
    expect(t("Камеры")).toBe("Камеры");
  });

  it("fills placeholders", () => {
    expect(t("Страница {n} из {total}", { n: 2, total: 5 })).toBe(
      "Страница 2 из 5",
    );
    expect(t("{n} мин", {})).toBe("{n} мин");
  });

  it("English and Kazakh have the same keys and placeholders", () => {
    expect(Object.keys(kk).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en)) {
      expect(placeholders(en[key]), key).toEqual(placeholders(key));
      expect(placeholders(kk[key]), key).toEqual(placeholders(key));
    }
  });
});
