import {
  attributesSummary,
  formatScore,
  hitPerson,
  openImageUrl,
  type SearchHit,
  scoreBreakdown,
  searchImageUrl,
} from "@/entities/appearance-search";
import { cn } from "@/shared/lib/shadcn-ui/utils";

const EXPIRED_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' fill='%236b7280' font-size='16' text-anchor='middle'>нет изображения</text></svg>";

type Props = {
  hit: SearchHit;
  cameraName: string;
  label?: boolean; // eval verdict for this hit
  evalMode: boolean;
  onLabel: (relevant: boolean) => void;
};

export function HitCard({ hit, cameraName, label, evalMode, onLabel }: Props) {
  const person = hitPerson(hit);
  const attrs = attributesSummary(hit.attributes);
  const frameKept = hit.frame_available !== false;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden flex flex-col",
        hit.below_floor && "opacity-55",
        label === true && "ring-2 ring-green-600",
        label === false && "ring-2 ring-red-600 opacity-60",
      )}
    >
      <a href={openImageUrl(hit)} target="_blank" rel="noreferrer">
        <img
          loading="lazy"
          src={searchImageUrl(hit.id, "thumb")}
          alt={person.label}
          className="w-full aspect-[3/4] object-cover bg-black"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = EXPIRED_IMG;
          }}
        />
      </a>
      <div className="p-2 text-xs text-muted-foreground space-y-1">
        <div>
          <span
            className="font-semibold text-foreground"
            title={scoreBreakdown(hit)}
          >
            {formatScore(hit.score)}
          </span>
          {" · "}
          {cameraName}
        </div>
        <div>{hit.when ?? "?"}</div>
        <div
          className={cn(
            person.known && "font-medium text-green-700",
            !person.known && "text-muted-foreground",
          )}
          title={
            hit.recognition?.nearest_person_id
              ? `ближайший в базе: ${hit.recognition.nearest_person_id}`
              : undefined
          }
        >
          {person.label}
        </div>
        {attrs && (
          <div title={(hit.attribute_notes ?? []).join(", ")}>{attrs}</div>
        )}
        <div className="flex gap-2 flex-wrap">
          {frameKept ? (
            <a
              className="text-primary hover:underline"
              href={searchImageUrl(hit.id, "annotated")}
              target="_blank"
              rel="noreferrer"
            >
              кадр с зонами
            </a>
          ) : (
            <span>кадр удалён</span>
          )}
          {hit.vms_url && (
            <a
              className="text-primary hover:underline"
              href={hit.vms_url}
              target="_blank"
              rel="noreferrer"
            >
              открыть в VMS
            </a>
          )}
        </div>
      </div>
      {evalMode && (
        <div className="flex gap-1 px-2 pb-2 mt-auto">
          <button
            type="button"
            onClick={() => onLabel(true)}
            className={cn(
              "flex-1 rounded border py-1 text-xs",
              label === true && "bg-green-600 text-white border-green-600",
            )}
          >
            ✓ верно
          </button>
          <button
            type="button"
            onClick={() => onLabel(false)}
            className={cn(
              "flex-1 rounded border py-1 text-xs",
              label === false && "bg-red-600 text-white border-red-600",
            )}
          >
            ✗ неверно
          </button>
        </div>
      )}
    </div>
  );
}
