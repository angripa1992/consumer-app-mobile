export const isCurrentHourInASpecificTimeRange = (
	timeRange: string,
	specificDate: Date,
) => {
	const [startTime, endTime] = timeRange.split(' - ').map((time) => {
		const [hours, minutes] = time.split(':');
		return +hours * 60 + +minutes;
	});

	const nowInMinutes = specificDate.getHours() * 60 + specificDate.getMinutes();

	if (nowInMinutes >= startTime && nowInMinutes <= endTime) {
		return true;
	} else {
		return false;
	}
};
