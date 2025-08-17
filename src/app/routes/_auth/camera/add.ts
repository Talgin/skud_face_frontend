import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { AddCameraPage } from "@/pages/add-camera";

export const Route = createFileRoute("/_auth/camera/add")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "camera.create")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AddCameraPage,
});
