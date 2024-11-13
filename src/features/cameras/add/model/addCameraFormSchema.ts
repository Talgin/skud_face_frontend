import { z } from 'zod';

export const addCameraFormSchema = z.object({
	serialNumber: z.string(),
	brandName: z.string(),
	modelName: z.string(),
	registrationDate: z.date({
		required_error: 'Требуется дата регистрации.',
	}),
	isActivated: z.boolean(),
	pointId: z.string(),
	url: z.string(),
});

export type AddCameraFormSchema = z.infer<typeof addCameraFormSchema>;
