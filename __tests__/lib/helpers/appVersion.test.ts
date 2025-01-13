import { compareVersions, getVersionStatus } from '@/lib/helpers/appVersion';

describe('compareVersions', () => {
	test('should return 0 when versions are equal', () => {
		expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
		expect(compareVersions('1.0.1', '1.0.1')).toBe(0);
	});

	test('should return 1 when the first version is greater', () => {
		expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
		expect(compareVersions('1.1.0', '1.0.5')).toBe(1);
	});

	test('should return -1 when the first version is smaller', () => {
		expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
		expect(compareVersions('1.0.5', '1.1.0')).toBe(-1);
	});
});

describe('getVersionStatus', () => {
	test('should return "outdated" when user version is less than the minimum version', () => {
		expect(getVersionStatus('1.0.1', '1.0.2', '1.0.3')).toBe('outdated');
		expect(getVersionStatus('0.9.9', '1.0.0', '1.0.1')).toBe('outdated');
	});

	test('should return "up-to-date" when user version is equal to the latest version', () => {
		expect(getVersionStatus('1.0.3', '1.0.2', '1.0.3')).toBe('up-to-date');
		expect(getVersionStatus('1.1.0', '1.0.5', '1.1.0')).toBe('up-to-date');
	});

	test('should return "minimum" when user version is between the minimum and latest version', () => {
		expect(getVersionStatus('1.0.2', '1.0.2', '1.0.3')).toBe('minimum');
		expect(getVersionStatus('1.0.5', '1.0.5', '1.1.0')).toBe('minimum');
	});

	test('should return "unknown" when a non-covered case is met', () => {
		expect(getVersionStatus('1.0.4', '1.0.3', '1.0.3')).toBe('unknown');
	});
});
