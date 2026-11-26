import { describe, expect, it } from "vitest";
import { rolePermissions } from "./mapRoles";
import { type Permission, Roles } from "./types";

// Contract with the SKUD backend (skud_face_backend src/api/v1/endpoints, check_super_admin /
// check_admins): a permission may only be granted to roles the backend accepts for the calls behind
// it - otherwise the page opens and every request answers 403. Update together with the backend.
const ALL = [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.OPERATOR, Roles.REGISTRAR];
const ADMINS = [Roles.SUPER_ADMIN, Roles.ADMIN];
const SUPER = [Roles.SUPER_ADMIN];

const BACKEND_ALLOWS: Partial<Record<Permission, Roles[]>> = {
  "org.view": SUPER, // GET /organization
  "org.create": SUPER,
  "org.update": SUPER,
  "org.delete": SUPER,
  "admin.view": ADMINS, // GET /employee
  "admin.create": ADMINS,
  "admin.update": ADMINS,
  "admin.delete": ADMINS,
  "point.view": ADMINS, // GET /point
  "point.create": ADMINS,
  "point.update": ADMINS,
  "point.delete": ADMINS,
  "camera.view": ADMINS, // GET /camera (admins: their organization's cameras)
  "camera.create": SUPER,
  "camera.update": SUPER,
  "camera.delete": SUPER,
  "user.view": ALL, // /student: any logged-in user
  "user.create": ALL,
  "user.batchCreate": ALL,
  "user.update": ALL,
  "user.delete": ALL,
};

describe("role permissions match what the backend allows", () => {
  for (const role of ALL) {
    it(`${role} gets no page the backend refuses`, () => {
      const refused = rolePermissions[role].filter((p) => {
        const allowed = BACKEND_ALLOWS[p];
        return allowed !== undefined && !allowed.includes(role);
      });
      expect(refused).toEqual([]);
    });
  }

  it("super admin can do everything the backend offers", () => {
    for (const p of Object.keys(BACKEND_ALLOWS) as Permission[]) {
      expect(rolePermissions[Roles.SUPER_ADMIN]).toContain(p);
    }
  });
});
