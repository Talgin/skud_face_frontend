import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AdminPage } from "@/pages/admin";

export const Route = createFileRoute("/_auth/admin/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "admin.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AdminPage,
});
