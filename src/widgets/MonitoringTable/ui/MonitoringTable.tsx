import { useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { useLiveStatus } from "@/entities/monitoring";
import type { MonitoringEventRaw } from "@/entities/monitoring/types";
import { useCan } from "@/entities/role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getMonitoringColumns } from "./columns";

interface MonitoringTableProps {
  events: MonitoringEventRaw[];
  isLoading?: boolean;
}

export function MonitoringTable({ events, isLoading }: MonitoringTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const navigate = useNavigate();
  const liveStatus = useLiveStatus();

  const { can } = useCan();

  const columns = getMonitoringColumns(
    can({ anyOf: ["monitoring-approve", "monitoring-reject"] }),
  );

  const table = useReactTable({
    data: events,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 ml-4 flex items-center gap-3">
        Мониторинг
        <span className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${
              liveStatus === "online"
                ? "bg-green-600"
                : liveStatus === "reconnecting"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-muted-foreground"
            }`}
          />
          {liveStatus === "online"
            ? "онлайн"
            : liveStatus === "reconnecting"
              ? "переподключение…"
              : "подключение…"}
        </span>
      </h2>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Поиск..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border p-1 rounded text-sm"
        />
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
                const ev = row.original as MonitoringEventRaw;
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate({
                        to: "/monitoring/$id",
                        params: { id: ev.event_id },
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate({
                          to: "/monitoring/$id",
                          params: { id: ev.event_id },
                        });
                      }
                    }}
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
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  {isLoading ? "Загрузка..." : "Нет данных"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
