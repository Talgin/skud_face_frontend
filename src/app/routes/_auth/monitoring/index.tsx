import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny, Roles } from "@/entities/role";
import { MonitoringPage } from "@/pages/monitoring/monitoring-list";

export const Route = createFileRoute("/_auth/monitoring/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "monitoring.view")) {
      if (role === Roles.REGISTRAR) {
        throw redirect({ to: "/user" });
      }
      throw redirect({ to: "/403" });
    }
  },
  component: MonitoringPage,
});
