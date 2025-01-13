import { convertStringToLowerCaseWithoutSpaces } from '@/lib/helpers/translations/convertStringToLowerCaseWithoutSpaces';

describe('convertStringToLowerCaseWithoutSpaces', () => {
	it('should convert a single word to lowercase', () => {
		expect(convertStringToLowerCaseWithoutSpaces('Hello')).toBe('hello');
	});

	it('should convert multiple words to camelCase', () => {
		expect(convertStringToLowerCaseWithoutSpaces('Hello World')).toBe(
			'helloWorld',
		);
	});

	it('should handle an empty string', () => {
		expect(convertStringToLowerCaseWithoutSpaces('')).toBe('');
	});

	it('should handle a string with only spaces', () => {
		expect(convertStringToLowerCaseWithoutSpaces('   ')).toBe('');
	});

	it('should handle a string with mixed case', () => {
		expect(convertStringToLowerCaseWithoutSpaces('HeLLo WoRLd')).toBe(
			'helloWorld',
		);
	});
});
