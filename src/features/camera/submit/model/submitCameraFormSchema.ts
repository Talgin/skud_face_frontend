import { z } from 'zod';

export const addCameraFormSchema = z.object({
	serialNumber: z.string({ required_error: 'Обязательное поле' }),
	brandName: z.string({ required_error: 'Обязательное поле' }),
	modelName: z.string({
		required_error: 'Обязательное поле',
	}),
	registrationDate: z.date({
		required_error: 'Требуется дата регистрации.',
	}),
	url: z.string({ required_error: 'Обязательное поле' }),
});

export const updateCameraFormSchema = addCameraFormSchema.and(
	z.object({
		isActivated: z.boolean().default(false),
		pointId: z.string({
			required_error: 'Укажите точку!',
		}),
	}),
);
