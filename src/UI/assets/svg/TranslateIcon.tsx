import Svg, { Path } from 'react-native-svg';

type TypeTranslateIconProps = {
	width?: number;
	height?: number;
	color?: string;
};

const TranslateIcon = ({
	width = 16,
	height = 17,
	color = '#BFBFBF',
}: TypeTranslateIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 17' fill='none'>
			<Path
				d='M1.33301 3.16667H7.16634M5.49967 1.5V3.16667C5.49967 6.84833 3.63384 9.83333 1.33301 9.83333M2.16634 6.5C2.16634 8.28667 4.62634 9.75667 7.74967 9.83333M7.99967 15.6667L11.333 8.16667L14.6663 15.6667M13.9163 14H8.74967'
				stroke={color}
				stroke-width='1.2'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default TranslateIcon;
