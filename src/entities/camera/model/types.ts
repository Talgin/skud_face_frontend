import { z } from 'zod';
import { cameraSchema } from '@/entities/camera/model/cameraSchema';

export type Cameras = z.infer<typeof cameraSchema>;
export type Camera = z.infer<typeof cameraSchema>;
