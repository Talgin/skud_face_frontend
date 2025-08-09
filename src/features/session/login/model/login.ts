import { createAsyncThunk } from "@reduxjs/toolkit";
import { sessionApi } from "@/entities/session/api/sessionApi";
import { isFetchBaseQueryError } from "@/shared/api";

type Params = {
  username: Email;
  password: string;
};

export const loginThunk = createAsyncThunk<void, Params, { state: RootState }>(
  "authentification/login",
  async (body: Params, { dispatch }) => {
    try {
      await dispatch(sessionApi.endpoints.login.initiate(body)).unwrap();
    } catch (error: unknown) {
      if (isFetchBaseQueryError(error)) {
        // TODO: пофиксить
        // @ts-ignore
        if (typeof error.data.detail === "string") {
          // @ts-ignore
          throw new TypeError(error.data.detail);
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Unknown error");
    }
  },
);
