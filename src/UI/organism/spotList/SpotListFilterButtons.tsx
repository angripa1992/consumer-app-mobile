import { PressableProps, View } from 'react-native';

import { i18nInstance } from 'config/i18n';
import { singleListSpotsFilterData } from '@/lib/data/spotListData';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type {
	TypeSingleListSpotsFilter,
	TypeSingleListSpotsFilterValue,
} from '@/lib/types/listFilter';
import type { TypeSpotSingleToSpotList } from '@/lib/types/spot';

interface SpotListFilterButtonsProps {
	spots?: TypeSpotSingleToSpotList[];
	currentFilter: TypeSingleListSpotsFilterValue;
	setCurrentFilter: React.Dispatch<
		React.SetStateAction<TypeSingleListSpotsFilterValue>
	>;
}

const SpotListFilterButtons = ({
	spots,
	currentFilter,
	setCurrentFilter,
}: SpotListFilterButtonsProps) => {
	const onClickFilter =
		(filterTag: TypeSingleListSpotsFilter): PressableProps['onPress'] =>
		() => {
			setCurrentFilter(filterTag.value);
		};

	if (spots && spots.length === 0) return null;

	return (
		<View className='flex-row gap-x-5 mb-4'>
			{singleListSpotsFilterData.map((filterTag) => {
				const isFilterActive = currentFilter === filterTag.value;
				const buttonStyles = isFilterActive ? 'bg-middle-gray ' : '';
				const textStyles = isFilterActive ? 'text-white' : '';

				return (
					<ButtonPrimary
						designVariation='gray'
						buttonStyles={`flex-1 rounded-full px-2 border justify-center ${buttonStyles}`}
						textStyles={textStyles}
						onPress={onClickFilter(filterTag)}
						key={filterTag.name}
						testID={`list-filter-${filterTag.value}`}
					>
						{i18nInstance.t(filterTag.name.toLowerCase())}
					</ButtonPrimary>
				);
			})}
		</View>
	);
};

export default SpotListFilterButtons;
