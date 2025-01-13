import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import TranslateIcon from '@/svg/TranslateIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import CustomBottomSheetModal from '../../modal/CustomBottonSheet';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface LanguageModalProps {
	languageModalRef: React.RefObject<BottomSheetModalMethods>;
	onPressLanguage: () => void;
}

const LanguageModal = ({
	languageModalRef,
	onPressLanguage,
}: LanguageModalProps) => {
	const snapPoints = ['20%'];
	const languageCode = i18nInstance.locale;

	return (
		<CustomBottomSheetModal
			snapPoints={snapPoints}
			bottomSheetModalRef={languageModalRef}
		>
			<ButtonPrimary
				buttonStyles='!px-0'
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
				onPress={onPressLanguage}
			>
				<TranslateIcon />
				<View className='flex flex-row'>
					<TextElement textStyles='text-white !text-base ml-1'>
						{i18nInstance.t('language')}
					</TextElement>
					<TextElement textStyles='text-gray !text-base ml-1'>
						- {i18nInstance.t(languageCode === 'id' ? 'indonesian' : 'english')}
					</TextElement>
				</View>
			</ButtonPrimary>
		</CustomBottomSheetModal>
	);
};

export default LanguageModal;
