import { SafeAreaView, View } from 'react-native';
import { Image } from 'expo-image';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import ErrorXmark from '@/images/error/error-xmark.png';
import TextureError from '@/UI/assets/images/textures/texture-error.png';
import UhOhCharacterImage from '@/images/error/uh-oh-character.png';

import type { ReactNode } from 'react';
import { i18nInstance } from 'config/i18n';

interface ErrorProps {
	title?: string;
	descriptionContent?: ReactNode;
	typeError?: 'general' | 'notFound' | 'custom';
	buttonText?: string;
	onClickButton?: () => void;
	hideTexture?: boolean;
	containerStyles?: string;
}

const ErrorTemplate = ({
	title,
	descriptionContent,
	typeError = 'general',
	buttonText,
	onClickButton,
	hideTexture = false,
	containerStyles,
}: ErrorProps) => {
	const isCustomError = typeError === 'custom';

	const titleToRender = () => {
		if (typeError === 'notFound') {
			return i18nInstance.t('uhOh!');
		}
		if (typeError === 'general') {
			return i18nInstance.t('oops!');
		}
	};

	const descriptionToRender = () => {
		if (typeError === 'notFound') {
			return (
				<View testID='not-found-error-description'>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						{i18nInstance.t('looksLikeThereIsAnError')}
					</TextElement>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						{i18nInstance.t('letsGetYouBack')}
					</TextElement>
				</View>
			);
		}
		if (typeError === 'general') {
			return (
				<TextElement
					testID='general-error-description'
					textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'
				>
					{i18nInstance.t('noMeantToHappen')}
				</TextElement>
			);
		}
	};

	const buttonTextToRender = () => {
		if (typeError === 'notFound' || typeError === 'general') {
			return i18nInstance.t('back');
		}
	};

	return (
		<SafeAreaView className={`flex-1 bg-dark-black ${containerStyles ?? ''}`}>
			{!hideTexture && (
				<Image
					source={TextureError}
					className='absolute bottom-0 right-0 w-full h-full z-0'
				/>
			)}
			<View className='justify-center items-center flex-1'>
				<Image source={ErrorXmark} className='w-[250px] h-[200px] mb-5 ' />
				<View>
					<TextElement
						textStyles='text-center !text-white text-2xl font-bold tracking-[-0.12px]'
						testID='title-error'
					>
						{isCustomError ? title : titleToRender()}
					</TextElement>
					{isCustomError ? descriptionContent : descriptionToRender()}
					<View className='mt-16'>
						{onClickButton && (
							<ButtonPrimary onPress={onClickButton} testID='back-button'>
								{isCustomError ? buttonText : buttonTextToRender()}
							</ButtonPrimary>
						)}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default ErrorTemplate;
