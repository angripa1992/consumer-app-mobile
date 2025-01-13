import Svg, { Path } from 'react-native-svg';

type TypePersonIconProps = {
	color?: string;
};

function PersonIcon({ color }: TypePersonIconProps) {
	return (
		<Svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
			<Path
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
			/>
		</Svg>
	);
}

export default PersonIcon;
