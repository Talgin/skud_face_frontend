import { z } from 'zod';

export const registerFormSchema = z.object({
	excelFile: z.any().refine((val) => val.length > 0, 'Загрузите файл в формате excel'),
	photoFolder: z.any().refine((val) => val.length > 0, 'Загрузите фото'),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
