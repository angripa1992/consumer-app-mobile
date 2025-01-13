import Svg, { Path } from 'react-native-svg';

type TypeStarIconProps = {
	color?: string;
};

function StarIcon({ color }: TypeStarIconProps) {
	return (
		<Svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
			<Path
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
			/>
		</Svg>
	);
}

export default StarIcon;
