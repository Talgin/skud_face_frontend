import { z } from 'zod';

export const cameraSchema = z.object({
	id: z.string(),
	serialNumber: z.string(),
	brandName: z.string(),
	modelName: z.string(),
	registrationDate: z.string(),
	isActivated: z.boolean().default(false),
	pointId: z.string(),
	url: z.string(),
});

export const camerasSchema = z.array(cameraSchema);

export type Cameras = z.infer<typeof camerasSchema>;
export type Camera = z.infer<typeof cameraSchema>;
