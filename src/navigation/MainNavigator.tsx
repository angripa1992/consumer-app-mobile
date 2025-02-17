import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import useMainNavigator from '@/lib/hooks/useMainNavigator';

import ListEditScreen from '@/screens/Lists/ListEdit';
import ListCreateScreen from '@/screens/Lists/ListCreate';
import CreateBasicSpot from '@/screens/Spots/CreateBasicSpot';
import InviteFriends from '@/screens/InviteFriends';
import ErrorScreen from '@/screens/ErrorScreen';
import LikesForSpot from '@/screens/Spots/LikesForSpot';
import ScribblesForSpot from '@/screens/Spots/ScribblesForSpot';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import ProfileCreateScreen from '@/screens/Profile/ProfileForm';
import OnBoardingNavigator from './OnBoardingNavigator';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import ListsForSpotScreen from '@/screens/Spots/ListsForSpot';
import SpotListHeader from '@/UI/molecules/spotList/SpotListHeader';
import SingleListScreen from '@/screens/Lists/SingleList';
import SearchSpotScreen from '@/screens/Spots/SearchSpot';
import MapScreen from '@/screens/Lists/MapScreen';
import ProfileScreenHeader from '@/UI/molecules/profile/ProfileScreenHeader';
import ProfileScreen from '@/screens/Profile';
import FollowViewHeader from '@/UI/molecules/follow/FollowViewHeader';
import ProfileFollowersScreen from '@/screens/Profile/ProfileFollowers';
import SingleSpotScreen from '@/screens/Spots';
import ForceUpdateCheckerModal from '@/UI/organism/modal/ForceUpdateModal';
import UpdateAppWarningModal from '@/UI/organism/modal/UpdateAppWarningModal';
import StagingWarningModal from '@/UI/organism/modal/StagingWarningModal';

import type { AppStackParamList } from '@/lib/types/tabScreenParams';
import { Video, ResizeMode } from 'expo-av';
import React from 'react';
import PlayNavigator from './PlayNavigator';

const Stack = createStackNavigator<AppStackParamList>();

const headerHiddenOptions = { headerShown: false };
const headerHiddenNoGestureScreenOptions = {
	...headerHiddenOptions,
	gestureEnabled: false,
};

const MainNavigator = () => {
	const {
		isLoadingAuth,
		userAuth,
		appUser,
		showStagingWarningModal,
		setShowStagingWarningModal,
		isOutdateAppError,
		setIsOutdateAppError,
		isAuthenticating,
	} = useMainNavigator();

	if (isLoadingAuth) {
		return (
			<View className='flex-1 bg-black'>
				<Video
					className='flex-1'
					source={require('../UI/assets/videos/splash-screen.mp4')}
					resizeMode={ResizeMode.CONTAIN}
					shouldPlay
					isLooping
					isMuted
				/>
			</View>
		);
	}

	const loggedIn = !!(userAuth && appUser);

	const modalsToRender = () => {
		return (
			<>
				{showStagingWarningModal && (
					<StagingWarningModal
						showModal={showStagingWarningModal}
						setShowModal={setShowStagingWarningModal}
					/>
				)}
				<ForceUpdateCheckerModal />

				{isOutdateAppError && (
					<UpdateAppWarningModal setShowModal={setIsOutdateAppError} />
				)}
			</>
		);
	};

	if (!loggedIn) {
		return <AuthNavigator />;
	}

	const isUserOnBoardingCompleted = appUser?.is_onboarding_complete;

	if (!isUserOnBoardingCompleted) {
		return <OnBoardingNavigator />;
	}
	return (
		<>
			{!__DEV__ && modalsToRender()}
			<Stack.Navigator
				initialRouteName='TabScreens'
				screenOptions={headerHiddenOptions}
			>
				<Stack.Screen
					options={{
						header: () => <HeaderGoBack title='Edit Profile' />,
						headerShown: true,
					}}
					name='ProfileForm'
					component={ProfileCreateScreen}
				/>
				<Stack.Screen
					options={headerHiddenNoGestureScreenOptions}
					name='ListEdit'
					component={ListEditScreen}
				/>
				<Stack.Screen
					options={headerHiddenNoGestureScreenOptions}
					name='ListCreate'
					component={ListCreateScreen}
				/>
				<Stack.Screen
					options={headerHiddenNoGestureScreenOptions}
					name='CreateBasicSpot'
					component={CreateBasicSpot}
				/>
				<Stack.Screen
					options={headerHiddenNoGestureScreenOptions}
					name='InviteFriends'
					component={InviteFriends}
				/>
				<Stack.Screen
					name='LikesForSpot'
					options={headerHiddenNoGestureScreenOptions}
					component={LikesForSpot}
				/>
				<Stack.Screen
					name='ScribblesForSpot'
					options={headerHiddenNoGestureScreenOptions}
					component={ScribblesForSpot}
				/>
				<Stack.Screen
					name='ListsForSpot'
					options={headerHiddenNoGestureScreenOptions}
					component={ListsForSpotScreen}
				/>
				<Stack.Screen
					name='SingleList'
					options={({ route, navigation }) => ({
						headerShown: true,
						header: () => (
							<SpotListHeader navigation={navigation} route={route} />
						),
					})}
					component={SingleListScreen}
				/>
				<Stack.Screen
					options={headerHiddenOptions}
					name='SearchSpot'
					component={SearchSpotScreen}
				/>
				<Stack.Screen
					options={headerHiddenOptions}
					name='MapScreen'
					component={MapScreen}
				/>
				<Stack.Screen
					options={({ route }) => ({
						headerShown: true,
						header: () => <ProfileScreenHeader userId={route.params.userId} />,
					})}
					name='ProfileScreen'
					component={ProfileScreen}
				/>
				<Stack.Screen
					options={({ route }) => ({
						header: () => <FollowViewHeader userId={route.params.userId} />,
					})}
					name='FollowView'
					component={ProfileFollowersScreen}
				/>
				<Stack.Screen
					options={headerHiddenOptions}
					name='SingleSpot'
					component={SingleSpotScreen}
				/>

				<Stack.Screen name='ErrorScreen' component={ErrorScreen} />
				<Stack.Screen name='TabScreens' component={TabNavigator} />
				<Stack.Screen name="PlayNavigator" component={PlayNavigator} />
			</Stack.Navigator>

		</>
	);
};

export default MainNavigator;
