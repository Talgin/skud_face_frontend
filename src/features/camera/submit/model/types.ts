import type { z } from "zod";
import type {
  addCameraFormSchema,
  updateCameraFormSchema,
} from "./submitCameraFormSchema";

export type AddCameraValues = z.infer<typeof addCameraFormSchema>;
export type UpdateCameraValues = z.infer<typeof updateCameraFormSchema>;
export type CameraValues = AddCameraValues | UpdateCameraValues;
