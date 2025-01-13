import Svg, { Path } from 'react-native-svg';

function ClockIcon() {
	return (
		<Svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
			<Path
				d='M10 6.66667V10L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z'
				stroke='#858585'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default ClockIcon;
