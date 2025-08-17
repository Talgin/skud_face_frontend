import { rolePermissions } from "./mapRoles";
import type { AccessReq, Permission, Roles } from "./types";

export function getUserPermissions(roles: Roles[] | Roles): Set<Permission> {
  const arr = Array.isArray(roles) ? roles : [roles];
  return new Set(arr.flatMap((r) => rolePermissions[r] ?? []));
}

export function can(roles: Roles[] | Roles, req?: AccessReq): boolean {
  const perms = getUserPermissions(roles);
  if (!req) return true;
  if ("anyOf" in req) return req.anyOf.some((p) => perms.has(p));
  return req.allOf.every((p) => perms.has(p));
}

export const canAny = (roles: Roles[] | Roles, ...ps: Permission[]) =>
  can(roles, { anyOf: ps });

export const canAll = (roles: Roles[] | Roles, ...ps: Permission[]) =>
  can(roles, { allOf: ps });
