import Svg, { Path } from 'react-native-svg';

interface LocationMarkerIconProps {
	color?: string;
	width?: number;
	height?: number;
}

const LocationMarkerIcon = ({
	color = '#B0B0B0',
	width = 16,
	height = 16,
}: LocationMarkerIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
			<Path
				d='M11.7713 11.1046C11.2495 11.6263 10.252 12.6239 9.41384 13.462C8.63279 14.243 7.36729 14.2431 6.58624 13.462C5.76385 12.6396 4.78311 11.6589 4.22878 11.1046C2.14599 9.02177 2.14599 5.64489 4.22878 3.5621C6.31158 1.4793 9.68846 1.4793 11.7713 3.5621C13.8541 5.64489 13.8541 9.02177 11.7713 11.1046Z'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<Path
				d='M10 7.33333C10 8.4379 9.10459 9.33333 8.00002 9.33333C6.89545 9.33333 6.00002 8.4379 6.00002 7.33333C6.00002 6.22876 6.89545 5.33333 8.00002 5.33333C9.10459 5.33333 10 6.22876 10 7.33333Z'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default LocationMarkerIcon;
