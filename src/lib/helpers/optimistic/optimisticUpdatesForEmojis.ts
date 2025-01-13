import { updateOptimisticInQueryData } from './optimisticHelpers';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { TypeFeedEvent, TypeResponseFeed } from '@/lib/types/feed';
import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type {
	TypeGetFollowingScribblesForSpotResponse,
	TypeGetScribblesForSpotResponse,
	TypeScribble,
} from '@/lib/types/scribbles';
import type {
	TypeGetFollowingLikesForSpotResponse,
	TypeGetLikesForSpotResponse,
	TypeLikeForSpotSchema,
} from '@/lib/types/spot';

const addEmojiToEvent = (
	event: TypeFeedEvent | TypeScribble | TypeLikeForSpotSchema,
	eventId: number,
	emojiCode: string,
	slug: string,
) => {
	if (event.event_id === eventId) {
		const emojis = event.emojis;

		if (emojis.some((emoji) => emoji.code === emojiCode)) {
			const newEmojis = emojis.map((emoji) => {
				if (emoji.code === emojiCode) {
					return {
						...emoji,
						emoji_counter: emoji.emoji_counter + 1,
					};
				}

				return emoji;
			});

			return {
				...event,
				emojis: newEmojis,
			};
		}

		const newEmojis = [
			{
				code: emojiCode,
				emoji_counter: 1,
				event_emoji_id: null,
				variations_code_id: null,
				code_variations: [],
				slug,
			},
			...emojis,
		];

		return {
			...event,
			emojis: newEmojis,
		};
	}

	return event;
};

const removeEmojiToEvent = (
	event: TypeFeedEvent | TypeScribble | TypeLikeForSpotSchema,
	eventId: number,
	eventEmojiId: number,
) => {
	if (event.event_id === eventId) {
		const emojis = event.emojis;

		const newEmojis = emojis.map((emoji) => {
			if (emoji.event_emoji_id === eventEmojiId) {
				return {
					...emoji,
					emoji_counter: emoji.emoji_counter - 1,
					event_emoji_id: null,
				};
			}

			return emoji;
		});

		return {
			...event,
			emojis: newEmojis,
		};
	}

	return event;
};

const updateOptimisticWhenAddEmojisInFeed = async ({
	queryKey,
	currentQueryClient,
	currentUserId,
	eventId,
	emojiCode,
	slug,
}: {
	queryKey: 'feed' | 'followingFeed';
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
	emojiCode: string;
	slug: string;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, currentUserId],
		getUpdatedData: (old) => {
			const feedResponse = old as InfiniteData<TypeResponseFeed>;

			const newData = feedResponse.pages.map((page) => {
				const newEvents = page.events.map((event) => {
					return addEmojiToEvent(event, eventId, emojiCode, slug);
				});

				return {
					...page,
					events: newEvents,
				};
			});

			return {
				...feedResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenRemoveEmojisInFeed = async ({
	queryKey,
	currentQueryClient,
	currentUserId,
	eventId,
	eventEmojiId,
}: {
	queryKey: 'feed' | 'followingFeed';
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
	eventEmojiId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, currentUserId],
		getUpdatedData: (old) => {
			const feedResponse = old as InfiniteData<TypeResponseFeed>;

			const newData = feedResponse.pages.map((page) => {
				const newEvents = page.events.map((event) => {
					return removeEmojiToEvent(event, eventId, eventEmojiId);
				});

				return {
					...page,
					events: newEvents,
				};
			});

			return {
				...feedResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenAddEmojisInScribbleForSpot = async ({
	queryKey,
	currentQueryClient,
	eventId,
	emojiCode,
	slug,
	spotId,
}: {
	queryKey: 'scribbles' | 'followingScribbles';
	currentQueryClient: QueryClient;
	eventId: number;
	emojiCode: string;
	slug: string;
	spotId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, spotId],
		getUpdatedData: (old) => {
			const scribblesResponse = old as InfiniteData<any>;

			const newData = scribblesResponse.pages.map((page) => {
				if (queryKey === 'scribbles') {
					const newScribbles = (
						page as TypeGetScribblesForSpotResponse
					).data_community_spot.map((event) => {
						return addEmojiToEvent(event, eventId, emojiCode, slug);
					});

					return {
						...page,
						data_community_spot: newScribbles,
					};
				}

				const newScribbles = (
					page as TypeGetFollowingScribblesForSpotResponse
				).data_following_spot.map((event) => {
					return addEmojiToEvent(event, eventId, emojiCode, slug);
				});

				return {
					...page,
					data_following_spot: newScribbles,
				};
			});

			return {
				...scribblesResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenRemoveEmojisInScribbleForSpot = async ({
	queryKey,
	currentQueryClient,
	eventId,
	eventEmojiId,
	spotId,
}: {
	queryKey: 'scribbles' | 'followingScribbles';
	currentQueryClient: QueryClient;
	eventId: number;
	eventEmojiId: number;
	spotId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, spotId],
		getUpdatedData: (old) => {
			const scribblesResponse = old as InfiniteData<any>;

			const newData = scribblesResponse.pages.map((page) => {
				if (queryKey === 'scribbles') {
					const newScribbles = (
						page as TypeGetScribblesForSpotResponse
					).data_community_spot.map((event) => {
						return removeEmojiToEvent(event, eventId, eventEmojiId);
					});

					return {
						...page,
						data_community_spot: newScribbles,
					};
				}

				const newScribbles = (
					page as TypeGetFollowingScribblesForSpotResponse
				).data_following_spot.map((event) => {
					return removeEmojiToEvent(event, eventId, eventEmojiId);
				});

				return {
					...page,
					data_following_spot: newScribbles,
				};
			});

			return {
				...scribblesResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenAddEmojisInLikesForSpots = async ({
	queryKey,
	currentQueryClient,
	eventId,
	emojiCode,
	slug,
	spotId,
}: {
	queryKey: 'likesForSpot' | 'followingLikesForSpot';
	currentQueryClient: QueryClient;
	eventId: number;
	emojiCode: string;
	slug: string;
	spotId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, spotId],
		getUpdatedData: (old) => {
			const scribblesResponse = old as InfiniteData<any>;

			const newData = scribblesResponse.pages.map((page) => {
				if (queryKey === 'likesForSpot') {
					const newScribbles = (
						page as TypeGetLikesForSpotResponse
					).data_community_spot.map((event) => {
						return addEmojiToEvent(event, eventId, emojiCode, slug);
					});

					return {
						...page,
						data_community_spot: newScribbles,
					};
				}

				const newScribbles = (
					page as TypeGetFollowingScribblesForSpotResponse
				).data_following_spot.map((event) => {
					return addEmojiToEvent(event, eventId, emojiCode, slug);
				});

				return {
					...page,
					data_following_spot: newScribbles,
				};
			});

			return {
				...scribblesResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenRemoveEmojisInLikesForSpots = async ({
	queryKey,
	currentQueryClient,
	eventId,
	eventEmojiId,
	spotId,
}: {
	queryKey: 'likesForSpot' | 'followingLikesForSpot';
	currentQueryClient: QueryClient;
	eventId: number;
	eventEmojiId: number;
	spotId: number;
}) => {
	updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: [queryKey, spotId],
		getUpdatedData: (old) => {
			const scribblesResponse = old as InfiniteData<any>;

			const newData = scribblesResponse.pages.map((page) => {
				if (queryKey === 'likesForSpot') {
					const newScribbles = (
						page as TypeGetLikesForSpotResponse
					).data_community_spot.map((event) => {
						return removeEmojiToEvent(event, eventId, eventEmojiId);
					});

					return {
						...page,
						data_community_spot: newScribbles,
					};
				}

				const newScribbles = (
					page as TypeGetFollowingLikesForSpotResponse
				).data_following_spot.map((event) => {
					return removeEmojiToEvent(event, eventId, eventEmojiId);
				});

				return {
					...page,
					data_following_spot: newScribbles,
				};
			});

			return {
				...scribblesResponse,
				pages: newData,
			};
		},
	});
};

export const updateOptimisticWhenAddEmojis = async ({
	queryMutateDestination,
	currentQueryClient,
	currentUserId,
	eventId,
	emojiCode,
	slug,
	spotId,
}: {
	queryMutateDestination: TypeQueriesMutateDestination;
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
	emojiCode: string;
	slug: string;
	spotId?: number;
}) => {
	if (
		queryMutateDestination === 'feed' ||
		queryMutateDestination === 'followingFeed'
	) {
		return updateOptimisticWhenAddEmojisInFeed({
			queryKey: queryMutateDestination,
			currentQueryClient,
			currentUserId,
			eventId,
			emojiCode,
			slug,
		});
	}
	if (
		(queryMutateDestination === 'scribbles' ||
			queryMutateDestination === 'followingScribbles') &&
		spotId
	) {
		return updateOptimisticWhenAddEmojisInScribbleForSpot({
			queryKey: queryMutateDestination,
			currentQueryClient,
			eventId,
			emojiCode,
			slug,
			spotId,
		});
	}

	if (
		(queryMutateDestination === 'likesForSpot' ||
			queryMutateDestination === 'followingLikesForSpot') &&
		spotId
	) {
		return updateOptimisticWhenAddEmojisInLikesForSpots({
			queryKey: queryMutateDestination,
			currentQueryClient,
			eventId,
			emojiCode,
			slug,
			spotId,
		});
	}
};

export const updateOptimisticWhenRemoveEmojis = async ({
	queryMutateDestination,
	currentQueryClient,
	currentUserId,
	eventId,
	eventEmojiId,
	spotId,
}: {
	queryMutateDestination: TypeQueriesMutateDestination;
	currentQueryClient: QueryClient;
	currentUserId: number;
	eventId: number;
	eventEmojiId: number;
	spotId?: number;
}) => {
	if (
		queryMutateDestination === 'feed' ||
		queryMutateDestination === 'followingFeed'
	) {
		return updateOptimisticWhenRemoveEmojisInFeed({
			queryKey: queryMutateDestination,
			currentQueryClient,
			currentUserId,
			eventId,
			eventEmojiId,
		});
	}

	if (
		(queryMutateDestination === 'scribbles' ||
			queryMutateDestination === 'followingScribbles') &&
		spotId
	) {
		return updateOptimisticWhenRemoveEmojisInScribbleForSpot({
			queryKey: queryMutateDestination,
			currentQueryClient,
			eventId,
			eventEmojiId,
			spotId,
		});
	}

	if (
		(queryMutateDestination === 'likesForSpot' ||
			queryMutateDestination === 'followingLikesForSpot') &&
		spotId
	) {
		return updateOptimisticWhenRemoveEmojisInLikesForSpots({
			queryKey: queryMutateDestination,
			currentQueryClient,
			eventId,
			eventEmojiId,
			spotId,
		});
	}
};

export const onErrorOptimisticWhenAddOrRemoveEmojis = ({
	queryMutateDestination,
	currentQueryClient,
	context,
	currentUserId,
	spotId,
}: {
	queryMutateDestination: TypeQueriesMutateDestination;
	currentUserId: number;
	currentQueryClient: QueryClient;
	context:
		| void
		| {
				previousData: unknown;
		  }
		| undefined;
	spotId?: number;
}) => {
	if (
		queryMutateDestination === 'feed' ||
		queryMutateDestination === 'followingFeed'
	) {
		currentQueryClient.setQueryData(
			[queryMutateDestination, currentUserId],
			context?.previousData,
		);
	}

	if (
		(queryMutateDestination === 'scribbles' ||
			queryMutateDestination === 'followingScribbles') &&
		spotId
	) {
		currentQueryClient.invalidateQueries({
			queryKey: [queryMutateDestination, spotId],
		});
	}

	if (
		(queryMutateDestination === 'likesForSpot' ||
			queryMutateDestination === 'followingLikesForSpot') &&
		spotId
	) {
		currentQueryClient.invalidateQueries({
			queryKey: [queryMutateDestination, spotId],
		});
	}
};
