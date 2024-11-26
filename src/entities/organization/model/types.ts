import { z } from 'zod';
import { organizationSchema } from '@/entities/organization';

export type Organizations = z.infer<typeof organizationSchema>;

export type Organization = z.infer<typeof organizationSchema>;
