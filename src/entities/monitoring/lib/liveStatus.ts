import { useSyncExternalStore } from "react";
import type { LiveStatus } from "./liveEvents";

// Connection state of the live monitoring stream, shared with the UI.
let status: LiveStatus = "connecting";
const listeners = new Set<() => void>();

export function setLiveStatus(next: LiveStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
}

export function getLiveStatus(): LiveStatus {
  return status;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLiveStatus(): LiveStatus {
  return useSyncExternalStore(subscribe, getLiveStatus, getLiveStatus);
}
