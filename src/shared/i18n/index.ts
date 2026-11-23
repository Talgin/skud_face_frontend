import { enUS, kk as kkDate, ru as ruDate } from "date-fns/locale";
import { en } from "./dict/en";
import { kk } from "./dict/kk";

// UI languages. Russian is the source language: the Russian text itself is the translation key, so
// t("Камеры") returns "Камеры" in Russian and the dictionary entry in English / Kazakh (falling back to
// the Russian text when an entry is missing).
//
// Switching the language stores it and reloads the page. That keeps strings that are built once at
// module load (menus, table columns, form schemas) correct without making every component reactive.

export const LANGS = ["kk", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, { short: string; name: string }> = {
  kk: { short: "ҚАЗ", name: "Қазақша" },
  ru: { short: "РУС", name: "Русский" },
  en: { short: "ENG", name: "English" },
};

const STORAGE_KEY = "skud.lang";
const DICTS: Record<Lang, Record<string, string> | null> = { ru: null, en, kk };

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && (LANGS as readonly string[]).includes(v)) return v as Lang;
  } catch {
    // storage blocked: fall back to Russian
  }
  return "ru";
}

let current: Lang = readLang();
if (typeof document !== "undefined") document.documentElement.lang = current;

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang): void {
  if (lang === current) return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage blocked: the choice lasts until the reload only
  }
  current = lang;
  window.location.reload();
}

/** Translate a Russian UI string; `{name}` placeholders are filled from `vars`. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = DICTS[current];
  let s = dict?.[key] || key;
  if (vars) {
    s = s.replace(/\{(\w+)\}/g, (m, name: string) =>
      name in vars ? String(vars[name]) : m,
    );
  }
  return s;
}

/** BCP 47 tag for Intl / toLocaleString. */
export function intlLocale(): string {
  return current === "kk" ? "kk-KZ" : current === "en" ? "en-GB" : "ru-RU";
}

/** date-fns locale (also accepted by react-day-picker). */
export function dateLocale() {
  return current === "kk" ? kkDate : current === "en" ? enUS : ruDate;
}
