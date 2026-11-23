import { z } from "zod";

import { t } from "@/shared/i18n";
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: t("Обязательное поле") })
    .email({
      message: t("Укажите ваш email"),
    }),
  password: z.string().min(6, {
    message: t(
      "Пароль должен состоять из 6 или более символов латинского алфавита",
    ),
  }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
