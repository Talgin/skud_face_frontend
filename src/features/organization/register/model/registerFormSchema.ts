import { z } from 'zod';

export const registerFormSchema = z.object({
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
