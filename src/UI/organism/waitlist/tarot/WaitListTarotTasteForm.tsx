import { View } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as Linking from 'expo-linking';

import { TAROT_TASTE_QUIZ } from '@/lib/utils/constants';
import { i18nInstance } from 'config/i18n';

import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import InputForm from '@/UI/atoms/input/InputForm';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

import type { TypePostWaitListTarotCodes } from '@/lib/types/waitList';

type TypeWaitListTarotTasteFormProps = {
	formMethods: UseFormReturn<TypePostWaitListTarotCodes>;
	onPressGoBack: () => void;
	onSubmit: SubmitHandler<TypePostWaitListTarotCodes>;
};

const WaitListTarotTasteForm = ({
	formMethods,
	onPressGoBack,
	onSubmit,
}: TypeWaitListTarotTasteFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = formMethods;

	const onRedirectToTarotQuiz = () => {
		Linking.openURL(TAROT_TASTE_QUIZ);
	};

	return (
		<View className='bg-black relative h-full w-full' style={{ flex: 1 }}>
			<Image
				source={GreenTextureHeader}
				className='absolute  w-full top-[-210px] left-0 h-[500px] -z-10'
			/>
			<KeyboardAwareScrollView
				showsVerticalScrollIndicator={false}
				className=''
			>
				<View className='p-4'>
					<Header
						showDefaultHeader={false}
						headerContainerStyles='!bg-transparent'
						headerStyles='!bg-transparent pl-0'
					>
						<ButtonPrimary
							onPress={onPressGoBack}
							designVariation='ghost'
							buttonStyles='px-3 py-2'
						>
							<View className='flex flex-row items-center justify-center'>
								<BackIcon color='white' height='15' width='10' />
								<TextElement textStyles='ml-2 mb-[2px] text-white text-base font-bold'>
									{i18nInstance.t('back')}
								</TextElement>
							</View>
						</ButtonPrimary>
					</Header>
					<View>
						<TextElement fontFamily='pachang' designVariation='main-title'>
							{i18nInstance.t('theTasteTest')}
						</TextElement>
						<TextElement textStyles='my-10 text-sm text-white'>
							{i18nInstance.t('takeOurTasteTestQuiz')}
						</TextElement>
						<ButtonPrimary
							buttonStyles={`mt-10 py-3 w-full mb-5`}
							textStyles='!font-bold text-sm'
							designVariation='green'
							onPress={onRedirectToTarotQuiz}
						>
							{i18nInstance.t('completeQuiz')}
						</ButtonPrimary>
						<InputForm
							label={i18nInstance.t('tasteTestCode')}
							labelStyles='text-light-white'
							control={control}
							name='tarot_code'
							autoCapitalize='none'
						/>
						{errors.tarot_code && (
							<TextElement textStyles={`text-error text-sm font-bold mt-1`}>
								{errors.tarot_code.message}
							</TextElement>
						)}
						<ButtonPrimary
							buttonStyles={`mt-4 py-3 w-full mb-5`}
							textStyles='font-medium text-sm'
							onPress={handleSubmit(onSubmit)}
							designVariation='green'
						>
							{i18nInstance.t('checkCode')}
						</ButtonPrimary>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
};

export default WaitListTarotTasteForm;
