import type { JournalEvent } from "../model/types";

// How each analytics type looks on a card and in the detail view. A new analytics type = one entry here
// (plus its adapter in trt-journal); types without an entry fall back to the generic look.

export type Field = { label: string; value: string; tone?: "bad" | "good" | "muted" };

export type TypeLook = {
  badge: string; // short label on the card
  badgeClass: string; // tailwind colors of the badge
  fields: (e: JournalEvent) => Field[]; // 1-3 key facts on the card
  details: (e: JournalEvent) => Field[]; // everything in the detail view
};

export const COLOR_RU: Record<string, string> = {
  beige: "бежевый",
  black: "чёрный",
  blue: "синий",
  brown: "коричневый",
  gray: "серый",
  green: "зелёный",
  light_blue: "голубой",
  orange: "оранжевый",
  pink: "розовый",
  purple: "фиолетовый",
  red: "красный",
  white: "белый",
  yellow: "жёлтый",
};

export const COLOR_HEX: Record<string, string> = {
  beige: "#d6c3a3",
  black: "#111827",
  blue: "#1d4ed8",
  brown: "#7c4a21",
  gray: "#9ca3af",
  green: "#15803d",
  light_blue: "#7dd3fc",
  orange: "#f97316",
  pink: "#f9a8d4",
  purple: "#7e22ce",
  red: "#dc2626",
  white: "#f9fafb",
  yellow: "#facc15",
};

const PART_RU: Record<string, string> = {
  up: "Верх",
  low: "Низ",
  hat: "Головной убор",
};

function yesNo(v: unknown, yes: string, no: string): Field["value"] {
  return v === true ? yes : v === false ? no : "не определено";
}

function tone(v: unknown): Field["tone"] {
  return v === true ? "good" : v === false ? "bad" : "muted";
}

function pct(v: unknown): string {
  return typeof v === "number" ? `${Math.round(v * 100)}%` : "—";
}

export function colorName(c: unknown): string {
  return typeof c === "string" ? (COLOR_RU[c] ?? c) : "—";
}

function colorFields(e: JournalEvent): Field[] {
  const colors = (e.data.colors ?? {}) as Record<string, string>;
  return ["up", "low", "hat"]
    .filter((p) => colors[p])
    .map((p) => ({ label: PART_RU[p], value: colorName(colors[p]) }));
}

const face: TypeLook = {
  badge: "Лицо",
  badgeClass: "bg-blue-700 text-white",
  fields: (e) => [
    {
      label: "Имя",
      value: e.title,
      tone: e.data.is_known ? "good" : "muted",
    },
  ],
  details: (e) => [
    { label: "Имя", value: e.title },
    { label: "Возраст", value: typeof e.data.age === "number" ? String(Math.round(e.data.age)) : "—" },
    { label: "Пол", value: e.data.gender === "male" ? "мужской" : e.data.gender === "female" ? "женский" : "—" },
    { label: "Сходство", value: pct(e.data.recognition_confidence) },
    { label: "ID лица", value: String(e.data.face_id ?? "—") },
  ],
};

const ppe: TypeLook = {
  badge: "СИЗ",
  badgeClass: "bg-amber-600 text-white",
  fields: (e) => [
    { label: "Каска", value: yesNo(e.data.helmet, "есть", "нет"), tone: tone(e.data.helmet) },
    { label: "Жилет", value: yesNo(e.data.vest, "есть", "нет"), tone: tone(e.data.vest) },
    ...colorFields(e).slice(0, 1),
  ],
  details: (e) => [
    { label: "Каска", value: yesNo(e.data.helmet, "есть", "нет"), tone: tone(e.data.helmet) },
    { label: "Жилет", value: yesNo(e.data.vest, "есть", "нет"), tone: tone(e.data.vest) },
    ...colorFields(e),
    { label: "Очки", value: e.data.glasses ? "да" : "нет" },
    { label: "Кадров в треке", value: String(e.data.frames ?? "—") },
    { label: "Уверенность детекции", value: pct(e.data.detection_confidence) },
  ],
};

const lpr: TypeLook = {
  badge: "Номер",
  badgeClass: "bg-emerald-700 text-white",
  fields: (e) => [{ label: "Номер", value: e.title }],
  details: (e) => [
    { label: "Номер", value: e.title },
    { label: "Уверенность OCR", value: pct(e.data.plate_confidence) },
    { label: "Уверенность детекции", value: pct(e.data.detection_confidence) },
  ],
};

const generic: TypeLook = {
  badge: "Событие",
  badgeClass: "bg-slate-600 text-white",
  fields: (e) => [{ label: "Событие", value: e.title }],
  details: (e) =>
    Object.entries(e.data).map(([k, v]) => ({
      label: k,
      value: typeof v === "object" ? JSON.stringify(v) : String(v),
    })),
};

const LOOKS: Record<string, TypeLook> = { face, ppe, lpr };

export function lookOf(type: string): TypeLook {
  return LOOKS[type] ?? generic;
}
