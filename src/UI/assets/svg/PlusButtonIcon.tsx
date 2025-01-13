import { Circle, Path, Svg } from 'react-native-svg';

interface PlusButtonIconProps {
	isActive?: boolean;
	width?: number;
	height?: number;
}
const PlusButtonIcon = ({
	width = 17,
	height = 16,
	isActive = false,
}: PlusButtonIconProps) => {
	if (isActive) {
		return (
			<Svg width={width} height={height} viewBox='0 0 17 16' fill='none'>
				<Circle cx='8.49967' cy='8.00065' r='6.66667' fill='#B0B0B0' />
				<Path
					d='M6.5 8H10.5M8.5 6V10'
					stroke='#1C1C1C'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Svg>
		);
	}

	return (
		<Svg width={width} height={height} viewBox='0 0 17 16' fill='none'>
			<Path
				d='M8.5 6V8M8.5 8V10M8.5 8H10.5M8.5 8H6.5M14.5 8C14.5 11.3137 11.8137 14 8.5 14C5.18629 14 2.5 11.3137 2.5 8C2.5 4.68629 5.18629 2 8.5 2C11.8137 2 14.5 4.68629 14.5 8Z'
				stroke='#B0B0B0'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default PlusButtonIcon;
