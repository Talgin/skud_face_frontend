export enum Roles {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  OPERATOR = "operator",
  REGISTRAR = "registrar",
}

export type Permission =
  | "monitoring.view"
  | "monitoring-history.view"
  | "monitoring-approve"
  | "monitoring-reject"
  | "org.view"
  | "org.create"
  | "org.update"
  | "org.delete"
  | "admin.view"
  | "admin.create"
  | "admin.update"
  | "admin.delete"
  | "user.view"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.batchCreate"
  | "point.view"
  | "point.create"
  | "point.update"
  | "point.delete"
  | "camera.view"
  | "camera.create"
  | "camera.update"
  | "camera.delete";

export type AccessReq = { anyOf: Permission[] } | { allOf: Permission[] };
