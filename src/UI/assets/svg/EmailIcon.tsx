import Svg, { Path } from 'react-native-svg';

type EmailIconProps = {
	color?: string;
};

function EmailIcon({ color }: EmailIconProps) {
	return (
		<Svg width='16' height='14' viewBox='0 0 16 14' fill='none'>
			<Path
				d='M0.5 3.6665L7.0755 8.05017C7.63533 8.42339 8.36467 8.42339 8.9245 8.05017L15.5 3.6665M2.16667 12.8332H13.8333C14.7538 12.8332 15.5 12.087 15.5 11.1665V2.83317C15.5 1.9127 14.7538 1.1665 13.8333 1.1665H2.16667C1.24619 1.1665 0.5 1.9127 0.5 2.83317V11.1665C0.5 12.087 1.24619 12.8332 2.16667 12.8332Z'
				stroke={color ?? '#858585'}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default EmailIcon;
