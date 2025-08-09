// TODO: Пофиксить
// @ts-ignore
import { createLazyFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { LoginPage } from "@/pages/login";

const fallback = "/monitoring" as const;

export const Route = createLazyFileRoute("/")({
  // TODO: Пофиксить
  // @ts-ignore
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: LoginPage,
  // TODO: Пофиксить
  // @ts-ignore
  beforeLoad: async ({ search, context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
});
