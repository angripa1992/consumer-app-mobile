import { createStackNavigator } from '@react-navigation/stack';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';

import SingleListScreen from '@/screens/Lists/SingleList';
import SearchSpotScreen from '@/screens/Spots/SearchSpot';
import MapScreen from '@/screens/Lists/MapScreen';
import ViewMore from '@/screens/ViewMore';
import DiscoveryScreen from '@/screens/Discovery';

import SpotListHeader from '@/UI/molecules/spotList/SpotListHeader';
import ProfileScreenHeader from '@/UI/molecules/profile/ProfileScreenHeader';
import ProfileScreen from '@/screens/Profile';
import FollowViewHeader from '@/UI/molecules/follow/FollowViewHeader';
import ProfileFollowersScreen from '@/screens/Profile/ProfileFollowers';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';

import type { DiscoveryStackParamList } from '@/lib/types/tabScreenParams';

const StackDiscovery = createStackNavigator<DiscoveryStackParamList>();

const DiscoveryStackNavigator = () => {
	const { isErrorScreen, isNotFoundScreen } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
		})),
	);

	const isError = isErrorScreen || isNotFoundScreen;

	return (
		<StackDiscovery.Navigator
			initialRouteName='DiscoveryScreen'
			screenOptions={{
				headerShown: !isError,
			}}
		>
			<StackDiscovery.Screen
				options={{
					header: () => <HeaderFeed />,
				}}
				name='DiscoveryScreen'
				component={DiscoveryScreen}
			/>
			<StackDiscovery.Screen
				options={{
					headerShown: false,
				}}
				name='SearchSpot'
				component={SearchSpotScreen}
			/>
			<StackDiscovery.Screen
				options={({ route, navigation }) => ({
					header: () => (
						<SpotListHeader navigation={navigation} route={route} />
					),
				})}
				name='SingleList'
				component={SingleListScreen}
			/>
			<StackDiscovery.Screen
				options={{
					headerShown: false,
				}}
				name='MapScreen'
				component={MapScreen}
			/>
			<StackDiscovery.Screen
				options={{
					headerShown: false,
				}}
				name='ViewMore'
				component={ViewMore}
			/>
			<StackDiscovery.Screen
				options={({ route }) => ({
					header: () => <ProfileScreenHeader userId={route.params.userId} />,
				})}
				name='ProfileScreen'
				component={ProfileScreen}
			/>

			<StackDiscovery.Screen
				options={({ route }) => ({
					header: () => <FollowViewHeader userId={route.params?.userId} />,
				})}
				name='FollowView'
				component={ProfileFollowersScreen}
			/>
		</StackDiscovery.Navigator>
	);
};

export default DiscoveryStackNavigator;
