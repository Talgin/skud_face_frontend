import { z } from 'zod';

export const userSchema = z.object({
	id: z.number(),
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
	isActive: z.boolean(),
	gender: z.union([z.literal('male'), z.literal('female')]),
	birthDate: z.date(),
	photoPath: z.string(),
});

export const usersSchema = userSchema.array();
