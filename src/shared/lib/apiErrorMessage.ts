import { t } from "@/shared/i18n";

/**
 * What to tell the user about a failed API call (an RTK Query `error`).
 * FastAPI answers {detail: "..."} or, for validation errors, {detail: [{msg, loc}, ...]}.
 */
export function apiErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error !== "object") return String(error);
  const e = error as {
    status?: unknown;
    data?: unknown;
    error?: unknown;
    message?: unknown;
  };

  const detail =
    e.data && typeof e.data === "object" && "detail" in e.data
      ? (e.data as { detail: unknown }).detail
      : e.data;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) =>
        typeof d === "string"
          ? d
          : d && typeof d === "object" && "msg" in d
            ? String((d as { msg: unknown }).msg)
            : null,
      )
      .filter(Boolean);
    if (parts.length) return parts.join("; ");
  }

  if (e.status === "FETCH_ERROR" || e.status === "TIMEOUT_ERROR") {
    return t("Сервер недоступен. Проверьте соединение и попробуйте ещё раз.");
  }
  if (e.status === 403) return t("Недостаточно прав для этого действия");
  if (typeof e.status === "number" && e.status >= 500) {
    return t("Ошибка на сервере ({status}). Попробуйте ещё раз.", {
      status: e.status,
    });
  }
  if (typeof e.error === "string") return e.error;
  if (typeof e.message === "string") return e.message;
  return t("Не удалось выполнить действие");
}
