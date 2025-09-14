import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  endOfDay,
  endOfToday,
  startOfDay,
  startOfToday,
  subDays,
  subMonths,
} from "date-fns";
import { CalendarDays, Filter } from "lucide-react";
import React from "react";
import { useGetUniqueCountQuery } from "@/entities/monitoring";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

type Preset = "all" | "today" | "week" | "month" | "custom";

const presetRange = (p: Preset) => {
  const now = new Date();
  switch (p) {
    case "today":
      return { start: startOfToday(), end: endOfToday() };
    case "week":
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case "month":
      return { start: startOfDay(subMonths(now, 1)), end: endOfDay(now) };
    default:
      return { start: undefined, end: undefined };
  }
};

const presetLabel = (p: Preset) =>
  p === "all"
    ? "All Time"
    : p === "today"
      ? "Сегодня"
      : p === "week"
        ? "За неделю"
        : p === "month"
          ? "За месяц"
          : "Диапазон";

export function UniqueUsersCard() {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [preset, setPreset] = React.useState<Preset>("all");
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
  const p = presetRange(preset);

  const start = preset === "custom" ? range.from : p.start;
  const end = preset === "custom" ? range.to : p.end;

  const queryArgs =
    preset === "all"
      ? {}
      : start && end
        ? { start_date: start.toISOString(), end_date: end.toISOString() }
        : {};

  const { data, isFetching, isError } = useGetUniqueCountQuery(queryArgs, {
    skip: preset !== "all" && !(start && end),
  });

  const value = data?.unique_person_count ?? 0;
  const fmt = new Intl.NumberFormat("en-US").format;

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg border-0 min-h-96">
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600" />

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      </div>
      <div className="relative z-10 h-full">
        <CardHeader className="flex flex-row items-start justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-t-2xl">
          <div className="flex flex-col gap-1 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <CalendarDays className="h-4 w-4 text-white" />
              </span>
              <CardTitle className="text-white font-medium text-base">
                Уникальные пользователи
              </CardTitle>
            </div>
            <CardDescription className="text-white/75 font-normal text-xs pb-1 pl-10">
              Количество за{" "}
              <span className="font-semibold">
                {preset === "custom" && range.from && range.to
                  ? ` ${range.from.toLocaleDateString()} — ${range.to.toLocaleDateString()}`
                  : ` ${presetLabel(preset)}`}
              </span>
            </CardDescription>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30  text-white border-0"
              >
                <Filter className="mr-2 h-4 w-4" /> Фильтр
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-white/85 rounded-md z-[9999]"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-3">
                <div
                  className={cn(
                    "flex flex-col gap-3 items-center p-5",
                    preset === "custom" && "pb-0",
                  )}
                >
                  <ToggleGroup
                    type="single"
                    className="flex gap-2 w-full"
                    value={preset}
                    onValueChange={(val) => setPreset(val as Preset)}
                  >
                    <ToggleGroupItem asChild value="today">
                      <Button
                        variant={preset === "today" ? "default" : "outline"}
                        onClick={() => {
                          setPreset("today");
                          setPopoverOpen(false);
                        }}
                        className={
                          preset === "today" ? "" : "bg-transparent col-span-2"
                        }
                      >
                        Сегодня
                      </Button>
                    </ToggleGroupItem>
                    <ToggleGroupItem asChild value="week">
                      <Button
                        variant={preset === "week" ? "default" : "outline"}
                        onClick={() => {
                          setPreset("week");
                          setPopoverOpen(false);
                        }}
                        className={
                          preset === "week" ? "" : "bg-transparent col-span-2"
                        }
                      >
                        Неделя
                      </Button>
                    </ToggleGroupItem>
                    <ToggleGroupItem asChild value="month">
                      <Button
                        variant={preset === "month" ? "default" : "outline"}
                        onClick={() => {
                          setPreset("month");
                          setPopoverOpen(false);
                        }}
                        className={
                          preset === "month" ? "" : "bg-transparent col-span-2"
                        }
                      >
                        Месяц
                      </Button>
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Button
                    variant={preset === "custom" ? "default" : "outline"}
                    onClick={() => setPreset("custom")}
                    className={
                      preset === "custom" ? "" : "bg-transparent col-span-2"
                    }
                  >
                    Произвольный диапазон
                  </Button>
                </div>

                {preset === "custom" && (
                  <div className="p-5 pt-0 w-auto">
                    <Calendar
                      mode="range"
                      selected={{ from: range.from, to: range.to }}
                      onSelect={(r) => {
                        console.log(r);
                        if (
                          r?.from &&
                          r?.to &&
                          r.from.getTime() !== r.to.getTime()
                        ) {
                          setRange(r);
                          setPopoverOpen(false);
                        } else {
                          setRange({ from: r?.from });
                        }
                      }}
                      numberOfMonths={2}
                      captionLayout="dropdown"
                      style={
                        { "--rdp-cell-size": "34px" } as React.CSSProperties
                      }
                      className="p-3"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setRange({})}>
                        Сброс
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>

        <CardContent className="relative flex flex-col items-center justify-center pt-6 pb-7 text-white h-full -translate-y-20 pointer-events-none">
          {isFetching ? (
            <Skeleton className="h-12 w-24 rounded-md bg-white/30" />
          ) : isError ? (
            <div className="text-white/90 text-lg">—</div>
          ) : (
            <div className="text-5xl font-extrabold tracking-tight drop-shadow-sm">
              {fmt(value)}
            </div>
          )}

          <div className="mt-3 text-white/80 text-sm">
            {preset === "custom" && range.from && range.to
              ? `${range.from.toLocaleDateString()} — ${range.to.toLocaleDateString()}`
              : presetLabel(preset)}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
