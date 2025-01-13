import Svg, { Path } from 'react-native-svg';

type AtmosphereIconProps = {
	color?: string;
};

function AtmosphereIcon({ color }: AtmosphereIconProps) {
	return (
		<Svg width='16' height='16' viewBox='0 0 6 16' fill='none'>
			<Path
				d='M0.5 15.5H5.5V8C5.5 7.77899 5.4122 7.56702 5.25592 7.41074C5.09964 7.25446 4.88768 7.16667 4.66667 7.16667H1.33333C1.11232 7.16667 0.900358 7.25446 0.744078 7.41074C0.587798 7.56702 0.5 7.77899 0.5 8V15.5Z'
				stroke={color ?? '#B0B0B0'}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<Path
				d='M3.00001 0.5L4.22084 1.865C4.43869 2.09919 4.58455 2.39113 4.64101 2.70596C4.69746 3.02079 4.66214 3.34521 4.53925 3.64051C4.41635 3.93582 4.21109 4.18952 3.94794 4.37134C3.68479 4.55316 3.37489 4.65542 3.05521 4.66592C2.73553 4.67642 2.41958 4.59471 2.14507 4.43054C1.87056 4.26637 1.64909 4.02668 1.50709 3.74008C1.36509 3.45348 1.30856 3.13207 1.34425 2.81421C1.37993 2.49636 1.50632 2.19548 1.70834 1.9475L3.00001 0.5Z'
				stroke={color ?? '#B0B0B0'}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default AtmosphereIcon;
