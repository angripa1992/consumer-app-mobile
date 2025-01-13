import React from 'react';
import { Svg, Path } from 'react-native-svg';

type TypeDownArrowIconProps = {
	rotate?: boolean;
};

const DownArrowIcon = ({ rotate = false }: TypeDownArrowIconProps) => {
	return (
		<Svg
			className={rotate ? '-rotate-180' : ''}
			width={12}
			height={7}
			viewBox='0 0 12 7'
			fill='none'
		>
			<Path
				d='M10.6668 1L6.00016 5.66667L1.3335 1'
				stroke='#B0B0B0'
				strokeWidth={2}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default DownArrowIcon;
