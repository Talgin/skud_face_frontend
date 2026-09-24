import { format } from "date-fns";
import type { User } from "../model/types";

export function genderLabel(gender: User["gender"]): string {
  return gender === "male" ? "мужчина" : "женщина";
}

// "мужчина · 01.09.1990"
export function personMeta(user: Pick<User, "gender" | "birthDate">): string {
  return `${genderLabel(user.gender)} · ${format(user.birthDate, "dd.MM.yyyy")}`;
}

// case-insensitive match on name, surname (in either order) and card number
export function matchesPersonSearch(
  user: Pick<User, "name" | "surname" | "cardId">,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    `${user.name} ${user.surname}`,
    `${user.surname} ${user.name}`,
    user.cardId,
  ]
    .join("\n")
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
