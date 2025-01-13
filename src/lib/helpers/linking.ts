import * as Linking from 'expo-linking';

const prefix = Linking.createURL('');
const universal = 'https://discover.klikit.io/app';

const commonScreens = {
	SingleList: {
		path: 'list/:spotListId',
		parse: {
			spotListId: (spotListId: string) => Number(spotListId),
		},
	},

	ProfileScreen: {
		path: 'profile/:userId',
		parse: {
			userId: (userId: string) => Number(userId),
		},
	},
};

const config = {
	screens: {
		initialRouteName: 'TabScreens',
		ListCreate: 'create',
		ErrorScreen: 'error',
		SingleSpot: {
			path: 'spot/:spotId',
			parse: {
				spotId: (spotId: string) => Number(spotId),
			},
		},
		TabScreens: {
			path: '',
			initialRouteName: 'Home',
			screens: {
				Home: {
					initialRouteName: 'FeedScreen',
					path: 'home',
					screens: {
						FeedScreen: '/',
						...commonScreens,
					},
				},
				Discovery: {
					initialRouteName: 'DiscoveryScreen',
					path: 'discovery',
					screens: {
						DiscoveryScreen: '/',
						...commonScreens,
					},
				},
				Profile: {
					initialRouteName: 'MyProfileScreen',
					path: 'my_profile',
					screens: {
						MyProfileScreen: '/',
						...commonScreens,
					},
				},
			},
		},
	},
};

const linking = {
	prefixes: [prefix, universal],
	config,
};

export default linking;
