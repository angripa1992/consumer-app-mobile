import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface CalendarIconProps {
	width?: number;
	height?: number;
	color?: string;
}

const CalendarIcon = ({
	width = 16,
	height = 16,
	color = '#858585',
}: CalendarIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
			<Path
				d='M11.333 0.5V3.83333M4.66634 0.5V3.83333M1.33301 7.16667H14.6663M7.16634 10.5H7.99967V13M1.33301 3.83333C1.33301 3.39131 1.5086 2.96738 1.82116 2.65482C2.13372 2.34226 2.55765 2.16667 2.99967 2.16667H12.9997C13.4417 2.16667 13.8656 2.34226 14.1782 2.65482C14.4907 2.96738 14.6663 3.39131 14.6663 3.83333V13.8333C14.6663 14.2754 14.4907 14.6993 14.1782 15.0118C13.8656 15.3244 13.4417 15.5 12.9997 15.5H2.99967C2.55765 15.5 2.13372 15.3244 1.82116 15.0118C1.5086 14.6993 1.33301 14.2754 1.33301 13.8333V3.83333Z'
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default CalendarIcon;
