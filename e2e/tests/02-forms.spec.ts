import * as fs from "node:fs";
import { type Page, expect, test } from "@playwright/test";
import { BLANK_JPEG, E2E_ORG, RUN, Watcher, creds, field, login, pick, pickDay, row, rowAction, settle } from "./helpers";

// A super admin's working day with the forms: add, change and remove an organization, a camera,
// a point, a person and a login. Every record carries this run's id and is removed again.

const FACE = "fixtures/face.jpg"; // a real face photo; put one there (not in git) to test enrolment
const SUBMIT = /^(Сохранить|Изменить|Создать|Добавить|Save|Create|Add)$/;

const ORG = `E2E орг ${RUN}`;
const CAM = `E2E-${RUN}`;
const POINT = `E2E точка ${RUN}`;
const PERSON_CARD = `e2e-p-${RUN}`;
const TMP_LOGIN_CARD = `e2e-tmp-${RUN}`;

// one worker runs these in order; a failure does not stop the rest

let w: Watcher;
test.beforeEach(async ({ page }) => {
  const c = creds("super_admin");
  test.skip(!c, "no super admin login given");
  w = new Watcher(page);
  await login(page, c!.user, c!.password);
  w.take();
});

async function submit(page: Page) {
  await page.locator("main form").getByRole("button", { name: SUBMIT }).last().click();
  await page.waitForTimeout(1500);
}

async function noProblems() {
  expect(w.take().map((p) => `${p.kind}: ${p.detail}`)).toEqual([]);
}

// ---------- empty forms are stopped in the browser ----------

for (const path of ["/organization/add", "/admin/add", "/point/add", "/camera/add", "/faces/add", "/faces/import"]) {
  test(`empty form on ${path} shows what is missing and sends nothing`, async ({ page }) => {
    await page.goto(path);
    await settle(page, 1000);
    w.take();
    w.apiCalls = [];
    await page.locator("main form").getByRole("button", { name: SUBMIT }).last().click();
    await page.waitForTimeout(800);
    const posts = w.apiCalls.filter((c) => c.method !== "GET");
    expect(posts, "a request was sent for an empty form").toEqual([]);
    await expect(page.locator("main form [id$='-form-item-message']").first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(path);
    await noProblems();
  });
}

// ---------- organization ----------

test("organization: add, find in the list, change, remove", async ({ page }) => {
  await page.goto("/organization/add");
  await field(page, "organizationName").fill(ORG);
  await field(page, "ceoName").fill("Иванов Иван");
  await field(page, "address").fill("Алматы, пр. Абая 1");
  await field(page, "phoneNumber").fill("+77011112233");
  await submit(page);
  await noProblems();

  await page.goto("/organization");
  await expect(row(page, ORG)).toHaveCount(1);
  await expect(row(page, ORG)).toContainText("Алматы, пр. Абая 1");

  await rowAction(page, ORG, "edit");
  await expect(page).toHaveURL(/\/organization\/edit\//);
  await expect(field(page, "organizationName")).toHaveValue(ORG);
  await field(page, "address").fill("Алматы, пр. Абая 2");
  await submit(page);
  await noProblems();
  await page.goto("/organization");
  await expect(row(page, ORG)).toContainText("Алматы, пр. Абая 2");

  await rowAction(page, ORG, "delete");
  await expect(row(page, ORG)).toHaveCount(0);
  await noProblems();
});

// ---------- camera ----------

test("camera: add with face recognition, find, change, start and stop", async ({ page }) => {
  await page.goto("/camera/add");
  await settle(page, 800);
  await field(page, "serialNumber").fill(CAM);
  await field(page, "brandName").fill("E2E");
  await field(page, "modelName").fill("M1");
  await pickDay(page, /Выберите дату/);
  await field(page, "url").fill(`rtsp://127.0.0.1:9/e2e-${RUN}`);
  const face = page.locator("main").getByRole("checkbox").first();
  if ((await face.getAttribute("aria-checked")) !== "true") await face.click();
  await submit(page);
  await noProblems();

  await page.goto("/camera");
  await settle(page);
  const r = row(page, CAM);
  await expect(r).toHaveCount(1);
  await expect(r).toContainText("Распознавание лиц");

  await rowAction(page, CAM, "edit");
  await expect(page).toHaveURL(/\/camera\/edit\//);
  await expect(field(page, "serialNumber")).toHaveValue(CAM);
  await field(page, "modelName").fill("M2");
  await submit(page);
  await noProblems();
  await page.goto("/camera");
  await expect(row(page, CAM)).toContainText("M2");

  // start / stop (the address points nowhere, the streamer just fails to connect)
  await row(page, CAM).getByRole("button", { name: /Запустить/ }).click();
  await expect(row(page, CAM).getByRole("button", { name: /Остановить/ })).toBeVisible();
  await row(page, CAM).getByRole("button", { name: /Остановить/ }).click();
  await expect(row(page, CAM).getByRole("button", { name: /Запустить/ })).toBeVisible();
  await noProblems();
});

// ---------- point ----------

test("point: add on the new camera, find, change, remove", async ({ page }) => {
  await page.goto("/point/add");
  await settle(page, 1000);
  await field(page, "name").fill(POINT);
  await field(page, "address").fill("Вход 1");
  await pick(page, /Выберите камеру/, new RegExp(CAM));
  await pick(page, /Выберите организацию/, E2E_ORG);
  await submit(page);
  await noProblems();

  await page.goto("/point");
  await settle(page);
  await expect(row(page, POINT)).toHaveCount(1);

  await rowAction(page, POINT, "edit");
  await expect(page).toHaveURL(/\/point\/edit\//);
  await expect(field(page, "name")).toHaveValue(POINT);
  await field(page, "address").fill("Вход 2");
  await submit(page);
  await noProblems();
  await page.goto("/point");
  await expect(row(page, POINT)).toContainText("Вход 2");

  await rowAction(page, POINT, "delete");
  await expect(row(page, POINT)).toHaveCount(0);
  await noProblems();
});

test("camera: remove", async ({ page }) => {
  await page.goto("/camera");
  await settle(page);
  await rowAction(page, CAM, "delete");
  await expect(row(page, CAM)).toHaveCount(0);
  await noProblems();
});

// ---------- people (face database) ----------

async function fillPerson(page: Page, photo: { name: string; mimeType: string; buffer: Buffer }) {
  await page.goto("/faces/add");
  await settle(page, 800);
  await field(page, "name").fill("Тест");
  await field(page, "surname").fill(`Е2Е ${RUN}`);
  await field(page, "cardId").fill(PERSON_CARD);
  await pick(page, /Выберите пол/, /Мужчина/);
  await pickDay(page, /Выберите дату/);
  await page.locator('main input[type="file"][name="photo"]').setInputFiles(photo);
}

test("person: a photo without a face is refused with a clear message", async ({ page }) => {
  await fillPerson(page, { name: "wall.jpg", mimeType: "image/jpeg", buffer: BLANK_JPEG });
  await submit(page);
  const problems = w.take();
  // the backend answers 4xx; the user must see why, and nobody is added
  expect(problems.every((p) => /HTTP 4\d\d/.test(p.kind)), JSON.stringify(problems)).toBe(true);
  await expect(page.getByText(/лиц|face|бет/i).first()).toBeVisible();
  await page.goto("/faces");
  await settle(page);
  await expect(row(page, PERSON_CARD)).toHaveCount(0);
});

test("person: add with a face photo, search, change, remove", async ({ page }) => {
  test.skip(!fs.existsSync(FACE), `no ${FACE}: put a photo with one clear face there`);
  await fillPerson(page, { name: "face.jpg", mimeType: "image/jpeg", buffer: fs.readFileSync(FACE) });
  await submit(page);
  await noProblems();
  await expect(page.getByText(/Человек добавлен в базу лиц/)).toBeVisible();

  await page.goto("/faces");
  await settle(page);
  await page.locator("main").getByPlaceholder(/Поиск по имени/).fill(PERSON_CARD);
  const card = row(page, PERSON_CARD);
  await expect(card).toHaveCount(1);
  await expect(card.locator("img")).toBeVisible(); // enrolled: the face crop is shown
  await expect(card).toContainText("активен");

  await rowAction(page, PERSON_CARD, "edit");
  await expect(page).toHaveURL(/\/faces\/edit\//);
  await expect(field(page, "cardId")).toHaveValue(PERSON_CARD);
  await field(page, "name").fill("Тестовый");
  await submit(page);
  await noProblems();

  await page.goto("/faces");
  await settle(page);
  await expect(row(page, PERSON_CARD)).toContainText("Тестовый");
  await expect(row(page, PERSON_CARD).locator("img")).toBeVisible(); // still recognisable after the change

  await rowAction(page, PERSON_CARD, "delete");
  await expect(row(page, PERSON_CARD)).toHaveCount(0);
  await noProblems();
});

// ---------- logins ----------

test("login: create an operator, change it, remove it", async ({ page }) => {
  await page.goto("/admin/add");
  await settle(page, 800);
  await field(page, "name").fill("Временный");
  await field(page, "surname").fill(RUN);
  await field(page, "cardId").fill(TMP_LOGIN_CARD);
  await pick(page, /Выберите организацию/, E2E_ORG);
  await pick(page, /Выберите роль/, /operator|Оператор/i);
  await field(page, "username").fill(`${TMP_LOGIN_CARD}@skud.local`);
  await field(page, "password").fill(`Tmp-${RUN}-pass1`);
  await submit(page);
  await noProblems();

  await page.goto("/admin");
  await settle(page);
  await expect(row(page, TMP_LOGIN_CARD)).toHaveCount(1);

  await rowAction(page, TMP_LOGIN_CARD, "edit");
  await expect(page).toHaveURL(/\/admin\/edit\//);
  await expect(field(page, "cardId")).toHaveValue(TMP_LOGIN_CARD);
  await field(page, "name").fill("Изменённый");
  await submit(page);
  await noProblems();
  await page.goto("/admin");
  await expect(row(page, TMP_LOGIN_CARD)).toContainText("Изменённый");

  await rowAction(page, TMP_LOGIN_CARD, "delete");
  await expect(row(page, TMP_LOGIN_CARD)).toHaveCount(0);
  await noProblems();
});

// ---------- an admin works with their own organization's cameras ----------

test("admin: sees only their organization's camera, starts it, adds a point on it", async ({ page, browser }) => {
  const adminCreds = creds("admin");
  test.skip(!adminCreds, "no admin login given");
  const cam = `E2E-ADM-${RUN}`;
  const gate = `E2E точка адм ${RUN}`;
  const point2 = `E2E точка адм2 ${RUN}`;

  // super admin: a camera on a point of the test organization (the admin's)
  await page.goto("/camera/add");
  await settle(page, 800);
  await field(page, "serialNumber").fill(cam);
  await field(page, "brandName").fill("E2E");
  await field(page, "modelName").fill("ADM");
  await pickDay(page, /Выберите дату/);
  await field(page, "url").fill(`rtsp://127.0.0.1:9/adm-${RUN}`);
  await submit(page);
  await page.goto("/point/add");
  await settle(page, 1000);
  await field(page, "name").fill(gate);
  await field(page, "address").fill("Вход А");
  await pick(page, /Выберите камеру/, new RegExp(cam));
  await pick(page, /Выберите организацию/, E2E_ORG);
  await submit(page);
  await noProblems();

  // the admin
  const ctx = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  const ap = await ctx.newPage();
  const aw = new Watcher(ap);
  await login(ap, adminCreds!.user, adminCreds!.password);
  await ap.goto("/camera");
  await settle(ap, 2000);
  const serials = await ap.locator("main tbody tr td:nth-child(2)").allInnerTexts();
  expect(serials, "admin sees cameras of other organizations").toEqual([cam]);
  await expect(ap.getByRole("button", { name: /^Добавить$/ })).toHaveCount(0);
  await row(ap, cam).getByRole("button", { name: /Запустить/ }).click();
  await expect(row(ap, cam).getByRole("button", { name: /Остановить/ })).toBeVisible();
  await row(ap, cam).getByRole("button", { name: /Остановить/ }).click();
  await expect(row(ap, cam).getByRole("button", { name: /Запустить/ })).toBeVisible();

  await ap.goto("/point/add");
  await settle(ap, 1000);
  await expect(ap.locator("main button").filter({ hasText: /Выберите организацию/ })).toHaveCount(0);
  await field(ap, "name").fill(point2);
  await field(ap, "address").fill("Вход Б");
  await pick(ap, /Выберите камеру/, new RegExp(cam));
  await ap.locator("main form").getByRole("button", { name: SUBMIT }).last().click();
  await ap.waitForTimeout(1500);
  await ap.goto("/point");
  await settle(ap, 1500);
  await expect(row(ap, point2)).toHaveCount(1);
  expect(aw.take().map((p) => `${p.kind}: ${p.detail}`)).toEqual([]);
  await ctx.close();

  // super admin removes what was made (points first: they point at the camera)
  await page.goto("/point");
  await settle(page);
  for (const name of [point2, gate]) {
    await rowAction(page, name, "delete");
    await expect(row(page, name)).toHaveCount(0);
  }
  await page.goto("/camera");
  await settle(page);
  await rowAction(page, cam, "delete");
  await expect(row(page, cam)).toHaveCount(0);
  await noProblems();
});
