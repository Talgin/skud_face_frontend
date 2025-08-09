declare global {
	/**
	 * Type aliases
	 */
	type Id = number;
	type Email = string;

	type RootState = import('../src/app/appStore').RootState;
	type AppDispatch = import('../src/app/appStore').AppDispatch;
}

export {};
