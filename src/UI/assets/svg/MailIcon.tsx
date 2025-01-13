import Svg, { Path } from 'react-native-svg';

interface MailIconProps {
	width?: number;
	height?: number;
	color?: string;
}

const MailIcon = ({
	width = 25,
	height = 25,
	color = '#fff',
}: MailIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 12' fill='none'>
			<Path
				d='M1.25 2.25C1.25 1.85218 1.40804 1.47064 1.68934 1.18934C1.97064 0.908035 2.35218 0.75 2.75 0.75H13.25C13.6478 0.75 14.0294 0.908035 14.3107 1.18934C14.592 1.47064 14.75 1.85218 14.75 2.25M1.25 2.25V9.75C1.25 10.1478 1.40804 10.5294 1.68934 10.8107C1.97064 11.092 2.35218 11.25 2.75 11.25H13.25C13.6478 11.25 14.0294 11.092 14.3107 10.8107C14.592 10.5294 14.75 10.1478 14.75 9.75V2.25M1.25 2.25L8 6.75L14.75 2.25'
				stroke={color}
				stroke-width='1.125'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};

export default MailIcon;
