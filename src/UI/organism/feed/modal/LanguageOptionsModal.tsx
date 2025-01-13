import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { Fragment } from 'react';

import { languageOptions } from '@/lib/data/languages';
import { i18nInstance, changeLanguage } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CustomBottomSheetModal from '../../modal/CustomBottonSheet';
import TextElement from '@/UI/atoms/text/TextElement';
import CheckIcon from '@/UI/assets/svg/CheckIcon';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { TypeLanguageCodes, TypeLanguageOptions } from '@/lib/types/app';

type TypeLanguageOptionsModalProps = {
	languageOptionsModalRef: React.RefObject<BottomSheetModalMethods>;
};

const LanguageOptionsModal = ({
	languageOptionsModalRef,
}: TypeLanguageOptionsModalProps) => {
	const { setLanguage } = useAppStore(
		useShallow((state) => ({
			setLanguage: state.setLanguage,
		})),
	);

	const languageCode = i18nInstance.locale;

	const onPressChangeLanguage = (lang: TypeLanguageCodes) => {
		changeLanguage(lang);
		setLanguage(lang);
	};

	const renderLanguageButton = (langOption: TypeLanguageOptions) => {
		return (
			<ButtonPrimary
				buttonStyles='!px-0'
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
				onPress={() => {
					onPressChangeLanguage(langOption.value);
				}}
			>
				<View className='w-full flex flex-row justify-between'>
					<TextElement textStyles='text-white !text-base'>
						{i18nInstance.t(langOption.label)}
					</TextElement>
					{languageCode === langOption.value && <CheckIcon />}
				</View>
			</ButtonPrimary>
		);
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={languageOptionsModalRef}
			snapPoints={['45%']}
		>
			<BottomSheetScrollView>
				<TextElement textStyles='text-white text-xl my-5'>
					{i18nInstance.t('chooseYourLanguage')}
				</TextElement>
				{languageOptions.map((langOption, index) => (
					<Fragment key={index}>{renderLanguageButton(langOption)}</Fragment>
				))}
			</BottomSheetScrollView>
		</CustomBottomSheetModal>
	);
};

export default LanguageOptionsModal;
