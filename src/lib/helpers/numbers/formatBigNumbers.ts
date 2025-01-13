export const formatBigNumbers = (number?: number | null) => {
	if (!number) return null;

	if (number >= 1000 && number < 1000000) {
		return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	} else if (number >= 1000000) {
		return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	return number.toString();
};
