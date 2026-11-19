import {
  COLOR_HEX,
  COLOR_RU,
  type JournalFilters as Filters,
  setTag,
  tagValue,
} from "@/entities/journal";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { DateFilter } from "@/shared/ui/date-filter";
import { Input } from "@/shared/ui/input";

export const TYPES: { type: string; label: string }[] = [
  { type: "face", label: "Распознавание лиц" },
  { type: "ppe", label: "Контроль СИЗ" },
  { type: "lpr", label: "Распознавание номеров" },
];

type Props = {
  value: Filters;
  onChange: (f: Filters) => void;
  cameras: { id: number; name: string }[];
  byType?: Record<string, number>;
};

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function JournalFilters({ value, onChange, cameras, byType }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const onlyPpe = value.types.length === 1 && value.types[0] === "ppe";

  return (
    <div className="space-y-5 text-sm">
      <section className="space-y-2">
        <h3 className="font-medium">Тип аналитики</h3>
        {TYPES.map((t) => (
          <label
            key={t.type}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={value.types.includes(t.type)}
              onCheckedChange={() =>
                set({ types: toggle(value.types, t.type), tags: [] })
              }
            />
            <span className="flex-1">{t.label}</span>
            <span className="text-xs text-muted-foreground">
              {byType?.[t.type] ?? 0}
            </span>
          </label>
        ))}
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">Камеры</h3>
        {cameras.length === 0 && (
          <p className="text-xs text-muted-foreground">Нет камер</p>
        )}
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {cameras.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={value.cameraIds.includes(c.id)}
                onCheckedChange={() =>
                  set({ cameraIds: toggle(value.cameraIds, c.id) })
                }
              />
              <span className="truncate" title={c.name}>
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">Период</h3>
        <div className="flex flex-col gap-2">
          <DateFilter value={value.since} onChange={(d) => set({ since: d })} />
          <DateFilter value={value.until} onChange={(d) => set({ until: d })} />
          {(value.since || value.until) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => set({ since: undefined, until: undefined })}
            >
              Сбросить период
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={value.violationsOnly}
            onCheckedChange={(c) => set({ violationsOnly: c === true })}
          />
          <span>Только нарушения</span>
        </label>
        <Input
          placeholder="Имя или номер"
          value={value.q}
          onChange={(e) => set({ q: e.target.value })}
        />
      </section>

      {onlyPpe && (
        <section className="space-y-3">
          <h3 className="font-medium">СИЗ</h3>
          {(
            [
              ["helmet", "Каска"],
              ["vest", "Жилет"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-14">{label}</span>
              {(
                [
                  ["", "все"],
                  ["yes", "есть"],
                  ["no", "нет"],
                ] as const
              ).map(([v, text]) => (
                <Button
                  key={v}
                  size="sm"
                  variant={
                    tagValue(value.tags, key) === v ? "default" : "outline"
                  }
                  onClick={() => set({ tags: setTag(value.tags, key, v) })}
                >
                  {text}
                </Button>
              ))}
            </div>
          ))}
          <div className="space-y-2">
            <span>Цвет одежды</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(COLOR_RU).map((c) => {
                const active = tagValue(value.tags, "color") === c;
                return (
                  <button
                    key={c}
                    type="button"
                    title={COLOR_RU[c]}
                    onClick={() =>
                      set({
                        tags: setTag(value.tags, "color", active ? "" : c),
                      })
                    }
                    className={cn(
                      "h-6 w-6 rounded-full border",
                      active && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{ backgroundColor: COLOR_HEX[c] }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onChange({ ...value, ...RESET })}
      >
        Сбросить фильтры
      </Button>
    </div>
  );
}

const RESET: Partial<Filters> = {
  types: [],
  cameraIds: [],
  since: undefined,
  until: undefined,
  violationsOnly: false,
  tags: [],
  q: "",
};
