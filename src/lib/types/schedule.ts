export type ScheduleEntry = {
	dayName: string;
	timeRanges: {
		startHour: number;
		startMinute: number;
		endHour: number;
		endMinute: number;
	}[];
};
export type Schedules = string[];
