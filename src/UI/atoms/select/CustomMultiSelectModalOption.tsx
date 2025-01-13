import { useState } from 'react';
import { SvgUri } from 'react-native-svg';
import ButtonPrimary from '../button/ButtonPrimary';
import TextElement from '../text/TextElement';
import Spinner from '../spinner/Spinner';

import type { TagOption } from '@/lib/types/tags';

interface CustomMultiSelectModalOptionProps<T> {
	option: TagOption<T>;
	selectedItems: T[];
	onSelectedItemsChange: (items: T[]) => void;
}

const CustomMultiSelectModalOption = <T,>({
	option,
	selectedItems,
	onSelectedItemsChange,
}: CustomMultiSelectModalOptionProps<T>) => {
	const [isIconReady, setIsIconReady] = useState(false);
	const isItemSelected = selectedItems.includes(option.value);
	const hasIcon = !!option.icon;
	const iconSrc = option.icon || '';

	const buttonBackgroundStyles = isItemSelected
		? 'bg-white border-transparent '
		: 'bg-dark-gray border-login-gray/50 ';

	const buttonTextStyles = isItemSelected ? 'text-button-black' : 'text-white';

	const onClickOption = () => {
		const newitems = selectedItems.includes(option.value)
			? selectedItems.filter((item) => item !== option.value)
			: [...selectedItems, option.value];
		onSelectedItemsChange(newitems);
	};

	return (
		<ButtonPrimary
			designVariation='ghost'
			buttonStyles={` rounded-2xl  border mb-2 mr-2  ${buttonBackgroundStyles}`}
			isReactNodeContent={true}
			nodeContentStyles='flex flex-row items-center'
			onPress={onClickOption}
		>
			{hasIcon && (
				<>
					<SvgUri
						width={15}
						height={15}
						uri={iconSrc}
						onLoad={() => {
							setIsIconReady(true);
						}}
						className={`${isIconReady ? '' : 'hidden'} mr-2`}
					/>
					<Spinner
						width={15}
						height={15}
						isFullPage={false}
						containerStyles={`w-[15px] mr-2 ${isIconReady ? 'hidden' : ''}`}
					/>
				</>
			)}
			<TextElement textStyles={buttonTextStyles}>{option.label}</TextElement>
		</ButtonPrimary>
	);
};

export default CustomMultiSelectModalOption;
