import Svg, { Path } from 'react-native-svg';

type PhoneIconProps = {
	color?: string;
};

function PhoneIcon({ color }: PhoneIconProps) {
	return (
		<Svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
			<Path
				d='M0.5 2.16667C0.5 1.24619 1.24619 0.5 2.16667 0.5H4.89937C5.25806 0.5 5.57651 0.729525 5.68994 1.06981L6.93811 4.81434C7.06926 5.20777 6.89115 5.63776 6.52022 5.82322L4.63917 6.76375C5.55771 8.80101 7.19898 10.4423 9.23625 11.3608L10.1768 9.47978C10.3622 9.10885 10.7922 8.93074 11.1857 9.06189L14.9302 10.3101C15.2705 10.4235 15.5 10.7419 15.5 11.1006V13.8333C15.5 14.7538 14.7538 15.5 13.8333 15.5H13C6.09644 15.5 0.5 9.90356 0.5 3V2.16667Z'
				stroke={color ?? '#858585'}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default PhoneIcon;
