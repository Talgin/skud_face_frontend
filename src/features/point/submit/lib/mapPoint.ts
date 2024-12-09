import { Point } from '@/entities/point';
import { PointValues } from '@/features/point/submit';

export function mapPoint(values: Point): PointValues {
	return {
		name: values.name,
		address: values.address,
		organizationId: String(values.organizationId),
		cameraId: String(values.cameraId),
	};
}
