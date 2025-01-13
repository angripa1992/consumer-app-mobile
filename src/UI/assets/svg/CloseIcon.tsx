import Svg, { Path } from 'react-native-svg';

interface CloseIconProps {
	color?: string;
	width?: number;
	height?: number;
}

const CloseIcon = ({
	color = '#858585',
	width = 20,
	height = 20,
}: CloseIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 20 20' fill='none'>
			<Path
				d='M15 5L5 15M5 5L15 15'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default CloseIcon;
