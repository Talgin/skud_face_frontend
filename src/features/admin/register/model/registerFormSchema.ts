import { z } from 'zod';

export const registerFormSchema = z.object({
	name: z.string().min(1, { message: 'Введите ваше имя' }),
	surname: z.string().min(1, { message: 'Введи ваше фамилию' }),
	cardId: z.string().min(1, { message: 'Введите ваш номер карты' }),
	phoneNumber: z.string().min(1, { message: 'Введите номер телефона' }),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
