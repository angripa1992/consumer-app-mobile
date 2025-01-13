import { Dispatch, SetStateAction, useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';

import { convertStringToLowerCaseWithoutSpaces } from '@/lib/helpers/translations/convertStringToLowerCaseWithoutSpaces';
import { i18nInstance } from 'config/i18n';
import { useGetTags } from '@/lib/hooks/useQueryTags';

import TextElement from '@/UI/atoms/text/TextElement';
import MultiSelectForm from '@/UI/atoms/select/MultiSelectForm';
import NavigationButtonsOnBoarding from '@/UI/molecules/onboarding/NavigationButtonsOnBoarding';

import type { TypeOnboardingFormSchema } from '@/lib/types/onboarding';

interface SelectInterestOnBoardingProps {
	setProgress: Dispatch<SetStateAction<number>>;
	setStep: (value: number) => void;
	control: Control<TypeOnboardingFormSchema>;
	watch: UseFormWatch<TypeOnboardingFormSchema>;
	setValue: UseFormSetValue<TypeOnboardingFormSchema>;
}

const SelectInterestOnBoarding = ({
	setProgress,
	setStep,
	control,
	watch,
	setValue,
}: SelectInterestOnBoardingProps) => {
	const { tags } = useGetTags();

	const interestOptions =
		tags?.map((tag) => ({
			label: i18nInstance.t(convertStringToLowerCaseWithoutSpaces(tag.name)),
			value: tag.name,
			color: '#ffffff',
		})) || [];

	const interestOptionsSelected = watch('tags');
	const interestOptionsSelectedLength = interestOptionsSelected?.length;
	const isThereAnyInterestSelected = interestOptionsSelectedLength > 0;

	const handleBack = () => {
		setProgress(40);
		setStep(1);
	};

	const handleNext = () => {
		setProgress(60);
		setStep(3);
	};

	useEffect(() => {
		if (isThereAnyInterestSelected) {
			setProgress(50);
		} else {
			setProgress(40);
		}
	}, [interestOptionsSelected]);

	return (
		<View className='flex-1 px-5 flex flex-col justify-between'>
			<View className='h-[70%]'>
				<TextElement
					textStyles='text-white text-2xl font-medium lowercase'
					fontFamily='pachang'
				>
					{i18nInstance.t('selectYourInterests')}
				</TextElement>
				<TextElement textStyles={`text-gray text-sm mt-3 mb-5`}>
					{i18nInstance.t('pickYourInterestsDescription')}
				</TextElement>
				<ScrollView className='max-h-[370px]'>
					<MultiSelectForm
						options={interestOptions}
						control={control}
						name={'tags'}
						containerOptionsStyles='flex-wrap justify-start w-[100%]'
						containerColumnGap={8}
						optionsTextStyles='text-sm text-center '
						optionsStyles='px-3 border-[1.5px] '
						optionsDefaultColor={'#ffffff08'}
						optionsBackgroundOpacity={'1a'}
						limitSelectedOptions={5}
					/>
				</ScrollView>
			</View>
			<NavigationButtonsOnBoarding
				isThereAnyItemSelected={isThereAnyInterestSelected}
				handleNext={handleNext}
				handleBack={handleBack}
			/>
		</View>
	);
};

export default SelectInterestOnBoarding;
