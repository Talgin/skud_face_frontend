import { z } from 'zod';
import { pointSchema, pointsSchema } from '../model/pointSchema';

export type Points = z.infer<typeof pointsSchema>;
export type Point = z.infer<typeof pointSchema>;
