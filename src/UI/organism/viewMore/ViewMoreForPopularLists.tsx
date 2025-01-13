import { useGetViewMorePopularLists } from '@/lib/hooks/useQueryViewMore';
import { TypeSpotListFromDiscovery } from '@/lib/types/discovery';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import SpotListThumbnail from '../spotList/SpotListThumbnail';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { i18nInstance } from 'config/i18n';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForPopularListsProps {
	city: string;
	querySearch: string;
}

const ViewMoreForPopularLists = ({
	city,
	querySearch,
}: ViewMoreForPopularListsProps) => {
	const {
		popularLists,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetViewMorePopularLists(city, 'popular_lists', {
		search_content: querySearch,
	});

	useRefetchOnFocus(refetch);

	const renderSpotListCard = useCallback(
		(singleSpotList: TypeSpotListFromDiscovery, index: number) => {
			if ('empty' in singleSpotList && singleSpotList.empty) {
				return <View className=' flex-1'></View>;
			}
			return (
				<SpotListThumbnail
					queryMutateDestination='viewMorePopularLists'
					title={singleSpotList.name}
					creator={singleSpotList.creator}
					viewsCount={singleSpotList.view_counter}
					likesCount={singleSpotList.followers_spot_list_counter}
					locationCount={singleSpotList.spot_counter}
					userId={singleSpotList.user_id}
					spotListId={singleSpotList.id}
					spotsImages={singleSpotList.spot_images_available}
					isFollowing={singleSpotList.is_following}
					searchQuery={querySearch}
					currentCity={city}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
				/>
			);
		},
		[],
	);

	return (
		<>
			{isLoading && (
				<View className='flex items-center flex-1 justify-center  '>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{popularLists && (
				<InfiniteScrollFlashList
					dataToRender={popularLists}
					renderItem={({ item, index }) => {
						return renderSpotListCard(item, index);
					}}
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isLoading={isLoading}
					isFetchingNextPage={isFetchingNextPage}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id.toString();
					}}
					textForNoItemsAvailable={i18nInstance.t('noSpotListsAvailable')}
				/>
			)}
		</>
	);
};

export default ViewMoreForPopularLists;
