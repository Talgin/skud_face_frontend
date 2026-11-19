import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AnalyticsJournalPage } from "@/pages/analytics-journal";

export const Route = createFileRoute("/_auth/monitoring/journal")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "monitoring.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AnalyticsJournalPage,
});
