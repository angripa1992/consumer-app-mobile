import { changeDateFormat } from '@/lib/helpers/dates/changeDateFormat';

describe('changeDateFormat tests', () => {
	it('should format a valid date string to "D MMM YYYY"', () => {
		const inputDate = '2024-07-03T16:47:38';
		const expectedOutput = '3 Jul 2024';
		expect(changeDateFormat(inputDate)).toBe(expectedOutput);
	});

	it('should handle undefined input gracefully', () => {
		expect(changeDateFormat()).toBe('');
	});

	it('should return an empty string for invalid date inputs', () => {
		const invalidDate = 'not-a-date';
		expect(changeDateFormat(invalidDate)).toBe('');
	});

	it('should correctly format a date in a leap year', () => {
		const leapYearDate = '2020-02-29T12:00:00';
		const expectedOutput = '29 Feb 2020';
		expect(changeDateFormat(leapYearDate)).toBe(expectedOutput);
	});
});
