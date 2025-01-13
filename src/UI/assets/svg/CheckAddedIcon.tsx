import { Svg, Path } from 'react-native-svg';

interface CheckAddedIconProps {
	checked?: boolean;
	width?: number;
	height?: number;
}

const CheckAddedIcon = ({
	checked = false,
	width = 20,
	height = 20,
}: CheckAddedIconProps) => {
	if (!checked) {
		return (
			<Svg width={width} height={height} viewBox='0 0 24 24' fill='none'>
				<Path
					d='M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15'
					stroke='#B0B0B0'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Svg>
		);
	}

	return (
		<Svg width={width} height={height} viewBox='0 0 20 20' fill='none'>
			<Path
				d='M7.49999 9.16634L9.99999 11.6663L16.6667 4.99967M16.6667 9.99967V14.9997C16.6667 15.4417 16.4911 15.8656 16.1785 16.1782C15.8659 16.4907 15.442 16.6663 15 16.6663H4.99999C4.55797 16.6663 4.13404 16.4907 3.82148 16.1782C3.50892 15.8656 3.33333 15.4417 3.33333 14.9997V4.99967C3.33333 4.55765 3.50892 4.13372 3.82148 3.82116C4.13404 3.5086 4.55797 3.33301 4.99999 3.33301H12.5'
				stroke='#858585'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default CheckAddedIcon;
