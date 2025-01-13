import { Path, Svg } from 'react-native-svg';

interface LikeThumbIconProps {
	width?: number;
	height?: number;
	color?: string;
	isPositive?: boolean;
}

const LikeThumbIcon = ({
	width = 13,
	height = 13,
	isPositive = true,
	color = '#fff',
}: LikeThumbIconProps) => {
	if (!isPositive) {
		return (
			<Svg width={width} height={height} viewBox='0 0 13 13' fill='none'>
				<Path
					d='M9.66634 7.33317L9.66634 0.666503M9.66634 7.33317L12.333 7.33318L12.333 0.666503H9.66634M9.66634 7.33317L6.20261 11.3742C5.87394 11.7576 5.35688 11.9225 4.86688 11.8L4.83521 11.7921C3.94067 11.5684 3.53774 10.5261 4.04914 9.75894L5.66634 7.33318H2.62608C1.78468 7.33318 1.15361 6.56344 1.31861 5.73837L2.11861 1.73837C2.24328 1.1151 2.79048 0.666503 3.42608 0.666503L9.66634 0.666503'
					stroke={color}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Svg>
		);
	}

	return (
		<Svg width={width} height={height} viewBox='0 0 13 13' fill='none'>
			<Path
				d='M3.33366 5.66683V12.3335M3.33366 5.66683L0.666992 5.66682V12.3335H3.33366M3.33366 5.66683L6.79739 1.62581C7.12606 1.24236 7.64312 1.07752 8.13312 1.20001L8.16479 1.20794C9.05933 1.43157 9.46226 2.47388 8.95086 3.24106L7.33366 5.66682H10.3739C11.2153 5.66682 11.8464 6.43656 11.6814 7.26163L10.8814 11.2616C10.7567 11.8849 10.2095 12.3335 9.57392 12.3335H3.33366'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default LikeThumbIcon;
