import type { z } from "zod";
import type { organizationSchema } from "@/entities/organization";

export type Organizations = z.infer<typeof organizationSchema>;

export type Organization = z.infer<typeof organizationSchema>;
