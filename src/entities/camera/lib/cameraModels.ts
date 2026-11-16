// Recognition models a camera can run. The backend writes the selection into the
// streamer's sources.json as {"face": {}, "lpr": {...settings}}; the face streamer
// and trt-lpr each pick up only the cameras with their key.
export const CAMERA_MODEL_KEYS = ["face", "lpr"] as const;

export type CameraModelKey = (typeof CAMERA_MODEL_KEYS)[number];

export type CameraModels = Record<string, Record<string, unknown>>;

export const CAMERA_MODEL_LABELS: Record<CameraModelKey, string> = {
  face: "Распознавание лиц",
  lpr: "Распознавание номеров",
};

export const DEFAULT_CAMERA_MODELS: CameraModels = { face: {} };

export function modelKeys(
  models: CameraModels | null | undefined,
): CameraModelKey[] {
  const selected = models ?? DEFAULT_CAMERA_MODELS;
  return CAMERA_MODEL_KEYS.filter((key) => key in selected);
}

// Ticked boxes -> the `models` object for the API. Models that stay ticked keep
// their per-camera settings (e.g. the LPR region of interest).
export function modelsFromKeys(
  keys: readonly CameraModelKey[],
  previous: CameraModels = {},
): CameraModels {
  return Object.fromEntries(keys.map((key) => [key, previous[key] ?? {}]));
}
