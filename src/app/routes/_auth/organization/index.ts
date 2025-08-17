import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { OrganizationPage } from "@/pages/organization";

export const Route = createFileRoute("/_auth/organization/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "org.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: OrganizationPage,
});
