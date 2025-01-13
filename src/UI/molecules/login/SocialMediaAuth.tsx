import { Platform, View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import GoogleIcon from '@/UI/assets/svg/Google';
import AppleIcon from '@/UI/assets/svg/Apple';

import type { TypeLoginFormView } from '@/lib/types/login';

type TypeSocialMediaAuthProps = {
	typeLoginView: TypeLoginFormView;
	onAppleButtonPress: () => void;
	onGoogleButtonPress: () => void;
	handleRedirect: () => void;
};

const SocialMediaAuth = ({
	typeLoginView,
	onAppleButtonPress,
	onGoogleButtonPress,
	handleRedirect,
}: TypeSocialMediaAuthProps) => {
	const socialButtonTextStyles = '!text-white ml-3 text-xs';
	const socialContainerStyles = 'flex flex-row justify-center  items-center';
	const isLoginView = typeLoginView === 'login';

	const loginButtonText = (typeSocialMedia: 'apple' | 'google') => {
		if (isLoginView && typeSocialMedia === 'apple') {
			return i18nInstance.t('logInWithApple');
		} else if (!isLoginView && typeSocialMedia === 'apple') {
			return i18nInstance.t('signUpWithApple');
		}
		if (isLoginView && typeSocialMedia === 'google') {
			return i18nInstance.t('logInWithGoogle');
		} else if (!isLoginView && typeSocialMedia === 'google') {
			return i18nInstance.t('signUpWithGoogle');
		}
		return '';
	};

	const loginRedirectText = isLoginView
		? i18nInstance.t('signUp')
		: i18nInstance.t('logIn');
	const loginQuestionText = isLoginView
		? i18nInstance.t('noHaveAnAccount?')
		: i18nInstance.t('alreadyHaveAccount');

	return (
		<View>
			<View className='flex-row my-6 items-center gap-x-5'>
				<View className='h-[1px] bg-white/20 flex-1' />
				<TextElement textStyles=' text-white/50 text-center lowercase'>
					{i18nInstance.t('or')}
				</TextElement>
				<View className='h-[1px] bg-white/20 flex-1' />
			</View>
			<View className='flex flex-col' style={{ gap: 15 }}>
				{Platform.OS === 'ios' && (
					<ButtonPrimary
						designVariation='white-transparent'
						nodeContentStyles={socialContainerStyles}
						onPress={() => {
							onAppleButtonPress();
						}}
						isReactNodeContent
						testID='apple-button'
					>
						<AppleIcon />
						<TextElement textStyles={socialButtonTextStyles}>
							{loginButtonText('apple')}
						</TextElement>
					</ButtonPrimary>
				)}
				<ButtonPrimary
					designVariation='white-transparent'
					nodeContentStyles={socialContainerStyles}
					isReactNodeContent
					onPress={() => onGoogleButtonPress()}
					testID='google-button'
				>
					<GoogleIcon />
					<TextElement textStyles={socialButtonTextStyles}>
						{loginButtonText('google')}
					</TextElement>
				</ButtonPrimary>
			</View>
			<View
				className='flex flex-row justify-center items-center mt-4'
				style={{ gap: 6 }}
			>
				<TextElement textStyles='!text-white'>{loginQuestionText}</TextElement>
				<ButtonPrimary
					designVariation='ghost'
					buttonStyles='p-0'
					textStyles='!font-bold'
					onPress={handleRedirect}
					testID='change-signin-button'
				>
					{loginRedirectText}
				</ButtonPrimary>
			</View>
		</View>
	);
};

export default SocialMediaAuth;
