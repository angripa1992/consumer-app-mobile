import { useState } from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import TextElement from '@/UI/atoms/text/TextElement';
import Spinner from '@/UI/atoms/spinner/Spinner';

interface SpotStatusProps {
	color: string;
	icon: string | null;
	text?: string;
	containerClassName?: string;
	textClassName?: string;
}

const SpotStatus = ({
	color = '#833BF6',
	text,
	icon,
	containerClassName = '',
	textClassName = '',
}: SpotStatusProps) => {
	const [isIconReady, setIsIconReady] = useState(false);
	const iconSrc = icon ?? '';
	const backgroundColor = `${color}6b`;

	const hasIcon = !!icon;
	const hasText = !!text;
	return (
		<View
			className={`rounded-full   flex flex-row items-center border justify-center   ${
				!hasText ? 'w-[20px] h-[20px]' : 'px-2 py-1'
			} ${containerClassName}`}
			style={{
				backgroundColor,
				borderColor: color,
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
						className={`${isIconReady ? '' : 'hidden'} ${
							hasText ? 'mr-1' : ''
						}`}
					/>
					<Spinner
						width={14}
						height={14}
						isFullPage={false}
						containerStyles={`w-[14px] ${hasText ? 'mr-1' : ''} ${
							isIconReady ? 'hidden' : ''
						}`}
					/>
				</>
			)}
			{hasText && (
				<TextElement textStyles={`text-[11px] text-white ${textClassName}`}>
					{text}
				</TextElement>
			)}
		</View>
	);
};

export default SpotStatus;
