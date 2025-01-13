import { createStackNavigator } from '@react-navigation/stack';
import { useShallow } from 'zustand/react/shallow';

import { ProfileStackParamList } from '@/lib/types/tabScreenParams';
import { useAppStore } from '@/lib/store/store';

import ProfileFollowersScreen from '@/screens/Profile/ProfileFollowers';
import ProfileScreen from '@/screens/Profile';
import ViewMore from '@/screens/ViewMore';
import SingleListScreen from '@/screens/Lists/SingleList';
import MapScreen from '@/screens/Lists/MapScreen';
import SearchSpotScreen from '@/screens/Spots/SearchSpot';
import MyProfileScreen from '@/screens/Profile/MyProfile';

import ProfileScreenHeader from '@/UI/molecules/profile/ProfileScreenHeader';
import FollowViewHeader from '@/UI/molecules/follow/FollowViewHeader';
import SpotListHeader from '@/UI/molecules/spotList/SpotListHeader';

const StackProfile = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
	const { user, isErrorScreen, isNotFoundScreen } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
		})),
	);
	const isError = isErrorScreen || isNotFoundScreen;

	return (
		<StackProfile.Navigator
			initialRouteName='MyProfileScreen'
			screenOptions={{
				headerShown: !isError,
			}}
		>
			<StackProfile.Screen
				options={() => ({
					header: () => (
						<ProfileScreenHeader hideBackButton userId={user?.id as number} />
					),
				})}
				name='MyProfileScreen'
				component={MyProfileScreen}
			/>
			<StackProfile.Screen
				options={({ route }) => ({
					header: () => <ProfileScreenHeader userId={route.params.userId} />,
				})}
				name='ProfileScreen'
				component={ProfileScreen}
			/>
			<StackProfile.Screen
				options={({ route }) => ({
					header: () => <FollowViewHeader userId={route.params.userId} />,
				})}
				name='FollowView'
				component={ProfileFollowersScreen}
			/>
			<StackProfile.Screen
				options={({ route, navigation }) => ({
					header: () => (
						<SpotListHeader navigation={navigation} route={route} />
					),
				})}
				name='SingleList'
				component={SingleListScreen}
			/>
			<StackProfile.Screen
				options={{
					headerShown: false,
				}}
				name='SearchSpot'
				component={SearchSpotScreen}
			/>
			<StackProfile.Screen
				options={{
					headerShown: false,
				}}
				name='MapScreen'
				component={MapScreen}
			/>
			<StackProfile.Screen
				options={{
					headerShown: false,
				}}
				name='ViewMore'
				component={ViewMore}
			/>
		</StackProfile.Navigator>
	);
};

export default ProfileNavigator;
