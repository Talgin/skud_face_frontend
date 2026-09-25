import type { Prerequisite } from "../types";

export const MODE_LABELS: Record<string, string> = {
  face: "Лица",
  recognition: "Распознавание",
  body: "Силуэты",
};

export const MODE_HINTS: Record<string, string> = {
  face: "индексировать каждое событие лица (область тела вокруг лица)",
  recognition: "подписывать результаты именами из «Базы лиц»",
  body: "индексировать кропы людей целиком (нужна детекция тел в стримере)",
};

export function nextModes(
  current: string[],
  mode: string,
  on: boolean,
): string[] {
  const set = new Set(current);
  if (on) set.add(mode);
  else set.delete(mode);
  return Array.from(set).sort();
}

// A mode without its source cannot be switched on; switching off is always allowed.
export function canToggle(on: boolean, pre?: Prerequisite): boolean {
  return on || !pre || pre.ok;
}
