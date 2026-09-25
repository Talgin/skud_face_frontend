import type { SearchRequestBody } from "../types";

export interface SearchForm {
  text: string;
  cameraId?: string;
  from?: string; // <input type="datetime-local"> value, local time
  to?: string;
  k: number;
  onePerPerson: boolean;
}

export const DEFAULT_K = 20;
export const MAX_K = 60;

export function toUnixSeconds(local?: string): number | null {
  if (!local) return null;
  const t = new Date(local).getTime();
  return Number.isNaN(t) ? null : Math.floor(t / 1000);
}

// Body for POST /search. Explicit camera/time win over words in the text
// ("вчера у входа"), which the service parses itself.
export function buildSearchBody(form: SearchForm): SearchRequestBody | null {
  const text = form.text.trim();
  if (!text) return null;
  const k = Math.min(MAX_K, Math.max(1, Math.round(form.k || DEFAULT_K)));
  return {
    text,
    k,
    dedupe: form.onePerPerson ? "track" : "none",
    camera_ids: form.cameraId ? [form.cameraId] : null,
    ts_from: toUnixSeconds(form.from),
    ts_to: toUnixSeconds(form.to),
  };
}
