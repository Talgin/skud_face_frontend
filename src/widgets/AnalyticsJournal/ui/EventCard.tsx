import { format } from "date-fns";
import { type JournalEvent, journalImageUrl, lookOf } from "@/entities/journal";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { EvidenceImage } from "@/shared/ui/evidence-image";

type Props = {
  event: JournalEvent;
  cameraName: string;
  token: string | undefined;
  fresh?: boolean; // arrived through the live feed
  onOpen: () => void;
};

export function EventCard({ event, cameraName, token, fresh, onOpen }: Props) {
  const look = lookOf(event.type);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "rounded-lg border bg-card overflow-hidden flex flex-col text-left transition-shadow hover:shadow-md",
        event.violation && "border-red-500",
        fresh && "ring-2 ring-primary/60",
      )}
    >
      <div className="relative">
        <EvidenceImage
          url={event.has_crop ? journalImageUrl(event.id, "crop", token) : null}
          alt={event.title}
          className="w-full aspect-[4/3] object-cover bg-muted"
        />
        <span
          className={cn(
            "absolute left-2 top-2 rounded px-2 py-0.5 text-[11px] font-medium",
            look.badgeClass,
          )}
        >
          {look.badge}
        </span>
        {event.violation && (
          <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
            {t("Нарушение")}
          </span>
        )}
      </div>
      <div className="p-2 space-y-1 text-xs">
        <div className="truncate text-sm font-medium" title={event.title}>
          {event.title}
        </div>
        {look.fields(event).map((f) => (
          <div key={f.label} className="flex justify-between gap-2">
            <span className="text-muted-foreground">{f.label}</span>
            <span
              className={cn(
                "truncate",
                f.tone === "bad" && "font-medium text-red-600",
                f.tone === "good" && "text-green-700",
                f.tone === "muted" && "text-muted-foreground",
              )}
            >
              {f.value}
            </span>
          </div>
        ))}
        <div className="flex justify-between gap-2 text-muted-foreground">
          <span className="truncate" title={cameraName}>
            {cameraName}
          </span>
          <span>{format(new Date(event.ts), "dd.MM HH:mm:ss")}</span>
        </div>
      </div>
    </button>
  );
}
