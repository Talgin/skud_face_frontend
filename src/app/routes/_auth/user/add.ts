import { createFileRoute, redirect } from "@tanstack/react-router";

// old URL, kept so bookmarks keep working - the section moved to /faces
export const Route = createFileRoute("/_auth/user/add")({
  beforeLoad: () => {
    throw redirect({ to: "/faces/add", replace: true });
  },
});
