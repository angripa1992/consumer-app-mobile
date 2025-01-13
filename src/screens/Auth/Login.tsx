import {
	Platform,
	Keyboard,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
} from 'react-native';

import { i18nInstance } from 'config/i18n';

import Header from '@/UI/layouts/Header';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import SocialMediaAuth from '@/UI/molecules/login/SocialMediaAuth';
import LoginLogo from '@/UI/assets/svg/LoginLogo';
import HeaderGreen from '@/images/layout/background-layout-green.png';

import { useAuthSignIn } from '@/lib/hooks/useAuthSignIn';

import type { AuthLoginRouteParams } from '@/lib/types/tabScreenParams';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import { Image } from 'expo-image';

const Login = ({ navigation }: AuthLoginRouteParams) => {
	const {
		formLoginMethods,
		onAppleButtonPress,
		onHandleLogin,
		onGoogleButtonPress,
	} = useAuthSignIn('login');

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = formLoginMethods;

	const handleRedirectToForgotPassword = () =>
		navigation.navigate('ForgotPassword');

	const handleRedirectToSignUp = () => navigation.navigate('SignUp');

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className='flex-1'
		>
			<TouchableWithoutFeedback touchSoundDisabled onPress={Keyboard.dismiss}>
				<View className='bg-[#1c1c1c] flex-1 px-5 relative pt-10 '>
					<Image
						source={HeaderGreen}
						className='h-[250px] w-screen absolute left-0 top-0 z-[-1]'
					/>
					<Header
						showDefaultHeader={false}
						headerContainerStyles='!bg-transparent'
						headerStyles='!bg-transparent px-0 flex-row justify-between'
					>
						<LoginLogo />
						<ChangeLanguageButton />
					</Header>
					<View className='mt-12'>
						<InputForm
							control={control}
							placeholder={i18nInstance.t('yourEmailAccount')}
							name='email'
							inputStyles='text-white text-xs'
							placeholderTextColor='#B0B0B0'
							label={i18nInstance.t('email')}
							error={errors.email}
							autoComplete='email'
							keyboardType='email-address'
							textContentType='emailAddress'
							autoCapitalize='none'
							autoCorrect={false}
							testID='email'
							style={styles.inputStyles}
						/>
						<InputForm
							control={control}
							placeholder=''
							name='password'
							label={i18nInstance.t('password')}
							inputStyles='text-white text-xs'
							containerStyles='mt-4'
							placeholderTextColor='#B0B0B0'
							error={errors.password}
							testID='password'
							isPassword
							style={styles.inputStyles}
						/>
						<ButtonPrimary
							designVariation='ghost'
							textStyles='text-left text-white'
							buttonStyles='!w-[160px] !p-0 mt-2'
							onPress={handleRedirectToForgotPassword}
						>
							{i18nInstance.t('forgotYourPassword')}
						</ButtonPrimary>
						<ButtonPrimary
							designVariation='green'
							onPress={handleSubmit(onHandleLogin)}
							buttonStyles='mt-5 font-medium'
						>
							{i18nInstance.t('logIn')}
						</ButtonPrimary>
						<SocialMediaAuth
							typeLoginView='login'
							onAppleButtonPress={onAppleButtonPress}
							onGoogleButtonPress={onGoogleButtonPress}
							handleRedirect={handleRedirectToSignUp}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	inputStyles: {
		fontSize: 12,
	},
});

export default Login;
