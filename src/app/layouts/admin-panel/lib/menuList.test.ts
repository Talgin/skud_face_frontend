import { describe, expect, it } from "vitest";
import { Roles } from "@/entities/role";
import { getMenuList } from "./menuList";

// What each kind of user finds in the sidebar after logging in.
function hrefs(role: Roles): string[] {
  return getMenuList(role).flatMap((g) =>
    g.menus.flatMap((m) =>
      m.submenus?.length ? m.submenus.map((s) => s.href) : [m.href],
    ),
  );
}

describe("sidebar per role", () => {
  it("super admin manages everything", () => {
    const menu = hrefs(Roles.SUPER_ADMIN);
    for (const href of [
      "/monitoring/journal",
      "/monitoring",
      "/monitoring/history",
      "/monitoring/search",
      "/chat",
      "/organization/add",
      "/admin/add",
      "/faces/add",
      "/faces/import",
      "/point/add",
      "/camera",
      "/camera/add",
    ]) {
      expect(menu).toContain(href);
    }
  });

  it("admin runs a site: people, points, accounts - but not cameras or organizations", () => {
    const menu = hrefs(Roles.ADMIN);
    expect(menu).toEqual(
      expect.arrayContaining([
        "/monitoring/journal",
        "/chat",
        "/faces/add",
        "/point/add",
        "/admin",
      ]),
    );
    expect(menu).not.toContain("/camera");
    expect(menu).not.toContain("/camera/add");
    expect(menu).not.toContain("/organization");
  });

  it("operator watches and reviews events, and can look people up", () => {
    const menu = hrefs(Roles.OPERATOR);
    expect(menu).toEqual(
      expect.arrayContaining([
        "/monitoring/journal",
        "/monitoring",
        "/monitoring/history",
        "/chat",
        "/faces",
      ]),
    );
    expect(menu).not.toContain("/faces/add");
    expect(menu).not.toContain("/point");
    expect(menu).not.toContain("/camera");
    expect(menu).not.toContain("/admin");
  });

  it("registrar only enrolls people (plus their own account page)", () => {
    const menu = hrefs(Roles.REGISTRAR);
    expect(menu.sort()).toEqual(
      ["/faces", "/faces/add", "/faces/import", "/profile"].sort(),
    );
  });

  it("everyone has their account page", () => {
    for (const role of [
      Roles.SUPER_ADMIN,
      Roles.ADMIN,
      Roles.OPERATOR,
      Roles.REGISTRAR,
    ]) {
      expect(hrefs(role)).toContain("/profile");
    }
  });

  it("no group is left empty after filtering", () => {
    for (const role of [
      Roles.SUPER_ADMIN,
      Roles.ADMIN,
      Roles.OPERATOR,
      Roles.REGISTRAR,
    ]) {
      for (const group of getMenuList(role)) {
        expect(group.menus.length).toBeGreaterThan(0);
      }
    }
  });
});
