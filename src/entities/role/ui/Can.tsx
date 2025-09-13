import { useRouteContext } from "@tanstack/react-router";
import { can } from "../model/helpers";
import { type AccessReq, Roles } from "../model/types";

type CanProps = {
  req: AccessReq;
  roles?: Roles[] | Roles;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Can({ req, roles, children, fallback = null }: CanProps) {
  const { auth } = useRouteContext({ from: "__root__" });

  return can(roles || auth.role || Roles.REGISTRAR, req) ? (
    <>{children}</>
  ) : (
    <>{fallback}</>
  );
}
