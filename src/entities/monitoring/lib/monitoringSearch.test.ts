import { describe, expect, it } from "vitest";
import { matchesMonitoringSearch } from "./monitoringSearch";

const didar = {
  is_known: true,
  person_name: "Дидар",
  person_surname: "Едилхан",
  camera_id: 22017,
  camera_host: "10.1.22.17",
};
const unknown = { is_known: false, camera_id: 22016, camera_host: "10.1.22.16" };

describe("matchesMonitoringSearch", () => {
  it("matches everything for an empty query", () => {
    expect(matchesMonitoringSearch(unknown, "")).toBe(true);
    expect(matchesMonitoringSearch(unknown, "   ")).toBe(true);
  });

  it("finds a person by name or surname, any case and order", () => {
    expect(matchesMonitoringSearch(didar, "дидар")).toBe(true);
    expect(matchesMonitoringSearch(didar, "ЕДИЛ")).toBe(true);
    expect(matchesMonitoringSearch(didar, "Дидар Едилхан")).toBe(true);
    expect(matchesMonitoringSearch(didar, "едилхан дидар")).toBe(true);
    expect(matchesMonitoringSearch(didar, "дидар иванов")).toBe(false);
  });

  it("treats ё as е", () => {
    expect(
      matchesMonitoringSearch({ is_known: true, person_name: "Пётр" }, "петр"),
    ).toBe(true);
  });

  it("does not match names of faces below the threshold", () => {
    // person_* fields are only meaningful for a face DB match
    expect(
      matchesMonitoringSearch({ ...unknown, person_name: "Дидар" }, "дидар"),
    ).toBe(false);
  });

  it("finds unknown faces by the word «неизвестный»", () => {
    expect(matchesMonitoringSearch(unknown, "неизв")).toBe(true);
    expect(matchesMonitoringSearch(didar, "неизв")).toBe(false);
  });

  it("finds by camera id or host", () => {
    expect(matchesMonitoringSearch(unknown, "22016")).toBe(true);
    expect(matchesMonitoringSearch(didar, "10.1.22.17")).toBe(true);
    expect(matchesMonitoringSearch(didar, "22016")).toBe(false);
  });
});
