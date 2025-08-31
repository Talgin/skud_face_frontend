import { createLazyFileRoute } from "@tanstack/react-router";
import { MonitoringPage } from "@/pages/monitoring/monitoring-list";

export const Route = createLazyFileRoute("/_auth/monitoring/")({
  component: MonitoringPage,
});
