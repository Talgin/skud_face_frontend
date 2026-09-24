import { describe, expect, it } from "vitest";
import type { UserDto } from "../api/types";
import { mapUser } from "./mapUser";

const dto: UserDto = {
  id: 1,
  name: "Дидар",
  surname: "Едилхан",
  card_id: "1235431",
  active: true,
  gender: "male",
  birth_date: "1990-09-01",
  photo_path: "photos/1235431.jpg",
};

describe("mapUser", () => {
  it("maps the enrolled face crop URL", () => {
    const user = mapUser({
      ...dto,
      face_photo_url: "/media/database-photos-bucket/student-1/e.jpg",
    });
    expect(user.facePhotoUrl).toBe("/media/database-photos-bucket/student-1/e.jpg");
  });

  it("uses null when the student is not enrolled", () => {
    expect(mapUser(dto).facePhotoUrl).toBeNull();
    expect(mapUser({ ...dto, face_photo_url: null }).facePhotoUrl).toBeNull();
  });

  it("keeps the other fields", () => {
    const user = mapUser(dto);
    expect(user).toMatchObject({
      id: 1,
      cardId: "1235431",
      isActive: true,
      photoPath: "photos/1235431.jpg",
    });
    expect(user.birthDate).toEqual(new Date("1990-09-01"));
  });
});
