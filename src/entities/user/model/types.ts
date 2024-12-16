import { z } from 'zod';
import { userSchema, usersSchema } from './usersSchema';

export type Users = z.infer<typeof usersSchema>;

export type User = z.infer<typeof userSchema>;
