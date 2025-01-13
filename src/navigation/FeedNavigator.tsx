import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { createStackNavigator } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';

import { useAppStore } from '@/lib/store/store';

import FeedScreen from '@/screens/Feed';
import SingleListScreen from '@/screens/Lists/SingleList';
import ProfileScreen from '@/screens/Profile';
import SearchSpotScreen from '@/screens/Spots/SearchSpot';
import MapScreen from '@/screens/Lists/MapScreen';
import ViewMore from '@/screens/ViewMore';

import SpotListHeader from '@/UI/molecules/spotList/SpotListHeader';
import ProfileScreenHeader from '@/UI/molecules/profile/ProfileScreenHeader';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';
import FollowViewHeader from '@/UI/molecules/follow/FollowViewHeader';
import ProfileFollowersScreen from '@/screens/Profile/ProfileFollowers';

import type { FeedStackParamList } from '@/lib/types/tabScreenParams';
import Notifications from '@/screens/Notifications';

const StackFeed = createStackNavigator<FeedStackParamList>();

const feedScreenOptions = {
	header: () => <HeaderFeed />,
};

const FeedNavigator = () => {
	const { isErrorScreen, isNotFoundScreen } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
		})),
	);

	const singleListOptions = useCallback(
		({
			route,
			navigation,
		}: StackScreenProps<FeedStackParamList, 'SingleList'>) => ({
			// TODO: Fix this type
			header: () => (
				<SpotListHeader navigation={navigation as any} route={route} />
			),
		}),
		[],
	);

	const profileScreenOptions = useCallback(
		({ route }: StackScreenProps<FeedStackParamList, 'ProfileScreen'>) => ({
			header: () => <ProfileScreenHeader userId={route.params.userId} />,
		}),
		[],
	);

	const followViewOptions = useCallback(
		({ route }: StackScreenProps<FeedStackParamList, 'FollowView'>) => ({
			header: () => <FollowViewHeader userId={route.params.userId} />,
		}),
		[],
	);

	const isError = isErrorScreen || isNotFoundScreen;

	return (
		<StackFeed.Navigator
			initialRouteName='FeedScreen'
			screenOptions={{
				headerShown: !isError,
			}}
		>
			<StackFeed.Screen
				name='FeedScreen'
				options={feedScreenOptions}
				component={FeedScreen}
			/>
			<StackFeed.Screen
				options={{
					headerShown: false,
				}}
				name='Notifications'
				component={Notifications}
			/>
			<StackFeed.Screen
				name='SingleList'
				options={singleListOptions}
				component={SingleListScreen}
			/>
			<StackFeed.Screen
				name='ProfileScreen'
				options={profileScreenOptions}
				component={ProfileScreen}
			/>
			<StackFeed.Screen
				name='FollowView'
				options={followViewOptions}
				component={ProfileFollowersScreen}
			/>
			<StackFeed.Screen
				options={{
					headerShown: false,
				}}
				name='SearchSpot'
				component={SearchSpotScreen}
			/>
			<StackFeed.Screen
				options={{
					headerShown: false,
				}}
				name='MapScreen'
				component={MapScreen}
			/>
			<StackFeed.Screen
				options={{
					headerShown: false,
				}}
				name='ViewMore'
				component={ViewMore}
			/>
		</StackFeed.Navigator>
	);
};

export default FeedNavigator;
