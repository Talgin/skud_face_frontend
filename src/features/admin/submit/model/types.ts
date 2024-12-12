import { z } from 'zod';
import { submitAdminFormSchema } from './submitAdminFormSchema';

export type AdminValues = z.infer<typeof submitAdminFormSchema>;
