import { z } from 'zod';
import { editUserFormSchema, userFormSchema } from './userFormSchema';

type Photo = FileList;

export type CreateValues = Omit<z.infer<typeof userFormSchema>, 'photo'> & {
	photo: Photo;
};

export type EditUserValues = Omit<z.infer<typeof editUserFormSchema>, 'photo'> & {
	photo: Photo;
};

export type UserValues = CreateValues | EditUserValues;
