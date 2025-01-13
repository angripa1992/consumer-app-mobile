import { TypeAllAvailableSpots } from '@/lib/types/spot';
import { View } from 'react-native';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import SpotCandidateCard from '../spot/SpotCandidateCard';
import { useCallback } from 'react';
import InfiniteScrollFlashList from '../infiniteScroll/InfiniteScrollFlashList';

interface SearchResultsAvailableProps {
	allAvailableSpots: TypeAllAvailableSpots[];
	spotListId: number;
	isLoadingSpotsAvailable: boolean;
	fetchNextPageSpotsAvailable: () => void;
	hasNextPageSpotsAvailable: boolean | undefined;
	isFetchingNextPageSpotsAvailable: boolean;
	currentCity: string;
	refetchSpotsAvailable: () => void;
}
const SearchResultsAvailable = ({
	allAvailableSpots,
	spotListId,
	isLoadingSpotsAvailable,
	fetchNextPageSpotsAvailable,
	hasNextPageSpotsAvailable,
	isFetchingNextPageSpotsAvailable,
	currentCity,
	refetchSpotsAvailable,
}: SearchResultsAvailableProps) => {
	useRefetchOnFocus(refetchSpotsAvailable);

	const renderSpotCard = useCallback(
		({ item, index }: { item: TypeAllAvailableSpots; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			return (
				<SpotCandidateCard
					queryMutateDestination='searchSpotsAvailable'
					id={item.id}
					googlePlaceLocationId={null}
					spotListId={spotListId}
					name={item.name}
					tripAdvisorLocationId={item.tripadvisor_location_id}
					relationshipWithSpotList={item.relationship_with_spot_list}
					smallImage={item.small_image}
					spotType='db'
					spotLikeCounter={item.spot_like_counter}
					screen='searchSpots'
					viewerStatusTags={item.viewer_status_tags}
					spotSpotListId={item.spot_spot_list_id ?? 0}
					spotScribblesCount={item.scribbles_count ?? 0}
					currentCity={currentCity}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
				/>
			);
		},
		[spotListId, currentCity],
	);

	return (
		<InfiniteScrollFlashList
			dataToRender={allAvailableSpots}
			isLoading={isLoadingSpotsAvailable}
			keyExtractor={(item, index) => {
				if ('empty' in item && item.empty) {
					return `empty-${index}`;
				}
				return item.id.toString() + index;
			}}
			renderItem={renderSpotCard}
			fetchNextPage={fetchNextPageSpotsAvailable}
			hasNextPage={hasNextPageSpotsAvailable}
			isFetchingNextPage={isFetchingNextPageSpotsAvailable}
		/>
	);
};

export default SearchResultsAvailable;
