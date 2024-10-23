import { z } from 'zod';

export const organizationSchema = z.object({
	id: z.string(),
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});

export const organizationsSchema = organizationSchema.array();

export type Organizations = z.infer<typeof organizationsSchema>;

export type Organization = z.infer<typeof organizationSchema>;
