import { ArrowUp, Film, Loader2, Paperclip, Square, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { t } from "@/shared/i18n";
import { cn } from "@/shared/lib/shadcn-ui/utils";
export type PendingFile = {
  key: string;
  file: File;
  preview?: string;
  progress: number;
  attachmentId?: string;
  error?: string;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  files: PendingFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (key: string) => void;
  onSend: () => void;
  onStop: () => void;
  streaming: boolean;
  disabled?: boolean;
};

export const ACCEPT = "image/*,video/*,.mkv,.ts,.avi,.mov,.flv";

export function Composer({
  value,
  onChange,
  files,
  onAddFiles,
  onRemoveFile,
  onSend,
  onStop,
  streaming,
  disabled,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploading = files.some((f) => !f.attachmentId && !f.error);
  const canSend =
    !streaming &&
    !uploading &&
    !disabled &&
    (value.trim().length > 0 || files.some((f) => f.attachmentId));

  // grow with the text up to ~8 lines
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure on text change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  useEffect(() => {
    if (!streaming) ref.current?.focus();
  }, [streaming]);

  return (
    <div className="rounded-2xl border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pt-3">
          {files.map((f) => (
            <div
              key={f.key}
              className={cn(
                "relative flex items-center gap-2 rounded-lg border bg-muted/50 pr-7 text-xs",
                f.error && "border-destructive",
              )}
              title={f.error ?? f.file.name}
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-12 w-12 rounded-l-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-l-lg bg-muted">
                  <Film className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="max-w-[160px]">
                <div className="truncate">{f.file.name}</div>
                <div
                  className={cn(
                    "text-muted-foreground",
                    f.error && "text-destructive",
                  )}
                >
                  {f.error
                    ? f.error
                    : f.attachmentId
                      ? t("{n} МБ", { n: (f.file.size / 1048576).toFixed(1) })
                      : t("загрузка {p}%", { p: Math.round(f.progress * 100) })}
                </div>
              </div>
              {!f.attachmentId && !f.error && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              <button
                type="button"
                onClick={() => onRemoveFile(f.key)}
                className="absolute right-1 top-1 rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label={t("Убрать файл")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2 p-2">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mb-0.5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
          disabled={streaming || disabled}
          aria-label={t("Прикрепить фото или видео")}
          title={t("Прикрепить фото или видео")}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            onAddFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder={t(
            "Спросите что-нибудь: «найди мужчину в красной куртке вчера вечером»",
          )}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
          onPaste={(e) => {
            const pasted = Array.from(e.clipboardData.files);
            if (pasted.length) {
              e.preventDefault();
              onAddFiles(pasted);
            }
          }}
          className="flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="mb-0.5 rounded-full bg-foreground p-2 text-background hover:opacity-90"
            aria-label={t("Остановить")}
            title={t("Остановить")}
          >
            <Square className="h-4 w-4" fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="mb-0.5 rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90 disabled:opacity-30"
            aria-label={t("Отправить")}
            title={t("Отправить (Enter)")}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
