import { ScanFace } from "lucide-react";
import { tablePermissions } from "@/entities/role";
import { Card, CardContent } from "@/shared/ui/card";
import { TableRowActions } from "@/shared/ui/table-row-actions";
import { useDeleteUserMutation } from "../api/userApi";
import { personMeta } from "../lib/personCard";
import type { User } from "../model/types";

const EDIT_ROUTE = "/faces/edit";

export function PersonCard({ user }: { user: User }) {
  const [deleteUser, { isSuccess, isLoading }] = useDeleteUserMutation();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full bg-muted">
        {user.facePhotoUrl ? (
          <img
            src={user.facePhotoUrl}
            alt={`${user.name} ${user.surname}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
            <ScanFace className="h-12 w-12" />
            <span className="text-sm">
              Лицо не добавлено в базу — загрузите фото крупнее
            </span>
          </div>
        )}
      </div>
      <CardContent className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold" title={user.name}>
              {user.name}
            </p>
            <p className="truncate font-semibold" title={user.surname}>
              {user.surname}
            </p>
          </div>
          <TableRowActions
            editRouteTo={`${EDIT_ROUTE}/${user.id}`}
            onConfirm={() => deleteUser(user.id)}
            isDeletedSuccessfully={isSuccess}
            isLoading={isLoading}
            permissions={tablePermissions.user}
            onDeny="hide"
          />
        </div>
        <p className="text-sm text-muted-foreground">№ {user.cardId}</p>
        <p className="text-sm text-muted-foreground">{personMeta(user)}</p>
        <p className="flex items-center gap-1.5 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-600" : "bg-muted-foreground"}`}
          />
          {user.isActive ? "активен" : "неактивен"}
        </p>
      </CardContent>
    </Card>
  );
}
