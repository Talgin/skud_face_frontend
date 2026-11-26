import { type Page, expect } from "@playwright/test";

export type Role = "super_admin" | "admin" | "operator" | "registrar";

/** Logins come from the environment (never from the repo): E2E_<ROLE>_USER / E2E_<ROLE>_PASSWORD. */
export function creds(role: Role): { user: string; password: string } | null {
  const key = role.toUpperCase();
  const user = process.env[`E2E_${key}_USER`];
  const password = process.env[`E2E_${key}_PASSWORD`];
  return user && password ? { user, password } : null;
}

/** Every page of the app and the permission it needs (mirror of menuList.ts + the route guards). */
export const PAGES: { path: string; perm: string; name: string }[] = [
  { path: "/monitoring/journal", perm: "monitoring.view", name: "Журнал видеоаналитики" },
  { path: "/monitoring", perm: "monitoring.view", name: "Мониторинг" },
  { path: "/monitoring/history", perm: "monitoring-history.view", name: "История" },
  { path: "/monitoring/search", perm: "search.view", name: "Поиск по внешности" },
  { path: "/chat", perm: "chat.use", name: "Ассистент" },
  { path: "/dashboard", perm: "dashboard.view", name: "Дашборд" },
  { path: "/organization", perm: "org.view", name: "Все организации" },
  { path: "/organization/add", perm: "org.create", name: "Добавить организацию" },
  { path: "/admin", perm: "admin.view", name: "Все админы" },
  { path: "/admin/add", perm: "admin.create", name: "Добавить админа" },
  { path: "/faces", perm: "user.view", name: "Все люди в базе" },
  { path: "/faces/add", perm: "user.create", name: "Добавить человека" },
  { path: "/faces/import", perm: "user.batchCreate", name: "Импорт из Excel" },
  { path: "/point", perm: "point.view", name: "Все точки" },
  { path: "/point/add", perm: "point.create", name: "Добавить точку" },
  { path: "/camera", perm: "camera.view", name: "Все камеры" },
  { path: "/camera/add", perm: "camera.create", name: "Добавить камеру" },
];

/** What each role may do: same as src/entities/role/model/mapRoles.ts (kept in sync by rolePermissions.test.ts). */
export const PERMS: Record<Role, string[]> = {
  super_admin: PAGES.map((p) => p.perm),
  admin: [
    "monitoring.view", "monitoring-history.view", "search.view", "chat.use", "dashboard.view", "admin.view",
    "user.view", "user.create", "user.batchCreate", "point.view", "point.create", "camera.view",
  ],
  operator: ["monitoring.view", "monitoring-history.view", "search.view", "chat.use", "dashboard.view", "user.view"],
  registrar: ["user.view", "user.create", "user.batchCreate"],
};

export type Problem = { kind: string; detail: string };

/** Collects everything that goes wrong in the browser while a page is used. */
export class Watcher {
  problems: Problem[] = [];
  apiCalls: { method: string; url: string; status: number }[] = [];

  constructor(page: Page) {
    page.on("pageerror", (e) => this.problems.push({ kind: "page error", detail: e.message.split("\n")[0] }));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const text = m.text();
      // the browser also logs failed requests to the console; those are reported below with their status
      if (/Failed to load resource/.test(text)) return;
      this.problems.push({ kind: "console error", detail: text.slice(0, 300) });
    });
    page.on("response", (r) => {
      const url = r.url();
      if (!/\/api\/|\/media\//.test(url)) return;
      const call = { method: r.request().method(), url: url.replace(/^https?:\/\/[^/]+/, ""), status: r.status() };
      this.apiCalls.push(call);
      // evidence images expire before their events (frames 2 days, events 7); the UI shows "Кадр удалён"
      if (r.status() === 404 && /\/image\/(frame|crop)/.test(url)) return;
      if (r.status() >= 400) this.problems.push({ kind: `HTTP ${r.status()}`, detail: `${call.method} ${call.url}` });
    });
    page.on("requestfailed", (r) => {
      const err = r.failure()?.errorText ?? "";
      // SSE / long polls are aborted on navigation; that's normal
      if (/ERR_ABORTED|NS_BINDING_ABORTED/.test(err)) return;
      this.problems.push({ kind: "request failed", detail: `${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, "")} ${err}` });
    });
  }

  take(): Problem[] {
    const p = this.problems;
    this.problems = [];
    return p;
  }
}

export async function login(page: Page, user: string, password: string) {
  await page.goto("/");
  await page.locator('input[name="username"]').fill(user);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('form button[type="submit"]').click();
  await expect(page).not.toHaveURL(/\/(\?.*)?$/, { timeout: 20_000 });
}

/** Wait until a page has drawn and its first data requests settled (SSE keeps the network busy forever). */
export async function settle(page: Page, ms = 1500) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(ms);
}

/** Buttons the crawler must never press on real data. */
export const DESTRUCTIVE =
  /удал|delete|remove|жою|өшір|запуст|start|іске қос|добавь камер|add (a |the )?camera|подтверд|approve|отклон|reject|деактив|deactiv|активир|activate|выключ|включ|выйти|log ?out|шығу|останов|stop|очист|clear all/i;

export function hasCyrillic(s: string) {
  return /[А-Яа-яЁё]/.test(s);
}

// ---------- form helpers (shadcn/Radix widgets) ----------

/** Unique suffix for the records one run creates, so reruns never collide. */
// set once by run.sh: Playwright restarts its worker after a failure, which would otherwise pick a new id
export const RUN = process.env.E2E_RUN ?? Date.now().toString(36).slice(-5);

/** The permanent organization the role test accounts belong to (kept between runs). */
export const E2E_ORG = "E2E организация";

export function field(page: Page, name: string) {
  return page.locator(`main [name="${name}"]`);
}

/** Radix select: open the combobox whose text matches `trigger`, pick the option matching `option`. */
export async function pick(page: Page, trigger: RegExp | string, option: RegExp | string) {
  await page.locator("main").getByRole("combobox").filter({ hasText: trigger }).first().click();
  await page.getByRole("option", { name: option }).first().click();
}

/** Date picker: open the popover behind `trigger` and choose day 15 of the month it shows. */
export async function pickDay(page: Page, trigger: RegExp | string, nth = 0) {
  // the button is named after its form label, so find it by its text
  await page.locator("main button").filter({ hasText: trigger }).nth(nth).click();
  const pop = page.locator("[data-radix-popper-content-wrapper]").last();
  await pop.locator("button[name='day'], [role='gridcell'] button, button[role='gridcell']").filter({ hasText: /^15$/ }).first().click();
  await page.keyboard.press("Escape").catch(() => {});
}

/** Table row (or person card) containing `text`. */
export function row(page: Page, text: string | RegExp) {
  return page.locator("main tbody tr, main div.grid > div").filter({ hasText: text });
}

/** Row "⋯" menu → Редактировать / Удалить (+ confirm "Да"). */
export async function rowAction(page: Page, text: string | RegExp, action: "edit" | "delete") {
  const r = row(page, text).first();
  await r.getByRole("button", { name: /Открой меню|Open menu|Мәзірді ашу/ }).click();
  if (action === "edit") {
    await page.getByRole("menuitem", { name: /Редактировать|Edit|Өңдеу/ }).click();
  } else {
    await page.getByRole("menuitem", { name: /Удалить|Delete|Жою/ }).click();
    await page.getByRole("button", { name: /^(Да|Yes|Иә)$/ }).click();
  }
}

/** A tiny JPEG with no face in it (for upload validation paths). */
export const BLANK_JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==",
  "base64",
);
