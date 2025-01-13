export const limitCharacters = (text: string, numberLimit: number) => {
	if (text.length < numberLimit) {
		return text;
	}
	return `${text.substring(0, numberLimit)}...`;
};
