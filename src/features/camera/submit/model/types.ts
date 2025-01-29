import { z } from 'zod';
import { addCameraFormSchema, updateCameraFormSchema } from './submitCameraFormSchema';

export type AddCameraValues = z.infer<typeof addCameraFormSchema>;
export type UpdateCameraValues = z.infer<typeof updateCameraFormSchema>;
export type CameraValues = AddCameraValues | UpdateCameraValues;
