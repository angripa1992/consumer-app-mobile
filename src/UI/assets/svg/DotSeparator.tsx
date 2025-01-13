import React from 'react';
import { Circle, Svg } from 'react-native-svg';

interface DotSeparatorProps {
	width?: number;
	height?: number;
	color?: string;
}

const DotSeparator = ({
	width = 2,
	height = 3,
	color = '#F5F5F5',
}: DotSeparatorProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 2 3' fill='none'>
			<Circle cx={1} cy='1.5' r={1} fill={color} />
		</Svg>
	);
};

export default DotSeparator;
