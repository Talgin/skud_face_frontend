import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCamerasQuery } from "@/entities/camera";
import {
  EMPTY_FILTERS,
  type JournalFilters as Filters,
  type JournalEvent,
  journalApi,
  journalLiveUrl,
} from "@/entities/journal";
import { useCan } from "@/entities/role";
import { t } from "@/shared/i18n";
import { useAppSelector } from "@/shared/model";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { EventCard } from "./EventCard";
import { EventDetail } from "./EventDetail";
import { JournalFilters } from "./JournalFilters";

const PAGE = 60;
const FRESH_MS = 6000;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

// «Журнал видеоаналитики»: every analytics type (faces, PPE, plates, ...) in one grid, from trt-journal.
export function AnalyticsJournal() {
  const token = useAppSelector((s) => s.session.accessToken) ?? undefined;
  // camera names come from SKUD, which lists cameras to super admins only; others see "Камера N · host"
  const { canAny } = useCan();
  const { data: cameraList } = useCamerasQuery(undefined, {
    skip: !canAny("camera.view"),
  });
  const cameras = useMemo(
    () =>
      (cameraList ?? []).map((c) => ({
        id: c.id,
        name: `${t("Камера")} ${c.id}${hostOf(c.url) ? ` · ${hostOf(c.url)}` : ""}`,
      })),
    [cameraList],
  );
  const cameraName = useCallback(
    (e: JournalEvent) =>
      cameras.find((c) => c.id === e.camera_id)?.name ??
      `${t("Камера")} ${e.camera_id}${e.camera_host ? ` · ${e.camera_host}` : ""}`,
    [cameras],
  );

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState<Filters>(EMPTY_FILTERS); // filters after the text debounce
  const [items, setItems] = useState<JournalEvent[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [byType, setByType] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<JournalEvent | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const generation = useRef(0);

  // typing in the search box waits 400 ms; every other filter applies at once
  useEffect(() => {
    const delay = filters.q === query.q ? 0 : 400;
    const timer = setTimeout(() => setQuery(filters), delay);
    return () => clearTimeout(timer);
  }, [filters, query.q]);

  // first page whenever the filters change
  useEffect(() => {
    const gen = ++generation.current;
    setLoading(true);
    setError(null);
    journalApi
      .list(token, query, null, PAGE)
      .then((page) => {
        if (gen !== generation.current) return;
        setItems(page.items);
        setCursor(page.next_cursor);
        setTotal(page.total ?? null);
        setByType(page.by_type ?? {});
      })
      .catch((e: Error) => gen === generation.current && setError(e.message))
      .finally(() => gen === generation.current && setLoading(false));
  }, [token, query]);

  const loadMore = useCallback(() => {
    if (!cursor || loading) return;
    const gen = generation.current;
    setLoading(true);
    journalApi
      .list(token, query, cursor, PAGE)
      .then((page) => {
        if (gen !== generation.current) return;
        setItems((prev) => {
          const seen = new Set(prev.map((x) => x.id));
          return [...prev, ...page.items.filter((x) => !seen.has(x.id))];
        });
        setCursor(page.next_cursor);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, query, cursor, loading]);

  // endless scroll: load the next page when the sentinel below the grid becomes visible
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      {
        rootMargin: "400px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  // live: new events matching the filters are put on top as they arrive
  useEffect(() => {
    if (!live || !token) return;
    const es = new EventSource(journalLiveUrl(query, token));
    es.onmessage = (msg) => {
      const e = JSON.parse(msg.data) as JournalEvent;
      setItems((prev) =>
        prev.some((x) => x.id === e.id) ? prev : [e, ...prev],
      );
      setTotal((n) => (n === null ? n : n + 1));
      setByType((b) => ({ ...b, [e.type]: (b[e.type] ?? 0) + 1 }));
      setFresh((s) => new Set(s).add(e.id));
      setTimeout(
        () =>
          setFresh((s) => {
            const next = new Set(s);
            next.delete(e.id);
            return next;
          }),
        FRESH_MS,
      );
    };
    return () => es.close();
  }, [live, token, query]);

  return (
    <div className="flex gap-6 p-4 md:p-6">
      {showFilters && (
        <aside className="w-64 shrink-0 rounded-lg border bg-card p-4 h-fit sticky top-4">
          <JournalFilters
            value={filters}
            onChange={setFilters}
            cameras={cameras}
            byType={byType}
          />
        </aside>
      )}

      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-xl font-semibold">
            {t("Журнал видеоаналитики")}
          </h1>
          <span className="text-sm text-muted-foreground">
            {t("Событий:")}{" "}
            <span className="font-medium text-foreground">{total ?? "…"}</span>
          </span>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="journal-live"
                checked={live}
                onCheckedChange={(c) => setLive(c === true)}
              />
              <label htmlFor="journal-live" className="cursor-pointer">
                {t("В реальном времени")}
              </label>
              {live && (
                <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? t("Скрыть фильтры") : t("Фильтры")}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            {t("Нет событий за последние 7 дней по выбранным фильтрам")}
          </div>
        )}

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {items.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              cameraName={cameraName(e)}
              token={token}
              fresh={fresh.has(e.id)}
              onOpen={() => setSelected(e)}
            />
          ))}
        </div>

        <div ref={sentinel} className="h-8" />
        {loading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("Загрузка…")}
          </p>
        )}
        {!loading && cursor && (
          <div className="text-center">
            <Button variant="outline" onClick={loadMore}>
              {t("Показать ещё")}
            </Button>
          </div>
        )}
      </div>

      <EventDetail
        event={selected}
        cameraName={selected ? cameraName(selected) : ""}
        token={token}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
