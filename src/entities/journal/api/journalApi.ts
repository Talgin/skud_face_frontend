import { filtersToParams } from "../lib/query";
import type { JournalEvent, JournalFilters, JournalPage } from "../model/types";

export const JOURNAL_BASE = "/api/journal";

export class JournalApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(token: string | undefined, path: string): Promise<T> {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const r = await fetch(`${JOURNAL_BASE}${path}`, { headers });
  if (!r.ok) {
    let detail = r.statusText;
    try {
      const body = await r.json();
      detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      /* not json */
    }
    if (r.status === 401) detail = "Сессия истекла, войдите заново";
    throw new JournalApiError(detail, r.status);
  }
  return (await r.json()) as T;
}

export const journalApi = {
  list: (token: string | undefined, filters: JournalFilters, cursor?: string | null, limit = 60) => {
    const p = filtersToParams(filters);
    p.set("limit", String(limit));
    if (cursor) p.set("cursor", cursor);
    return request<JournalPage>(token, `/events?${p}`);
  },
  get: (token: string | undefined, id: string) =>
    request<JournalEvent>(token, `/events/${encodeURIComponent(id)}`),
};

// <img> and EventSource cannot send headers: the token goes in the query string
export function journalImageUrl(id: string, kind: "crop" | "frame", token: string | undefined): string {
  return `${JOURNAL_BASE}/events/${encodeURIComponent(id)}/image/${kind}?token=${encodeURIComponent(token ?? "")}`;
}

export function journalLiveUrl(filters: JournalFilters, token: string | undefined): string {
  const p = filtersToParams(filters);
  p.set("token", token ?? "");
  return `${JOURNAL_BASE}/events/live?${p}`;
}
