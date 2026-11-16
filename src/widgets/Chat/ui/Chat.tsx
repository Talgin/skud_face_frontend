import {
  Film,
  MessageSquare,
  PanelLeft,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ChatMessage,
  ChatApiError,
  type Conversation,
  chatApi,
  Markdown,
  type StreamEvent,
  type ToolBlock,
  uploadUrl,
} from "@/entities/chat";
import { useAppSelector } from "@/shared/model";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { type BlockActions, ToolCard } from "./blocks";
import { Composer, type PendingFile } from "./Composer";

const SUGGESTIONS = [
  "Найди мужчину в красной куртке вчера вечером",
  "Кто приходил сегодня утром?",
  "Покажи список камер",
  "Добавь камеру rtsp://user:pass@192.168.1.10:554/stream1 и назови её «Вход»",
];

type Props = {
  convId?: string;
  onSelect: (id: string | undefined) => void;
};

function groupByDay(convs: Conversation[]) {
  const today = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const t0 = startOf(today);
  const groups: { label: string; items: Conversation[] }[] = [];
  const push = (label: string, c: Conversation) => {
    const g = groups.find((x) => x.label === label);
    if (g) g.items.push(c);
    else groups.push({ label, items: [c] });
  };
  for (const c of convs) {
    const d = startOf(new Date(c.updated));
    const days = Math.round((t0 - d) / 86400000);
    push(
      days <= 0
        ? "Сегодня"
        : days === 1
          ? "Вчера"
          : days < 7
            ? "Последние 7 дней"
            : "Ранее",
      c,
    );
  }
  return groups;
}

export function Chat({ convId, onSelect }: Props) {
  const token = useAppSelector((s) => s.session.accessToken);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; caption?: string }>();
  const [dragging, setDragging] = useState(false);
  const [renaming, setRenaming] = useState<{ id: string; title: string }>();

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  // conversation created by this tab for a message/upload: do not reload it
  const createdHere = useRef<string | null>(null);

  const refreshConvs = useCallback(async () => {
    try {
      setConvs(await chatApi.listConversations(token));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [token]);

  useEffect(() => {
    refreshConvs();
  }, [refreshConvs]);

  useEffect(() => {
    abortRef.current?.abort();
    setFiles([]);
    setError(null);
    if (!convId) {
      setMessages([]);
      return;
    }
    if (createdHere.current === convId) return;
    let cancelled = false;
    setLoading(true);
    chatApi
      .getConversation(token, convId)
      .then((r) => {
        if (!cancelled) {
          setMessages(r.messages);
          stickToBottom.current = true;
        }
      })
      .catch((e: ChatApiError) => {
        if (cancelled) return;
        if (e.status === 404) onSelect(undefined);
        else setError(e.message);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [convId, token, onSelect]);

  // follow the stream unless the user scrolled up
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on every update
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ensureConversation = useCallback(async () => {
    if (convId) return convId;
    const c = await chatApi.createConversation(token);
    createdHere.current = c.id;
    setConvs((cs) => [c, ...cs]);
    onSelect(c.id);
    return c.id;
  }, [convId, token, onSelect]);

  const addFiles = useCallback(
    async (list: File[]) => {
      const accepted = list.filter(
        (f) =>
          f.type.startsWith("image/") ||
          f.type.startsWith("video/") ||
          /\.(mkv|ts|avi|mov|flv|mp4|m4v|webm)$/i.test(f.name),
      );
      if (!accepted.length) {
        setError("Можно прикрепить только фото или видео");
        return;
      }
      let id: string;
      try {
        id = await ensureConversation();
      } catch (e) {
        setError((e as Error).message);
        return;
      }
      for (const file of accepted) {
        const key = `${file.name}-${file.size}-${Math.random()}`;
        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;
        setFiles((fs) => [...fs, { key, file, preview, progress: 0 }]);
        chatApi
          .upload(token, id, file, (p) =>
            setFiles((fs) =>
              fs.map((f) => (f.key === key ? { ...f, progress: p } : f)),
            ),
          )
          .then((att) =>
            setFiles((fs) =>
              fs.map((f) =>
                f.key === key ? { ...f, attachmentId: att.id, progress: 1 } : f,
              ),
            ),
          )
          .catch((e: Error) =>
            setFiles((fs) =>
              fs.map((f) => (f.key === key ? { ...f, error: e.message } : f)),
            ),
          );
      }
    },
    [ensureConversation, token],
  );

  const removeFile = (key: string) =>
    setFiles((fs) => {
      const f = fs.find((x) => x.key === key);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return fs.filter((x) => x.key !== key);
    });

  const patchAssistant = (id: string, fn: (m: ChatMessage) => ChatMessage) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? fn(m) : m)));

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? draft).trim();
      const attIds = files
        .filter((f) => f.attachmentId)
        .map((f) => f.attachmentId as string);
      if (!content && !attIds.length) return;
      setError(null);
      let id: string;
      try {
        id = await ensureConversation();
      } catch (e) {
        setError((e as Error).message);
        return;
      }
      setDraft("");
      setFiles([]);
      setStreaming(true);
      stickToBottom.current = true;
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let assistantId = "";

      const onEvent = (ev: StreamEvent) => {
        switch (ev.type) {
          case "user_message":
            setMessages((ms) => [...ms, ev.message]);
            break;
          case "assistant":
            assistantId = ev.id;
            setMessages((ms) => [
              ...ms,
              {
                id: ev.id,
                conv_id: id,
                role: "assistant",
                content: "",
                created: new Date().toISOString(),
                blocks: [],
                status: "streaming",
              },
            ]);
            break;
          case "delta":
            patchAssistant(assistantId, (m) => ({
              ...m,
              content: m.content + ev.text,
            }));
            break;
          case "tool_start":
            patchAssistant(assistantId, (m) => ({
              ...m,
              blocks: [
                ...(m.blocks ?? []),
                {
                  id: ev.id,
                  tool: ev.name,
                  args: ev.args,
                  ok: true,
                  data: null,
                  error: null,
                  running: true,
                },
              ],
            }));
            break;
          case "tool_end": {
            const { type: _t, ...block } = ev;
            patchAssistant(assistantId, (m) => ({
              ...m,
              blocks: (m.blocks ?? []).map((b) =>
                b.id === block.id ? (block as ToolBlock) : b,
              ),
            }));
            break;
          }
          case "done":
            patchAssistant(assistantId, (m) => ({
              ...m,
              content: ev.message.content ?? m.content,
              status: "done",
            }));
            break;
          case "error":
            setError(`Ошибка модели: ${ev.message}`);
            patchAssistant(assistantId, (m) => ({ ...m, status: "error" }));
            break;
        }
      };

      try {
        await chatApi.send(token, id, content, attIds, onEvent, ctrl.signal);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError((e as Error).message);
      } finally {
        setStreaming(false);
        if (assistantId)
          patchAssistant(assistantId, (m) =>
            m.status === "streaming" ? { ...m, status: "done" } : m,
          );
        abortRef.current = null;
        refreshConvs();
      }
    },
    [draft, files, ensureConversation, token, refreshConvs],
  );

  const stop = () => abortRef.current?.abort();

  const actions: BlockActions = useMemo(
    () => ({
      token,
      openImage: (src, caption) => setLightbox({ src, caption }),
      suggest: (text) => send(text),
    }),
    [token, send],
  );

  const removeConversation = async (id: string) => {
    if (!window.confirm("Удалить этот чат?")) return;
    try {
      await chatApi.deleteConversation(token, id);
      setConvs((cs) => cs.filter((c) => c.id !== id));
      if (id === convId) onSelect(undefined);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const saveRename = async () => {
    if (!renaming) return;
    const { id, title } = renaming;
    setRenaming(undefined);
    if (!title.trim()) return;
    try {
      const c = await chatApi.renameConversation(token, id, title.trim());
      setConvs((cs) => cs.map((x) => (x.id === id ? c : x)));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const groups = groupByDay(convs);
  const empty = !loading && messages.length === 0;

  return (
    <div className="relative flex h-[calc(100vh-120px)] overflow-hidden">
      {/* conversations */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-64 shrink-0 border-r bg-card transition-transform md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 p-3">
            <button
              type="button"
              onClick={() => {
                onSelect(undefined);
                setSidebarOpen(false);
              }}
              className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Новый чат
            </button>
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Скрыть список"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {groups.map((g) => (
              <div key={g.label} className="mb-3">
                <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {g.label}
                </div>
                {g.items.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group flex items-center rounded-lg text-sm",
                      c.id === convId ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    {renaming?.id === c.id ? (
                      <input
                        // biome-ignore lint/a11y/noAutofocus: inline rename
                        autoFocus
                        value={renaming.title}
                        onChange={(e) =>
                          setRenaming({ id: c.id, title: e.target.value })
                        }
                        onBlur={saveRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename();
                          if (e.key === "Escape") setRenaming(undefined);
                        }}
                        className="m-1 flex-1 rounded border bg-background px-2 py-1 text-sm outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(c.id);
                          setSidebarOpen(false);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left"
                        title={c.title}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{c.title}</span>
                      </button>
                    )}
                    {renaming?.id !== c.id && (
                      <div className="hidden shrink-0 pr-1 group-hover:flex">
                        <button
                          type="button"
                          onClick={() =>
                            setRenaming({ id: c.id, title: c.title })
                          }
                          className="rounded p-1 text-muted-foreground hover:text-foreground"
                          aria-label="Переименовать"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeConversation(c.id)}
                          className="rounded p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            {!convs.length && (
              <div className="px-2 text-xs text-muted-foreground">
                Здесь появятся ваши чаты
              </div>
            )}
          </div>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Закрыть"
          className="absolute inset-0 z-10 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* thread */}
      <section
        className="relative flex min-w-0 flex-1 flex-col"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDragging(true);
          }
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!streaming) addFiles(Array.from(e.dataTransfer.files));
        }}
      >
        <button
          type="button"
          className="absolute left-3 top-3 z-10 rounded-lg border bg-card p-2 md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Чаты"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            stickToBottom.current =
              el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
        >
          {empty ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 rounded-2xl bg-primary/10 p-3 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-semibold">Чем помочь?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ищите людей в записях по внешности, времени и камере,
                прикрепите фото, чтобы найти человека, или видео для анализа.
                Вставьте ссылки rtsp://, чтобы подключить камеры.
              </p>
              <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setDraft(s)}
                    className="rounded-xl border bg-card px-3 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {loading && (
                <div className="text-center text-sm text-muted-foreground">
                  Загрузка…
                </div>
              )}
              {messages.map((m) =>
                m.role === "user" ? (
                  <UserBubble
                    key={m.id}
                    m={m}
                    token={token}
                    openImage={actions.openImage}
                  />
                ) : (
                  <AssistantMessage key={m.id} m={m} actions={actions} />
                ),
              )}
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          {error && (
            <div className="mb-2 flex items-start justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Скрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Composer
            value={draft}
            onChange={setDraft}
            files={files}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onSend={() => send()}
            onStop={stop}
            streaming={streaming}
          />
          <div className="mt-1.5 text-center text-[11px] text-muted-foreground">
            Ассистент работает на локальной модели Qwen3-VL и может ошибаться.
            Проверяйте важные результаты по кадрам.
          </div>
        </div>

        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-primary/5 ring-2 ring-inset ring-primary/40">
            <div className="rounded-xl bg-card px-4 py-3 text-sm shadow">
              Отпустите, чтобы прикрепить фото или видео
            </div>
          </div>
        )}
      </section>

      {lightbox && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(undefined)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(undefined)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.caption ?? ""}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
          {lightbox.caption && (
            <div className="mt-3 text-sm text-white/90">{lightbox.caption}</div>
          )}
        </button>
      )}
    </div>
  );
}

function UserBubble({
  m,
  token,
  openImage,
}: {
  m: ChatMessage;
  token?: string;
  openImage: (src: string, caption?: string) => void;
}) {
  return (
    <div className="flex flex-col items-end gap-2">
      {!!m.attachments?.length && (
        <div className="flex flex-wrap justify-end gap-2">
          {m.attachments.map((a) =>
            a.kind === "image" ? (
              <button
                type="button"
                key={a.id}
                onClick={() => openImage(uploadUrl(a.url, token), a.name)}
              >
                <img
                  src={uploadUrl(a.url, token)}
                  alt={a.name}
                  className="max-h-48 max-w-[240px] rounded-xl border object-cover"
                />
              </button>
            ) : (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm"
              >
                <Film className="h-4 w-4 text-muted-foreground" />
                <span className="max-w-[200px] truncate">{a.name}</span>
                {a.duration ? (
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(a.duration / 60)}:
                    {String(Math.round(a.duration % 60)).padStart(2, "0")}
                  </span>
                ) : null}
              </div>
            ),
          )}
        </div>
      )}
      {m.content && (
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {m.content}
        </div>
      )}
    </div>
  );
}

function AssistantMessage({
  m,
  actions,
}: {
  m: ChatMessage;
  actions: BlockActions;
}) {
  const streaming = m.status === "streaming";
  const nothingYet = streaming && !m.content && !m.blocks?.length;
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-3 text-sm">
        {m.blocks?.map((b) => (
          <ToolCard key={b.id} block={b} actions={actions} />
        ))}
        {nothingYet && (
          <div className="flex gap-1 pt-2">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        )}
        {m.content && <Markdown text={m.content} />}
        {m.status === "error" && !m.content && (
          <div className="text-destructive">Ответ не получен.</div>
        )}
      </div>
    </div>
  );
}
