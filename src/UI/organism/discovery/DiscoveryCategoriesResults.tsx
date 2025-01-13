import { useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getCategoriesNameAndData } from '@/lib/helpers/categoriesHelpers';
import { usePostDiscoveryCategories } from '@/lib/hooks/useQueryDiscovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import CategoryTemplateFlashList from '@/UI/molecules/category/CategoryFlashListTemplate';

import type { ViewMoreScreenNavigationProp } from '@/lib/types/tabScreenParams';
import type { TypeSpotListFromDiscoveryCard } from '@/lib/types/discovery';

interface DiscoveryCategoriesResultsProps {
	renderSpotListCard: (
		values: TypeSpotListFromDiscoveryCard,
	) => React.JSX.Element;
	currentCity: string;
	debounceSearchQuery: string;
}

const DiscoveryCategoriesResults = ({
	renderSpotListCard,
	currentCity,
	debounceSearchQuery,
}: DiscoveryCategoriesResultsProps) => {
	const navigation = useNavigation<ViewMoreScreenNavigationProp>();

	const { discoveryCategories, refetchDiscoveryCategories } =
		usePostDiscoveryCategories(currentCity, {
			search_content: debounceSearchQuery,
		});

	const onViewMoreNavigation = useCallback(
		(title: string, categoryName: string) => {
			navigation.navigate('ViewMore', {
				title,
				city: currentCity,
				type: 'categories',
				categoryName,
				querySearch: debounceSearchQuery,
			});
		},
		[navigation, currentCity, debounceSearchQuery],
	);

	const discoveryMainCategoriesToRender = useMemo(
		() => getCategoriesNameAndData(discoveryCategories),
		[discoveryCategories],
	);

	useRefetchOnFocus(refetchDiscoveryCategories);

	return (
		<ScrollView showsVerticalScrollIndicator={false} className='flex-1 mt-5'>
			{discoveryMainCategoriesToRender.map((category) => (
				<CategoryTemplateFlashList
					key={category.category_name}
					title={category.category_name_to_render}
					onClickViewMore={() =>
						onViewMoreNavigation(
							category.category_name_to_render,
							category.category_name,
						)
					}
					data={category.data}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item, index }) =>
						renderSpotListCard({
							item,
							index,
							categoryName: category.category_name,
							containerStyles: 'w-[150px]',
							queryMutateDestination: 'categorySpotListDiscovery',
							isHorizontal: true,
						})
					}
					estimatedItemSize={150}
					ItemSeparatorComponent={() => <View className=' w-[20px]' />}
				/>
			))}
		</ScrollView>
	);
};

export default DiscoveryCategoriesResults;
