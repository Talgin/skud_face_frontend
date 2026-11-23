import { z } from "zod";
import { CAMERA_MODEL_KEYS } from "@/entities/camera";

import { t } from "@/shared/i18n";
export const addCameraFormSchema = z.object({
  serialNumber: z.string({ required_error: t("Обязательное поле") }),
  brandName: z.string({ required_error: t("Обязательное поле") }),
  modelName: z.string({
    required_error: t("Обязательное поле"),
  }),
  registrationDate: z.date({
    required_error: t("Требуется дата регистрации."),
  }),
  url: z.string({ required_error: t("Обязательное поле") }),
  models: z
    .array(z.enum(CAMERA_MODEL_KEYS))
    .min(1, t("Выберите хотя бы одну модель")),
});

export const updateCameraFormSchema = addCameraFormSchema.and(
  z.object({
    isActivated: z.boolean().default(false),
    pointId: z.string({
      required_error: t("Укажите точку!"),
    }),
  }),
);
