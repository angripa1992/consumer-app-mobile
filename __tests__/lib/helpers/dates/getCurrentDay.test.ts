import { getCurrentDay } from '@/lib/helpers/dates/getCurrentDay';

describe('getCurrentDay', () => {
	it('should returns "Monday" when the day is Monday', () => {
		const realDate = Date;
		global.Date = class extends realDate {
			getDay() {
				return 1;
			}
		} as any;

		expect(getCurrentDay()).toBe('Monday');

		global.Date = realDate;
	});

	it('returns "Sunday" when the day is Sunday', () => {
		const realDate = Date;
		global.Date = class extends realDate {
			getDay() {
				return 0;
			}
		} as any;

		expect(getCurrentDay()).toBe('Sunday');

		global.Date = realDate;
	});
});
