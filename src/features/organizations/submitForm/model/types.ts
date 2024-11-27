import { z } from 'zod';
import { submitOrganizationFormSchema } from './submitOrganizationFormSchema';

export type OrganizationValues = z.infer<typeof submitOrganizationFormSchema>;
