import { expect, test } from "@playwright/test";
import { E2E_ORG, type Role, Watcher, creds, field, login, pick, row, settle } from "./helpers";

// The super admin sets up what the other tests log in with: one organization and one login per role,
// created through the forms exactly like a real administrator would. Kept between runs.

const ROLE_LABEL: Record<Exclude<Role, "super_admin">, RegExp> = {
  admin: /^(Админ|Администратор|Admin)/i,
  operator: /^(Оператор|Operator)/i,
  registrar: /^(Регистратор|Registrar)/i,
};

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  const c = creds("super_admin");
  test.skip(!c, "no super admin login given");
  await login(page, c!.user, c!.password);
});

test("the test organization exists", async ({ page }) => {
  const w = new Watcher(page);
  await page.goto("/organization");
  await settle(page);
  if ((await row(page, E2E_ORG).count()) > 0) return;

  await page.goto("/organization/add");
  await field(page, "organizationName").fill(E2E_ORG);
  await field(page, "ceoName").fill("Тест Тестов");
  await field(page, "address").fill("Астана, ул. Тестовая 1");
  await field(page, "phoneNumber").fill("+77010000000");
  await page.locator("main").getByRole("button", { name: /^Добавить$/ }).click();

  await page.goto("/organization");
  await expect(row(page, E2E_ORG)).toHaveCount(1);
  expect(w.take()).toEqual([]);
});

for (const role of ["admin", "operator", "registrar"] as const) {
  test(`a ${role} login can be created`, async ({ page }) => {
    const c = creds(role);
    test.skip(!c, `no E2E_${role.toUpperCase()} login given`);
    const card = `e2e-${role}`;
    const w = new Watcher(page);
    await page.goto("/admin");
    await settle(page);
    if ((await row(page, card).count()) > 0) {
      test.info().annotations.push({ type: "note", description: "already exists" });
      return;
    }

    await page.goto("/admin/add");
    await settle(page, 800);
    await field(page, "name").fill("E2E");
    await field(page, "surname").fill(role);
    await field(page, "cardId").fill(card);
    await pick(page, /Выберите организацию/, E2E_ORG);
    await pick(page, /Выберите роль/, ROLE_LABEL[role]);
    await field(page, "username").fill(c!.user);
    await field(page, "password").fill(c!.password);
    const active = page.locator("main").getByRole("checkbox").last();
    if ((await active.getAttribute("aria-checked")) !== "true") await active.click();
    await page.locator("main").getByRole("button", { name: /^Создать$/ }).click();
    await page.waitForTimeout(1500);
    const problems = w.take();

    await page.goto("/admin");
    await settle(page);
    expect(problems).toEqual([]);
    await expect(row(page, card)).toHaveCount(1);

    // and it can actually log in
    const ctx = await page.context().browser()!.newContext({ baseURL: test.info().project.use.baseURL });
    const p2 = await ctx.newPage();
    await login(p2, c!.user, c!.password);
    await ctx.close();
  });
}
