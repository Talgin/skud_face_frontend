import { z } from 'zod';

export const addAdminFormSchema = z.object({
	name: z.string().min(1, { message: 'Введите ваше имя' }),
	surname: z.string().min(1, { message: 'Введи ваше фамилию' }),
	cardId: z.string().min(1, { message: 'Введите ваш номер карты' }),
	phoneNumber: z.string().min(1, { message: 'Введите номер телефона' }),
});

export type AddAdminFormSchema = z.infer<typeof addAdminFormSchema>;
