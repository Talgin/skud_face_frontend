import { format } from "date-fns";
import { type JournalEvent, journalImageUrl, lookOf } from "@/entities/journal";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { EvidenceImage } from "@/shared/ui/evidence-image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/ui/sheet";

type Props = {
  event: JournalEvent | null;
  cameraName: string;
  token: string | undefined;
  onClose: () => void;
};

export function EventDetail({ event, cameraName, token, onClose }: Props) {
  return (
    <Sheet open={event !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        {event && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span
                  className={cn("rounded px-2 py-0.5 text-xs font-medium", lookOf(event.type).badgeClass)}
                >
                  {event.type_label}
                </span>
                {event.title}
              </SheetTitle>
              <SheetDescription>
                {cameraName} · {format(new Date(event.ts), "dd.MM.yyyy HH:mm:ss")}
                {event.violation && <span className="ml-2 font-medium text-red-600">Нарушение</span>}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr]">
              <EvidenceImage
                url={event.has_crop ? journalImageUrl(event.id, "crop", token) : null}
                alt="crop"
                className="w-full min-h-40 max-h-80 object-contain rounded-lg border bg-muted"
              />
              <a
                href={event.has_frame ? journalImageUrl(event.id, "frame", token) : undefined}
                target="_blank"
                rel="noreferrer"
              >
                <EvidenceImage
                  url={event.has_frame ? journalImageUrl(event.id, "frame", token) : null}
                  alt="frame"
                  className="w-full min-h-40 max-h-80 object-contain rounded-lg border bg-muted"
                />
              </a>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {lookOf(event.type)
                .details(event)
                .map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd
                      className={cn(
                        "font-medium break-all",
                        f.tone === "bad" && "text-red-600",
                        f.tone === "good" && "text-green-700",
                        f.tone === "muted" && "text-muted-foreground",
                      )}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              <div>
                <dt className="text-xs text-muted-foreground">ID события</dt>
                <dd className="font-mono text-xs break-all">{event.id}</dd>
              </div>
            </dl>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
