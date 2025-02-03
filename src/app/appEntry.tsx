import React from 'react';
import ReactDOM from 'react-dom/client';
import NiceModal from '@ebay/nice-modal-react';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from './appRouter';
import { Provider as ReduxProvider } from 'react-redux';
import 'normalize.css';
import 'react-day-picker/dist/style.css';
import '@/app/styles/index.scss';
import { appStore, persistedStore } from './appStore';

const rootElement = document.getElementById('root')!;

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
