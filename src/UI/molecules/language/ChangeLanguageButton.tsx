import { View } from 'react-native';
import { useRef } from 'react';

import { i18nInstance } from 'config/i18n';
import { handleLanguageOptionText } from '@/lib/helpers/translations/handleLanguageText';

import TranslateIcon from '@/UI/assets/svg/TranslateIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import LanguageOptionsModal from '@/UI/organism/feed/modal/LanguageOptionsModal';

import type { BottomSheetModal } from '@gorhom/bottom-sheet';

const ChangeLanguageButton = () => {
	const languageOptionsModalRef = useRef<BottomSheetModal>(null);

	const languageCode = i18nInstance.locale;

	const onPressChangeLanguage = () => {
		languageOptionsModalRef.current?.present();
	};

	return (
		<>
			<LanguageOptionsModal languageOptionsModalRef={languageOptionsModalRef} />
			<ButtonPrimary
				buttonStyles='px-6 py-2 max-w-[100px]'
				designVariation='white-transparent'
				nodeContentStyles='flex text-start justify-center flex-row items-center'
				isReactNodeContent
				onPress={() => {
					onPressChangeLanguage();
				}}
			>
				<TranslateIcon />
				<View className='flex flex-row'>
					<TextElement textStyles='text-white !text-base ml-1'>
						- {handleLanguageOptionText(languageCode)}
					</TextElement>
				</View>
			</ButtonPrimary>
		</>
	);
};

export default ChangeLanguageButton;
