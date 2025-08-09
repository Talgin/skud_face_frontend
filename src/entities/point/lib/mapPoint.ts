import type { PointDto } from "../api/types";
import type { Point } from "../model/types";

export function mapPoint(dto: PointDto): Point {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    //TODO: Пофиксить
    // @ts-ignore
    organizationId: dto.organization_id,
    cameraId: dto.camera_id,
  };
}
