import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddUserPage } from "@/pages/add-user";

export const Route = createFileRoute("/_auth/user/add")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "user.create")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddUserPage,
});
