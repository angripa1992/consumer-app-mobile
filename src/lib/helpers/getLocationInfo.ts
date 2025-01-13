export const getLocationInfo = (
	city?: string | null,
	country?: string | null,
) => {
	if (city && country) {
		return `${city}, ${country}`;
	}

	return city || country || '';
};
