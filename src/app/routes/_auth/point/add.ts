import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddPointPage } from "@/pages/add-point";

export const Route = createFileRoute("/_auth/point/add")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "point.create")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddPointPage,
});
