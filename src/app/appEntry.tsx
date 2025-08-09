import NiceModal from "@ebay/nice-modal-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "./appRouter";
import "normalize.css";
import "react-day-picker/dist/style.css";
import "@/app/styles/index.scss";
import { appStore, persistedStore } from "./appStore";

// biome-ignore lint/style/noNonNullAssertion: using non-null assertion since 'root' element is required
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <NiceModal.Provider>
        <ReduxProvider store={appStore}>
          <PersistGate loading={null} persistor={persistedStore}>
            <RouterProvider />
          </PersistGate>
        </ReduxProvider>
      </NiceModal.Provider>
    </React.StrictMode>,
  );
}
