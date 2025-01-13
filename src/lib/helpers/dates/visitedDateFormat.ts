export const handleVisitDateFormat = (visitedDate?: string | null) => {
	if (!visitedDate) return null;

	const visitedDateAsDate = new Date(visitedDate);
	const visitedDateFormatted = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: '2-digit',
	}).format(visitedDateAsDate);

	return visitedDateFormatted;
};
