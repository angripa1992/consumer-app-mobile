import Svg, { Path } from 'react-native-svg';

type PlusIconProps = {
	color?: string;
	width?: string;
	height?: string;
};

function PlusIcon({ color, width = '12', height = '12' }: PlusIconProps) {
	return (
		<Svg width={width} height={height} viewBox='0 0 13 12' fill='none'>
			<Path
				d='M6.49967 1.3335V10.6668M11.1663 6.00016L1.83301 6.00016'
				stroke={color ?? 'white'}
				stroke-width='2'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default PlusIcon;
