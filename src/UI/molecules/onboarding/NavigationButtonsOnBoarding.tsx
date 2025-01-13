import { View } from 'react-native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import { i18nInstance } from 'config/i18n';

interface NextButtonOnBoardingProps {
	isThereAnyItemSelected: boolean;
	handleNext: () => void;
	handleBack: () => void;
}

const NavigationButtonsOnBoarding = ({
	isThereAnyItemSelected,
	handleNext,
	handleBack,
}: NextButtonOnBoardingProps) => {
	const handleNextValidation = () => {
		if (isThereAnyItemSelected) {
			handleNext();
		}
	};

	return (
		<View className='flex-row items-center gap-x-5'>
			<ButtonPrimary
				onPress={handleBack}
				buttonStyles='flex-1'
				designVariation='white-transparent'
				textStyles='text-white text-sm  font-bold   text-center'
			>
				{i18nInstance.t('back')}
			</ButtonPrimary>
			<ButtonPrimary
				onPress={handleNextValidation}
				designVariation='green'
				textStyles='text-sm'
				buttonStyles={`flex-1 ${!isThereAnyItemSelected ? 'opacity-40' : ''}`}
			>
				{i18nInstance.t('next')}
			</ButtonPrimary>
		</View>
	);
};

export default NavigationButtonsOnBoarding;
