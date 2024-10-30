import { z } from 'zod';

export const addUsersFormSchema = z.object({
	excelFile: z.any().refine((val) => val.length > 0, 'Загрузите файл в формате excel'),
	photo: z.any().refine((val) => val.length > 0, 'Загрузите фото'),
});

export type AddUsersFormSchema = z.infer<typeof addUsersFormSchema>;
