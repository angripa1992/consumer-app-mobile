export const formatNumber = (number: number, maxDigits?: number) => {
	const formatter = Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: maxDigits ?? 2,
	});

	return formatter.format(number);
};
