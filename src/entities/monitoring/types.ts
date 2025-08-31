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
