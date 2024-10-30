import { z } from 'zod';

export const pointSchema = z.object({
	id: z.string(),
	name: z.string(),
	address: z.string(),
});

export const pointsSchema = pointSchema.array();

export type Points = z.infer<typeof pointsSchema>;
export type Point = z.infer<typeof pointSchema>;
