import { describe, expect, it } from "vitest";
import { genderLabel, matchesPersonSearch, personMeta } from "./personCard";

const person = { name: "Дидар", surname: "Едилхан", cardId: "1235431" };

describe("genderLabel", () => {
  it("labels both genders", () => {
    expect(genderLabel("male")).toBe("мужчина");
    expect(genderLabel("female")).toBe("женщина");
  });
});

describe("personMeta", () => {
  it("joins gender and birth date", () => {
    expect(personMeta({ gender: "male", birthDate: new Date(1990, 8, 1) })).toBe(
      "мужчина · 01.09.1990",
    );
  });
});

describe("matchesPersonSearch", () => {
  it("matches everything for an empty query", () => {
    expect(matchesPersonSearch(person, "")).toBe(true);
    expect(matchesPersonSearch(person, "   ")).toBe(true);
  });

  it("matches name or surname case-insensitively", () => {
    expect(matchesPersonSearch(person, "дидар")).toBe(true);
    expect(matchesPersonSearch(person, "ЕДИЛ")).toBe(true);
  });

  it("matches full name in either order", () => {
    expect(matchesPersonSearch(person, "Дидар Едилхан")).toBe(true);
    expect(matchesPersonSearch(person, "едилхан  дидар")).toBe(true);
  });

  it("matches card number", () => {
    expect(matchesPersonSearch(person, "35431")).toBe(true);
  });

  it("rejects when any word is missing", () => {
    expect(matchesPersonSearch(person, "Дидар Абенов")).toBe(false);
    expect(matchesPersonSearch(person, "999")).toBe(false);
  });
});
