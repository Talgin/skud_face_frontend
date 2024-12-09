import { z } from 'zod';
import { submitCameraFormSchema } from './submitCameraFormSchema';

export type CameraValues = z.infer<typeof submitCameraFormSchema>;
