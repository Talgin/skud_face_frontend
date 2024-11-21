import { z } from 'zod';

export const addPointFormSchema = z.object({
	name: z.string().min(1, ''),
	address: z.string(),
	organization_id: z.string(),
	camera_id: z.string(),
});

export type AddPointFormSchema = z.infer<typeof addPointFormSchema>;
