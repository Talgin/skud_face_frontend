import { useMemo, useState } from "react";
import {
  buildSearchBody,
  cameraLabel,
  DEFAULT_K,
  MAX_K,
  nextLabel,
  type SearchForm,
  type SearchResponse,
  statusLine,
  useGetEvalLabelsQuery,
  useGetSearchCamerasQuery,
  useSearchMutation,
  useSetEvalLabelMutation,
} from "@/entities/appearance-search";
import { useCan } from "@/entities/role";
import { currentUsername } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { EvalPanel } from "./EvalPanel";
import { HitCard } from "./HitCard";
import { ModesPanel } from "./ModesPanel";

const EXAMPLES = [
  "мужчина в чёрной куртке",
  "woman with a white bag",
  "blue jeans, black backpack",
  "вчера вечером человек в красном",
];

const EVAL_KEY = "appearance-search.eval";

function readEvalMode(): boolean {
  try {
    return localStorage.getItem(EVAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppearanceSearch() {
  const { canAny } = useCan();
  const canEval = canAny("search.eval");
  const [form, setForm] = useState<SearchForm>({
    text: "",
    k: DEFAULT_K,
    onePerPerson: true,
  });
  const [evalMode, setEvalMode] = useState(() => canEval && readEvalMode());
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [status, setStatus] = useState("");
  const { data: cameras = [] } = useGetSearchCamerasQuery();
  const [runSearch, { isLoading }] = useSearchMutation();
  const [setLabel] = useSetEvalLabelMutation();
  const { data: labels } = useGetEvalLabelsQuery(result?.query ?? "", {
    skip: !evalMode || !result?.query,
  });

  const cameraNames = useMemo(
    () => new Map(cameras.map((c) => [c.camera_id, cameraLabel(c)])),
    [cameras],
  );

  async function search(text = form.text) {
    const body = buildSearchBody({ ...form, text });
    if (!body) return;
    setStatus("Ищу…");
    const t0 = performance.now();
    try {
      const res = await runSearch(body).unwrap();
      setResult(res);
      setStatus(statusLine(res, performance.now() - t0));
    } catch {
      setResult(null);
      setStatus("Сервис поиска недоступен");
    }
  }

  function pick(text: string) {
    setForm((f) => ({ ...f, text }));
    search(text);
  }

  function toggleEval(on: boolean) {
    setEvalMode(on);
    try {
      localStorage.setItem(EVAL_KEY, on ? "1" : "");
    } catch {
      // private window: the switch just is not remembered
    }
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold ml-4 mr-2">Поиск по внешности</h2>
        <ModesPanel editable={canAny("search.settings")} />
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Input
          autoFocus
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="например: мужчина в белой рубашке и синих джинсах, чёрный рюкзак"
          className="flex-1 min-w-[260px]"
        />
        <Button type="submit" disabled={isLoading || !form.text.trim()}>
          Найти
        </Button>
      </form>

      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label className="flex flex-col text-xs text-muted-foreground">
          Камера
          <select
            value={form.cameraId ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, cameraId: e.target.value || undefined }))
            }
            className="border rounded p-1 text-sm text-foreground bg-background"
          >
            <option value="">Все</option>
            {cameras.map((c) => (
              <option key={c.camera_id} value={c.camera_id}>
                {cameraLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-muted-foreground">
          С
          <input
            type="datetime-local"
            value={form.from ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
            className="border rounded p-1 text-sm text-foreground bg-background"
          />
        </label>
        <label className="flex flex-col text-xs text-muted-foreground">
          По
          <input
            type="datetime-local"
            value={form.to ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
            className="border rounded p-1 text-sm text-foreground bg-background"
          />
        </label>
        <label className="flex flex-col text-xs text-muted-foreground">
          Сколько
          <input
            type="number"
            min={1}
            max={MAX_K}
            value={form.k}
            onChange={(e) =>
              setForm((f) => ({ ...f, k: Number(e.target.value) }))
            }
            className="border rounded p-1 text-sm w-20 text-foreground bg-background"
          />
        </label>
        <label className="flex items-center gap-1 pb-1">
          <input
            type="checkbox"
            checked={form.onePerPerson}
            onChange={(e) =>
              setForm((f) => ({ ...f, onePerPerson: e.target.checked }))
            }
          />
          один кадр на человека
        </label>
        {(form.cameraId || form.from || form.to) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((f) => ({
                ...f,
                cameraId: undefined,
                from: undefined,
                to: undefined,
              }))
            }
          >
            Сбросить фильтры
          </Button>
        )}
        {canEval && (
          <label
            className="flex items-center gap-1 pb-1 ml-auto"
            title="Отмечать результаты верно/неверно — набор для оценки качества поиска"
          >
            <input
              type="checkbox"
              checked={evalMode}
              onChange={(e) => toggleEval(e.target.checked)}
            />
            режим оценки
          </label>
        )}
      </div>

      {evalMode && <EvalPanel onPick={pick} />}

      <div className="text-sm text-muted-foreground">
        {status ||
          "Опишите внешность — одежду, цвета, сумки, время и место. Работает на русском и английском."}
      </div>

      {!result && (
        <div className="flex flex-wrap gap-2 text-sm">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              className="rounded-full border px-3 py-1 hover:bg-muted"
              onClick={() => pick(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {result && result.hits.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          Ничего не найдено
        </div>
      )}

      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {result?.hits.map((hit) => (
          <HitCard
            key={hit.id}
            hit={hit}
            cameraName={cameraNames.get(hit.camera_id) ?? hit.camera_id}
            evalMode={evalMode}
            label={labels?.labels?.[hit.id]}
            onLabel={(relevant) =>
              setLabel({
                query: result.query,
                id: hit.id,
                relevant: nextLabel(labels?.labels?.[hit.id], relevant),
                by: currentUsername() ?? "",
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
