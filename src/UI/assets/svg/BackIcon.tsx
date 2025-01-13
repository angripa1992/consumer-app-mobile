import Svg, { Path } from 'react-native-svg';

type TypeBackIconProps = {
	color?: string;
	width?: string;
	height?: string;
};

function BackIcon({
	color = '#B0B0B0',
	width = '6',
	height = '12',
}: TypeBackIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 6 12' fill='none'>
			<Path
				d='M5.5 1L0.5 6L5.5 11'
				stroke={color}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default BackIcon;
