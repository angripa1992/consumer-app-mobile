import { Path, Svg } from 'react-native-svg';

interface ListsIconProps {
	color?: string;
	width?: number;
	height?: number;
}

const ListsIcon = ({
	color = '#F5F5F5',
	width = 25,
	height = 24,
}: ListsIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 20 24' fill='none'>
			<Path
				d='M6.25 3.25H3.75C2.36929 3.25 1.25 4.36929 1.25 5.75V20.75C1.25 22.1307 2.36929 23.25 3.75 23.25H16.25C17.6307 23.25 18.75 22.1307 18.75 20.75V5.75C18.75 4.36929 17.6307 3.25 16.25 3.25H13.75M6.25 3.25C6.25 4.63071 7.36929 5.75 8.75 5.75H11.25C12.6307 5.75 13.75 4.63071 13.75 3.25M6.25 3.25C6.25 1.86929 7.36929 0.75 8.75 0.75H11.25C12.6307 0.75 13.75 1.86929 13.75 3.25M10 12H13.75M10 17H13.75M6.25 12H6.2625M6.25 17H6.2625'
				stroke={color}
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</Svg>
	);
};

export default ListsIcon;
