export const changeDateFormat = (inputDate?: string) => {
	if (!inputDate || !isValidDateFormat(inputDate)) return '';

	const date = new Date(inputDate);

	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'short' });
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
};

const isValidDateFormat = (dateString: string) => {
	// YYYY-MM-DDTHH:MM:SS
	const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
	return regex.test(dateString);
};
