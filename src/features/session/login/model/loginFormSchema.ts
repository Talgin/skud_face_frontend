import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z.string().min(1, { message: 'Обязательное поле' }).email({
		message: 'Укажите ваш email',
	}),
	password: z.string().min(6, { message: 'Пароль должен состоять из 6 или более символов латинского алфавита' }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
