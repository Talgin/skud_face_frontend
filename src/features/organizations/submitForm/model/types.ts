import type { z } from "zod";
import type { submitOrganizationFormSchema } from "./submitOrganizationFormSchema";

export type OrganizationValues = z.infer<typeof submitOrganizationFormSchema>;
