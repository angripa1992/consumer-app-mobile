import { Path, Svg } from 'react-native-svg';

interface LargeArrowIconProps {
	color?: string;
	width?: number;
	height?: number;
}

const LargeArrowIcon = ({
	color = '#fff',
	width = 12,
	height = 10,
}: LargeArrowIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 12 10' fill='none'>
			<Path
				d='M1.33301 5H10.6663M10.6663 5L6.66634 9M10.6663 5L6.66634 1'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default LargeArrowIcon;
