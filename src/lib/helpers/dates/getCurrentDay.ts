export const getCurrentDay = () => {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const date = new Date();
	const currentDayName = days[date.getDay()];

	return currentDayName;
};
