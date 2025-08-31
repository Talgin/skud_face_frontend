import { createFileRoute } from "@tanstack/react-router";
import { MonitoringDetails } from "@/pages/monitoring/monitoring-detail";

export const Route = createFileRoute("/_auth/monitoring/$id")({
  // beforeLoad: ({ context }) => {
  //   const role = context.auth.role;
  //   if (!role) return null;
  //   if (!canAny(role, "")) {
  //     throw redirect({ to: "/403" });
  //   }
  // },
  component: MonitoringDetails,
});
