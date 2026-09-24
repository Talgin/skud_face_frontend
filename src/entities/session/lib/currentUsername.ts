import Cookie from "js-cookie";
import { ACCESS_TOKEN } from "../model/const";
import { usernameFromToken } from "./usernameFromToken";

export function currentUsername(): string | null {
  return usernameFromToken(Cookie.get(ACCESS_TOKEN));
}
