export const compareVersions = (version1: string, version2: string): number => {
	const v1Parts = version1.split('.').map(Number);
	const v2Parts = version2.split('.').map(Number);

	for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
		const v1 = v1Parts[i] || 0;
		const v2 = v2Parts[i] || 0;

		if (v1 > v2) {
			return 1;
		}
		if (v1 < v2) {
			return -1;
		}
	}

	return 0;
};

export const getVersionStatus = (
	userVersion: string,
	minVersion: string,
	latestVersion: string,
) => {
	if (compareVersions(userVersion, minVersion) < 0) {
		return 'outdated';
	}
	if (compareVersions(userVersion, latestVersion) === 0) {
		return 'up-to-date';
	}
	if (
		compareVersions(userVersion, minVersion) >= 0 &&
		compareVersions(userVersion, latestVersion) < 0
	) {
		return 'minimum';
	}
	return 'unknown';
};
