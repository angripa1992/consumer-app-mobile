import { formatBigNumbers } from '@/lib/helpers/numbers/formatBigNumbers';

describe('formatBigNumbers', () => {
	test('should return null when the number is undefined', () => {
		expect(formatBigNumbers(undefined)).toBeNull();
	});

	test('should return null when the number is null', () => {
		expect(formatBigNumbers(null)).toBeNull();
	});

	test('should return the number as a string if it is less than 1000.', () => {
		expect(formatBigNumbers(999)).toBe('999');
		expect(formatBigNumbers(1)).toBe('1');
	});

	test('should format numbers in thousands with K', () => {
		expect(formatBigNumbers(1000)).toBe('1K');
		expect(formatBigNumbers(3562)).toBe('3.6K');
	});

	test('should format numbers in millions with M', () => {
		expect(formatBigNumbers(1000000)).toBe('1M');
		expect(formatBigNumbers(1500000)).toBe('1.5M');
		expect(formatBigNumbers(10000000)).toBe('10M');
	});

	test('should correctly round numbers with decimals', () => {
		expect(formatBigNumbers(999500)).toBe('999.5K');
		expect(formatBigNumbers(1500500)).toBe('1.5M');
	});
});
