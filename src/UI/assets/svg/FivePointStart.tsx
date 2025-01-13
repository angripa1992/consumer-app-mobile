import Svg, { Path } from 'react-native-svg';

interface FivePointStartProps {
	width?: number;
	height?: number;
	color?: string;
}

const FivePointStart = ({
	width = 25,
	height = 25,
	color = '#fff',
}: FivePointStartProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 18 17' fill='none'>
			<Path
				d='M8.99963 13.3125L4.37063 15.7462L5.25488 10.5915L1.50488 6.94122L6.67988 6.19122L8.99438 1.50146L11.3089 6.19122L16.4839 6.94122L12.7339 10.5915L13.6181 15.7462L8.99963 13.3125Z'
				stroke={color}
				stroke-width='1.125'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default FivePointStart;
