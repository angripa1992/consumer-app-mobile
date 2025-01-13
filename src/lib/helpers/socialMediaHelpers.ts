import { Platform } from 'react-native';
import Share, { Social } from 'react-native-share';
import * as Linking from 'expo-linking';
import {
	FACEBOOK_APP_STORE_LINK,
	FACEBOOK_PLAY_STORE_LINK,
	INSTAGRAM_APP_STORE_LINK,
	INSTAGRAM_PLAY_STORE_LINK,
} from '../utils/constants';

export const onShare = async (message: string) => {
	try {
		await Share.open({
			type: 'text',
			message,
		});
	} catch (error) {
		console.error(error);
	}
};

export const onShareInstagram = async (message: string) => {
	try {
		if (Platform.OS === 'ios') {
			const canOpenURL = await Linking.canOpenURL('instagram://');

			if (!canOpenURL) throw new Error('not installed');
		}

		await Share.shareSingle({
			social: Social.Instagram,
			type: 'text',
			message,
		});
	} catch (err) {
		const error = err as Error;
		const errorMessage = error.message;

		if (
			errorMessage === 'not installed' ||
			errorMessage.includes('No Activity found to handle Intent')
		) {
			const instagramStoreUrl =
				Platform.OS === 'ios'
					? INSTAGRAM_APP_STORE_LINK
					: INSTAGRAM_PLAY_STORE_LINK;

			await Linking.openURL(instagramStoreUrl);
		}
	}
};

export const onShareFacebook = async (
	onCopyToClipBoard: () => Promise<void>,
) => {
	try {
		if (Platform.OS === 'ios') {
			const canOpenURL = await Linking.canOpenURL('fb://');

			if (!canOpenURL) throw new Error('not installed');
		}

		await onCopyToClipBoard();
		await Linking.openURL(`fb://`);
	} catch (err) {
		const error = err as Error;
		const errorMessage = error.message;

		if (
			errorMessage === 'not installed' ||
			errorMessage.includes('No Activity found to handle Intent')
		) {
			const facebookUrl =
				Platform.OS === 'ios'
					? FACEBOOK_APP_STORE_LINK
					: FACEBOOK_PLAY_STORE_LINK;

			await Linking.openURL(facebookUrl);
		}
	}
};
