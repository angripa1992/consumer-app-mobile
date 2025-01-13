export const addHttpPrefix = (url: string | null | undefined) => {
	if (!url) return '';
	if (!url.startsWith('https://') && !url.startsWith('http://')) {
		return `https://${url}`;
	}
	return url;
};
