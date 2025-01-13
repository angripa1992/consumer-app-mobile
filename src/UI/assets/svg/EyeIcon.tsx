import Svg, { Path } from 'react-native-svg';

interface EyeIconProps {
	width?: number;
	height?: number;
}

const EyeIcon = ({ width = 16, height = 16 }: EyeIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
			<Path
				d='M9.99984 8.00016C9.99984 9.10473 9.10441 10.0002 7.99984 10.0002C6.89527 10.0002 5.99984 9.10473 5.99984 8.00016C5.99984 6.89559 6.89527 6.00016 7.99984 6.00016C9.10441 6.00016 9.99984 6.89559 9.99984 8.00016Z'
				stroke='#B0B0B0'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<Path
				d='M1.63867 8.00014C2.48819 5.29541 5.01504 3.3335 8.00013 3.3335C10.9852 3.3335 13.5121 5.29544 14.3616 8.00019C13.5121 10.7049 10.9852 12.6668 8.00014 12.6668C5.01504 12.6668 2.48817 10.7049 1.63867 8.00014Z'
				stroke='#B0B0B0'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default EyeIcon;
