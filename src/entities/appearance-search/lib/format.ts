import { t } from "@/shared/i18n";
import type {
  HitAttributes,
  SearchCamera,
  SearchHit,
  SearchResponse,
} from "../types";
export const SEARCH_BASE = "/api/search";

export type ImageKind = "thumb" | "frame" | "annotated";

// Row ids look like "face:<frame object>" and must be escaped in a path.
export function searchImageUrl(id: string, kind: ImageKind): string {
  const base = `${SEARCH_BASE}/events/${encodeURIComponent(id)}`;
  if (kind === "thumb") return `${base}/thumb`;
  if (kind === "annotated") return `${base}/frame?annotate=1`;
  return `${base}/frame`;
}

// Where a click on the thumbnail goes: the full frame while the site keeps it.
export function openImageUrl(hit: SearchHit): string {
  return searchImageUrl(
    hit.id,
    hit.frame_available === false ? "thumb" : "frame",
  );
}

export function formatScore(score: number): string {
  return Number.isFinite(score) ? score.toFixed(3) : "—";
}

export function scoreBreakdown(hit: SearchHit): string {
  const parts = [t("целиком {s}", { s: formatScore(hit.whole_score) })];
  if (hit.phrase_scores?.length) {
    parts.push(
      t("фразы {s}", { s: hit.phrase_scores.map(formatScore).join(" ") }),
    );
  }
  if (hit.below_floor) parts.push(t("ниже уровня шума"));
  return parts.join(" · ");
}

export function cameraLabel(
  camera: Pick<SearchCamera, "camera_id" | "camera_host" | "name">,
): string {
  const name =
    camera.name && camera.name !== `camera ${camera.camera_id}`
      ? camera.name
      : "";
  return [camera.camera_id, name || camera.camera_host]
    .filter(Boolean)
    .join(" · ");
}

export interface HitPerson {
  label: string;
  known: boolean;
}

// Recognition join (mode "recognition"): the name when the face matched the
// face DB (similarity >= threshold), otherwise the track.
export function hitPerson(hit: SearchHit): HitPerson {
  const rec = hit.recognition;
  if (rec?.is_known) {
    return { label: rec.person_name || rec.person_id, known: true };
  }
  if (hit.person_id) return { label: hit.person_id, known: true };
  if (rec) return { label: t("Неизвестный"), known: false };
  return {
    label: hit.track_id ? t("трек {id}", { id: hit.track_id }) : "—",
    known: false,
  };
}

const ATTR_ORDER: [string, string?][] = [
  ["upper_color", "upper_type"],
  ["lower_color", "lower_type"],
  ["bag"],
  ["headwear"],
];

function usable(v?: string): v is string {
  return !!v && v !== "none" && v !== "unknown";
}

// VLM form (captioner profile) as one short line; empty when not captioned.
export function attributesSummary(attrs?: HitAttributes | null): string {
  if (!attrs) return "";
  return ATTR_ORDER.map((keys) =>
    keys
      .map((k) => (k ? attrs[k] : undefined))
      .filter(usable)
      .join(" "),
  )
    .filter(Boolean)
    .join(" · ");
}

export function statusLine(res: SearchResponse, ms: number): string {
  const parts = [
    t("Найдено: {n}", { n: res.hits.length }),
    t("{ms} мс", { ms: Math.round(ms) }),
  ];
  if (res.notes.length)
    parts.push(t("понято: {s}", { s: res.notes.join(", ") }));
  if (res.phrases.length)
    parts.push(t("фразы: {s}", { s: res.phrases.join(" | ") }));
  const cons = Object.entries(res.constraints ?? {}).map(
    ([k, v]) => `${k}=${v}`,
  );
  if (cons.length) parts.push(t("атрибуты: {s}", { s: cons.join(" ") }));
  return parts.join(" · ");
}
