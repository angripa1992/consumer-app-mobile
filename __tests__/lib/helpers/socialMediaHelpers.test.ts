import { Platform } from 'react-native';
import Share, { Social } from 'react-native-share';
import * as Linking from 'expo-linking';
import {
	onShare,
	onShareInstagram,
	onShareFacebook,
} from '../../../src/lib/helpers/socialMediaHelpers';
import {
	FACEBOOK_PLAY_STORE_LINK,
	INSTAGRAM_APP_STORE_LINK,
	INSTAGRAM_PLAY_STORE_LINK,
} from '../../../src/lib/utils/constants';

jest.mock('react-native', () => ({
	Platform: {
		OS: 'ios',
	},
	Dimensions: {
		get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
	},
}));

jest.mock('react-native-share', () => ({
	open: jest.fn(),
	shareSingle: jest.fn(),
	Social: {
		Instagram: 'instagram',
	},
}));

jest.mock('expo-linking', () => ({
	canOpenURL: jest.fn(),
	openURL: jest.fn(),
}));

jest.mock('expo-application', () => ({
	nativeApplicationVersion: '1.0.0',
}));

describe('Sharing functions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('onShare', () => {
		it('should call Share.open with correct parameters', async () => {
			const message = 'Test message';
			await onShare(message);
			expect(Share.open).toHaveBeenCalledWith({
				type: 'text',
				message,
			});
		});

		it('should log error if Share.open throws', async () => {
			const consoleSpy = jest.spyOn(console, 'log');
			const error = new Error('Share error');
			(Share.open as jest.Mock).mockRejectedValueOnce(error);

			await onShare('Test message');

			expect(consoleSpy).toHaveBeenCalledWith(error);
		});
	});

	describe('onShareInstagram', () => {
		it('should call Share.shareSingle with correct parameters on iOS', async () => {
			(Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);
			const message = 'Test Instagram message';

			await onShareInstagram(message);

			expect(Linking.canOpenURL).toHaveBeenCalledWith('instagram://');
			expect(Share.shareSingle).toHaveBeenCalledWith({
				social: Social.Instagram,
				type: 'text',
				message,
			});
		});

		it('should open App Store if Instagram is not installed on iOS', async () => {
			(Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);
			const message = 'Test Instagram message';

			await onShareInstagram(message);

			expect(Linking.openURL).toHaveBeenCalledWith(INSTAGRAM_APP_STORE_LINK);
		});

		it('should open Play Store if Instagram is not installed on Android', async () => {
			Platform.OS = 'android';
			(Share.shareSingle as jest.Mock).mockRejectedValueOnce(
				new Error('No Activity found to handle Intent'),
			);

			await onShareInstagram('Test message');

			expect(Linking.openURL).toHaveBeenCalledWith(INSTAGRAM_PLAY_STORE_LINK);
		});
	});

	describe('onShareFacebook', () => {
		const mockOnCopyToClipBoard = jest.fn();

		beforeEach(() => {
			Platform.OS = 'ios';
		});

		it('should call onCopyToClipBoard and open Facebook app on iOS when installed', async () => {
			(Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);

			await onShareFacebook(mockOnCopyToClipBoard);

			expect(Linking.canOpenURL).toHaveBeenCalledWith('fb://');
			expect(mockOnCopyToClipBoard).toHaveBeenCalled();
			expect(Linking.openURL).toHaveBeenCalledWith('fb://');
		});

		it('should open Facebook app on Android when installed', async () => {
			Platform.OS = 'android';

			await onShareFacebook(mockOnCopyToClipBoard);

			expect(mockOnCopyToClipBoard).toHaveBeenCalled();
			expect(Linking.openURL).toHaveBeenCalledWith('fb://');
		});

		it('should open Play Store if Facebook is not installed on Android', async () => {
			Platform.OS = 'android';
			(Linking.openURL as jest.Mock).mockRejectedValueOnce(
				new Error('No Activity found to handle Intent'),
			);

			await onShareFacebook(mockOnCopyToClipBoard);

			expect(mockOnCopyToClipBoard).toHaveBeenCalled();
			expect(Linking.openURL).toHaveBeenCalledWith(FACEBOOK_PLAY_STORE_LINK);
		});
	});
});
