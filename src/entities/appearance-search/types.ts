// trt-advanced-search (trt_search) API, proxied by nginx at /api/search/.

export interface SearchRequestBody {
  text: string;
  k?: number;
  camera_ids?: string[] | null;
  ts_from?: number | null; // unix seconds
  ts_to?: number | null;
  person_id?: string | null;
  dedupe?: "track" | "none";
  parse?: boolean;
}

export interface HitRecognition {
  person_id: string;
  is_known: boolean;
  person_name?: string;
  unknown_id?: string;
  nearest_person_id?: string;
  recognition_confidence?: number | null;
  match_source?: string | null;
  age?: number | null;
  gender?: string | null;
  event_id?: string | null;
}

export type HitAttributes = Record<string, string>;

export interface SearchHit {
  id: string;
  score: number;
  whole_score: number;
  phrase_scores: number[];
  weakest: number;
  below_floor: boolean;
  kind: string;
  camera_id: string;
  camera_host: string;
  track_id: string;
  person_id: string;
  frame_object: string;
  timestamp: number;
  when: string | null;
  frame_available: boolean | null;
  vms_url: string | null;
  attributes?: HitAttributes | null;
  attribute_notes?: string[];
  recognition?: HitRecognition;
}

export interface SearchResponse {
  query: string;
  text: string;
  phrases: string[];
  notes: string[];
  constraints: Record<string, string>;
  filter: string;
  ts_from: number | null;
  ts_to: number | null;
  camera_ids: string[];
  hits: SearchHit[];
}

export interface SearchCamera {
  camera_id: string;
  camera_host: string;
  name: string;
  aliases: string[];
}

export interface Prerequisite {
  ok: boolean;
  reason: string;
}

export interface SearchSettings {
  site: string;
  timezone: string;
  available_modes: string[];
  pipeline_modes: string[];
  prerequisites: Record<string, Prerequisite>;
  vms_links: boolean;
}

export interface StreamHealth {
  length?: number;
  pending?: number;
  undelivered?: number;
  error?: string;
}

export interface SearchHealth {
  status: string;
  rows: number | null;
  attributes: number | null;
  modes: string[];
  streams: Record<string, StreamHealth>;
}

export interface EvalQuery {
  query: string;
  relevant: number;
  irrelevant: number;
  updated?: string;
  by?: string;
}

export interface EvalEntry {
  query: string;
  labels: Record<string, boolean>;
}

export interface PrecisionCell {
  p_at_k: number | null;
  hits: number;
  judged: number;
  unjudged: number;
}

export interface EvalReport {
  k: number;
  queries: number;
  mean_p_at_k: { parse: number | null; plain: number | null };
  rows: {
    query: string;
    relevant_total: number;
    parse: PrecisionCell;
    plain: PrecisionCell;
  }[];
}
