import { describe, expect, it } from "vitest";
import type { AdminValues } from "../model/types";
import { buildAdminUpdateBody } from "./buildAdminUpdateBody";

const values: AdminValues = {
  name: "Admin",
  surname: "Admin",
  cardId: "ADMIN-0001",
  role: "super_admin",
  organizationId: 1,
  isActive: true,
  username: "",
  password: "",
};

describe("buildAdminUpdateBody", () => {
  it("sends the organization and active flag (they were dropped before)", () => {
    expect(buildAdminUpdateBody(values)).toEqual({
      name: "Admin",
      surname: "Admin",
      card_id: "ADMIN-0001",
      role: "super_admin",
      active: true,
      organization_id: 1,
    });
  });

  it("keeps credentials unchanged when left empty", () => {
    const body = buildAdminUpdateBody(values);
    expect(body).not.toHaveProperty("username");
    expect(body).not.toHaveProperty("password");
  });

  it("sends new credentials when typed in", () => {
    const body = buildAdminUpdateBody({ ...values, username: " new@skud.local ", password: "s3cret" });
    expect(body.username).toBe("new@skud.local");
    expect(body.password).toBe("s3cret");
  });

  it("ignores a whitespace-only username", () => {
    expect(buildAdminUpdateBody({ ...values, username: "   " })).not.toHaveProperty("username");
  });
});
