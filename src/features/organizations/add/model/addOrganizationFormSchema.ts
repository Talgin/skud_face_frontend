import { z } from 'zod';

export const addOrganizationFormSchema = z.object({
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});

export type AddOrganizationFormSchema = z.infer<typeof addOrganizationFormSchema>;
