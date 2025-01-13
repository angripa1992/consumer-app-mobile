export const convertStringToLowerCaseWithoutSpaces = (tag: string): string => {
	const convertToCamelCase = (str: string): string => {
		return str
			.toLowerCase()
			.split(' ')
			.map((word, index) => {
				if (index === 0) {
					return word;
				}
				return word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join('');
	};

	return convertToCamelCase(tag);
};
