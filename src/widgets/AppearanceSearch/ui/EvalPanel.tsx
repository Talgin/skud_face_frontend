import {
  evalTotals,
  precisionCell,
  REPORT_K,
  useGetEvalQueriesQuery,
  useLazyGetEvalReportQuery,
} from "@/entities/appearance-search";
import { t } from "@/shared/i18n";
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
          {isFetching ? t("Считаю…") : t("Отчёт p@{k}", { k: REPORT_K })}
        </Button>
      </div>
      {queries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {queries.slice(0, 20).map((q) => (
            <button
              key={q.query}
              type="button"
              className="text-primary hover:underline"
              title={`${t("{r} верно / {i} неверно", { r: q.relevant, i: q.irrelevant })}${q.by ? ` · ${q.by}` : ""}`}
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
            <b>{t("Средняя p@{k}", { k: report.k })}</b>{" "}
            {t("по {n} запросам — с разбором {a}, без разбора {b}", {
              n: report.queries,
              a: report.mean_p_at_k.parse ?? "–",
              b: report.mean_p_at_k.plain ?? "–",
            })}
          </div>
          <table className="text-xs">
            <thead>
              <tr className="text-left">
                <th className="pr-4">{t("запрос")}</th>
                <th className="pr-4">{t("верных известно")}</th>
                <th className="pr-4">{t("p@k с разбором")}</th>
                <th>{t("p@k без разбора")}</th>
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
