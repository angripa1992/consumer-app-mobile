import { Platform, KeyboardAvoidingView } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';
import { useAuthSignIn } from '@/lib/hooks/useAuthSignIn';

import SignUpForm from '@/UI/organism/signUp/SignUpForm';
import SignUpContactSoon from '@/UI/organism/signUp/SignUpContactSoon';

import type { AuthSignUpRouteParams } from '@/lib/types/tabScreenParams';

const SignUp = ({ navigation }: AuthSignUpRouteParams) => {
	const { showWaitlistContactSoonScreen, setShowWaitlistContactSoonScreen } =
		useAppStore(
			useShallow((state) => ({
				showWaitlistContactSoonScreen: state.showWaitlistContactSoonScreen,
				setShowWaitlistContactSoonScreen:
					state.setShowWaitlistContactSoonScreen,
			})),
		);

	const {
		formSignUpMethods,
		onAppleButtonPress,
		onHandleSignUp,
		onGoogleButtonPress,
		approvedStatus,
	} = useAuthSignIn('register');

	const { watch, setError, clearErrors } = formSignUpMethods;

	const countryValue = watch('city');

	const handleRedirectToLogin = () => navigation.navigate('Login');

	const handlerGoogleSignUp = () => {
		if (countryValue) {
			onGoogleButtonPress();
		} else {
			clearErrors();
			setError('city', {
				type: 'manual',
				message: 'countryCannotEmpty',
			});
		}
	};

	const handlerAppleSignUp = () => {
		if (countryValue) {
			onAppleButtonPress();
		} else {
			clearErrors();
			setError('city', {
				type: 'manual',
				message: 'countryCannotEmpty',
			});
		}
	};

	const handleBackToSignUp = () => {
		setShowWaitlistContactSoonScreen('form');
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className='flex-1 bg-layout-black'
		>
			{showWaitlistContactSoonScreen === 'form' && (
				<SignUpForm
					formMethods={formSignUpMethods}
					onHandleSignUp={onHandleSignUp}
					handlerAppleSignUp={handlerAppleSignUp}
					handlerGoogleSignUp={handlerGoogleSignUp}
					handleRedirectToLogin={handleRedirectToLogin}
					approvedStatus={approvedStatus}
				/>
			)}
			{showWaitlistContactSoonScreen == 'contactSoon' && (
				<SignUpContactSoon onBackPress={handleBackToSignUp} />
			)}
		</KeyboardAvoidingView>
	);
};

export default SignUp;
