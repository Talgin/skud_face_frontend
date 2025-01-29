export function parseDateToString(value: Date): string {
	return value.toISOString().split('.')[0];
}
