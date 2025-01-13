interface Item {
	id: number;
}
export const sortDataById = <T extends Item>(
	data: T[],
	isReverse?: boolean,
) => {
	if (isReverse) return data.sort((a, b) => b.id - a.id);

	return data.sort((a, b) => a.id - b.id);
};
