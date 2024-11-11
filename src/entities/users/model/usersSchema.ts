import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
	phoneNumber: z.string(),
	role: z.string(),
	photo: z.any(),
});

export const usersSchema = userSchema.array();

export type Users = z.infer<typeof usersSchema>;

export type User = z.infer<typeof userSchema>;
