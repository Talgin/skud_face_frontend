import type { JournalFilters } from "../model/types";

// Filters -> query string of GET /api/journal/events (and /events/live).
export function filtersToParams(f: JournalFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.types.length) p.set("types", f.types.join(","));
  if (f.cameraIds.length) p.set("camera_ids", f.cameraIds.join(","));
  if (f.since) p.set("since", f.since.toISOString());
  if (f.until) p.set("until", f.until.toISOString());
  if (f.violationsOnly) p.set("violation", "true");
  if (f.tags.length) p.set("tags", f.tags.join(","));
  if (f.q.trim()) p.set("q", f.q.trim());
  return p;
}

// Replace every tag with the given key (e.g. "helmet") by one value, or drop it when value is empty.
export function setTag(tags: string[], key: string, value: string): string[] {
  const rest = tags.filter((t) => !t.startsWith(`${key}:`));
  return value ? [...rest, `${key}:${value}`] : rest;
}

export function tagValue(tags: string[], key: string): string {
  const t = tags.find((x) => x.startsWith(`${key}:`));
  return t ? t.slice(key.length + 1) : "";
}
