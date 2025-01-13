import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import { Image } from 'expo-image';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';
import { locationFilterValidationSchema } from '@/lib/schemas/discovery';

import Header from '@/UI/layouts/Header';
import TextElement from '@/UI/atoms/text/TextElement';
import InputForm from '@/UI/atoms/input/InputForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import SocialMediaAuth from '@/UI/molecules/login/SocialMediaAuth';
import LoginLogo from '@/UI/assets/svg/LoginLogo';
import BackIcon from '@/UI/assets/svg/BackIcon';
import HeaderGreen from '@/images/layout/background-layout-green.png';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import LocationFilter from '../filters/LocationFilter';

import type { TypeSignUpFormValuesSchema } from '@/lib/types/login';
import type { TypeApproveUserStatus } from '@/lib/types/waitList';
import type { SubmitHandler } from 'react-hook-form';

type TypeSignUpFormProps = {
	formMethods: UseFormReturn<TypeSignUpFormValuesSchema>;
	onHandleSignUp: SubmitHandler<TypeSignUpFormValuesSchema>;
	handlerAppleSignUp: () => void;
	handlerGoogleSignUp: () => void;
	handleRedirectToLogin: () => void;
	approvedStatus: TypeApproveUserStatus;
};

const SignUpForm = ({
	formMethods,
	onHandleSignUp,
	handlerAppleSignUp,
	handlerGoogleSignUp,
	handleRedirectToLogin,
	approvedStatus,
}: TypeSignUpFormProps) => {
	const [cityChosen, setCityChosen] = useState(
		i18nInstance.t('selectAnOption'),
	);

	const {
		waitlistUserEmail,
		setShowWaitlistContactSoonScreen,
		setWaitlistUserEmail,
	} = useAppStore(
		useShallow((state) => ({
			waitlistUserEmail: state.waitlistUserEmail,
			setWaitlistUserEmail: state.setWaitlistUserEmail,
			setShowWaitlistContactSoonScreen: state.setShowWaitlistContactSoonScreen,
		})),
	);

	const {
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = formMethods;

	const {
		control: controlCity,
		setValue: setValueCity,
		watch: watchCity,
		reset: resetCity,
	} = useForm({
		defaultValues: {
			city: '',
		},
		resolver: zodResolver(locationFilterValidationSchema),
	});

	const emailValue = watch('email');

	const showDefaultEmailError =
		approvedStatus === 'not found' ? errors.email : undefined;

	const onPressSkipWaitlist = () => {
		setShowWaitlistContactSoonScreen('contactSoon');
	};

	const onPressSkipWaitlistOnEmailError = () => {
		setShowWaitlistContactSoonScreen('contactSoon');
		setWaitlistUserEmail(emailValue);
		reset();
	};

	const showEmailNotApprovedError = () => {
		if (approvedStatus === 'not approved') {
			return (
				<View className='flex-row items-center mt-1'>
					<TextElement textStyles={`text-light-white mr-1`}>
						{i18nInstance.t('thisUserIsOnTheWaitlist')}
					</TextElement>
					<TouchableOpacity
						className='py-0'
						onPress={onPressSkipWaitlistOnEmailError}
						activeOpacity={1}
					>
						<TextElement textStyles='text-light-white underline'>
							{i18nInstance.t('clickHere')}
						</TextElement>
					</TouchableOpacity>
				</View>
			);
		}

		return null;
	};

	useEffect(() => {
		setValue('city', cityChosen !== 'Select Option' ? cityChosen : '');
	}, [cityChosen]);

	return (
		<ScrollView>
			<View className='bg-layout-black flex-1 px-5 relative pt-10 '>
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
					<View>
						<ChangeLanguageButton />
						{!!waitlistUserEmail && (
							<ButtonPrimary
								onPress={onPressSkipWaitlist}
								designVariation='ghost'
								buttonStyles='px-3 py-2 mt-2'
							>
								<View className='flex flex-row items-center justify-center'>
									<TextElement textStyles='mr-2 mb-[2px] text-white text-sm font-bold'>
										{i18nInstance.t('skipWaitlist')}
									</TextElement>
									<View className='rotate-180'>
										<BackIcon color='white' height='15' width='10' />
									</View>
								</View>
							</ButtonPrimary>
						)}
					</View>
				</Header>
				<View className='mt-12'>
					<InputForm
						control={control}
						placeholder={i18nInstance.t('yourEmailAccount')}
						name='email'
						inputStyles='text-white text-xs'
						placeholderTextColor='#B0B0B0'
						label={i18nInstance.t('email')}
						error={showDefaultEmailError}
						autoComplete='email'
						keyboardType='email-address'
						textContentType='emailAddress'
						autoCapitalize='none'
						autoCorrect={false}
						testID='signup-email'
						style={styles.inputStyles}
					/>
					{showEmailNotApprovedError()}
					<InputForm
						control={control}
						placeholder={i18nInstance.t('yourName')}
						name='name'
						label={i18nInstance.t('fullName')}
						inputStyles='text-white text-xs'
						containerStyles='mt-4'
						placeholderTextColor='#B0B0B0'
						error={errors.name}
						testID='signup-name'
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
						isPassword
						testID='signup-password'
						style={styles.inputStyles}
					/>
					<View className='mt-4'>
						<TextElement textStyles={`text-gray-label mb-1`}>
							{i18nInstance.t('city')}
						</TextElement>
						<LocationFilter
							control={controlCity}
							setValue={setValueCity}
							watch={watchCity}
							currentCity={cityChosen}
							setCurrentCity={setCityChosen}
							reset={resetCity}
							designVariation='dropdown'
							disabledGlobal
						/>
						{errors.city?.message && (
							<TextElement textStyles={`text-error mt-[-4px]`}>
								{i18nInstance.t(errors.city?.message)}
							</TextElement>
						)}
					</View>
					<ButtonPrimary
						designVariation='green'
						onPress={handleSubmit(onHandleSignUp)}
						buttonStyles='mt-5  font-medium '
						testID='signup-button'
					>
						{i18nInstance.t('createAccount')}
					</ButtonPrimary>
					<SocialMediaAuth
						typeLoginView='signup'
						onAppleButtonPress={handlerAppleSignUp}
						onGoogleButtonPress={handlerGoogleSignUp}
						handleRedirect={handleRedirectToLogin}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	inputStyles: {
		fontSize: 12,
	},
});

export default SignUpForm;
