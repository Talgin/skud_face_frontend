import {
  AlertTriangle,
  Camera,
  ClipboardList,
  CheckCircle2,
  Film,
  Loader2,
  ScanFace,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { searchImageUrl } from "@/entities/appearance-search";
import {
  type CameraItem,
  type EventItem,
  type FaceItem,
  type JournalItem,
  type RecognitionItem,
  type ToolBlock,
  type VideoJob,
  chatApi,
} from "@/entities/chat";
import { journalImageUrl, lookOf } from "@/entities/journal";
import { mediaUrl } from "@/shared/lib";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { Button } from "@/shared/ui/button";

export type BlockActions = {
  token?: string;
  openImage: (src: string, caption?: string) => void;
  suggest: (text: string) => void;
};

const NO_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' fill='%236b7280' font-size='16' text-anchor='middle'>нет изображения</text></svg>";

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = NO_IMG;
}

const TOOL_LABEL: Record<string, string> = {
  journal_events: "Журнал видеоаналитики",
  search_events: "Поиск по внешности",
  find_person_by_photo: "Поиск человека по фото",
  recognition_events: "События распознавания",
  list_cameras: "Список камер",
  add_cameras: "Добавление камер",
  set_camera_active: "Управление камерой",
  process_video: "Обработка видео",
  video_status: "Статус обработки видео",
};

const TOOL_ICON: Record<string, typeof Search> = {
  journal_events: ClipboardList,
  search_events: Search,
  find_person_by_photo: ScanFace,
  recognition_events: Users,
  list_cameras: Camera,
  add_cameras: Camera,
  set_camera_active: Camera,
  process_video: Film,
  video_status: Film,
};

function toolTitle(b: ToolBlock): string {
  const base = TOOL_LABEL[b.tool] ?? b.tool;
  const q = typeof b.args.query === "string" ? b.args.query : "";
  return q ? `${base}: «${q}»` : base;
}

export function ToolCard({
  block,
  actions,
}: {
  block: ToolBlock;
  actions: BlockActions;
}) {
  const Icon = TOOL_ICON[block.tool] ?? Search;
  const data = block.data;
  return (
    <div className="rounded-xl border bg-card/60 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground border-b bg-muted/40">
        {block.running ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : block.ok ? (
          <Icon className="h-3.5 w-3.5" />
        ) : (
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
        )}
        <span className="truncate">{toolTitle(block)}</span>
        {data?.type === "events" && data.understood && (
          <span className="ml-auto truncate opacity-80">{data.understood}</span>
        )}
      </div>
      {block.running ? (
        <div className="px-3 py-3 text-xs text-muted-foreground">
          выполняется…
        </div>
      ) : block.error && data?.type !== "cameras" ? (
        <div className="px-3 py-3 text-sm text-destructive">{block.error}</div>
      ) : data ? (
        <div className="p-3">
          {data.type === "events" && (
            <EventsGrid items={data.items} actions={actions} />
          )}
          {data.type === "faces" && (
            <FacesGrid
              items={data.items}
              queryFace={data.query_face}
              actions={actions}
            />
          )}
          {data.type === "recognitions" && (
            <RecognitionGrid
              items={data.items}
              total={data.total}
              actions={actions}
            />
          )}
          {data.type === "journal" && (
            <JournalGrid
              items={data.items}
              total={data.total}
              actions={actions}
            />
          )}
          {data.type === "cameras" && <CamerasTable items={data.items} />}
          {data.type === "video_job" && (
            <VideoJobCard jobId={data.job_id} actions={actions} />
          )}
          {data.type === "video_jobs" &&
            (data.job_ids.length ? (
              <div className="space-y-2">
                {data.job_ids.map((id) => (
                  <VideoJobCard key={id} jobId={id} actions={actions} />
                ))}
              </div>
            ) : (
              <Empty text="Нет загруженных видео" />
            ))}
          {data.type === "error" && (
            <div className="text-sm text-destructive">{data.message}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-muted-foreground">{text}</div>;
}

function useCollapsed<T>(items: T[], first: number) {
  const [all, setAll] = useState(false);
  return {
    shown: all ? items : items.slice(0, first),
    more: items.length - first,
    toggle: () => setAll((v) => !v),
    all,
  };
}

function MoreButton({
  more,
  all,
  toggle,
}: {
  more: number;
  all: boolean;
  toggle: () => void;
}) {
  if (more <= 0) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-2 text-xs text-primary hover:underline"
    >
      {all ? "Свернуть" : `Показать ещё ${more}`}
    </button>
  );
}

function EventsGrid({
  items,
  actions,
}: {
  items: EventItem[];
  actions: BlockActions;
}) {
  const c = useCollapsed(items, 8);
  if (!items.length) return <Empty text="Ничего не найдено" />;
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {c.shown.map((h) => {
          const caption = [h.when, h.camera_name, h.person]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              type="button"
              key={h.id}
              onClick={() =>
                actions.openImage(
                  searchImageUrl(
                    h.id,
                    h.frame_available === false ? "thumb" : "annotated",
                  ),
                  caption,
                )
              }
              className={cn(
                "group relative rounded-lg overflow-hidden border bg-black text-left",
                h.below_floor && "opacity-50",
              )}
              title={caption}
            >
              <img
                loading="lazy"
                src={searchImageUrl(h.id, "thumb")}
                alt={h.person ?? "кадр"}
                onError={onImgError}
                className="w-full aspect-[3/4] object-cover transition-transform group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-1.5 text-[11px] leading-tight text-white">
                <div className="font-medium truncate">
                  {h.person ?? h.camera_name}
                </div>
                <div className="opacity-80 truncate">
                  {h.when?.slice(5, 16) ?? "?"}
                  {h.person ? ` · ${h.camera_name}` : ""}
                </div>
              </div>
              {h.score != null && (
                <span className="absolute top-1 right-1 rounded bg-black/60 px-1 text-[10px] text-white">
                  {h.score.toFixed(3)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <MoreButton {...c} />
    </>
  );
}

function FacesGrid({
  items,
  queryFace,
  actions,
}: {
  items: FaceItem[];
  queryFace: string | null;
  actions: BlockActions;
}) {
  const c = useCollapsed(items, 8);
  return (
    <div className="flex gap-3">
      {queryFace && (
        <div className="shrink-0 text-center">
          <img
            src={queryFace}
            alt="лицо с фото"
            className="h-20 w-20 rounded-lg object-cover border-2 border-primary"
          />
          <div className="mt-1 text-[11px] text-muted-foreground">с фото</div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        {!items.length ? (
          <Empty text="Похожих лиц не найдено" />
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {c.shown.map((f, i) => {
                const caption = [f.when, f.camera_name, f.person]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <button
                    type="button"
                    // biome-ignore lint/suspicious/noArrayIndexKey: matches have no stable id
                    key={i}
                    className="text-left"
                    onClick={() =>
                      actions.openImage(
                        mediaUrl(f.frame_url || f.crop_url),
                        caption,
                      )
                    }
                    title={caption}
                  >
                    <img
                      loading="lazy"
                      src={mediaUrl(f.crop_url)}
                      alt="совпадение"
                      onError={onImgError}
                      className="w-full aspect-square rounded-lg object-cover border"
                    />
                    <div className="mt-1 text-[11px] leading-tight">
                      <span className="font-semibold">
                        {Math.round(f.similarity * 100)}%
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {f.camera_name}
                      </span>
                      <div className="text-muted-foreground truncate">
                        {f.when?.replace("T", " ").slice(0, 16)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <MoreButton {...c} />
          </>
        )}
      </div>
    </div>
  );
}

function RecognitionGrid({
  items,
  total,
  actions,
}: {
  items: RecognitionItem[];
  total: number | null;
  actions: BlockActions;
}) {
  const c = useCollapsed(items, 10);
  if (!items.length) return <Empty text="Событий нет" />;
  return (
    <>
      {total != null && total > items.length && (
        <div className="mb-2 text-xs text-muted-foreground">
          показано {items.length} из {total}
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {c.shown.map((r, i) => {
          const caption = [r.when, r.camera_name, r.person ?? "неизвестный"]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: events have no id here
              key={i}
              className="text-left"
              onClick={() =>
                actions.openImage(mediaUrl(r.frame_url || r.crop_url), caption)
              }
              title={caption}
            >
              <img
                loading="lazy"
                src={mediaUrl(r.crop_url)}
                alt={r.person ?? "лицо"}
                onError={onImgError}
                className={cn(
                  "w-full aspect-square rounded-lg object-cover border-2",
                  r.known ? "border-emerald-500" : "border-transparent",
                )}
              />
              <div className="mt-1 text-[11px] leading-tight">
                <div
                  className={cn(
                    "truncate",
                    r.known ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {r.person ?? "Неизвестный"}
                </div>
                <div className="text-muted-foreground truncate">
                  {r.when?.replace("T", " ").slice(5, 16)} · {r.camera_name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <MoreButton {...c} />
    </>
  );
}

// Images come from trt-journal with the current token (the stored block holds no token).
function JournalGrid({
  items,
  total,
  actions,
}: {
  items: JournalItem[];
  total: number | null;
  actions: BlockActions;
}) {
  const c = useCollapsed(items, 10);
  if (!items.length) return <Empty text="Событий нет" />;
  return (
    <>
      {total != null && total > items.length && (
        <div className="mb-2 text-xs text-muted-foreground">
          показано {items.length} из {total}
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {c.shown.map((e) => {
          const look = lookOf(e.type);
          const caption = [e.when, e.camera_name, e.title]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              type="button"
              key={e.id}
              className="text-left"
              onClick={() =>
                actions.openImage(
                  journalImageUrl(
                    e.id,
                    e.has_frame ? "frame" : "crop",
                    actions.token,
                  ),
                  caption,
                )
              }
              title={caption}
            >
              <div className="relative">
                <img
                  loading="lazy"
                  src={
                    e.has_crop
                      ? journalImageUrl(e.id, "crop", actions.token)
                      : NO_IMG
                  }
                  alt={e.title ?? look.badge}
                  onError={onImgError}
                  className={cn(
                    "w-full aspect-square rounded-lg object-cover border-2",
                    e.violation ? "border-red-500" : "border-transparent",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    look.badgeClass,
                  )}
                >
                  {look.badge}
                </span>
              </div>
              <div className="mt-1 text-[11px] leading-tight">
                <div
                  className={cn(
                    "truncate",
                    e.violation ? "font-semibold text-red-600" : "font-medium",
                  )}
                >
                  {e.title}
                </div>
                <div className="text-muted-foreground truncate">
                  {e.when?.slice(5, 16)} · {e.camera_name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <MoreButton {...c} />
    </>
  );
}

const CAMERA_STATUS: Record<string, { text: string; cls: string }> = {
  added: { text: "добавлена", cls: "text-emerald-600" },
  exists: { text: "уже есть", cls: "text-amber-600" },
  updated: { text: "обновлена", cls: "text-emerald-600" },
  error: { text: "ошибка", cls: "text-destructive" },
};

function CamerasTable({ items }: { items: CameraItem[] }) {
  if (!items.length) return <Empty text="Камер нет" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-muted-foreground">
          <tr className="text-left">
            <th className="py-1 pr-3 font-medium">ID</th>
            <th className="py-1 pr-3 font-medium">Название</th>
            <th className="py-1 pr-3 font-medium">Адрес</th>
            <th className="py-1 font-medium">Состояние</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c, i) => {
            const st = c.status ? CAMERA_STATUS[c.status] : undefined;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: failed rows have no id
              <tr key={i} className="border-t align-top">
                <td className="py-1.5 pr-3">{c.id ?? "—"}</td>
                <td className="py-1.5 pr-3 font-medium">{c.name ?? "—"}</td>
                <td className="py-1.5 pr-3 font-mono break-all max-w-[280px]">
                  {c.url ?? ""}
                </td>
                <td className="py-1.5 whitespace-nowrap">
                  {st && <span className={st.cls}>{st.text}</span>}
                  {st && c.active != null && " · "}
                  {c.active != null && (
                    <span
                      className={
                        c.active ? "text-emerald-600" : "text-muted-foreground"
                      }
                    >
                      {c.active ? "активна" : "выключена"}
                    </span>
                  )}
                  {c.error && (
                    <div className="text-destructive whitespace-normal">
                      {c.error}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const JOB_STAGE: Record<VideoJob["status"], string> = {
  queued: "В очереди",
  transcoding: "Подготовка видео",
  starting: "Подключение к анализу",
  processing: "Анализ",
  finishing: "Завершение",
  done: "Готово",
  error: "Ошибка",
  cancelled: "Отменено",
};

const TERMINAL = new Set(["done", "error", "cancelled"]);

function VideoJobCard({
  jobId,
  actions,
}: {
  jobId: string;
  actions: BlockActions;
}) {
  const [job, setJob] = useState<VideoJob | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const j = await chatApi.getVideoJob(actions.token, jobId);
        if (stop) return;
        setJob(j);
        if (!TERMINAL.has(j.status)) timer = setTimeout(tick, 2000);
      } catch {
        if (!stop) setFailed(true);
      }
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [jobId, actions.token]);

  if (failed) return <Empty text="Не удалось получить статус" />;
  if (!job)
    return (
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" /> загрузка…
      </div>
    );

  const running = !TERMINAL.has(job.status);
  const pct = Math.round((job.progress || 0) * 100);
  const mins = Math.max(1, Math.round(job.duration / 60));
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {job.status === "done" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : job.status === "error" || job.status === "cancelled" ? (
          <XCircle className="h-4 w-4 text-destructive" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
        <span className="font-medium truncate">{job.name}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          ~{mins} мин
        </span>
        {job.camera_id != null && (
          <span className="ml-auto text-xs text-muted-foreground shrink-0">
            камера {job.camera_id}
          </span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {JOB_STAGE[job.status]}
        {(job.status === "transcoding" || job.status === "processing") &&
          ` · ${pct}%`}
        {job.message && !["готово", "анализ"].includes(job.message)
          ? ` · ${job.message}`
          : ""}
      </div>
      {running && (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full bg-primary transition-[width] duration-700",
              (job.status === "starting" || job.status === "queued") &&
                "animate-pulse w-full opacity-40",
            )}
            style={
              job.status === "starting" || job.status === "queued"
                ? undefined
                : { width: `${pct}%` }
            }
          />
        </div>
      )}
      <div className="flex gap-2">
        {running && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => chatApi.cancelVideoJob(actions.token, jobId)}
          >
            Остановить
          </Button>
        )}
        {job.status === "done" && job.camera_id != null && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              actions.suggest(
                `Кто появлялся в видео «${job.name}» (камера ${job.camera_id})?`,
              )
            }
          >
            Кто был в видео?
          </Button>
        )}
      </div>
    </div>
  );
}
