import { View } from 'react-native';

import { usePostDiscoverySpotsWithInfiniteScroll } from '@/lib/hooks/useQueryDiscovery';

import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import SpotCandidateCard from '@/UI/molecules/spot/SpotCandidateCard';
import { useCallback } from 'react';
import { TypeSpotFromDiscovery } from '@/lib/types/discovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForPopularSpotsProps {
	area: string;
	city: string;
	querySearch: string;
}

const ViewMoreForSearchSpots = ({
	area,
	city,
	querySearch,
}: ViewMoreForPopularSpotsProps) => {
	const {
		allDiscoverySpots,
		isLoadingAllDiscoverySpots,
		fetchNextPageAllDiscoverySpots,
		hasNextPageAllDiscoverySpots,
		isFetchingNextPageAllDiscoverySpots,
		refetchAllDiscoverySpots,
	} = usePostDiscoverySpotsWithInfiniteScroll(city, area, {
		search_content: querySearch,
	});

	useRefetchOnFocus(refetchAllDiscoverySpots);

	const renderSpotCard = useCallback(
		({ item, index }: { item: TypeSpotFromDiscovery; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			if (item.id) {
				return (
					<SpotCandidateCard
						queryMutateDestination='allSpotDiscovery'
						id={item.id}
						name={item.name}
						spotType='db'
						smallImage={item.small_image}
						viewerStatusTags={item.viewer_status_tags}
						screen='notSearchSpots'
						currentCity={city}
						googlePlaceLocationId={item.google_place_location_id}
						spotLikeCounter={item.spot_like_counter}
						spotScribblesCount={item.scribbles_count ?? 0}
						searchQuery={querySearch}
						cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
						currentArea={area}
					/>
				);
			}

			return (
				<SpotCandidateCard
					queryMutateDestination='allSpotDiscovery'
					id={item.id}
					name={item.name}
					city={item.city}
					country={item.country}
					address={item.address}
					googlePlaceLocationId={item.google_place_location_id as string}
					smallImage={item.small_image}
					spotType='googlePlaces'
					viewerStatusTags={item.viewer_status_tags}
					screen='notSearchSpots'
					currentCity={city}
					searchQuery={querySearch}
					state={item.state}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
					currentArea={area}
				/>
			);
		},
		[],
	);

	return (
		<>
			{isLoadingAllDiscoverySpots && (
				<View className='flex items-center flex-1 justify-center'>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{allDiscoverySpots && (
				<InfiniteScrollFlashList
					hasNextPage={hasNextPageAllDiscoverySpots}
					isFetchingNextPage={isFetchingNextPageAllDiscoverySpots}
					fetchNextPage={fetchNextPageAllDiscoverySpots}
					isLoading={isLoadingAllDiscoverySpots}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					dataToRender={allDiscoverySpots}
					renderItem={renderSpotCard}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id
							? item.id.toString()
							: item?.google_place_location_id?.toString() || index.toString();
					}}
				/>
			)}
		</>
	);
};

export default ViewMoreForSearchSpots;
