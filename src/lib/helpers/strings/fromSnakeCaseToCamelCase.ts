export const fromSnakeCaseToCamelCase = (str: string): string => {
	return str
		.split('_')
		.map((word, index) => {
			if (index === 0) {
				return word.toLowerCase();
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join('');
};
