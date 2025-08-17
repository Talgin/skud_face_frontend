import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearSessionData, sessionApi } from "@/entities/session";
import { baseApi, SESSION_TAG } from "@/shared/api";
import { wait } from "@/shared/lib";

export const logoutThunk = createAsyncThunk<void, void, { state: RootState }>(
  "authentication/logout",
  async (_: unknown, { dispatch }) => {
    dispatch(clearSessionData());
    dispatch(baseApi.util.resetApiState());

    // Wait 10ms to invalidateTags in next event loop tick.
    // Otherwise after invalidate related requests with SESSION_TAG
    // will be started, but isAuthorized will still be equal to true
    await wait(10);

    dispatch(sessionApi.util.invalidateTags([SESSION_TAG]));
  },
);
