import { type AccessReq, type Permission, Roles } from "./types";

export const rolePermissions: Record<Roles, ReadonlyArray<Permission>> = {
  [Roles.SUPER_ADMIN]: [
    "monitoring.view",
    "monitoring-history.view",
    "monitoring-approve",
    "monitoring-reject",
    "dashboard.view",
    "org.view",
    "org.create",
    "org.update",
    "org.delete",
    "admin.view",
    "admin.create",
    "admin.update",
    "admin.delete",
    "user.view",
    "user.create",
    "user.batchCreate",
    "user.update",
    "user.delete",
    "point.view",
    "point.create",
    "point.update",
    "point.delete",
    "camera.view",
    "camera.create",
    "camera.update",
    "camera.delete",
  ],
  [Roles.ADMIN]: [
    "monitoring.view",
    "monitoring-history.view",
    "dashboard.view",
    "org.view",
    "admin.view",
    "user.view",
    "user.create",
    "user.batchCreate",
    "user.update",
    "user.delete",
    "point.view",
    "point.create",
    "point.update",
    "point.delete",
    "camera.view",
    "camera.create",
    "camera.update",
    "camera.delete",
  ],
  [Roles.OPERATOR]: [
    "monitoring.view",
    "monitoring-history.view",
    "dashboard.view",
    "monitoring-approve",
    "monitoring-reject",
    "point.view",
    "camera.view",
    "user.view",
  ],
  [Roles.REGISTRAR]: [
    "user.view",
    "user.create",
    "user.batchCreate",
    "user.delete",
  ],
};

type TablePermissions = Record<string, { edit: AccessReq; delete: AccessReq }>;

export const tablePermissions: TablePermissions = {
  admin: {
    edit: { anyOf: ["admin.update"] },
    delete: { anyOf: ["admin.delete"] },
  },
  user: {
    edit: { anyOf: ["user.update"] },
    delete: { anyOf: ["user.delete"] },
  },
  organization: {
    edit: { anyOf: ["org.update"] },
    delete: { anyOf: ["org.delete"] },
  },
  point: {
    edit: { anyOf: ["point.update"] },
    delete: { anyOf: ["point.delete"] },
  },
  camera: {
    edit: { anyOf: ["camera.update"] },
    delete: { anyOf: ["camera.delete"] },
  },
} as const;
