import type { Camera } from "../../camera";
import type { CameraDto } from "../api/types";
import { DEFAULT_CAMERA_MODELS } from "./cameraModels";

export function mapCamera(dto: CameraDto): Camera {
  return {
    id: dto.id,
    serialNumber: dto.serial_number,
    brandName: dto.brand_name,
    modelName: dto.camera_model_name,
    registrationDate: dto.registration_date,
    isActivated: dto.is_activated,
    pointId: dto.point_id,
    url: dto.url,
    models: dto.models ?? DEFAULT_CAMERA_MODELS,
  };
}
