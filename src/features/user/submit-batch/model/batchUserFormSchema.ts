import { z } from 'zod';

export const batchUserFormSchema = z.object({
	excelFile: z.any().refine((val) => val.length > 0, 'Загрузите файл в формате excel'),
	photos: z.any().refine((val) => val.length > 0, 'Загрузите фото'),
});
