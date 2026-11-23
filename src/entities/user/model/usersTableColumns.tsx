import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { tablePermissions } from "@/entities/role";
import { useDeleteUserMutation } from "@/entities/user";
import { t } from "@/shared/i18n";
import { Checkbox } from "@/shared/ui/checkbox";
import { TableRowActions } from "@/shared/ui/table-row-actions";
import type { User } from "./types";

const EDIT_ROUTE = "/faces/edit";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: () => <span>{t("Идентификатор")}</span>,
  },
  {
    accessorKey: "name",
    header: () => <span>{t("Имя")}</span>,
  },
  {
    accessorKey: "surname",
    header: () => <span>{t("Фамилия")}</span>,
  },
  {
    accessorKey: "cardId",
    header: () => <span>{t("Номер карты")}</span>,
  },
  {
    accessorKey: "gender",
    header: () => <span>{t("Пол")}</span>,
    cell: ({ row }) => {
      return (
        <p>{row.original.gender === "male" ? t("мужчина") : t("женщина")}</p>
      );
    },
  },
  {
    accessorKey: "birthDate",
    header: () => <span>{t("Дата рождения")}</span>,
    cell: ({ row }) => {
      return <p>{format(row.original.birthDate, "dd.MM.yyyy")}</p>;
    },
  },
  {
    accessorKey: "isActive",
    header: () => <span>{t("Активирован")}</span>,
    cell: ({ row }) => {
      return <Checkbox checked={row.original.isActive} disabled={true} />;
    },
  },
  {
    accessorKey: "facePhotoUrl",
    header: () => <span>{t("Фото")}</span>,
    cell: ({ row }) =>
      row.original.facePhotoUrl ? (
        <img
          src={row.original.facePhotoUrl}
          alt={row.original.name}
          className="h-16 w-16 rounded object-cover"
        />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [deleteUser, { isSuccess, isLoading }] = useDeleteUserMutation();

      function onConfirm() {
        deleteUser(row.original.id);
      }

      return (
        <TableRowActions
          editRouteTo={`${EDIT_ROUTE}/${row.original.id}`}
          onConfirm={onConfirm}
          isDeletedSuccessfully={isSuccess}
          isLoading={isLoading}
          permissions={tablePermissions.user}
          onDeny="hide"
        />
      );
    },
  },
];
