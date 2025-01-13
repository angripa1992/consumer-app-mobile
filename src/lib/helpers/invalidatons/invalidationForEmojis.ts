import type { QueryClient } from '@tanstack/react-query';

import { findItemIndex } from './invalidationHelpers';
import { LIMIT_SCRIBBLES } from '@/lib/utils/constants';

import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type { TypeResponseFeed } from '@/lib/types/feed';
import type {
	TypeGetFollowingScribblesForSpotResponse,
	TypeGetScribblesForSpotResponse,
} from '@/lib/types/scribbles';
import type {
	TypeGetFollowingLikesForSpotResponse,
	TypeGetLikesForSpotResponse,
} from '@/lib/types/spot';

const invalidationWhenAddOrRemoveEmojisInFeed = async ({
	queryKey,
	currentQueryClient,
	currentUserId,
	eventId,
}: {
	queryKey: 'feed' | 'followingFeed';
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, currentUserId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages as TypeResponseFeed[];
			const eventsWithPageIndex = allPagesData.flatMap((page, pageIndex) =>
				page.events.map((event) => ({ event, pageIndex })),
			);

			const eventWithPageIndex = eventsWithPageIndex.find(
				({ event }) => event.event_id === eventId,
			);

			if (!eventWithPageIndex) return false;

			const { pageIndex } = eventWithPageIndex;

			return index === pageIndex;
		},
	});
};

const invalidationWhenAddOrRemoveEmojisInScribblesForSpot = async ({
	queryKey,
	currentQueryClient,
	spotId,
	eventId,
}: {
	queryKey: 'scribbles' | 'followingScribbles';
	currentQueryClient: QueryClient;
	spotId: number | string;
	eventId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, spotId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages;

			const scribbles = allPagesData.flatMap((page) => {
				if (queryKey === 'scribbles') {
					return (page as TypeGetScribblesForSpotResponse).data_community_spot;
				}
				return (page as TypeGetFollowingScribblesForSpotResponse)
					.data_following_spot;
			});

			return findItemIndex({
				items: scribbles,
				itemKeyToFind: 'event_id',
				currentIndex: index,
				id: eventId,
				limit: LIMIT_SCRIBBLES,
			});
		},
	});
};

const invalidationWhenAddOrRemoveEmojisInLikesForSpot = async ({
	queryKey,
	currentQueryClient,
	spotId,
	eventId,
}: {
	queryKey: 'likesForSpot' | 'followingLikesForSpot';
	currentQueryClient: QueryClient;
	spotId: number | string;
	eventId: number;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: [queryKey, spotId],
		refetchPage(_, index, allPages) {
			const allPagesData = allPages;

			const scribbles = allPagesData.flatMap((page) => {
				if (queryKey === 'likesForSpot') {
					return (page as TypeGetLikesForSpotResponse).data_community_spot;
				}
				return (page as TypeGetFollowingLikesForSpotResponse)
					.data_following_spot;
			});

			return findItemIndex({
				items: scribbles,
				itemKeyToFind: 'event_id',
				currentIndex: index,
				id: eventId,
				limit: LIMIT_SCRIBBLES,
			});
		},
	});
};

export const invalidationWhenAddOrRemoveEmojis = async ({
	queryMutateDestination,
	currentQueryClient,
	currentUserId,
	eventId,
	spotId,
}: {
	queryMutateDestination: TypeQueriesMutateDestination;
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
	spotId?: number | string;
}) => {
	if (
		queryMutateDestination === 'feed' ||
		queryMutateDestination === 'followingFeed'
	) {
		invalidationWhenAddOrRemoveEmojisInFeed({
			queryKey: queryMutateDestination,
			currentQueryClient,
			currentUserId,
			eventId,
		});
	}

	if (
		(queryMutateDestination === 'scribbles' ||
			queryMutateDestination === 'followingScribbles') &&
		spotId
	) {
		invalidationWhenAddOrRemoveEmojisInScribblesForSpot({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotId,
			eventId,
		});
	}

	if (
		(queryMutateDestination === 'likesForSpot' ||
			queryMutateDestination === 'followingLikesForSpot') &&
		spotId
	) {
		invalidationWhenAddOrRemoveEmojisInLikesForSpot({
			queryKey: queryMutateDestination,
			currentQueryClient,
			spotId,
			eventId,
		});
	}

	if (queryMutateDestination === 'userScribbles') {
		currentQueryClient.invalidateQueries(['userScribbles'])
	}
};
