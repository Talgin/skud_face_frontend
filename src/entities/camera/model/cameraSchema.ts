import { z } from "zod";

export const cameraSchema = z.object({
  id: z.number(),
  serialNumber: z.string(),
  brandName: z.string(),
  modelName: z.string(),
  registrationDate: z.string(),
  isActivated: z.boolean(),
  pointId: z.number(),
  url: z.string(),
  models: z.record(z.record(z.unknown())),
});

export const camerasSchema = z.array(cameraSchema);
