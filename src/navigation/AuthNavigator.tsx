import { createStackNavigator } from '@react-navigation/stack';

import Login from '@/screens/Auth/Login';
import SignUp from '@/screens/Auth/SignUp';
import ForgotPassword from '@/screens/Auth/ForgotPassword';
import WaitListUseCode from '@/screens/Auth/WaitListUseCode';
import WaitListShareUs from '@/screens/Auth/WaitListShareUs';
import WaitListInviteFriends from '@/screens/Auth/WaitListInviteFriends';
import WaitListTasteTarot from '@/screens/Auth/WaitListTarotTaste';

import type { AuthStackParamList } from '@/lib/types/tabScreenParams';

const AuthNavigator = () => {
	const StackOnBoarding = createStackNavigator<AuthStackParamList>();

	return (
		<StackOnBoarding.Navigator initialRouteName='SignUp'>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='Login'
				component={Login}
			/>

			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='SignUp'
				component={SignUp}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='ForgotPassword'
				component={ForgotPassword}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='WaitListUseCode'
				component={WaitListUseCode}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='WaitListShareUs'
				component={WaitListShareUs}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='WaitListTarotQuiz'
				component={WaitListTasteTarot}
			/>
			<StackOnBoarding.Screen
				options={{
					headerShown: false,
				}}
				name='WaitListInviteFriends'
				component={WaitListInviteFriends}
			/>
		</StackOnBoarding.Navigator>
	);
};

export default AuthNavigator;
