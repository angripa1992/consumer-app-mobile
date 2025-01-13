export const reduceLargeNumber = (number: number) => {
	if (number >= 1000) {
		const formattedNumber = (number / 1000).toFixed(1);
		return `${formattedNumber}k`;
	} else {
		return number;
	}
};
