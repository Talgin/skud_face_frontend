import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileSchema = z
	.any()
	.refine((file) => file, 'Загрузите фото')
	.refine(
		(file) => file && !ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Неверный формат файла (допустимы: JPEG, PNG, WEBP)',
	);

export const userFormSchema = z.object({
	name: z.string({ required_error: 'Имя обязательно' }),
	surname: z.string({ required_error: 'Фамилия обязательна' }),
	cardId: z.string({ required_error: 'ID карты обязателен' }),
	gender: z.union([z.literal('male'), z.literal('female')], {
		errorMap: () => ({ message: 'Выберите пол' }),
	}),
	birthDate: z.date({ required_error: 'Дата рождения обязательна' }),
	photo: fileSchema,
});

export const editUserFormSchema = z.object({
	name: z.string().optional(),
	surname: z.string().optional(),
	cardId: z.string().optional(),
	isActive: z.boolean().default(false),
	gender: z.union([z.literal('male'), z.literal('female')]).optional(),
	birthDate: z.date().optional(),
	photo: z.date().optional(),
});
