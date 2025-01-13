import { isEmail } from '@/lib/helpers/strings/isEmail';

describe('isEmail', () => {
	test('returns true for valid email formats', () => {
		expect(isEmail('user@example.com')).toBe(true);
		expect(isEmail('user@subdomain.example.co.uk')).toBe(true);
		expect(isEmail('user.name@example.com')).toBe(true);
	});

	test('returns false for invalid email formats', () => {
		expect(isEmail('user@example')).toBe(false);
		expect(isEmail('user@example.')).toBe(false);
		expect(isEmail('@example.com')).toBe(false);
		expect(isEmail('user@example.com@example.com')).toBe(false);
		expect(isEmail('user@example..com')).toBe(false);
	});

	test('returns false for emails with spaces, tabs, or newlines', () => {
		expect(isEmail('user@ example.com')).toBe(false);
		expect(isEmail('user@example.com ')).toBe(false);
		expect(isEmail('user@example.com\t')).toBe(false);
		expect(isEmail('user@example.com\n')).toBe(false);
	});

	test('handles empty string input', () => {
		expect(isEmail('')).toBe(false);
	});
});
