import type { EvalQuery, PrecisionCell } from "../types";

export const REPORT_K = 6;

export function precisionCell(cell: PrecisionCell): string {
  if (cell.p_at_k === null) return "–";
  const unjudged = cell.unjudged ? `, без оценки ${cell.unjudged}` : "";
  return `${cell.p_at_k.toFixed(2)} (${cell.hits}/${cell.judged}${unjudged})`;
}

export function evalTotals(queries: EvalQuery[]): string {
  const labels = queries.reduce((n, q) => n + q.relevant + q.irrelevant, 0);
  return `${queries.length} запросов · ${labels} оценок`;
}

// Clicking the active verdict again removes the label (null).
export function nextLabel(
  current: boolean | undefined,
  clicked: boolean,
): boolean | null {
  return current === clicked ? null : clicked;
}
