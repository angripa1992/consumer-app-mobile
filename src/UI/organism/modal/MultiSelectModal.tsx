import { View } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { i18nInstance } from 'config/i18n';

import TextElement from '@/UI/atoms/text/TextElement';
import CustomMultiSelectOption from '@/UI/atoms/select/CustomMultiSelectModalOption';
import CustomBottomSheetModal from './CustomBottonSheet';

import type { TagOption } from '@/lib/types/tags';

interface MultiSelectModalProps<T> {
	options: TagOption<T>[];
	onSelectedItemsChange: (selectedItems: T[]) => void;
	selectedItems: T[];
	multiSelectModalRef: React.RefObject<BottomSheetModal>;
}

const MultiSelectModal = <T,>({
	options,
	onSelectedItemsChange,
	selectedItems,
	multiSelectModalRef,
}: MultiSelectModalProps<T>) => {
	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={multiSelectModalRef}
			snapPoints={['50%']}
		>
			<TextElement textStyles='text-white mb-4 !text-xl'>
				{i18nInstance.t('addTags')}
			</TextElement>
			<BottomSheetScrollView showsVerticalScrollIndicator={false}>
				<View className='h-full flex flex-row flex-wrap mb-10'>
					{options.map((option) => (
						<CustomMultiSelectOption
							key={option.label}
							onSelectedItemsChange={onSelectedItemsChange}
							selectedItems={selectedItems}
							option={option}
						/>
					))}
				</View>
			</BottomSheetScrollView>
		</CustomBottomSheetModal>
	);
};

export default MultiSelectModal;
