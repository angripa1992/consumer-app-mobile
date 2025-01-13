import { useShallow } from 'zustand/react/shallow';
import { View } from 'react-native';
import { Image } from 'expo-image';

import { useAppStore } from '@/lib/store/store';

import BgOnBoarding from '@/images/general-onboarding-background.jpg';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { OnboardingInitialViewRouteParams } from '@/lib/types/tabScreenParams';
import { useGetTags } from '@/lib/hooks/useQueryTags';
import { useGetCountries } from '@/lib/hooks/useQueryCountries';
import { useGetCities } from '@/lib/hooks/useQueryCities';
import { i18nInstance } from 'config/i18n';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import { useEffect } from 'react';

const InitialView = ({ navigation }: OnboardingInitialViewRouteParams) => {
	useGetTags();
	useGetCountries();
	useGetCities();

	const { setOnboardingStep } = useAppStore(
		useShallow((state) => ({
			setOnboardingStep: state.setOnboardingStep,
		})),
	);

	const handleRedirect = () => {
		navigation.navigate('ProgressView');
	};

	useEffect(() => {
		setOnboardingStep(1);
	}, []);

	return (
		<View className='pb-24 px-5 relative h-screen flex-1 w-screen flex flex-col justify-between'>
			<Image
				source={BgOnBoarding}
				className='h-screen w-screen absolute left-0 bottom-0 z-[-1]'
			/>
			<View className='mt-16 flex flex-row justify-end'>
				<ChangeLanguageButton />
			</View>
			<View className='flex flex-col justify-end'>
				<TextElement
					textStyles='text-white text-4xl font-semibold lowercase'
					fontFamily='pachang'
				>
					{`${i18nInstance.t('spotItKlikit')}!`}
				</TextElement>
				<TextElement textStyles='text-gray text-xl font-semibold mt-3'>
					{`${i18nInstance.t('welcomeToKlikit')}`}
				</TextElement>
				<TextElement textStyles='text-gray  text-base font-medium mt-3 leading-5'>
					{i18nInstance.t('hereYouCanFindTheTop')}
				</TextElement>
				<ButtonPrimary
					onPress={handleRedirect}
					buttonStyles='mt-10 py-3'
					textStyles='text-sm'
					designVariation='green'
				>
					{i18nInstance.t('next')}
				</ButtonPrimary>
			</View>
		</View>
	);
};

export default InitialView;
