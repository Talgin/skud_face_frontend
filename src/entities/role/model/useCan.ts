import { useRouteContext } from "@tanstack/react-router";
import { can } from "./helpers";
import type { AccessReq, Permission } from "./types";

export function useCan() {
  const { auth } = useRouteContext({ from: "__root__" });
  const role = auth.role;
  if (!role) {
    throw new Error("No role found");
  }
  return {
    can: (req?: AccessReq) => (req ? can(role, req) : true),
    canAny: (...ps: Permission[]) => can(role, { anyOf: ps }),
    canAll: (...ps: Permission[]) => can(role, { allOf: ps }),
  };
}
