import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AppearanceSearchPage } from "@/pages/appearance-search";

export const Route = createFileRoute("/_auth/monitoring/search")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "search.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AppearanceSearchPage,
});
