import Svg, { Path, Rect, Defs, ClipPath, G } from 'react-native-svg';

function FacebookIcon() {
	return (
		<Svg width='19' height='18' viewBox='0 0 19 18' fill='none'>
			<G clip-path='url(#clip0_128_16233)'>
				<Rect width='18' height='18' transform='translate(0.5)' fill='white' />
				<Path
					d='M18.5 9C18.5 4.02943 14.4706 0 9.5 0C4.52943 0 0.5 4.02943 0.5 9C0.5 13.4921 3.79115 17.2155 8.09375 17.8907V11.6016H5.80859V9H8.09375V7.01719C8.09375 4.76156 9.43742 3.51562 11.4932 3.51562C12.4776 3.51562 13.5078 3.69141 13.5078 3.69141V5.90625H12.373C11.255 5.90625 10.9062 6.60006 10.9062 7.3125V9H13.4023L13.0033 11.6016H10.9062V17.8907C15.2088 17.2155 18.5 13.4921 18.5 9Z'
					fill='#1877F2'
				/>
				<Path
					d='M13.0033 11.6016L13.4023 9H10.9062V7.3125C10.9062 6.60076 11.255 5.90625 12.373 5.90625H13.5078V3.69141C13.5078 3.69141 12.4779 3.51562 11.4932 3.51562C9.43742 3.51562 8.09375 4.76156 8.09375 7.01719V9H5.80859V11.6016H8.09375V17.8907C9.02558 18.0364 9.97442 18.0364 10.9062 17.8907V11.6016H13.0033Z'
					fill='white'
				/>
			</G>
			<Defs>
				<ClipPath id='clip0_128_16233'>
					<Rect
						width='18'
						height='18'
						fill='white'
						transform='translate(0.5)'
					/>
				</ClipPath>
			</Defs>
		</Svg>
	);
}

export default FacebookIcon;
