import { isCurrentHourInASpecificTimeRange } from '@/lib/helpers/time/timeInARange';

describe('isCurrentHourInASpecificTimeRange', () => {
	it('should returns true when the current time is within the range', () => {
		expect(
			isCurrentHourInASpecificTimeRange(
				'14:00 - 15:00',
				// 14:30 in UTC format
				new Date('2024-04-01T19:30:00.000Z'),
			),
		).toBe(true);
	});

	it('should returns false when the current time is before the range', () => {
		expect(
			isCurrentHourInASpecificTimeRange(
				'14:00 - 15:00',
				// 13:30 in UTC format
				new Date('2024-04-01T18:30:00.000Z'),
			),
		).toBe(false);
	});

	it('should returns false when the current time is after the range', () => {
		expect(
			isCurrentHourInASpecificTimeRange(
				'14:00 - 15:00',
				// 16:00 in UTC format
				new Date('2024-04-01T21:00:00.000Z'),
			),
		).toBe(false);
	});
});
