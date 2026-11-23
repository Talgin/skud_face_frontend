import { afterEach, describe, expect, it, vi } from "vitest";
import type { JournalEvent } from "@/entities/journal/model/types";

// A user picks a language, the page reloads, and every screen follows it. Modules are re-imported
// after "reloading" so module-level strings (menus, columns) are rebuilt, as in the browser.
function browserWithStoredLang(lang: string | null) {
  const store = new Map<string, string>(lang ? [["skud.lang", lang]] : []);
  const reload = vi.fn();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  });
  vi.stubGlobal("window", { location: { reload } });
  vi.stubGlobal("document", { documentElement: { lang: "" } });
  vi.resetModules();
  return { store, reload };
}

const ppeViolation: JournalEvent = {
  id: "e1",
  type: "ppe",
  type_label: "Контроль СИЗ",
  ts: "2026-11-23T08:15:00Z",
  camera_id: 5,
  camera_host: "gate-cam",
  title: "Без каски",
  violation: true,
  tags: [],
  has_crop: true,
  has_frame: true,
  data: { helmet: false, vest: true, colors: { up: "light_blue" } },
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("language switch", () => {
  it("first visit is Russian", async () => {
    browserWithStoredLang(null);
    const i18n = await import("./index");
    expect(i18n.getLang()).toBe("ru");
    expect(i18n.t("Камеры")).toBe("Камеры");
  });

  it("choosing Kazakh stores it and reloads the page", async () => {
    const { store, reload } = browserWithStoredLang(null);
    const i18n = await import("./index");

    i18n.setLang("kk");

    expect(store.get("skud.lang")).toBe("kk");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("after reload in Kazakh, the sidebar and html lang are Kazakh", async () => {
    browserWithStoredLang("kk");
    const { getMenuList } = await import(
      "@/app/layouts/admin-panel/lib/menuList"
    );
    const { Roles } = await import("@/entities/role");

    const labels = getMenuList(Roles.SUPER_ADMIN).flatMap((g) =>
      g.menus.map((m) => m.label),
    );

    expect(labels).toContain("Камералар");
    expect(labels).toContain("Көмекші");
    expect(document.documentElement.lang).toBe("kk");
  });

  it("an English operator sees a PPE violation card in English", async () => {
    browserWithStoredLang("en");
    const { lookOf } = await import("@/entities/journal/lib/present");

    const fields = lookOf("ppe").fields(ppeViolation);

    expect(fields[0]).toEqual({ label: "Helmet", value: "no", tone: "bad" });
    expect(fields[1]).toEqual({ label: "Vest", value: "yes", tone: "good" });
    expect(fields[2]).toEqual({ label: "Top", value: "light blue" });
  });

  it("dates follow the language", async () => {
    browserWithStoredLang("en");
    const { intlLocale, dateLocale } = await import("./index");
    expect(intlLocale()).toBe("en-GB");
    expect(dateLocale().code).toBe("en-US");
  });

  it("a garbage value in storage falls back to Russian", async () => {
    browserWithStoredLang("de");
    const { getLang } = await import("./index");
    expect(getLang()).toBe("ru");
  });

  it("ages read naturally in each language", async () => {
    browserWithStoredLang("en");
    const en = await import("@/entities/monitoring/lib/formatPerson");
    expect(en.yearsLabel(1)).toBe("1 year");
    expect(en.yearsLabel(34)).toBe("34 years");

    browserWithStoredLang("kk");
    const kk = await import("@/entities/monitoring/lib/formatPerson");
    expect(kk.yearsLabel(34)).toBe("34 жас");
  });
});
