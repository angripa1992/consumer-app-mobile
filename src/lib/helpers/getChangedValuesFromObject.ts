export const getChangedValuesFromObject = <T extends object>(
	original: T,
	updated: T,
): Partial<T> => {
	const changedValues: Partial<T> = {};

	const originalKeys = Object.keys(original) as (keyof T)[];
	const updatedKeys = Object.keys(updated) as (keyof T)[];

	if (
		originalKeys.length !== updatedKeys.length ||
		!originalKeys.every((key) => updatedKeys.includes(key))
	) {
		throw new Error('Object keys do not match');
	}

	originalKeys.forEach((key) => {
		if (!Object.is(original[key], updated[key])) {
			changedValues[key] = updated[key];
		}
	});

	return changedValues;
};
