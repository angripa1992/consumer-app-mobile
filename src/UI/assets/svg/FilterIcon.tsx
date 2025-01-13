import Svg, { Path } from 'react-native-svg';

function FilterIcon() {
	return (
		<Svg width='13' height='12' viewBox='0 0 13 12' fill='none'>
			<Path
				d='M1.25 1.75C1.25 1.19772 1.69772 0.75 2.25 0.75H10.75C11.3023 0.75 11.75 1.19772 11.75 1.75V2.66912C11.75 2.93434 11.6446 3.18869 11.4571 3.37623L7.95956 6.87377C7.77202 7.06131 7.66667 7.31566 7.66667 7.58088V8.91667L5.33333 11.25V7.58088C5.33333 7.31566 5.22798 7.06131 5.04044 6.87377L1.54289 3.37623C1.35536 3.18869 1.25 2.93434 1.25 2.66912V1.75Z'
				stroke='#F5F5F5'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
}

export default FilterIcon;
