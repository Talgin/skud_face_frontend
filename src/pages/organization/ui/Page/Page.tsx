import { useNavigate } from "@tanstack/react-router";
import { CirclePlus } from "lucide-react";
import {
  organizationTableColumns,
  useOrganizationsQuery,
} from "@/entities/organization";
import { Button } from "@/shared/ui/button";
import { TableSkeleton } from "@/shared/ui/table-skeleton";
import { DataTable } from "@/widgets/DataTable";

export function OrganizationPage() {
  const navigate = useNavigate();
  const { data: organizations, isLoading } = useOrganizationsQuery();

  function handleAddButtonClick() {
    navigate({ to: "/organization/add" });
  }

  return (
    <div className="container pt-16">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {organizations && (
            <DataTable
              columns={organizationTableColumns}
              data={organizations}
            />
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
