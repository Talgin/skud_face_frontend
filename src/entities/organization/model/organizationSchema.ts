import { z } from 'zod';

export const organizationSchema = z.object({
	id: z.number(),
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});

export const organizationsSchema = organizationSchema.array();
