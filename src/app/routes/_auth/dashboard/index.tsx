import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { DashboardPage } from "@/pages/dashboard";

export const Route = createFileRoute("/_auth/dashboard/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "dashboard.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: DashboardPage,
});
