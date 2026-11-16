export type Conversation = {
  id: string;
  title: string;
  created: string;
  updated: string;
};

export type Attachment = {
  id: string;
  name: string;
  kind: "image" | "video";
  mime?: string;
  size?: number;
  duration?: number | null;
  url: string;
};

export type EventItem = {
  id: string;
  when: string | null;
  camera_id: string | number | null;
  camera_name: string;
  score: number | null;
  below_floor: boolean;
  person: string | null;
  track_id?: string | null;
  frame_available?: boolean | null;
};

export type FaceItem = {
  similarity: number;
  camera_id: string | number | null;
  camera_name: string;
  when: string | null;
  person: string | null;
  crop_url: string | null;
  frame_url: string | null;
};

export type RecognitionItem = {
  when: string | null;
  camera_id: string | number | null;
  camera_name: string;
  person: string | null;
  known: boolean;
  confidence: number | null;
  gender?: string | null;
  age?: number | null;
  crop_url: string | null;
  frame_url: string | null;
};

export type CameraItem = {
  id?: number;
  name?: string | null;
  url?: string | null;
  active?: boolean | null;
  models?: string[];
  status?: "added" | "exists" | "error" | "updated";
  error?: string;
};

export type BlockData =
  | {
      type: "events";
      query: string;
      understood: string | null;
      items: EventItem[];
    }
  | { type: "faces"; query_face: string | null; items: FaceItem[] }
  | { type: "recognitions"; total: number | null; items: RecognitionItem[] }
  | { type: "cameras"; items: CameraItem[] }
  | { type: "video_job"; job_id: string }
  | { type: "video_jobs"; job_ids: string[] }
  | { type: "error"; tool: string; message: string };

export type ToolBlock = {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  ok: boolean;
  data: BlockData | null;
  error: string | null;
  running?: boolean;
};

export type ChatMessage = {
  id: string;
  conv_id: string;
  role: "user" | "assistant";
  content: string;
  created: string;
  attachments?: Attachment[];
  blocks?: ToolBlock[];
  status?: "streaming" | "done" | "error";
};

export type VideoJob = {
  id: string;
  name: string;
  status:
    | "queued"
    | "transcoding"
    | "starting"
    | "processing"
    | "finishing"
    | "done"
    | "error"
    | "cancelled";
  progress: number;
  duration: number;
  camera_id: number | null;
  message: string;
};

export type StreamEvent =
  | { type: "user_message"; message: ChatMessage }
  | { type: "assistant"; id: string }
  | { type: "delta"; text: string }
  | {
      type: "tool_start";
      id: string;
      name: string;
      args: Record<string, unknown>;
    }
  | ({ type: "tool_end" } & ToolBlock)
  | { type: "done"; message: ChatMessage }
  | { type: "error"; message: string };
