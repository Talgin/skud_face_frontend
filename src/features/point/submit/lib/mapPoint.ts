import type { Point } from "@/entities/point";
import type { PointValues } from "@/features/point/submit";

export function mapPoint(values: Point): PointValues {
  return {
    name: values.name,
    address: values.address,
    // @ts-ignore the point read model has no organization id yet
    organizationId: values.organizationId
      ? String(values.organizationId)
      : undefined,
    cameraId: String(values.cameraId),
  };
}
