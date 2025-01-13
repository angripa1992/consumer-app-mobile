import Svg, { Path } from 'react-native-svg';

type InfoIconProps = {
	color?: string;
	width?: number;
	height?: number;
};

function InfoIcon({
	color = '#858585',
	width = 15,
	height = 15,
}: InfoIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 14 14' fill='none'>
			<Path
				d='M7 1a6 6 0 1 0 0 12a6 6 0 0 0 0-12z'
				stroke={color}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<Path
				d='M7 6v4'
				stroke={color}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<Path
				d='M7 4v1'
				stroke={color}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default InfoIcon;
