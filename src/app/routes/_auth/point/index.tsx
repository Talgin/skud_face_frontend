import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { PointPage } from "@/pages/point";

export const Route = createFileRoute("/_auth/point/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "point.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: PointPage,
});
