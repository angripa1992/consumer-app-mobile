import { updateOptimisticInQueryData } from './optimisticHelpers';

import type { UseDeleteSpotFromList } from '@/lib/types/queries';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type {
	TypeGetCandidateSpotsResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
} from '@/lib/types/spot';
import type { TypeResponseUserListsSchema } from '@/lib/types/spotList';

const updateOptimisticWhenRemoveSpotInSpotListInSearchSpotCandidates = async ({
	currentQueryClient,
	spotSpotListId,
	spotListId,
	currentCity,

	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotSpotListId: number;
	spotListId: number;
	currentCity: string;
	searchQuery?: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotCandidates', searchQuery, currentCity, spotListId],
		getUpdatedData: (oldData) => {
			const spotsResponse =
				oldData as InfiniteData<TypeGetCandidateSpotsResponse>;

			const newData = spotsResponse.pages.map((page) => {
				const newSpots = page.spots.map((spot) => {
					if (spot.spot_spot_list_id === spotSpotListId) {
						return {
							...spot,
							relationship_with_spot_list: false,
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
				...spotsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenRemoveSpotInSpotListInSearchSpotsAvailable = async ({
	currentQueryClient,
	spotSpotListId,
	spotListId,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	spotSpotListId: number;
	spotListId: number;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['allAvailableSpots', spotListId, currentCity],
		getUpdatedData: (old) => {
			const spotsResponse =
				old as InfiniteData<TypeResponseAllAvailableSpotsResponseSchema>;

			const newData = spotsResponse.pages.map((page) => {
				const newSpots = page.spots.map((spot) => {
					if (spot.spot_spot_list_id === spotSpotListId) {
						return {
							...spot,
							relationship_with_spot_list: false,
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
				...spotsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenRemoveSpotInSpotListInSingleSpot = async ({
	currentQueryClient,
	currentUserId,
	spotSpotListId,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	currentUserId: number;
	spotSpotListId: number;
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
						const newSpotsRelationShip =
							spotList.spot_and_spot_list_relationship.filter((spot) => {
								return spot.spot_spot_list_id !== spotSpotListId;
							});
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

export const updateOptimisticWhenRemoveSpotInSpotList = async ({
	currentQueryClient,
	queryMutateDestination,
	spotSpotListId,
	spotListId,
	searchQuery,
	currentCity,
	userId,
}: UseDeleteSpotFromList & {
	currentQueryClient: QueryClient;
	spotSpotListId: number;
}) => {
	if (
		queryMutateDestination === 'searchSpotsAvailable' &&
		spotListId &&
		currentCity
	) {
		await updateOptimisticWhenRemoveSpotInSpotListInSearchSpotsAvailable({
			currentQueryClient,
			spotSpotListId,
			spotListId,
			currentCity,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsCandidate' &&
		currentCity &&
		spotListId
	) {
		await updateOptimisticWhenRemoveSpotInSpotListInSearchSpotCandidates({
			currentQueryClient,
			spotSpotListId,
			currentCity,

			searchQuery,
			spotListId,
		});
	}

	if (queryMutateDestination === 'spot' && userId && spotListId) {
		await updateOptimisticWhenRemoveSpotInSpotListInSingleSpot({
			currentQueryClient,
			currentUserId: userId,
			spotSpotListId,
			spotListId,
		});
	}
};

export const onErrorOptimisticWhenRemoveSpotInSpotList = ({
	currentQueryClient,
	queryMutateDestination,
	currentCity,
	searchQuery,
	context,
	spotListId,
	userId,
}: UseDeleteSpotFromList & {
	currentQueryClient: QueryClient;
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
			['spotCandidates', searchQuery, currentCity, spotListId],
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
