import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddBatchUsersPage } from "@/pages/add-batch-users";

export const Route = createFileRoute("/_auth/faces/import")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "user.batchCreate")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddBatchUsersPage,
});
