import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSessionData } from '@/entities/session/model/slice';
import { sessionApi } from '@/entities/session';
import { SESSION_TAG } from '@/shared/api';

export const logoutThunk = createAsyncThunk<void, void, { state: RootState }>(
	'authentication/logout',
	async (_: unknown, { dispatch }) => {
		dispatch(clearSessionData());

		dispatch(sessionApi.util.invalidateTags([SESSION_TAG]));
	},
);
