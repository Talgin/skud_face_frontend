import type { z } from "zod";
import type { submitAdminFormSchema } from "./submitAdminFormSchema";

export type AdminValues = z.infer<typeof submitAdminFormSchema>;
