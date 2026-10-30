import type { HistoryRecord, MonitoringEventRaw } from "../types";

export const MAX_LIVE_EVENTS = 1000;

// Prepend new events (newest first), skipping ones already shown, capped at `max`.
export function mergeEvents(
  existing: MonitoringEventRaw[],
  incoming: MonitoringEventRaw[],
  max = MAX_LIVE_EVENTS,
): MonitoringEventRaw[] {
  const seen = new Set(existing.map((e) => e.event_id));
  const fresh: MonitoringEventRaw[] = [];
  for (const event of incoming) {
    if (seen.has(event.event_id)) continue;
    seen.add(event.event_id);
    fresh.push(event);
  }
  return [...fresh, ...existing].slice(0, max);
}

// A saved event from /history shown in the live table before new ones arrive.
export function historyRecordToEvent(record: HistoryRecord): MonitoringEventRaw {
  return {
    event_id: record.event_id,
    camera_id: record.camera_id,
    camera_host: record.camera_host ?? "",
    crop_image_url: record.crop_image_url,
    frame_image_url: record.frame_image_url ?? null,
    face_image_url: record.face_image_url ?? null,
    datetime: record.datetime,
    face_id: record.face_id ?? "",
    recognition_confidence: record.recognition_confidence,
    is_known: record.is_known ?? null,
    person_name: record.person_name ?? null,
    person_surname: record.person_surname ?? null,
    person_birth_date: record.person_birth_date ?? null,
    person_age: record.person_age ?? null,
    age: record.age,
    gender: record.gender,
    is_approved: record.is_approved ?? null,
    h: 0,
    w: 0,
    x: 0,
    y: 0,
  };
}

// 1s, 2s, 4s, ... capped at 30s
export function reconnectDelay(attempt: number): number {
  return Math.min(30_000, 1000 * 2 ** Math.max(0, attempt));
}

export type LiveStatus = "connecting" | "online" | "reconnecting";

type EventSourceLike = {
  onopen: ((ev: Event) => unknown) | null;
  onerror: ((ev: Event) => unknown) | null;
  addEventListener(type: string, listener: (ev: MessageEvent) => void): void;
  close(): void;
};

interface LiveStreamOptions {
  url: string;
  eventName: string;
  onMessage: (data: string) => void;
  onStatus: (status: LiveStatus) => void;
  createSource?: (url: string) => EventSourceLike;
  schedule?: (fn: () => void, ms: number) => unknown;
  cancel?: (handle: unknown) => void;
}

// EventSource that reconnects with backoff instead of giving up on the first error
// (the old code closed the stream on any error, so the page went silent until reloaded).
export function openLiveStream(options: LiveStreamOptions): () => void {
  const createSource =
    options.createSource ?? ((url: string) => new EventSource(url));
  const schedule =
    options.schedule ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const cancel =
    options.cancel ??
    ((handle: unknown) => clearTimeout(handle as ReturnType<typeof setTimeout>));

  let source: EventSourceLike | null = null;
  let timer: unknown = null;
  let attempt = 0;
  let closed = false;

  const connect = () => {
    if (closed) return;
    options.onStatus(attempt === 0 ? "connecting" : "reconnecting");
    const current = createSource(options.url);
    source = current;
    current.onopen = () => {
      attempt = 0;
      options.onStatus("online");
    };
    current.addEventListener(options.eventName, (ev) => {
      options.onMessage(ev.data);
    });
    current.onerror = () => {
      current.close();
      if (closed || source !== current) return;
      options.onStatus("reconnecting");
      timer = schedule(connect, reconnectDelay(attempt));
      attempt += 1;
    };
  };

  connect();

  return () => {
    closed = true;
    if (timer !== null) cancel(timer);
    source?.close();
  };
}
