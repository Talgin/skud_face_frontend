import { type PersonFields, personName } from "./formatPerson";

export interface SearchableEvent extends PersonFields {
  camera_id?: number | string | null;
  camera_host?: string | null;
}

export const UNKNOWN_LABEL = "Неизвестный";

function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, "е").trim();
}

// Search box on /monitoring: every word must appear in the person's name
// (any order; «неизвестный» for faces not in «База лиц») or the camera.
export function matchesMonitoringSearch(
  event: SearchableEvent,
  query: string,
): boolean {
  const words = normalize(query ?? "").split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(
    [
      personName(event) ?? UNKNOWN_LABEL,
      event.camera_id ?? "",
      event.camera_host ?? "",
    ].join(" "),
  );
  return words.every((w) => haystack.includes(w));
}
