import { z } from 'zod';
import { adminSchema, adminsSchema } from '@/entities/admins/model/adminsSchema';

export type Admins = z.infer<typeof adminsSchema>;
export type Admin = z.infer<typeof adminSchema>;
