import { isPhoneNumber } from '@/lib/helpers/isPhoneNumber';

describe('isPhoneNumber', () => {
	test('returns false for null or undefined input', () => {
		expect(isPhoneNumber(null)).toBe(false);
		expect(isPhoneNumber(undefined)).toBe(false);
	});

	test('returns false for invalid phone number formats', () => {
		expect(isPhoneNumber('123')).toBe(false);
		expect(isPhoneNumber('123456789')).toBe(false);
		expect(isPhoneNumber('abcdefghij')).toBe(false);
	});

	test('returns true for valid phone number formats', () => {
		expect(isPhoneNumber('+1 234 567 890')).toBe(true);
		expect(isPhoneNumber('(123) 456-7890')).toBe(true);
		expect(isPhoneNumber('123.456.7890')).toBe(true);
		expect(isPhoneNumber('+11234567890')).toBe(true);
		expect(isPhoneNumber('12345678901')).toBe(true);
	});

	test('handles leading and trailing spaces', () => {
		expect(isPhoneNumber('  +1 234 567 890  ')).toBe(true);
		expect(isPhoneNumber('  123.456.7890  ')).toBe(true);
	});
});
