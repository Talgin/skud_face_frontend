export interface ReviewFields {
  review_status?: string | null;
  reviewed_by?: string | null;
}

// «Проверка» column: operator's verdict on what the system decided
export function formatReview(event: ReviewFields): { text: string; className: string } {
  const by = event.reviewed_by ? ` · ${event.reviewed_by}` : "";
  if (event.review_status === "confirmed") {
    return { text: `✓ Подтверждено${by}`, className: "text-green-600" };
  }
  if (event.review_status === "rejected") {
    return { text: `✗ Отклонено${by}`, className: "text-red-600" };
  }
  return { text: "—", className: "text-muted-foreground" };
}

export function isReviewed(event: ReviewFields): boolean {
  return event.review_status === "confirmed" || event.review_status === "rejected";
}
