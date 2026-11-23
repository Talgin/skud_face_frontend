import { z } from "zod";

import { t } from "@/shared/i18n";

const AdminRolesSchema = z.union([
  z.literal("admin", { required_error: t("Выберите роль") }),
  z.literal("operator", { required_error: t("Выберите роль") }),
  z.literal("registrar", { required_error: t("Выберите роль") }),
  z.literal("super_admin", { required_error: t("Выберите роль") }),
]);

export const submitAdminFormSchema = z.object({
  name: z.string({ required_error: t("Введите ваше имя") }),
  surname: z.string({ required_error: t("Введите вашу фамилию") }),
  cardId: z.string({ required_error: t("Введите ваш номер карты") }),
  role: AdminRolesSchema,
  organizationId: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number({ required_error: t("Выберите организацию") }),
  ),
  isActive: z.boolean().default(false),
  username: z.string({ required_error: t("Введите имя пользователя") }),
  password: z.string({ required_error: t("Введите пароль пользователя") }),
});

// editing: the current username/password are not shown, so leaving them empty keeps them unchanged
export const editAdminFormSchema = submitAdminFormSchema.extend({
  username: z.string().optional(),
  password: z.string().optional(),
});
