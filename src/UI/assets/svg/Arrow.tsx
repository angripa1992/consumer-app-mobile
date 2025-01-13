import Svg, { Path } from 'react-native-svg';

type TypeArrowIconProps = {
	color?: string;
	className?: string;
	width?: number;
	height?: number;
};

function ArrowIcon({
	color = '#BFBFBF',
	className = '',

	width = 7,
	height = 12,
}: TypeArrowIconProps) {
	return (
		<Svg
			width={width}
			height={height}
			viewBox='0 0 7 12'
			fill='none'
			className={className}
		>
			<Path
				d='M1 1L6 6L1 11'
				stroke={color}
				stroke-width='1.2'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default ArrowIcon;
