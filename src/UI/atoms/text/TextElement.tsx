import { Text, TextProps } from 'react-native';

import type { ReactNode } from 'react';

interface TextElementProps extends TextProps {
	children: ReactNode;
	textStyles?: string;
	numberOfLines?: number;
	ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
	testID?: string;
	designVariation?: 'text' | 'title' | 'subtitle' | 'main-title';
	fontFamily?: 'inter' | 'pachang';
}

const TextElement = ({
	children,
	numberOfLines,
	ellipsizeMode,
	testID,
	textStyles = '',
	designVariation = 'text',
	fontFamily = 'inter',
	...props
}: TextElementProps) => {
	let textDesign = '';

	const classNameFont = fontFamily === 'inter' ? 'font-interThin' : '';
	const styleNameFont =
		fontFamily === 'pachang' ? { fontFamily: 'pachangSemibold' } : {};

	if (designVariation === 'text') {
		textDesign = '';
	} else if (designVariation === 'title') {
		textDesign = 'text-2xl font-medium text-white';
	} else if (designVariation === 'subtitle') {
		textDesign = 'text-lg font-medium text-white';
	} else if (designVariation === 'main-title') {
		textDesign = 'text-white text-3xl font-semibold lowercase mt-4';
	}

	return (
		<Text
			className={`${classNameFont} ${textStyles} ${textDesign}`}
			numberOfLines={numberOfLines}
			ellipsizeMode={ellipsizeMode}
			testID={testID}
			{...props}
			style={[props.style, styleNameFont]}
		>
			{children}
		</Text>
	);
};

export default TextElement;
