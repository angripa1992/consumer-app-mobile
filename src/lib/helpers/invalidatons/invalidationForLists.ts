import type { QueryClient } from '@tanstack/react-query';
import {
	LIMIT_DISCOVERY,
	LIMIT_FEATURED_LISTS,
	LIMIT_VIEW_MORE,
} from '@/lib/utils/constants';
import { findItemIndex } from './invalidationHelpers';

import type {
	TypeDiscoveryViewMoreCategoriesListsResponse,
	TypeDiscoveryViewMorePopularListsResponse,
	TypeDiscoveryListsResponseSchema,
} from '@/lib/types/discovery';
import type { PartialOptional } from '@/lib/types/partialOptional';
import type { UseUpdateFollowSpotListQuery } from '@/lib/types/queries';
import type {
	TypeResponseUserListsSchema,
	TypeResponseViewMoreHomeResponse,
	TypeResponseFeaturedLists,
	TypeResponseFollowingFeaturedLists,
} from '@/lib/types/spotList';
import type { TypeResponseFeed } from '@/lib/types/feed';

const invalidationWhenFollowListFromViewMoreHome = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMore', categoryName, currentCity],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseViewMoreHomeResponse[];

			const spotsLists = allPagesData.flatMap((page) => page.spot_lists);

			return findItemIndex({
				items: spotsLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

const invalidationWhenFollowListFromUser = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['userLists', currentUserId, categoryName],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseUserListsSchema[];

			const spotsLists = allPagesData.flatMap((page) => page.spot_lists);

			return findItemIndex({
				items: spotsLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

const invalidationWhenFollowListFromDiscovery = async ({
	currentQueryClient,
	currentCity,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	currentCity: string;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
	});
};

const invalidationWhenFollowListFromDiscoveryCategories = async ({
	currentQueryClient,
	currentCity,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	currentCity: string;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['discoveryCategories', searchQuery, currentCity],
	});
};

const invalidationWhenFollowListFromDiscoveryLists = async ({
	currentQueryClient,
	currentCity,
	searchQuery,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	currentCity: string;
	spotListId: number;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['discoveryLists', searchQuery, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeDiscoveryListsResponseSchema[];

			const spotLists = allPagesData.flatMap((page) => page.spot_lists);

			return findItemIndex({
				items: spotLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_DISCOVERY,
			});
		},
	});
};

const invalidationWhenFollowListFromViewMoreDiscoveryCategories = async ({
	currentQueryClient,
	categoryName,
	spotListId,
	currentCity,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	categoryName: string;
	spotListId: number;
	currentCity: string;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMoreCategories', searchQuery, currentCity, categoryName],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeDiscoveryViewMoreCategoriesListsResponse[];

			const spotLists = allPagesData.flatMap((page) => page.spot_lists);

			return findItemIndex({
				items: spotLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

const invalidationWhenFollowListFromViewMorePopularLists = async ({
	currentQueryClient,
	spotListId,
	currentCity,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	currentCity: string;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMorePopularLists', searchQuery, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeDiscoveryViewMorePopularListsResponse[];

			const spotLists = allPagesData.flatMap((page) => page.popular_lists);

			return findItemIndex({
				items: spotLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

const invalidationWhenFollowListFromFeaturedLists = async ({
	queryKey,
	currentQueryClient,
	spotListId,
	spotId,
}: {
	queryKey: 'featuredLists' | 'followingFeaturedLists';
	currentQueryClient: QueryClient;
	spotListId: number;
	spotId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, spotId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages;

			const spotLists = allPagesData.flatMap((page) => {
				if (queryKey === 'featuredLists') {
					return (page as TypeResponseFeaturedLists).featured_spot_list;
				}

				return (page as TypeResponseFollowingFeaturedLists).following_spot_list;
			});

			return findItemIndex({
				items: spotLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListId,
				limit: LIMIT_FEATURED_LISTS,
			});
		},
	});
};

const invalidationWhenFollowListFromFeed = async ({
	currentQueryClient,
	queryMutateDestination,
	spotListId,
	currentUserId,
}: {
	currentQueryClient: QueryClient;
	queryMutateDestination: 'feed' | 'followingFeed';
	spotListId: number;
	currentUserId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryMutateDestination, currentUserId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeResponseFeed[];
			const eventsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.events.map((event) => ({ event, pageIndex })),
			);

			const eventWithPageIndex = eventsWithPageIndex.find(
				({ event }) =>
					(event.event_type === 'following_spotList' ||
						event.event_type === 'spotList') &&
					event.id === spotListId,
			);

			if (!eventWithPageIndex) return false;

			const { pageIndex } = eventWithPageIndex;

			return index === pageIndex;
		},
	});
};

export const invalidationWhenFollowList = async ({
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
		currentQueryClient.invalidateQueries({
			queryKey: ['spotList', spotListId],
		});
	}

	if (queryMutateDestination === 'home' && currentCity) {
		currentQueryClient.invalidateQueries({
			queryKey: ['allSpotList', currentCity],
		});
	}

	if (
		queryMutateDestination === 'viewMoreHome' &&
		categoryName &&
		currentCity
	) {
		invalidationWhenFollowListFromViewMoreHome({
			currentQueryClient,
			categoryName,
			currentCity,
			spotListId,
		});
	}

	if (queryMutateDestination === 'user' && categoryName && currentUserId) {
		invalidationWhenFollowListFromUser({
			currentQueryClient,
			categoryName,
			currentUserId,
			spotListId,
		});
	}

	if (queryMutateDestination === 'spotListDiscovery' && currentCity) {
		invalidationWhenFollowListFromDiscoveryLists({
			currentQueryClient,
			currentCity,
			searchQuery,
			spotListId,
		});
	}

	if (queryMutateDestination === 'categorySpotListDiscovery' && currentCity) {
		invalidationWhenFollowListFromDiscoveryCategories({
			currentQueryClient,
			currentCity,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'popularSpotListDiscovery' && currentCity) {
		invalidationWhenFollowListFromDiscovery({
			currentQueryClient,
			currentCity,
			searchQuery,
		});
	}

	if (
		queryMutateDestination === 'viewMoreCategories' &&
		categoryName &&
		currentCity
	) {
		invalidationWhenFollowListFromViewMoreDiscoveryCategories({
			currentQueryClient,
			categoryName,
			spotListId,
			currentCity,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'viewMorePopularLists' && currentCity) {
		invalidationWhenFollowListFromViewMorePopularLists({
			currentQueryClient,
			spotListId,
			currentCity,
			searchQuery,
		});
	}

	if (
		(queryMutateDestination === 'featuredLists' ||
			queryMutateDestination === 'followingFeaturedLists') &&
		spotId
	) {
		invalidationWhenFollowListFromFeaturedLists({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotListId,
			spotId,
		});
	}

	if (
		(queryMutateDestination === 'feed' ||
			queryMutateDestination === 'followingFeed') &&
		currentUserId
	) {
		invalidationWhenFollowListFromFeed({
			currentQueryClient,
			queryMutateDestination,
			spotListId,
			currentUserId,
		});
	}
};
