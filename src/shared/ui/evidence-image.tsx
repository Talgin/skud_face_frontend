import { ImageOff } from "lucide-react";
import { useState } from "react";
import { t } from "@/shared/i18n";
import { mediaUrl } from "@/shared/lib";
import { cn } from "@/shared/lib/shadcn-ui/utils";
// Event images live in MinIO only for a while (frames 2 days, crops 7 days; the events themselves are
// deleted with their crop). An expired or missing image shows this placeholder instead of a broken image.
export function EvidenceImage({
  url,
  alt,
  className,
}: {
  url: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const src = mediaUrl(url);
  const [failed, setFailed] = useState<string | null>(null);

  if (!src || failed === src) {
    return (
      <div
        role="img"
        aria-label={`${alt}: ${t("удалено")}`}
        title={t("Изображение удалено по сроку хранения")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground text-xs text-center",
          className,
        )}
      >
        <ImageOff className="h-5 w-5" />
        <span>{t("Кадр удалён")}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(src)}
    />
  );
}
