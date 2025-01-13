import * as Linking from 'expo-linking';
import { Toast } from 'react-native-toast-notifications';
import { isPhoneNumber } from './isPhoneNumber';
import { isEmail } from './strings/isEmail';
import { addHttpPrefix } from './addHttpPrefix';

export const handleLinkPress = async (url?: string | null) => {
	if (!url) return;

	let urlToOpen = url;

	if (isPhoneNumber(url)) {
		urlToOpen = `tel:${url.split(' ').join('')}`;
	} else if (isEmail(url)) {
		urlToOpen = `mailto:${url}`;
	} else {
		urlToOpen = addHttpPrefix(url);
	}

	await Linking.openURL(urlToOpen);
};
