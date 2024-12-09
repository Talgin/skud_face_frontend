import { type CameraValues } from '@/features/camera/submit';
import { type Camera } from '@/entities/camera';

export function mapCamera(values: Camera): CameraValues {
	return {
		serialNumber: values.serialNumber,
		brandName: values.brandName,
		modelName: values.modelName,
		registrationDate: new Date(values.registrationDate),
		isActivated: values.isActivated,
		pointId: String(values.pointId),
		url: values.url,
	};
}
