import Svg, { Circle } from 'react-native-svg';

interface MarkerIconProps {
	stroke?: string;
}

const MarkerIcon = ({ stroke = '#FFFFFF' }: MarkerIconProps) => {
	return (
		<Svg width={25} height={25} viewBox='0 0 25 25' fill='none'>
			<Circle
				cx='12.5'
				cy='12.5'
				r='10.5'
				fill='black'
				stroke={stroke}
				strokeWidth={4}
			/>
		</Svg>
	);
};

export default MarkerIcon;
