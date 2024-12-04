import { z } from 'zod';

export const pointSchema = z.object({
	id: z.number(),
	name: z.string(),
	address: z.string(),
	organizationId: z.number(),
	cameraId: z.number(),
});

export const pointsSchema = pointSchema.array();
