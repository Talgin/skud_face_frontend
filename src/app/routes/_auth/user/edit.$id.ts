import { createFileRoute, redirect } from "@tanstack/react-router";

// old URL, kept so bookmarks keep working - the section moved to /faces
export const Route = createFileRoute("/_auth/user/edit/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/faces/edit/$id",
      params: { id: params.id },
      replace: true,
    });
  },
});
