import Svg, { Path } from 'react-native-svg';

const CuisineIcon = () => {
	return (
		<Svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
			<Path
				d='M16.6667 12.5V2.5C12.6533 6.32833 12.4808 9.4325 12.5 12.5H16.6667ZM16.6667 12.5L16.6667 17.5H15.8333V15M6.66666 10V15M3.33333 2.5H9.99999L9.16666 10H4.16666L3.33333 2.5ZM5.83333 15H7.49999V17.5H5.83333V15Z'
				stroke='#858585'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
};

export default CuisineIcon;
