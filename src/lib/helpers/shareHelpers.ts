import { Platform, Share } from 'react-native';
import {
	APP_STORE_LINK,
	GOOGLE_PLAY_STORE_LINK,
	appDeepLink,
} from '../utils/constants';

import type { TypeShareEntity } from '../types/app';

export const linkToShare = (type: TypeShareEntity, id?: number) => {
	const linkForDownloadApp = `${Platform.OS === 'ios' ? APP_STORE_LINK : GOOGLE_PLAY_STORE_LINK}`;
	const linkForSpot = `${appDeepLink}/spot/${id}`;
	const linkForSpotList = `${appDeepLink}/home/list/${id}`;
	const linkForProfile = `${appDeepLink}/home/profile/${id}`;

	if (type === 'spot') {
		return linkForSpot;
	}
	if (type === 'spotList') {
		return linkForSpotList;
	}
	if (type === 'user') {
		return linkForProfile;
	}
	if (type === 'app') {
		return linkForDownloadApp;
	}
	return '';
};

export const onPressShare = async (type: TypeShareEntity, id?: number) => {
	try {
		await Share.share({
			message: linkToShare(type, id),
		});
	} catch (error) {
		console.error(error);
	}
};
