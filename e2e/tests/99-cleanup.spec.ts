import { expect, test } from "@playwright/test";
import { creds, login, row, rowAction, settle } from "./helpers";

// Removes whatever earlier runs left behind when a test failed half-way (records named "E2E …").
// The permanent test organization and the role test logins are kept.

const LEFTOVERS: { list: string; match: RegExp }[] = [
  { list: "/point", match: /E2E точка/ },
  { list: "/camera", match: /E2E-\w+/ },
  { list: "/organization", match: /E2E орг/ },
  { list: "/admin", match: /e2e-tmp-/ },
  { list: "/faces", match: /e2e-p-/ },
];

test("nothing from the tests is left behind", async ({ page }) => {
  const c = creds("super_admin");
  test.skip(!c, "no super admin login given");
  await login(page, c!.user, c!.password);
  for (const { list, match } of LEFTOVERS) {
    await page.goto(list);
    await settle(page);
    for (let i = 0; i < 20 && (await row(page, match).count()) > 0; i++) {
      const before = await row(page, match).count();
      await rowAction(page, match, "delete");
      await expect(row(page, match)).toHaveCount(before - 1);
    }
    await expect(row(page, match), `leftovers on ${list}`).toHaveCount(0);
  }
});

test("test logins' chats are removed", async ({ page }) => {
  page.on("dialog", (d) => d.accept());
  for (const role of ["super_admin", "admin", "operator"] as const) {
    const c = creds(role);
    if (!c) continue;
    await page.context().clearCookies();
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await login(page, c.user, c.password);
    await page.goto("/chat");
    await settle(page, 2000);
    const items = page.locator("main div.group > button[title]");
    for (let i = 0; i < 50 && (await items.count()) > 0; i++) {
      const before = await items.count();
      await items.first().hover();
      await items.first().locator("xpath=..").getByRole("button", { name: "Удалить" }).click();
      await expect(items).toHaveCount(before - 1);
    }
  }
});
