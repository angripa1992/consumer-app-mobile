import { View, Image } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import { usePostSingleWaitListUser } from '@/lib/hooks/userQueryAuthorizedUser';
import { waitListFormValidationSchema } from '@/lib/schemas/login';
import { i18nInstance } from 'config/i18n';
import { useGetCountries } from '@/lib/hooks/useQueryCountries';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import LogoLogin from '@/images/klikit-new-logo-icon.png';
import Link from '@/UI/atoms/link/Link';
import InputForm from '@/UI/atoms/input/InputForm';
import SelectForm from '@/UI/atoms/select/SelectForm';

import KlikitLogoNameWhite from '@/images/klikit-logo-name-white.png';

import type { TypeWaitListForm, TypeWaitListFormView } from '@/lib/types/login';
import { AuthWaitListNavigationProp } from '@/lib/types/tabScreenParams';

type TypeWaitListFormProps = {
	setTypeView: (values: TypeWaitListFormView) => void;
};

const WaitListForm = ({ setTypeView }: TypeWaitListFormProps) => {
	const navigation = useNavigation<AuthWaitListNavigationProp>();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<TypeWaitListForm>({
		resolver: zodResolver(waitListFormValidationSchema),
	});
	const { mutateAsync: postUserInWaitList } = usePostSingleWaitListUser();
	const { countries } = useGetCountries();
	const countriesNameList =
		countries?.map((country) => {
			return {
				label: country.name,
				value: country.name,
			};
		}) || [];

	const conditionsTextStyles =
		'text-white text-[12px] leading-[15px] tracking-[-0.03px]';

	const handleSubmitWaitListForm: SubmitHandler<TypeWaitListForm> = (
		formValues: TypeWaitListForm,
	) => {
		postUserInWaitList(formValues)
			.then(() => {
				setTypeView('sent');
			})
			.catch((err) => {
				if (err.response.data.code === 409) {
					setError('root.serverError', {
						message: i18nInstance.t('emailAlreadyInUse'),
					});
					return;
				}
				setError('root.serverError', {
					message: i18nInstance.t('somethingWentWrong'),
				});
			});
	};

	const handleRedirectToLogin = () => {
		navigation.navigate('Login');
	};

	const handleRedirectToSignUp = () => {
		navigation.navigate('SignUp');
	};

	return (
		<View className='pt-5 flex flex-col items-center justify-center z-40 h-screen w-screen relative flex-1'>
			<Image className='w-[160px] h-[160px] aspect-square' source={LogoLogin} />
			<View className='pt-4 px-5 pb-7 overflow-hidden relative flex flex-col justify-center w-full'>
				<View className='space-y-5 z-[5]'>
					<Image
						className='mx-auto mb-3 object-cover'
						source={KlikitLogoNameWhite}
					/>
					<View>
						<TextElement textStyles='mb-3 text-center !text-white text-base font-bold tracking-[-0.70px]'>
							{i18nInstance.t('signUpBelow')}
						</TextElement>
					</View>
					<View className='my-3 w-full'>
						<InputForm
							control={control}
							name='email'
							label={i18nInstance.t('email')}
							labelStyles='!text-white font-bold'
							error={errors.email}
							inputStyles='bg-[#4A4A4A] text-white border border-white'
							errorStyles='font-bold mt-2'
							autoComplete='email'
							keyboardType='email-address'
							textContentType='emailAddress'
							autoCapitalize='none'
							autoCorrect={false}
							testID='waitlist-email'
						/>
						<SelectForm
							options={countriesNameList}
							name='country'
							control={control}
							labelStyles='!text-white font-bold'
							containerStyles='mt-2'
							label={i18nInstance.t('country')}
							error={errors.country}
							errorStyles='mt-1 font-bold'
							testID='waitlist-country'
						/>
						{errors.root?.serverError && (
							<TextElement textStyles={`text-error font-bold mt-2`}>
								{errors.root.serverError.message}
							</TextElement>
						)}
					</View>
					<ButtonPrimary
						onPress={handleSubmit(handleSubmitWaitListForm)}
						buttonStyles='rounded-lg bg-white py-3 px-5 w-full '
						textStyles='text-center text-base text-black'
					>
						{i18nInstance.t('joinWaitlist')}
					</ButtonPrimary>
				</View>

				<View className='flex flex-row items-center justify-center mt-4'>
					<TextElement textStyles={`mx-1 text-center ${conditionsTextStyles}`}>
						{i18nInstance.t('alreadyHaveAccount')}
					</TextElement>
					<ButtonPrimary
						onPress={handleRedirectToLogin}
						buttonStyles='p-0'
						textStyles={`font-bold underline ${conditionsTextStyles}`}
						designVariation='ghost'
					>
						{i18nInstance.t('logIn')}
					</ButtonPrimary>
				</View>
				<View className='flex flex-row items-center justify-center mt-4'>
					<TextElement textStyles={`mx-1 text-center ${conditionsTextStyles}`}>
						{i18nInstance.t('approveOrRegistration')}
					</TextElement>
					<ButtonPrimary
						onPress={handleRedirectToSignUp}
						buttonStyles='p-0'
						textStyles={`font-bold underline ${conditionsTextStyles}`}
						designVariation='ghost'
					>
						{i18nInstance.t('signUpNow')}
					</ButtonPrimary>
				</View>

				<View className='mt-6'>
					<TextElement
						textStyles={`text-black text-center relative z-[5] text-[12px] ${conditionsTextStyles}`}
					>
						{i18nInstance.t('bySignInUpYourAgree')}
					</TextElement>
					<View className='flex flex-row items-center  justify-center'>
						<Link url={'http://www.klikit.io/terms-of-use'}>
							<TextElement
								textStyles={`underline text-center font-black ${conditionsTextStyles}`}
							>
								{i18nInstance.t('termsOfService')}
							</TextElement>
						</Link>
						<TextElement
							textStyles={`mx-1 text-center ${conditionsTextStyles}`}
						>
							{i18nInstance.t('and')}
						</TextElement>
						<Link url={'https://klikit.io/privacy-policy/'}>
							<TextElement
								textStyles={`underline text-center font-black ${conditionsTextStyles}`}
							>
								{i18nInstance.t('privacyPolicy')}
							</TextElement>
						</Link>
					</View>
				</View>
			</View>
		</View>
	);
};

export default WaitListForm;
