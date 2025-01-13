import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import {
	updateFollowCounter,
	updateOptimisticInQueryData,
} from './optimisticHelpers';

import type { UseUpdateStatusTagsInSingleSpot } from '@/lib/types/queries';
import type {
	TypeGetCandidateSpotsResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
	TypeResponseAllUserSpotSchemaResponse,
	TypeResponseDetailsSpotCandidate,
	TypeResponseSpotSingleResponseSchema,
	TypeResponseSpotsFromSpotList,
	TypeResponseSpotsNearbyResponseSchema,
	TypeSpotForOptimisticUpdate,
	TypeStatusTagsSchema,
} from '@/lib/types/spot';
import type {
	TypeDiscoveryResponse,
	TypeDiscoverySpotsResponse,
} from '@/lib/types/discovery';
import type {
	TypeResponseViewMorePopularSpotsFromDiscovery,
	TypeResponseViewMoreUserSpotsResponseSchema,
} from '@/lib/types/viewMore';

const updateStatusTagsForSpot = (
	spot: TypeSpotForOptimisticUpdate,
	newStatusTags: Partial<TypeStatusTagsSchema>,
	isOwner?: boolean,
) => {
	const isLikeSpotInNewStatusTags = 'is_like_spot' in newStatusTags;

	if (isOwner && 'owner_status_tags' in spot) {
		const newSpotForOwner = {
			...spot,
			owner_status_tags: {
				...spot.owner_status_tags,
				...newStatusTags,
			},
		};

		if (isLikeSpotInNewStatusTags) {
			const newSpotLikeCounter = updateFollowCounter(
				spot.spot_like_counter,
				spot.owner_status_tags.is_like_spot,
			);

			return {
				...newSpotForOwner,
				spot_like_counter: newSpotLikeCounter,
			};
		}

		return newSpotForOwner;
	}

	if ('viewer_status_tags' in spot) {
		const newSpotForViewer = {
			...spot,
			viewer_status_tags: {
				...spot.viewer_status_tags,
				...newStatusTags,
			},
		};

		if ('spot_like_counter' in spot && isLikeSpotInNewStatusTags) {
			const newSpotLikeCounter = updateFollowCounter(
				spot.spot_like_counter,
				spot.viewer_status_tags.is_like_spot,
			);

			return {
				...newSpotForViewer,
				spot_like_counter: newSpotLikeCounter,
			};
		}

		return newSpotForViewer;
	}

	const newSpotForFeed = {
		...spot,
		...newStatusTags,
	};

	if (isLikeSpotInNewStatusTags) {
		const newSpotLikeCounter = updateFollowCounter(
			spot.spot_like_counter,
			spot.is_like_spot,
		);

		return {
			...newSpotForFeed,
			spot_like_counter: newSpotLikeCounter,
		};
	}

	return newSpotForFeed;
};

const updateArrayWithSpot = (
	array: TypeSpotForOptimisticUpdate[],
	spotId: number | string,
	newStatusTags: Partial<TypeStatusTagsSchema>,
	isOwner?: boolean,
	isCandidateSpot?: boolean,
) =>
	array.map((spot) => {
		if (isCandidateSpot) {
			const hasGooglePlaceLocationId =
				'google_place_location_id' in spot &&
				spot.google_place_location_id === spotId;

			if (hasGooglePlaceLocationId) {
				return updateStatusTagsForSpot(spot, newStatusTags, isOwner);
			}
		}

		const hasSpotId =
			('spot_id' in spot && spot.spot_id === spotId) ||
			('id' in spot && spot.id === spotId);

		if (hasSpotId) {
			return updateStatusTagsForSpot(spot, newStatusTags, isOwner);
		}

		return spot;
	});

const updateOptimisticWhenUpdateStatusTagsInSingleSpotCandidate = async ({
	currentQueryClient,
	newStatusTags,
	googlePlaceLocationId,
}: {
	currentQueryClient: QueryClient;
	googlePlaceLocationId?: string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
}) => {
	const queryKeys = ['singleSpotCandidate', googlePlaceLocationId];

	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: queryKeys,
		getUpdatedData: (oldData) => {
			const spotResponse = oldData as
				| TypeResponseDetailsSpotCandidate
				| TypeResponseSpotSingleResponseSchema;

			if (!spotResponse) return null;

			const spot = spotResponse?.spot;

			const newSpot = updateStatusTagsForSpot(spot, newStatusTags);

			return {
				...spotResponse,
				spot: newSpot,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInSingleSpot = async ({
	currentQueryClient,
	spotId,
	newStatusTags,
	isCandidateSpot,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	isCandidateSpot?: boolean;
}) => {
	const queryKeys = isCandidateSpot
		? ['singleSpotCandidate', spotId]
		: ['singleSpot', spotId];

	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: queryKeys,
		getUpdatedData: (oldData) => {
			const spotResponse = oldData as
				| TypeResponseDetailsSpotCandidate
				| TypeResponseSpotSingleResponseSchema;

			if (!spotResponse) return null;

			const spot = spotResponse?.spot;

			const newSpot = updateStatusTagsForSpot(spot, newStatusTags);

			return {
				...spotResponse,
				spot: newSpot,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInProfile = async ({
	currentQueryClient,
	userId,
	spotId,
	newStatusTags,
	isOwner,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	userId: number;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	isOwner?: boolean;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['allUserSpots', userId],
		getUpdatedData: (oldData) => {
			const spotsResponse = oldData as TypeResponseAllUserSpotSchemaResponse;
			const spotsUser = spotsResponse.spots_user;
			const spotsBeenTo = spotsUser.visited_spots;
			const spotsFavorite = spotsUser.liked_spots;

			const newSpotsBeenTo = updateArrayWithSpot(
				spotsBeenTo,
				spotId,
				newStatusTags,
				isOwner,
			);

			const newSpotsFavorite = updateArrayWithSpot(
				spotsFavorite,
				spotId,
				newStatusTags,
				isOwner,
			);

			return {
				...spotsResponse,
				spots_user: {
					...spotsUser,
					visited_spots: newSpotsBeenTo,
					liked_spots: newSpotsFavorite,
				},
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInSpotList = async ({
	currentQueryClient,
	spotListId,
	spotId,
	newStatusTags,
	isOwner,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	isOwner?: boolean;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotListSpots', spotListId],
		getUpdatedData: (oldData) => {
			const spotsResponse =
				oldData as InfiniteData<TypeResponseSpotsFromSpotList>;
			const newData = spotsResponse.pages.map((page) => {
				const newSpots = updateArrayWithSpot(
					page.spots,
					spotId,
					newStatusTags,
					isOwner,
				);
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

const updateOptimisticWhenUpdateStatusTagsInDiscovery = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	searchQuery?: string;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const discoverySpotListsResponse = old as TypeDiscoveryResponse;
			const discoveries = discoverySpotListsResponse.discoveries;

			const newSpotLists = updateArrayWithSpot(
				discoveries.popular_spots,
				spotId,
				newStatusTags,
			);
			return {
				...discoverySpotListsResponse,
				discoveries: {
					...discoveries,
					popular_spots: newSpotLists,
				},
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInViewMorePopularSpots = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	currentCity: string;
	searchQuery?: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMorePopularSpots', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const viewMorePopularSpotsResponse =
				old as InfiniteData<TypeResponseViewMorePopularSpotsFromDiscovery>;

			const newData = viewMorePopularSpotsResponse.pages.map((page) => {
				const popularSpots = page.popular_spots;
				const newPopularSpots = updateArrayWithSpot(
					popularSpots,
					spotId,
					newStatusTags,
				);

				return {
					...page,
					popular_spots: newPopularSpots,
				};
			});

			return {
				...viewMorePopularSpotsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInDiscoverMatchesSpots = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
	searchQuery,
	currentArea,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	currentCity: string;
	searchQuery?: string;
	currentArea: string | undefined;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotsDiscovery', searchQuery, currentCity, currentArea],
		getUpdatedData: (old) => {
			const spotsFromDiscoveryResponse = old as TypeDiscoverySpotsResponse;

			const newSpots = updateArrayWithSpot(
				spotsFromDiscoveryResponse.spots,
				spotId,
				newStatusTags,
			);

			return {
				...spotsFromDiscoveryResponse,
				spots: newSpots,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInAllDiscoverMatchesSpots = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
	searchQuery,
	currentArea,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	currentCity: string;
	searchQuery?: string;
	currentArea: string | undefined;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['allSpotsDiscovery', searchQuery, currentCity, currentArea],
		getUpdatedData: (old) => {
			const spotsFromDiscoveryResponse =
				old as InfiniteData<TypeDiscoverySpotsResponse>;

			const newData = spotsFromDiscoveryResponse.pages.map((page) => {
				const newSpots = updateArrayWithSpot(page.spots, spotId, newStatusTags);

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

const updateOptimisticWhenUpdateStatusTagsInSpotsNearby = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotsNearby', currentCity],
		getUpdatedData: (old) => {
			const spotsNearbyResponse = old as TypeResponseSpotsNearbyResponseSchema;

			const newSpots = updateArrayWithSpot(
				spotsNearbyResponse.spots,
				spotId,
				newStatusTags,
			);

			return {
				...spotsNearbyResponse,
				spots: newSpots,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInSearchSpotsAvailable = async ({
	spotListId,
	currentQueryClient,
	spotId,
	newStatusTags,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
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
				const newSpots = updateArrayWithSpot(page.spots, spotId, newStatusTags);

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

const updateOptimisticWhenUpdateStatusTagsInSearchSpotsCandidate = async ({
	currentCity,
	currentQueryClient,
	spotId,
	newStatusTags,
	searchQuery,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	currentCity: string;
	searchQuery?: string;
	spotListId: number;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotCandidates', searchQuery, currentCity, spotListId],
		getUpdatedData: (old) => {
			const spotsFromDiscoveryResponse =
				old as InfiniteData<TypeGetCandidateSpotsResponse>;

			const newData = spotsFromDiscoveryResponse.pages.map((page) => {
				const newSpots = updateArrayWithSpot(page.spots, spotId, newStatusTags);

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

const updateOptimisticWhenUpdateStatusTagsInFeed = async ({
	currentQueryClient,
	queryKey,
	userId,
	newStatusTags,
	spotId,
}: {
	currentQueryClient: QueryClient;
	queryKey: 'feed' | 'followingFeed';
	userId: number;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	spotId: number | string;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, userId],
		getUpdatedData: (old) => {
			const feedResponse = old as InfiniteData<any>;

			const newData = feedResponse.pages.map((page: any) => {
				const newSpots = page.events.map((spot: any) => {
					if (spot.id === spotId) {
						const isLikeSpotInNewStatusTags = 'is_like_spot' in newStatusTags;

						if (isLikeSpotInNewStatusTags) {
							const newSpotLikeCounter = updateFollowCounter(
								spot.spot_like_counter,
								spot.is_like_spot,
							);

							return {
								...spot,
								...newStatusTags,
								spot_like_counter: newSpotLikeCounter,
							};
						}

						return {
							...spot,
							...newStatusTags,
						};
					}

					return spot;
				});

				return {
					...page,
					events: newSpots,
				};
			});

			return {
				...feedResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenUpdateStatusTagsInViewMoreUserSpots = async ({
	categoryName,
	currentQueryClient,
	userId,
	newStatusTags,
	spotId,
	city,
	isOwner,
}: {
	currentQueryClient: QueryClient;
	userId: number;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	spotId: number | string;
	categoryName: string;
	city: string;
	isOwner?: boolean;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMoreUserSpots', userId, categoryName, city],
		getUpdatedData: (old) => {
			const spotsResponse =
				old as InfiniteData<TypeResponseViewMoreUserSpotsResponseSchema>;

			const newData = spotsResponse?.pages.map((page) => {
				const newSpots = updateArrayWithSpot(
					page.spots_user,
					spotId,
					newStatusTags,
					isOwner,
				);

				return {
					...page,
					spots_user: newSpots,
				};
			});

			return {
				...spotsResponse,
				pages: newData,
			};
		},
	});
};

// optimistic updates when update status tags
export const updateOptimisticWhenUpdateStatusTags = async ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	categoryName,
	currentCity,
	isCandidateSpot,
	searchQuery,
	spotListId,
	userId,
	newStatusTags,
	isOwner,
	googlePlaceLocationId,
	currentArea,
}: UseUpdateStatusTagsInSingleSpot & {
	currentQueryClient: QueryClient;
	spotId: number | string;
	newStatusTags: Partial<TypeStatusTagsSchema>;
	googlePlaceLocationId?: string;
}) => {
	if (
		queryMutateDestination === 'spot' ||
		queryMutateDestination === 'likesForSpot'
	) {
		await updateOptimisticWhenUpdateStatusTagsInSingleSpot({
			currentQueryClient,
			spotId,
			newStatusTags,
			isCandidateSpot,
		});
	}

	if (queryMutateDestination === 'spot' || googlePlaceLocationId) {
		await updateOptimisticWhenUpdateStatusTagsInSingleSpotCandidate({
			currentQueryClient,
			googlePlaceLocationId,
			newStatusTags,
		});
	}

	if (queryMutateDestination === 'user' && userId) {
		await updateOptimisticWhenUpdateStatusTagsInProfile({
			currentQueryClient,
			userId,
			spotId,
			newStatusTags,
			isOwner,
		});
	}

	if (queryMutateDestination === 'spotList' && spotListId) {
		await updateOptimisticWhenUpdateStatusTagsInSpotList({
			currentQueryClient,
			spotListId,
			spotId,
			newStatusTags,
			isOwner,
		});
	}

	if (queryMutateDestination === 'popularSpotDiscovery' && currentCity) {
		await updateOptimisticWhenUpdateStatusTagsInDiscovery({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'viewMorePopularSpots' && currentCity) {
		await updateOptimisticWhenUpdateStatusTagsInViewMorePopularSpots({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'spotDiscovery' && currentCity) {
		await updateOptimisticWhenUpdateStatusTagsInDiscoverMatchesSpots({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
			searchQuery,
			currentArea,
		});
	}

	if (queryMutateDestination === 'allSpotDiscovery' && currentCity) {
		await updateOptimisticWhenUpdateStatusTagsInAllDiscoverMatchesSpots({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
			searchQuery,
			currentArea,
		});
	}

	if (queryMutateDestination === 'spotsNearby' && currentCity) {
		await updateOptimisticWhenUpdateStatusTagsInSpotsNearby({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsAvailable' &&
		spotListId &&
		currentCity
	) {
		await updateOptimisticWhenUpdateStatusTagsInSearchSpotsAvailable({
			spotListId,
			currentQueryClient,
			spotId,
			newStatusTags,
			currentCity,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsCandidate' &&
		currentCity &&
		spotListId
	) {
		await updateOptimisticWhenUpdateStatusTagsInSearchSpotsCandidate({
			currentCity,
			currentQueryClient,
			spotId,
			newStatusTags,
			searchQuery,
			spotListId,
		});
	}

	if (
		(queryMutateDestination === 'feed' ||
			queryMutateDestination === 'followingFeed') &&
		userId
	) {
		await updateOptimisticWhenUpdateStatusTagsInFeed({
			currentQueryClient,
			queryKey: queryMutateDestination,
			userId,
			newStatusTags,
			spotId,
		});
	}

	if (
		queryMutateDestination === 'viewMoreUserSpots' &&
		userId &&
		categoryName &&
		currentCity
	) {
		await updateOptimisticWhenUpdateStatusTagsInViewMoreUserSpots({
			currentQueryClient,
			userId,
			newStatusTags,
			spotId,
			categoryName,
			city: currentCity,
			isOwner,
		});
	}
};

export const onErrorOptimisticWhenUpdateStatusTags = ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	categoryName,
	currentCity,
	isCandidateSpot,
	searchQuery,
	spotListId,
	userId,
	context,
	currentArea,
}: UseUpdateStatusTagsInSingleSpot & {
	currentQueryClient: QueryClient;
	context:
		| void
		| {
				previousData: unknown;
		  }
		| undefined;
}) => {
	if (
		queryMutateDestination === 'spot' ||
		queryMutateDestination === 'likesForSpot'
	) {
		if (isCandidateSpot) {
			currentQueryClient.setQueryData(
				['singleSpotCandidate', spotId],
				context?.previousData,
			);
		} else {
			currentQueryClient.setQueryData(
				['singleSpot', spotId],
				context?.previousData,
			);
		}
	}

	if (queryMutateDestination === 'user') {
		currentQueryClient.setQueryData(
			['allUserSpots', userId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spotList') {
		currentQueryClient.setQueryData(
			['spotListSpots', spotListId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'popularSpotDiscovery') {
		currentQueryClient.setQueryData(
			['postSearchDiscovery', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMorePopularSpots') {
		currentQueryClient.setQueryData(
			['viewMorePopularSpots', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spotDiscovery') {
		currentQueryClient.setQueryData(
			['spotsDiscovery', searchQuery, currentCity, currentArea],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spotsNearby') {
		currentQueryClient.setQueryData(
			['spotsNearby', currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'searchSpotsAvailable') {
		currentQueryClient.setQueryData(
			['allAvailableSpots', spotListId, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'searchSpotsCandidate') {
		currentQueryClient.setQueryData(
			['spotCandidates', searchQuery, currentCity, spotListId],
			context?.previousData,
		);
	}

	if (
		queryMutateDestination === 'feed' ||
		queryMutateDestination === 'followingFeed'
	) {
		currentQueryClient.setQueryData(
			[queryMutateDestination, userId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMoreUserSpots') {
		currentQueryClient.setQueryData(
			['viewMoreUserSpots', userId, categoryName],
			context?.previousData,
		);
	}
};
