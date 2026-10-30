import { describe, expect, it } from "vitest";
import {
  formatGender,
  formatModelAge,
  personName,
  registeredAge,
  yearsLabel,
} from "./formatPerson";

describe("yearsLabel", () => {
  it.each([
    [1, "1 год"],
    [2, "2 года"],
    [4, "4 года"],
    [5, "5 лет"],
    [11, "11 лет"],
    [12, "12 лет"],
    [14, "14 лет"],
    [21, "21 год"],
    [22, "22 года"],
    [36, "36 лет"],
    [101, "101 год"],
    [111, "111 лет"],
  ])("%i -> %s", (n, label) => {
    expect(yearsLabel(n)).toBe(label);
  });
});

describe("formatModelAge", () => {
  it("rounds the estimate and marks it approximate", () => {
    expect(formatModelAge(39.4)).toBe("~39");
    expect(formatModelAge(29.5)).toBe("~30");
  });

  it.each([null, undefined, Number.NaN])("shows a dash for %s", (value) => {
    expect(formatModelAge(value)).toBe("—");
  });
});

describe("formatGender", () => {
  it("translates model genders", () => {
    expect(formatGender("male")).toBe("мужчина");
    expect(formatGender("female")).toBe("женщина");
  });

  it("shows a dash when missing", () => {
    expect(formatGender(null)).toBe("—");
    expect(formatGender(undefined)).toBe("—");
    expect(formatGender("other")).toBe("—");
  });
});

const known = {
  is_known: true,
  person_name: "Дидар",
  person_surname: "Едилхан",
  person_age: 36,
};

describe("personName", () => {
  it("joins name and surname of a matched person", () => {
    expect(personName(known)).toBe("Дидар Едилхан");
  });

  it("is null for unknown faces even if fields are present", () => {
    expect(personName({ ...known, is_known: false })).toBeNull();
    expect(personName({})).toBeNull();
  });

  it("skips empty parts", () => {
    expect(personName({ is_known: true, person_name: "Дидар", person_surname: " " })).toBe("Дидар");
    expect(personName({ is_known: true, person_name: null, person_surname: null })).toBeNull();
  });
});

describe("registeredAge", () => {
  it("labels the registered age", () => {
    expect(registeredAge(known)).toBe("36 лет");
  });

  it("is null when unknown or missing", () => {
    expect(registeredAge({ ...known, is_known: false })).toBeNull();
    expect(registeredAge({ is_known: true, person_age: null })).toBeNull();
  });
});
