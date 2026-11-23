import {
  canToggle,
  MODE_HINTS,
  MODE_LABELS,
  nextModes,
  useGetSearchHealthQuery,
  useGetSearchSettingsQuery,
  useSetPipelineModesMutation,
} from "@/entities/appearance-search";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/shadcn-ui/utils";
// Pipeline modes of the indexer (PUT /settings) and its health.
export function ModesPanel({ editable }: { editable: boolean }) {
  const { data: settings } = useGetSearchSettingsQuery();
  const { data: health } = useGetSearchHealthQuery(undefined, {
    pollingInterval: 30000,
  });
  const [setModes, { isLoading }] = useSetPipelineModesMutation();
  const face = health?.streams?.face_events;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {settings?.available_modes.map((mode) => {
        const on = settings.pipeline_modes.includes(mode);
        const pre = settings.prerequisites[mode];
        return (
          <label
            key={mode}
            className={cn(
              "flex items-center gap-1",
              !on && "opacity-60",
              pre && !pre.ok && "line-through",
            )}
            title={[MODE_HINTS[mode], pre?.reason].filter(Boolean).join(" — ")}
          >
            <input
              type="checkbox"
              checked={on}
              disabled={!editable || isLoading || !canToggle(on, pre)}
              onChange={(e) =>
                setModes(
                  nextModes(settings.pipeline_modes, mode, e.target.checked),
                )
              }
            />
            {MODE_LABELS[mode] ?? mode}
          </label>
        );
      })}
      {health && (
        <span title={t("строк в индексе · очередь индексатора")}>
          {t("в индексе: {n}", { n: health.rows ?? "?" })}
          {face && typeof face.undelivered === "number" && face.undelivered > 0
            ? ` · ${t("в очереди: {n}", { n: face.undelivered })}`
            : ""}
          {health.attributes
            ? ` · ${t("с атрибутами: {n}", { n: health.attributes })}`
            : ""}
        </span>
      )}
      {health && health.status !== "ok" && (
        <span className="text-red-600">
          {t("сервис поиска: {s}", { s: health.status })}
        </span>
      )}
    </div>
  );
}
