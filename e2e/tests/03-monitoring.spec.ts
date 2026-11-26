import { type Page, expect, test } from "@playwright/test";
import { RUN, type Role, Watcher, creds, login, settle } from "./helpers";

// What an operator does during a shift: read the analytics journal, look through the recognition history,
// search by appearance, and ask the assistant. Runs on whatever the server has recorded.

let w: Watcher;
async function as(page: Page, role: Role) {
  const c = creds(role);
  test.skip(!c, `no ${role} login given`);
  w = new Watcher(page);
  await login(page, c!.user, c!.password);
  w.take();
}
const problems = () => w.take().map((p) => `${p.kind}: ${p.detail}`);
const main = (page: Page) => page.locator("main").first();

async function journalCount(page: Page): Promise<number | null> {
  const m = (await main(page).innerText()).match(/Событий:\s*([\d\s ]+)/);
  return m ? Number(m[1].replace(/\D/g, "")) : null;
}

test.describe("analytics journal", () => {
  test.beforeEach(async ({ page }) => {
    await as(page, "operator");
    await page.goto("/monitoring/journal");
    await settle(page, 2500);
  });

  test("shows the events of the last 7 days with a total", async ({ page }) => {
    const total = await journalCount(page);
    test.info().annotations.push({ type: "events", description: String(total) });
    if (total === 0) {
      await expect(main(page)).toContainText("Нет событий за последние 7 дней");
    } else {
      expect(total, "no «Событий: N» counter").not.toBeNull();
    }
    expect(problems()).toEqual([]);
  });

  test("«Только нарушения» leaves only violations", async ({ page }) => {
    await main(page).getByText("Только нарушения").click();
    await settle(page, 2000);
    const cards = main(page).locator("button").filter({ hasText: /СИЗ|Номер|Лицо|Распознав/ });
    const n = await cards.count();
    for (let i = 0; i < Math.min(n, 20); i++) await expect(cards.nth(i)).toContainText("Нарушение");
    expect(problems()).toEqual([]);
  });

  test("choosing one type shows only that type", async ({ page }) => {
    const before = await journalCount(page);
    test.skip(!before, "no events to filter");
    // nothing ticked = every type; ticking «Распознавание лиц» leaves face events only
    await main(page).locator("label[for='journal-type-face']").click();
    await settle(page, 2000);
    const after = await journalCount(page);
    expect(after ?? 0).toBeLessThanOrEqual(before!);
    await expect(main(page).locator("button").filter({ hasText: /^СИЗ/ })).toHaveCount(0);
    await main(page).getByRole("button", { name: /Сбросить фильтры/ }).click();
    await settle(page, 2000);
    expect(await journalCount(page)).toBe(before);
    expect(problems()).toEqual([]);
  });

  test("searching for something that does not exist shows the empty state", async ({ page }) => {
    await main(page).getByPlaceholder("Имя или номер").fill(`нет-такого-${RUN}`);
    await settle(page, 2500);
    await expect(main(page)).toContainText(/Нет событий|Ничего не найдено/);
    expect(problems()).toEqual([]);
  });

  test("an event opens with its evidence and closes again", async ({ page }) => {
    const card = main(page).locator("button").filter({ hasText: /Камера \d+/ }).first();
    test.skip((await card.count()) === 0, "no events");
    await card.click();
    const detail = page.getByRole("dialog").or(page.locator("[data-state='open']").filter({ hasText: "ID события" })).first();
    await expect(detail).toBeVisible();
    await expect(detail).toContainText("ID события");
    // the crop is shown, or a «кадр удалён» placeholder once the image has expired
    await expect(detail.locator("img, [title*='удален'], [title*='удалён']").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(detail).toBeHidden();
    expect(problems()).toEqual([]);
  });

  test("«Показать ещё» loads the next page", async ({ page }) => {
    const more = main(page).getByRole("button", { name: /Показать ещё/ });
    test.skip((await more.count()) === 0, "only one page of events");
    const cards = main(page).locator("button").filter({ hasText: /Камера \d+/ });
    const before = await cards.count();
    await more.click();
    await expect.poll(() => cards.count()).toBeGreaterThan(before);
    expect(problems()).toEqual([]);
  });
});

test.describe("recognition history and live monitoring", () => {
  test("history: filters and paging work", async ({ page }) => {
    await as(page, "operator");
    await page.goto("/monitoring/history");
    await settle(page, 2500);
    await main(page).locator("button").filter({ hasText: /Выбрать дату/ }).first().click();
    await page.keyboard.press("Escape");
    await main(page).locator("select").first().selectOption({ index: 1 }).catch(() => {});
    await settle(page, 1500);
    for (const name of [/следующую/, /предыдущую/, /последнюю/, /первую/]) {
      const b = main(page).getByRole("button", { name });
      if (await b.isEnabled()) await b.click();
    }
    expect(problems()).toEqual([]);
  });

  test("live monitoring page receives the event stream", async ({ page }) => {
    await as(page, "operator");
    const sse = page.waitForResponse((r) => /\/api\/events\//.test(r.url()), { timeout: 15_000 }).catch(() => null);
    await page.goto("/monitoring");
    await settle(page, 2500);
    const r = await sse;
    expect(r?.status(), "no event stream (/api/events/) opened").toBe(200);
    await main(page).getByPlaceholder(/Поиск по имени или камере/).fill("нет-такого");
    expect(problems()).toEqual([]);
  });

  test("dashboard filter opens and the counter stays a number", async ({ page }) => {
    await as(page, "operator");
    await page.goto("/dashboard");
    await settle(page, 2000);
    await main(page).getByRole("button", { name: /Фильтр/ }).click();
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");
    await expect(main(page)).toContainText(/\d/);
    expect(problems()).toEqual([]);
  });
});

test.describe("appearance search", () => {
  test("a text query returns results or says nothing was found", async ({ page }) => {
    await as(page, "operator");
    await page.goto("/monitoring/search");
    await settle(page, 2000);
    await main(page).getByPlaceholder(/например/).fill("человек в зелёной куртке");
    await main(page).getByRole("button", { name: /^Найти$/ }).click();
    await expect(main(page).getByText(/Ищу…/)).toBeHidden({ timeout: 60_000 });
    await settle(page, 1000);
    const text = await main(page).innerText();
    expect(text, "search service reported as unavailable").not.toContain("Сервис поиска недоступен");
    const results = await main(page).locator("img").count();
    expect(results > 0 || /Ничего не найдено/.test(text), "neither results nor «Ничего не найдено»").toBe(true);
    expect(problems()).toEqual([]);
  });

  test("an example query chip fills the search", async ({ page }) => {
    await as(page, "operator");
    await page.goto("/monitoring/search");
    await settle(page, 1500);
    await main(page).getByRole("button", { name: "мужчина в чёрной куртке" }).click();
    await expect(main(page).getByPlaceholder(/например/)).toHaveValue("мужчина в чёрной куртке");
    expect(problems()).toEqual([]);
  });
});

test.describe("assistant", () => {
  test.setTimeout(240_000);

  test("operator asks about today's PPE violations and gets an answer", async ({ page }) => {
    await as(page, "operator");
    page.on("dialog", (d) => d.accept());
    await page.goto("/chat");
    await settle(page, 1500);
    await main(page).getByRole("button", { name: /Новый чат/ }).click();
    const box = main(page).getByRole("textbox");
    await box.fill(`Были ли сегодня нарушения СИЗ? (тест ${RUN})`);
    const answer = page.waitForResponse(
      (r) => r.request().method() === "POST" && /\/api\/chat\/conversations\/[^/]+\/messages$/.test(r.url()),
      { timeout: 30_000 },
    );
    await box.press("Enter");

    // the answer is streamed (server-sent events) and ends with a «done» event
    const res = await answer;
    expect(res.status()).toBe(200);
    const stream = await res.text();
    const events = stream.split("\n").filter((l) => l.startsWith("data: ")).map((l) => JSON.parse(l.slice(6)));
    const kinds = events.map((e) => e.type);
    expect(kinds.at(-1), `stream ended with ${kinds.at(-1)}: ${JSON.stringify(events.at(-1)).slice(0, 300)}`).toBe("done");
    const reply = events.filter((e) => e.type === "delta").map((e) => e.text).join("");
    test.info().annotations.push({ type: "tools", description: events.filter((e) => e.type === "tool_start").map((e) => e.tool).join(", ") });
    test.info().annotations.push({ type: "reply", description: reply.slice(0, 500) });
    expect(reply.trim().length, "empty reply").toBeGreaterThan(0);
    await expect(main(page).getByText(reply.trim().slice(0, 30), { exact: false }).first()).toBeVisible();
    const text = await main(page).innerText();
    expect(text).not.toMatch(/Ошибка модели|Модель недоступна|Ответ не получен/);
    expect(problems()).toEqual([]);

    // the chat is listed and can be removed
    // its rename / delete buttons appear on hover
    const item = main(page).locator(`button[title*="тест ${RUN}"]`).first();
    await item.hover();
    await item.locator("xpath=..").getByRole("button", { name: "Удалить" }).click();
    await expect(main(page).getByText(new RegExp(`тест ${RUN}`))).toHaveCount(0);
    expect(problems()).toEqual([]);
  });
});
