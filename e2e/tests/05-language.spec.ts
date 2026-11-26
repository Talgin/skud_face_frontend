import { expect, test } from "@playwright/test";
import { PAGES, creds, login, settle } from "./helpers";

// With the interface switched to English, no Russian should be left in the interface itself
// (names, addresses and other data typed in by people are not counted).

test.describe("English interface", () => {
  test.beforeEach(async ({ page }) => {
    const c = creds("super_admin");
    test.skip(!c, "no super admin login given");
    await page.addInitScript(() => localStorage.setItem("skud.lang", "en"));
    await login(page, c!.user, c!.password);
  });

  for (const p of PAGES) {
    test(`${p.path} has no Russian left`, async ({ page }) => {
      await page.goto(p.path);
      await settle(page, 2500);
      const russian = await page.evaluate(() => {
        const out = new Set<string>();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const attrs = ["placeholder", "aria-label", "title"];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!el || el.closest("td, script, style, [data-user-content], main .grid button, div.group > button[title]")) continue;
          const s = (n.textContent ?? "").trim();
          if (/[А-Яа-яЁё]/.test(s)) out.add(s.slice(0, 80));
        }
        for (const el of document.querySelectorAll("*")) {
          if (el.closest("td, div.group > button[title]")) continue; // table data, chat titles
          for (const a of attrs) {
            const v = el.getAttribute(a);
            if (v && /[А-Яа-яЁё]/.test(v) && !el.closest("main .grid button")) out.add(`[${a}] ${v.slice(0, 80)}`);
          }
        }
        return [...out];
      });
      // the test organization's own name is data
      const left = russian.filter((s) => !/E2E|Тест|Иванов|Астана|Алматы|Вход/.test(s));
      expect.soft(left, `Russian text on ${p.path} in the English interface`).toEqual([]);
    });
  }
});
