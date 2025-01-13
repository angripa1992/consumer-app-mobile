import { Path, Rect, Svg } from 'react-native-svg';

interface CheckFormIconProps {
	width?: number;
	height?: number;
	color?: string;
	isChecked?: boolean;
}

const CheckFormIcon = ({
	width = 16,
	height = 17,
	color = '#1C1C1C',
	isChecked = false,
}: CheckFormIconProps) => {
	if (!isChecked) {
		return (
			<Svg width={width} height={height} viewBox='0 0 16 17' fill='none'>
				<Rect
					x='0.5'
					y='1.09961'
					width={15}
					height={15}
					rx='3.5'
					fill='white'
				/>
				<Rect
					x='0.5'
					y='1.09961'
					width={15}
					height={15}
					rx='3.5'
					stroke='#D0D5DD'
				/>
			</Svg>
		);
	}

	return (
		<Svg width={width} height={height} viewBox='0 0 16 17' fill='none'>
			<Rect
				x='0.5'
				y='1.09961'
				width={15}
				height={15}
				rx='3.5'
				fill='#F0E7FE'
			/>
			<Rect
				x='0.5'
				y='1.09961'
				width={15}
				height={15}
				rx='3.5'
				stroke={color}
			/>
			<Path
				d='M12 5.59961L6.5 11.0996L4 8.59961'
				stroke={color}
				strokeWidth='1.6666'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default CheckFormIcon;
