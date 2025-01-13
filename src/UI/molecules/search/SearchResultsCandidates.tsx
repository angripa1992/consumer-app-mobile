import React, { useCallback } from 'react';
import { View } from 'react-native';
import { TypeSpotSearchCandidate } from '@/lib/types/spot';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { i18nInstance } from 'config/i18n';

import SpotCandidateCard from '../spot/SpotCandidateCard';
import InfiniteScrollFlashList from '../infiniteScroll/InfiniteScrollFlashList';

interface SearchResultsCandidatesProps {
	spotListId: number;
	currentCity: string;
	searchQuery: string;
	spotsCandidates: TypeSpotSearchCandidate[];
	isLoadingSpotsCandidates: boolean;
	fetchNextPageSpotsCandidates: () => void;
	hasNextPageSpotsCandidates: boolean | undefined;
	isFetchingNextPageSpotsCandidates: boolean;
	refetchSpotsCandidates: () => void;
}

const SearchResultsCandidates = ({
	spotListId,
	currentCity,
	searchQuery,
	spotsCandidates,
	isLoadingSpotsCandidates,
	fetchNextPageSpotsCandidates,
	hasNextPageSpotsCandidates,
	isFetchingNextPageSpotsCandidates,
	refetchSpotsCandidates,
}: SearchResultsCandidatesProps) => {
	useRefetchOnFocus(refetchSpotsCandidates);

	const renderCandidateSpotCard = useCallback(
		({ item, index }: { item: TypeSpotSearchCandidate; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			if (item.id)
				return (
					<SpotCandidateCard
						queryMutateDestination='searchSpotsCandidate'
						id={item.id}
						googlePlaceLocationId={item.google_place_location_id}
						spotListId={spotListId}
						name={item.name}
						relationshipWithSpotList={item.relationship_with_spot_list}
						spotType='db'
						screen='searchSpots'
						viewerStatusTags={item.viewer_status_tags}
						currentCity={currentCity}
						searchQuery={searchQuery}
						spotSpotListId={item.spot_spot_list_id}
						testID={`spot-candidate-${index}`}
						spotScribblesCount={item.scribbles_count}
						cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
						smallImage={
							(item.small_image ? item.small_image : item.spot_image) ?? null
						}
					/>
				);

			return (
				<SpotCandidateCard
					queryMutateDestination='searchSpotsCandidate'
					id={item.id}
					spotListId={spotListId}
					name={item.name}
					relationshipWithSpotList={item.relationship_with_spot_list}
					city={item.city}
					country={item.country}
					address={item.address ?? ''}
					spotType='googlePlaces'
					screen='searchSpots'
					viewerStatusTags={item.viewer_status_tags}
					currentCity={currentCity}
					searchQuery={searchQuery}
					spotSpotListId={item.spot_spot_list_id}
					googlePlaceLocationId={item.google_place_location_id as string}
					state={item.state}
					testID={`spot-candidate-${index}`}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
				/>
			);
		},
		[currentCity, spotListId, searchQuery],
	);

	return (
		<InfiniteScrollFlashList
			dataToRender={spotsCandidates}
			isLoading={isLoadingSpotsCandidates}
			keyExtractor={(item, index) => {
				if ('empty' in item && item.empty) {
					return `empty-${index}`;
				}
				return '' + index;
			}}
			renderItem={renderCandidateSpotCard}
			fetchNextPage={fetchNextPageSpotsCandidates}
			hasNextPage={hasNextPageSpotsCandidates}
			isFetchingNextPage={isFetchingNextPageSpotsCandidates}
			textForNoItemsAvailable={i18nInstance.t('noSpotsFound')}
		/>
	);
};

export default SearchResultsCandidates;
