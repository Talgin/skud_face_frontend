import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function extractDetail(err: FetchBaseQueryError): string | undefined {
  const { data } = err;

  if (typeof data === "string") return data;

  if (data && typeof data === "object" && "detail" in data) {
    // biome-ignore lint/suspicious/noExplicitAny: false positive
    const detail = (data as any).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.every((x) => typeof x === "string")) {
      return detail.join(", ");
    }
  }

  return undefined;
}
