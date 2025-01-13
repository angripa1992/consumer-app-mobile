import { TagOptionString } from '@/lib/types/tags';
import ButtonPrimary from '../button/ButtonPrimary';
import TextElement from '../text/TextElement';
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import Spinner from '../spinner/Spinner';

interface CustomMultiSelectFormOptionProps {
	option: TagOptionString;

	disabled?: boolean;
	isItemSelected: boolean;

	optionsActiveTextStyles?: string;
	optionsStyles?: string;
	optionsTextStyles?: string;
	optionsDefaultColor?: string;
	optionsBackgroundOpacity?: string;

	selectedOptions: string[];
	limitSelectedOptions?: number;
	onPressOption: () => void;
}

const CustomMultiSelectFormOption = ({
	option,
	isItemSelected,
	onPressOption,
	optionsTextStyles,
	optionsActiveTextStyles,
	optionsStyles,
	optionsDefaultColor = '#252525',
	optionsBackgroundOpacity = '6b',
	disabled = false,
	selectedOptions,
	limitSelectedOptions,
}: CustomMultiSelectFormOptionProps) => {
	const [isIconReady, setIsIconReady] = useState(false);
	const color = option.color ?? '#833BF6';
	const backgroundOpacity = optionsBackgroundOpacity;

	const hasIcon = !!option.icon;
	const iconSrc = option.icon ?? '';

	const backgroundColor = isItemSelected
		? `${color}${backgroundOpacity}`
		: optionsDefaultColor;
	const textColor = isItemSelected ? optionsActiveTextStyles : '';
	const borderColor = isItemSelected ? color : optionsDefaultColor;

	const isLimitOptionsExceeded = limitSelectedOptions
		? selectedOptions.length === limitSelectedOptions
		: undefined;
	const disabledOption = isLimitOptionsExceeded && !isItemSelected;

	const disabledStyle = disabledOption || disabled ? 'opacity-50' : '';

	return (
		<ButtonPrimary
			designVariation='ghost'
			buttonStyles={`rounded-full border py-1 px-2 mt-2 ${optionsStyles} ${disabledStyle}`}
			isReactNodeContent={true}
			nodeContentStyles='flex flex-row items-center justify-center'
			disabled={disabledOption || disabled}
			onPress={onPressOption}
			style={{
				backgroundColor,
				borderColor,
			}}
		>
			{hasIcon && (
				<>
					<SvgUri
						width={14}
						height={14}
						uri={iconSrc}
						onLoad={() => {
							setIsIconReady(true);
						}}
						className={`${isIconReady ? '' : 'hidden'} mr-1`}
					/>
					<Spinner
						width={14}
						height={14}
						isFullPage={false}
						containerStyles={`w-[14px] mr-1 ${isIconReady ? 'hidden' : ''}`}
					/>
				</>
			)}
			<TextElement
				textStyles={`text-[11px] text-white ${optionsTextStyles} ${textColor}`}
			>
				{option.label}
			</TextElement>
		</ButtonPrimary>
	);
};

export default CustomMultiSelectFormOption;
