import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearSessionData } from "@/entities/session";
import { apiAccessTokenIsBrokenEvent } from "@/shared/api";
import { router } from "@/shared/model";

export const authListener = createListenerMiddleware();

authListener.startListening({
  actionCreator: apiAccessTokenIsBrokenEvent,
  effect: async (_action, api) => {
    api.dispatch(clearSessionData());

    const state = router.state.location;
    const redirectTo =
      state.pathname + (state.searchStr ? `?${state.searchStr}` : "");

    const search = state.pathname === "/" ? {} : { redirect: redirectTo };

    router.navigate({
      to: "/",
      search,
      replace: true,
    });

    // api.dispatch(sessionApi.util.resetApiState());
  },
});
