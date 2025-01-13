import { useEffect, useMemo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { i18nInstance } from 'config/i18n';
import { useGetAllTarotCodes } from '@/lib/hooks/useQueryTarot';
import { putUserValidationsSchema } from '@/lib/schemas/user';
import { TAROT_TASTE_QUIZ } from '@/lib/utils/constants';
import TarotOnboardingImages from '@/images/onboarding-tarot-images.png';

import SelectForm from '@/UI/atoms/select/SelectForm';
import TextElement from '@/UI/atoms/text/TextElement';
import NavigationButtonsOnBoarding from '@/UI/molecules/onboarding/NavigationButtonsOnBoarding';

import type { Dispatch, SetStateAction } from 'react';
import type { TypeProfileForm } from '@/lib/types/profile';

type TypeCustomizeProfileOnBoardingProps = {
	setProgress: Dispatch<SetStateAction<number>>;
	setStep: (value: number) => void;
	handlePartialProfile: (tarotValue: string) => void;

	handleSubmit: () => void;
};

const CustomizeProfileOnBoarding = ({
	setProgress,
	setStep,
	handlePartialProfile,
	handleSubmit,
}: TypeCustomizeProfileOnBoardingProps) => {
	const { control, watch } = useForm<TypeProfileForm>({
		resolver: zodResolver(putUserValidationsSchema),
	});

	const tarotValue = watch('tarot');

	const isThereAnyItemSelected = !!tarotValue;

	const { allTarotCodes } = useGetAllTarotCodes();

	const tarotCodeNames = useMemo(
		() =>
			allTarotCodes?.map((tarotCode) => {
				return {
					label: `${tarotCode.name} (${tarotCode.code})`,
					value: tarotCode.code,
				};
			}) ?? [],
		[allTarotCodes],
	);

	const handleBack = () => {
		setProgress(80);
		setStep(3);
	};

	const onRedirectToTasteTestWebsite = async () => {
		await Linking.openURL(TAROT_TASTE_QUIZ);
	};

	useEffect(() => {
		if (isThereAnyItemSelected) {
			setProgress(90);
		} else {
			setProgress(80);
		}
	}, [isThereAnyItemSelected]);

	useEffect(() => {
		if (tarotValue) {
			handlePartialProfile(tarotValue);
		}
	}, [tarotValue, handlePartialProfile]);

	return (
		<>
			<View className='flex justify-between flex-1'>
				<ScrollView className='mb-5'>
					<View className='px-5'>
						<TextElement
							textStyles='text-white text-2xl font-medium lowercase'
							fontFamily='pachang'
						>
							{i18nInstance.t('timeToCustomise')}
						</TextElement>
						<TextElement textStyles={`text-gray text-sm mt-3 mb-5`}>
							{i18nInstance.t('timeToCustomiseText')}
						</TextElement>
						<SelectForm
							options={tarotCodeNames}
							name='tarot'
							control={control}
							testID='input-profile-tarot'
							defaultValue={tarotValue ? tarotValue : undefined}
							containerStyles={`my-4`}
							dropdownHeight={200}
						/>
						<View className='flex flex-row justify-center gap-x-1'>
							<TextElement textStyles='text-gray text-base'>
								{i18nInstance.t('takeTheTest')}
							</TextElement>
							<TouchableOpacity
								activeOpacity={1}
								onPress={onRedirectToTasteTestWebsite}
							>
								<TextElement textStyles='text-white underline text-base'>
									{`${i18nInstance.t('here')}`}
								</TextElement>
							</TouchableOpacity>
						</View>
					</View>
					<Image
						source={TarotOnboardingImages}
						contentFit='cover'
						className='mt-8 h-80 mb-2 relative '
					/>
				</ScrollView>
				<View className='px-5'>
					<NavigationButtonsOnBoarding
						handleBack={handleBack}
						handleNext={() => {
							handleSubmit();
						}}
						isThereAnyItemSelected={isThereAnyItemSelected}
					/>
				</View>
			</View>
		</>
	);
};

export default CustomizeProfileOnBoarding;
