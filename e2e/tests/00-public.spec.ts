import { expect, test } from "@playwright/test";
import { PAGES, Watcher, hasCyrillic, settle } from "./helpers";

// What anyone on the internet sees, without logging in.

test("login page opens cleanly", async ({ page }) => {
  const w = new Watcher(page);
  await page.goto("/");
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('form button[type="submit"]')).toBeEnabled();
  await settle(page);
  expect(w.take()).toEqual([]);
});

test("empty login form is rejected in the browser", async ({ page }) => {
  const w = new Watcher(page);
  await page.goto("/");
  await page.locator('form button[type="submit"]').click();
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/(\?.*)?$/);
  expect(w.apiCalls.filter((c) => c.url.includes("/auth/login"))).toEqual([]);
});

test("wrong password shows an error and stays on the login page", async ({ page }) => {
  const w = new Watcher(page);
  await page.goto("/");
  await page.locator('input[name="username"]').fill("nobody@skud.local");
  await page.locator('input[name="password"]').fill("definitely-wrong-1");
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator("form [id$='-form-item-message']").first()).toBeVisible();
  await expect(page).toHaveURL(/\/(\?.*)?$/);
  const loginCall = w.apiCalls.find((c) => c.url.includes("/auth/login"));
  expect(loginCall?.status).toBeGreaterThanOrEqual(400);
  expect(loginCall?.status).toBeLessThan(500);
});

test("the password can be shown and hidden", async ({ page }) => {
  await page.goto("/");
  const pw = page.locator('input[name="password"]');
  await pw.fill("secret");
  await expect(pw).toHaveAttribute("type", "password");
  await page.locator('input[name="password"] ~ button, input[name="password"] + * button').first().click();
  await expect(pw).toHaveAttribute("type", "text");
});

for (const p of PAGES) {
  test(`${p.path} needs a login`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveURL(/\/\?redirect=/);
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });
}

test("unknown address shows a not-found page, not a blank screen", async ({ page }) => {
  const w = new Watcher(page);
  await page.goto("/this-page-does-not-exist");
  await settle(page, 800);
  const text = (await page.locator("body").innerText()).trim();
  expect(text.length).toBeGreaterThan(0);
  expect(w.take().filter((p) => p.kind === "page error")).toEqual([]);
});

test("the language can be switched on the login page", async ({ page }) => {
  await page.goto("/");
  const switcher = page.getByRole("button", { name: /Язык интерфейса|Interface language|Интерфейс тілі/ });
  test.skip((await switcher.count()) === 0, "no language switcher on the login page");
  await switcher.click();
  await page.getByRole("menuitem", { name: /English/ }).click();
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator('form button[type="submit"]')).toBeVisible();
  const form = await page.locator("form").innerText();
  expect(hasCyrillic(form), `Russian left on the English login form: ${form}`).toBe(false);
  await page.evaluate(() => localStorage.removeItem("skud.lang"));
});

test("internal health endpoints are not public", async ({ request }) => {
  for (const path of ["/api/journal/health", "/api/chat/health"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("API refuses anonymous requests", async ({ request }) => {
  for (const path of ["/api/v1/student?limit=1", "/api/v1/camera", "/api/v1/employee", "/api/journal/events", "/api/chat/conversations"]) {
    const status = (await request.get(path)).status();
    expect([401, 403], `${path} -> ${status}`).toContain(status);
  }
});
