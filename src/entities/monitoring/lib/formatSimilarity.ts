// Cosine similarity (0..1) to the closest person in «База лиц», as sent by trt-processor.
// It is present for every face once anyone is enrolled; `isKnown` says whether it counts as a match.
// null/undefined means nobody is enrolled (or there was no face embedding).

export interface FormattedSimilarity {
  text: string;
  className: string;
}

export function formatSimilarity(
  value?: number | null,
  isKnown?: boolean | null,
): FormattedSimilarity {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return { text: "—", className: "text-muted-foreground" };
  }

  const clamped = Math.max(0, Math.min(1, value));
  const text = `${Math.round(clamped * 100)}%`;
  // recognized faces stand out; for the rest it is only the distance to the nearest enrolled person
  const className = isKnown ? "font-semibold text-green-600" : "text-muted-foreground";

  return { text, className };
}
