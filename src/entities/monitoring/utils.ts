import type { MonitoringEvent, MonitoringEventRaw } from "./types";

const sanitizePythonishJson = (input: string): string => {
  let s = input.trim();

  s = s.replace(/ObjectId\('([^']+)'\)/g, (_m, id) => `"${id}"`);

  s = s
    .replace(/\bNone\b/g, "null")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false");

  s = s.replace(/'([^']*)'/g, (_m, g1) => `"${g1.replace(/"/g, '\\"')}"`);

  return s;
};

export const parseMonitoringEvent = (
  rawData: string,
): MonitoringEvent | null => {
  try {
    const json = sanitizePythonishJson(rawData);
    const obj = JSON.parse(json) as MonitoringEventRaw;

    if (!obj.id || !obj.datetime || !obj.crop_image_url) return null;

    return {
      ...obj,
      confidencePct: Math.max(
        0,
        Math.min(100, (obj.recognition_confidence ?? 0) * 100),
      ),
    };
  } catch (e) {
    console.error("SSE parse error", e, rawData);
    return null;
  }
};
