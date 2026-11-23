import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { canAny } from "@/entities/role";
import { ChatPage } from "@/pages/chat";

export const Route = createFileRoute("/_auth/chat/")({
  validateSearch: z.object({
    c: z.string().optional().catch(undefined),
  }),
  beforeLoad: ({ context }) => {
    const role = context.auth.role;
    if (!role) return null;
    if (!canAny(role, "chat.use")) {
      throw redirect({ to: "/403" });
    }
  },
  component: ChatPage,
});
