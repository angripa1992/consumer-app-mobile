export const handleLanguageOptionText = (languageCode: string) => {
	if (languageCode === 'id') {
		return 'ID';
	}
	if (languageCode === 'en') {
		return 'EN';
	}
	if (languageCode === 'cht') {
		return 'CHT';
	}
	if (languageCode === 'th') {
		return 'TH';
	}
	if (languageCode === 'jp') {
		return 'JP';
	}
	return 'EN';
};
