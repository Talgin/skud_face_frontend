import { createLazyFileRoute } from "@tanstack/react-router";
import { EditUserPage } from "@/pages/edit-user";

export const Route = createLazyFileRoute("/_auth/faces/edit/$id")({
  component: EditUserPage,
});
