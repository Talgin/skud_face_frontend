import { type Camera, modelKeys } from "@/entities/camera";
import type { UpdateCameraValues } from "@/features/camera/submit";

export function mapCamera(values: Camera): UpdateCameraValues {
  return {
    serialNumber: values.serialNumber,
    brandName: values.brandName,
    modelName: values.modelName,
    registrationDate: new Date(values.registrationDate),
    isActivated: values.isActivated,
    pointId: String(values.pointId),
    url: values.url,
    models: modelKeys(values.models),
  };
}
