import { findItemIndex } from './invalidationHelpers';
import { LIMIT_SEARCH_SPOT_AVAILABLE } from '@/lib/utils/constants';

import type { QueryClient } from '@tanstack/react-query';
import type { UseDeleteSpotFromList } from '@/lib/types/queries';
import type {
	TypeGetCandidateSpotsResponse,
	TypeResponseAllAvailableSpotsResponseSchema,
} from '@/lib/types/spot';
import type { TypeResponseUserListsSchema } from '@/lib/types/spotList';

const invalidationWhenRemoveSpotInSpotListInSearchSpotCandidates = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['spotCandidates', searchQuery, currentCity, spotListId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeGetCandidateSpotsResponse[];
			const spotsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.spots.map((spot) => ({ spot, pageIndex })),
			);

			const spotWithPageIndex = spotsWithPageIndex.find(
				({ spot }) => spot.spot_spot_list_id === spotSpotListId,
			);

			if (!spotWithPageIndex) return false;

			const { pageIndex } = spotWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationWhenRemoveSpotInSpotListInSearchSpotsAvailable = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['allAvailableSpots', spotListId, currentCity],
		refetchPage(_, index, allPages) {
			const allPagesData =
				allPages as TypeResponseAllAvailableSpotsResponseSchema[];

			const spots = allPagesData.flatMap((page) => page.spots);

			return findItemIndex({
				items: spots,
				itemKeyToFind: 'spot_spot_list_id',
				currentIndex: index,
				id: spotSpotListId,
				limit: LIMIT_SEARCH_SPOT_AVAILABLE,
			});
		},
	});
};

const invalidationWhenRemoveSpotInSpotListInSingleSpot = async ({
	currentQueryClient,
	currentUserId,
	spotListId,
}: {
	currentQueryClient: QueryClient;
	currentUserId: number;
	spotListId: number;
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
				id: spotListId,
				limit: LIMIT_SEARCH_SPOT_AVAILABLE,
			});
		},
	});
};

export const invalidationWhenRemoveSpotInSpotList = async ({
	currentQueryClient,
	queryMutateDestination,
	spotSpotListId,
	spotListId,
	searchQuery,
	currentCity,
	userId,
}: UseDeleteSpotFromList & {
	currentQueryClient: QueryClient;
}) => {
	if (queryMutateDestination === 'spotList') {
		currentQueryClient.invalidateQueries({
			queryKey: ['spotListSpots', spotListId],
			refetchType: 'active',
		});
	}

	if (queryMutateDestination === 'spot' && userId && spotListId) {
		invalidationWhenRemoveSpotInSpotListInSingleSpot({
			currentQueryClient,
			currentUserId: userId,
			spotListId,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsAvailable' &&
		spotListId &&
		spotSpotListId &&
		currentCity
	) {
		invalidationWhenRemoveSpotInSpotListInSearchSpotsAvailable({
			currentQueryClient,
			spotSpotListId,
			spotListId,
			currentCity,
		});
	}

	if (
		queryMutateDestination === 'searchSpotsCandidate' &&
		spotListId &&
		currentCity &&
		spotSpotListId
	) {
		invalidationWhenRemoveSpotInSpotListInSearchSpotCandidates({
			currentQueryClient,
			spotSpotListId,
			spotListId,
			currentCity,
			searchQuery,
		});
	}
};
