import type { z } from "zod";
import type { userSchema, usersSchema } from "./usersSchema";

export type Users = z.infer<typeof usersSchema>;

export type User = z.infer<typeof userSchema>;
