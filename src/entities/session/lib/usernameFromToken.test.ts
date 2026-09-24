import { describe, expect, it } from "vitest";
import { usernameFromToken } from "./usernameFromToken";

function tokenWith(payload: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const b64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `header.${b64}.signature`;
}

describe("usernameFromToken", () => {
  it("reads the sub claim", () => {
    expect(usernameFromToken(tokenWith({ sub: "admin@skud.local", type: "access" }))).toBe("admin@skud.local");
  });

  it("handles non-ASCII usernames", () => {
    expect(usernameFromToken(tokenWith({ sub: "оператор@skud.local" }))).toBe("оператор@skud.local");
  });

  it.each([undefined, null, "", "not-a-jwt", "a.%%%.c", `x.${btoa("{}")}.y`])("returns null for %s", (token) => {
    expect(usernameFromToken(token)).toBeNull();
  });
});
