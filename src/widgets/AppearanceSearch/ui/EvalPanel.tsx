import {
  evalTotals,
  precisionCell,
  REPORT_K,
  useGetEvalQueriesQuery,
  useLazyGetEvalReportQuery,
} from "@/entities/appearance-search";
import { Button } from "@/shared/ui/button";

// Eval set: labelled queries and precision@k with query parsing on/off.
export function EvalPanel({ onPick }: { onPick: (query: string) => void }) {
  const { data: queries = [] } = useGetEvalQueriesQuery();
  const [loadReport, { data: report, isFetching }] =
    useLazyGetEvalReportQuery();

  return (
    <div className="rounded-md border p-3 space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted-foreground">{evalTotals(queries)}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => loadReport(REPORT_K)}
          disabled={isFetching}
        >
          {isFetching ? "Считаю…" : `Отчёт p@${REPORT_K}`}
        </Button>
      </div>
      {queries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {queries.slice(0, 20).map((q) => (
            <button
              key={q.query}
              type="button"
              className="text-primary hover:underline"
              title={`${q.relevant} верно / ${q.irrelevant} неверно${q.by ? ` · ${q.by}` : ""}`}
              onClick={() => onPick(q.query)}
            >
              {q.query}
            </button>
          ))}
        </div>
      )}
      {report && (
        <div className="overflow-auto">
          <div className="mb-1">
            <b>Средняя p@{report.k}</b> по {report.queries} запросам — с
            разбором {report.mean_p_at_k.parse ?? "–"}, без разбора{" "}
            {report.mean_p_at_k.plain ?? "–"}
          </div>
          <table className="text-xs">
            <thead>
              <tr className="text-left">
                <th className="pr-4">запрос</th>
                <th className="pr-4">верных известно</th>
                <th className="pr-4">p@k с разбором</th>
                <th>p@k без разбора</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((r) => (
                <tr key={r.query} className="border-t">
                  <td className="pr-4">{r.query}</td>
                  <td className="pr-4">{r.relevant_total}</td>
                  <td className="pr-4">{precisionCell(r.parse)}</td>
                  <td>{precisionCell(r.plain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
