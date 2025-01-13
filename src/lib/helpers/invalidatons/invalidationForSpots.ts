import { findItemIndex } from './invalidationHelpers';
import {
	LIMIT_DISCOVERY,
	LIMIT_LIKES_FOR_SPOT,
	LIMIT_SEARCH_SPOT_AVAILABLE,
	LIMIT_SPOT_LIST_SPOTS,
	LIMIT_VIEW_MORE,
} from '@/lib/utils/constants';

import type { QueryClient } from '@tanstack/react-query';
import type { TypeResponseFeed } from '@/lib/types/feed';
import type {
	TypeResponseViewMorePopularSpotsFromDiscovery,
	TypeResponseViewMoreUserSpotsResponseSchema,
} from '@/lib/types/viewMore';
import type { TypeDiscoverySpotsResponse } from '@/lib/types/discovery';
import type {
	TypeGetCandidateSpotsResponse,
	TypeGetLikesForSpotResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
	TypeResponseSpotsFromSpotList,
} from '@/lib/types/spot';
import type { UseUpdateStatusTagsInSingleSpot } from '@/lib/types/queries';

const invalidationsWhenUpdateStatusTagsInSpotList = async ({
	currentQueryClient,
	spotListId,
	spotId,
}: {
	currentQueryClient: QueryClient;
	spotListId: number;
	spotId: number | string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['spotListSpots', spotListId],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseSpotsFromSpotList[];

			const spots = allPagesData.flatMap((page) => page.spots);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'spot_id',
				currentIndex: index,
				id: spotId as number,
				limit: LIMIT_SPOT_LIST_SPOTS,
			});
		},
	});
};

const invalidationsWhenUpdateStatusTagsInDiscovery = async ({
	currentQueryClient,
	searchQuery,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	searchQuery?: string;
	currentCity: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
	});
};

const invalidationsWhenUpdateStatusTagsInViewMorePopularSpots = async ({
	currentCity,
	currentQueryClient,
	spotId,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	currentCity: string;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMorePopularSpots', searchQuery, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeResponseViewMorePopularSpotsFromDiscovery[];

			const spots = allPagesData.flatMap((page) => page.popular_spots);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotId as number,
				limit: LIMIT_DISCOVERY,
			});
		},
	});
};

const invalidationsWhenUpdateStatusTagsInSearchSpotsAvailable = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['allAvailableSpots', spotListId, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeResponseAllAvailableSpotsResponseSchema[];

			const spots = allPagesData.flatMap((page) => page.spots);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotId as number,
				limit: LIMIT_SEARCH_SPOT_AVAILABLE,
			});
		},
	});
};

const invalidationsWhenUpdateStatusTagsInSearchSpotsCandidate = async ({
	currentCity,
	currentQueryClient,
	spotId,
	searchQuery,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	currentCity: string;
	searchQuery?: string;
	spotListId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['spotCandidates', searchQuery, currentCity, spotListId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeGetCandidateSpotsResponse[];
			const spotsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.spots.map((spot) => ({ spot, pageIndex })),
			);

			const spotWithPageIndex = spotsWithPageIndex.find(
				({ spot }) =>
					spot.id === spotId || spot.google_place_location_id === spotId,
			);

			if (!spotWithPageIndex) return false;

			const { pageIndex } = spotWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationsWhenUpdateStatusTagsInFeed = async ({
	currentQueryClient,
	userId,
	queryKey,
	spotId,
}: {
	currentQueryClient: QueryClient;
	queryKey: 'feed' | 'followingFeed';
	userId: number;
	spotId: number | string;
}) => {
	currentQueryClient.invalidateQueries(['singleSpot', spotId]);
	currentQueryClient.invalidateQueries(['singleSpotCandidate', spotId]);
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, userId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeResponseFeed[];
			const eventsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.events.map((event) => ({ event, pageIndex })),
			);

			const eventWithPageIndex = eventsWithPageIndex.find(
				({ event }) => event.event_type === 'spot' && event.id === spotId,
			);

			if (!eventWithPageIndex) return false;

			const { pageIndex } = eventWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationsWhenUpdateStatusTagsInViewMoreUserSpots = async ({
	categoryName,
	currentQueryClient,
	userId,
	spotId,
	city,
}: {
	currentQueryClient: QueryClient;
	userId: number;
	spotId: number | string;
	categoryName: string;
	city: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMoreUserSpots', userId, categoryName, city],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeResponseViewMoreUserSpotsResponseSchema[];

			const spots = allPagesData.flatMap((page) => page.spots_user);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotId as number,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

const invalidationsWhenUpdateStatusTagsInAllDiscoveryMatches = async ({
	currentQueryClient,
	spotId,
	searchQuery,
	currentCity,
	currentArea,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	searchQuery?: string;
	currentCity: string;
	currentArea: string | undefined;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['allSpotsDiscovery', searchQuery, currentCity, currentArea],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeDiscoverySpotsResponse[];
			const spotsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.spots.map((spot) => ({ spot, pageIndex })),
			);

			const spotWithPageIndex = spotsWithPageIndex.find(
				({ spot }) =>
					spot.id === spotId || spot.google_place_location_id === spotId,
			);

			if (!spotWithPageIndex) return false;

			const { pageIndex } = spotWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationsWhenUpdateStatusTagsInLikesForSpot = async ({
	currentQueryClient,
	spotId,
	userId,
}: {
	currentQueryClient: QueryClient;
	spotId: number | string;
	userId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['likesForSpot', spotId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeGetLikesForSpotResponse[];

			const events = allPagesData.flatMap((page) => page.data_community_spot);

			return findItemIndex({
				items: events,
				itemKeyToFind: 'creator_user_id',
				currentIndex: index,
				id: userId,
				limit: LIMIT_LIKES_FOR_SPOT,
			});
		},
	});
};

export const invalidationsWhenUpdateStatusTags = async ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	categoryName,
	currentCity,
	isCandidateSpot,
	searchQuery,
	spotListId,
	userId,
	currentArea,
}: UseUpdateStatusTagsInSingleSpot & {
	currentQueryClient: QueryClient;
}) => {
	if (queryMutateDestination === 'spot' && spotId) {
		currentQueryClient.invalidateQueries({
			queryKey: ['singleSpotCandidate', spotId],
		});
		currentQueryClient.invalidateQueries({
			queryKey: ['spotInteractions', spotId],
		});
		currentQueryClient.invalidateQueries({
			queryKey: ['singleSpot', spotId],
		});
		currentQueryClient.invalidateQueries({
			queryKey: ['feed'],
		});
		currentQueryClient.invalidateQueries({
			queryKey: ['followingFeed'],
		});
	}

	if (queryMutateDestination === 'user' && userId) {
		currentQueryClient.invalidateQueries({
			queryKey: ['allUserSpots', userId],
		});
	}

	if (queryMutateDestination === 'spotList' && spotListId) {
		invalidationsWhenUpdateStatusTagsInSpotList({
			currentQueryClient,
			spotListId,
			spotId,
		});
	}

	if (queryMutateDestination === 'popularSpotDiscovery' && currentCity) {
		invalidationsWhenUpdateStatusTagsInDiscovery({
			currentQueryClient,
			searchQuery,
			currentCity,
		});
	}

	if (queryMutateDestination === 'viewMorePopularSpots' && currentCity) {
		invalidationsWhenUpdateStatusTagsInViewMorePopularSpots({
			currentCity,
			currentQueryClient,
			spotId,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'spotDiscovery' && currentCity) {
		currentQueryClient.invalidateQueries({
			queryKey: ['spotsDiscovery', searchQuery, currentCity, currentArea],
		});
	}

	if (queryMutateDestination === 'allSpotDiscovery' && currentCity) {
		invalidationsWhenUpdateStatusTagsInAllDiscoveryMatches({
			currentCity,
			currentQueryClient,
			spotId,
			searchQuery,
			currentArea,
		});
	}

	if (queryMutateDestination === 'spotsNearby' && currentCity) {
		currentQueryClient.invalidateQueries({
			queryKey: ['spotsNearby', currentCity],
		});
	}

	if (
		queryMutateDestination === 'searchSpotsAvailable' &&
		spotListId &&
		currentCity
	) {
		invalidationsWhenUpdateStatusTagsInSearchSpotsAvailable({
			currentQueryClient,
			spotId,
			spotListId,
			currentCity,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsCandidate' &&
		currentCity &&
		spotListId
	) {
		invalidationsWhenUpdateStatusTagsInSearchSpotsCandidate({
			currentCity,
			currentQueryClient,
			spotId,
			searchQuery,
			spotListId,
		});
	}

	if (
		(queryMutateDestination === 'feed' ||
			queryMutateDestination === 'followingFeed') &&
		userId
	) {
		invalidationsWhenUpdateStatusTagsInFeed({
			currentQueryClient,
			userId,
			queryKey: queryMutateDestination,
			spotId,
		});
	}

	if (
		queryMutateDestination === 'viewMoreUserSpots' &&
		userId &&
		categoryName &&
		currentCity
	) {
		invalidationsWhenUpdateStatusTagsInViewMoreUserSpots({
			categoryName,
			currentQueryClient,
			userId,
			spotId,
			city: currentCity,
		});
	}

	if (queryMutateDestination === 'likesForSpot' && userId) {
		invalidationsWhenUpdateStatusTagsInLikesForSpot({
			currentQueryClient,
			spotId,
			userId,
		});

		currentQueryClient.invalidateQueries({
			queryKey: ['likesForSpot', spotId],
		});
	}
};
