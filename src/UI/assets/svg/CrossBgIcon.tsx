import Svg, { Path } from 'react-native-svg';

type TypeCrossIconProps = {
	borderColor?: string;
	bgColor?: string;
};

function CrossBgIcon({
	borderColor = '#6A13F4',
	bgColor = '#F5F5F5',
}: TypeCrossIconProps) {
	return (
		<Svg width='35' height='35' viewBox='0 0 26 26' fill='none'>
			<Path
				d='M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z'
				fill={bgColor}
			/>
			<Path
				d='M13 9V13M13 13V17M13 13H17M13 13H9M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z'
				stroke={borderColor}
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={3}
			/>
		</Svg>
	);
}

export default CrossBgIcon;
