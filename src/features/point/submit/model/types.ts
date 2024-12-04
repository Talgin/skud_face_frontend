import { z } from 'zod';
import { submitPointFormSchema } from './submitPointFormSchema';

export type PointValues = z.infer<typeof submitPointFormSchema>;
