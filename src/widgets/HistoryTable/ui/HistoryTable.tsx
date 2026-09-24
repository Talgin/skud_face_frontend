import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  buildHistoryQuery,
  type HistoryFilters,
  useGetHistoryQuery,
} from "@/entities/monitoring";
import { Button } from "@/shared/ui/button";
import { DateFilter } from "@/shared/ui/date-filter";
import { Slider } from "@/shared/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { DataTablePagination } from "@/widgets/DataTable/ui/DataTablePagination";
import { historyColumns } from "./columns";

export function HistoryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [minSimValue, setMinSimValue] = useState<number>(0);

  const { data, isFetching } = useGetHistoryQuery(
    buildHistoryQuery(filters, pagination.pageIndex + 1, pagination.pageSize),
  );

  function resetFilters() {
    setMinSimValue(0);
    setFilters({});
  }
  const hasFilters =
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.gender ||
    minSimValue > 0;

  const table = useReactTable({
    data: data?.records || [],
    columns: historyColumns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: data?.total_pages || 0,
    onPaginationChange: setPagination,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, minSimilarity: minSimValue }));
    }, 400);
    return () => clearTimeout(t);
  }, [minSimValue]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 ml-4">История мониторинга</h2>

      <div className="mb-2">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground mb-1"
              htmlFor="start_date"
            >
              Начало
            </label>
            <DateFilter
              value={filters.startDate}
              onChange={(d) => setFilters((f) => ({ ...f, startDate: d }))}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground mb-1"
              htmlFor="end_date"
            >
              Конец
            </label>
            <DateFilter
              value={filters.endDate}
              onChange={(d) => setFilters((f) => ({ ...f, endDate: d }))}
            />
          </div>

          <div className="flex flex-col w-[260px]">
            <label
              className="text-xs text-muted-foreground mb-1"
              htmlFor="min_similarity"
            >
              Мин. сходство:{" "}
              <span className="font-medium">
                {minSimValue > 0
                  ? `${(minSimValue * 100).toFixed(0)}% (только узнанные)`
                  : "не задано"}
              </span>
            </label>
            <Slider
              id="min_similarity"
              value={[minSimValue]}
              onValueChange={([v]) => setMinSimValue(v)}
              min={0}
              max={1}
              step={0.01}
              className="mt-2"
              aria-label="Минимальная похожесть"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground mb-1"
              htmlFor="gender"
            >
              Пол
            </label>
            <select
              id="gender"
              value={filters.gender ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, gender: e.target.value }))
              }
              className="border rounded p-1 text-sm"
            >
              <option value="">Все</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          {hasFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Сбросить
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {isFetching ? "Загрузка…" : `Найдено: ${data?.total_records ?? 0}`}
          </span>
        </div>
      </div>

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.columnDef.header &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        {header.column.getCanSort() && (
                          <span className="ml-2 text-muted-foreground">
                            {header.column.getIsSorted() === "asc"
                              ? "▲"
                              : header.column.getIsSorted() === "desc"
                                ? "▼"
                                : "⇵"}
                          </span>
                        )}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={historyColumns.length}
                  className="text-center h-24"
                >
                  {isFetching ? "Загрузка..." : "Нет данных"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
