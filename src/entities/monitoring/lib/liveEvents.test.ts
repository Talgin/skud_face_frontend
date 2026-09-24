import { describe, expect, it } from "vitest";
import type { HistoryRecord, MonitoringEventRaw } from "../types";
import {
  historyRecordToEvent,
  type LiveStatus,
  mergeEvents,
  openLiveStream,
  reconnectDelay,
} from "./liveEvents";

const ev = (id: string): MonitoringEventRaw =>
  ({ event_id: id, camera_id: 1, camera_host: "h", crop_image_url: "http://x/c.jpg", datetime: "d", face_id: "", h: 0, w: 0, x: 0, y: 0 }) as MonitoringEventRaw;

describe("mergeEvents", () => {
  it("prepends new events newest first", () => {
    expect(mergeEvents([ev("a")], [ev("b")]).map((e) => e.event_id)).toEqual(["b", "a"]);
  });

  it("skips events already shown (history seed + live overlap)", () => {
    expect(mergeEvents([ev("a"), ev("b")], [ev("b"), ev("c"), ev("c")]).map((e) => e.event_id)).toEqual(["c", "a", "b"]);
  });

  it("caps the list", () => {
    expect(mergeEvents([ev("a"), ev("b")], [ev("c")], 2).map((e) => e.event_id)).toEqual(["c", "a"]);
  });
});

describe("historyRecordToEvent", () => {
  it("fills fields the live table needs", () => {
    const record = {
      id: "1",
      event_id: "e1",
      face_id: null,
      camera_id: 22017,
      crop_image_url: "http://x/c.jpg",
      datetime: "2026-09-24T12:32:04Z",
      recognition_confidence: null,
      age: 38.4,
      gender: "male",
    } as unknown as HistoryRecord;
    const event = historyRecordToEvent(record);
    expect(event).toMatchObject({ event_id: "e1", camera_id: 22017, camera_host: "", face_id: "", age: 38.4, gender: "male", is_known: null });
    expect([event.h, event.w, event.x, event.y]).toEqual([0, 0, 0, 0]);
  });
});

describe("reconnectDelay", () => {
  it("backs off exponentially up to 30s", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 10].map(reconnectDelay)).toEqual([1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000]);
  });
});

class FakeSource {
  static all: FakeSource[] = [];
  onopen: ((ev: Event) => unknown) | null = null;
  onerror: ((ev: Event) => unknown) | null = null;
  listeners: Record<string, (ev: MessageEvent) => void> = {};
  closed = false;
  constructor(public url: string) {
    FakeSource.all.push(this);
  }
  addEventListener(type: string, fn: (ev: MessageEvent) => void) {
    this.listeners[type] = fn;
  }
  close() {
    this.closed = true;
  }
  open() {
    this.onopen?.(new Event("open"));
  }
  fail() {
    this.onerror?.(new Event("error"));
  }
  emit(data: string) {
    this.listeners.new_message?.({ data } as MessageEvent);
  }
}

function setup() {
  FakeSource.all = [];
  const statuses: LiveStatus[] = [];
  const messages: string[] = [];
  const timers: { fn: () => void; ms: number }[] = [];
  const close = openLiveStream({
    url: "/api/events/events",
    eventName: "new_message",
    onMessage: (d) => messages.push(d),
    onStatus: (s) => statuses.push(s),
    createSource: (url) => new FakeSource(url),
    schedule: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    cancel: () => {},
  });
  return { statuses, messages, timers, close };
}

describe("openLiveStream", () => {
  it("connects, goes online and forwards messages", () => {
    const { statuses, messages } = setup();
    FakeSource.all[0].open();
    FakeSource.all[0].emit("hello");
    expect(statuses).toEqual(["connecting", "online"]);
    expect(messages).toEqual(["hello"]);
  });

  it("reconnects with backoff after an error instead of giving up", () => {
    const { statuses, timers } = setup();
    FakeSource.all[0].fail();
    expect(FakeSource.all[0].closed).toBe(true);
    expect(timers.map((t) => t.ms)).toEqual([1000]);
    timers[0].fn();
    expect(FakeSource.all).toHaveLength(2);
    FakeSource.all[1].fail();
    expect(timers.map((t) => t.ms)).toEqual([1000, 2000]);
    expect(statuses).toContain("reconnecting");
  });

  it("resets the backoff once a connection succeeds", () => {
    const { timers } = setup();
    FakeSource.all[0].fail();
    timers[0].fn();
    FakeSource.all[1].open();
    FakeSource.all[1].fail();
    expect(timers.map((t) => t.ms)).toEqual([1000, 1000]);
  });

  it("stops for good when closed", () => {
    const { timers, close } = setup();
    close();
    expect(FakeSource.all[0].closed).toBe(true);
    FakeSource.all[0].fail();
    expect(timers).toHaveLength(0);
  });
});
