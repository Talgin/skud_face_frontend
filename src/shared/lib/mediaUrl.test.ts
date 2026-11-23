import { describe, expect, it } from "vitest";
import { mediaUrl } from "./mediaUrl";

describe("mediaUrl", () => {
  it("serves MinIO object URLs through /media", () => {
    expect(mediaUrl("http://10.162.0.2:50005/face-crops-bucket/a_crop_0.jpg")).toBe(
      "/media/face-crops-bucket/a_crop_0.jpg",
    );
    expect(mediaUrl("http://10.1.22.5:50005/face-full-frames-bucket/b_frame.jpg")).toBe(
      "/media/face-full-frames-bucket/b_frame.jpg",
    );
  });

  it("keeps URLs that are already relative", () => {
    expect(mediaUrl("/media/database-photos-bucket/student-1/e.jpg")).toBe(
      "/media/database-photos-bucket/student-1/e.jpg",
    );
  });

  it("leaves other absolute URLs alone", () => {
    expect(mediaUrl("https://example.com/avatar.png")).toBe("https://example.com/avatar.png");
  });

  it("returns an empty string for missing URLs", () => {
    expect(mediaUrl(null)).toBe("");
    expect(mediaUrl(undefined)).toBe("");
    expect(mediaUrl("")).toBe("");
  });
});
