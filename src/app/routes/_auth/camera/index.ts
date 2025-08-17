import { createFileRoute, redirect } from "@tanstack/react-router";
import { canAny } from "@/entities/role";
import { CamerasPage } from "@/pages/camera";

export const Route = createFileRoute("/_auth/camera/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "camera.view")) {
      throw redirect({ to: "/403" });
    }
  },
  component: CamerasPage,
});
