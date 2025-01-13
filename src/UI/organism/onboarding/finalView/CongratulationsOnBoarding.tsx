import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CheckFillIcon from '@/UI/assets/svg/CheckFillIcon';

type TypeCongratulationsOnBoardingProps = {
	handleCreatePreferences: () => void;
};

const CongratulationsOnBoarding = ({
	handleCreatePreferences,
}: TypeCongratulationsOnBoardingProps) => {
	const textStyles = 'text-gray text-base font-medium leading-5';

	return (
		<>
			<TextElement
				textStyles='text-white text-4xl font-semibold lowercase'
				fontFamily='pachang'
			>
				{i18nInstance.t('startExploring')}
			</TextElement>
			<View className='flex flex-row items-start mt-10'>
				<CheckFillIcon />
				<TextElement textStyles={`ml-2 ${textStyles}`}>
					{i18nInstance.t('discoverListsAndSpots')}
				</TextElement>
			</View>
			<View className='flex flex-row items-start mt-7'>
				<CheckFillIcon />
				<TextElement textStyles={`ml-2 ${textStyles}`}>
					{i18nInstance.t('stayConnectedDescription')}
				</TextElement>
			</View>
			<View className='flex flex-row items-start mt-7'>
				<CheckFillIcon />
				<TextElement textStyles={`ml-2 ${textStyles}`}>
					{i18nInstance.t('visitYourDesireSpots')}
				</TextElement>
			</View>
			<ButtonPrimary
				onPress={handleCreatePreferences}
				buttonStyles='mt-16'
				textStyles='text-sm'
				designVariation='green'
			>
				{i18nInstance.t('start')}
			</ButtonPrimary>
		</>
	);
};

export default CongratulationsOnBoarding;
