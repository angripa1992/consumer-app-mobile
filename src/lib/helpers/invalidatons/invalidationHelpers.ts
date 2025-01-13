export const findItemIndex = <T>({
	items,
	itemKeyToFind,
	currentIndex,
	id,
	limit,
}: {
	items: T[];
	itemKeyToFind: keyof T;
	currentIndex: number;
	id: number;
	limit: number;
}) => {
	const findItemIndex = items.findIndex((item) => item[itemKeyToFind] === id);

	if (findItemIndex === -1) return false;

	const indexPage = Math.floor(findItemIndex / limit);

	return currentIndex === indexPage;
};
