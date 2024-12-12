import { z } from 'zod';

export const adminSchema = z.object({
	id: z.number(),
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
});

export const adminsSchema = adminSchema.array();
