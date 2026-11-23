import { describe, expect, it } from "vitest";
import { modelKeys, modelsFromKeys } from "./cameraModels";

describe("modelKeys", () => {
  it("lists the selected models in a fixed order", () => {
    expect(modelKeys({ lpr: { roi: [] }, face: {} })).toEqual(["face", "lpr"]);
    expect(modelKeys({ lpr: {} })).toEqual(["lpr"]);
    expect(modelKeys({ ppe: {}, face: {} })).toEqual(["face", "ppe"]);
  });

  it("treats a camera without models as face-only", () => {
    expect(modelKeys(undefined)).toEqual(["face"]);
    expect(modelKeys(null)).toEqual(["face"]);
  });

  it("ignores models this UI does not know", () => {
    expect(modelKeys({ face: {}, pose: {} })).toEqual(["face"]);
  });
});

describe("modelsFromKeys", () => {
  it("builds the API object from ticked boxes", () => {
    expect(modelsFromKeys(["face", "lpr"])).toEqual({ face: {}, lpr: {} });
  });

  it("adds PPE without touching the other models' settings", () => {
    const previous = { face: {}, lpr: { min_plate_px: 40 } };
    expect(modelsFromKeys(["face", "lpr", "ppe"], previous)).toEqual({
      face: {},
      lpr: { min_plate_px: 40 },
      ppe: {},
    });
  });

  it("keeps the settings of models that stay ticked", () => {
    const previous = { face: {}, lpr: { roi: [[0.1, 0.5]], min_plate_px: 40 } };
    expect(modelsFromKeys(["lpr"], previous)).toEqual({
      lpr: { roi: [[0.1, 0.5]], min_plate_px: 40 },
    });
  });
});
