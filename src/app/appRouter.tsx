import {
  createRouter,
  RouterProvider as TanstackRouterProvider,
} from "@tanstack/react-router";
import type React from "react";
import { useRoleQuery } from "@/entities/role";
import { selectIsAuthenticated } from "@/entities/session";
import { routeTree } from "@/routeTree.gen";
import { useAppSelector } from "@/shared/model";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: {
      isAuthenticated: false,
      role: undefined,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function appRouter() {
  return router;
}

export const RouterProvider: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector((state) => state.session.accessToken);
  const { data, isLoading } = useRoleQuery(undefined, {
    skip: !accessToken,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TanstackRouterProvider
      router={appRouter()}
      context={{
        auth: { isAuthenticated, role: data?.role },
      }}
    />
  );
};
