import { createStackNavigator } from '@react-navigation/stack';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';

import SingleListScreen from '@/screens/Lists/SingleList';
import SearchSpotScreen from '@/screens/Spots/SearchSpot';

import SpotListHeader from '@/UI/molecules/spotList/SpotListHeader';
import Header from '@/UI/layouts/Header';
import MapScreen from '@/screens/Lists/MapScreen';
import ViewMore from '@/screens/ViewMore';
import ProfileScreenHeader from '@/UI/molecules/profile/ProfileScreenHeader';
import ProfileScreen from '@/screens/Profile';
import FollowViewHeader from '@/UI/molecules/follow/FollowViewHeader';
import ProfileFollowersScreen from '@/screens/Profile/ProfileFollowers';

import type { ListStackParamList } from '@/lib/types/tabScreenParams';

const StackList = createStackNavigator<ListStackParamList>();

const ListStackNavigator = () => {
	const { isErrorScreen, isNotFoundScreen } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
		})),
	);

	const isError = isErrorScreen || isNotFoundScreen;

	return (
		<StackList.Navigator
			initialRouteName='ListsScreen'
			screenOptions={{
				headerShown: !isError,
			}}
		>
			<StackList.Screen
				options={({ route, navigation }) => ({
					header: () => (
						<SpotListHeader navigation={navigation} route={route} />
					),
				})}
				name='SingleList'
				component={SingleListScreen}
			/>
			<StackList.Screen
				options={{
					headerShown: false,
				}}
				name='SearchSpot'
				component={SearchSpotScreen}
			/>
			<StackList.Screen
				options={{
					headerShown: false,
				}}
				name='ViewMore'
				component={ViewMore}
			/>
			<StackList.Screen
				options={{
					headerShown: false,
				}}
				name='MapScreen'
				component={MapScreen}
			/>
			<StackList.Screen
				options={({ route }) => ({
					header: () => <ProfileScreenHeader userId={route.params.userId} />,
				})}
				name='ProfileScreen'
				component={ProfileScreen}
			/>
			<StackList.Screen
				options={({ route }) => ({
					header: () => <FollowViewHeader userId={route.params?.userId} />,
				})}
				name='FollowView'
				component={ProfileFollowersScreen}
			/>
		</StackList.Navigator>
	);
};

export default ListStackNavigator;
