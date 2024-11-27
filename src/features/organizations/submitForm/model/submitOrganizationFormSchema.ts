import { z } from 'zod';

export const submitOrganizationFormSchema = z.object({
	organizationName: z.string(),
	ceoName: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
});
