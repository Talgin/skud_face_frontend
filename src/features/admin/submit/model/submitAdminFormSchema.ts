import { z } from 'zod';

const AdminRolesSchema = z.union([
	z.literal('admin', { required_error: 'Выберите роль' }),
	z.literal('operator', { required_error: 'Выберите роль' }),
	z.literal('registrar', { required_error: 'Выберите роль' }),
	z.literal('super_admin', { required_error: 'Выберите роль' }),
]);

export const submitAdminFormSchema = z.object({
	name: z.string({ required_error: 'Введите ваше имя' }),
	surname: z.string({ required_error: 'Введи ваше фамилию' }),
	cardId: z.string({ required_error: 'Введите ваш номер карты' }),
	role: AdminRolesSchema,
	isActive: z.boolean().default(false),
	username: z.string({ required_error: 'Введите имя пользователя' }),
	password: z.string({ required_error: 'Введите пароль пользователя' }),
});
