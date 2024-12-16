import { z } from 'zod';
import { userFormSchema } from './userFormSchema';

export type UserValues = z.infer<typeof userFormSchema>;
