export function formatWeekdayText(text: string) {
	const [day, hours] = text.split(': ');
	const shortDay = day.slice(0, 3);

	return { shortDay, hours };
}
