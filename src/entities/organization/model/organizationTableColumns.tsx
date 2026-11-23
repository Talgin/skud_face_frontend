import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteOrganizationMutation } from "@/entities/organization";
import { tablePermissions } from "@/entities/role";
import { t } from "@/shared/i18n";
import { TableRowActions } from "@/shared/ui/table-row-actions";
import type { Organization } from "./types";

const EDIT_ROUTE = "/organization/edit";

export const organizationTableColumns: ColumnDef<Organization>[] = [
  {
    accessorKey: "id",
    header: () => <span>{t("Идентификатор")}</span>,
  },
  {
    accessorKey: "organizationName",
    header: () => <span>{t("Название организации")}</span>,
  },
  {
    accessorKey: "ceoName",
    header: () => <span>{t("Имя руководителя")}</span>,
  },
  {
    accessorKey: "address",
    header: () => <span>{t("Адрес")}</span>,
  },

  {
    accessorKey: "phoneNumber",
    header: () => <span>{t("Номер телефона")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [deleteOrganization, { isSuccess, isLoading }] =
        useDeleteOrganizationMutation();

      function onConfirm() {
        deleteOrganization(row.original.id);
      }

      return (
        <TableRowActions
          editRouteTo={`${EDIT_ROUTE}/${row.original.id}`}
          onConfirm={onConfirm}
          isDeletedSuccessfully={isSuccess}
          isLoading={isLoading}
          permissions={tablePermissions.organization}
          onDeny="hide"
        />
      );
    },
  },
];
