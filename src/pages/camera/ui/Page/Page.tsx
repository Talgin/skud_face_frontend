import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";
import {
  type Camera,
  camerasTableColumns,
  useCamerasQuery,
} from "@/entities/camera";
import { usePointsQuery } from "@/entities/point";
import { Button } from "@/shared/ui/button";
import { TableSkeleton } from "@/shared/ui/table-skeleton";
import { DataTable } from "@/widgets/DataTable";

export function CamerasPage() {
  const navigate = useNavigate();
  const { data: cameras, isLoading } = useCamerasQuery();
  const { data: points } = usePointsQuery();

  function handleAddButtonClick() {
    navigate({ to: "/camera/add" });
  }

  const mappedCamerasTableColumns = useMemo(
    () =>
      camerasTableColumns.map((column: ColumnDef<Camera>) => {
        if (!("accessorKey" in column) || column.accessorKey !== "pointId") {
          return column;
        }

        return {
          accessorKey: "pointId",
          header: () => <span>Точка</span>,
          cell: ({ row }) => {
            const point = points?.find(
              (point) => point.id === row.original.pointId,
            );
            return (
              <div>
                {row.original.pointId === null || !point ? (
                  <p>Не указана</p>
                ) : (
                  point?.name
                )}
              </div>
            );
          },
        };
      }),
    [points],
  );

  return (
    <div className="container pt-16">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {cameras && (
            <DataTable columns={mappedCamerasTableColumns} data={cameras} />
          )}
          <div className="mt-4">
            <Button className="float-right" onClick={handleAddButtonClick}>
              <CirclePlus className="mr-2" /> Добавить
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
