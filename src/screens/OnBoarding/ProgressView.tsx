import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { usePutSingleUser } from '@/lib/hooks/useQueryUser';
import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';
import { onboardingFormSchema } from '@/lib/schemas/onboarding';

import SelectInterestOnBoarding from '@/UI/organism/onboarding/SelectInterestOnBoarding';
import FollowAccountsOnBoarding from '@/UI/organism/onboarding/FollowAccountsOnBoarding';
import ProgressBarOnBoarding from '@/UI/molecules/onboarding/ProgressBarOnBoarding';
import CustomizeProfileOnBoarding from '@/UI/organism/onboarding/CustomizeProfileOnBoarding';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import HeaderGreen from '@/images/layout/background-layout-green.png';
import HowItWorksOnBoarding from '@/UI/organism/onboarding/HowItWorksOnBoarding';

import type { TypeOnboardingFormSchema } from '@/lib/types/onboarding';
import type { TypePutProfileRequest } from '@/lib/types/profile';
import type { OnboardingProgressViewRouteParams } from '@/lib/types/tabScreenParams';

const ProgressView = ({ navigation }: OnboardingProgressViewRouteParams) => {
	const {
		setOnboardingForm,
		onboardingForm,
		user: userStored,
		onboardingStep,
		setOnboardingStep,
	} = useAppStore(
		useShallow((state) => ({
			setOnboardingForm: state.setOnboardingForm,
			onboardingForm: state.onboardingForm,
			user: state.user,
			onboardingStep: state.onboardingStep,
			setOnboardingStep: state.setOnboardingStep,
		})),
	);

	const [progress, setProgress] = useState(10);
	const [partialTarotValue, setPartialTarotValue] = useState<string>('');

	const { mutateAsync: updateUser } = usePutSingleUser(
		userStored && Number(userStored?.id),
	);
	const { control, watch, setValue, handleSubmit } =
		useForm<TypeOnboardingFormSchema>({
			resolver: zodResolver(onboardingFormSchema),
			defaultValues: onboardingForm,
		});

	const relevantLists = watch('relevantLists');
	const relevantUsers = watch('relevantUsers');
	const tags = watch('tags');

	const isShowSkipButton =
		onboardingStep === 2 ||
		onboardingStep === 3 ||
		onboardingStep === 4 ||
		onboardingStep === 5;

	const handleUpdateProfile = async () => {
		let dataToSend: Partial<TypePutProfileRequest> = {};
		if (partialTarotValue) {
			dataToSend['tarot_code'] = partialTarotValue;
		}

		await updateUser(dataToSend);
	};

	const handleSubmitForm = handleSubmit(async (formValues) => {
		await handleUpdateProfile();

		navigation.navigate('FinalView', {
			tags: formValues.tags,
			relevantUsers: formValues.relevantUsers,
			relevantLists: formValues.relevantLists,
		});
	});

	const handleBackToInitialView = () => {
		navigation.navigate('InitialView');
	};

	const handlePartialProfile = (tarotValue: string) => {
		setPartialTarotValue(tarotValue);
	};

	const handlePressSkipButton = () => {
		if (onboardingStep === 2) {
			setOnboardingStep(3);
		}
		if (onboardingStep === 3) {
			setOnboardingStep(4);
		}
		if (onboardingStep === 4) {
			setOnboardingStep(5);
		}
		if (onboardingStep === 5) {
			handleSubmitForm();
		}
	};

	const renderStep = () => {
		if (onboardingStep === 1) {
			return (
				<HowItWorksOnBoarding
					setStep={setOnboardingStep}
					setProgress={setProgress}
					handleBack={handleBackToInitialView}
				/>
			);
		}
		if (onboardingStep === 2) {
			return (
				<SelectInterestOnBoarding
					control={control}
					setValue={setValue}
					watch={watch}
					setStep={setOnboardingStep}
					setProgress={setProgress}
				/>
			);
		}
		if (onboardingStep === 3) {
			return (
				<FollowAccountsOnBoarding
					control={control}
					setValue={setValue}
					watch={watch}
					setStep={setOnboardingStep}
					setProgress={setProgress}
				/>
			);
		}
		if (onboardingStep === 4) {
			return (
				<CustomizeProfileOnBoarding
					setProgress={setProgress}
					setStep={setOnboardingStep}
					handlePartialProfile={handlePartialProfile}
					handleSubmit={handleSubmitForm}
				/>
			);
		}
	};

	useEffect(() => {
		setOnboardingForm({
			relevantLists,
			relevantUsers,
			tags,
		});
	}, [relevantLists, relevantUsers, tags]);

	return (
		<View className='pb-8 relative h-screen flex-1 bg-layout-black w-screen'>
			<View
				className={`mt-16 flex mx-5 flex-row  items-center ${isShowSkipButton ? 'justify-between' : 'justify-end'}`}
			>
				{isShowSkipButton && (
					<ButtonPrimary
						onPress={handlePressSkipButton}
						designVariation='ghost'
						textStyles='text-lg'
						hitSlop={10}
					>
						{i18nInstance.t('skip')}
					</ButtonPrimary>
				)}
				<ChangeLanguageButton />
			</View>
			<Image
				source={HeaderGreen}
				className='h-[250px] w-screen absolute left-0 top-0 z-[-1]'
			/>
			<View className='mx-5 mt-10'>
				<ProgressBarOnBoarding progress={progress} />
			</View>
			{renderStep()}
		</View>
	);
};

export default ProgressView;
