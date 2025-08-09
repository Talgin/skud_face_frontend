import type { z } from "zod";
import type { pointSchema, pointsSchema } from "../model/pointSchema";

export type Points = z.infer<typeof pointsSchema>;
export type Point = z.infer<typeof pointSchema>;
