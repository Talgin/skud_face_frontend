import { type MonitoringEventRaw, MonitoringEventSchema } from "./types";

function pythonishToJson(s: string): string {
  let out = s.trim();

  out = out.replace(/ObjectId\('([0-9a-fA-F]+)'\)/g, '"$1"');

  out = out
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null");

  out = out
    .replace(/'([^']*)'(?=\s*:)/g, '"$1"')
    .replace(/:\s*'([^']*)'/g, ': "$1"');

  return out;
}

export function parseMonitoringEvent(raw: string): MonitoringEventRaw | null {
  const tryParse = (text: string) => {
    const obj = JSON.parse(text);
    return MonitoringEventSchema.parse(obj);
  };

  try {
    return tryParse(raw);
  } catch {
    try {
      const fixed = pythonishToJson(raw);
      return tryParse(fixed);
    } catch (e) {
      console.error("SSE parse error", e, raw);
      return null;
    }
  }
}
