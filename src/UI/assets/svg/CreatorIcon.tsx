import Svg, { G, Path } from 'react-native-svg';

interface TypeCreatorIcon {
	color?: string;
}

const CreatorIcon = ({ color }: TypeCreatorIcon) => {
	return (
		<Svg
			width='24.000000pt'
			height='24.000000pt'
			viewBox='0 0 24.000000 24.000000'
			preserveAspectRatio='xMidYMid meet'
		>
			<G
				transform='translate(0.000000,24.000000) scale(0.100000,-0.100000)'
				fill={color}
				stroke='none'
			>
				<Path
					d='M99 200 c-9 -24 -17 -30 -40 -30 -39 0 -50 -27 -19 -50 18 -14 21
    -23 16 -47 -9 -39 7 -50 39 -29 23 15 27 15 50 0 33 -21 47 -10 39 31 -5 26
    -2 36 16 48 30 21 20 47 -19 47 -23 0 -31 6 -40 30 -5 17 -15 30 -21 30 -6 0
    -16 -13 -21 -30z m74 -50 l32 -1 -24 -19 c-19 -16 -22 -26 -17 -50 6 -30 5
    -30 -19 -14 -23 15 -27 15 -50 0 l-25 -16 7 31 c5 26 2 35 -18 50 l-24 19 33
    0 c26 0 35 5 43 28 l11 27 10 -27 c8 -23 16 -28 41 -28z'
				/>
			</G>
		</Svg>
	);
};

export default CreatorIcon;
