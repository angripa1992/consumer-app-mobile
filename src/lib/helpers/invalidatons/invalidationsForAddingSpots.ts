import {
	LIMIT_SEARCH_SPOT_AVAILABLE,
	LIMIT_USER_LISTS,
} from '@/lib/utils/constants';
import { findItemIndex } from './invalidationHelpers';

import type { QueryClient } from '@tanstack/react-query';
import type { UsePostSpotToSpotList } from '@/lib/types/queries';
import type {
	TypeGetCandidateSpotsResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
} from '@/lib/types/spot';
import type { TypeResponseUserListsSchema } from '@/lib/types/spotList';

const invalidationsWhenAddSpotInSpotListInSearchSpotCandidates = async ({
	currentQueryClient,
	spotIdForInvalidation,
	currentCity,
	spotListIdForInvalidation,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	spotIdForInvalidation: number | string;
	currentCity: string;
	isCandidateSpot?: boolean;
	searchQuery?: string;
	spotListIdForInvalidation: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [
			'spotCandidates',
			searchQuery,
			currentCity,
			spotListIdForInvalidation,
		],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeGetCandidateSpotsResponse[];
			const spotsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.spots.map((spot) => ({ spot, pageIndex })),
			);

			const spotWithPageIndex = spotsWithPageIndex.find(
				({ spot }) =>
					spot.id === spotIdForInvalidation ||
					spot.google_place_location_id === spotIdForInvalidation,
			);

			if (!spotWithPageIndex) return false;

			const { pageIndex } = spotWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationsWhenAddSpotInSpotListInSearchSpotsAvailable = async ({
	currentQueryClient,
	spotIdForInvalidation,
	spotListIdForInvalidation,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	spotIdForInvalidation: number | string;
	spotListIdForInvalidation: number;
	currentCity: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['allAvailableSpots', spotListIdForInvalidation, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeResponseAllAvailableSpotsResponseSchema[];

			const spots = allPagesData.flatMap((page) => page.spots);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotIdForInvalidation as number,
				limit: LIMIT_SEARCH_SPOT_AVAILABLE,
			});
		},
	});
};

const invalidationsWhenAddSpotInSpotListInSingleSpot = async ({
	currentQueryClient,
	currentUserId,
	spotListIdForInvalidation,
}: {
	currentQueryClient: QueryClient;
	currentUserId: number;
	spotListIdForInvalidation: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['userLists', currentUserId, 'my_list'],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseUserListsSchema[];

			const spotsLists = allPagesData.flatMap((page) => page.spot_lists);

			return findItemIndex({
				items: spotsLists,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: spotListIdForInvalidation,
				limit: LIMIT_USER_LISTS,
			});
		},
	});
};

export const invalidationsWhenAddSpotInSpotList = async ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	isCandidateSpot,
	searchQuery,
	currentCity,
	userId,
	spotIdForInvalidation,
	spotListIdForInvalidation,
}: UsePostSpotToSpotList & {
	currentQueryClient: QueryClient;
	spotListIdForInvalidation: number;
	spotIdForInvalidation: number | string;
}) => {
	if (isCandidateSpot) {
		currentQueryClient.invalidateQueries({
			queryKey: ['singleSpotCandidate', spotId],
		});
	}

	if (queryMutateDestination === 'spot' && userId) {
		invalidationsWhenAddSpotInSpotListInSingleSpot({
			currentQueryClient,
			currentUserId: userId,
			spotListIdForInvalidation,
		});

		currentQueryClient.invalidateQueries({
			queryKey: ['featuredLists', spotIdForInvalidation],
		});
	}

	if (queryMutateDestination === 'searchSpotsAvailable' && currentCity) {
		invalidationsWhenAddSpotInSpotListInSearchSpotsAvailable({
			currentQueryClient,
			spotIdForInvalidation,
			spotListIdForInvalidation,
			currentCity,
		});
	}

	if (queryMutateDestination === 'searchSpotsCandidate' && currentCity) {
		invalidationsWhenAddSpotInSpotListInSearchSpotCandidates({
			currentQueryClient,
			spotIdForInvalidation,
			currentCity,
			spotListIdForInvalidation,
			searchQuery,
		});
	}
};
