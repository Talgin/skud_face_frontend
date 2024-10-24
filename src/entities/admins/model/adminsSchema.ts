import { z } from 'zod';

export const adminSchema = z.object({
	id: z.string(),
	name: z.string(),
	surname: z.string(),
	organization: z.string(),
	cardId: z.string(),
	phoneNumber: z.string(),
});

export const adminsSchema = adminSchema.array();

export type Admins = z.infer<typeof adminsSchema>;
export type Admin = z.infer<typeof adminSchema>;
