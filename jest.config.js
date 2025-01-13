module.exports = {
	preset: '@testing-library/react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: ['./jest-setup.ts'],
	moduleNameMapper: {
		'config/i18n$': '<rootDir>/__mocks__/i18n.mock.ts',
	},
};
