import type { Roles } from "@/entities/role";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    role?: Roles;
  };
}
