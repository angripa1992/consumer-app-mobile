import {
	Pressable,
	PressableProps,
	StyleProp,
	Text,
	View,
	ViewStyle,
} from 'react-native';

import type { ReactNode } from 'react';
import type { TypeButtonPrimaryDesignVariations } from '@/lib/types/atoms';

type TypeButtonPrimaryProps = {
	children: ReactNode;
	designVariation?: TypeButtonPrimaryDesignVariations;
	buttonStyles?: string;
	textStyles?: string;
	nodeContentStyles?: string;
	onPress?: PressableProps['onPress'];
	onPressIn?: PressableProps['onPressIn'];
	onPressOut?: PressableProps['onPressOut'];
	onLongPress?: PressableProps['onLongPress'];
	disabled?: boolean;
	hitSlop?: number;
	isReactNodeContent?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
};

const ButtonPrimary = ({
	children,
	designVariation = 'white',
	buttonStyles,
	textStyles,
	nodeContentStyles,
	onPress,
	onPressIn,
	onPressOut,
	onLongPress,
	hitSlop,
	disabled,
	style,
	isReactNodeContent = false,
	testID,
}: TypeButtonPrimaryProps): JSX.Element => {
	let designButton = '';
	let designText = '';

	if (designVariation === 'white') {
		designButton = 'bg-white border border-white';
		designText = 'text-button-black';
	}
	if (designVariation === 'white-transparent') {
		designButton = 'bg-transparent border border-white';
		designText = 'text-white';
	}
	if (designVariation === 'purple') {
		designButton = 'bg-purple';
		designText = 'text-white';
	}
	if (designVariation === 'green') {
		designButton = 'bg-principal-green';
		designText = 'text-button-black';
	}
	if (designVariation === 'gray') {
		designButton = 'bg-transparent border border-middle-gray';
		designText = 'text-social-media-gray';
	}

	if (designVariation === 'light-gray') {
		designButton = 'bg-[#FFFFFF1A]';
		designText = 'text-white';
	}

	if (designVariation === 'ghost') {
		designButton = 'bg-transparent';
		designText = 'text-white underline';
	}
	if (designVariation === 'custom') {
		designButton = '';
		designText = '';
	}

	return (
		<Pressable
			onPress={onPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			className={`py-3 px-4 rounded-3xl ${designButton} ${buttonStyles ?? ''}`}
			style={style}
			hitSlop={hitSlop}
			onLongPress={onLongPress}
			disabled={disabled}
			testID={testID}
		>
			{isReactNodeContent ? (
				<View className={nodeContentStyles}>{children}</View>
			) : (
				<Text
					className={`text-center text-xs ${designText} ${textStyles ?? ''}`}
				>
					{children}
				</Text>
			)}
		</Pressable>
	);
};
export default ButtonPrimary;
