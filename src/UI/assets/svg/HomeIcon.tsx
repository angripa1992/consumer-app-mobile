import Svg, { Path } from 'react-native-svg';

type HomeIconProps = {
	color?: string;
	width?: number;
	height?: number;
};

function HomeIcon({ color, width = 12, height = 12 }: HomeIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 12 13' fill='none'>
			<Path
				d='M0.75 6.5L1.91667 5.33333M1.91667 5.33333L6 1.25L10.0833 5.33333M1.91667 5.33333V11.1667C1.91667 11.4888 2.17783 11.75 2.5 11.75H4.25M10.0833 5.33333L11.25 6.5M10.0833 5.33333V11.1667C10.0833 11.4888 9.82217 11.75 9.5 11.75H7.75M4.25 11.75C4.57217 11.75 4.83333 11.4888 4.83333 11.1667V8.83333C4.83333 8.51117 5.0945 8.25 5.41667 8.25H6.58333C6.9055 8.25 7.16667 8.51117 7.16667 8.83333V11.1667C7.16667 11.4888 7.42783 11.75 7.75 11.75M4.25 11.75H7.75'
				stroke={color ?? '#F5F5F5'}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default HomeIcon;
