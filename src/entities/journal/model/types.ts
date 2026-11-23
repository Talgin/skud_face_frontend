// One event of any analytics type, as trt-journal (/api/journal) returns it.
export type JournalEventType = "face" | "ppe" | "lpr" | (string & {});

export type JournalEvent = {
  id: string;
  type: JournalEventType;
  type_label: string;
  ts: string; // ISO 8601, UTC
  camera_id: number;
  camera_host: string;
  title: string;
  violation: boolean;
  tags: string[];
  has_crop: boolean;
  has_frame: boolean;
  data: Record<string, unknown>;
};

export type JournalPage = {
  items: JournalEvent[];
  next_cursor: string | null;
  total?: number;
  by_type?: Record<string, number>;
};

export type JournalFilters = {
  types: string[];
  cameraIds: number[];
  since?: Date;
  until?: Date;
  violationsOnly: boolean;
  tags: string[]; // key:value, all must match (e.g. "helmet:no", "color:red")
  q: string; // text in the title: name, plate number
};

export const EMPTY_FILTERS: JournalFilters = {
  types: [],
  cameraIds: [],
  violationsOnly: false,
  tags: [],
  q: "",
};
