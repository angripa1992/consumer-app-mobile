import { Dimensions, Platform } from 'react-native';
import * as Application from 'expo-application';

export const webLink = 'https://discover.klikit.io';
export const appDeepLink = 'https://discover.klikit.io/app';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const APP_VERSION = Application.nativeApplicationVersion;

export const ME_LINK = 'https://me.klikit.io/';

export const APP_STORE_LINK =
	'itms-apps://apps.apple.com/us/app/klikit/id6468717838';

export const GOOGLE_PLAY_STORE_LINK =
	'https://play.google.com/store/apps/details?id=klikit.io.consumer';

export const STORAGE_KEY_FOR_EMOJIS = 'emoji-picker-recent-picks';

export const INSTAGRAM_APP_STORE_LINK =
	'itms-apps://apps.apple.com/us/app/instagram/id389801252';
export const INSTAGRAM_PLAY_STORE_LINK =
	'https://play.google.com/store/apps/details?id=com.instagram.android';

export const FACEBOOK_APP_STORE_LINK =
	'itms-apps://apps.apple.com/us/app/facebook/id284882215';
export const FACEBOOK_PLAY_STORE_LINK =
	'https://play.google.com/store/apps/details?id=com.facebook.katana';

export const skipWaitListCodeMessage = (code: string) => {
	return `🚀Hey! Skip the waitlist and jump straight into Klikit with my VIP code: ${code} 🔥 Let's get in early and enjoy the perks! 😎✨`;
};

export const TAROT_TASTE_QUIZ = 'https://klikit.io/consumer/taste-test';

export const ALL_CITIES = 'global';

export const APP_WIDTH = Dimensions.get('window').width;
export const APP_HEIGHT = Dimensions.get('window').height;

//tarot

export const TAROT_CARD_WIDTH = APP_WIDTH > 315 ? 315 : APP_WIDTH - 20;
export const TAROT_CARD_HEIGHT = 390;

// Queries

export const LIMIT_SEARCH_SPOT_CANDIDATES = 10;
export const LIMIT_SEARCH_SPOT_AVAILABLE = 20;
export const LIMIT_USER_LISTS = 10;
export const LIMIT_USER_FOLLOWERS = 10;
export const LIMIT_VIEW_MORE = 20;
export const LIMIT_FEED = 20;
export const LIMIT_SCRIBBLES = 20;
export const LIMIT_LIKES_FOR_SPOT = 20;

export const LIMIT_DISCOVERY = 20;
export const LIMIT_SPOT_LIST_SPOTS = 8;
export const LIMIT_DISCOVERY_SPOTS = 10;

export const LIMIT_FEATURED_LISTS = 20;
export const LIMIT_NOTIFICATIONS = 20;

export const LIMIT_PEOPLE = 20;

// regex
export const noSpacesRegex = /^[^\s]+$/;

// animations

export const PARTICLE_COUNT = 5;
export const DISTANCE_PARTICLES = 10;
export const HEART_BUTTON_PINK_COLOR = '#DF27B4';
export const LIST_BUTTON_YELLOW_COLOR = '#fefd5d';
export const BUTTON_GRAY_COLOR = '#666';
