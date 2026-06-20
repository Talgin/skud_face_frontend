import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import {
  useActivateCameraMutation,
  useDeactivateCameraMutation,
  useDeleteCameraMutation,
} from "@/entities/camera";
import { tablePermissions } from "@/entities/role";
import { Button } from "@/shared/ui/button";
import { TableRowActions } from "@/shared/ui/table-row-actions";
import type { Camera } from "./types";

const EDIT_ROUTE = "/camera/edit";

export const camerasTableColumns: ColumnDef<Camera>[] = [
  {
    accessorKey: "id",
    header: () => <span>Идентификатор</span>,
  },
  {
    accessorKey: "serialNumber",
    header: () => <span>Серийный номер</span>,
  },
  {
    accessorKey: "brandName",
    header: () => <span>Название бренда</span>,
  },
  {
    accessorKey: "modelName",
    header: () => <span>Название модели</span>,
  },
  {
    accessorKey: "registrationDate",
    header: () => <span>Дата регистрации</span>,
    cell: ({ row }) => {
      return (
        <p>
          {new Date(row.original.registrationDate).toLocaleDateString("ru-RU")}
        </p>
      );
    },
  },
  {
    accessorKey: "isActivated",
    header: () => <span>Статус</span>,
    cell: ({ row }) => {
      const [activate, { isLoading: activating }] = useActivateCameraMutation();
      const [deactivate, { isLoading: deactivating }] =
        useDeactivateCameraMutation();
      const isLoading = activating || deactivating;
      const isActive = row.original.isActivated;

      function handleToggle() {
        if (isActive) {
          deactivate(row.original.id);
        } else {
          activate(row.original.id);
        }
      }

      return (
        <Button
          size="sm"
          variant={isActive ? "destructive" : "default"}
          disabled={isLoading}
          onClick={handleToggle}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isActive ? (
            "Остановить"
          ) : (
            "Запустить"
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "pointId",
    header: () => <span>ИД точки</span>,
    cell: ({ row }) => {
      return (
        <div>
          {row.original.pointId === null ? (
            <p>Не указано</p>
          ) : (
            row.original.pointId
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: () => <span>Ссылка</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [deleteCamera, { isSuccess, isLoading }] =
        useDeleteCameraMutation();

      function onConfirm() {
        deleteCamera(row.original.id);
      }

      return (
        <TableRowActions
          editRouteTo={`${EDIT_ROUTE}/${row.original.id}`}
          onConfirm={onConfirm}
          isDeletedSuccessfully={isSuccess}
          isLoading={isLoading}
          permissions={tablePermissions.camera}
          onDeny="disable"
        />
      );
    },
  },
];
