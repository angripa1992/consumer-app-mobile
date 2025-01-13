import { ScrollView, View } from 'react-native';

import { howItWorksOnBoardingItems } from '@/lib/data/onboardingData';

import TextElement from '@/UI/atoms/text/TextElement';
import NavigationButtonsOnBoarding from '@/UI/molecules/onboarding/NavigationButtonsOnBoarding';

import type { Dispatch, SetStateAction } from 'react';
import { Image } from 'expo-image';
import { i18nInstance } from 'config/i18n';

type TypeHowItWorksOnBoardingProps = {
	setProgress: Dispatch<SetStateAction<number>>;
	setStep: (value: number) => void;
	handleBack: () => void;
};

const HowItWorksOnBoarding = ({
	setProgress,
	setStep,
	handleBack,
}: TypeHowItWorksOnBoardingProps) => {
	const handleNext = () => {
		setProgress(20);
		setStep(2);
	};

	return (
		<>
			<ScrollView>
				<View className='px-5'>
					<TextElement
						textStyles='text-white text-2xl font-medium  lowercase'
						fontFamily='pachang'
					>
						How it works
					</TextElement>
					<TextElement textStyles={`text-gray text-sm mt-3 mb-10`}>
						{i18nInstance.t('howItWorksText')}
					</TextElement>
					<View className='space-y-6'>
						{howItWorksOnBoardingItems.map((item, index) => {
							return (
								<View
									key={index}
									className=' border border-admin-tag-gray py-3 px-3 rounded-lg flex-row
									justify-between items-center bg-dark-black overflow-hidden relative'
								>
									<View>
										<TextElement
											textStyles='text-white text-xl font-medium lowercase'
											fontFamily='pachang'
										>
											{i18nInstance.t(item.title)}
										</TextElement>
										<TextElement textStyles='text-white text-sm mt-2'>
											{i18nInstance.t(item.description)}
										</TextElement>
									</View>
									<View className='scale-125'>{item.icon}</View>
									<Image
										source={item.image}
										className='absolute right-0 top-0 h-20 w-52 -z-10'
									/>
								</View>
							);
						})}
					</View>
				</View>
			</ScrollView>
			<View className='px-5'>
				<NavigationButtonsOnBoarding
					handleBack={handleBack}
					handleNext={handleNext}
					isThereAnyItemSelected
				/>
			</View>
		</>
	);
};

export default HowItWorksOnBoarding;
