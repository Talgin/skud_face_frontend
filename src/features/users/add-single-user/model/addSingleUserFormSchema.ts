import { z } from 'zod';

export const addSingleFormSchema = z.object({
	name: z.string(),
	surname: z.string(),
	cardId: z.string(),
	phoneNumber: z.string(),
	role: z.string(),
	photo: z.any(),
});

export type AddSingleUserFormSchema = z.infer<typeof addSingleFormSchema>;
