import { t } from "@/shared/i18n";
import type { EvalQuery, PrecisionCell } from "../types";
export const REPORT_K = 6;

export function precisionCell(cell: PrecisionCell): string {
  if (cell.p_at_k === null) return "–";
  const unjudged = cell.unjudged
    ? t(", без оценки {n}", { n: cell.unjudged })
    : "";
  return `${cell.p_at_k.toFixed(2)} (${cell.hits}/${cell.judged}${unjudged})`;
}

export function evalTotals(queries: EvalQuery[]): string {
  const labels = queries.reduce((n, q) => n + q.relevant + q.irrelevant, 0);
  return t("{q} запросов · {l} оценок", { q: queries.length, l: labels });
}

// Clicking the active verdict again removes the label (null).
export function nextLabel(
  current: boolean | undefined,
  clicked: boolean,
): boolean | null {
  return current === clicked ? null : clicked;
}
