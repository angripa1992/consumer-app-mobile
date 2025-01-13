import { updateOptimisticInQueryData } from './optimisticHelpers';

import type { UsePostSpotToSpotList } from '@/lib/types/queries';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type {
	TypeGetCandidateSpotsResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
} from '@/lib/types/spot';
import type { TypeResponseUserListsSchema } from '@/lib/types/spotList';

const updateOptimisticWhenAddSpotInSpotListInSearchSpotCandidates = async ({
	currentQueryClient,
	spotId,
	isCandidateSpot,
	spotListId,
	currentCity,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	spotListId: number;
	currentCity: string;
	isCandidateSpot?: boolean;
	searchQuery?: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotCandidates', searchQuery, currentCity, spotListId],
		getUpdatedData: (oldData) => {
			const spotsFromDiscoveryResponse =
				oldData as InfiniteData<TypeGetCandidateSpotsResponse>;

			const newData = spotsFromDiscoveryResponse.pages.map((page) => {
				const newSpots = page.spots.map((spot) => {
					if (isCandidateSpot) {
						if (spot.google_place_location_id === spotId) {
							return {
								...spot,
								relationship_with_spot_list: true,
							};
						}
					}

					if (spot.id === spotId) {
						return {
							...spot,
							relationship_with_spot_list: true,
						};
					}

					return spot;
				});

				return {
					...page,
					spots: newSpots,
				};
			});

			return {
				...spotsFromDiscoveryResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenAddSpotInSpotListInSearchSpotsAvailable = async ({
	currentQueryClient,
	spotId,
	spotListId,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	spotListId: number;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['allAvailableSpots', spotListId, currentCity],
		getUpdatedData: (old) => {
			const spotsNearbyResponse =
				old as InfiniteData<TypeResponseAllAvailableSpotsResponseSchema>;

			const newData = spotsNearbyResponse.pages.map((page) => {
				const newSpots = page.spots.map((spot) => {
					if (spot.id === spotId) {
						return {
							...spot,
							relationship_with_spot_list: true,
						};
					}

					return spot;
				});

				return {
					...page,
					spots: newSpots,
				};
			});

			return {
				...spotsNearbyResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenAddSpotInSpotListInSingleSpot = async ({
	currentQueryClient,
	currentUserId,
	spotId,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	currentUserId: number;
	spotId: number | string;
	spotListId: number;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['userLists', currentUserId, 'my_list'],
		getUpdatedData: (old) => {
			const userSpotListsResponse =
				old as InfiniteData<TypeResponseUserListsSchema>;

			const newData = userSpotListsResponse?.pages.map((page) => {
				const newSpotLists = page.spot_lists.map((spotList) => {
					if (spotList.id === spotListId) {
						const newSpotsRelationShip = [
							...spotList.spot_and_spot_list_relationship,
							{
								spot_id: spotId,
							},
						];

						return {
							...spotList,
							spot_and_spot_list_relationship: newSpotsRelationShip,
						};
					}

					return spotList;
				});

				return {
					...page,
					spot_lists: newSpotLists,
				};
			});

			return {
				...userSpotListsResponse,
				pages: newData,
			};
		},
	});
};

export const updateOptimisticWhenAddSpotInSpotList = async ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	isCandidateSpot,
	spotListId,
	searchQuery,
	currentCity,
	userId,
}: UsePostSpotToSpotList & {
	currentQueryClient: QueryClient;
	spotId: number | string;
	spotListId: number;
}) => {
	if (queryMutateDestination === 'searchSpotsAvailable' && currentCity) {
		await updateOptimisticWhenAddSpotInSpotListInSearchSpotsAvailable({
			currentQueryClient,
			spotId,
			spotListId,
			currentCity,
		});
	}

	if (queryMutateDestination === 'searchSpotsCandidate' && currentCity) {
		await updateOptimisticWhenAddSpotInSpotListInSearchSpotCandidates({
			currentQueryClient,
			spotId,
			isCandidateSpot,
			spotListId,
			currentCity,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'spot' && userId && spotListId) {
		await updateOptimisticWhenAddSpotInSpotListInSingleSpot({
			currentQueryClient,
			currentUserId: userId,
			spotId,
			spotListId,
		});
	}
};

export const onErrorOptimisticWhenAddSpotInSpotList = ({
	currentQueryClient,
	queryMutateDestination,
	currentCity,
	searchQuery,
	context,
	spotListId,
	userId,
}: UsePostSpotToSpotList & {
	currentQueryClient: QueryClient;
	spotListId: number;
	context:
		| void
		| {
				previousData: unknown;
		  }
		| undefined;
}) => {
	if (queryMutateDestination === 'searchSpotsAvailable') {
		currentQueryClient.setQueryData(
			['allAvailableSpots', spotListId, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'searchSpotsCandidate' && currentCity) {
		currentQueryClient.setQueryData(
			['spotCandidates', searchQuery, currentCity, , spotListId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spot') {
		currentQueryClient.setQueryData(
			['userLists', userId, 'my_list'],
			context?.previousData,
		);
	}
};
