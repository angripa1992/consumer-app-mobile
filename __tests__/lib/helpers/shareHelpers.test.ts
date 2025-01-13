import { Platform } from 'react-native';
import { linkToShare } from '@/lib/helpers/shareHelpers';
import {
	APP_STORE_LINK,
	GOOGLE_PLAY_STORE_LINK,
	appDeepLink,
} from '@/lib/utils/constants';

import type { TypeShareEntity } from '@/lib/types/app';

jest.mock('expo-application', () => ({
	nativeApplicationVersion: '1.0.0',
}));

describe('linkToShare', () => {
	beforeEach(() => {
		Platform.OS = 'ios';
	});

	it('should return the correct app download link for iOS', () => {
		Platform.OS = 'ios';
		const result = linkToShare('app');
		expect(result).toBe(APP_STORE_LINK);
	});

	it('should return the correct app download link for Android', () => {
		Platform.OS = 'android';
		const result = linkToShare('app');
		expect(result).toBe(GOOGLE_PLAY_STORE_LINK);
	});

	it('should return the correct spot deep link', () => {
		const result = linkToShare('spot', 123);
		expect(result).toBe(`${appDeepLink}/spot/123`);
	});

	it('should return the correct spot list deep link', () => {
		const result = linkToShare('spotList', 456);
		expect(result).toBe(`${appDeepLink}/home/list/456`);
	});

	it('should return the correct user profile deep link', () => {
		const result = linkToShare('user', 789);
		expect(result).toBe(`${appDeepLink}/home/profile/789`);
	});

	it('should return an empty string for unknown type', () => {
		const result = linkToShare('unknown' as TypeShareEntity);
		expect(result).toBe('');
	});
});
