import {
	updateFollowCounter,
	updateOptimisticInQueryData,
} from './optimisticHelpers';

import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type {
	TypeDiscoveryViewMoreCategoriesListsResponse,
	TypeDiscoveryResponse,
	TypeDiscoveryViewMorePopularListsResponse,
	TypeDiscoveryCategoriesResponseSchema,
	TypeDiscoveryListsResponseSchema,
} from '@/lib/types/discovery';
import type { PartialOptional } from '@/lib/types/partialOptional';
import type { UseUpdateFollowSpotListQuery } from '@/lib/types/queries';
import type {
	TypeResponseFollowingFeaturedLists,
	TypeResponseSpotListSinglePage,
	TypeResponseSpotListsHome,
	TypeResponseUserListsSchema,
	TypeResponseViewMoreHomeResponse,
	TypeSpotListForOptimisticUpdate,
} from '@/lib/types/spotList';
import type { TypeResponseFeaturedLists } from '@/lib/types/spotList';

const updateSpotListFollowers = (spotList: TypeSpotListForOptimisticUpdate) => {
	if ('is_following_spot_list' in spotList) {
		return {
			...spotList,
			is_following_spot_list: !spotList.is_following_spot_list,
			followers_counter: updateFollowCounter(
				spotList.followers_counter,
				spotList.is_following_spot_list,
			),
		};
	}

	if ('followers_spot_list_counter' in spotList) {
		return {
			...spotList,
			is_following: !spotList.is_following,
			followers_spot_list_counter: updateFollowCounter(
				spotList.followers_spot_list_counter,
				spotList.is_following,
			),
		};
	}

	return {
		...spotList,
		is_following: !spotList.is_following,
		followers_counter: updateFollowCounter(
			spotList.followers_counter,
			spotList.is_following,
		),
	};
};

const updateArrayWithSpotList = (
	array: TypeSpotListForOptimisticUpdate[],
	spotListId: number,
) =>
	array.map((spotList) =>
		spotList.id === spotListId ? updateSpotListFollowers(spotList) : spotList,
	);

const updateOptimisticWhenFollowListFromSinglePage = async ({
	currentQueryClient,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['spotList', spotListId],
		getUpdatedData: (old) => {
			const spotListResponse = old as TypeResponseSpotListSinglePage;
			const spotList = spotListResponse.spot_list;

			const updatedSpotList = updateSpotListFollowers(spotList);
			return {
				...spotListResponse,
				spot_list: updatedSpotList,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromHome = async ({
	currentQueryClient,
	spotListId,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['allSpotList', currentCity],
		getUpdatedData: (old) => {
			const spotListsResponse = old as TypeResponseSpotListsHome;
			const spotListsCategories = spotListsResponse.user_categories;
			const nearbySpotListCategory = spotListsCategories['nearby_spot_list'];
			const popularListCategory = spotListsCategories['popular_list'];
			const likedListCategory = spotListsCategories['liked_list'];

			return {
				...spotListsResponse,
				user_categories: {
					...spotListsCategories,
					nearby_spot_list: updateArrayWithSpotList(
						nearbySpotListCategory,
						spotListId,
					),
					popular_list: updateArrayWithSpotList(
						popularListCategory,
						spotListId,
					),
					liked_list: updateArrayWithSpotList(likedListCategory, spotListId),
				},
			};
		},
	});
};

const updateOptimisticWhenFollowListFromViewMoreHome = async ({
	currentQueryClient,
	categoryName,
	currentCity,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	categoryName: string;
	currentCity: string;
	spotListId: number;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMore', categoryName, currentCity],
		getUpdatedData: (old) => {
			const viewMoreResponse =
				old as InfiniteData<TypeResponseViewMoreHomeResponse>;
			const newData = viewMoreResponse.pages.map((page) => {
				const newSpotLists = updateArrayWithSpotList(
					page.spot_lists,
					spotListId,
				);
				return {
					...page,
					spot_lists: newSpotLists,
				};
			});

			return {
				...viewMoreResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromUser = async ({
	currentQueryClient,
	categoryName,
	currentUserId,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	categoryName: string;
	currentUserId: number;
	spotListId: number;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['userLists', currentUserId, categoryName],
		getUpdatedData: (old) => {
			const userSpotListsResponse =
				old as InfiniteData<TypeResponseUserListsSchema>;
			const newData = userSpotListsResponse?.pages.map((page) => {
				const newSpotLists = updateArrayWithSpotList(
					page.spot_lists,
					spotListId,
				);
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

const updateOptimisticWhenFollowListFromDiscovery = async ({
	searchQuery,
	currentCity,
	currentQueryClient,
	spotListId,
	categoryName,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	searchQuery?: string;
	currentCity: string;
	categoryName: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const discoverySpotListsResponse = old as TypeDiscoveryResponse;
			const discoveries = discoverySpotListsResponse.discoveries;

			if (categoryName === 'popularLists') {
				const newSpotLists = updateArrayWithSpotList(
					discoveries.popular_lists,
					spotListId,
				);
				return {
					...discoverySpotListsResponse,
					discoveries: {
						...discoveries,
						popular_lists: newSpotLists,
					},
				};
			}

			return discoverySpotListsResponse;
		},
	});
};

const updateOptimisticWhenFollowListFromDiscoveryCategories = async ({
	searchQuery,
	currentCity,
	currentQueryClient,
	spotListId,
	categoryName,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	searchQuery?: string;
	currentCity: string;
	categoryName: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['discoveryCategories', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const discoverySpotListsCategoriesResponse =
				old as TypeDiscoveryCategoriesResponseSchema;

			const newSpotLists = updateArrayWithSpotList(
				discoverySpotListsCategoriesResponse.categories[categoryName],
				spotListId,
			);

			return {
				...discoverySpotListsCategoriesResponse,
				categories: {
					...discoverySpotListsCategoriesResponse.categories,
					[categoryName]: newSpotLists,
				},
			};
		},
	});
};

const updateOptimisticWhenFollowListFromDiscoveryLists = async ({
	searchQuery,
	currentCity,
	currentQueryClient,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	searchQuery?: string;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['discoveryLists', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const spotListsCategoriesResponse =
				old as InfiniteData<TypeDiscoveryListsResponseSchema>;

			const newData = spotListsCategoriesResponse.pages.map((page) => {
				const newSpotLists = updateArrayWithSpotList(
					page.spot_lists,
					spotListId,
				);
				return {
					...page,
					spot_lists: newSpotLists,
				};
			});

			return {
				...spotListsCategoriesResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromViewMoreDiscoveryCategories = async ({
	searchQuery,
	currentCity,
	currentQueryClient,
	spotListId,
	categoryName,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	searchQuery?: string;
	currentCity: string;
	categoryName: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMoreCategories', searchQuery, currentCity, categoryName],
		getUpdatedData: (old) => {
			const viewMoreDiscoverySpotListsResponse =
				old as InfiniteData<TypeDiscoveryViewMoreCategoriesListsResponse>;

			const newData = viewMoreDiscoverySpotListsResponse.pages.map((page) => {
				const newSpotLists = updateArrayWithSpotList(
					page.spot_lists,
					spotListId,
				);
				return {
					...page,
					spot_lists: newSpotLists,
				};
			});

			return {
				...viewMoreDiscoverySpotListsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromViewMorePopularLists = async ({
	searchQuery,
	currentCity,
	currentQueryClient,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	searchQuery?: string;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMorePopularLists', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const viewMoreDiscoverySpotListsResponse =
				old as InfiniteData<TypeDiscoveryViewMorePopularListsResponse>;

			const newData = viewMoreDiscoverySpotListsResponse.pages.map((page) => {
				const newSpotLists = updateArrayWithSpotList(
					page.popular_lists,
					spotListId,
				);
				return {
					...page,
					popular_lists: newSpotLists,
				};
			});
			return {
				...viewMoreDiscoverySpotListsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromFeaturedLists = async ({
	queryKey,
	currentQueryClient,
	spotId,
	spotListId,
}: {
	queryKey: 'featuredLists' | 'followingFeaturedLists';
	currentQueryClient: QueryClient;
	spotListId: number;
	spotId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, spotId],
		getUpdatedData: (old) => {
			const featuredSpotListsResponse = old as InfiniteData<any>;

			const newData = featuredSpotListsResponse.pages.map((page) => {
				if (queryKey === 'featuredLists') {
					const newSpotLists = updateArrayWithSpotList(
						(page as TypeResponseFeaturedLists).featured_spot_list,
						spotListId,
					);
					return {
						...page,
						featured_spot_list: newSpotLists,
					};
				}

				const newSpotLists = updateArrayWithSpotList(
					(page as TypeResponseFollowingFeaturedLists).following_spot_list,
					spotListId,
				);

				return {
					...page,
					following_spot_list: newSpotLists,
				};
			});

			return {
				...featuredSpotListsResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowListFromFeed = async ({
	queryKey,
	currentQueryClient,
	spotListId,
	currentUserId,
}: {
	queryKey: 'feed' | 'followingFeed';
	currentQueryClient: QueryClient;
	currentUserId: number;
	spotListId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, currentUserId],
		getUpdatedData: (old) => {
			const feedResponse = old as InfiniteData<any>;

			const newData = feedResponse.pages.map((page: any) => {
				const newSpotLists = updateArrayWithSpotList(page.events, spotListId);

				return {
					...page,
					events: newSpotLists,
				};
			});

			return {
				...feedResponse,
				pages: newData,
			};
		},
	});
};

// optimistic updates when follow list
export const updateOptimisticWhenFollowList = async ({
	currentQueryClient,
	queryMutateDestination,
	spotListId,
	spotId,
	categoryName,
	searchQuery,
	currentCity,
	currentUserId,
}: PartialOptional<UseUpdateFollowSpotListQuery, 'dataListEvent'> & {
	currentQueryClient: QueryClient;
}) => {
	if (queryMutateDestination === 'spotList') {
		return await updateOptimisticWhenFollowListFromSinglePage({
			currentQueryClient,
			spotListId,
		});
	}

	if (queryMutateDestination === 'home' && currentCity) {
		return await updateOptimisticWhenFollowListFromHome({
			currentQueryClient,
			spotListId,
			currentCity,
		});
	}

	if (
		queryMutateDestination === 'viewMoreHome' &&
		categoryName &&
		currentCity
	) {
		return await updateOptimisticWhenFollowListFromViewMoreHome({
			currentQueryClient,
			categoryName,
			currentCity,
			spotListId,
		});
	}

	if (queryMutateDestination === 'user' && categoryName && currentUserId) {
		return await updateOptimisticWhenFollowListFromUser({
			currentQueryClient,
			categoryName: categoryName,
			currentUserId: currentUserId,
			spotListId,
		});
	}

	if (queryMutateDestination === 'spotListDiscovery' && currentCity) {
		return await updateOptimisticWhenFollowListFromDiscoveryLists({
			currentQueryClient,
			searchQuery,
			currentCity,
			spotListId,
		});
	}

	if (
		queryMutateDestination === 'popularSpotListDiscovery' &&
		currentCity &&
		categoryName
	) {
		return await updateOptimisticWhenFollowListFromDiscovery({
			currentQueryClient,
			searchQuery,
			currentCity,
			spotListId,
			categoryName,
		});
	}

	if (
		queryMutateDestination === 'categorySpotListDiscovery' &&
		currentCity &&
		categoryName
	) {
		return await updateOptimisticWhenFollowListFromDiscoveryCategories({
			currentQueryClient,
			searchQuery,
			currentCity,
			spotListId,
			categoryName,
		});
	}

	if (
		queryMutateDestination === 'viewMoreCategories' &&
		categoryName &&
		currentCity
	) {
		return await updateOptimisticWhenFollowListFromViewMoreDiscoveryCategories({
			currentQueryClient,
			categoryName,
			currentCity,
			spotListId,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'viewMorePopularLists' && currentCity) {
		return await updateOptimisticWhenFollowListFromViewMorePopularLists({
			currentQueryClient,
			currentCity,
			searchQuery,
			spotListId,
		});
	}

	if (
		(queryMutateDestination === 'featuredLists' ||
			queryMutateDestination === 'followingFeaturedLists') &&
		spotId
	) {
		return await updateOptimisticWhenFollowListFromFeaturedLists({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotId,
			spotListId,
		});
	}

	if (
		(queryMutateDestination === 'feed' ||
			queryMutateDestination === 'followingFeed') &&
		currentUserId
	) {
		return await updateOptimisticWhenFollowListFromFeed({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotListId,
			currentUserId,
		});
	}
};

// handle errors for optimistic updates when follow list

export const onErrorOptimisticWhenFollowList = ({
	currentQueryClient,
	queryMutateDestination,
	spotListId,
	spotId,
	categoryName,
	searchQuery,
	currentCity,
	currentUserId,
	context,
}: PartialOptional<UseUpdateFollowSpotListQuery, 'dataListEvent'> & {
	currentQueryClient: QueryClient;
	context:
	| void
	| {
		previousData: unknown;
	}
	| undefined;
}) => {
	if (queryMutateDestination === 'home') {
		currentQueryClient.setQueryData(
			['allSpotList', currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMoreHome') {
		currentQueryClient.setQueryData(
			['viewMore', categoryName, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spotList') {
		currentQueryClient.setQueryData(
			['spotList', spotListId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'user') {
		currentQueryClient.setQueryData(
			['userLists', currentUserId, categoryName],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'spotListDiscovery') {
		currentQueryClient.setQueryData(
			['discoveryLists', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'popularSpotListDiscovery') {
		currentQueryClient.setQueryData(
			['postSearchDiscovery', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'categorySpotListDiscovery') {
		currentQueryClient.setQueryData(
			['discoveryCategories', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (
		queryMutateDestination === 'featuredLists' ||
		queryMutateDestination === 'followingFeaturedLists'
	) {
		currentQueryClient.setQueryData(
			[queryMutateDestination, spotId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMorePopularLists') {
		currentQueryClient.setQueryData(
			['viewMorePopularLists', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMoreCategories') {
		currentQueryClient.setQueryData(
			['viewMoreCategories', searchQuery, currentCity, categoryName],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'feed') {
		currentQueryClient.setQueryData(
			['feed', currentUserId],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'followingFeed') {
		currentQueryClient.setQueryData(
			['followingFeed', currentUserId],
			context?.previousData,
		);
	}
};
