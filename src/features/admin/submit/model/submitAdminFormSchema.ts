import { z } from 'zod';

const AdminRolesSchema = z.union([
	z.literal('admin'),
	z.literal('operator'),
	z.literal('registrar'),
	z.literal('super_admin'),
]);

export const submitAdminFormSchema = z.object({
	name: z.string().min(1, { message: 'Введите ваше имя' }),
	surname: z.string().min(1, { message: 'Введи ваше фамилию' }),
	cardId: z.string().min(1, { message: 'Введите ваш номер карты' }),
	phoneNumber: z.string().min(1, { message: 'Введите номер телефона' }),
	role: AdminRolesSchema,
	username: z.string().min(1, { message: 'Введите имя пользователя' }),
	password: z.string().min(1, { message: 'Введите пароль пользователя' }),
});
