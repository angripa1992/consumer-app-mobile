import Svg, { Path } from 'react-native-svg';

interface SavedIconProps {
	color?: string;
	width?: number;
	height?: number;
	fill?: string;
	isBig?: boolean;
}
const SavedIcon = ({
	color = '#858585',
	width = 16,
	height = 16,
	fill = 'none',
	isBig = false,
}: SavedIconProps) => {
	if (isBig) {
		return (
			<Svg width={width} height={height} viewBox='0 0 11 14' fill={fill}>
				<Path
					d='M0.833008 2.33333C0.833008 1.59695 1.42996 1 2.16634 1H8.83301C9.56939 1 10.1663 1.59695 10.1663 2.33333V13L5.49967 10.6667L0.833008 13V2.33333Z'
					stroke={color}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Svg>
		);
	}

	return (
		<Svg width={width} height={height} viewBox='0 0 20 20' fill={fill}>
			<Path
				d='M7.5 3.33301H12.5C12.942 3.33301 13.366 3.5086 13.6785 3.82116C13.9911 4.13372 14.1667 4.55765 14.1667 4.99967V16.6663L10 14.1663L5.83334 16.6663V4.99967C5.83334 4.55765 6.00893 4.13372 6.32149 3.82116C6.63405 3.5086 7.05798 3.33301 7.5 3.33301Z'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default SavedIcon;
