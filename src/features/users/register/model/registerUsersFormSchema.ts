import { z } from 'zod';

export const registerUsersFormSchema = z.object({
	excelFile: z.any().refine((val) => val.length > 0, 'Загрузите файл в формате excel'),
	photo: z.any().refine((val) => val.length > 0, 'Загрузите фото'),
});

export type RegisterUsersFormSchema = z.infer<typeof registerUsersFormSchema>;
