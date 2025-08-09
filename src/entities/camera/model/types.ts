import type { z } from "zod";
import type { cameraSchema } from "@/entities/camera/model/cameraSchema";

export type Cameras = z.infer<typeof cameraSchema>;
export type Camera = z.infer<typeof cameraSchema>;
