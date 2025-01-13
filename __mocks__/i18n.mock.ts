const mockI18nInstance = {
	locale: 'en',
	enableFallback: true,
	t: jest.fn((key) => key),
};

const changeLanguage = jest.fn((lang) => {
	mockI18nInstance.locale = lang;
});

export { mockI18nInstance as i18nInstance, changeLanguage };
