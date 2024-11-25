import { createSlice } from '@reduxjs/toolkit';
import { sessionApi } from '@/entities/session/api/sessionApi';

type SessionSliceState =
	| {
			accessToken: string;
			isAuthenticated: true;
	  }
	| {
			accessToken?: string;
			isAuthenticated: false;
	  };

const initialState: SessionSliceState = {
	isAuthenticated: false,
};

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSessionData: (state: SessionSliceState) => {
			state.accessToken = undefined;
			state.isAuthenticated = false;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(sessionApi.endpoints.login.matchFulfilled, (state: SessionSliceState, { payload }) => {
			state.isAuthenticated = true;

			if (state.isAuthenticated) {
				state.accessToken = payload.accessToken;
			}
		});
	},
});

export function selectIsAuthenticated(state: RootState) {
	return state.session.isAuthenticated;
}

export const { clearSessionData } = sessionSlice.actions;
