import type { Point } from "@/entities/point";
import type { PointValues } from "@/features/point/submit";

export function mapPoint(values: Point): PointValues {
  return {
    name: values.name,
    address: values.address,
    //TODO: Пофиксить
    // @ts-ignore
    organizationId: String(values.organizationId),
    cameraId: String(values.cameraId),
  };
}
