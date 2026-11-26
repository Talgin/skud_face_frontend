import { type Page, expect, test } from "@playwright/test";
import { DESTRUCTIVE, PAGES, PERMS, type Role, Watcher, creds, login, settle } from "./helpers";

// For every role: log in, check the menu, open every page, press every harmless button on it,
// and check that forbidden pages stay closed. Anything that goes wrong in the browser is reported.

const ROLES: Role[] = ["super_admin", "admin", "operator", "registrar"];

async function menuLinks(page: Page): Promise<string[]> {
  const aside = page.locator("aside").first();
  // open every collapsed group so its links are in the DOM
  const triggers = aside.locator("button[aria-expanded='false']");
  for (let i = (await triggers.count()) - 1; i >= 0; i--) {
    await triggers.nth(i).click().catch(() => {});
  }
  await page.waitForTimeout(300);
  const hrefs = await aside.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
  return [...new Set(hrefs)].filter((h) => h && h !== "/").sort();
}

/** Press every visible, enabled, non-destructive control in the page body; return what each one broke. */
async function pressEverything(page: Page, path: string, w: Watcher) {
  const report: string[] = [];
  const main = page.locator("main").first();
  const controls = main.locator("button:visible, [role='tab']:visible, [role='combobox']:visible, [role='checkbox']:visible, [role='switch']:visible");
  const n = Math.min(await controls.count(), 80);
  const seen = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const c = controls.nth(i);
    if (!(await c.isVisible().catch(() => false))) continue; // the page re-rendered under us
    const attr = (a: string) => c.getAttribute(a, { timeout: 2000 }).catch(() => null);
    const label = ((await attr("aria-label")) || (await c.innerText({ timeout: 2000 }).catch(() => "")) || (await attr("title")) || "").trim().replace(/\s+/g, " ").slice(0, 60);
    // lists of identical cards / rows: pressing two of a kind is enough
    const kind = label.slice(0, 12);
    seen.set(kind, (seen.get(kind) ?? 0) + 1);
    if (label && seen.get(kind)! > 2) continue;
    if (DESTRUCTIVE.test(label)) {
      report.push(`skipped (destructive): "${label}"`);
      continue;
    }
    if (!(await c.isEnabled().catch(() => false))) continue;
    await c.click({ timeout: 3000 }).catch((e) => report.push(`could not press "${label}": ${String(e).split("\n")[0]}`));
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    for (const p of w.take()) report.push(`"${label || `#${i}`}" -> ${p.kind}: ${p.detail}`);
    const now = new URL(page.url()).pathname;
    if (now !== path) {
      // a button that leads somewhere is fine, unless it leads to a page this role may not open
      if (now === "/403" || now === "/") report.push(`"${label}" is offered but leads to ${now}`);
      else report.push(`ok: "${label}" opens ${now}`);
      await page.goto(path);
      await settle(page, 800);
      w.take();
    }
  }
  return report;
}

for (const role of ROLES) {
  test.describe(role, () => {
    const c = creds(role);
    test.skip(!c, `no E2E_${role.toUpperCase()}_USER/PASSWORD given`);

    test("menu shows exactly the pages this role may open", async ({ page }) => {
      await login(page, c!.user, c!.password);
      await settle(page);
      const links = await menuLinks(page);
      const expected = PAGES.filter((p) => PERMS[role].includes(p.perm)).map((p) => p.path);
      for (const path of expected) expect.soft(links, `menu is missing ${path}`).toContain(path);
      for (const href of links) {
        const known = PAGES.find((p) => p.path === href);
        expect.soft(known, `menu links to ${href}, which is not a page of the app`).toBeTruthy();
        if (known) expect.soft(PERMS[role], `menu offers ${href} to ${role}`).toContain(known.perm);
      }
    });

    for (const p of PAGES) {
      const allowed = PERMS[role].includes(p.perm);
      test(`${allowed ? "opens" : "is kept out of"} ${p.path}`, async ({ page }) => {
        const w = new Watcher(page);
        await login(page, c!.user, c!.password);
        await settle(page, 500);
        w.take();
        await page.goto(p.path);
        await settle(page, 2500);
        const url = new URL(page.url()).pathname;
        const problems = w.take();
        await page.screenshot({ path: test.info().outputPath("page.png"), fullPage: true });

        if (!allowed) {
          expect.soft(url, `${role} reached ${p.path}`).not.toBe(p.path);
          return;
        }
        expect(url, `${role} was sent away from ${p.path}`).toBe(p.path);
        expect.soft(problems.map((x) => `${x.kind}: ${x.detail}`), "while opening the page").toEqual([]);
        const body = (await page.locator("main").first().innerText()).trim();
        expect.soft(body.length, "page body is empty").toBeGreaterThan(0);

        const pressed = await pressEverything(page, p.path, w);
        const broken = pressed.filter((r) => !r.startsWith("skipped") && !r.startsWith("ok:"));
        test.info().annotations.push({ type: "pressed", description: pressed.join("\n") || "(no buttons)" });
        expect.soft(broken, "pressing buttons").toEqual([]);
      });
    }

    test("logout ends the session", async ({ page }) => {
      await login(page, c!.user, c!.password);
      await settle(page, 800);
      await page.locator("aside").getByRole("button", { name: /Выйти|Log out|Шығу/ }).first().click();
      await expect(page).toHaveURL(/\/(\?.*)?$/);
      await page.goto(PAGES.find((x) => PERMS[role].includes(x.perm))!.path);
      await expect(page).toHaveURL(/\/\?redirect=/);
    });
  });
}
