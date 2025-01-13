import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { TouchableOpacity, BackHandler, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail } from 'firebase/auth';

import { i18nInstance } from 'config/i18n';
import { auth } from 'config/firebase';

import { forgetPasswordFormValidationSchema } from '@/lib/schemas/login';

import HeaderGreen from '@/images/layout/background-layout-green.png';
import KlikitLogo from '@/images/klikit-new-logo-icon.png';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import CheckIcon from '@/UI/assets/svg/CheckIcon';
import LargeArrowIcon from '@/UI/assets/svg/LargeArrowIcon';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import ModalTemplate from '../modal/ModalTemplate';

import type { TypeForgetPasswordForm } from '@/lib/types/login';
import type { AuthNavigationProp } from '@/lib/types/tabScreenParams';

const ForgotPasswordForm = () => {
	const navigation = useNavigation<AuthNavigationProp>();
	const [showModalSentEmail, setShowModalSentEmail] = useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TypeForgetPasswordForm>({
		resolver: zodResolver(forgetPasswordFormValidationSchema),
	});

	const onBackPress = () => navigation.goBack();

	const onSubmit: SubmitHandler<TypeForgetPasswordForm> = async (data) => {
		const { email } = data;

		sendPasswordResetEmail(auth, email)
			.then((response) => {
				setShowModalSentEmail(true);
			})
			.catch((error) => {
				console.error('errorFirebase', error);
			});
	};

	const onClickLogin = () => {
		setShowModalSentEmail(false);
		navigation.goBack();
	};

	useEffect(() => {
		const backAction = () => {
			navigation.goBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, []);

	return (
		<>
			<View className='bg-layout-black flex-1 px-5 relative pt-10 '>
				<Image
					source={HeaderGreen}
					className='h-[250px] w-screen absolute left-0 top-0 z-[-1]'
				/>
				<Image
					source={KlikitLogo}
					className='h-[600px] w-[480px] absolute -right-44 -bottom-36 z-[-1]'
				/>
				<Header
					showDefaultHeader={false}
					headerContainerStyles='!bg-transparent'
					headerStyles='!bg-transparent px-0  flex-row justify-between items-center '
				>
					<TouchableOpacity
						activeOpacity={1}
						className='flex-row items-center'
						onPress={onBackPress}
					>
						<View className='-rotate-180'>
							<LargeArrowIcon width={15} height={15} />
						</View>
						<TextElement textStyles='text-sm text-light-white ml-2'>
							{i18nInstance.t('signUp')}
						</TextElement>
					</TouchableOpacity>
					<ChangeLanguageButton />
				</Header>
				<TextElement
					textStyles='text-4xl text-light-white mt-10 lowercase '
					fontFamily='pachang'
				>
					{i18nInstance.t('forgotYourPassword')}
				</TextElement>
				<TextElement textStyles='my-10 text-sm text-white'>
					{i18nInstance.t('emailToChangeYourPassword')}
				</TextElement>
				<View>
					<InputForm
						placeholder={i18nInstance.t('enterEmail')}
						name='email'
						placeholderTextColor='#B0B0B0'
						control={control}
						error={errors.email}
						autoComplete='email'
						keyboardType='email-address'
						textContentType='emailAddress'
						autoCapitalize='none'
						autoCorrect={false}
					/>
					<ButtonPrimary
						onPress={handleSubmit(onSubmit)}
						buttonStyles='mt-5 font-medium'
						designVariation='green'
					>
						{i18nInstance.t('submit')}
					</ButtonPrimary>
				</View>
			</View>
			<ModalTemplate showModal={showModalSentEmail}>
				<View className='  bg-dark-gray justify-center items-center rounded-lg p-5 w-3/4'>
					<CheckIcon width={41} height={41} color='#F5F5F5' />
					<TextElement textStyles='text-base text-gray text-center mt-3'>
						{i18nInstance.t('emailRecoverYourPassword')}
					</TextElement>
					<ButtonPrimary
						onPress={onClickLogin}
						buttonStyles='mt-5'
						textStyles='text-sm'
						designVariation='green'
					>
						{i18nInstance.t('logIn')}
					</ButtonPrimary>
				</View>
			</ModalTemplate>
		</>
	);
};

export default ForgotPasswordForm;
