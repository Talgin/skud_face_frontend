import { z } from 'zod';

export const userFormSchema = z.object({
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
	gender: z.union([z.literal('male'), z.literal('female')]),
	birthDate: z.date(),
	photo: z.string(),
	isActive: z.boolean(),
});
