import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import * as React from "react";
import type { RouterContext } from "@/shared/types";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
