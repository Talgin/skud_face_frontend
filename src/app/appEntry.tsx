import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { appRouter } from './appRouter';
import 'normalize.css';
import '@/app/styles/index.scss';
import NiceModal from '@ebay/nice-modal-react';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<NiceModal.Provider>
				<RouterProvider router={appRouter()} />
			</NiceModal.Provider>
		</React.StrictMode>,
	);
}
