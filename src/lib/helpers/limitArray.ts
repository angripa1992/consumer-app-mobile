export const limitArray = <T>(array: T[] | undefined | null, limit: number) => {
	if (!array) return [];
	return array.slice(0, limit);
};
