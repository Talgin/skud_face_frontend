// Cosine similarity to an enrolled person (0..1), as sent by trt-processor.
// null/undefined means the face did not match anyone in the face database.
export const SIMILARITY_HIGH = 0.6;
export const SIMILARITY_MEDIUM = 0.45;

export interface FormattedSimilarity {
  text: string;
  className: string;
}

export function formatSimilarity(value?: number | null): FormattedSimilarity {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return { text: "—", className: "text-muted-foreground" };
  }

  const clamped = Math.max(0, Math.min(1, value));
  const text = `${(clamped * 100).toFixed(1)}%`;
  const className =
    clamped >= SIMILARITY_HIGH
      ? "text-green-600"
      : clamped >= SIMILARITY_MEDIUM
        ? "text-yellow-600"
        : "text-red-600";

  return { text, className };
}
