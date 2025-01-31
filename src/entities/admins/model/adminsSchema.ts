import { z } from 'zod';

const AdminRolesSchema = z.union([
	z.literal('admin'),
	z.literal('operator'),
	z.literal('registrar'),
	z.literal('super_admin'),
]);

export const adminSchema = z.object({
	id: z.number(),
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
	role: AdminRolesSchema,
	isActive: z.boolean(),
});

export const adminsSchema = adminSchema.array();
