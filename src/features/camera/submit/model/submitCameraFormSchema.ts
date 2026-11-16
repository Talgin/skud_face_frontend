import { z } from "zod";
import { CAMERA_MODEL_KEYS } from "@/entities/camera";

export const addCameraFormSchema = z.object({
  serialNumber: z.string({ required_error: "Обязательное поле" }),
  brandName: z.string({ required_error: "Обязательное поле" }),
  modelName: z.string({
    required_error: "Обязательное поле",
  }),
  registrationDate: z.date({
    required_error: "Требуется дата регистрации.",
  }),
  url: z.string({ required_error: "Обязательное поле" }),
  models: z
    .array(z.enum(CAMERA_MODEL_KEYS))
    .min(1, "Выберите хотя бы одну модель"),
});

export const updateCameraFormSchema = addCameraFormSchema.and(
  z.object({
    isActivated: z.boolean().default(false),
    pointId: z.string({
      required_error: "Укажите точку!",
    }),
  }),
);
