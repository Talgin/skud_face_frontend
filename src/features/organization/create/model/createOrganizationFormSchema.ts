import { z } from 'zod';

export const createOrganizationFormSchema = z.object({
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});

export type CreateOrganizationFormSchema = z.infer<typeof createOrganizationFormSchema>;
