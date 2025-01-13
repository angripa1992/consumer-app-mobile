import { Platform } from 'react-native';
import { APP_HEIGHT } from '../utils/constants';

export const emojiPickerTheme = {
	knob: '#fff',
	container: '#161616',
	header: '#fff',
	category: {
		icon: '#fff',
		iconActive: '#000',
		container: '#232427',
		containerActive: '#fff',
	},
	search: {
		text: '#fff',
		placeholder: '#fff6',
		background: '#232427',
	},
};

export const emojiPickerDefaultHeight = APP_HEIGHT >= 932 ? '55%' : '45%';
export const emojiPickerDefaultExpandableHeight =
	Platform.OS === 'ios' ? '80%' : '65%';
