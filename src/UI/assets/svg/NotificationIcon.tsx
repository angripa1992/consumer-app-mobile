import { Ellipse, Path, Svg } from 'react-native-svg';

interface NotificationIconProps {
	width?: number;
	height?: number;
	hasNotification?: boolean;
}

const NotificationIcon = ({
	width = 16,
	height = 16,
	hasNotification,
}: NotificationIconProps) => {
	return (
		<Svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
			<Path
				d='M5.49967 12.1667V13C5.49967 13.663 5.76307 14.2989 6.23191 14.7678C6.70075 15.2366 7.33663 15.5 7.99967 15.5C8.66272 15.5 9.2986 15.2366 9.76744 14.7678C10.2363 14.2989 10.4997 13.663 10.4997 13V12.1667M6.33301 2.16667C6.33301 1.72464 6.5086 1.30072 6.82116 0.988155C7.13372 0.675595 7.55765 0.5 7.99967 0.5C8.4417 0.5 8.86562 0.675595 9.17819 0.988155C9.49075 1.30072 9.66634 1.72464 9.66634 2.16667C10.6233 2.61919 11.4392 3.32361 12.0264 4.20442C12.6136 5.08523 12.95 6.10923 12.9997 7.16667V9.66667C13.0624 10.1848 13.2459 10.6809 13.5354 11.1151C13.8248 11.5493 14.2122 11.9095 14.6663 12.1667H1.33301C1.78712 11.9095 2.17452 11.5493 2.464 11.1151C2.75348 10.6809 2.93696 10.1848 2.99967 9.66667V7.16667C3.04931 6.10923 3.38576 5.08523 3.97297 4.20442C4.56017 3.32361 5.376 2.61919 6.33301 2.16667Z'
				stroke='#F0E7FE'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			{hasNotification && (
				<Ellipse cx='12.167' cy={3} rx='2.5' ry='2.5' fill='#F43F5E' />
			)}
		</Svg>
	);
};

export default NotificationIcon;
