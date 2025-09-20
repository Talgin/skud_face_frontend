import { createRouter } from "@tanstack/react-router";
import { appStore } from "@/app/appStore";
import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    get auth() {
      const s = appStore.getState();
      return { isAuthenticated: s.session.isAuthenticated };
    },
    // auth: {
    //   isAuthenticated: false,
    //   role: undefined,
    // },
  },
});
