export const formatFlatListData = <T>(
	data: Array<T> | undefined | null,
	numColumns: number,
) => {
	if (!data) return [];
	const numberOfFullRows = Math.floor(data.length / numColumns);
	let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

	const newData = [...data];
	while (
		numberOfElementsLastRow !== numColumns &&
		numberOfElementsLastRow !== 0
	) {
		newData.push({ key: `blank-${numberOfElementsLastRow}`, empty: true } as T);
		numberOfElementsLastRow++;
	}
	return newData;
};
