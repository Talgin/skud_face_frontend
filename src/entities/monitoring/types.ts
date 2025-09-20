import { z } from "zod";

export const MonitoringEventSchema = z.object({
  event_id: z.string(),
  camera_host: z.string(),
  camera_id: z.number(),
  crop_image_url: z.string().url(),
  datetime: z.string(),
  face_id: z.string(),
  distance: z.number().nullable().optional(),
  face_image_url: z.string().url().nullable().optional(),
  frame_image_url: z.string().url().nullable().optional(),
  recognition_confidence: z.number().nullable().optional(),
  h: z.number(),
  w: z.number(),
  x: z.number(),
  y: z.number(),
  delivered: z.boolean().nullable().optional(),
  age: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  beard: z.boolean().nullable().optional(),
  glasses: z.boolean().nullable().optional(),
  mask: z.boolean().nullable().optional(),
  hat: z.boolean().nullable().optional(),
  shirt: z.boolean().nullable().optional(),
  pants: z.boolean().nullable().optional(),
  shoes: z.boolean().nullable().optional(),
  color_hat: z.string().nullable().optional(),
  color_shirt: z.string().nullable().optional(),
  color_pants: z.string().nullable().optional(),
  color_shoes: z.string().nullable().optional(),
  emotion: z.string().nullable().optional(),
  liveness_score: z.number().nullable().optional(),
  is_approved: z.boolean().nullable().optional(),
  _id: z.string().nullable().optional(),
});

export type MonitoringEventRaw = z.infer<typeof MonitoringEventSchema>;

export interface MonitoringEvent extends MonitoringEventRaw {
  name?: string;
  surname?: string;
  room?: string;
  roomName?: string;
  confidencePct: number;
}

export interface GetHistoryParams {
  start_date?: string;
  end_date?: string;
  min_similarity?: number;
  gender?: string;
  page?: number;
  page_size?: number;
}

export interface HistoryRecord {
  id: string;
  event_id: string;
  face_id: string;

  camera_id: number;
  crop_image_url: string;
  frame_image_url?: string;
  datetime: string;

  recognition_confidence: number;

  age: number | null;
  beard: boolean | null;
  gender: string | null;
  glasses: boolean | null;
  hat: boolean | null;
  mask: boolean | null;
  pants: string | null;
  shirt: string | null;
  shoes: string | null;

  color_hat: string | null;
  color_pants: string | null;
  color_shirt: string | null;
  color_shoes: string | null;

  emotion: string | null;
  liveness_score: number | null;
}

export interface HistoryResponse {
  page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
  records: HistoryRecord[];
}

export interface UniqueCountResponse {
  unique_person_count: number;
  start_date: string | null;
  end_date: string | null;
}

export interface UniqueCountParams {
  start_date?: string;
  end_date?: string;
}
