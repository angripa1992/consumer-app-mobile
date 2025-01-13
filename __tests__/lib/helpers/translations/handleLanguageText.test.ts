import { handleLanguageOptionText } from '@/lib/helpers/translations/handleLanguageText';

describe('handleLanguageOptionText', () => {
	it('should return "indonesian" for language code "id"', () => {
		expect(handleLanguageOptionText('id')).toBe('ID');
	});

	it('should return "english" for language code "en"', () => {
		expect(handleLanguageOptionText('en')).toBe('EN');
	});

	it('should return "chinese" for language code "cht"', () => {
		expect(handleLanguageOptionText('cht')).toBe('CHT');
	});

	it('should return "thai" for language code "th"', () => {
		expect(handleLanguageOptionText('th')).toBe('TH');
	});

	it('should return "japanese" for language code "jp"', () => {
		expect(handleLanguageOptionText('jp')).toBe('JP');
	});

	it('should return "english" for an unknown language code', () => {
		expect(handleLanguageOptionText('unknown')).toBe('EN');
	});
});
