import { useGetViewMorePopularSpots } from '@/lib/hooks/useQueryViewMore';
import { TypePopularSpotsFromDiscovery } from '@/lib/types/discovery';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import SpotThumbnail from '../spot/SpotThumbnail';
import { i18nInstance } from 'config/i18n';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForPopularSpotsProps {
	city: string;
	querySearch: string;
}

const ViewMoreForPopularSpots = ({
	city,
	querySearch,
}: ViewMoreForPopularSpotsProps) => {
	const {
		popularSpots,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetViewMorePopularSpots(city, 'popular_spots', {
		search_content: querySearch,
	});

	const renderSpotCard = useCallback(
		({
			item: spot,
			index,
		}: {
			item: TypePopularSpotsFromDiscovery;
			index: number;
		}) => {
			if ('empty' in spot && spot.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<SpotThumbnail
					queryMutateDestination='viewMorePopularSpots'
					{...spot}
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
			{popularSpots && (
				<InfiniteScrollFlashList
					className='flex-1'
					dataToRender={popularSpots}
					renderItem={renderSpotCard}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id.toString();
					}}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					isLoading={isLoading}
					textForNoItemsAvailable={i18nInstance.t('noSpotsAvailable')}
				/>
			)}
		</>
	);
};

export default ViewMoreForPopularSpots;
