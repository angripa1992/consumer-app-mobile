import Svg, { Path } from 'react-native-svg';

type WebsiteIconProps = {
	color?: string;
	width?: number;
	height?: number;
};

function WebsiteIcon({ color, height = 20, width = 20 }: WebsiteIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 20 20' fill='none'>
			<Path
				d='M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5M17.5 10C17.5 5.85786 14.1421 2.5 10 2.5M17.5 10H2.5M10 17.5C5.85786 17.5 2.5 14.1421 2.5 10M10 17.5C11.3807 17.5 12.5 14.1421 12.5 10C12.5 5.85786 11.3807 2.5 10 2.5M10 17.5C8.61929 17.5 7.5 14.1421 7.5 10C7.5 5.85786 8.61929 2.5 10 2.5M2.5 10C2.5 5.85786 5.85786 2.5 10 2.5'
				stroke={color ?? '#858585'}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
}

export default WebsiteIcon;
