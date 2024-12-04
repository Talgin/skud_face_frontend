declare global {
	/**
	 * Type aliases
	 */
	export type Id = number;
	export type Email = string;

	declare type RootState = import('../src/app/appStore').RootState;
	declare type AppDispatch = import('../src/app/appStore').AppDispatch;
}
