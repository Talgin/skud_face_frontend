import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddAdminPage } from "@/pages/add-admin";

export const Route = createFileRoute("/_auth/admin/add")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "admin.create")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddAdminPage,
});
