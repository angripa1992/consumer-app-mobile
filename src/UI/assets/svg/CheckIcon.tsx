import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
	width?: number;
	height?: number;
	color?: string;
}

const CheckIcon = ({
	width = 21,
	height = 20,
	color = '#FFF',
}: CheckIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 21 20' fill='none'>
			<Path
				d='M4.99414 10L9.16081 14.1667L17.4941 5.83337'
				stroke={color}
				strokeWidth={3}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default CheckIcon;
