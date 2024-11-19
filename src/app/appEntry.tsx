import React from 'react';
import ReactDOM from 'react-dom/client';
import NiceModal from '@ebay/nice-modal-react';
import { RouterProvider } from '@tanstack/react-router';
import { Provider as ReduxProvider } from 'react-redux';
import 'normalize.css';
import '@/app/styles/index.scss';
import { appRouter } from './appRouter';
import { appStore } from './appStore';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<NiceModal.Provider>
				<ReduxProvider store={appStore}>
					<RouterProvider router={appRouter()} />
				</ReduxProvider>
			</NiceModal.Provider>
		</React.StrictMode>,
	);
}
