import { z } from 'zod';

export const submitPointFormSchema = z.object({
	name: z.string().min(1, ''),
	address: z.string(),
	cameraId: z.string(),
});
