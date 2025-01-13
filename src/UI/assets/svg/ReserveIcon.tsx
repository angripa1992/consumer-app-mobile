import Svg, { Path } from 'react-native-svg';

type ReserveIconProps = {
	color?: string;
	width?: number;
	height?: number;
};

function ReserveIcon({
	color = 'white',
	width = 15,
	height = 14,
}: ReserveIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 15 14' fill='none'>
			<Path
				d='M5.75 11.6663H9.25M7.5 8.16634V11.6663M5.75 5.24967H9.25M2.83333 3.49967C2.83333 3.19026 2.95624 2.89351 3.17504 2.67472C3.39383 2.45592 3.69058 2.33301 3.99999 2.33301H11C11.3094 2.33301 11.6062 2.45592 11.825 2.67472C12.0437 2.89351 12.1667 3.19026 12.1667 3.49967V6.99967C12.1667 7.30909 12.0437 7.60584 11.825 7.82463C11.6062 8.04342 11.3094 8.16634 11 8.16634H3.99999C3.69058 8.16634 3.39383 8.04342 3.17504 7.82463C2.95624 7.60584 2.83333 7.30909 2.83333 6.99967V3.49967Z'
				stroke='#0D0D0D'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default ReserveIcon;
