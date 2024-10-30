import { z } from 'zod';

export const addSingleFormSchema = z.object({
	name: z.string().min(1, { message: 'Обязательное поле' }),
	surname: z.string({ required_error: 'Обязательное поле' }),
	cardId: z.string({ required_error: 'Обязательное поле' }),
	phoneNumber: z.string({ required_error: 'Обязательное поле' }),
	role: z.string({ required_error: 'Обязательное поле' }),
	photo: z.any(),
});

export type AddSingleUserFormSchema = z.infer<typeof addSingleFormSchema>;
