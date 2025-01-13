export const getCountryFlagIcon = (country: string) => {
	if (country === 'Indonesia') {
		return '🇮🇩';
	}
	if (country === 'Singapore') {
		return '🇸🇬';
	}
	if (country === 'Philippines') {
		return '🇵🇭';
	}
	if (country === 'Canada') {
		return '🇨🇦';
	}
	if (country === 'Ireland') {
		return '🇮🇪';
	}
	if (country === 'Colombia') {
		return '🇨🇴';
	}
	if (country === 'South Africa') {
		return '🇿🇦';
	}
	if (country === 'United States') {
		return '🇺🇸';
	}
	if (country === 'Australia') {
		return '🇦🇺';
	}
	if (country === 'Japan') {
		return '🇯🇵';
	}
	if (country === 'Spain') {
		return '🇪🇸';
	}
	return '';
};
