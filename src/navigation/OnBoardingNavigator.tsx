import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingStackParamList } from '@/lib/types/tabScreenParams';
import ProgressView from '@/screens/OnBoarding/ProgressView';
import InitialView from '@/screens/OnBoarding/InitialView';
import FinalView from '@/screens/OnBoarding/FinalView';

const StackOnBoarding = createStackNavigator<OnboardingStackParamList>();

const OnBoardingNavigator = () => {
	return (
		<StackOnBoarding.Navigator initialRouteName='InitialView'>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='InitialView'
				component={InitialView}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='ProgressView'
				component={ProgressView}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='FinalView'
				component={FinalView}
			/>
		</StackOnBoarding.Navigator>
	);
};

export default OnBoardingNavigator;
