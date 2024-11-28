import { createAsyncThunk } from '@reduxjs/toolkit';
import { isFetchBaseQueryError } from '@/shared/api';
import { sessionApi } from '@/entities/session/api/sessionApi';

type Params = {
	username: Email;
	password: string;
};

export const loginThunk = createAsyncThunk<void, Params, { state: RootState }>(
	'authentification/login',
	async (body: Params, { dispatch }) => {
		try {
			await dispatch(sessionApi.endpoints.login.initiate(body)).unwrap();
		} catch (error) {
			if (isFetchBaseQueryError(error)) {
				if (typeof error.data === 'string') {
					throw new TypeError(error.data);
				}
			}

			throw new Error('Unknown error');
		}
	},
);
