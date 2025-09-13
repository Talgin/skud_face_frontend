export interface MonitoringEventRaw {
  id: string;
  event_id: string;
  camera_host: string;
  camera_id: number;
  crop_image_url: string;
  datetime: string;
  face_id: string;
  distance: number;
  face_image_url: string | null;
  frame_image_url: string;
  recognition_confidence: number;
  h: number;
  w: number;
  x: number;
  y: number;
  delivered: boolean;
  _id?: string;
}

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
