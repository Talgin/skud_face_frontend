import { z } from "zod";

import { t } from "@/shared/i18n";
export const batchUserFormSchema = z.object({
  excelFile: z
    .any()
    .refine((val) => val.length > 0, t("Загрузите файл в формате excel")),
  photos: z.any().refine((val) => val.length > 0, t("Загрузите фото")),
});
