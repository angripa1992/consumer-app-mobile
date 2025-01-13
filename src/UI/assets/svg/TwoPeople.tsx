import Svg, { Path } from 'react-native-svg';

interface TwoPeopleIconProps {
	width?: number;
	height?: number;
	color?: string;
}

const TwoPeopleIcon = ({
	width = 15,
	height = 15,
	color = '#858585',
}: TwoPeopleIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 12 12' fill='none'>
			<Path
				d='M6.25 1.53994C6.67755 1.05552 7.3031 0.75 8 0.75C9.28867 0.75 10.3333 1.79467 10.3333 3.08333C10.3333 4.372 9.28867 5.41667 8 5.41667C7.3031 5.41667 6.67755 5.11114 6.25 4.62673M8 11.25H1V10.6667C1 8.73367 2.567 7.16667 4.5 7.16667C6.433 7.16667 8 8.73367 8 10.6667V11.25ZM8 11.25H11.5V10.6667C11.5 8.73367 9.933 7.16667 8 7.16667C7.3625 7.16667 6.7648 7.33711 6.25 7.6349M6.83333 3.08333C6.83333 4.372 5.78866 5.41667 4.5 5.41667C3.21134 5.41667 2.16667 4.372 2.16667 3.08333C2.16667 1.79467 3.21134 0.75 4.5 0.75C5.78866 0.75 6.83333 1.79467 6.83333 3.08333Z'
				stroke={color}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default TwoPeopleIcon;
