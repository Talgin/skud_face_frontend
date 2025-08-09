import type { z } from "zod";
import type { submitPointFormSchema } from "./submitPointFormSchema";

export type PointValues = z.infer<typeof submitPointFormSchema>;
