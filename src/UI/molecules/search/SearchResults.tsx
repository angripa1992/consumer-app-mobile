import { View } from 'react-native';

import {
	useGetAllAvailableSpots,
	useGetSpotCandidates,
} from '@/lib/hooks/UseQuerySpot';

import SearchResultsCandidates from './SearchResultsCandidates';
import SearchResultsAvailable from './SearchResultsAvailable';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';

import type { TypePostSearchCandidate } from '@/lib/types/spot';

interface SearchResultsProps {
	spotListId: number;
	isSearchDone: boolean;
	debounceSpotSearchQuery: string;
	currentCity: string;
	isListCreating?: boolean;
}

const SearchResults = ({
	spotListId,
	isSearchDone,
	debounceSpotSearchQuery,
	currentCity,
}: SearchResultsProps) => {
	const valuesToSend = (): TypePostSearchCandidate => {
		return {
			city_name: currentCity,
			name: debounceSpotSearchQuery,
			spot_list_id: spotListId,
		};
	};

	const {
		allAvailableSpots,
		isLoading: isLoadingSpotsAvailable,
		hasNextPage: hasNextPageSpotsAvailable,
		fetchNextPage: fetchNextPageSpotsAvailable,
		isFetchingNextPage: isFetchingNextPageSpotsAvailable,
		refetch: refetchSpotsAvailable,
	} = useGetAllAvailableSpots(spotListId, currentCity);

	const {
		spotCandidates,
		isLoading: isLoadingSpotsCandidates,
		hasNextPage: hasNextPageSpotsCandidates,
		fetchNextPage: fetchNextPageSpotsCandidates,
		isFetchingNextPage: isFetchingNextPageSpotsCandidates,
		refetch: refetchSpotsCandidates,
	} = useGetSpotCandidates(valuesToSend(), currentCity, isSearchDone);

	const isLoading = isSearchDone
		? isLoadingSpotsCandidates
		: isLoadingSpotsAvailable;

	return (
		<View className='flex-1'>
			{isLoading ? (
				<View className='h-[70%] w-full flex items-center justify-center'>
					<SpinnerCup />
				</View>
			) : (
				<>
					{isSearchDone && spotCandidates && (
						<SearchResultsCandidates
							spotListId={spotListId}
							spotsCandidates={spotCandidates}
							isLoadingSpotsCandidates={isLoadingSpotsCandidates}
							fetchNextPageSpotsCandidates={fetchNextPageSpotsCandidates}
							hasNextPageSpotsCandidates={hasNextPageSpotsCandidates}
							isFetchingNextPageSpotsCandidates={
								isFetchingNextPageSpotsCandidates
							}
							refetchSpotsCandidates={refetchSpotsCandidates}
							currentCity={currentCity}
							searchQuery={debounceSpotSearchQuery}
						/>
					)}
					{!isSearchDone && allAvailableSpots && (
						<SearchResultsAvailable
							allAvailableSpots={allAvailableSpots}
							spotListId={spotListId}
							isLoadingSpotsAvailable={isLoadingSpotsAvailable}
							fetchNextPageSpotsAvailable={fetchNextPageSpotsAvailable}
							hasNextPageSpotsAvailable={hasNextPageSpotsAvailable}
							isFetchingNextPageSpotsAvailable={
								isFetchingNextPageSpotsAvailable
							}
							refetchSpotsAvailable={refetchSpotsAvailable}
							currentCity={currentCity}
						/>
					)}
				</>
			)}
		</View>
	);
};

export default SearchResults;
