import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

import { usePostDiscoveryLists } from '@/lib/hooks/useQueryDiscovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import type { TypeSpotListFromDiscoveryCard } from '@/lib/types/discovery';
import { useCallback } from 'react';

interface DiscoveryListsProps {
	searchQuery: string;
	currentCity: string;
	renderSpotListCard: (
		values: TypeSpotListFromDiscoveryCard,
	) => React.JSX.Element;
}

const DiscoveryLists = ({
	searchQuery,
	currentCity,
	renderSpotListCard,
}: DiscoveryListsProps) => {
	const {
		discoveryLists,
		isLoadingDiscoveryLists,
		fetchNextPageDiscoveryLists,
		hasNextPageDiscoveryLists,
		isFetchingNextPageDiscoveryLists,
		refetchDiscoveryLists,
	} = usePostDiscoveryLists(currentCity, {
		search_content: searchQuery,
	});

	useRefetchOnFocus(refetchDiscoveryLists);

	const renderItem = useCallback(
		({
			item,
			index,
		}: {
			item: TypeSpotListFromDiscoveryCard['item'];
			index: number;
		}) =>
			renderSpotListCard({
				item,
				index,
				categoryName: 'spotListDiscovery',
				queryMutateDestination: 'spotListDiscovery',
			}),
		[renderSpotListCard],
	);

	const keyExtractor = useCallback(
		(item: TypeSpotListFromDiscoveryCard['item'], index: number) => {
			if ('empty' in item && item.empty) {
				return `empty-${index}`;
			}
			return item.id.toString();
		},
		[],
	);

	return (
		<InfiniteScrollFlashList
			dataToRender={discoveryLists}
			renderItem={renderItem}
			hasNextPage={hasNextPageDiscoveryLists}
			fetchNextPage={fetchNextPageDiscoveryLists}
			isLoading={isLoadingDiscoveryLists}
			isFetchingNextPage={isFetchingNextPageDiscoveryLists}
			customEmptyComponent={<></>}
			keyExtractor={keyExtractor}
		/>
	);
};

export default DiscoveryLists;
