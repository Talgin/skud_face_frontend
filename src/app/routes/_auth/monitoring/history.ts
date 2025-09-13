import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { MonitoringHistoryPage } from "@/pages/monitoring-history";

export const Route = createFileRoute("/_auth/monitoring/history")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "monitoring-history.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: MonitoringHistoryPage,
});
