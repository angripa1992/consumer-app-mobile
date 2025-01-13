import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import CloseIcon from '@/svg/CloseIcon';
import ButtonPrimary from '../button/ButtonPrimary';
import TextElement from '../text/TextElement';

import type { TagOption } from '@/lib/types/tags';

interface CustomChipItemProps<T> {
	option: Omit<TagOption<T>, 'icon'>;
	selectedItems: T[];
	onSelectedItemsChange: (selectedItems: T[]) => void;
}

const CustomChipItem = <T,>({
	selectedItems,
	option,
	onSelectedItemsChange,
}: CustomChipItemProps<T>) => {
	const onClose = () => {
		const newItems = selectedItems.filter((item) => item !== option.value);
		onSelectedItemsChange(newItems);
	};

	return (
		<View className='bg-white py-2 px-4 mt-2 mr-2 rounded-2xl flex flex-row items-center '>
			<TextElement textStyles='text-button-black'>{option.label}</TextElement>
			<ButtonPrimary
				designVariation='ghost'
				buttonStyles='!p-0'
				isReactNodeContent={true}
				onPress={onClose}
				hitSlop={3}
			>
				<CloseIcon width={15} height={15} color='#000' />
			</ButtonPrimary>
		</View>
	);
};

export default CustomChipItem;
