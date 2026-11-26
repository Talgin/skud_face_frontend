import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";
import { useCamerasQuery } from "@/entities/camera";
import {
  type Point,
  pointTableColumns,
  usePointsQuery,
} from "@/entities/point";
import { Can, useCan } from "@/entities/role";
import { t } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { TableSkeleton } from "@/shared/ui/table-skeleton";
import { DataTable } from "@/widgets/DataTable";
export function PointPage() {
  const navigate = useNavigate();
  const { data: points, isLoading } = usePointsQuery();
  const { canAny } = useCan();
  // only super admins may list cameras; others see the camera number
  const { data: cameras } = useCamerasQuery(undefined, {
    skip: !canAny("camera.view"),
  });

  function handleAddButtonClick() {
    navigate({ to: "/point/add" });
  }

  const mappedPointTableColumns = useMemo(() => {
    return pointTableColumns.map((column: ColumnDef<Point>) => {
      if (!("accessorKey" in column) || column.accessorKey !== "cameraId") {
        return column;
      }

      return {
        accessorKey: "cameraId",
        header: () => <span>{t("Камера")}</span>,
        cell: ({ row }) => {
          const camera = cameras?.find(
            (camera) => camera.id === row.original.cameraId,
          );

          return <p>{camera?.serialNumber ?? `№ ${row.original.cameraId}`}</p>;
        },
      };
    });
  }, [cameras]);

  return (
    <div className="container pt-16">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {points && (
            <DataTable columns={mappedPointTableColumns} data={points} />
          )}
          <div className="mt-4">
            {/* only for those who may add: the add page would send others to /403 */}{" "}
            <Can req={{ anyOf: ["point.create"] }}>
              {" "}
              <Button className="float-right" onClick={handleAddButtonClick}>
                <CirclePlus className="mr-2" /> {t("Добавить")}
              </Button>{" "}
            </Can>
          </div>
        </>
      )}
    </div>
  );
}
