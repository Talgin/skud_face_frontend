import { z } from 'zod';

export const submitCameraFormSchema = z.object({
	serialNumber: z.string().min(1, { message: 'Обязательное поле' }),
	brandName: z.string().min(1, { message: 'Обязательное поле' }),
	modelName: z.string().min(1, { message: 'Обязательное поле' }),
	registrationDate: z.date({
		required_error: 'Требуется дата регистрации.',
	}),
	isActivated: z.boolean(),
	pointId: z.string().min(1, { message: 'Обязательное поле' }),
	url: z.string().min(1, { message: 'Обязательное поле' }),
});

export type AddCameraFormSchema = z.infer<typeof submitCameraFormSchema>;
