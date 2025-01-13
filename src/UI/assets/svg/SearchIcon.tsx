import Svg, { Path } from 'react-native-svg';

type TypeSearchIconProps = {
	color?: string;
};

function SearchIcon({ color }: TypeSearchIconProps) {
	return (
		<Svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
			<Path
				stroke={color}
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
			/>
		</Svg>
	);
}

export default SearchIcon;
