import type { QueryClient } from '@tanstack/react-query';

import { findItemIndex } from './invalidationHelpers';
import { LIMIT_SCRIBBLES } from '@/lib/utils/constants';

import type { TypeGetScribblesForSpotResponse } from '@/lib/types/scribbles';
import type { TypeQueriesMutateDestination } from '@/lib/types/queries';

export const invalidationsWhenUpdateOrRemoveScribbleInScribbleForSpot = async ({
	queryKey,
	currentQueryClient,
	spotId,
	scribbleId,
}: {
	currentQueryClient: QueryClient;
	spotId?: number;
	scribbleId: number;
	queryKey: 'scribbles' | 'followingScribbles';
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, spotId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeGetScribblesForSpotResponse[];

			const scribbles = allPagesData.flatMap(
				(page) => page.data_community_spot,
			);

			return findItemIndex({
				items: scribbles,
				itemKeyToFind: 'scribble_id',
				currentIndex: index,
				id: scribbleId,
				limit: LIMIT_SCRIBBLES,
			});
		},
	});
};

export const invalidationsWhenUpdateOrRemoveScribble = async ({
	currentQueryClient,
	queryMutateDestination,
	spotId,
	scribbleId,
}: {
	currentQueryClient: QueryClient;
	queryMutateDestination: TypeQueriesMutateDestination;
	spotId?: number;
	scribbleId: number;
}) => {
	if (
		queryMutateDestination === 'scribbles' ||
		queryMutateDestination === 'followingScribbles'
	) {
		invalidationsWhenUpdateOrRemoveScribbleInScribbleForSpot({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotId,
			scribbleId,
		});
	}
};
