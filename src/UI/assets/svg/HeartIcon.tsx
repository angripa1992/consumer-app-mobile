import Svg, { Path } from 'react-native-svg';

type HeartIconProps = {
	color?: string;
	width?: number;
	height?: number;
	fill?: string;
};

const HeartIcon = ({
	color,
	width = 16,
	height = 16,
	fill = 'none',
}: HeartIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 16' fill={fill}>
			<Path
				d='M2.87868 4.21218C1.70711 5.38375 1.70711 7.28324 2.87868 8.45482L8.00004 13.5762L13.1213 8.45482C14.2929 7.28324 14.2929 5.38375 13.1213 4.21218C11.9497 3.0406 10.0503 3.0406 8.87868 4.21218L8.00004 5.09089L7.12132 4.21218C5.94975 3.0406 4.05025 3.0406 2.87868 4.21218Z'
				stroke={color ?? '#B0B0B0'}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default HeartIcon;
