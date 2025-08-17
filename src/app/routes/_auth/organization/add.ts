import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddOrganizationPage } from "@/pages/add-organization";

export const Route = createFileRoute("/_auth/organization/add")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "org.create")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddOrganizationPage,
});
