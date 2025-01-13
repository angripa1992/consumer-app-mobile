import { View } from 'react-native';
import {
	BottomTabNavigationOptions,
	createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo } from 'react';
import { useURL } from 'expo-linking';
import { useShallow } from 'zustand/react/shallow';
import * as Notifications from 'expo-notifications';

import { i18nInstance } from 'config/i18n';
import { visitPlayScreen } from '@/lib/helpers/analytics/customEvents';
import { useAppStore } from '@/lib/store/store';
import {
	fetchGetNotificationTokens,
	usePostNotificationToken,
} from '@/lib/hooks/useQueryNotifications';

import ProfileNavigator from './ProfileNavigator';
import DiscoveryStackNavigator from './DiscoveryNavigator';
import FeedStackNavigator from './FeedNavigator';

import TextElement from '@/UI/atoms/text/TextElement';
import PlayIcon from '@/UI/assets/svg/PlayIcon';
import SearchIcon from '@/UI/assets/svg/SearchIcon';
import CrossIcon from '@/UI/assets/svg/CrossIcon';
import HomeIcon from '@/UI/assets/svg/HomeIcon';
import PlayScreen from '@/screens/Play/PlayScreen';

import type { ProfileScreenNavigationProp } from '@/lib/types/tabScreenParams';
import CustomImage from '@/UI/atoms/image/CustomImage';
import { useGetUser } from '@/lib/hooks/useQueryUser';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
	const url = useURL();
	const { mutateAsync: postNotificationToken } = usePostNotificationToken();

	const navigation = useNavigation<ProfileScreenNavigationProp>();
	const { isErrorScreen, isNotFoundScreen, appUserId } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
			appUserId: state.user?.id,
		})),
	);

	const { user } = useGetUser(appUserId);
	const containerStyle = 'bg-dark-black flex-1';

	const baseTabBarStyle = {
		backgroundColor: '#1C1C1C',
		borderTopColor: '#1C1C1C',
		borderRadius: 10,
		height: 75,
		paddingHorizontal: 0,
		paddingVertical: 12,
		marginVertical: 10,
		marginHorizontal: 10,
	};

	const tabItemStyles = 'flex flex-col h-full items-center';

	const tabItemTextStyles = (focused: boolean) =>
		`text-xs mt-2 ${focused ? 'text-white' : 'text-admin-tag-gray'}`;

	const tabItemIconStyles = (focused: boolean) =>
		focused ? '#FFFFFF' : '#575757';

	const screenOptions: BottomTabNavigationOptions = useMemo(() => {
		const displayTabBar = isErrorScreen || isNotFoundScreen;
		const displayTabBarStyle = displayTabBar ? 'none' : 'flex';

		return {
			tabBarShowLabel: false,
			tabBarStyle: {
				...baseTabBarStyle,
				display: displayTabBarStyle,
			},
			headerShown: false,
			tabBarLabelPosition: 'below-icon',
		};
	}, [isErrorScreen, isNotFoundScreen]);

	useEffect(() => {
		const registerForPushNotificationsAsync = async () => {
			const tokensData = await fetchGetNotificationTokens();

			const tokens = tokensData?.tokens || [];
			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;
			if (!projectId) {
				throw new Error('Project ID not found');
			}
			const token = await Notifications.getExpoPushTokenAsync({ projectId });
			const { data } = token;

			if (tokens.includes(data)) return;

			await postNotificationToken(data);
		};

		registerForPushNotificationsAsync();
	}, []);

	useEffect(() => {
		if (url && url.includes('followUserId')) {
			const userId = url.split('=')[1];

			navigation.navigate('ProfileScreen', {
				userId: Number(userId),
				isFollow: true,
			});
		}
	}, [url]);

	return (
		<View className={containerStyle}>
			<Tab.Navigator initialRouteName='Home' screenOptions={screenOptions}>
				<Tab.Screen
					name='Home'
					component={FeedStackNavigator}
					options={{
						tabBarIcon: ({ focused }) => (
							<View className={tabItemStyles}>
								<HomeIcon
									color={tabItemIconStyles(focused)}
									width={24}
									height={24}
								/>
								<TextElement textStyles={tabItemTextStyles(focused)}>
									{i18nInstance.t('feed')}
								</TextElement>
							</View>
						),
					}}
				/>
				<Tab.Screen
					name='Discovery'
					component={DiscoveryStackNavigator}
					options={{
						tabBarIcon: ({ focused }) => (
							<View className={tabItemStyles}>
								<SearchIcon color={tabItemIconStyles(focused)} />
								<TextElement textStyles={tabItemTextStyles(focused)}>
									{i18nInstance.t('explore')}
								</TextElement>
							</View>
						),
					}}
				/>
				<Tab.Screen
					name='Create'
					component={function CreateScreen() {
						return null;
					}}
					listeners={({ navigation }) => {
						return {
							tabPress: (e) => {
								e.preventDefault();
								navigation.navigate('ListCreate');
							},
						};
					}}
					options={{
						tabBarIcon: ({ focused }) => (
							<View className={tabItemStyles} testID='create-nav-button'>
								<CrossIcon color={tabItemIconStyles(focused)} />
								<TextElement textStyles={tabItemTextStyles(focused)}>
									{i18nInstance.t('create')}
								</TextElement>
							</View>
						),
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name='Play'
					component={PlayScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<View className={tabItemStyles} testID='play-nav-button'>
								<PlayIcon color={tabItemIconStyles(focused)} />
								<TextElement textStyles={tabItemTextStyles(focused)}>
									{i18nInstance.t('play')}
								</TextElement>
							</View>
						),
						headerShown: false,
					}}
					listeners={({ navigation }) => {
						return {
							tabPress: (e) => {
								e.preventDefault();
								if (user?.email && user?.id) {
									visitPlayScreen({
										email: user?.email,
										user_id: user?.id,
									});
								}

								navigation.navigate('Play');
							},
						};
					}}
				/>
				<Tab.Screen
					name='Profile'
					component={ProfileNavigator}
					options={{
						tabBarIcon: ({ focused }) => (
							<View className={tabItemStyles} testID='profile-nav-button'>
								<CustomImage
									imageSrc={user?.profile_image_url}
									className='h-[25px] w-[25px] rounded-full'
									typeDefaultImage='profile'
								/>
								<TextElement textStyles={tabItemTextStyles(focused)}>
									{i18nInstance.t('profile')}
								</TextElement>
							</View>
						),
						headerShown: false,
					}}
				/>
			</Tab.Navigator>
		</View>
	);
};

export default TabNavigator;
