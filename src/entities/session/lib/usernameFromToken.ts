// Username (JWT "sub") of the logged-in operator, used to record who reviewed an event.
// The token is only decoded here, not verified - verification is the backend's job.
export function usernameFromToken(token?: string | null): string | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    const sub = JSON.parse(json).sub;
    return typeof sub === "string" && sub ? sub : null;
  } catch {
    return null;
  }
}
