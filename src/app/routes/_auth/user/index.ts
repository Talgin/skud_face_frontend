import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { UserPage } from "@/pages/user";

export const Route = createFileRoute("/_auth/user/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      });
    }
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "user.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: UserPage,
});
