import { FlatList, View } from 'react-native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import { i18nInstance } from 'config/i18n';

import type { TypeFilterTabsData } from '@/lib/types/app';

type FilterTabsProps = {
	dataFilterTabs: TypeFilterTabsData[];
	currentFilter: string;
	setCurrentFilter: (value: string) => void;
	containerStyles?: string;
};

const FilterTabs = ({
	dataFilterTabs,
	currentFilter,
	setCurrentFilter,
	containerStyles,
}: FilterTabsProps) => {
	const handleActiveTabStyles = (
		tabValue: string,
		elementToStyled: 'button' | 'text',
	) => {
		if (elementToStyled === 'button') {
			if (tabValue === currentFilter) {
				return 'bg-middle-gray text-white';
			}
		}
		if (elementToStyled === 'text') {
			if (tabValue === currentFilter) {
				return 'text-white';
			}
		}
		return '';
	};

	const handleUpdateCurrentTabFilter = (tabValue: string) => {
		setCurrentFilter(tabValue);
	};

	return (
		<View className={`${containerStyles ?? ''}`}>
			<FlatList
				data={dataFilterTabs}
				keyExtractor={(item) => item.value}
				horizontal
				alwaysBounceHorizontal={false}
				overScrollMode='never'
				contentContainerStyle={{ gap: 8 }}
				renderItem={({ item }) => (
					<ButtonPrimary
						designVariation='gray'
						buttonStyles={`rounded-full w-[90px] px-0 ${handleActiveTabStyles(
							item.value,
							'button',
						)}`}
						textStyles={handleActiveTabStyles(item.value, 'text')}
						onPress={() => handleUpdateCurrentTabFilter(item.value)}
						testID={`profile-filter-${item.value}`}
					>
						{i18nInstance.t(item.name)}
					</ButtonPrimary>
				)}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

export default FilterTabs;
