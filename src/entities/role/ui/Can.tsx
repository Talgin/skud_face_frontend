import { can } from "../model/helpers";
import type { AccessReq, Roles } from "../model/types";

type CanProps = {
  req: AccessReq;
  roles: Roles[] | Roles;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Can({ req, roles, children, fallback = null }: CanProps) {
  return can(roles, req) ? { children } : { fallback };
}
